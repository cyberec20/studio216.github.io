import assert from 'node:assert/strict';
import {rules,dimensions,selectedRules,groupQuestions,calculate,CHARTS,TASKS} from '../assets/visual-quality-lab/rules.js';
assert.equal(rules.length,56);
assert.equal(dimensions.length,8);
assert.equal(CHARTS.length,10);
assert.equal(TASKS.length,7);
const unique=new Set(rules.map(r=>r.id)); assert.equal(unique.size,56);
let n=0;
for(const chart of CHARTS)for(const task of TASKS)for(const medium of ['web','report','slides'])for(const depth of ['quick','full']){
 const ctx={chart,task,medium,depth,purpose:'inform',audience:'general',subtype:'simple',components:chart==='dashboard'?['table','heatmap']:[]};
 const selected=selectedRules(ctx); assert(selected.length>0&&selected.length<=(depth==='quick'?22:34));
 const groups=groupQuestions(ctx); assert.equal(groups.flat().length,selected.length);
 assert(groups.every(g=>g.length<=6));
 const answers=Object.fromEntries(selected.map(r=>[r.id,2]));
 const score=calculate(ctx,answers);assert.equal(score.remaining,0);assert.equal(score.pct,100);
 assert.equal(score.selectedCount,selected.length);
 n++;
}
assert.equal(n,420);
const ctx={chart:'bar',task:'compare',medium:'slides',depth:'quick',purpose:'inform',audience:'general',subtype:'simple',components:[]};
const active=selectedRules(ctx); const answers=Object.fromEntries(active.map(r=>[r.id,2]));
const firstCritical=active.find(r=>r.critical);assert(firstCritical);
answers[firstCritical.id]=0;const rated=calculate(ctx,answers);
assert(rated.critical.includes(firstCritical.id));assert(rated.pct<100);
console.log('PASS: 56/56 unique rules, 8 dimensions, 420/420 context combinations, score and critical gates.');

import {readFileSync,existsSync} from 'node:fs';
const relatedCoursesForLab=[
 {id:'course-tvd',image:'/assets/products/tecnicas-visualizacion-datos.png',es:'/tecnicas-visualizacion-datos/es/',en:'/tecnicas-visualizacion-datos/'},
 {id:'course-scd',image:'/assets/products/storytelling-con-datos.jpg',es:'/storytelling-con-datos/es/',en:'/storytelling-con-datos/'}
];
for(const [locale,path] of [['es','es/herramientas/visualizacion-datos/index.html'],['en','tools/data-visualization/checklist/index.html']]){
 const source=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 for(const card of relatedCoursesForLab){
  const pattern=new RegExp('<a\\b[^>]*id="'+card.id+'"[^>]*>[\\s\\S]*?<\\/a>','g');
  const found=[...source.matchAll(pattern)];assert.equal(found.length,1,locale+' '+card.id);
  const body=found[0][0];
  assert(body.includes('article-product-promo__image'));
  assert(body.includes('src="'+card.image+'"'));
  assert(body.includes('alt="')&&body.includes('loading="lazy"'));
  assert(body.includes('data-analytics-impression="product_impression"'));
  assert(body.includes('data-analytics-destination="'+card[locale]+'"'));
  assert(existsSync(new URL('..'+card.image,import.meta.url)),card.image);
 }
}
console.log('PASS: course promotion images and localized metadata (4 cards).');

const localizedArticleTitlesForLab=[
 ['rail-articles','Artículos de Studios216 →','Studios216 articles →'],
 ['rail-article-1','De Excel a WattsWise →','From Spreadsheets to WattsWise →'],
 ['rail-article-2','Triángulo de potencia →','Bidirectional Power Triangle →']
];
const localizeAppSource=readFileSync(new URL('../assets/visual-quality-lab/app.js',import.meta.url),'utf8');
for(const [locale,file] of [['es','es/herramientas/visualizacion-datos/index.html'],['en','tools/data-visualization/checklist/index.html']]){
 const markup=readFileSync(new URL('../'+file,import.meta.url),'utf8');
 for(const [id,es,en] of localizedArticleTitlesForLab){
  const label=locale==='es'?es:en;
  assert(markup.includes('data-localize="'+id+'"'),locale+' missing localization: '+id);
  assert(markup.includes('>'+label+'</a>'),locale+' wrong article title: '+id);
  assert(localizeAppSource.includes("'"+id+"':['"+es+"','"+en+"']"),'translation missing: '+id);
 }
}
console.log('PASS: three article-rail links have ES/EN initial and dynamic labels.');
