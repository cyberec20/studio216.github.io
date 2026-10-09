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
