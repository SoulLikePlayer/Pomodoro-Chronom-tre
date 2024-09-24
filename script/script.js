let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft;

const DOM = {
  timerDisplay: document.getElementById('timer'),
  startButton: document.getElementById('start-button'),
  modeLabel: document.getElementById('mode-label'),
  workSound: document.getElementById('work-sound'),
  workDurationInput: document.getElementById('work-duration'),
  restDurationInput: document.getElementById('rest-duration'),
  settingsForm: document.getElementById('settings-form'),
  modeContainer: document.getElementById('mode-container'),
  modeIcon: document.getElementById('mode-icon'),
  settingsButton: document.getElementById('settings-button'),
  modal: document.getElementById('settings-modal'),
  closeButton: document.querySelector('.close-button')
};

const DEFAULTS = {
  workDuration: 25,
  restDuration: 5
};

const loadSettings = () => {
  const workDuration = localStorage.getItem('workDuration') || DEFAULTS.workDuration;
  const restDuration = localStorage.getItem('restDuration') || DEFAULTS.restDuration;
  
  DOM.workDurationInput.value = workDuration;
  DOM.restDurationInput.value = restDuration;
};

const saveSettings = () => {
  localStorage.setItem('workDuration', DOM.workDurationInput.value);
  localStorage.setItem('restDuration', DOM.restDurationInput.value);
};

const formatTime = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const updateTimer = () => {
  DOM.timerDisplay.textContent = formatTime(timeLeft);
};

const getCurrentDuration = () => {
  return (isWorkMode ? DOM.workDurationInput.value : DOM.restDurationInput.value) * 60;
};

const switchMode = () => {
  isWorkMode = !isWorkMode;
  timeLeft = getCurrentDuration();
  updateModeDisplay();
  updateTimer();
};

const updateModeDisplay = () => {
  const { modeContainer, modeIcon } = DOM;
  modeContainer.classList.toggle('fade-out');

  setTimeout(() => {
    DOM.modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : 'fas fa-bed';
    DOM.timerDisplay.style.backgroundColor = isWorkMode ? '#b91c1c' : 'green';
    DOM.workSound.play();
    modeContainer.classList.toggle('fade-in');
  }, 500);
};

const startTimer = () => {
  timeLeft = getCurrentDuration();
  DOM.timerDisplay.classList.add('active', 'heartbeat');
  
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
      DOM.timerDisplay.classList.remove('heartbeat');
      switchMode();
      startTimer();
    }
  }, 1000);

  DOM.startButton.innerHTML = '<strong class="fas fa-redo" aria-hidden="true"></strong>';
  isRunning = true;
};

const resetTimer = () => {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  timeLeft = getCurrentDuration();
  DOM.timerDisplay.classList.remove('heartbeat');
  updateModeDisplay();
  updateTimer();
  DOM.startButton.innerHTML = '<strong class="fas fa-play" aria-hidden="true"></strong>';
  DOM.timerDisplay.classList.remove('active');
};

DOM.startButton.addEventListener('click', () => {
  isRunning ? resetTimer() : startTimer();
});

DOM.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  resetTimer();
  DOM.modal.style.display = 'none';
});

DOM.settingsButton.addEventListener('click', () => {
  DOM.modal.style.display = 'block';
});

DOM.closeButton.addEventListener('click', () => {
  DOM.modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === DOM.modal) {
    DOM.modal.style.display = 'none';
  }
});

const initialize = () => {
  loadSettings();
  resetTimer();
};

initialize();
