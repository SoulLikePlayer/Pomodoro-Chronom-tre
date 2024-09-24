let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft;
let totalDuration;

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

  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
    timerDisplay.style.backgroundColor = isWorkMode ? '#b91c1c' : '#4caf50'; // Changer la couleur selon le mode
    DOM.workSound.play();
    modeContainer.classList.toggle('fade-in');
  }, 500);
};

const startTimer = () => {
  timeLeft = getCurrentDuration();
  DOM.timerDisplay.classList.add('active'); // Ajoute l'animation

  timer = setInterval(() => {
    if (timeLeft === 3) {
      DOM.workSound.play();
    }

    // Vérifier si nous sommes à la moitié du temps
    if (timeLeft === Math.floor(getCurrentDuration() / 2)) {
      DOM.timerDisplay.classList.add('critical'); // Ajoute un battement
      DOM.timerDisplay.style.animationDuration = '0.5s'; // Ralentit le battement
    }

    // Vérifier si nous sommes dans les 5 dernières secondes
    if (timeLeft <= 5) {
      DOM.timerDisplay.style.color = timeLeft % 2 === 0 ? '#ffea00' : '#ffffff'; // Changer en jaune
      DOM.timerDisplay.classList.add('heartbeat'); // Ajoute une animation de battement
      DOM.timerDisplay.style.animationDuration = '0.2s'; // Accélère le battement
    }

    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
      resetStyles(); // Réinitialise les styles avant de changer de mode
      switchMode();
      startTimer();
    }
  }, 1000);

  DOM.startButton.innerHTML = '<strong class="fas fa-redo" aria-hidden="true"></strong>';
  isRunning = true;
};

const resetStyles = () => {
  DOM.timerDisplay.classList.remove('heartbeat'); // Retire l'animation de battement
  DOM.timerDisplay.style.animationDuration = '1s'; // Réinitialise la durée d'animation
  DOM.timerDisplay.style.color = '#ffffff'; // Réinitialise la couleur du texte
};

const resetTimer = () => {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  timeLeft = getCurrentDuration();
  updateTimer();
  DOM.startButton.innerHTML = '<strong class="fas fa-play" aria-hidden="true"></strong>';
  DOM.timerDisplay.style.backgroundColor = '#b91c1c'; 
  DOM.timerDisplay.classList.remove('active'); // Retire l'animation
  resetStyles(); // Réinitialise les styles
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
