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
  DOM.workDurationInput.value = localStorage.getItem('workDuration') || DEFAULTS.workDuration;
  DOM.restDurationInput.value = localStorage.getItem('restDuration') || DEFAULTS.restDuration;
};

const saveSettings = () => {
  localStorage.setItem('workDuration', DOM.workDurationInput.value);
  localStorage.setItem('restDuration', DOM.restDurationInput.value);
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
};

const updateTimer = () => DOM.timerDisplay.textContent = formatTime(timeLeft);

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
  const { modeContainer, modeIcon, timerDisplay } = DOM;
  modeContainer.classList.toggle('fade-out');

  setTimeout(() => {
    DOM.modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : 'fas fa-bed';
    timerDisplay.style.backgroundColor = isWorkMode ? '#b91c1c' : 'green'; 
     if (isWorkMode) {
      document.body.style.background = 'linear-gradient(45deg, #b91c1c, #c62828, #d32f2f, #e57373)';
    } else {
      document.body.style.background = 'linear-gradient(45deg, #4caf50, #66bb6a, #81c784, #a5d6a7)';
    }
    DOM.workSound.play();
    modeContainer.classList.toggle('fade-in');
  }, 500);
};

const startTimer = () => {
  timeLeft = getCurrentDuration();
  
  DOM.timerDisplay.classList.add('heartbeat');

  timer = setInterval(() => {
    if (timeLeft === 3) {
      DOM.workSound.play();
    }

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
  updateTimer();
};

DOM.startButton.addEventListener('click', () => {
  if (isRunning){
    location.reload();
    resetTimer();
  } else {
    startTimer();
  }
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
