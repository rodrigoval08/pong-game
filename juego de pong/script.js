// Agrega esta línea cerca del inicio del script, con las otras variables globales
// Añade estas líneas
let inicioTemporizador;
const tiempoLimite = 60000; // 60 segundos en milisegundos
// Obtiene el elemento canvas del DOM
const canvas = document.getElementById('canvasJuego');
const contexto = canvas.getContext('2d');

// Define las dimensiones de las palas y la pelota
const anchoPala = 10;
const altoPala = 100;
const tamañoPelota = 10;

// Posiciones iniciales de las palas y la pelota
let jugadorY = (canvas.height - altoPala) / 2;
let computadoraY = (canvas.height - altoPala) / 2;
let pelotaX = canvas.width / 2;
let pelotaY = canvas.height / 2;

// Velocidades iniciales de la pelota en los ejes X e Y
let velocidadPelotaX = 5;
let velocidadPelotaY = 2;

// Puntajes iniciales para el jugador y la computadora
let puntajeJugador = 0;
let puntajeComputadora = 0;
// Establece la puntuación objetivo para ganar
const puntuacionObjetivo = 10;

// Nivel de dificultad inicial
let nivelDificultad = 1; // Valores más altos para mayor dificultad

// Función para dibujar un rectángulo en el canvas
function dibujarRectangulo(x, y, ancho, alto, color) {
    contexto.fillStyle = color; // Establece el color del rectángulo
    contexto.fillRect(x, y, ancho, alto); // Dibuja un rectángulo en el canvas
}

// Función para dibujar un círculo en el canvas
function dibujarCirculo(x, y, radio, color) {
    contexto.fillStyle = color; // Establece el color del círculo
    contexto.beginPath(); // Comienza un nuevo trazo
    contexto.arc(x, y, radio, 0, Math.PI * 2, false); // Dibuja un círculo
    contexto.closePath(); // Cierra el trazo
    contexto.fill(); // Rellena el círculo con el color establecido
}

// Función para dibujar la red en el centro del campo
function dibujarRed() {
    for (let i = 0; i < canvas.height; i += 15) { // Dibuja segmentos de la red
        dibujarRectangulo(canvas.width / 2 - 1, i, 2, 10, '#fff'); // Dibuja cada segmento de la red
    }
}

// Función para dibujar el puntaje
function dibujarPuntaje() {
    contexto.fillStyle = '#fff'; // Establece el color del texto
    contexto.font = '35px Arial'; // Establece la fuente y el tamaño del texto
    contexto.fillText(puntajeJugador, canvas.width / 4, 50); // Dibuja el puntaje del jugador
    contexto.fillText(puntajeComputadora, 3 * canvas.width / 4, 50); // Dibuja el puntaje de la computadora
}

// Función para dibujar el temporizador
function dibujarTemporizador() {
    const tiempoRestante = Math.max(0, Math.floor((inicioTemporizador + tiempoLimite - Date.now()) / 1000));
    contexto.fillStyle = '#fff';
    contexto.font = '25px Arial';
    contexto.fillText('Tiempo: ' + tiempoRestante, canvas.width / 2 - 50, 30);
}

// Función para mover la pelota y detectar colisiones
function moverPelota() {
    pelotaX += velocidadPelotaX; // Mueve la pelota en el eje X
    pelotaY += velocidadPelotaY; // Mueve la pelota en el eje Y

    // Detecta colisiones con los bordes superior e inferior
    if (pelotaY + tamañoPelota > canvas.height || pelotaY - tamañoPelota < 0) {
        velocidadPelotaY = -velocidadPelotaY; // Invierte la dirección en el eje Y
    }

    // Detecta colisiones con el borde izquierdo
    if (pelotaX - tamañoPelota < 0) {
        if (pelotaY > jugadorY && pelotaY < jugadorY + altoPala) {
            // Calcula el ángulo de rebote basado en la posición de la colisión con la pala del jugador
            let puntoDeGolpe = pelotaY - (jugadorY + altoPala / 2);
            puntoDeGolpe = puntoDeGolpe / (altoPala / 2);
            let anguloDeRebote = puntoDeGolpe * (Math.PI / 4); // Máximo ángulo de 45 grados
            velocidadPelotaX = 5 * Math.cos(anguloDeRebote); // Calcula la nueva velocidad en el eje X
            velocidadPelotaY = 5 * Math.sin(anguloDeRebote); // Calcula la nueva velocidad en el eje Y
        } else {
            puntajeComputadora++; // Incrementa el puntaje de la computadora
            reiniciarPelota(); // Reinicia la posición de la pelota
        }
    }

    // Detecta colisiones con el borde derecho
    if (pelotaX + tamañoPelota > canvas.width) {
        if (pelotaY > computadoraY && pelotaY < computadoraY + altoPala) {
            // Calcula el ángulo de rebote basado en la posición de la colisión con la pala de la computadora
            let puntoDeGolpe = pelotaY - (computadoraY + altoPala / 2);
            puntoDeGolpe = puntoDeGolpe / (altoPala / 2);
            let anguloDeRebote = puntoDeGolpe * (Math.PI / 4);
            velocidadPelotaX = -5 * Math.cos(anguloDeRebote); // Calcula la nueva velocidad en el eje X
            velocidadPelotaY = -5 * Math.sin(anguloDeRebote); // Calcula la nueva velocidad en el eje Y
        } else {
            puntajeJugador++; // Incrementa el puntaje del jugador
            reiniciarPelota(); // Reinicia la posición de la pelota
        }
    }
}

// Función para mover la pala de la computadora
function moverComputadora() {
    let velocidadComputadora = 4 * nivelDificultad; // Ajusta la velocidad según el nivel de dificultad
    if (pelotaY > computadoraY + altoPala / 2) {
        computadoraY += velocidadComputadora;
    } else {
        computadoraY -= velocidadComputadora;
    }
    computadoraY = Math.max(computadoraY, 0);
    computadoraY = Math.min(computadoraY, canvas.height - altoPala);
}
function reiniciarTemporizador() {
    inicioTemporizador = Date.now();
}
// Función para reiniciar la posición de la pelota
function reiniciarPelota() {
    pelotaX = canvas.width / 2;
    pelotaY = canvas.height / 2;
    velocidadPelotaX = -velocidadPelotaX; // Cambia la dirección de la pelota
}

// Función para reiniciar el juego
function reiniciarJuego() {
    puntajeJugador = 0;
    puntajeComputadora = 0;
    nivelDificultad = 1;
    reiniciarPelota();
     reiniciarTemporizador(); // Añade esta línea
    mostrarPantallaInicio();
}

// Función para mostrar la pantalla de inicio
function mostrarPantallaInicio() {
    document.getElementById('pantallaInicio').classList.add('active');
    document.getElementById('pantallaFin').classList.remove('active');
}

// Función para mostrar la pantalla de fin de juego
function mostrarPantallaFin() {
    document.getElementById('pantallaInicio').classList.remove('active');
    document.getElementById('pantallaFin').classList.add('active');
    document.getElementById('mensajeFin').textContent = `Puntuación Final - Jugador: ${puntajeJugador}, Computadora: ${puntajeComputadora}`;
}

// Función para manejar el inicio del juego
document.getElementById('comenzarJuego').addEventListener('click', () => {
    document.getElementById('pantallaInicio').classList.remove('active');
    inicioTemporizador = Date.now();
    requestAnimationFrame(actualizarJuego);
});

// Función para manejar el reinicio del juego
document.getElementById('reiniciarJuego').addEventListener('click', reiniciarJuego);

// Función para actualizar el juego
function actualizarJuego() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    dibujarRectangulo(0, jugadorY, anchoPala, altoPala, '#fff');
    dibujarRectangulo(canvas.width - anchoPala, computadoraY, anchoPala, altoPala, '#fff');
    dibujarCirculo(pelotaX, pelotaY, tamañoPelota, '#fff');
    dibujarRed();
    dibujarPuntaje();
    dibujarTemporizador();
    moverPelota();
    moverComputadora();
    if (puntajeJugador >= puntuacionObjetivo || puntajeComputadora >= puntuacionObjetivo) {
        mostrarPantallaFin();
    } else {
        requestAnimationFrame(actualizarJuego);
    }
}

// Configura los eventos de teclado
document.addEventListener('keydown', (evento) => {
    switch (evento.code) {
        case 'ArrowUp':
            jugadorY = Math.max(jugadorY - 20, 0); // Aumenta la velocidad de movimiento
            break;
        case 'ArrowDown':
            jugadorY = Math.min(jugadorY + 20, canvas.height - altoPala); // Aumenta la velocidad de movimiento
            break;
    }
});

// Configura los eventos táctiles para dispositivos móviles
canvas.addEventListener('touchstart', (evento) => {
    const touch = evento.touches[0];
    jugadorY = touch.clientY - canvas.offsetTop - altoPala / 2;
    jugadorY = Math.max(jugadorY, 0);
    jugadorY = Math.min(jugadorY, canvas.height - altoPala);
});

canvas.addEventListener('touchmove', (evento) => {
    const touch = evento.touches[0];
    jugadorY = touch.clientY - canvas.offsetTop - altoPala / 2;
    jugadorY = Math.max(jugadorY, 0);
    jugadorY = Math.min(jugadorY, canvas.height - altoPala);
});