# Cómo trabajar mejor con la IA: del «prompt perfecto» a una mejor colaboración

Si estás empezando a usar IA, quizá ya te hayas encontrado con listas de fórmulas para escribir «el prompt perfecto». Es fácil pensar que la calidad de tu respuesta depende de encontrar la frase correcta. Pero trabajar mejor con la IA depende menos de una fórmula. Depende más de hacer explícitos tu objetivo, el contexto y las restricciones. También conviene definir el resultado esperado y cómo vas a revisar lo que devuelve.

En diciembre de 2023 publiqué un artículo titulado [**«Interactuando con la IA: ¿Cómo Mejoré Mis Prompts?»**](https://www.linkedin.com/feed/update/urn:li:ugcPost:7141807641848152064/ "Artículo original en LinkedIn"). En aquel momento hablaba de GPT-3.5, BARD, Bing y de algo que entonces parecía casi una habilidad nueva: aprender a formular mejores instrucciones para obtener mejores respuestas.

La idea central no era equivocada. Una parte importante sigue vigente: si explicas mejor lo que necesitas, la IA suele tener más posibilidades de ayudarte bien. Lo que cambiaría hoy es el foco. Después de varios años trabajando con modelos mucho más capaces, herramientas, archivos, búsqueda, código y agentes, ya no empezaría enseñándole a alguien a construir «el prompt perfecto». Empezaría por algo más útil y más duradero: **aprender a trabajar con la IA como un proceso de comunicación, revisión y mejora**.

El problema rara vez es encontrar una frase especial. Suele ser que nosotros sabemos cosas que la IA todavía no sabe sobre nuestra tarea… y olvidamos decírselas.

## La ingeniería de prompts no es un conjuro

[OpenAI define actualmente la ingeniería de prompts][openai-prompting] como el proceso de diseñar y optimizar instrucciones para guiar las respuestas de un modelo. Sigue siendo útil, pero no es una colección de frases mágicas.

Durante un tiempo se popularizaron fórmulas como «Actúa como un experto en…» o «Eres un especialista senior en…». Asignar un rol puede ser útil: las guías actuales de [Anthropic][anthropic-prompting] y [Google][google-prompting] lo contemplan como una manera de orientar comportamiento, tono o perspectiva. Pero un rol no sustituye el contexto, ni convierte una instrucción vaga en una buena instrucción.

Compáralo con pedir ayuda a una persona competente. Si le dices: «Hazme una presentación», probablemente tendrá que adivinar para quién es, qué quieres conseguir, cuánto debe durar, qué información puede usar y qué tono esperas. Si le dices: «Necesito presentar este proyecto a un cliente no técnico; tengo diez minutos, quiero que entienda el problema, la propuesta y los próximos pasos, y necesito seis diapositivas con poco texto», la tarea cambia por completo.

Con la IA ocurre algo parecido. Las guías actuales de [OpenAI][openai-prompting], [Anthropic][anthropic-prompting] y [Google][google-prompting] convergen en principios bastante menos mágicos que muchas fórmulas virales: **ser claro, aportar contexto, especificar el resultado esperado y usar ejemplos cuando ayuden**. No necesitas memorizar palabras especiales; necesitas reducir la cantidad de cosas importantes que el modelo tendría que adivinar.

## Cómo escribir un mejor prompt: define el objetivo y qué significa «bien»

Una buena petición suele aclarar cuatro cosas: qué quiero conseguir, qué contexto necesita conocer, qué restricciones importan y cómo quiero recibir el resultado. Y una quinta pregunta ayuda mucho: ¿qué tendría que revisar antes de darlo por bueno?

No hace falta convertir esto en una plantilla rígida. A veces una frase basta. Si preguntas «¿Cuánto es 18 % de 450?», añadir cinco párrafos de contexto solo empeora la interacción. Pero cuando la tarea tiene matices, el contexto deja de ser decoración y se convierte en parte del problema.

Por ejemplo, «Escribe un correo para solicitar una entrevista de trabajo» puede producir algo razonable. Sin embargo, cambia bastante si añades que ya hablaste con la reclutadora y que el puesto es de ingeniería. También aclaras que quieres sonar profesional pero cercano, que no deseas exagerar experiencia que no tienes y que el correo debe caber en una pantalla. Ya no estás buscando un prompt más sofisticado; estás haciendo explícitos tus criterios.

Eso es importante porque **la IA no conoce automáticamente la intención que tienes detrás de una frase**. Puede inferirla, y a veces lo hará muy bien, pero inferir no es lo mismo que saber.

## Si no sabes qué contexto dar, pregunta qué falta

En el artículo de 2023 contaba una estrategia que todavía rescataría, aunque hoy la usaría de otra manera: preguntarle a la propia IA cómo plantear la tarea.

Antes podía formularlo como: «¿Cómo debe ser el prompt para…?». Hoy prefiero una interacción más directa: «Quiero conseguir este resultado. Antes de hacerlo, dime qué información te falta y hazme las preguntas necesarias». Esa pequeña diferencia evita convertir a la IA en una máquina que fabrica prompts para otra IA; la convierte en una contraparte que ayuda a completar el brief.

Supón que quieres preparar tu CV para una vacante y no sabes por dónde empezar. Podrías escribir:

> Quiero adaptar mi CV a esta vacante sin inventar experiencia. Te compartiré la descripción del puesto y mi CV actual. Antes de reescribirlo, identifica qué información te falta, qué requisitos parecen importantes y qué puntos deberíamos verificar conmigo.

La respuesta inicial deja de ser el producto final; se convierte en una etapa para mejorar el problema antes de intentar resolverlo. Para alguien que comienza, este cambio de mentalidad es enorme: **no tienes que saber formular todo perfectamente desde el primer mensaje**.

## Usa un proceso iterativo en lugar de perseguir un primer prompt perfecto

[OpenAI describe el refinamiento iterativo][openai-prompting] como una práctica general de prompting. Google también describe la ingeniería de prompts como un proceso iterativo de diseñar una instrucción, evaluar la respuesta y ajustar lo que aportas. Esto coincide con algo que ya intuía en 2023 cuando recomendaba utilizar varios prompts para tareas complejas.

La diferencia es que hoy no lo vería simplemente como «dividir un prompt grande en varios prompts pequeños». Lo vería como un ciclo:

**pedir → revisar → detectar qué falta → corregir → volver a pedir**.

Si la primera respuesta se desvía, no necesitas empezar desde cero en cada ocasión. Puedes decir qué parte sí sirve, qué parte no, qué supuesto fue incorrecto o qué criterio no quedó claro. Esa corrección también es contexto.

Y para tareas complejas conviene separar momentos. Antes de pedirle a la IA que produzca veinte páginas, modifique cien archivos o diseñe una solución completa, puedes pedirle primero que resuma lo que entendió, enumere sus supuestos, señale información faltante y proponga un plan. No porque repetir «confirma que comprendes» tenga poderes especiales, sino porque hacer visibles los supuestos te da algo concreto que revisar antes de avanzar.

## Dale ejemplos, archivos o capturas cuando transmitan mejor el contexto

Otra evolución importante es que hoy «hablar con la IA» no significa necesariamente escribir solamente texto. Dependiendo de la herramienta, puedes proporcionar documentos, imágenes, capturas, audio, tablas, código o enlaces; además, las guías de [OpenAI][openai-api-prompting], [Anthropic][anthropic-prompting] y Google destacan el valor de los ejemplos para orientar formato, estilo y estructura.

Si quieres que un informe tenga cierto formato, quizá sea más eficaz mostrar un buen informe y decir qué quieres conservar de él que describir durante quince líneas dónde debe ir cada elemento. Si quieres que la IA revise una hoja de cálculo, compartir la hoja puede ser mejor que intentar describirla de memoria. Si algo en una interfaz está mal, una captura puede eliminar varias rondas de explicación.

Aquí aparece una regla sencilla: **cuando tengas contexto real, dáselo; cuando tengas un buen ejemplo, muéstralo**. No obligues al modelo a reconstruir información que tú ya posees.

## Verifica las respuestas importantes: una respuesta convincente todavía puede estar equivocada

Hay un punto del artículo original que hoy reforzaría mucho más. La IA puede ser útil, rápida y sorprendentemente competente; eso no la convierte en una fuente infalible.

[OpenAI advierte que ChatGPT puede producir información incorrecta o engañosa y sonar seguro mientras se equivoca][openai-truth]. [NIST utiliza el término *confabulation*][nist-genai] para describir contenido falso o erróneo que un sistema generativo puede presentar con confianza. Las capacidades han mejorado de forma extraordinaria desde 2023, pero la necesidad de verificar no desapareció con ellas.

Por eso el nivel de comprobación debería crecer con la importancia de la decisión. Para una lluvia de ideas, quizá basta con leer y escoger. Cuando la respuesta incluye una fecha, una cita, una norma, un cálculo o una referencia técnica, conviene contrastarla. Lo mismo ocurre con una decisión financiera o un cambio de código que puede afectar producción: usa la fuente, los datos, una herramienta apropiada o una prueba objetiva.

También puedes pedirle a la IA que busque fuentes, distinga hechos de supuestos o señale aquello de lo que no está segura. Aun así, **la verificación importante no debe reducirse a preguntarle al mismo sistema si su respuesta anterior era correcta**.

## Una plantilla sencilla para empezar a trabajar con IA

Si estás comenzando y no sabes qué escribir, no necesitas una biblioteca de cien prompts. Puedes iniciar con algo tan simple como esto:

> Quiero **[resultado]**. El contexto importante es **[contexto]**. Debes respetar **[restricciones o criterios]**. Entrégamelo como **[formato]**. Si te falta información importante para hacerlo bien, pregúntame antes de asumirla.

Por ejemplo:

> Quiero entender este informe técnico sin perder sus ideas importantes. Soy ingeniero, pero no especialista en este tema. Explícamelo en lenguaje claro, conserva los términos técnicos que sean necesarios y organiza la respuesta en: idea principal, conceptos que debo entender, riesgos y preguntas que debería investigar después. Si una conclusión no está respaldada por el documento, indícalo en lugar de completarla por tu cuenta.

Eso ya contiene mucho de lo que importa: objetivo, contexto, criterio, formato y un límite para las suposiciones. Pero entonces comienza la parte que ninguna plantilla puede hacer por ti: leer la respuesta y decidir si realmente sirve.

## De mejores prompts a una mejor colaboración con la IA

Si hoy tuviera que resumir lo aprendido desde aquel artículo de 2023, diría que **mejorar el prompt fue solamente el primer escalón**. El siguiente fue aprender a dar contexto; después, a trabajar por etapas, revisar supuestos, aportar ejemplos, usar herramientas y verificar resultados. Con tareas más complejas, esa misma lógica termina convirtiéndose en especificaciones, pruebas, workflows y agentes.

Esa evolución abre además otra pregunta: cuando una decisión ya se vuelve estable, repetible y verificable, [¿debería seguir necesitando un agente?](/articles/es/realmente-necesitamos-otro-agente/) La frontera útil cambia a medida que el sistema aprende.

Pero no necesitas empezar allí. Si acabas de llegar a la IA, empieza por algo más sencillo: expresa lo que quieres con claridad y comparte lo que la otra parte necesita saber. Define qué significa un buen resultado; después, trata la primera respuesta como el comienzo de la conversación, no como un veredicto.

No busques una frase mágica que obligue a la IA a entenderte. **Haz visible tu intención, mejora el contexto y conserva tu criterio.** Esa habilidad seguirá siendo útil aunque cambien los modelos, las interfaces y las palabras que usemos para describirlos.

---

## Referencias

- OpenAI, **Prompt engineering best practices for ChatGPT**: https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt
- OpenAI, **Best practices for prompt engineering with the OpenAI API**: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- Anthropic, **Prompting best practices**: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables
- Google Cloud, **Overview of prompting strategies**: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/prompt-design-strategies
- OpenAI, **Does ChatGPT tell the truth?**: https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth
- NIST, **Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)**: https://doi.org/10.6028/NIST.AI.600-1

*Este artículo actualiza [«Interactuando con la IA: ¿Cómo Mejoré Mis Prompts?»](https://www.linkedin.com/feed/update/urn:li:ugcPost:7141807641848152064/ "Artículo original en LinkedIn"), publicado originalmente el 16 de diciembre de 2023.*

[openai-prompting]: https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt
[openai-api-prompting]: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
[anthropic-prompting]: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables
[google-prompting]: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/prompt-design-strategies
[openai-truth]: https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth
[nist-genai]: https://doi.org/10.6028/NIST.AI.600-1