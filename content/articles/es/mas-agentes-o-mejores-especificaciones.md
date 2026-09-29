# ¿Más agentes o mejores especificaciones? Lo que cambió después de probar ambos enfoques

Cuando un agente empieza a resolver bien una parte del trabajo, la siguiente idea parece casi inevitable: si uno ayuda, varios coordinados deberían ayudar todavía más. El patrón resulta tentador también para equipos que buscan acelerar un resultado sin perder control; durante un tiempo trabajé justamente así. Distribuía responsabilidades entre agentes con roles distintos y dejaba a un orquestador decidir quién debía implementar, auditar o revisar seguridad.

La lógica era atractiva y las primeras pruebas parecían confirmarla. Era una evolución natural de lo que ya hacía con [Roo Code](https://github.com/RooCodeInc/Roo-Code) dentro de Visual Studio Code; más adelante, una parte creciente del flujo pasó a terminal, PowerShell, [Claude Code](https://github.com/anthropics/claude-code), [Codex](https://github.com/openai/codex) y otros modelos. Cambiaron las interfaces, pero durante un tiempo mantuve la misma intuición: especializar agentes, delegar y coordinar.

El problema apareció en un lugar menos visible que el código: **cada handoff transportaba trabajo, pero también una interpretación del contexto**. El resultado podía seguir siendo bueno; el riesgo estaba en que cada frontera añadía otra oportunidad para desviar la intención.

Un agente podía llevar horas acumulando decisiones, correcciones, excepciones y restricciones del proyecto; al delegar, tenía que reconstruir una parte de todo eso para otro agente. El segundo recibía lo que el primero consideraba relevante, con el nivel de detalle que había decidido incluir, y volvía a interpretar la tarea desde su propio contexto. Después, el resultado regresaba al agente principal y sufría otra interpretación antes de reintegrarse al conjunto.

No necesariamente salía mal. De hecho, a veces funcionaba muy bien. Lo incómodo era otra cosa: había creado una arquitectura donde **coordinar también significaba traducir**, y cada traducción podía introducir una pequeña desviación.

Esa experiencia terminó cambiando la pregunta. Ya no era solamente cómo distribuir mejor el trabajo, sino cómo conseguir que la intención sobreviva a la distribución.

## El handoff no es un canal neutro

En un sistema multiagente, añadir otro actor no añade únicamente capacidad; también añade una frontera. A través de ella deben pasar objetivo, restricciones, dependencias, criterios de aceptación, decisiones previas y suficiente contexto para que la nueva ejecución siga perteneciendo al mismo problema.

Anthropic describe una tensión parecida desde otro dominio. En su sistema de investigación multiagente, los subagentes funcionan especialmente bien cuando pueden explorar **direcciones independientes en paralelo**; al mismo tiempo, la propia arquitectura introduce retos de coordinación, evaluación y confiabilidad. En otra guía, la compañía recomienda paralelizar cuando una tarea puede dividirse realmente en subtareas independientes o cuando se necesitan perspectivas separadas. ([How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system); [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents)).

Conviene mantener el límite de esa evidencia: un sistema de investigación no demuestra que el mismo patrón produzca idénticos resultados al desarrollar software. Sí aporta una observación arquitectónica útil: **el paralelismo gana valor cuando la independencia de las tareas es real; si las dependencias son densas, la coordinación deja de ser un detalle y pasa a formar parte del problema**.

Eso era precisamente lo que empezaba a notar. Muchos trabajos de software no son piezas aisladas esperando un agente; son decisiones encadenadas que comparten contratos, estados, datos, convenciones y criterios de aceptación. Multiplicar ejecutores antes de entender esas dependencias puede acelerar partes del trabajo y, al mismo tiempo, aumentar el costo de volver a unirlas.

## Antes de hablar de SDD, ya intentaba especificar

La respuesta no apareció de golpe. Antes de adoptar un enfoque explícitamente orientado por especificaciones, ya trabajaba con planes bastante detallados; surgieron porque necesitaba que el agente pudiera avanzar sin alejarse demasiado del objetivo.

Funcionaban, pero tenían un defecto claro: tendían a convertirse en documentos monolíticos. Preparar un plan realmente útil exigía revisarlo, ampliarlo, preguntar qué faltaba, corregir dependencias y volver a verificarlo. Había encontrado una dirección, pero todavía no una estructura suficientemente sistemática para transportar intención, ejecución y evidencia sin concentrarlo todo en un único bloque enorme.

En paralelo exploré contratos y enfoques que formalizaban partes del problema. [OpenAPI](https://github.com/OAI/OpenAPI-Specification) ofrece una descripción estándar y legible por máquinas para interfaces HTTP; [AsyncAPI](https://github.com/asyncapi/spec) hace algo equivalente para sistemas orientados a mensajes. Ninguno de los dos pretende resolver por sí solo la planificación completa de un producto, pero ambos reforzaban una idea importante: **cuando una parte del comportamiento puede expresarse como contrato verificable, deja de depender exclusivamente de una conversación**.

Más adelante probé herramientas orientadas directamente a Spec-Driven Development, entre ellas [Spec Kit](https://github.com/github/spec-kit) y [OpenSpec](https://github.com/Fission-AI/OpenSpec). Las probé en etapas anteriores de su evolución, así que no considero aquella experiencia una evaluación actual de lo que ofrecen hoy; ambas han seguido cambiando. Lo relevante fue lo que dejaron claro para el proceso que estaba construyendo: la especificación podía convertirse en algo más que documentación previa; podía ser parte activa del sistema de trabajo.

En vez de continuar adaptando el proceso a una herramienta concreta, empecé a combinar principios que ya me resultaban familiares: planificación, SDD, validación y una estructura que llevaba años usando en ingeniería, **PDCA: Plan, Do, Check, Act**.

Ahí empezó a encajar mejor.

## De controlar roles a controlar artefactos

En el enfoque multiagente inicial, buena parte del control vivía en la distribución de responsabilidades:

```text
orquestador → implementador → auditor
```

Al mover el centro de gravedad hacia las especificaciones, la secuencia empezó a parecerse más a esto:

```text
objetivo → especificación → plan → tareas → implementación → pruebas → evidencia
```

La diferencia parece pequeña hasta que algo falla. Con el primer esquema, entender qué debía ocurrir puede exigir reconstruir qué dijo el orquestador, qué entendió el implementador y qué revisó el auditor. Con el segundo, una parte mayor de esa intención queda materializada en artefactos compartidos; no desaparece la interpretación, pero existe una referencia común a la que volver.

Si surge una duda sobre el propósito de una tarea, existe un plan al que volver; si hay discusión sobre qué significa terminarla, deberían existir criterios de aceptación. Cuando la implementación ya ocurrió, las pruebas y la evidencia permiten comprobar qué se hizo realmente, en lugar de reconstruir el cierre solo desde la conversación.

Esto no elimina el problema del contexto. Las sesiones largas siguen acumulando decisiones, la documentación puede quedar desactualizada y una especificación mal escrita puede preservar con mucha eficiencia una mala idea. El punto no es documentar más por principio, sino transportar mejor la intención: **el contexto deja de depender únicamente de la memoria conversacional y comienza a viajar mediante artefactos que pueden revisarse, versionarse y comprobarse**.

Ese cambio conecta directamente con algo que ya había aprendido al trabajar sobre producto: como desarrollé en [“La IA dijo «terminado». El producto tenía otra opinión”](/articles/es/la-ia-dijo-terminado/), una tarea cerrada por el agente no equivale automáticamente a una funcionalidad aceptada. La especificación ayuda precisamente porque crea una referencia externa contra la cual contrastar lo implementado.

## Por qué esto se sintió tan familiar

No vengo de ingeniería de software, sino de ingeniería eléctrica; durante años trabajé con especificaciones, hojas de datos, requisiciones, ofertas técnicas, revisión de ingeniería de proveedores y QA/QC.

Si se necesita comprar un centro de control de motores, un switchgear o un cable, no basta con pedirle al proveedor “uno bueno”. Existe una especificación que define requisitos; la oferta se revisa contra esa referencia y, si el suministro se aprueba, la historia todavía no termina. Cuando el equipo llega, QA/QC verifica que lo entregado corresponda con lo aprobado.

La especificación **sobrevive al proceso**.

No depende de que quien redactó el documento pueda acompañar cada conversación posterior y explicar de memoria todo lo que quiso decir; diferentes personas pueden contrastar decisiones y entregables contra un artefacto común. Naturalmente, la ingeniería real también contiene ambigüedades, cambios y criterios que requieren juicio, pero la existencia de una referencia compartida reduce cuánto debe reconstruirse en cada transferencia.

Al trabajar de una manera más orientada por especificaciones con agentes reconocí la misma lógica. El dominio había cambiado; el principio, mucho menos.

Eso explica por qué este enfoque terminó resultándome más natural que uno donde demasiada intención debía viajar de agente en agente mediante sucesivas reinterpretaciones.

## El agente no hace menos; cambia la forma de demostrar lo que hizo

Mover el control hacia especificaciones no significó reducir la delegación. En la práctica ocurrió lo contrario: el agente participa en la planificación, implementa, escribe pruebas, las ejecuta, analiza los fallos, corrige y vuelve a validar; además, debe dejar evidencia suficiente para que el trabajo pueda revisarse.

La intervención humana se desplaza hacia preguntas distintas:

- ¿Esto satisface realmente el objetivo?
- ¿Las dependencias relevantes fueron consideradas?
- ¿Dónde están los criterios de aceptación y las pruebas?
- ¿Qué comportamiento demuestra que la tarea está terminada?
- ¿La evidencia prueba la funcionalidad o solamente que algo se ejecutó sin error?

Ese desplazamiento importa porque **no toda validación necesita otro agente**. Un build puede demostrar de manera determinista si compila; un test runner puede informar si las pruebas pasan; un script puede comprobar invariantes y un validador puede impedir que un artefacto incompleto se trate como válido. La IA sigue interpretando, implementando y corrigiendo, pero no necesita gastar razonamiento para decidir aquello que el sistema ya puede comprobar de forma más directa.

Esa misma idea aparece en [“Después de 8.901 comandos, cambié mi forma de trabajar con agentes”](/articles/es/despues-de-8901-comandos/): mejorar un sistema agentic no necesariamente consiste en añadir más capacidad. A veces consiste en decidir qué contexto, memoria, herramientas y reglas merecen permanecer; la reducción también puede ser una decisión de arquitectura.

## Las especificaciones también pueden decir cuándo usar más agentes

Durante un tiempo traté el multiagente y SDD como caminos alternativos. Uno distribuía trabajo mediante roles; el otro lo estructuraba mediante artefactos. Con más experiencia, esa oposición empezó a parecer artificial.

Tal vez el orden sea más importante que la elección.

Primero puede definirse el objetivo; después, convertir la intención en especificaciones, identificar dependencias, establecer criterios y separar paquetes de trabajo. Solo entonces aparece una pregunta mucho más útil: **¿cuáles de esas tareas son realmente independientes y pueden ejecutarse en paralelo sin obligar a cada agente a reconstruir el proyecto completo?**

El flujo cambia:

```text
objetivo
→ especificación
→ plan
→ dependencias
→ tareas independientes
→ ejecución paralela cuando aporta valor
→ integración
→ pruebas
→ evidencia
→ aceptación
```

En ese punto, varios agentes dejan de ser una estructura organizativa aplicada por defecto y se convierten en una decisión de ejecución. No hace falta inventar un “agente frontend”, un “agente backend” y un “agente auditor” solo porque los nombres resulten cómodos; pueden existir simplemente varios ejecutores trabajando sobre paquetes que el plan ya determinó como suficientemente independientes.

Cada paquete debería transportar lo necesario para su parte: contexto relevante, objetivo, límites, dependencias, criterios de aceptación y validaciones. El agente no tiene que adivinar qué quiso decir el orquestador ni reconstruir todo el proyecto; tiene que resolver una unidad de trabajo cuyo encaje con el conjunto ya fue razonado antes de paralelizarla.

Esto tampoco convierte el paralelismo en una solución automática. Dos tareas aparentemente separadas pueden tocar el mismo esquema, modificar contratos compartidos o depender del mismo estado; si esa relación no se descubre a tiempo, varios agentes solo consiguen producir conflictos más rápido. La especificación no elimina la coordinación: **permite decidir con mayor fundamento dónde la coordinación compensa y dónde no**.

## Un filtro práctico antes de multiplicar agentes

Antes de paralelizar trabajo, hoy intentaría responder al menos estas preguntas:


1. **¿El objetivo está suficientemente definido?** Si todavía cambia cada vez que se explica, probablemente no conviene distribuirlo.

2. **¿Las dependencias están identificadas?** Una tarea “independiente” deja de serlo en cuanto comparte estado, contrato o secuencia crítica con otra.

3. **¿Cada paquete tiene un criterio de aceptación propio?** Si dos agentes pueden declarar éxito usando definiciones diferentes de “terminado”, la integración ya empezó con deuda.

4. **¿Existe una fuente común de verdad?** Especificación, plan, contrato, pruebas o artefactos equivalentes deben sobrevivir a los handoffs.

5. **¿La integración está definida antes de ejecutar?** Saber cómo volverán a unirse los resultados importa tanto como separarlos.

6. **¿Parte de la validación puede ser determinista?** Cuanto más pueda comprobar el sistema mediante tests, scripts o validadores, menos depende la aceptación de otra interpretación probabilística.
7. **¿El paralelismo aporta algo medible?** Velocidad, cobertura, independencia de exploración o reducción de tiempo crítico; si no existe un beneficio claro, añadir coordinación es simplemente añadir trabajo.

No es una fórmula universal. Es un filtro para evitar una confusión que me resultó costosa: asumir que más agentes implican automáticamente más capacidad útil.

## Entonces, ¿más agentes o mejores especificaciones?

Después de probar ambos enfoques, la respuesta que mejor describe cómo prefiero trabajar hoy es sencilla: **mejores especificaciones primero**.

No porque un solo agente deba hacerlo todo, ni porque los sistemas multiagente hayan dejado de interesarme. Al contrario: cuanto más clara está la estructura del trabajo, más sentido empieza a tener volver a paralelizar determinadas partes.

Lo que cambió fue el umbral.

Si el objetivo está definido, las dependencias se entienden, los criterios son verificables y una tarea puede separarse sin perder intención, varios agentes pueden ser una herramienta poderosa. Si todavía no está claro qué se está distribuyendo, añadir agentes puede terminar distribuyendo la incertidumbre.

Al principio intentaba escalar aumentando el número de agentes; después empecé a preguntarme si podía escalar estructurando mejor lo que reciben. El siguiente paso probablemente combine ambas ideas: **especificar primero para decidir después qué merece ejecutarse en paralelo**.

En ingeniería, cuantos más actores participan, más valiosa se vuelve una referencia que las personas involucradas puedan verificar sin preguntar a la persona anterior qué quiso decir. Después de trabajar con agentes, esa vieja lección terminó regresando con una forma nueva.

**La especificación no compite con el agente; le da una referencia. Y una buena referencia puede ser precisamente lo que permita multiplicar agentes sin multiplicar también la ambigüedad.**

---

## Referencias

- Anthropic, **How we built our multi-agent research system**: https://www.anthropic.com/engineering/multi-agent-research-system
- Anthropic, **Building Effective AI Agents**: https://www.anthropic.com/engineering/building-effective-agents
- GitHub, **Spec Kit**: https://github.com/github/spec-kit
- Fission AI, **OpenSpec**: https://github.com/Fission-AI/OpenSpec
- OpenAPI Initiative, **OpenAPI Specification**: https://github.com/OAI/OpenAPI-Specification
- AsyncAPI Initiative, **AsyncAPI Specification**: https://github.com/asyncapi/spec
- Roo Code, **Roo-Code** (repositorio histórico, actualmente archivado): https://github.com/RooCodeInc/Roo-Code
- Anthropic, **Claude Code**: https://github.com/anthropics/claude-code
- OpenAI, **Codex**: https://github.com/openai/codex