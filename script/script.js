let timer; 
let isRunning = false; 
let timeLeft = 25 * 60;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const modeSwitch = document.getElementById('mode-switch');
const modeLabel = document.getElementById('mode-label');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
      alert('Le temps est écoulé !');
      startButton.textContent = 'Démarrer';
      isRunning = false;
    }
  }, 1000);
  startButton.textContent = 'Redémarrer';
  isRunning = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  updateTimeLeft();
  updateTimer();
  startButton.textContent = 'Démarrer';
}

function updateTimeLeft() {
  timeLeft = modeSwitch.checked ? 5 * 60 : 25 * 60;
}

modeSwitch.addEventListener('change', () => {
  updateTimeLeft();
  if (!isRunning) {
    updateTimer();
  }
  modeLabel.textContent = modeSwitch.checked ? 'Repos' : 'Travail';
});

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
