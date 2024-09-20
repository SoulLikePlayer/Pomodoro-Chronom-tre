let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft = 1 * 60;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const modeLabel = document.getElementById('mode-label');
const timerCircle = document.createElement('div');

timerCircle.className = 'timer-circle';
timerDisplay.appendChild(timerCircle);

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimer() {
  timerDisplay.firstChild.textContent = formatTime(timeLeft);
}

function switchMode() {
  isWorkMode = !isWorkMode;
  updateTimeLeft();
  modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
  timerDisplay.style.backgroundColor = isWorkMode ? 'red' : 'green';
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
  startButton.textContent = 'Réinitialiser';
  isRunning = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  updateTimeLeft();
  updateTimer();
  startButton.textContent = 'Démarrer';
  timerDisplay.style.backgroundColor = 'red';
}

function updateTimeLeft() {
  timeLeft = isWorkMode ? 1 * 60 : 30;
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
