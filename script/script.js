/**
 * Application de minuterie pour la technique Pomodoro.
 * Cette application dispose d'un minuteur qui alterne entre des modes de travail et de repos,
 * permet de personnaliser les durées et joue des sons lors des transitions.
 */

let timer;                     // Contient l'ID de l'intervalle du minuteur
let isRunning = false;        // Indique si le minuteur est actuellement en cours d'exécution
let isWorkMode = true;        // Indique si le minuteur est en mode travail
let timeLeft;                 // Contient le temps restant en secondes

/**
 * Éléments DOM utilisés dans l'application
 * @type {Object}
 */
const DOM = {
  timerDisplay: document.getElementById('timer'),           // Élément d'affichage pour le minuteur
  startButton: document.getElementById('start-button'),     // Bouton pour démarrer/réinitialiser le minuteur
  modeLabel: document.getElementById('mode-label'),         // Étiquette affichant le mode actuel (travail/repos)
  workSound: document.getElementById('work-sound'),         // Son joué en mode travail
  workDurationInput: document.getElementById('work-duration'), // Champ pour la durée de travail
  restDurationInput: document.getElementById('rest-duration'), // Champ pour la durée de repos
  settingsForm: document.getElementById('settings-form'),   // Formulaire pour les paramètres
  modeContainer: document.getElementById('mode-container'),   // Conteneur pour l'affichage du mode
  modeIcon: document.getElementById('mode-icon'),           // Icône représentant le mode actuel
  settingsButton: document.getElementById('settings-button'), // Bouton pour ouvrir le modal des paramètres
  modal: document.getElementById('settings-modal'),         // Modal pour les paramètres
  modalContent: document.querySelector('.modal-content'),    // Contener du modal
  SaveButton : document.querySelector('.save-button'),
  closeButton: document.querySelector('.close-button')      // Bouton pour fermer le modal des paramètres
};

/**
 * Durées par défaut pour le travail et le repos.
 * @type {Object}
 */
const DEFAULTS = {
  workDuration: 25,  // Durée de travail par défaut en minutes
  restDuration: 5    // Durée de repos par défaut en minutes
};

/**
 * Charge les paramètres à partir du stockage local et initialise les champs de durée.
 */
const loadSettings = () => {
  DOM.workDurationInput.value = localStorage.getItem('workDuration') || DEFAULTS.workDuration;
  DOM.restDurationInput.value = localStorage.getItem('restDuration') || DEFAULTS.restDuration;
};

/**
 * Enregistre les paramètres actuels dans le stockage local.
 */
const saveSettings = () => {
  localStorage.setItem('workDuration', DOM.workDurationInput.value);
  localStorage.setItem('restDuration', DOM.restDurationInput.value);
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
  return (isWorkMode ? DOM.workDurationInput.value : DOM.restDurationInput.value) * 60;
};

/**
 * Change entre le mode travail et le mode repos, met à jour le minuteur et l'affichage.
 */
const switchMode = () => {
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
    DOM.modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : 'fas fa-bed';
    timerDisplay.style.backgroundColor = isWorkMode ? '#b91c1c' : 'green';

    // Définit le gradient de fond en fonction du mode
    document.body.style.background = isWorkMode 
      ? 'linear-gradient(45deg, #b91c1c, #c62828, #d32f2f, #e57373)' 
      : 'linear-gradient(45deg, #4caf50, #66bb6a, #81c784, #a5d6a7)';

    DOM.modalContent.style.background = isWorkMode 
      ? 'linear-gradient(45deg, #b91c1c, #c62828, #d32f2f, #e57373)' 
      : 'linear-gradient(45deg, #4caf50, #66bb6a, #81c784, #a5d6a7)';  

    DOM.SaveButton.style.background = isWorkMode 
      ? '#b91c1c' 
      : '#4caf50';    

    DOM.workSound.play();
    modeContainer.classList.toggle('fade-in');
  }, 1);
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
  }, 1000); // Le minuteur se met à jour toutes les 1000 millisecondes

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
  timeLeft = getCurrentDuration();
  DOM.timerDisplay.classList.remove('heartbeat'); 
  updateTimer();
};

// Écouteurs d'événements pour les actions des boutons
DOM.startButton.addEventListener('click', () => {
  if (isRunning) {
    location.reload();
    resetTimer();
  } else {
    startTimer();
  }
});

// Événement de soumission du formulaire des paramètres
DOM.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  location.reload();
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
