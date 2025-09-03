# Donkey Next Level
Videojuego de plataformas en pantalla única controlado con Arduino Esplora

![Mario](1Boceto.png)

### **PRD: Prototipo *Donkey Next Level***

1. **Visión del producto**
   *Donkey Next Level* es un videojuego de plataformas que reimagina el clásico arcade usando **Arduino Esplora** como control. El jugador se mueve inclinando el dispositivo, salta con botones y dispara al gritar, creando una experiencia única de juego.

2. **Escenario y jugabilidad**

* **Pantalla única vertical**:
  * Plataformas distribuidas en diferentes alturas
  * Rutas alternativas para movimiento estratégico
  * Todo visible sin scrolling

* **Controles innovadores**:
  * Movimiento: inclinación del Arduino Esplora
  * Salto: botón físico
  * Disparo: detección de sonido/grito

3. **Aspectos técnicos**

* **Hardware**: 
  * Arduino Esplora (ya programado)
  * Sensores utilizados:
    * Acelerómetro: movimiento del personaje
    * Micrófono: sistema de disparo
    * Botones: salto y acciones

* **Software**:
  * p5.js con p5.serialport para la interfaz gráfica y lectura de datos
  * Datos recibidos por serial en formato CSV:
    * Posiciones 0-1: joystick (X,Y)
    * Posición 5: micrófono (disparos)
    * Posiciones 6-8: acelerómetro (movimiento)
    * Posiciones 9-12: botones (salto/acciones)

---

### Implementación p5.js

```cpp
// Ejemplo: Lectura de sensores Esplora y envío por Serial
void loop() {
  int joystickX = Esplora.readJoystickX();
  int joystickY = Esplora.readJoystickY();
  int light = Esplora.readLightSensor();
  int temperature = Esplora.readTemperature(0);
  int slider = Esplora.readSlider();
  int microphone = Esplora.readMicrophone();
  int accelX = Esplora.readAccelerometer(X_AXIS);
  int accelY = Esplora.readAccelerometer(Y_AXIS);
  int accelZ = Esplora.readAccelerometer(Z_AXIS);
  int button1 = Esplora.readButton(SWITCH_1);
  int button2 = Esplora.readButton(SWITCH_2);
  int button3 = Esplora.readButton(SWITCH_3);
  int button4 = Esplora.readButton(SWITCH_4);

  // Enviar datos en formato CSV
  Serial.print(joystickX); Serial.print(",");
  Serial.print(joystickY); Serial.print(",");
  Serial.print(light); Serial.print(",");
  Serial.print(temperature); Serial.print(",");
  Serial.print(slider); Serial.print(",");
  Serial.print(microphone); Serial.print(",");
  Serial.print(accelX); Serial.print(",");
  Serial.print(accelY); Serial.print(",");
  Serial.print(accelZ); Serial.print(",");
  Serial.print(button1); Serial.print(",");
  Serial.print(button2); Serial.print(",");
  Serial.print(button3); Serial.print(",");
  Serial.println(button4);
  delay(50);
}
```

### Código p5.js para interpretar los datos

```javascript
// sketch.js
let ws;
let player = {
  x: 100,
  y: 300,
  speed: 5,
  isJumping: false
};

function setup() {
  createCanvas(800, 600);
  // Conectar al servidor WebSocket
  ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    updatePlayerFromSensors(data);
  };
}

function updatePlayerFromSensors(data) {
  // Movimiento lateral con acelerómetro
  const accelX = parseInt(data[6]); // Índice del accelX
  player.x += map(accelX, -1000, 1000, -player.speed, player.speed);
  
  // Salto con botón
  if (parseInt(data[9]) === 0) { // Índice del button1
    if (!player.isJumping) {
      player.isJumping = true;
      // Lógica de salto
    }
  }
  
  // Disparo con micrófono
  const micLevel = parseInt(data[5]); // Índice del micrófono
  if (micLevel > 800) { // Ajustar umbral según necesidad
    // Lógica de disparo
  }
}

function draw() {
  background(220);
  // Dibujar jugador
  rect(player.x, player.y, 20, 40);
  // Resto de la lógica del juego
}
```