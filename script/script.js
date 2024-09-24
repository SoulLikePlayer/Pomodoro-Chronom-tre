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
  prevButton: document.getElementById('prev-button'),
  nextButton: document.getElementById('next-button'),
  timerSection: document.getElementById('timer-section'),
  settingsSection: document.getElementById('settings-section')
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
    timerDisplay.style.backgroundColor = isWorkMode ? 'red' : 'green';
    DOM.workSound.play();
    modeContainer.classList.toggle('fade-in');
  }, 500);
};

const startTimer = () => {
  timeLeft = getCurrentDuration();

  timer = setInterval(() => {
    if (timeLeft === 3) {
      DOM.workSound.play();
    }

    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
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
  updateTimer();
  DOM.startButton.innerHTML = '<strong class="fas fa-play" aria-hidden="true"></strong>';
  DOM.timerDisplay.style.backgroundColor = 'red';
};

let currentSectionIndex = 0;
const sections = [DOM.timerSection, DOM.settingsSection];

const updateCarousel = () => {
  sections.forEach((section, index) => {
    section.style.display = index === currentSectionIndex ? 'block' : 'none';
  });
};

DOM.prevButton.addEventListener('click', () => {
  currentSectionIndex = (currentSectionIndex === 0) ? sections.length - 1 : currentSectionIndex - 1;
  updateCarousel();
});

DOM.nextButton.addEventListener('click', () => {
  currentSectionIndex = (currentSectionIndex + 1) % sections.length;
  updateCarousel();
});

DOM.startButton.addEventListener('click', () => {
  isRunning ? resetTimer() : startTimer();
});

DOM.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  resetTimer();
});

const initialize = () => {
  loadSettings();
  resetTimer();
  updateCarousel();
};

initialize();
