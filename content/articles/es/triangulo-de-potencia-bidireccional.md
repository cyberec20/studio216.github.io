# Triángulo de potencia bidireccional: ¿por qué empezar siempre por el mismo dato?

**54,1 A o 60,1 A.** Dos resultados de corriente para un mismo motor de 30 kW; las dos operaciones son algebraicamente correctas. El problema está en una hipótesis que suele pasar inadvertida: esos **30 kW corresponden al eje**, no a la entrada eléctrica.

La ficha indica un rendimiento del **90 %**, el proyecto trabaja a **400 V** y el factor de potencia previsto es **0,80**. Si necesitas estimar la corriente y la calculadora abierta exige introducirla para comenzar, el procedimiento está al revés. Las ecuaciones no fallan; el flujo de trabajo obliga a resolver por fuera lo que debería ayudar a descubrir. ¿Cómo reconocer cuál de los dos resultados describe realmente ese motor?

Ahí aparece un problema habitual en ingeniería: **el dato conocido no siempre coincide con la casilla que espera la herramienta**. Una memoria de cargas proporciona kW; la placa de un transformador indica kVA; una medición de campo entrega amperios. Cambia el punto de partida, no la física. ¿Por qué, entonces, reconstruir el mismo análisis cada vez?

El [módulo de potencia de WattsWise](/wattswise/) nació de esa necesidad: permitir distintos recorridos de cálculo válidos, conservar las hipótesis y actualizar las magnitudes dependientes. El triángulo sigue siendo el de siempre; lo que cambia es la forma de trabajar con él.


## El problema no es Excel: es perder el contexto entre cálculos

Una hoja de cálculo bien diseñada puede resolver ecuaciones en ambos sentidos. La fricción comienza cuando el trabajo está repartido entre archivos, versiones, calculadoras web y anotaciones: cada herramienta exige un conjunto distinto de entradas y obliga a verificar qué supuestos viajaron con los números. Si cambia la tensión, ¿se actualizó también la corriente? Si los kW proceden de la placa de un motor, ¿representan potencia mecánica o eléctrica? La diferencia puede quedar escondida detrás de un resultado aparentemente razonable.

Tres situaciones muestran por qué importa disponer de distintos puntos de partida. Con **kW y factor de potencia** se obtienen kVA y la magnitud de kVAR. Con **kW y kVAR** se reconstruye el triángulo; con **kVA y tensión**, se calcula la corriente correspondiente bajo las condiciones del sistema. Esta última operación no revela, por sí sola, la carga real que circula por un transformador. Su potencia nominal expresa capacidad, no una medición en servicio.

La ventaja de un flujo bidireccional no consiste en calcular algo que Excel no pueda calcular. La diferencia está en **dejar de convertir al ingeniero en el intermediario entre fórmulas correctas pero desconectadas**. Es el mismo problema que motivó la experiencia original con WattsWise: no faltaba álgebra, faltaba continuidad entre tareas. Cuando esa continuidad existe, la siguiente comprobación resulta más sencilla y es menos probable que una hipótesis quede olvidada.

## El triángulo sigue siendo sencillo; elegir bien las entradas no tanto

Para el modelo clásico con formas de onda sinusoidales, **P** es la potencia activa (kW); **Q**, la potencia reactiva (kVAR); y **S**, la potencia aparente (kVA). Su relación geométrica es `S² = P² + Q²`. El factor de potencia verdadero se define como `FP = P/S`; en las condiciones sinusoidales del modelo, también puede expresarse como `cos φ`.

Lo interesante aparece al invertir las relaciones, sin cambiar las unidades ni los supuestos. Si se conocen **P y FP**, se obtiene `S = P/FP` y luego `|Q| = √(S² − P²)`; con **P y Q**, se calcula `S = √(P² + Q²)` y se recupera `FP = P/S`. Para la corriente, la relación monofásica es `I = 1000·S(kVA)/V`; en un sistema trifásico equilibrado, `I = 1000·S(kVA)/(√3·V_LL)`, usando tensión eficaz entre líneas y corriente de línea.

Existe una limitación que ninguna interfaz debería disimular: **bidireccional no significa adivinar**. Hace falta información independiente suficiente para obtener una solución única; además, la magnitud de Q no indica si la carga es inductiva o capacitiva. Esa dirección debe conocerse o seleccionarse. Cuando cambia un valor, también es necesario decidir cuáles permanecerán fijos; de lo contrario, el recálculo podría ser matemáticamente posible y técnicamente inadecuado.

## La prueba de los 30 kW: un solo motor, dos caminos hacia la respuesta

Regresemos al motor inicial. Es un **ejemplo didáctico**, no la ficha de un equipo real ni una recomendación de dimensionamiento. Sus datos son: `30 kW` de salida mecánica, `η = 0,90`, factor de potencia de desplazamiento `0,80` y alimentación trifásica equilibrada a `400 V` entre líneas. El primer resultado, **54,1 A**, aparece al tratar equivocadamente los 30 kW mecánicos como potencia eléctrica. El segundo, **60,1 A**, incorpora el rendimiento antes de resolver el triángulo. Veamos el recorrido para comprobarlo.

El primer paso es reconocer qué potencia representa cada número. El [Departamento de Energía de Estados Unidos explica la eficiencia de los motores](https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/motor.pdf) a partir de la relación entre la potencia mecánica entregada y la potencia eléctrica recibida. Por tanto, `P_entrada = P_salida/η = 30/0,90 = 33,33 kW`. **El motor necesita unos 33,33 kW eléctricos para entregar los 30 kW mecánicos previstos**, bajo el rendimiento supuesto. Eso significa que 30 kW no es la potencia que debe utilizarse directamente en la fórmula de corriente. Tampoco corresponde dividir nuevamente por η una potencia que ya represente la entrada eléctrica.

Ahora el triángulo puede avanzar: `S = 33,33/0,80 ≈ 41,67 kVA` y `|Q| ≈ 25,00 kVAR`. Con `400 V` entre líneas, la corriente estimada es `I = 1000·41,67/(√3·400) ≈ 60,1 A`. Por contraste, omitir el rendimiento habría dado `I = 1000·(30/0,80)/(√3·400) ≈ 54,1 A`. **La diferencia ronda los seis amperios en este ejemplo**; importa porque nace de confundir el significado del dato, no de un error algebraico. Las operaciones utilizan valores intermedios sin redondear y presuponen las condiciones sinusoidales y equilibradas indicadas.

Pero aquí está el detalle que justifica todo el recorrido: **si mañana el dato disponible cambia, la respuesta física no debería hacerlo**. Con `P = 33,33 kW` y `Q = 25,00 kVAR`, Pitágoras devuelve aproximadamente `41,67 kVA`; con esa potencia aparente y `FP = 0,80`, vuelve a aparecer la potencia activa. No son cálculos distintos: son distintas puertas de entrada al mismo sistema, siempre que se conserven las condiciones iniciales.

## Cambiar un valor debería actualizar el cálculo, no borrar sus hipótesis

La propuesta práctica de WattsWise traslada esa lógica a la interfaz. Permite editar distintas entradas válidas del módulo de potencia y recalcular las magnitudes relacionadas sin copiar manualmente cada resultado entre formularios. La animación de la publicación original muestra cambios de tensión, potencia reactiva y factor de potencia. Conviene observarla con una pregunta concreta: **¿qué datos deberían cambiar y cuáles deberían mantenerse cuando se modifica una entrada?**

![Demostración animada original del módulo de potencia de WattsWise al modificar variables interrelacionadas.](/blog/assets/power/power-demo.gif)

*Demostración conservada del artículo original. La interfaz actual puede haber evolucionado; la animación ilustra el flujo de uso, no una certificación independiente de exactitud.*

El objetivo no es eliminar la verificación, sino recuperar tiempo para hacerla donde importa. En lugar de comprobar si un número se copió correctamente de una pantalla a otra, conviene revisar la tensión elegida, la naturaleza de la carga, el rendimiento considerado y la variable que el sistema debe mantener constante. La [historia de cómo surgió WattsWise](/articles/es/de-excel-a-wattswise-en-216-horas/) explica por qué conectar herramientas de ingeniería terminó siendo tan importante como construir cada calculadora.

## Una advertencia que cambia el resultado: el factor de potencia no siempre es cos φ

El triángulo clásico es útil, pero tiene fronteras. Cuando aparecen armónicos —por ejemplo, con determinadas cargas electrónicas o variadores—, la distorsión altera la relación entre las formas de onda. El [manual técnico de Schneider Electric](https://product-help.schneider-electric.com/PowerLogic-ION9000/en-us/content/13-measurements/power-factor-pf.htm) distingue el **factor de potencia verdadero**, que incluye armónicos, del **factor de desplazamiento**, referido a la componente fundamental. Su [explicación técnica sobre ambos efectos](https://blog.se.com/energy-management-energy-efficiency/2020/02/20/distortion-displacement-and-the-truth-understanding-true-power-factor/) señala un riesgo práctico: corregir únicamente el desfase puede no resolver un problema de distorsión.

Así que `FP = P/S` conserva su definición, pero identificarlo sin más con `cos φ` exige el contexto sinusoidal apropiado. Del mismo modo, una corriente calculada a partir del triángulo simplificado **no basta para seleccionar conductores o protecciones**: todavía intervienen condiciones de instalación, demanda, régimen de carga y exigencias normativas. El buen software debe facilitar el cálculo y hacer visibles esos límites, no esconderlos.

## La diferencia que merece la pena recordar

La ecuación `S² = P² + Q²` cabe en una línea; el trabajo alrededor de ella, no. La próxima vez que una ficha entregue kVA o una medición proporcione amperios, no hará falta inventar otra fórmula. Si un motor obliga a distinguir potencia mecánica de eléctrica, el reto seguirá siendo el mismo: **comenzar con la información disponible sin perder el contexto**.

Ese es el sentido del análisis bidireccional: menos transcripciones, más continuidad entre cálculos y espacio para comprobar las decisiones que ninguna calculadora debería tomar por cuenta propia. Es una guía sencilla para revisar cualquier calculadora: **¿facilita comprobar las hipótesis o solo entrega más resultados?** Quien quiera observar este enfoque en una herramienta puede [explorar WattsWise](/wattswise/) y comparar el flujo con su procedimiento habitual. La pregunta útil no es cuántas operaciones puede resolver una aplicación, sino cuántas veces obliga a reconstruirlas.
