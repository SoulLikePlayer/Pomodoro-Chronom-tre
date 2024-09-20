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

function startStopTimer() {
  if (isRunning) {
    clearInterval(timer);
    startButton.textContent = 'Démarrer';
  } else {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimer();
      } else {
        clearInterval(timer);
        alert('Le temps est écoulé !');
        timeLeft = 25 * 60; 
        updateTimer();
        startButton.textContent = 'Démarrer';
      }
    }, 1000);
    startButton.textContent = 'Arrêter';
  }
  isRunning = !isRunning; 
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60; 
  updateTimer();
  startButton.textContent = 'Démarrer';
}

startButton.addEventListener('click', startStopTimer);
modeSwitch.addEventListener('change', () => {
  modeLabel.textContent = modeSwitch.checked ? 'Repos' : 'Travail';
});

updateTimer();
