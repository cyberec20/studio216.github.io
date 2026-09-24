# ¿Realmente necesitamos otro agente… o el sistema ya debería saberlo?

Si trabajas con agentes, quizá ya te haya pasado: aparece una tarea nueva y piensas **“si un agente puede hacerlo, usemos un agente”**. Tiene lógica: hoy pueden leer documentos, interpretar estructuras, escribir código, llamar herramientas, comprobar resultados y corregirse. A veces incluso pueden pedir ayuda a otro agente y continuar. Pero la diferencia importante es ésta: capacidad no es lo mismo que necesidad.

Y últimamente hay una pregunta que me parece más útil que “¿qué más puedo automatizar con IA?”: **¿qué parte del problema conocemos ya suficientemente bien como para dejar de razonarla cada vez?** Porque si la respuesta ya es estable, repetible y verificable, quizá el siguiente paso no sea añadir más inteligencia. Quizá sea convertir lo aprendido en sistema.

## Una factura hace visible la diferencia

Imaginemos una factura electrónica. Si solo recibimos un PDF, una máquina tiene que reconstruir bastante significado: localizar proveedor y cliente, reconocer filas, distinguir impuestos de descuentos, asociar números con conceptos y entender qué elementos dependen de cuáles. Un modelo multimodal puede ayudar mucho en ese escenario. Ahora añadamos otra pieza: junto al PDF recibimos también un XML estructurado.

De pronto, una parte importante de la interpretación desaparece. El proveedor ya tiene un campo. La fecha tiene un campo. Los impuestos tienen campos definidos. Las líneas de producto tienen jerarquía. Los valores ya vienen asociados con aquello que significan.

Esto no es una idea puramente teórica. El estándar europeo EN 16931 define precisamente un modelo semántico para los elementos centrales de una factura electrónica y contempla su transporte mediante sintaxis estructuradas como UBL y CII. En otras palabras, hay casos donde el significado ya viene formalizado para ser procesado por máquinas. Entonces la pregunta cambia: **¿por qué pedirle a un LLM que vuelva a descubrir algo que el sistema ya sabe?**

Podemos parsear el XML, comprobar totales, validar reglas y transformar los datos a nuestro propio modelo. Si una condición debe producir de forma consistente la misma respuesta, el valor está precisamente en que podamos comprobarlo sin depender de una interpretación nueva cada vez. Ahí no necesito creatividad: necesito certeza.

## La frontera es donde la IA empieza a ganar valor

La distinción importante no es “IA contra software tradicional”. Es otra: **¿esto ya está suficientemente entendido o todavía contiene incertidumbre?** En la misma factura pueden aparecer ambas cosas. Hay partes totalmente conocidas: un total debe cuadrar, un identificador debe cumplir una estructura, una regla fiscal conocida debe aplicarse de forma consistente, un workflow puede tener estados y transiciones explícitos.

Y luego aparece algo diferente: una descripción ambigua, un gasto difícil de clasificar, una excepción que no habíamos visto o un caso para el que todavía no existe una regla. Ahora sí tenemos una pregunta. Ahí la IA resulta mucho más interesante: interpreta, propone, compara posibilidades, ayuda a investigar. Un humano valida el resultado y el proceso continúa. Hasta que ocurre algo todavía más interesante.

La misma excepción vuelve a aparecer; después otra vez, y otra. En algún momento deja de ser realmente una excepción. **Hemos aprendido algo.** Entonces conviene preguntar si ese aprendizaje debe seguir viviendo únicamente en una conversación o si ya merece convertirse en una capacidad permanente. El patrón puede resumirse así:

```text
conocido → software

desconocido → IA

desconocido recurrente
→ aprendizaje
→ regla
→ prueba
→ software
```

El agente no desaparece; simplemente se desplaza hacia la siguiente frontera. Hay una frase que me ayuda a recordarlo: **la IA explora la frontera; el software consolida el territorio.**

## Aprender debería dejar algo detrás

Hablamos mucho de memoria de agentes, contextos persistentes, historiales y bases de conocimiento. Todo eso puede ser útil. Pero hay otra forma de memoria menos vistosa: **hacer que lo aprendido cambie el sistema**. Si resolvemos una excepción, encontramos una regla general y la convertimos en código con una prueba, la próxima vez no necesitamos reconstruir toda la conversación. El conocimiento quedó incorporado.

Eso también cambia cómo entiendo la madurez de un sistema de IA. Un sistema inmaduro puede necesitar mucha interpretación porque todavía no ha formalizado lo que sabe. Uno que madura debería absorber parte de ese conocimiento en reglas, contratos, validaciones, tests, schemas y estados explícitos.

No se trata de sacar a la IA del sistema. Se trata de reservarla para donde todavía aporta algo que las reglas no pueden resolver por sí solas.

NIST da una razón práctica para ser cuidadosos con esa frontera: su perfil de riesgo para IA generativa trata la **confabulación** —respuestas falsas o inconsistentes presentadas con aparente confianza— como un riesgo inherente de estos sistemas y recomienda procesos de prueba, evaluación, validación y verificación, además de comparar resultados con datos conocidos cuando sea posible.

Eso no significa que un LLM sea “malo” para automatizar. Significa algo más útil: **si existe una comprobación objetiva, úsala**. Podemos dejar que el modelo proponga y, al mismo tiempo, impedir que la validación dependa del modelo.

## De una corrección humana a una regla del sistema

Aquí aparece una consecuencia que me interesa especialmente por los agentes de programación. Durante años, muchas personas conocían procesos que podían automatizarse, pero existía una distancia enorme entre “sé cómo funciona” y “puedo convertirlo en software”. Había que traducir el conocimiento del dominio a requerimientos, luego a código, después probarlo y descubrir si lo implementado representaba realmente el proceso. Los agentes están acortando esa distancia.

Un experto puede trabajar con un agente sin dominar cada librería ni recordar toda la sintaxis. Pero conserva algo que sigue siendo fundamental: **sabe cuándo el resultado está mal**. Puede decir: “Ésa no es la regla.” “En este caso hay una excepción.” “Ese dato no significa lo que estás suponiendo.” “El proceso debe detenerse aquí.” La parte realmente valiosa viene después.

Si esa corrección queda únicamente en el chat, aprendimos algo… pero el sistema no necesariamente lo aprendió. Si la convertimos en una regla, una prueba o un contrato, la siguiente ejecución empieza desde un nivel más alto. Eso se parece mucho a una idea clásica de ingeniería: **Plan, Do, Check, Act**. Probar, comprobar, corregir y consolidar la mejora antes de repetir el ciclo.

La herramienta cambió; la lógica de mejora continua no tanto.

## El agente puede cambiar; la capacidad debería permanecer

Hay otra ventaja de consolidar lo aprendido. Hoy puedo construir con un modelo. Mañana puedo cambiar de proveedor, aparecerá una herramienta mejor o simplemente decidiré usar otra arquitectura. Si el conocimiento operativo vive sobre todo en prompts, conversaciones y comportamientos particulares del agente, parte de mi sistema queda atada a esa herramienta. Pero si durante el trabajo convertimos ese conocimiento en código, pruebas, schemas, workflows y datos estructurados, la situación cambia.

El agente puede cambiar; la capacidad permanece. Ésa es una distinción que considero cada vez más importante: **la IA puede ayudar a construir el activo sin tener que convertirse ella misma en el activo**. Un modelo puede ayudarnos a descubrir una regla. Pero una vez que esa regla es suficientemente clara y crítica, prefiero poder verla, probarla, versionarla y trasladarla.

## Antes de añadir otro agente, probaría esto

Puede que te preguntes por dónde empezar la próxima vez que un proceso parezca pedir “otro agente”. Yo haría una comprobación rápida:

- **¿La entrada ya viene estructurada?** Si existe un campo, schema, API o formato explícito, quizá no haga falta volver a interpretar lo que ya está representado.
- **¿La decisión depende de una regla conocida?** Si la misma condición debería producir la misma respuesta, puede ser candidata a código.
- **¿Existe una prueba objetiva del resultado?** Si existe, conviene que esa verificación sea determinística aunque un modelo participe antes.
- **¿La excepción sigue siendo realmente una excepción?** Si aparece constantemente y ya comprendemos el patrón, quizá deba consolidarse.
- **Si mañana cambio de modelo, qué conocimiento permanece?** La respuesta revela cuánto aprendizaje pertenece realmente al sistema.

No son mandamientos; son un filtro. A veces la respuesta seguirá siendo “necesito un agente”. Perfecto. Ese es exactamente el lugar donde quiero usarlo. Pero otras veces descubriremos que estábamos gastando inteligencia en volver a decidir algo que ya habíamos decidido muchas veces. Y ésa es la parte que me parece más interesante. Durante un tiempo, la pregunta dominante fue: **¿qué más puedo hacer con agentes?**

Hoy sigo haciéndomela. Pero junto a ella pongo otra: **¿qué parte de lo que un agente hace hoy debería dejar de necesitar un agente mañana?** No porque quiera usar menos IA. Porque quiero que cada ciclo deje algo detrás. Una regla más clara. Una prueba nueva. Un contrato más preciso. Una excepción menos ambigua. Una capacidad que permanezca cuando la conversación termine.

La IA explora la frontera; nosotros verificamos lo aprendido; el software consolida el territorio. Y entonces la frontera vuelve a moverse. La próxima vez que pienses “aquí podría poner otro agente”, prueba primero con una pregunta más incómoda: **¿aquí necesito realmente inteligencia… o ya conozco suficientemente bien la respuesta como para convertirla en software?**

---

## Referencias

- Comisión Europea, **EN 16931 / European standard on eInvoicing**: modelo semántico y sintaxis estructuradas para facturas electrónicas. https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108926/Compliance+with+eInvoicing+standard
- NIST, **Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)**: confabulación, supervisión humana y procesos de test, evaluation, validation and verification (TEVV). https://doi.org/10.6028/NIST.AI.600-1
- ISO 9001, **Plan-Do-Check-Act cycle**. https://www.iso.org/iso/iso9001_2015_process_approach.pdf