# Ruta de Desarrollo - Donkey Next Level

## 1. Fase de Configuración Inicial (1-2 semanas)
- [ ] Configuración del entorno de desarrollo
  - Instalación del motor de juego (Pygame/Arcade)
  - Configuración del entorno virtual Python
  - Configuración de la biblioteca de reconocimiento de voz
- [ ] Estructura básica del proyecto
- [ ] Configuración del sistema de control de versiones

## 2. Fase de Desarrollo del Núcleo (3-4 semanas)
### 2.1 Mecánicas de Movimiento Básicas
- [ ] Sistema de movimiento del personaje
  - Movimiento lineal en plano 2D
  - Control de velocidad básica
  - Cambios de dirección
- [ ] Sistema de colisiones simple
- [ ] Implementación de controles
  - Teclas de dirección para movimiento
  - Estado neutral (sin movimiento)

### 2.2 Sistema de Reconocimiento de Voz
- [ ] Integración de biblioteca de reconocimiento de voz
- [ ] Detección de gritos
- [ ] Sistema de disparo de bolas de fuego por voz

### 2.3 Gráficos y Animaciones
- [ ] Diseño del personaje principal
- [ ] Animaciones básicas
  - Idle
  - Movimiento en las 4 direcciones
  - Animación de lanzamiento de bola de fuego
- [ ] Efectos visuales
  - Bolas de fuego
  - Efecto de power-up de flor

## 3. Sistema de Power-ups (2 semanas)
- [ ] Implementación de la flor mágica
  - Spawn de flores en el nivel
  - Efecto de aumento de velocidad
  - Indicador visual del power-up activo
- [ ] Sistema de duración del power-up
- [ ] Efectos visuales de transformación

## 4. Interfaz y Experiencia de Usuario (1-2 semanas)
- [ ] HUD básico
  - Indicador de power-up activo
  - Contador de bolas de fuego (si aplica)
- [ ] Menú principal simple
- [ ] Sistema de pausa
- [ ] Calibración de micrófono y prueba de voz

## 5. Fase de Pruebas y Optimización (2 semanas)
- [ ] Pruebas de jugabilidad
- [ ] Ajustes de sensibilidad del reconocimiento de voz
- [ ] Optimización de rendimiento
- [ ] Documentación básica

## Entregables del Prototipo Funcional
- [ ] Personaje con movimiento en plano 2D
- [ ] Sistema de reconocimiento de voz funcional
- [ ] Power-up de flor implementado
- [ ] Mecánica de bolas de fuego por voz
- [ ] Nivel de prueba básico

## Consideraciones Técnicas
- Python como lenguaje principal
- Pygame/Arcade para el motor de juego
- Biblioteca de reconocimiento de voz (ej: SpeechRecognition)
- Sistema de detección de volumen para gritos
- Arquitectura modular y escalable

## Criterios de Éxito
1. Movimiento fluido y preciso del personaje
2. Reconocimiento confiable de gritos
3. Respuesta inmediata al lanzar bolas de fuego
4. Cambio de velocidad notorio con el power-up de flor
5. Rendimiento estable (60 FPS)

## Siguientes Pasos
- Pruebas de usabilidad con diferentes usuarios
- Ajuste fino de la detección de voz
- Balanceo de la velocidad normal vs power-up
- Expansión del contenido del juego
