import {SCHEMA, dimensions, rules, CHARTS, TASKS, SUBTYPES, DASH_COMPONENTS, compatibility, applies, selectedRules, groupQuestions, calculate} from './rules.js';
const $=id=>document.getElementById(id);
const STORAGE='studios216.visual-quality-lab.public.v0.3';
const i18n={
 es:{title:'¿Qué necesita mejorar tu gráfico?',intro:'Evalúa la comunicación visual, identifica riesgos y convierte tus respuestas en un plan de mejora. Sin registro y sin enviar tus datos.',start:'Configura tu evaluación',task:'¿Qué quieres mostrar con los datos?',purpose:'¿Qué deseas lograr al comunicarlo?',subtype:'Tipo de gráfico',components:'Gráficos que contiene el dashboard',depth:'Profundidad',chart:'¿Qué formato estás evaluando?',medium:'¿Dónde se utilizará?',audience:'¿Quién lo consultará?',begin:'Comenzar evaluación →',phase:'AUTOEVALUACIÓN',step:'Paso',of:'de',progress:'Avance del cuestionario',back:'← Anterior',next:'Siguiente →',results:'Ver diagnóstico →',tip:'¿Por qué importa? ¿Qué puedo mejorar?',yes:'Cumple',partial:'Parcial',no:'No cumple',na:'No aplica',ne:'No sé evaluarlo',critical:'Revisión importante',unanswered:'Responde todos los criterios para continuar. Usa «No puedo evaluarlo» cuando no tengas información.',save:'Guardar en este navegador',saved:'Borrador guardado solamente en este navegador.',restore:'Recuperar borrador guardado',reset:'Reiniciar',resetConfirm:'¿Quieres eliminar esta evaluación y el borrador guardado?',report:'Tu diagnóstico de mejora',reportIntro:'Autoevaluación orientativa de lo que has observado; no es una inspección automática del gráfico.',score:'Cumplimiento observado',coverage:'Cobertura evaluada',risk:'Riesgos críticos',unverified:'Aspectos críticos sin verificar',none:'Sin evidencia suficiente',noneRisk:'Ninguno marcado',barTitle:'Resultados por dimensión',needs:'Prioridades de mejora',noIssues:'No se marcaron mejoras en los criterios evaluados.',severe:'Hay un problema crítico que conviene corregir antes de publicar o decidir.',unknown:'Algunos criterios no pudieron evaluarse. El porcentaje resume solo los criterios puntuados.',naNote:'N/A se excluye del cálculo; «No puedo evaluarlo» queda pendiente y reduce cobertura.',json:'Descargar JSON',txt:'Descargar plan TXT',pdf:'Imprimir / Guardar PDF',again:'Nueva evaluación',note:'Las respuestas no se envían a ningún servidor.',author:'Conocer al autor →',course:'Explorar curso →',headArticles:'Artículos',headProducts:'Productos',headAbout:'Acerca de',choiceLabel:'Elegiste',testOnly:'Autoevaluación gratuita. Tus respuestas permanecen en tu navegador; no se envían a nuestros servidores.',needMore:'Realiza la evaluación antes de calcular resultados.',downloadDetails:'Se guardarán la configuración, respuestas y puntuaciones, sin información personal.',dimensions:'dimensiones',criteria:'criterios aplicables',groupNote:'Una pantalla puede reunir criterios de varias dimensiones; sus resultados seguirán separados.',groupCount:'preguntas de esta pantalla',compat:'Revisa la relación entre tu objetivo y el gráfico elegido. No significa que sea incorrecto.',alt:'Alternativas que podrías comparar',matched:'Combinación orientativa apropiada',componentHint:'Selecciona solamente los gráficos que contiene tu dashboard. No suponemos que haya barras, pastel o líneas.',why:'Qué riesgo evita',verify:'Cómo comprobar la mejora',action:'Acción propuesta',taskMismatch:'Alternativas para explorar',scope:'Las preguntas se ajustan al gráfico, la tarea analítica y el medio. Esta es una autoevaluación, no inspección automática.'},
 en:{title:'What could improve your visualization?',intro:'Assess visual communication, identify risks and turn your answers into a practical improvement plan. No account and no data sent.',start:'Set up your assessment',task:'What do you want to show with the data?',purpose:'What do you want to achieve by communicating it?',subtype:'Chart subtype',components:'Dashboard components',depth:'Assessment depth',chart:'Which format are you assessing?',medium:'Where will it be used?',audience:'Who is the intended audience?',begin:'Start assessment →',phase:'SELF-ASSESSMENT',step:'Step',of:'of',progress:'Questionnaire completion',back:'← Previous',next:'Next →',results:'View report →',tip:'Why does it matter? What could improve?',yes:'Meets',partial:'Partly',no:'Does not meet',na:'Not applicable',ne:'Cannot assess',critical:'Important review',unanswered:'Answer each applicable criterion to continue. Choose “Cannot assess” if you lack information.',save:'Save in this browser',saved:'Draft saved only in this browser.',restore:'Restore saved draft',reset:'Start over',resetConfirm:'Delete this assessment and its saved draft?',report:'Your improvement report',reportIntro:'An indicative self-assessment based on what you observed, not an automated visual inspection.',score:'Observed compliance',coverage:'Assessed coverage',risk:'Critical risks',unverified:'Unverified critical criteria',none:'Insufficient evidence',noneRisk:'None flagged',barTitle:'Scores by dimension',needs:'Top improvement priorities',noIssues:'No improvements were flagged in scored criteria.',severe:'A critical issue was identified; address it before using the chart for decisions.',unknown:'Some criteria could not be assessed. The percentage describes scored criteria only.',naNote:'N/A is excluded; “Cannot assess” remains pending and lowers coverage.',json:'Download JSON',txt:'Download TXT plan',pdf:'Print / Save PDF',again:'Start a new assessment',note:'Your answers are not sent to a server.',author:'About the author →',course:'Explore course →',headArticles:'Articles',headProducts:'Products',headAbout:'About',choiceLabel:'Selected',testOnly:'Free self-assessment. Answers remain in your browser and are not sent to our servers.',needMore:'Complete the questionnaire before scoring.',downloadDetails:'Your settings, answers, and scores will be saved without personal details.',dimensions:'dimensions',criteria:'applicable criteria',groupNote:'One screen may include several dimensions; their results remain distinct.',groupCount:'questions on this screen',compat:'Check the fit between your goal and the chart. This does not automatically make it wrong.',alt:'Alternatives worth comparing',matched:'Plausible chart–task fit',componentHint:'Select only the charts your dashboard actually contains. We do not assume it has bars, pies or lines.',why:'What can go wrong',verify:'How to verify the improvement',action:'Suggested action',taskMismatch:'Alternatives to explore',scope:'Questions adapt to your chart, analysis task, and medium. This is self-assessment, not automated visual inspection.'}
};
const options={
 depth:[['quick','Esencial · más breve','Essentials · shorter'],['full','Completo · más detallado','Full · more detailed']],
 chart:[['bar','Barras','Bar charts'],['line','Líneas / tendencias','Line / time series'],['pie','Pastel / dona','Pie / donut'],['scatter','Dispersión / relaciones','Scatter / relationships'],['histogram','Histograma','Histogram'],['waterfall','Cascada / waterfall','Waterfall'],['heatmap','Mapa de calor','Heatmap'],['slope','Cambio entre dos momentos','Slopegraph'],['table','Tabla de valores','Table of values'],['dashboard','Dashboard','Dashboard']],
 task:[['compare','Comparar cantidades / categorías','Compare quantities / categories'],['trend','Mostrar cambios en el tiempo','Show a time trend'],['composition','Explicar partes de un total','Explain parts of a whole'],['relationship','Explorar relación entre variables','Explore variable relationships'],['distribution','Analizar una distribución','Analyze a distribution'],['change','Explicar cambios acumulados','Explain cumulative changes'],['exact','Consultar valores precisos','Look up exact values']],
 purpose:[['explore','Explorar patrones','Explore patterns'],['inform','Explicar un hallazgo','Explain an insight'],['persuade','Respaldar una decisión','Support a decision']],
 medium:[['slides','Presentación','Presentation'],['report','Informe / documento','Report / document'],['web','Web / interactivo','Web / interactive']],
 audience:[['general','Público general','General audience'],['technical','Equipo técnico','Technical team'],['executive','Dirección / gerencia','Executives / management']]
};
const state={lang:document.body.dataset.initialLang==='en'?'en':'es',phase:'setup',step:0,context:{chart:'bar',subtype:'simple',components:[],task:'compare',purpose:'inform',medium:'slides',audience:'general',depth:'quick'},answers:{}};
const t=k=>i18n[state.lang][k]||k;
const valLabel=(field,v)=>{const x=(options[field]||[]).find(o=>o[0]===v);return x?(state.lang==='es'?x[1]:x[2]):v};
const activeDimensions=()=>dimensions.filter(d=>selectedRules(state.context).some(q=>q.dimension===d.id));
const dimById=Object.fromEntries(dimensions.map(d=>[d.id,d]));
function textStatic(){document.documentElement.lang=state.lang;$('main-title').textContent=t('title');$('intro').textContent=t('intro');$('header-articles').textContent=t('headArticles');$('header-products').textContent=t('headProducts');$('header-about').textContent=t('headAbout');$('header-articles').href=state.lang==='es'?'/articles/es/':'/articles/en/';$('rail-articles').href=$('header-articles').href;$('author-link').textContent=t('author');$('course-tvd').href=state.lang==='es'?'/tecnicas-visualizacion-datos/es/':'/tecnicas-visualizacion-datos/';$('course-scd').href=state.lang==='es'?'/storytelling-con-datos/es/':'/storytelling-con-datos/';document.title=(state.lang==='es'?'Evalúa tu visualización':'Assess your visualization')+' | Studios216';
 const bits={
 'skip':['Ir a la evaluación','Skip to assessment'],
 'rail-author':['AUTOR','AUTHOR'],'rail-course':['CURSO RELACIONADO','RELATED COURSE'],
 'rail-next':['SIGUIENTE PASO','NEXT STEP'],'rail-deeper':['PROFUNDIZA','EXPLORE MORE'],
 'rail-description':['Aprende a elegir, revisar y mejorar gráficos.','Learn to choose, review and improve charts.'],
 'rail-story-description':['Convierte resultados en explicaciones convincentes.','Turn findings into compelling explanations.'],
 'rail-notice':['Los recursos complementan la evaluación gratuita.','Resources complement the free assessment.'],
 'rail-data-title':['Técnicas de Visualización de Datos','Data Visualization Techniques'],
 'rail-story-title':['Storytelling con datos','Storytelling with Data'],
 'rail-course-cta':['Explorar curso →','Explore course →'],
 'rail-articles-title':['Otros artículos sobre datos e ingeniería','More articles on data and engineering'],
 'rail-article-text':['Ejemplos y análisis para profundizar.','Examples and deeper analysis.'],
 'footer-notice':['Autoevaluación educativa orientativa, no inspección automática ni certificación técnica.','Educational self-assessment, not automatic visual inspection or technical certification.'],
 'privacy-label':['Privacidad','Privacy']
 };
 document.querySelectorAll('[data-localize]').forEach(e=>{let pair=bits[e.dataset.localize];if(pair)e.textContent=pair[state.lang==='es'?0:1];});
 for(const [id,alts,labels] of [
  ['course-tvd',['Portada del curso Técnicas de Visualización de Datos','Técnicas de Visualización de Datos course cover'],['Técnicas de Visualización de Datos','Data Visualization Techniques']],
  ['course-scd',['Portada del curso Storytelling con datos','Storytelling con datos course cover'],['Storytelling con datos','Storytelling with Data']]
 ]){
   const node=$(id),langIndex=state.lang==='es'?0:1;
   node.querySelector('img').alt=alts[langIndex];
   node.setAttribute('aria-label',labels[langIndex]);
   node.dataset.analyticsDestination=node.getAttribute('href');
 }
 $('head-tools').textContent=state.lang==='es'?'Herramientas':'Tools';
 $('head-tools').href='/tools/';
 $('site-nav').setAttribute('aria-label',state.lang==='es'?'Navegación principal':'Main navigation');
 $('rail-article-1').href=state.lang==='es'?'/articles/es/de-excel-a-wattswise-en-216-horas/':'/articles/en/from-spreadsheets-to-wattswise-in-216-hours/';
 $('rail-article-2').href=state.lang==='es'?'/articles/es/triangulo-de-potencia-bidireccional/':'/articles/en/bidirectional-power-triangle/';
}
function button(label,id,primary=false){return `<button class="btn${primary?' primary':''}" id="${id}" type="button">${label}</button>`;}
function navBar(title,phase,current,total,pct){$('section-title').textContent=title;$('phase-label').textContent=phase;$('step-count').textContent=`${t('step')} ${current} ${t('of')} ${total}`;$('progress-label').textContent=t('progress');$('progress-percent').textContent=`${pct}%`;$('progress-bar').style.width=`${pct}%`;}
function chartLabel(value){const found=options.chart.find(x=>x[0]===value);return found?found[state.lang==='es'?1:2]:value;}
const subtypeLabels={
 simple:['Barras simples','Simple bars'],grouped:['Barras agrupadas','Grouped bars'],stacked:['Barras apiladas','Stacked bars'],stacked100:['Apiladas al 100 %','100% stacked'],
 basic:['Serie observada','Observed series'],forecast:['Incluye pronóstico','Includes forecast'],pie:['Pastel','Pie'],donut:['Dona','Donut'],scatter:['Puntos','Points'],bubble:['Burbujas','Bubble chart']
};
function renderSetup(){
 navBar(t('start'),'STUDIOS216 · VISUAL QUALITY LAB',1,1,0);
 const renderSelect=key=>`<div class="field"><label for="${key}">${t(key)}</label><select id="${key}">${options[key].map(x=>`<option value="${x[0]}"${state.context[key]===x[0]?' selected':''}>${state.lang==='es'?x[1]:x[2]}</option>`).join('')}</select></div>`;
 $('screen').innerHTML=`<p class="screen-intro">${t('scope')}</p>${renderSelect('chart')}<div id="chart-details"></div>${['task','purpose','medium','audience','depth'].map(renderSelect).join('')}<div id="context-advice"></div><div class="notice">${t('testOnly')}</div><div class="small-actions" id="restore-actions"></div>`;
 function renderDependent(){
   const chart=state.context.chart;
   const choices=SUBTYPES[chart]||[];
   if(choices.length){
     if(!choices.includes(state.context.subtype))state.context.subtype=choices[0];
     $('chart-details').innerHTML=`<div class="field"><label for="subtype">${t('subtype')}</label><select id="subtype">${choices.map(x=>`<option value="${x}"${state.context.subtype===x?' selected':''}>${subtypeLabels[x][state.lang==='es'?0:1]}</option>`).join('')}</select></div>`;
     $('subtype').addEventListener('change',e=>{state.context.subtype=e.target.value;state.answers={};renderAdvisory();});
   } else if(chart==='dashboard'){
     $('chart-details').innerHTML=`<fieldset class="components"><legend>${t('components')}</legend><p class="hint">${t('componentHint')}</p><div class="component-grid">${DASH_COMPONENTS.map(c=>`<label class="component-option"><input type="checkbox" value="${c}" ${state.context.components.includes(c)?'checked':''}><span>${chartLabel(c)}</span></label>`).join('')}</div></fieldset>`;
     $('chart-details').querySelectorAll('input[type="checkbox"]').forEach(box=>box.addEventListener('change',()=>{
       state.context.components=Array.from($('chart-details').querySelectorAll('input:checked')).map(input=>input.value);
       state.answers={};renderAdvisory();
     }));
   } else $('chart-details').innerHTML='';
   renderAdvisory();
 }
 function renderAdvisory(){
   const mismatch=compatibility(state.context);
   $('context-advice').innerHTML=mismatch?`<div class="advice" role="note"><strong>${t('compat')}</strong><p>${t('alt')}: ${mismatch.alternatives.map(chartLabel).join(' · ')}</p></div>`:'';
 }
 for(const key of Object.keys(options)){$(key).addEventListener('change',e=>{
   state.context[key]=e.target.value;
   state.answers={};
   if(key==='chart')renderDependent();else renderAdvisory();
 });}
 renderDependent();
 const saved=readDraft();if(saved){$('restore-actions').innerHTML=button(t('restore'),'restore');$('restore').addEventListener('click',()=>{Object.assign(state,saved);render();});}
 $('actions').innerHTML=`<span></span>${button(t('begin'),'next',true)}`;
 $('next').addEventListener('click',()=>{
   if(state.context.chart==='dashboard'&&!state.context.components.length){
     $('context-advice').innerHTML=`<div class="alert" role="alert">${state.lang==='es'?'Selecciona al menos un componente.':'Choose at least one dashboard component.'}</div>`;return;
   }
   state.phase='questions';state.step=0;render();
 });
}

function renderQuestions(){
 const groups=groupQuestions(state.context);
 if(!groups.length){state.phase='setup';render();return;}
 state.step=Math.min(Math.max(state.step,0),groups.length-1);
 const questions=groups[state.step];
 const calc=calculate(state.context,state.answers);
 const progress=Math.round(calc.answered/calc.selectedCount*100);
 const startDim=dimById[questions[0].dimension].title[state.lang];
 const endDim=dimById[questions[questions.length-1].dimension].title[state.lang];
 const heading=startDim===endDim?startDim:`${startDim} · ${endDim}`;
 navBar(heading,t('phase'),state.step+1,groups.length,progress);
 const vals=[[2,t('yes'),''],[1,t('partial'),''],[0,t('no'),'low'],['na',t('na'),'na'],['ne',t('ne'),'ne']];
 let lastDim='';
 const cards=questions.map(q=>{
   const showDim=q.dimension!==lastDim;
   lastDim=q.dimension;
   const part=showDim?`<div class="dimension-caption"><span>${dimById[q.dimension].title[state.lang]}</span></div>`:'';
   return `${part}<article class="question" data-question="${q.id}"><div class="question-top"><h3>${q.title[state.lang]}</h3><span class="question-id">${q.id}</span></div>${q.critical?`<div class="critical">⚑ ${t('critical')}</div>`:''}<div class="choices" role="group" aria-label="${q.id}">${vals.map(([v,label,cls])=>`<button type="button" class="choice ${cls}" data-answer="${q.id}" data-value="${v}" aria-pressed="${state.answers[q.id]===v}" ${v==='ne'?`title="${state.lang==='es'?'No puedo evaluarlo':'I cannot assess this'}"`:''}>${label}</button>`).join('')}</div><details class="help"><summary>${t('tip')}</summary>${q.problem?`<p><strong>${t('why')}:</strong> ${q.problem[state.lang]}</p>`:''}<p><strong>${t('action')}:</strong> ${q.tip[state.lang]}</p>${q.verify?`<p><strong>${t('verify')}:</strong> ${q.verify[state.lang]}</p>`:''}</details></article>`;
 }).join('');
 $('screen').innerHTML=`<p class="screen-intro compact-intro"><strong>${questions.length} ${t('groupCount')}</strong> · ${state.lang==='es'?'Responde según tu gráfico real.':'Answer using the chart you actually have.'} <span class="group-note">${t('groupNote')}</span></p>${cards}<div id="feedback" aria-live="polite"></div><div class="notice">${t('naNote')}</div>`;
 $('screen').querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
   let v=b.dataset.value;
   v=['0','1','2'].includes(v)?Number(v):v;
   state.answers[b.dataset.answer]=v;
   const parent=b.closest('.question');
   parent.querySelectorAll('[data-answer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
   const pct=Math.round(calculate(state.context,state.answers).answered/calc.selectedCount*100);
   $('progress-percent').textContent=`${pct}%`;
   $('progress-bar').style.width=`${pct}%`;
   $('feedback').innerHTML='';
 }));
 $('actions').innerHTML=`${button(t('back'),'back')}<div class="small-actions">${button(t('save'),'save')}${button(state.step===groups.length-1?t('results'):t('next'),'next',true)}</div>`;
 $('back').addEventListener('click',()=>{
   if(state.step===0)state.phase='setup';
   else state.step--;
   render();
 });
 $('save').addEventListener('click',()=>{
   try{
     localStorage.setItem(STORAGE,JSON.stringify({schema:SCHEMA,lang:state.lang,phase:state.phase,step:state.step,context:state.context,answers:state.answers}));
     $('feedback').innerHTML=`<div class="notice">${t('saved')}</div>`;
   }catch(_){$('feedback').innerHTML='<div class="alert">Storage unavailable / Almacenamiento no disponible.</div>';}
 });
 $('next').addEventListener('click',()=>{
   if(!questions.every(q=>Object.hasOwn(state.answers,q.id))){
     $('feedback').innerHTML=`<div class="alert" role="alert">${t('unanswered')}</div>`;
     $('feedback').scrollIntoView({behavior:'smooth',block:'nearest'});
     return;
   }
   if(state.step===groups.length-1)state.phase='results';
   else state.step++;
   render();
 });
}

function fmt(v){return v===null?t('none'):`${v}%`;}
function reportPayload(){const result=calculate(state.context,state.answers);return {schema:SCHEMA,created_at:new Date().toISOString(),language:state.lang,context:{...state.context,components:[...state.context.components]},chart_task_advisory:compatibility(state.context),answers:{...state.answers},result:{selected_count:result.selectedCount,answered_count:result.answered,not_applicable:result.na,not_evaluable:result.unknown,points_earned:result.score,points_possible_evaluated:result.max,observed_percentage:result.pct,coverage_percentage:result.coverage,critical_rule_ids:result.critical,critical_unverified_ids:result.criticalUnverified,by_dimension:result.byDimension},disclaimer:'Self-assessment using pilot rules, not an independent visual verification or measured effectiveness.'};}
function renderResults(){const res=calculate(state.context,state.answers);if(res.remaining){state.phase='questions';state.step=0;render();return;}
navBar(t('report'),'STUDIOS216 · DATA QUALITY REPORT',groupQuestions(state.context).length,groupQuestions(state.context).length,100);
const scoreLabel=res.pct===null?t('none'):fmt(res.pct);let top=res.recommendations.slice(0,7);
let rows=dimensions.map(d=>{const x=res.byDimension[d.id];if(x.answered===0)return '';const val=x.total?Math.round(x.scored/x.total*100):null;return `<div class="dimension-row"><span>${d.title[state.lang]}</span><div class="scorebar"><span style="width:${val??0}%"></span></div><strong>${fmt(val)}</strong></div>`;}).join('');
let recs=top.map(a=>`<article class="finding"><p class="key">${a.critical?'⚑ '+t('critical')+' · ':''}${a.id}</p><h4>${a.rule.title[state.lang]}</h4>${a.rule.problem?`<p><strong>${t('why')}:</strong> ${a.rule.problem[state.lang]}</p>`:''}<p><strong>${t('action')}:</strong> ${a.rule.tip[state.lang]}</p>${a.rule.verify?`<p><strong>${t('verify')}:</strong> ${a.rule.verify[state.lang]}</p>`:''}</article>`).join('')||`<p class="muted">${t('noIssues')}</p>`;
$('screen').innerHTML=`<div class="report-content"><div class="report-only"><h1 class="report-print-title">Studios216 — ${t('report')}</h1><p>${t('reportIntro')}</p></div><p class="screen-intro">${t('reportIntro')}</p><div class="stats"><div class="stat"><strong>${scoreLabel}</strong><span>${t('score')}</span></div><div class="stat"><strong>${fmt(res.coverage)}</strong><span>${t('coverage')}</span></div><div class="stat"><strong>${res.critical.length}</strong><span>${t('risk')}</span></div></div>${res.critical.length?`<div class="alert">${t('severe')} (${res.critical.join(', ')})</div>`:''}${res.unknown?`<div class="notice">${t('unknown')}</div>`:''}${res.criticalUnverified.length?`<div class="alert">${t('unverified')}: ${res.criticalUnverified.join(', ')}.</div>`:''}${compatibility(state.context)?`<div class="advice"><strong>${t('taskMismatch')}</strong><p>${compatibility(state.context).alternatives.map(chartLabel).join(' · ')}</p></div>`:''}<h3 class="result-title">${t('barTitle')}</h3>${rows}<h3 class="result-title">${t('needs')}</h3>${recs}<div class="notice">${t('naNote')}<br>${t('downloadDetails')}</div></div>`;
$('actions').innerHTML=`<div class="small-actions">${button(t('json'),'json')}${button(t('txt'),'txt')}${button(t('pdf'),'pdf')}</div>${button(t('again'),'reset')}`;
$('json').addEventListener('click',()=>download('studios216-visual-diagnostic.json',JSON.stringify(reportPayload(),null,2),'application/json'));
$('txt').addEventListener('click',()=>{const result=reportPayload();let lines=[`STUDIOS216 — ${t('report')}`,`${t('score')}: ${scoreLabel}`,`${t('coverage')}: ${fmt(res.coverage)}`,`${t('risk')}: ${res.critical.length}`,`${t('unverified')}: ${res.criticalUnverified.length}`,`${t('naNote')}`,'',t('needs'),...top.map((a,i)=>`${i+1}. [${a.id}] ${a.rule.title[state.lang]} — ${t('action')}: ${a.rule.tip[state.lang]}${a.rule.verify?' — '+t('verify')+': '+a.rule.verify[state.lang]:''}`),'',JSON.stringify(result.context,null,2)];download('studios216-improvement-plan.txt',lines.join('\n'),'text/plain');});
$('pdf').addEventListener('click',()=>window.print());$('reset').addEventListener('click',()=>{if(window.confirm(t('resetConfirm'))){try{localStorage.removeItem(STORAGE);}catch(_){}state.phase='setup';state.step=0;state.answers={};render();}});}
function download(name,content,mime){const blob=new Blob([content],{type:mime+';charset=utf-8'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);}
function readDraft(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(!x||x.schema!==SCHEMA||!['es','en'].includes(x.lang)||!['setup','questions','results'].includes(x.phase))return null;if(!x.context||!Object.keys(options).every(k=>options[k].some(o=>o[0]===x.context[k])))return null;if(!Array.isArray(x.context.components)||x.context.components.some(c=>!DASH_COMPONENTS.includes(c)))return null;if(!x.context.subtype||typeof x.context.subtype!=='string')return null;if(!x.answers||Object.values(x.answers).some(v=>![0,1,2,'na','ne'].includes(v)))return null;return {lang:x.lang,phase:x.phase,step:Number.isInteger(x.step)?x.step:0,context:x.context,answers:x.answers};}catch(_){return null;}}
function render(){textStatic();document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===state.lang)));if(state.phase==='setup')renderSetup();else if(state.phase==='results')renderResults();else renderQuestions();}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{if(state.lang!==b.dataset.lang){state.lang=b.dataset.lang;render();}}));
render();
