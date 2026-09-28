# La IA no elimina la ingeniería; la obliga a volverse más explícita

Si tú ya trabajas con IA para construir software, probablemente reconoces una de sus promesas más atractivas: **«dile lo que quieres y te lo construye»**.

Y, en cierto sentido, es verdad: un agente puede leer tu repositorio, proponer una arquitectura, escribir código, ejecutar pruebas y acelerar mucho tu proceso.

El problema aparece después: **producir un resultado no es lo mismo que demostrar que ese resultado cumple**.

Quienes venimos de ingeniería conocemos bien esa distancia. Una instalación eléctrica no se acepta porque el contratista diga «terminé»; una obra no se libera porque visualmente parezca lista; un equipo no entra en servicio porque alguien asegure que funciona. Hay planos, especificaciones, criterios de aceptación, inspecciones, pruebas, observaciones y cierre de hallazgos.

La IA no elimina esa lógica; la vuelve todavía más necesaria, porque cuanto más rápido puede producir una primera versión, más importante se vuelve definir **qué significa que esa versión sea correcta**.

## La primera entrega no es la aceptación

Esta fue una de las primeras ideas que trasladé de la ingeniería tradicional al trabajo con IA.

En un proyecto industrial, un proveedor puede entregar un tablero, una memoria de cálculo o un plano; ese entregable puede verse bien y, aun así, contener una desviación. Por eso existe la revisión técnica: se contrasta lo entregado con aquello que debía cumplirse.

Con software generado por IA ocurre algo parecido: el código puede compilar, las pruebas existentes pueden pasar y la interfaz puede verse correcta. El agente incluso puede informar que terminó su plan; aun así, podemos tener el problema equivocado resuelto de manera impecable.

[GitHub](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code) lo plantea de forma muy concreta en su propia guía para revisar código generado por IA: primero recomienda ejecutar pruebas y análisis automáticos; después, comprobar que el cambio **encaje con el propósito y la arquitectura del proyecto**. La pregunta no es solo si el código funciona, sino si resuelve el problema correcto y respeta las restricciones que importan.

Ahí aparece una distinción que me resulta útil: **generar es producir una propuesta; aceptar es demostrar que la propuesta satisface un criterio**. La segunda parte sigue siendo ingeniería.

## La IA desplaza el cuello de botella hacia la definición

Cuando escribir código era la parte más costosa del proceso, era natural dedicar gran parte de la atención a la implementación; ahora esa relación está cambiando.

Si un agente puede producir en minutos algo que antes requería horas, la pregunta deja de ser solamente «¿cómo implemento esto?»; empiezan a pesar más otras preguntas:

- ¿Qué problema estamos resolviendo realmente?
- ¿Qué comportamiento debe conservarse?
- ¿Qué restricciones no pueden romperse?
- ¿Qué riesgos importan?
- ¿Qué evidencia demostraría que el cambio está terminado?
- ¿Qué desviaciones pueden aceptarse y cuáles no?

En otras palabras: **la IA abarata parte de la ejecución, pero encarece la ambigüedad**.

Una instrucción vaga puede convertirse rápidamente en mucho código, muchos cambios y mucho trabajo que revisar; la velocidad amplifica tanto una buena definición como una mala.

El informe [DORA 2025](https://dora.dev/research/2025/dora-report/) sobre desarrollo de software asistido por IA llega a una idea parecida desde otro ángulo. Describe la IA como un **amplificador** de las fortalezas y debilidades que ya existen en un equipo y en su sistema de trabajo.

En [el resumen publicado por Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report), el 90 % de los profesionales tecnológicos encuestados reporta usar IA en el trabajo; más del 80 % dice percibir ganancias de productividad. Al mismo tiempo, el 30 % declara poca o ninguna confianza en el código generado por IA.

Esos porcentajes provienen de una **muestra basada en encuesta** y no demuestran una mejora universal de productividad; sin embargo, la combinación es reveladora: **usar más IA y confiar ciegamente en ella no son la misma cosa**.

## Cuando la especificación se vuelve parte del sistema

En ingeniería, una buena especificación no existe para llenar documentación; existe para reducir interpretaciones incompatibles.

[NASA](https://www.nasa.gov/reference/system-engineering-handbook-appendix/), por ejemplo, dedica parte de su *Systems Engineering Handbook* a cómo escribir requisitos y a cómo definir, desde el desarrollo de esos requisitos, el método con el que después serán verificados. Su matriz de verificación conecta cada requisito con la forma de demostrar que se cumplió.

Esa idea se vuelve especialmente poderosa cuando trabajamos con agentes. No basta con decir:

> Implementa esta funcionalidad.

Es mucho más útil que el sistema conozca también:

- el objetivo.
- el alcance.
- las restricciones.
- las interfaces que no deben romperse.
- los criterios de aceptación.
- las pruebas esperadas.
- los riesgos que requieren revisión.
- aquello que queda explícitamente fuera de alcance.

Esto no significa convertir cada tarea en un documento de cincuenta páginas; significa hacer visible aquello que, si permanece implícito, obligará al modelo a adivinar. Y cuanto más autónomo sea el agente, menos quiero que las decisiones importantes dependan de adivinanzas.

Por eso he terminado viendo la especificación como algo más que una instrucción inicial: puede convertirse en una **interfaz entre intención y ejecución**, algo que guía la implementación, alimenta las pruebas y, después, permite auditar el resultado.

## Mi flujo se parece más a una punch list que a un prompt

La analogía que más me ha servido viene de la fiscalización y el control de calidad.

Cuando una obra está cerca de terminar, la revisión no consiste en preguntar al contratista si cree que todo está bien: se inspecciona el entregable y los incumplimientos se convierten en hallazgos concretos. Esos hallazgos entran en una *punch list*; luego se corrigen, se verifican otra vez y, finalmente, se cierran.

Mi forma de trabajar con IA terminó pareciéndose mucho a eso:

```text
planificar
→ implementar con IA
→ auditar
→ convertir desviaciones en hallazgos
→ corregir
→ verificar de nuevo
→ aceptar
```

La utilidad del flujo está en que cada etapa deja evidencia. La planificación hace explícito lo esperado; la implementación produce el cambio; la auditoría compara realidad contra intención. Los hallazgos convierten un «algo no me convence» en problemas verificables; la corrección responde a esos problemas; la reauditoría comprueba que no solo cambiamos cosas, sino que cerramos lo que realmente estaba pendiente.

Eso también explica por qué una segunda IA puede ayudar a revisar, pero no resuelve por sí sola el problema de gobernanza. Un modelo puede implementar; otro puede auditar; incluso podemos usar ciclos de evaluación y mejora como el patrón *evaluator-optimizer* que describe [Anthropic](https://www.anthropic.com/engineering/building-effective-agents), donde una salida se evalúa contra criterios claros y vuelve a iterarse. Pero entonces alguien tiene que decidir cuáles son esos criterios y cuándo la evidencia es suficiente.

## La autoridad técnica no desaparece; cambia de lugar

Este es el cambio que considero más importante: si la IA escribe una parte creciente del código, el valor humano no desaparece; se desplaza.

Antes, una parte importante del trabajo consistía en producir directamente cada línea, cálculo, documento o procedimiento; ahora podemos delegar más ejecución. Eso libera tiempo, pero también hace más visible otro tipo de responsabilidad: **definir, limitar, verificar y aceptar**.

El profesional sigue teniendo que decidir qué se quiere construir, qué riesgo es razonable, qué arquitectura debe preservarse, qué información es confiable, qué excepción necesita juicio y qué resultado puede pasar a producción.

[NIST](https://airc.nist.gov/) utiliza el término **TEVV —testing, evaluation, verification and validation—** como parte central de su enfoque para gestionar riesgos de sistemas de IA. La idea no es desconfiar de toda salida generativa, sino algo más útil: cuando una afirmación o un comportamiento pueden comprobarse, conviene diseñar la comprobación en lugar de sustituirla por confianza.

Esto también conecta con una pregunta que desarrollé después en [¿Realmente necesitamos otro agente de IA… o el sistema ya debería saberlo?](/articles/es/realmente-necesitamos-otro-agente/). Cuando una decisión ya es estable, repetible y verificable, parte de ese conocimiento puede dejar de vivir en conversaciones y convertirse en reglas, pruebas y software determinístico.

La IA puede ayudarnos a llegar ahí; la aceptación técnica, sin embargo, necesita un punto de referencia que exista fuera de la propia respuesta del modelo.

## La ingeniería se vuelve más explícita porque lo implícito escala mal

Cuando trabajas solo, muchas decisiones pueden vivir en tu cabeza: sabes qué parte del sistema no quieres tocar y recuerdas por qué una regla existe. También intuyes qué excepción es importante; reconoces una solución que «funciona», pero viola la arquitectura.

Un agente no comparte automáticamente esa historia; si la decisión importa, hay que sacarla de la cabeza y convertirla en contexto, regla, prueba, contrato, ejemplo o criterio de aceptación.

Eso puede parecer más trabajo al principio, pero también produce algo valioso: **el conocimiento deja de depender exclusivamente de la memoria de una persona o de una conversación concreta**.

Esa es una de las razones por las que mi manera de [trabajar mejor con la IA](/articles/es/interactuando-con-la-ia/) ha ido alejándose de la búsqueda del «prompt perfecto». A medida que la tarea crece, el problema deja de ser encontrar una frase brillante; pasa a ser construir suficiente contexto y suficientes controles para que el trabajo pueda avanzar sin perder la intención.

La especificación no elimina el juicio, sino que lo hace visible; la prueba no elimina la creatividad, sino que define qué no queremos romper. La auditoría no ralentiza necesariamente a la IA; evita que confundamos velocidad con cierre.

## Entonces, ¿qué debería quedar explícito?

No existe una plantilla universal; pero, antes de delegar una tarea importante a un agente, intento poder responder, al menos, estas preguntas:

- **¿Qué resultado queremos?** No solo qué archivo debe cambiar, sino qué comportamiento debería existir al final.
- **¿Qué restricciones importan?** Arquitectura, seguridad, datos, compatibilidad, alcance, costos o cualquier límite real.
- **¿Cómo sabremos que cumple?** Pruebas, criterios observables, comparaciones, validadores o revisión humana.
- **¿Qué evidencia debe quedar?** Logs, tests, diffs, reportes, artefactos o cualquier rastro que permita auditar lo hecho.
- **¿Quién acepta el resultado?** Un agente puede declarar terminado su trabajo; eso no significa que el sistema deba declararlo aceptado.

La diferencia parece pequeña, pero cambia el tipo de conversación que tenemos con la IA: ya no estamos preguntando únicamente **«¿puedes hacerlo?»**; estamos definiendo **«esto es lo que significa hacerlo bien»**.

## La velocidad no elimina la responsabilidad

La IA puede comprimir enormemente el tiempo entre una idea y una primera implementación; eso es valioso, y no veo ninguna razón para renunciar a esa ventaja.

Pero cuanto más rápida es la ejecución, más costoso puede resultar dejar ambiguo el objetivo. Por eso no veo la ingeniería y la IA como fuerzas que compiten, sino como una redistribución del trabajo. La máquina puede asumir más producción, exploración y repetición; el humano puede dedicar más atención a intención, arquitectura, riesgo, evidencia y aceptación.

**La IA no elimina la ingeniería; hace que las decisiones de ingeniería que antes podían permanecer implícitas tengan que volverse visibles: más explícitas, más trazables, más verificables.**

Esa es, para mí, una de las transformaciones más interesantes del trabajo con IA: no dejamos de pensar como ingenieros; necesitamos expresar mucho mejor qué significa que algo esté realmente bien hecho.

---

## Referencias

- DORA, **State of AI-assisted Software Development 2025**: https://dora.dev/research/2025/dora-report/
- Google Cloud, **Announcing the 2025 DORA Report: State of AI-Assisted Software Development**: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- GitHub Docs, **Review AI-generated code**: https://docs.github.com/en/copilot/tutorials/review-ai-generated-code
- NASA, **Systems Engineering Handbook — Requirements Verification Matrix and Validation Plan**: https://www.nasa.gov/reference/system-engineering-handbook-appendix/
- NIST, **AI Risk Management Framework / AI Resource Center**: https://airc.nist.gov/
- Anthropic, **Building Effective AI Agents — evaluator-optimizer workflow**: https://www.anthropic.com/engineering/building-effective-agents