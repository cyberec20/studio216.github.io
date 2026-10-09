
/** Studios216 Visual Quality Lab — independent pilot rubric.
 * Source-aware inspiration: C. N. Knaflic, Storytelling with Data (context,
 * chart choice, visual clutter, attention, visual narrative); D. McKinsey,
 * Strategic Storytelling (business narrative, graphs, tables, slide design).
 * Additional internally proposed integrity/accessibility checks are NOT
 * represented as authored or empirically validated by these books.
 * None of the descriptions or example cases reproduce the source text or images.
 */
const SCHEMA = 'studios216.visual-quality-lab.0.3';
const dimensions = [
  ['purpose','Propósito y audiencia','Purpose & audience'],
  ['integrity','Integridad de los datos','Data integrity'],
  ['form','Elección de representación','Representation choice'],
  ['clarity','Claridad y reducción de ruido','Clarity & reduced noise'],
  ['focus','Jerarquía y atención','Hierarchy & attention'],
  ['narrative','Hallazgos y narrativa','Insights & narrative'],
  ['medium','Medio y formato','Medium & format'],
  ['access','Accesibilidad e interacción','Accessibility & interaction']
].map(([id,es,en])=>({id,title:{es,en}}));

const make=(id,dimension,es,en,tipEs,tipEn,opts={})=>({
 id,dimension,title:{es,en},tip:{es:tipEs,en:tipEn},
 applies:opts.applies||{},critical:Boolean(opts.critical),evidence:opts.evidence||'studio-proposal',
 specialist:Boolean(opts.specialist), advanced:Boolean(opts.advanced), problem:opts.problem||null, verify:opts.verify||null
});
const book1='knaflic'; const book2='mckinsey';
const rules=[
 make('PUR-01','purpose','¿Puedes explicar en una frase para qué existe esta visualización?','Can you state the purpose of this visualization in one sentence?','Escribe qué pregunta responde y evita añadir objetivos incompatibles.','Write down the question it answers; avoid competing objectives.',{evidence:book1}),
 make('PUR-02','purpose','¿El contenido se adapta al conocimiento real del público?','Does the content match the audience’s knowledge?','Revisa términos, unidades y explicaciones para esa audiencia.','Match terminology, units, and explanations to the audience.',{evidence:book1}),
 make('PUR-03','purpose','¿Se distingue el mensaje principal de los datos secundarios?','Is the main takeaway distinct from supporting details?','Formula un hallazgo central y desplaza lo secundario a contexto.','State one core takeaway and move secondary details to context.',{evidence:book1,applies:{purpose:['inform','persuade']}}),
 make('PUR-04','purpose','¿La visualización ayuda a una pregunta o decisión concreta?','Does the visualization help answer a specific question or decision?','Indica el uso que tendrá la información después de observarla.','Describe how the information will be used afterward.',{evidence:book2}),

 make('INT-01','integrity','¿Las magnitudes y sus unidades se interpretan de forma consistente?','Are quantities and units interpreted consistently?','Aclara unidad, período, escala y cualquier conversión entre series.','Clarify unit, period, scale, and any conversion between series.',{critical:true}),
 make('INT-02','integrity','¿La escala evita exagerar o esconder las diferencias?','Does the scale avoid exaggerating or hiding differences?','En barras que codifican cantidad por longitud, verifica el punto de partida; en otros casos revisa límites y saltos.','For bars encoding quantity as length, verify the baseline; otherwise inspect axis bounds and intervals.',{critical:true,applies:{chart:['bar','line','scatter','histogram','waterfall','slope']}}),
 make('INT-03','integrity','¿Se conoce de dónde vienen los datos y a qué período corresponden?','Can the data source and its period be identified?','Indica fuente y ventana temporal para que se pueda revisar el contexto.','Include source and time window so readers can verify context.',{critical:true}),
 make('INT-04','integrity','¿Se explican ausencias, estimaciones o incertidumbres importantes?','Are important gaps, estimates, or uncertainties explained?','No conviertas una estimación en certeza; señala exclusiones relevantes.','Do not present estimates as certainties; mark relevant exclusions.',{critical:true}),

 make('FORM-01','form','¿El formato elegido representa correctamente la relación que quieres mostrar?','Does the chosen display match the relationship you want to show?','Identifica si buscas comparar, mostrar evolución, composición, relación o valores exactos.','Decide whether you want comparison, change, composition, relationship, or exact values.',{evidence:book1}),
 make('FORM-02','form','¿Es fácil comparar las longitudes o categorías que importan?','Can viewers easily compare the lengths or categories that matter?','Ordena categorías cuando ayude y evita agrupaciones ambiguas.','Order categories when useful and avoid ambiguous groups.',{applies:{chart:['bar']},evidence:book1}),
 make('FORM-03','form','¿La secuencia temporal y sus intervalos se leen correctamente?','Are the chronology and time intervals clear?','Comprueba frecuencia, continuidad y cambios de intervalo.','Check frequency, continuity, and interval changes.',{applies:{chart:['line']},evidence:book1}),
 make('FORM-04','form','¿Las partes representan un total claramente definido?','Do the parts add up to a clearly defined whole?','Indica el denominador y evita comparar porciones de totales diferentes.','State the denominator; avoid contrasting shares from different totals.',{applies:{chart:['pie']},critical:true,evidence:book1}),

 make('CLR-01','clarity','¿El título ayuda a comprender el asunto sin prometer más que los datos?','Does the title explain the point without overclaiming?','Sustituye títulos genéricos por una descripción precisa del hallazgo.','Replace generic titles with a precise statement of the takeaway.',{evidence:book1}),
 make('CLR-02','clarity','¿Las etiquetas se pueden leer sin buscar demasiado?','Can labels be read without excessive cross-referencing?','Acerca las etiquetas a sus datos cuando sea apropiado.','Place labels near the relevant data when appropriate.',{evidence:book1}),
 make('CLR-03','clarity','¿Los elementos decorativos tienen una función informativa?','Does each decorative element have a useful role?','Elimina bordes, sombras, texturas y marcas que no ayudan a entender.','Remove borders, shadows, textures, and marks that do not help.',{evidence:book1}),
 make('CLR-04','clarity','¿La precisión numérica resulta suficiente sin generar ruido?','Is numeric precision sufficient without being distracting?','Ajusta decimales y abreviaturas al nivel de decisión necesario.','Match decimals and abbreviations to the decision at hand.',{evidence:book2}),

 make('FOC-01','focus','¿Es evidente dónde mirar primero?','Is it clear where viewers should look first?','Establece una jerarquía inequívoca entre dato clave y contexto.','Make the distinction between focal point and context unambiguous.',{evidence:book1}),
 make('FOC-02','focus','¿El color tiene un significado consistente?','Does color have a consistent meaning?','Mantén el mismo color para la misma categoría o condición.','Use consistent color for a given category or condition.',{evidence:book1}),
 make('FOC-03','focus','¿Los contrastes facilitan identificar lo relevante?','Does contrast make the important elements easier to find?','Destaca lo importante sin convertir todo en un elemento destacado.','Emphasize the important items without highlighting everything.',{evidence:book1}),
 make('FOC-04','focus','¿El orden de lectura sigue una secuencia natural?','Does the reading order follow a natural sequence?','Reorganiza títulos, anotaciones y gráficos para favorecer un recorrido claro.','Arrange headlines, annotations, and charts in a clear reading sequence.',{evidence:book2}),

 make('NAR-01','narrative','¿Los datos sostienen el hallazgo que se comunica?','Do the data support the stated insight?','Vuelve al dato original cuando una frase parezca más fuerte que la evidencia.','Revisit the original data when a statement exceeds the evidence.',{critical:true,evidence:book1}),
 make('NAR-02','narrative','¿Se aporta contexto suficiente para interpretar la comparación?','Is there enough context to understand the comparison?','Explica el punto de referencia o el resultado con el que se compara.','Explain the baseline or comparator being used.',{evidence:book1}),
 make('NAR-03','narrative','¿Queda clara la consecuencia práctica del hallazgo?','Is the practical implication of the insight clear?','Relaciona el hallazgo con una decisión, pregunta o siguiente paso.','Connect the insight to a decision, question, or next step.',{applies:{purpose:['inform','persuade']},evidence:book2}),
 make('NAR-04','narrative','¿Se evita afirmar causalidad sin respaldo suficiente?','Are unsupported causal claims avoided?','Distingue asociación, hipótesis y causa demostrada.','Distinguish association, hypothesis, and demonstrated causality.',{critical:true}),

 make('MED-01','medium','¿Puede entenderse el contenido durante una exposición breve?','Can people follow the content during a short presentation?','Reduce densidad y reserva las cifras exactas para el material de apoyo.','Reduce density; move exact figures to supporting material.',{applies:{medium:['slides']},evidence:book2}),
 make('MED-02','medium','¿Se puede consultar el detalle necesario sin perder el hilo?','Can readers consult needed details without losing the thread?','Incluye tabla o notas de respaldo si importan los valores precisos.','Offer a table or supporting notes when exact values matter.',{applies:{medium:['report','web']},evidence:book2}),
 make('MED-03','medium','¿El tamaño del texto funciona en el dispositivo o soporte previsto?','Does text remain readable on the intended device or medium?','Prueba el tamaño real de reproducción, no solo el zoom del editor.','Test actual viewing size, not only editor zoom.',{evidence:book2}),
 make('MED-04','medium','¿La forma de presentación aprovecha el medio sin complicar el mensaje?','Does the presentation format help rather than complicate the message?','No agregues interacción, animación o diapositivas si no explican algo mejor.','Avoid interaction, animation, or extra slides unless they aid understanding.',{evidence:book2}),

 make('ACC-01','access','¿La información puede entenderse sin depender solo del color?','Can the information be understood without relying on color alone?','Añade nombres, patrones o etiquetas cuando el color sea el único código.','Add names, patterns, or labels if color is the only encoding.',{critical:true}),
 make('ACC-02','access','¿Hay una descripción textual suficiente del hallazgo visual?','Is there an adequate text description of the visual finding?','Explica la conclusión y, si hace falta, los datos fundamentales en texto.','Explain the takeaway and, when needed, the key data in text.',{applies:{medium:['web','report']}}),
 make('ACC-03','access','¿Las acciones interactivas se pueden utilizar con teclado?','Can interactive actions be operated with a keyboard?','Comprueba foco, botones, navegación y alternativas de contenido.','Check focus, buttons, navigation, and content alternatives.',{applies:{medium:['web'],chart:['dashboard']}}),
 make('ACC-04','access','¿El contraste y la tipografía permiten leer sin esfuerzo excesivo?','Do contrast and typography support comfortable reading?','Revisa tamaño, contraste, interlineado y legibilidad en móvil.','Check sizing, contrast, spacing, and mobile readability.')
,
 // Bar chart modules: different mark constructions require different checks.
 make('BAR-01','integrity','¿La longitud de las barras utiliza una referencia de cero?','Do bar lengths use a zero reference?','Cuando la cantidad se codifica mediante longitud, comienza desde cero o elige otra representación.','When value is encoded as length, start at zero or choose another representation.',{applies:{chart:['bar']},critical:true,specialist:true,evidence:book1,problem:{es:'Una escala truncada puede magnificar pequeñas diferencias.',en:'A truncated bar scale can magnify small differences.'},verify:{es:'Compara proporciones de longitudes con valores originales.',en:'Compare the proportions of bar lengths with the original values.'}}),
 make('BAR-02','form','¿El orden de las categorías facilita la comparación?','Does category ordering make comparison easy?','Ordena por magnitud si no existe un orden natural que deba preservarse.','Sort by value unless a meaningful natural order should be preserved.',{applies:{chart:['bar']},specialist:true,evidence:book1,verify:{es:'Localiza los valores mayor y menor sin recorrer todo el gráfico.',en:'Find the largest and smallest values without scanning the entire chart.'}}),
 make('BAR-03','form','Si comparas series, ¿la agrupación permite distinguirlas?','If you compare series, can the groups be distinguished?', 'Utiliza agrupaciones y codificación consistentes; evita series difíciles de comparar.','Use consistent grouping and encoding; avoid hard-to-compare series.',{applies:{chart:['bar'],subtype:['grouped']},specialist:true,evidence:book1}),
 make('BAR-04','integrity','Si las barras están apiladas, ¿queda claro el total y cómo aporta cada parte?','For stacked bars, are the total and each contribution clear?','Aclara si las partes son valores absolutos o porcentajes y conserva el denominador.','Explain whether components are absolute or percentages and preserve the denominator.',{applies:{chart:['bar'],subtype:['stacked','stacked100']},critical:true,specialist:true,evidence:book2}),
 // Time series: changes, missing time and forecasts have distinct failure modes.
 make('LIN-01','integrity','¿Los intervalos en el eje del tiempo reflejan la separación real entre fechas?','Does time spacing reflect the actual intervals between dates?','Revisa huecos, frecuencia y etiquetas; no representes períodos desiguales como iguales sin explicarlo.','Review gaps, frequency, and labels; do not imply unequal periods are evenly spaced.',{applies:{chart:['line']},critical:true,specialist:true,evidence:book1}),
 make('LIN-02','integrity','¿Se distinguen visualmente los datos observados de los pronósticos?','Are observed data visibly distinct from forecasts?','Diferencia línea o región futura y declara supuestos o incertidumbre.','Distinguish projected sections and state assumptions or uncertainty.',{applies:{chart:['line'],subtype:['forecast']},critical:true,specialist:true,evidence:book2}),
 make('LIN-03','narrative','¿Se señalan los cambios importantes sin atribuir causas no demostradas?','Are important changes annotated without implying unproven causes?','Anota el momento y el hecho conocido; separa observación de interpretación.','Annotate the timing and known fact; separate observation from interpretation.',{applies:{chart:['line']},specialist:true,evidence:book2}),
 // Whole-part relations: use of pies/donuts is conditional, never categorically forbidden.
 make('PIE-01','integrity','¿Todas las porciones pertenecen al mismo total sin solapamientos?','Do all slices belong to one non-overlapping whole?','Comprueba categorías mutuamente excluyentes, períodos y porcentajes del total.','Check mutually exclusive categories, time windows, and shares of the same whole.',{applies:{chart:['pie']},critical:true,specialist:true,evidence:book1}),
 make('PIE-02','clarity','¿Los segmentos y etiquetas pueden distinguirse con comodidad?','Can people distinguish slices and their labels comfortably?','Agrupa categorías solo cuando sea legítimo o usa una alternativa de barras.','Group categories only when justified, or use bars instead.',{applies:{chart:['pie']},specialist:true,evidence:book2}),
 make('PIE-03','form','¿Una comparación por barras permitiría ver mejor las diferencias?','Would bars make the differences easier to compare?','Si el objetivo es ordenar o comparar muchas partes, ensaya una barra horizontal.','If your task is ranking or comparing many parts, test a horizontal bar.',{applies:{chart:['pie'],task:['compare','exact']},specialist:true,evidence:book1}),
 // Relationships: both encodings and evidence claims matter.
 make('SCA-01','integrity','¿Los ejes y unidades permiten interpretar la relación observada?','Do the axes and units allow viewers to interpret the relationship?','Describe variables, escalas y rangos; evita ocultar observaciones con límites elegidos.','Explain variables, scales, and ranges; do not crop out observations.',{applies:{chart:['scatter']},specialist:true,critical:true,evidence:book1}),
 make('SCA-02','form','¿Se observan agrupaciones y valores atípicos sin ocultarlos?','Can clusters and outliers be seen without being hidden?','Revisa superposición de puntos y usa transparencia cuando ayude.','Review overplotting and use transparency when it improves reading.',{applies:{chart:['scatter']},specialist:true,evidence:book2}),
 // Precise lookup: table is a valid first choice, not a failed chart.
 make('TAB-01','form','¿El lector puede localizar rápidamente una cifra exacta?','Can the reader quickly locate an exact value?','Ordena filas y columnas según la consulta; alinea cifras y muestra unidades.','Order rows and columns for lookup; align numbers and show units.',{applies:{chart:['table']},specialist:true,evidence:book2}),
 make('TAB-02','clarity','¿Se mantiene una precisión numérica coherente entre las celdas?','Is numeric precision consistent across table cells?','Usa formatos equivalentes y destaca diferencias relevantes sin saturar.','Use comparable formats and highlight relevant differences without clutter.',{applies:{chart:['table']},specialist:true,evidence:book2}),
 // Histograms vs bars: intervals describe a distribution, not categories.
 make('HIS-01','form','¿La agrupación en intervalos permite apreciar la distribución?','Does binning reveal the distribution reasonably?','Prueba anchos de intervalo alternativos sin ocultar picos o dispersión.','Try alternative bin widths without hiding peaks or spread.',{applies:{chart:['histogram']},specialist:true,evidence:book2}),
 make('HIS-02','integrity','¿Las frecuencias y los intervalos están definidos sin ambigüedad?','Are frequencies and bins clearly defined?','Distingue conteos de densidad y evita intervalos contradictorios.','Distinguish counts from density and avoid inconsistent bins.',{applies:{chart:['histogram']},critical:true,specialist:true,evidence:book2}),
 // Waterfalls: bridges require numerical reconciliation.
 make('WAT-01','integrity','¿Los incrementos y decrementos se reconcilian con el resultado final?','Do increases and decreases reconcile with the ending value?','Comprueba suma inicial, cambios firmados y total final con la tabla de origen.','Check beginning value, signed changes, and final total against source data.',{applies:{chart:['waterfall']},critical:true,specialist:true,evidence:book2}),
 make('WAT-02','form','¿Se distinguen los totales de los cambios intermedios?','Are totals clearly distinguished from intermediate changes?','Usa etiquetas y tratamiento coherente para totales y variaciones.','Use clear labels and consistent styling for totals and changes.',{applies:{chart:['waterfall']},specialist:true,evidence:book2}),
 // Heatmaps: encoded color needs a legible quantitative key.
 make('HEAT-01','integrity','¿La escala cromática explica correctamente qué significa cada color?','Does the color scale accurately explain what each color means?','Muestra leyenda, rango y punto central cuando corresponda.','Show the legend, range, and meaningful midpoint where applicable.',{applies:{chart:['heatmap']},critical:true,specialist:true,evidence:book1}),
 make('HEAT-02','form','¿El orden de filas y columnas permite encontrar patrones?','Do row and column order help reveal patterns?','Ordena o agrupa de forma que el patrón sea reconocible sin perder etiquetas.','Order or group entries to reveal patterns without losing labels.',{applies:{chart:['heatmap']},specialist:true,evidence:book1}),
 // Slope graphs connect two snapshots, not full time-series data.
 make('SLO-01','integrity','¿Se comparan las mismas entidades y medidas en ambos momentos?','Are the same entities and measures compared at both endpoints?','Verifica unidad, escala y categorías antes y después.','Verify units, scale, and matched categories at both endpoints.',{applies:{chart:['slope']},critical:true,specialist:true,evidence:book1}),
 make('SLO-02','clarity','¿Las líneas y etiquetas permiten seguir cada cambio sin confusiones?','Can readers follow each change without line or label collisions?','Reduce solapamientos y rotula directamente las series que importan.','Reduce overlaps and directly label the important series.',{applies:{chart:['slope']},specialist:true,evidence:book1}),
 // Dashboard-wide validation applies to the whole dashboard; individual marks are separately selected.
 make('DAS-01','form','¿Los gráficos del dashboard responden preguntas distintas pero relacionadas?','Do dashboard components answer distinct but related questions?','Elimina duplicaciones y deja explícita la función de cada gráfico.','Remove redundant visuals and make the role of each chart clear.',{applies:{chart:['dashboard']},specialist:true,evidence:'studio-proposal'}),
 make('DAS-02','medium','¿Se entiende a qué gráficos afectan los filtros y cómo se restablecen?','Is the effect and reset behavior of each filter clear?','Explica alcance, estado actual y cómo regresar a la vista completa.','Explain filter scope, current state, and how to return to the full view.',{applies:{chart:['dashboard'],medium:['web']},specialist:true,evidence:'studio-proposal'})

].map(rule=>({...rule, advanced:rule.advanced || new Set(['PUR-04','INT-04','FORM-03','CLR-04','FOC-04','NAR-02','MED-04','LIN-03','PIE-03','TAB-02','WAT-02','HEAT-02','SLO-02']).has(rule.id)}));
const CHARTS=['bar','line','pie','scatter','histogram','waterfall','heatmap','slope','table','dashboard'];
const TASKS=['compare','trend','composition','relationship','distribution','change','exact'];
const SUBTYPES={bar:['simple','grouped','stacked','stacked100'],line:['basic','forecast'],pie:['pie','donut'],scatter:['scatter','bubble']};
const DASH_COMPONENTS=['bar','line','pie','scatter','histogram','waterfall','heatmap','slope','table'];
const COMPATIBILITY={
 compare:['bar','slope','table','heatmap'],trend:['line','bar','slope'],composition:['bar','pie','waterfall','heatmap'],
 relationship:['scatter','heatmap'],distribution:['histogram','scatter','heatmap'],change:['waterfall','bar','line'],exact:['table','bar']
};
function compatibility(context){
 if(context.chart==='dashboard'||!TASKS.includes(context.task))return null;
 const alternatives=COMPATIBILITY[context.task]||[];
 return alternatives.includes(context.chart)?null:{task:context.task,chart:context.chart,alternatives:alternatives.slice(0,3)};
}
function applies(rule,context){
 return Object.entries(rule.applies||{}).every(([key,values])=>{
   if(key==='chart'&&context.chart==='dashboard'){
     // Evaluate this dashboard as a system AND its explicitly selected components.
     // Never assume a dashboard contains a pie, a line, or a bar.
     return values.includes('dashboard')||values.some(v=>(context.components||[]).includes(v));
   }
   if(key==='subtype'&&context.chart==='dashboard')return false; // no per-component subtype selection yet
   return values.includes(context[key]);
 });
}
/** All relevant rules are eligible; we select a balanced learning experience,
 * ensuring every rubric dimension has representation and that specialist/critical
 * checks outrank redundant general questions. No silent invented N/A answers.
 */
function selectedRules(context){
 const all=rules.filter(r=>applies(r,context));
 const full=context.depth==='full';
 const pool=all.filter(r=>full || !r.advanced || r.critical);
 const limit=full?34:22;
 if(pool.length<=limit)return pool;
 const rank=r=>(r.critical?120:0)+(r.specialist?85:0)+(r.dimension==='form'?7:0)+(r.advanced?-10:0);
 const chosen=new Set();
 for(const dim of dimensions){
   const candidates=pool.filter(r=>r.dimension===dim.id).sort((a,b)=>rank(b)-rank(a));
   if(candidates.length)chosen.add(candidates[0].id);
 }
 for(const r of [...pool].sort((a,b)=>rank(b)-rank(a)))if(chosen.size<limit)chosen.add(r.id);
 return pool.filter(r=>chosen.has(r.id));
}
function groupQuestions(context){
 const chosen=selectedRules(context);if(!chosen.length)return [];
 const pages=Math.ceil(chosen.length/6),size=Math.floor(chosen.length/pages),extra=chosen.length%pages;
 let cursor=0;
 return Array.from({length:pages},(_,i)=>{const n=size+(i<extra?1:0);const slice=chosen.slice(cursor,cursor+n);cursor+=n;return slice;});
}
function calculate(context,answers){
 const selected=selectedRules(context);
 const byDimension=Object.fromEntries(dimensions.map(d=>[d.id,{scored:0,total:0,na:0,ne:0,answered:0,applicable:0}]));
 let score=0,max=0,answered=0,unknown=0,na=0;
 const critical=[];const criticalUnverified=[];const recommendations=[];
 for(const rule of selected){
   const dim=byDimension[rule.dimension],value=answers[rule.id];
   if(value===undefined){continue;}
   answered++;dim.answered++;
   if(value==='na'){na++;dim.na++;if(rule.critical)criticalUnverified.push(rule.id);continue;}
   if(value==='ne'){unknown++;dim.ne++;dim.applicable++;if(rule.critical)criticalUnverified.push(rule.id);continue;}
   if(![0,1,2].includes(value)){throw new Error('Invalid score for '+rule.id);}
   score+=value;max+=2;dim.scored+=value;dim.total+=2;dim.applicable++;
   if(value<2)recommendations.push({id:rule.id,dimension:rule.dimension,value,critical:rule.critical,rule});
   if(rule.critical&&value===0)critical.push(rule.id);
 }
 const valid=selected.length;
 return {selectedCount:valid,answered,remaining:valid-answered,na,unknown,score,max,
    pct:max?Math.round((score/max)*100):null,coverage:(valid-na)>0?Math.round((max/2)/(valid-na)*100):null,
    critical,criticalUnverified,byDimension,recommendations:recommendations.sort((a,b)=>(Number(b.critical)-Number(a.critical))||(a.value-b.value))};
}
export { SCHEMA, dimensions, rules, CHARTS, TASKS, SUBTYPES, DASH_COMPONENTS, compatibility, applies, selectedRules, groupQuestions, calculate };
