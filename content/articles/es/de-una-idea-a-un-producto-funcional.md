# De una idea a un producto funcional: lo que he aprendido construyendo software con IA

Hace unos años, muchas ideas de software podían pasar meses entre una libreta y una hoja de cálculo. Quedaban detenidas en esa frase que muchos hemos dicho alguna vez: «algún día habría que construir esto». Hoy, si trabajas con IA, tu idea puede recorrer esa distancia mucho más rápido. Los modelos razonan sobre código, los agentes usan herramientas y los entornos conectan más etapas; en tu proyecto, el problema ya no es solo producir código, sino definir resultado y evidencia para aceptarlo.

Esa velocidad cambia lo que parece posible en tu proyecto; también cambia qué problema debes definir y qué resultado puedes considerar aceptable. En mis propios proyectos, esa ha sido la diferencia más útil: **que una aplicación aparezca rápido no significa que ya exista un producto**.

La IA puede ayudarme a explorar una arquitectura, proponer un modelo de datos, escribir una API, construir una interfaz, generar pruebas, revisar errores o documentar decisiones. Sin embargo, producir más código no elimina el criterio; desplaza mi atención hacia el comportamiento correcto y la evidencia necesaria para aceptar el resultado.

Esa distinción reorganiza el resto del proceso: usar IA para **producir software** no es lo mismo que usarla para **construir un producto que podamos sostener**.

## Una demo que funciona todavía puede estar lejos de estar lista

Ver una aplicación aparecer en minutos tiene algo seductor. Escribes una instrucción; el modelo genera componentes, conecta una base de datos y crea algunas rutas. De pronto, hay algo que puedes abrir en el navegador. Si la interfaz además se ve bien, la sensación de avance es enorme; y es avance, no hay razón para restarle valor.

Por ejemplo, un prototipo puede validar una hipótesis, hacer visible un flujo o permitir una conversación que antes solo existía en abstracto. Un MVP también puede ser exactamente lo necesario en una etapa temprana. El problema empieza cuando confundimos **«puedo demostrarlo»** con **«puedo ponerlo delante de usuarios reales y responder por su comportamiento»**.

Operar para usuarios exige otras garantías: datos consistentes, permisos que realmente limiten el acceso, estados que no se contradigan, errores que no destruyan el flujo, un despliegue reproducible y una forma de recuperar el sistema cuando algo falla. A eso se suman pruebas, seguridad, trazabilidad y suficiente observabilidad para reconstruir qué ocurrió.

En otras palabras, la diferencia no está únicamente en sumar funcionalidades. Está en pasar de **mostrar que algo puede funcionar** a **demostrar que puede funcionar bajo condiciones reales**. Una demo puede ocultar bastante complejidad hasta que entran en juego permisos, fallos y recuperación.

Eso ayuda a explicar por qué algunos videos de «construí un SaaS completo con IA en una tarde» pueden ser impresionantes y, al mismo tiempo, mostrar solo una parte del recorrido. Quizá la demostración sea completamente legítima; lo que todavía queda por responder es qué hace falta para convertirla en algo confiable, mantenible y operable.

## La IA cambia el reparto del esfuerzo, no elimina el ciclo de desarrollo

El informe [DORA 2025 sobre desarrollo de software asistido por IA](https://dora.dev/research/2025/dora-report/) describe a la IA como un **amplificador**. Magnifica fortalezas y debilidades del sistema de trabajo que ya existe. Ese encuadre evita dos extremos: la herramienta no repara por sí sola una forma de trabajar débil, pero reducirla a un simple autocompletado tampoco explica el alcance del cambio. DORA no demuestra que la IA mejore cualquier proyecto; sugiere algo más prudente: el efecto depende en buena medida del sistema que la rodea.

Cuando la implementación se acelera, el peso relativo de las tareas se mueve. Producir una primera versión puede costar menos; definir el comportamiento correcto, conservar contexto, revisar decisiones y verificar resultados puede volverse proporcionalmente más importante. La generación de código no hace desaparecer esas actividades: **las desplaza hacia el centro del trabajo**.

Ya no pienso el recorrido únicamente como «idea → código». Me resulta más útil una secuencia más completa.

```text
idea
→ problema
→ criterios
→ arquitectura
→ implementación
→ pruebas
→ auditoría
→ corrección
→ despliegue
→ observación
→ feedback
→ mejora
```

La IA puede intervenir en casi todas esas etapas; lo importante es que **no todas dependan de la misma clase de razonamiento ni de la misma fuente de verdad**.

## Más velocidad exige mejores mecanismos para inspeccionar y volver atrás

Trabajar con IA sin mecanismos de control termina siendo frágil. Cuanto más rápido puede un agente modificar un sistema, más necesito saber qué cambió, comparar estados, reproducir resultados y regresar a una versión anterior cuando algo sale mal.

Git, los entornos aislados, los contenedores, las pruebas automatizadas, la integración continua y la revisión de cambios no pierden relevancia frente a los agentes. Ocurre lo contrario: les dan una superficie más segura sobre la cual operar.

La guía de [GitHub para revisar código generado por IA](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code) propone empezar con pruebas automatizadas y análisis estático; después pide verificar que el cambio encaje con el propósito, los requisitos y la arquitectura del proyecto. Esa segunda parte es crucial: un cambio puede compilar y superar las pruebas existentes sin haber resuelto correctamente el problema que pretendíamos resolver.

De ahí sale una regla práctica que uso cada vez más: **a mayor velocidad de generación, mayor capacidad de inspección y reversión**. Esto importa porque cualquier herramienta capaz de producir muchos cambios con rapidez también puede escalar una mala decisión; la IA no tiene un defecto especial en ese sentido.

## Cuando el proyecto crece, preservar la intención se vuelve parte de la arquitectura

En un proyecto pequeño podemos conservar muchas decisiones en la cabeza: por qué elegimos cierta estructura o qué parte no debe tocarse. También recordamos excepciones recientes y comportamientos todavía no documentados. Con agentes, ese modelo deja de escalar muy pronto.

Un modelo no comparte nuestra historia de decisiones ni sabe qué conversación contiene una restricción crítica. Si el proyecto depende de ese conocimiento, hay que convertirlo en algo recuperable: especificaciones, ejemplos, contratos, documentación, pruebas, reglas, registros de decisión o memoria útil.

Esto conecta directamente con [La IA no elimina la ingeniería; la obliga a volverse más explícita](/articles/es/la-ia-no-elimina-la-ingenieria/): al delegar más ejecución, decisiones que antes podían permanecer implícitas tienen que transformarse en criterios observables.

La especificación deja entonces de ser un documento que se escribe al principio y se olvida; pasa a funcionar como una interfaz entre intención y ejecución. La memoria también cambia de función: no necesito que el sistema recuerde «todo», sino aquello que podría modificar una decisión futura.

Ese límite importa porque demasiadas instrucciones, documentación obsoleta o memoria irrelevante pueden dificultar el gobierno tanto como la falta de contexto. El criterio útil no es cuánto puedo almacenar, sino **qué información merece seguir activa y por qué**.

## Seguridad y calidad deben entrar antes de que la aplicación «funcione»

También dejé de ver seguridad, calidad y mantenibilidad como una inspección final que aparece cuando la interfaz ya responde. [NIST, en su Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final), plantea justamente lo contrario. Las prácticas de desarrollo seguro deben integrarse a lo largo del ciclo, no añadirse al final como un parche.

Ese principio encaja especialmente bien con sistemas construidos junto a agentes. Si una funcionalidad puede aparecer en minutos, descubrir al final un modelo de permisos incorrecto, una ruta que expone información sensible o una decisión arquitectónica casi imposible de probar resulta todavía más costoso.

Prefiero incorporar controles durante la construcción: pruebas donde exista comportamiento verificable, validaciones automáticas para reglas claras, revisiones específicas en cambios de alto riesgo y aprobación humana cuando el impacto o la incertidumbre lo justifiquen.

La IA puede ayudar a crear y ejecutar muchos de esos controles; **no debería ser la única autoridad que determine si su propio resultado es aceptable**.

## Orquestar es coordinar decisiones, no acumular agentes

La palabra «orquestación» suele asociarse con varios agentes trabajando en paralelo; para mí, esa definición se queda corta. Orquestar significa decidir **qué trabajo debe ocurrir, en qué orden, con qué contexto, mediante qué herramienta, bajo qué restricciones y con qué evidencia de salida**.

A veces harán falta varios agentes; otras veces bastarán uno solo, buenas herramientas y bastante software determinístico. En [¿Realmente necesitamos otro agente de IA… o el sistema ya debería saberlo?](/articles/es/realmente-necesitamos-otro-agente/) desarrollé precisamente esa frontera: si una decisión ya es estable, repetible y objetivamente verificable, quizá convenga convertirla en una capacidad del sistema en lugar de razonarla de nuevo en cada ejecución.

La [guía de OpenAI para construir agentes](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) apunta en una dirección compatible: empezar con fundamentos simples, ofrecer herramientas e instrucciones claras y usar guardrails. También recomienda conservar mecanismos de intervención humana, especialmente ante fallas repetidas o acciones de alto riesgo.

La idea que me queda es sencilla: **orquestar no significa maximizar autonomía; significa asignarla donde aporta valor y poner límites donde reducen riesgo**.

## La IA también puede auditar; la aceptación necesita una referencia externa

La misma IA que implementa puede colaborar en la revisión: proponer pruebas, buscar inconsistencias, comparar archivos, analizar logs o sugerir escenarios que no habíamos considerado. Un segundo modelo o un agente separado también puede aportar otra perspectiva y reducir la dependencia de un único contexto.

Eso ayuda mucho, pero no resuelve la gobernanza por sí solo. Si el criterio de aceptación es «el agente dice que terminó», la definición se vuelve circular. Necesitamos una referencia externa contra la cual contrastar el resultado: una prueba, un contrato, un requisito, una simulación, datos conocidos, revisión humana o una combinación de esas evidencias.

En ingeniería, aceptar un entregable no consistía únicamente en preguntar al contratista si había terminado. Existían planos, especificaciones, pruebas, punch lists y criterios de cierre; el desarrollo asistido por IA merece la misma disciplina, aunque hoy muchas de esas actividades puedan ejecutarse con mucha mayor velocidad.

Me resulta útil separar dos verbos: **generar** y **aceptar**. La IA puede generar muchísimo; aceptar sigue significando demostrar que el resultado satisface lo que importa.

## La habilidad que gana peso es dirigir el sistema de trabajo

El cambio más interesante no es poder pedir código sin escribir cada línea; es que una parte creciente del trabajo se desplaza hacia decisiones de mayor nivel.

Hay que saber cuándo explorar y cuándo consolidar; cuándo una implementación merece otra iteración y cuándo el problema está mal definido. También hay que distinguir si conviene cambiar de modelo, cambiar de herramienta o corregir algo más básico: la especificación. Y, sobre todo, hay que decidir qué evidencia es suficiente para avanzar.

Ese trabajo exige criterio técnico, aunque no exactamente el mismo que dominaba cuando la implementación manual absorbía la mayor parte del tiempo. La combinación empieza a incluir arquitectura, requisitos, conocimiento del dominio, uso de herramientas, evaluación, QA, seguridad y capacidad para detener el proceso cuando algo «funciona» pero todavía no está bien.

No es simplemente prompting; **es dirección técnica asistida por IA**.

## Antes de llamar «producto» a lo que construimos, usaría siete preguntas

No existe una lista universal capaz de declarar que cualquier software está listo. Aun así, estas siete preguntas me ayudan a distinguir una demostración prometedora de algo que empieza a comportarse como producto:

1. **¿Resuelve el problema correcto?** Que una función opere no significa que responda a la necesidad real.

2. **¿El comportamiento importante está especificado?** Especialmente permisos, estados, errores, límites y excepciones.

3. **¿Puedo demostrar que lo crítico funciona?** No solo mediante una conversación, sino con pruebas, datos, contratos o evidencia observable.

4. **¿Sé qué cambió y puedo volver atrás?** Versionado, trazabilidad y reversión se vuelven esenciales cuando la velocidad aumenta.

5. **¿Qué ocurre cuando algo falla?** Un sistema también se define por cómo degrada, recupera y comunica errores.

6. **¿Qué necesita revisión humana?** Algunas decisiones pueden automatizarse; otras deben conservar un gate explícito por impacto o incertidumbre.

7. **¿Qué sabremos después del despliegue?** Logs, métricas, feedback y observabilidad convierten el uso real en información para la siguiente iteración.

Si no puedo responder varias de estas preguntas, quizá tenga algo valioso; simplemente todavía no lo consideraría listo para asumir las responsabilidades de un producto.

## La distancia desde la idea es menor; la dirección importa más

La IA ha reducido una barrera que durante años mantuvo muchas ideas lejos del software: el costo de traducir intención en una implementación inicial. Eso abre posibilidades enormes para personas que conocen profundamente un problema, aunque no hayan pasado su carrera escribiendo código.

Pero reducir esa barrera no elimina las demás; cambia su importancia relativa. Arquitectura, seguridad, especificación, pruebas, herramientas, contexto, auditoría y criterio humano siguen ahí y, en muchos casos, pasan a convertirse en el verdadero cuello de botella.

Con ese cambio de foco, ya no me impresiona únicamente que una IA pueda construir algo rápido. Me interesa algo más exigente: **si esa velocidad puede convertirse en un sistema comprensible, verificable y mantenible cuando deje de ser una demo y empiece a tener consecuencias reales**.

Ahí está el salto importante. La IA acorta el trayecto desde la idea hasta una primera versión. **La ingeniería, la orquestación y la validación deciden si esa velocidad puede convertirse en algo que otros usen con confianza y que nosotros podamos sostener**.

---

## Referencias

- [DORA — *State of AI-assisted Software Development 2025*](https://dora.dev/research/2025/dora-report/): IA como amplificador de las fortalezas y debilidades del sistema de trabajo.
- [GitHub Docs — *Review AI-generated code*](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code): pruebas, análisis automático, revisión de contexto, requisitos y arquitectura.
- [NIST — *Secure Software Development Framework (SSDF) Version 1.1*](https://csrc.nist.gov/pubs/sp/800/218/final): prácticas de desarrollo seguro integradas en el ciclo de vida del software.
- [OpenAI — *A practical guide to building agents*](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/): herramientas, guardrails, simplicidad arquitectónica e intervención humana.