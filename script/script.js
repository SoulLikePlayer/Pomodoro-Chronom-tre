let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft = 30;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const modeLabel = document.getElementById('mode-label');
const workSound = document.getElementById('work-sound');
const restSound = document.getElementById('rest-sound');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function switchMode() {
  isWorkMode = !isWorkMode;
  updateTimeLeft();
  modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
  timerDisplay.style.backgroundColor = isWorkMode ? 'red' : 'green';
  
  // Joue le son de transition
  if (isWorkMode) {
    workSound.play();
  } else {
    restSound.play();
  }
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
      switchMode();
      startTimer();
    }
  }, 1000);
  startButton.innerHTML = '<i class="fas fa-redo"></i> Réinitialiser';
  isRunning = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  updateTimeLeft();
  updateTimer();
  startButton.innerHTML = '<i class="fas fa-play"></i> Démarrer';
  timerDisplay.style.backgroundColor = 'red';
}

function updateTimeLeft() {
  timeLeft = isWorkMode ? 30 : 10;
}

startButton.addEventListener('click', () => {
  if (isRunning) {
    resetTimer();
  } else {
    updateTimeLeft();
    updateTimer();
    startTimer();
  }
});

updateTimer();
