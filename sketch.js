// Configuración del juego
let serial;
let gameConfig = {
    width: 800,
    height: 600,
    gravity: 0.6,
    jumpForce: -12,
    platformHeight: 20,
    maxVelocityY: 12,
    moveSpeed: 5
};

// Elementos visuales
let clouds = [];
let backgroundColor = '#87CEEB'; // Cielo azul
let platformColor = '#4CAF50';   // Verde para plataformas
let playerColor = '#FF5722';     // Naranja para el jugador
let cloudColor = '#FFFFFF';      // Blanco para nubes

// Configuración de nubes
function setupClouds() {
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: random(gameConfig.width),
            y: random(gameConfig.height/2),
            speed: random(0.2, 0.5),
            size: random(30, 70)
        });
    }
}

// Plataformas del nivel (x, y, ancho)
let platforms = [
    { x: 0, y: gameConfig.height - 20, width: gameConfig.width }, // suelo
    { x: 100, y: 450, width: 200 },
    { x: 400, y: 350, width: 200 },
    { x: 200, y: 250, width: 200 },
    { x: 500, y: 150, width: 200 }
];

// Jugador
let player = {
    x: 100,
    y: 300,
    width: 30,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    canDoubleJump: false,
    jumpBufferCount: 0,    // Para el buffer de salto
    coyoteTime: 0,         // Para el tiempo coyote
    projectiles: []
};

function setup() {
    // Crear el canvas dentro del contenedor
    let canvas = createCanvas(gameConfig.width, gameConfig.height);
    canvas.parent('gameContainer');
    
    // Configurar serial
    setupSerial();
    
    // Inicializar nubes
    setupClouds();
    
    // Mostrar mensaje en consola para debug
    console.log('p5.js setup completado');
}

// Controles temporales para pruebas
let debugControls = {
    leftKey: false,
    rightKey: false
};

let isSerialMode = false;

function setupSerial() {
    // Intentar inicializar serial solo si existe p5.SerialPort
    if (typeof p5.SerialPort !== 'undefined') {
        try {
            serial = new p5.SerialPort();
            serial.on('list', gotList);
            serial.on('data', gotData);
            serial.list();
            isSerialMode = true;
            document.getElementById('status').textContent = 'Buscando Arduino Esplora...';
        } catch (e) {
            console.log('Error al inicializar serial:', e);
            setupTestMode();
        }
    } else {
        setupTestMode();
    }
}

function setupTestMode() {
    isSerialMode = false;
    document.getElementById('status').textContent = 'Modo prueba: Usa ← → para mover, ESPACIO para saltar, X para disparar';
}

function gotList(thelist) {
    if (!isSerialMode) return;
    
    for (let i = 0; i < thelist.length; i++) {
        console.log(i + " " + thelist[i]);
        if (thelist[i].includes('usbmodem') || thelist[i].includes('COM')) {
            serial.open(thelist[i]);
            document.getElementById('status').textContent = 'Conectado a Arduino Esplora';
            break;
        }
    }
}

function gotData() {
    if (!isSerialMode) return;
    
    let data = serial.readStringUntil("\\n");
    if (data.length > 0) {
        let values = data.trim().split(',').map(Number);
        if (values.length >= 13) {
            // Movimiento con acelerómetro
            player.velocityX = map(values[6], -15000, 15000, -gameConfig.moveSpeed, gameConfig.moveSpeed);
            
            // Salto con botón
            if (values[9] === 0 && !player.isJumping) {
                player.velocityY = gameConfig.jumpForce;
                player.isJumping = true;
            }
            
            // Disparo con micrófono
            if (values[5] > 600) {
                createProjectile();
            }
        }
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) debugControls.leftKey = true;
    if (keyCode === RIGHT_ARROW) debugControls.rightKey = true;
    if (keyCode === 32) { // ESPACIO
        if (!player.isJumping || player.canDoubleJump) {
            if (!player.isJumping) {
                // Primer salto
                player.velocityY = gameConfig.jumpForce;
                player.isJumping = true;
                player.canDoubleJump = true;
            } else if (player.canDoubleJump) {
                // Doble salto
                player.velocityY = gameConfig.jumpForce * 0.8;
                player.canDoubleJump = false;
            }
        }
    }
    if (key === 'x' || key === 'X') {
        createProjectile();
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) debugControls.leftKey = false;
    if (keyCode === RIGHT_ARROW) debugControls.rightKey = false;
}

function updatePlayerControls() {
    if (!isSerialMode) {
        // Control con teclado en modo prueba
        if (debugControls.leftKey) player.velocityX = -gameConfig.moveSpeed;
        else if (debugControls.rightKey) player.velocityX = gameConfig.moveSpeed;
        else player.velocityX = 0;
    }
    // En modo serial, la velocidad se actualiza en gotData()
}

function createProjectile() {
    player.projectiles.push({
        x: player.x + player.width,
        y: player.y + player.height/2,
        velocityX: 10
    });
}

function updateProjectiles() {
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        let projectile = player.projectiles[i];
        projectile.x += projectile.velocityX;
        
        // Eliminar proyectiles fuera de pantalla
        if (projectile.x > gameConfig.width) {
            player.projectiles.splice(i, 1);
        }
    }
}

function checkPlatformCollision() {
    player.isJumping = true;
    
    for (let platform of platforms) {
        if (player.y + player.height > platform.y &&
            player.y + player.height < platform.y + gameConfig.platformHeight &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            break;
        }
    }
}

function updatePlayer() {
    // Actualizar controles
    updatePlayerControls();
    
    // Actualizar posición horizontal con aceleración
    player.x += player.velocityX;
    
    // Aplicar gravedad con límite de velocidad
    if (player.isJumping) {
        player.velocityY = constrain(
            player.velocityY + gameConfig.gravity,
            -gameConfig.maxVelocityY,
            gameConfig.maxVelocityY
        );
    }
    
    // Actualizar posición vertical
    player.y += player.velocityY;
    
    // Mantener dentro de los límites
    player.x = constrain(player.x, 0, gameConfig.width - player.width);
    player.y = constrain(player.y, 0, gameConfig.height - player.height);
    
    // Actualizar tiempo coyote
    if (!player.isJumping) {
        player.coyoteTime = 5; // Frames de tiempo coyote
    } else {
        player.coyoteTime = Math.max(0, player.coyoteTime - 1);
    }
    
    // Colisión con plataformas
    checkPlatformCollision();
    
    // Reset double jump cuando toca el suelo
    if (!player.isJumping) {
        player.canDoubleJump = false;
    }
}

function drawCloud(x, y, size) {
    fill(cloudColor);
    noStroke();
    ellipse(x, y, size);
    ellipse(x + size/2, y, size * 0.8);
    ellipse(x - size/2, y, size * 0.8);
}

function updateClouds() {
    for (let cloud of clouds) {
        cloud.x += cloud.speed;
        if (cloud.x > gameConfig.width + cloud.size) {
            cloud.x = -cloud.size;
            cloud.y = random(gameConfig.height/2);
        }
    }
}

function draw() {
    // Fondo con degradado
    background(backgroundColor);
    
    // Dibujar y actualizar nubes
    updateClouds();
    for (let cloud of clouds) {
        drawCloud(cloud.x, cloud.y, cloud.size);
    }
    
    // Dibujar plataformas con efecto de profundidad
    for (let platform of platforms) {
        // Sombra
        fill(0, 0, 0, 20);
        rect(platform.x + 5, platform.y + 5, platform.width, gameConfig.platformHeight);
        
        // Plataforma
        fill(platformColor);
        rect(platform.x, platform.y, platform.width, gameConfig.platformHeight);
        
        // Highlight superior
        fill(255, 255, 255, 30);
        rect(platform.x, platform.y, platform.width, 3);
    }
    
    // Actualizar y dibujar jugador con sombra
    updatePlayer();
    
    // Sombra del jugador
    fill(0, 0, 0, 20);
    rect(player.x + 2, player.y + 2, player.width, player.height);
    
    // Jugador
    fill(playerColor);
    rect(player.x, player.y, player.width, player.height);
    
    // Ojos del jugador
    fill(255);
    ellipse(player.x + player.width*0.7, player.y + player.height*0.3, 8, 8);
    ellipse(player.x + player.width*0.3, player.y + player.height*0.3, 8, 8);
    
    // Actualizar y dibujar proyectiles con efecto de brillo
    updateProjectiles();
    for (let projectile of player.projectiles) {
        // Brillo exterior
        fill(255, 200, 0, 50);
        circle(projectile.x, projectile.y, 15);
        
        // Proyectil
        fill(255, 165, 0);
        circle(projectile.x, projectile.y, 10);
        
        // Brillo central
        fill(255, 255, 200);
        circle(projectile.x, projectile.y, 4);
    }
}
