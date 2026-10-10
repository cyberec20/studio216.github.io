import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCHEMA,rules,dimensions,selectedRules,calculate} from '../assets/visual-quality-lab/rules.js';
import {HANDOFF_SCHEMA,enrichAssessment,buildAIMarkdown} from '../assets/visual-quality-lab/handoff.js';

const context={chart:'bar',subtype:'simple',components:[],task:'compare',purpose:'inform',medium:'slides',audience:'general',depth:'full'};
const selected=selectedRules(context);
assert(selected.length>=20);
const allCrit=selected.filter(r=>r.critical);
assert(allCrit.length>=1);
let assertions=0;
for(const lang of ['es','en']){
 const answers=Object.fromEntries(selected.map(r=>[r.id,2]));
 // Force >7 issues, including critical ones, N/A and unknown.
 for(const [i,r] of selected.entries()){
  if(i<10)answers[r.id]=0;
  else if(i<20)answers[r.id]=1;
  else if(i===20)answers[r.id]='ne';
  else if(i===21)answers[r.id]='na';
 }
 const critical=allCrit[0];
 answers[critical.id]=0;
 const score=calculate(context,answers);
 const base={schema:SCHEMA,assessment_id:'QAT-' + lang,created_at:'2026-10-10T12:00:00.000Z',
  language:lang,context,answers,result:{
   selected_count:score.selectedCount,answered_count:score.answered,
   not_applicable:score.na,not_evaluable:score.unknown,points_earned:score.score,
   points_possible_evaluated:score.max,observed_percentage:score.pct,coverage_percentage:score.coverage,
   critical_rule_ids:score.critical,critical_unverified_ids:score.criticalUnverified,by_dimension:score.byDimension
  }};
 const data=enrichAssessment(base,selected,dimensions,lang,{chart:lang==='es'?'Barras':'Bar charts',medium:lang==='es'?'Presentación':'Presentation'});
 const md=buildAIMarkdown(data);
 assert.equal(data.handoff_schema,HANDOFF_SCHEMA);
 assert.equal(data.assessment_id,base.assessment_id);
 assert.equal(data.created_at,base.created_at);
 assert.equal(data.criteria.length,score.selectedCount);
 assert(md.includes(base.assessment_id));
 assert(md.includes(critical.id));
 assert(md.includes(data.context_labels.chart));
 assert(md.includes('ChatGPT')===false); // Prompt itself is AI agnostic; the UI names external services.
 const issues=data.criteria.filter(c=>c.answer===0||c.answer===1);
 assert(issues.length>7);
 for(const c of issues)assert(md.includes(c.id+' — '+c.title),'Missing all issue: '+c.id);
 const unknown=data.criteria.filter(c=>c.answer==='ne');
 for(const c of unknown)assert(md.includes(c.title),'Unknown must not disappear');
 const excluded=data.criteria.filter(c=>c.answer==='na');
 for(const c of excluded)assert(md.includes(c.title),'N/A must not disappear');
 assert(md.includes(lang==='es'?'Criterios que requieren comprobación':'Criteria requiring verification'));
 assert(md.includes(lang==='es'?'Trabaja sobre una copia':'Work on a copy'));
 assert(md.includes(lang==='es'?'Studios216 NO recibió':'Studios216 did NOT receive'));
 assert(md.includes(lang==='es'?'Sin gráfico ni datos':'Without the chart')===false); // no UI text in MD
 assert(md.length>3000);
 assert(!md.includes('[object Object]'));
 const file=JSON.parse(JSON.stringify(data));
 assert.equal(file.criteria.find(c=>c.id===critical.id).critical,true);
 const scoreAgain=calculate(context,answers);
 assert.equal(scoreAgain.pct,score.pct);
 assertions+=18+issues.length+unknown.length+excluded.length;
 // All-meets scenario cannot fabricate problems.
 const cleanAnswers=Object.fromEntries(selected.map(r=>[r.id,2]));
 const cleanScore=calculate(context,cleanAnswers);
 const clean=enrichAssessment({...base,answers:cleanAnswers,result:{...base.result,selected_count:cleanScore.selectedCount,critical_rule_ids:[],not_applicable:0,not_evaluable:0}},selected,dimensions,lang,{chart:'bar'});
 const cleanMd=buildAIMarkdown(clean);
 assert(cleanMd.includes(lang==='es'?'No se declararon problemas':'No partial or unmet criteria'));
 assert.equal((cleanMd.match(/^### /gm)||[]).length,0);
 assertions+=2;
}
const dir='file';
assert.throws(()=>buildAIMarkdown({language:'en'}),/handoff/);
assert.throws(()=>enrichAssessment({language:'es'},selected,dimensions,'es',{}),/identity/);
const app=readFileSync(new URL('../assets/visual-quality-lab/app.js',import.meta.url),'utf8');
for(const phrase of ['Convierte tu diagnóstico en mejoras reales','ChatGPT, Claude, Gemini','Turn your assessment into real improvements','external','buildAIMarkdown(reportPayload())']){
 assert(app.includes(phrase),phrase);
}
assert(app.includes("option('md'")&&app.includes("option('json'")&&app.includes("option('pdf'")&&app.includes("option('txt'"));
console.log('PASS bilingual external AI handoff: 2 locales, all issue counts, pending/N-A/critical flags, stable identity and four downloads; '+assertions+' semantic assertions.');
