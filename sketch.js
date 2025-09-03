// Configuración del juego
let serial;
let gameConfig = {
    width: 800,
    height: 600,
    gravity: 0.8,
    jumpForce: -15,
    platformHeight: 20
};

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
    projectiles: []
};

function setup() {
    createCanvas(gameConfig.width, gameConfig.height);
    setupSerial();
}

function setupSerial() {
    serial = new p5.SerialPort();
    serial.on('data', processSerialData);
    // Asumimos que los datos ya están llegando en el formato correcto
}

function processSerialData(data) {
    // Datos en formato CSV: joystickX,joystickY,luz,temp,slider,mic,accelX,accelY,accelZ,btn1,btn2,btn3,btn4
    let values = data.trim().split(',').map(Number);
    
    // Movimiento basado en acelerómetro (valores 6-8)
    player.velocityX = map(values[6], -1000, 1000, -5, 5);
    
    // Salto con botón 1 (valor 9)
    if (values[9] === 0 && !player.isJumping) {
        player.velocityY = gameConfig.jumpForce;
        player.isJumping = true;
    }
    
    // Disparo con micrófono (valor 5)
    if (values[5] > 800) {
        createProjectile();
    }
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
    // Actualizar posición horizontal
    player.x += player.velocityX;
    
    // Aplicar gravedad
    if (player.isJumping) {
        player.velocityY += gameConfig.gravity;
    }
    player.y += player.velocityY;
    
    // Mantener dentro de los límites
    player.x = constrain(player.x, 0, gameConfig.width - player.width);
    
    // Colisión con plataformas
    checkPlatformCollision();
}

function draw() {
    background(44, 62, 80);
    
    // Dibujar plataformas
    fill(231, 76, 60);
    for (let platform of platforms) {
        rect(platform.x, platform.y, platform.width, gameConfig.platformHeight);
    }
    
    // Actualizar y dibujar jugador
    updatePlayer();
    fill(52, 152, 219);
    rect(player.x, player.y, player.width, player.height);
    
    // Actualizar y dibujar proyectiles
    updateProjectiles();
    fill(241, 196, 15);
    for (let projectile of player.projectiles) {
        circle(projectile.x, projectile.y, 10);
    }
}
