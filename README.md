# donkey_next_level
Juego de Mario que consiste en esquivar de una manera diferente 

![Mario](1Boceto.png)
---

### **PRD: Prototipo *Donkey Next Level***

1. **Visión del producto**
   *Donkey Next Level* es un **prototipo de videojuego tipo plataformas** inspirado en Mario/Donkey Kong, controlado con **Arduino Esplora**, donde el jugador se desplaza inclinando el control, salta con un botón y **lanza proyectiles** al gritar. Busca experimentar con formas de interacción físicas y auditivas poco convencionales.

2. **Objetivos**

* Validar el uso del **Arduino Esplora** como controlador alternativo.
* Probar mecánicas innovadoras: movimiento por inclinación y disparo por voz.
* Servir como base para un futuro juego más completo y pulido.

3. **Público objetivo**

* Makers, estudiantes y desarrolladores curiosos.
* Jugadores jóvenes y entusiastas de experiencias experimentales (12+).

4. **Características principales**

* **Movimiento lateral**: inclinando el Esplora a los lados.
* **Salto**: botón físico.
* **Lanzamiento de objetos/proyectiles**: al detectar gritos o sonidos fuertes.
* **Niveles cortos tipo plataformas**, centrados en la jugabilidad más que en la historia.
* **Estética retro** y simple, con elementos reconocibles tipo Donkey/Mario.

5. **Requisitos técnicos**

* **Hardware**: Arduino Esplora (acelerómetro, micrófono, botones).
* **Software**:

  * **Recepción de datos**: El sistema debe poder recibir datos desde el Arduino Esplora conectado a un **puerto COM** (por ejemplo, **COM12**).
  * **Intermediario**: Se requiere un servidor **Node.js** que utilice la librería **p5.serialport** para la comunicación serial.
  * **Procesamiento y envío**: El servidor Node.js procesa los datos recibidos y los envía al **navegador** donde se ejecutará el juego (p. ej., con **p5.js**).
* **Entradas**: inclinación (movimiento), botón (salto), micrófono (disparo).
* **Salida**: visualización en el navegador, pantalla PC o proyector.

