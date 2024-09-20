let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft =25 * 60;

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
  const modeContainer = document.getElementById('mode-container');
  const modeIcon = document.getElementById('mode-icon');
  modeContainer.classList.add('fade-out');
  setTimeout(() => {
    modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : 'fas fa-bed';
    modeContainer.classList.remove('fade-out');
    modeContainer.classList.add('fade-in');
  }, 500);
  timerDisplay.style.backgroundColor = isWorkMode ? 'red' : 'green';
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
  startButton.innerHTML = '<span class="fas fa-redo" aria-hidden="true"></span>';
  isRunning = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  updateTimeLeft();
  updateTimer();
  startButton.innerHTML = '<span class="fas fa-play" aria-hidden="true"></span>';
  timerDisplay.style.backgroundColor = 'red';
}

function updateTimeLeft() {
  timeLeft = isWorkMode ? 25 * 60: 5 * 60;
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
