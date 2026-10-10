/* Studios216 Visual Quality Lab: external AI handoff, standalone bilingual export.
 * Pure functions. No network calls, no automatic editing, no uploads.
 */
export const HANDOFF_SCHEMA='studios216.visual-quality-lab.handoff.0.4.0';
const dict={
 es:{
 heading:'Plan de mejora de visualización con IA externa',
 intro:'AUTOEVALUACIÓN del usuario; NO constituye inspección automática ni verificación independiente del gráfico o los datos.',
 goal:'Objetivo para la IA',goalText:'Ayúdame a mejorar la comunicación visual del gráfico o dashboard a partir de estas respuestas. Son observaciones del usuario, no fallas comprobadas por ti.',
 files:'Archivos para trabajar',filesText:'Este Markdown es autosuficiente. El JSON de la evaluación aporta las respuestas estructuradas; ambos comparten el mismo ID. Para corregir directamente el diseño, adjuntaré a la IA externa el gráfico, los datos o el archivo editable si corresponde. Studios216 NO recibió ese archivo.',
 context:'Contexto y resultados',issues:'Hallazgos y acciones (todos, sin recortes)',issuesNone:'No se declararon problemas parciales o incumplidos. No inventes defectos.',
 pending:'Criterios que requieren comprobación',pendingNone:'No se registraron respuestas «No puedo evaluarlo».',passed:'Criterios declarados cumplidos',na:'Criterios no aplicables',
 steps:'Instrucciones operativas para la IA',privacy:'Privacidad y límites',
 privacyText:'La IA elegida es EXTERNA a Studios216. No compartas información personal, sensible o confidencial sin autorización. No digas que corregiste un gráfico o archivo sin comprobarlo.',
 info:'Si faltan el gráfico, los datos o el archivo editable, pide el material necesario antes de declarar correcciones realizadas.',
 labels:{id:'ID',date:'Fecha',language:'Idioma',chart:'Gráfico',subtype:'Subtipo',task:'Tarea',purpose:'Objetivo comunicativo',medium:'Medio',audience:'Audiencia',depth:'Profundidad',components:'Componentes del dashboard',score:'Cumplimiento observado',coverage:'Cobertura evaluada',critical:'Incumplimientos críticos',pending:'Críticos sin verificar',na:'No aplicables',dimension:'Dimensión',answer:'Respuesta',problem:'Posible riesgo',action:'Acción correctiva',verify:'Cómo verificar',flag:'CRÍTICO'},
 responses:{0:'No cumple',1:'Parcialmente',2:'Cumple',na:'No aplica',ne:'No puedo evaluarlo'},
 instructions:[
  'Inspecciona el material original si se adjuntó; de lo contrario orienta sin afirmar que has modificado el gráfico. Solicita el original cuando haga falta.',
  'Confirma la herramienta usada (Excel, Power BI, PowerPoint, Python, web u otra), el objetivo del gráfico y el formato de salida esperado.',
  'Prioriza los riesgos de integridad y los hallazgos críticos. Distingue observaciones autodeclaradas de fallos que has verificado.',
  'Conserva valores, series, fórmulas, cálculos, unidades, fuentes, vínculos, filtros, macros, medidas e interacciones existentes. Si la representación visual distorsiona datos, corrige la representación sin inventar información.',
  'Trabaja sobre una copia. Pide autorización antes de cambios destructivos o irreversibles.',
  'Para cada hallazgo, explica la corrección propuesta o realizada, su justificación y cómo validarla. No inventes resultados ni evidencias.',
  'Cuando puedas editar el archivo, entrega una copia revisada junto con pruebas de integridad y funcionalidad; si no puedes, da instrucciones reproducibles sin simular una edición.',
  'Resume cambios, pendientes y limitaciones. Sugiere repetir la autoevaluación para comparar antes/después.'
 ]
 },
 en:{
 heading:'External AI visualization improvement plan',
 intro:'USER SELF-ASSESSMENT; NOT an automatic visual inspection or independent verification of the chart or its data.',
 goal:'Objective for the AI',goalText:'Help me improve the visual communication of this chart or dashboard using these answers. They are user observations, not defects you have independently confirmed.',
 files:'Files to use',filesText:'This Markdown is self-contained. The assessment JSON provides structured responses; both share the same ID. To make direct edits, I may attach the original chart, dataset, or editable file to an EXTERNAL AI. Studios216 did NOT receive that file.',
 context:'Context and results',issues:'Findings and actions (all, no truncation)',issuesNone:'No partial or unmet criteria were reported. Do not invent defects.',
 pending:'Criteria requiring verification',pendingNone:'No “Cannot assess” answers were selected.',passed:'Criteria reported as met',na:'Criteria reported not applicable',
 steps:'Operating instructions for the AI',privacy:'Privacy and limits',
 privacyText:'The chosen AI is EXTERNAL to Studios216. Do not share personal, sensitive or confidential data without authorization. Never claim a chart or file was repaired without verification.',
 info:'If the chart, dataset or editable file is missing, request the necessary material before claiming changes were made.',
 labels:{id:'ID',date:'Date',language:'Language',chart:'Chart',subtype:'Subtype',task:'Task',purpose:'Communication objective',medium:'Medium',audience:'Audience',depth:'Depth',components:'Dashboard components',score:'Observed compliance',coverage:'Assessed coverage',critical:'Critical failures',pending:'Unverified critical items',na:'Not applicable',dimension:'Dimension',answer:'Answer',problem:'Possible risk',action:'Corrective action',verify:'How to verify',flag:'CRITICAL'},
 responses:{0:'Does not meet',1:'Partly meets',2:'Meets',na:'Not applicable',ne:'Cannot assess'},
 instructions:[
  'Inspect the original material when provided; otherwise guide the user without claiming to have edited the chart. Request the original when needed.',
  'Confirm the software (Excel, Power BI, PowerPoint, Python, web, etc.), communication goal, and expected deliverable.',
  'Prioritize data integrity and critical findings. Separate self-reported observations from issues independently verified.',
  'Preserve existing values, series, formulas, calculations, units, sources, links, filters, macros, measures, and interactions. If a visual encoding distorts data, correct the representation without inventing information.',
  'Work on a copy. Ask permission before destructive or irreversible changes.',
  'For every finding explain the proposed or performed correction, rationale, and validation steps. Do not fabricate findings or evidence.',
  'If you can edit the source file, deliver an amended copy with data and functional regression checks; otherwise provide reproducible steps without pretending you edited it.',
  'Summarize modifications, pending work, and limitations. Suggest a second self-assessment for before/after comparison.'
 ]
 }
};
const plain=v=>String(v??'').replace(/[\r\n]+/g,' ').trim();
const pct=n=>n==null?'—':String(n)+'%';
export function enrichAssessment(base,selected,dimensions,language,contextLabels){
 if(!base?.assessment_id||!base.created_at||!['es','en'].includes(language))throw Error('Missing identity or language');
 const names=Object.fromEntries(dimensions.map(d=>[d.id,d.title[language]]));
 const criteria=selected.map(r=>{
  const answer=base.answers[r.id];
  if(![0,1,2,'na','ne'].includes(answer))throw Error('Incomplete answer: '+r.id);
  return {id:r.id,dimension:r.dimension,dimension_label:names[r.dimension]||r.dimension,
   title:r.title[language],answer,answer_label:dict[language].responses[answer],
   critical:Boolean(r.critical),problem:r.problem?.[language]||null,action:r.tip[language],
   verification:r.verify?.[language]||null};
 });
 if(base.result?.selected_count!==criteria.length)throw Error('Selected rules differ from reported count');
 return {...base,handoff_schema:HANDOFF_SCHEMA,context_labels:contextLabels,criteria,
  disclaimer:dict[language].intro};
}
export function buildAIMarkdown(data){
 if(data?.handoff_schema!==HANDOFF_SCHEMA||!dict[data.language])throw Error('Invalid handoff payload');
 const d=dict[data.language],l=d.labels;
 const bullets=[
  [l.id,data.assessment_id],[l.date,data.created_at],[l.language,data.language],
  ...['chart','subtype','task','purpose','medium','audience','depth','components']
   .filter(k=>data.context_labels?.[k]!=null&&data.context_labels[k]!=='')
   .map(k=>[l[k],Array.isArray(data.context_labels[k])?data.context_labels[k].join(', '):data.context_labels[k]])
 ];
 const res=data.result||{};
 const parts=['# '+d.heading,'','> '+d.intro,'','## '+d.goal,'',d.goalText,'',
  '## '+d.files,'',d.filesText,'','## '+d.context,'',
  ...bullets.map(pair=>'- **'+plain(pair[0])+':** '+plain(pair[1])),'',
  '- **'+l.score+':** '+pct(res.observed_percentage),
  '- **'+l.coverage+':** '+pct(res.coverage_percentage),
  '- **'+l.critical+':** '+(res.critical_rule_ids||[]).length,
  '- **'+l.pending+':** '+(res.critical_unverified_ids||[]).length,
  '- **'+l.na+':** '+(res.not_applicable||0),'',
  '## '+d.issues,''];
 const problems=data.criteria.filter(c=>c.answer===0||c.answer===1);
 if(!problems.length)parts.push(d.issuesNone,'');
 for(const c of problems){
  parts.push('### '+plain(c.id)+' — '+plain(c.title)+(c.critical?' · '+l.flag:''),'',
   '- **'+l.dimension+':** '+plain(c.dimension_label),
   '- **'+l.answer+':** '+d.responses[c.answer],
   ...(c.problem?['- **'+l.problem+':** '+plain(c.problem)]:[]),
   '- **'+l.action+':** '+plain(c.action),
   ...(c.verification?['- **'+l.verify+':** '+plain(c.verification)]:[]),'');
 }
 parts.push('## '+d.pending,'');
 const unknown=data.criteria.filter(c=>c.answer==='ne');
 if(!unknown.length)parts.push(d.pendingNone);
 for(const c of unknown)parts.push('- **'+plain(c.id)+' — '+plain(c.title)+(c.critical?' · '+l.flag:'')+':** '+(c.verification||c.action));
 parts.push('','## '+d.na,'');
 const nas=data.criteria.filter(c=>c.answer==='na');
 if(!nas.length)parts.push('—');
 for(const c of nas)parts.push('- '+plain(c.id)+' — '+plain(c.title));
 parts.push('','## '+d.passed,'');
 const passed=data.criteria.filter(c=>c.answer===2);
 if(!passed.length)parts.push('—');
 for(const c of passed)parts.push('- '+plain(c.id)+' — '+plain(c.title));
 parts.push('','## '+d.steps,'');
 d.instructions.forEach((instruction,i)=>parts.push(String(i+1)+'. '+instruction));
 parts.push('','> '+d.info,'','## '+d.privacy,'',d.privacyText,
  '','---','Studios216 Visual Quality Lab · https://studios216.com/','');
 return parts.join('\n');
}
