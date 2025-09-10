const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const gameBoard = document.getElementById('game-board');

let score = 0;
let timeLeft = 30;
let lastHole;
let timerId;
let countdownTimerId;
let isGameRunning = false;

// Generar los agujeros dinámicamente
function createHoles() {
    for (let i = 0; i < 9; i++) { // Por ejemplo, 9 agujeros
        const holeDiv = document.createElement('div');
        holeDiv.classList.add('hole');

        const holeImg = document.createElement('img');
        holeImg.src = 'images/hole.png'; // Ruta a la imagen del agujero
        holeImg.alt = 'Agujero';
        holeImg.classList.add('hole-img');
        holeDiv.appendChild(holeImg);

        const moleImg = document.createElement('img');
        moleImg.src = 'images/mole.png'; // Ruta a la imagen del topo
        moleImg.alt = 'Topo';
        moleImg.classList.add('mole');
        moleImg.addEventListener('click', whack); // Añadir el evento click
        holeDiv.appendChild(moleImg);

        gameBoard.appendChild(holeDiv);
    }
}

// Llamar a la función para crear los agujeros al cargar la página
createHoles();

// Seleccionar todos los topos después de que se hayan creado
const moles = document.querySelectorAll('.mole');


function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes); // Evitar el mismo agujero consecutivo
    }
    lastHole = hole;
    return hole;
}

function peep() {
    if (!isGameRunning) return;

    const randomMole = randomHole(Array.from(moles)); // Usar los topos, no los agujeros
    randomMole.classList.add('up'); // El topo sale
    const time = Math.random() * 1000 + 500; // Tiempo aleatorio para que el topo esté arriba (entre 0.5 y 1.5 segundos)

    setTimeout(() => {
        randomMole.classList.remove('up'); // El topo se esconde
        if (isGameRunning) {
            peep(); // Llamar de nuevo para que salga otro topo
        }
    }, time);
}

function whack(event) {
    if (!isGameRunning) return;
    score++;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    this.classList.remove('up'); // El topo golpeado se esconde
    this.classList.add('hit'); // Añadir clase para la animación de golpe
    setTimeout(() => {
        this.classList.remove('hit'); // Remover la clase después de la animación
    }, 200); // Duración de la animación de golpe
}

function countdown() {
    timeLeft--;
    timeLeftDisplay.textContent = `Tiempo: ${timeLeft}`;

    if (timeLeft === 0) {
        clearInterval(countdownTimerId);
        clearInterval(timerId);
        isGameRunning = false;
        alert(`¡Juego Terminado! Tu puntuación final es: ${score}`);
        startButton.disabled = false; // Habilitar botón para reiniciar
        // Opcional: Ocultar todos los topos que estén arriba
        moles.forEach(mole => mole.classList.remove('up'));
    }
}

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    timeLeftDisplay.textContent = `Tiempo: ${timeLeft}`;
    isGameRunning = true;
    startButton.disabled = true; // Deshabilitar el botón durante el juego

    // Asegurarse de que no haya topos arriba al inicio de un nuevo juego
    moles.forEach(mole => mole.classList.remove('up'));

    countdownTimerId = setInterval(countdown, 1000);
    peep(); // Iniciar la aparición de los topos
}

startButton.addEventListener('click', startGame);
