
/**
 * Application de minuterie pour la technique Pomodoro.
 * Cette application dispose d'un minuteur qui alterne entre des modes de travail et de repos,
 * permet de personnaliser les durées et joue des sons lors des transitions.
 */

let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft;
let workCycleCount = 0;

/**
 * Éléments DOM utilisés dans l'application
 * @type {Object}
 */
const DOM = {
  timerDisplay: document.getElementById('timer'),
  startButton: document.getElementById('start-button'),
  modeLabel: document.getElementById('mode-label'),
  workSound: document.getElementById('work-sound'),
  workDurationInput: document.getElementById('work-duration'),
  restDurationInput: document.getElementById('rest-duration'),
  longRestDurationInput: document.getElementById('long-rest-duration'),
  settingsForm: document.getElementById('settings-form'),
  modeContainer: document.getElementById('mode-container'),
  modeIcon: document.getElementById('mode-icon'),
  settingsButton: document.getElementById('settings-button'),
  modal: document.getElementById('settings-modal'),
  closeButton: document.querySelector('.close-button')
};

/**
 * Durées par défaut pour le travail et le repos.
 * @type {Object}
 */
const DEFAULTS = {
  workDuration: 25,
  restDuration: 5,
  longRestDuration: 15
};


/**
 * Charge les paramètres à partir du stockage local et initialise les champs de durée.
 */
const loadSettings = () => {
  DOM.workDurationInput.value = localStorage.getItem('workDuration') || DEFAULTS.workDuration;
  DOM.restDurationInput.value = localStorage.getItem('restDuration') || DEFAULTS.restDuration;
  DOM.longRestDurationInput.value = localStorage.getItem('longRestDuration') || DEFAULTS.longRestDuration;
};

/**
 * Enregistre les paramètres actuels dans le stockage local.
 */
const saveSettings = () => {
  localStorage.setItem('workDuration', DOM.workDurationInput.value);
  localStorage.setItem('restDuration', DOM.restDurationInput.value);
  localStorage.setItem('longRestDuration', DOM.longRestDurationInput.value);
};

/**
 * Formate le temps en secondes sous forme de chaîne en format MM:SS ou HH:MM:SS.
 * @param {number} seconds - Le temps en secondes à formater.
 * @returns {string} La chaîne de temps formatée.
 */
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

/**
 * Met à jour l'affichage du minuteur dans le DOM.
 */
const updateTimer = () => DOM.timerDisplay.textContent = formatTime(timeLeft);

/**
 * Obtient la durée actuelle en fonction du mode (travail/repos).
 * @returns {number} La durée en secondes pour le mode actuel.
 */
const getCurrentDuration = () => {
  if (isWorkMode) {
    return DOM.workDurationInput.value * 60;
  } else {
    if (workCycleCount < 4) {
      return DOM.restDurationInput.value * 60; 
    } else {
      return DOM.longRestDurationInput.value * 60; 
    }
  }
};

/**
 * Change entre le mode travail et le mode repos, met à jour le minuteur et l'affichage.
 */
const switchMode = () => {
  if (isWorkMode) {
    workCycleCount++; 
  }
  isWorkMode = !isWorkMode;
  timeLeft = getCurrentDuration();
  updateModeDisplay();
  setTimeout(() => {
    updateTimer();
  }, 1000);  
};

/**
 * Met à jour l'affichage pour refléter le mode actuel (travail/repos).
 */
const updateModeDisplay = () => {
  const { modeContainer, modeIcon, timerDisplay } = DOM;
  modeContainer.classList.toggle('fade-out');

  setTimeout(() => {
    DOM.modeLabel.textContent = isWorkMode ? 'Travail' : (workCycleCount < 4 ? 'Repos' : 'Grande Pause');
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : (workCycleCount < 4 ? 'fas fa-bed' : 'fas fa-coffee');
    timerDisplay.style.backgroundColor = isWorkMode ? '#b91c1c' : (workCycleCount < 4 ? 'green' : '#2196F3'); 
    document.body.style.background = isWorkMode
      ? 'linear-gradient(45deg, #b91c1c, #c62828, #d32f2f, #e57373)'
      : (workCycleCount < 4
        ? 'linear-gradient(45deg, #4caf50, #66bb6a, #81c784, #a5d6a7)'
        : 'linear-gradient(45deg, #2196F3, #42a5f5, #64b5f6, #90caf9)');
    DOM.workSound.play();
    sendNotification(isWorkMode ? 'Temps de travail !' : (workCycleCount < 4 ? 'Temps de repos !' : 'Temps de grande pause !'));
    modeContainer.classList.toggle('fade-in');
  }, 1);
};

const sendNotification = (message) => {
  if (Notification.permission === 'granted') {
    new Notification(message);
  }
};

const requestNotificationPermission = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permission de notification accordée');
      } else {
        console.log('Permission de notification refusée');
      }
    });
  }
};

/**
 * Démarre le compte à rebours du minuteur et met à jour l'affichage.
 */
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
  }, 1000); // Le minuteur se met à jour toutes les 100 millisecondes

  DOM.startButton.innerHTML = '<strong class="fas fa-redo" aria-hidden="true"></strong>';
  isRunning = true;
};

/**
 * Réinitialise le minuteur à son état initial.
 */
const resetTimer = () => {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  workCycleCount = 0;
  timeLeft = getCurrentDuration();
  DOM.timerDisplay.classList.remove('heartbeat'); 
  updateTimer();
};

// Écouteurs d'événements pour les actions des boutons
DOM.startButton.addEventListener('click', () => {
  if (!isRunning) {
    requestNotificationPermission(); // Demande de permission pour les notifications
    startTimer();
  } else {
    location.reload();
    resetTimer();
  }
});

// Événement de soumission du formulaire des paramètres
DOM.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  resetTimer();
  DOM.modal.style.display = 'none';
});

// Ouvrir le modal des paramètres
DOM.settingsButton.addEventListener('click', () => {
  DOM.modal.style.display = 'block';
});

// Fermer le modal des paramètres
DOM.closeButton.addEventListener('click', () => {
  DOM.modal.style.display = 'none';
});

// Fermer le modal en cliquant en dehors de celui-ci
window.addEventListener('click', (event) => {
  if (event.target === DOM.modal) {
    DOM.modal.style.display = 'none';
  }
});

/**
 * Initialise l'application en chargeant les paramètres et en réinitialisant le minuteur.
 */
const initialize = () => {
  loadSettings();
  resetTimer();
};

// Démarre l'application
initialize();

