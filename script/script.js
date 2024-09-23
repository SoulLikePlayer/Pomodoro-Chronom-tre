let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft; // Initialisé plus tard

// Sélection des éléments DOM
const DOM = {
  timerDisplay: document.getElementById('timer'),
  startButton: document.getElementById('start-button'),
  modeLabel: document.getElementById('mode-label'),
  workSound: document.getElementById('work-sound'),
  restSound: document.getElementById('rest-sound'),
  workDurationInput: document.getElementById('work-duration'),
  restDurationInput: document.getElementById('rest-duration'),
  settingsForm: document.getElementById('settings-form'),
  modeContainer: document.getElementById('mode-container'),
  modeIcon: document.getElementById('mode-icon')
};

// Valeurs par défaut pour le travail et le repos
const DEFAULTS = {
  workDuration: 25,  // 25 minutes
  restDuration: 5    // 5 minutes
};

// Charger les durées du localStorage ou utiliser les valeurs par défaut
const loadSettings = () => {
  DOM.workDurationInput.value = localStorage.getItem('workDuration') || DEFAULTS.workDuration;
  DOM.restDurationInput.value = localStorage.getItem('restDuration') || DEFAULTS.restDuration;
};

// Sauvegarder les paramètres dans localStorage
const saveSettings = () => {
  localStorage.setItem('workDuration', DOM.workDurationInput.value);
  localStorage.setItem('restDuration', DOM.restDurationInput.value);
};

// Formatage du temps
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Mise à jour de l'affichage du chronomètre
const updateTimer = () => DOM.timerDisplay.textContent = formatTime(timeLeft);

// Calculer la durée en secondes selon le mode
const getCurrentDuration = () => {
  return (isWorkMode ? DOM.workDurationInput.value : DOM.restDurationInput.value) * 60;
};

// Changer le mode (Travail / Repos) et jouer le son
const switchMode = () => {
  isWorkMode = !isWorkMode;
  timeLeft = getCurrentDuration();
  updateModeDisplay();
  updateTimer();
};

// Mise à jour de l'affichage du mode et animation
const updateModeDisplay = () => {
  const { modeContainer, modeIcon, timerDisplay } = DOM;
  modeContainer.classList.toggle('fade-out');

  setTimeout(() => {
    DOM.modeLabel.textContent = isWorkMode ? 'Travail' : 'Repos';
    modeIcon.className = isWorkMode ? 'fas fa-briefcase' : 'fas fa-bed';
    modeContainer.classList.toggle('fade-in');
    timerDisplay.style.backgroundColor = isWorkMode ? 'red' : 'green';
    (isWorkMode ? DOM.workSound : DOM.restSound).play();
  }, 500);
};

// Démarrer le chronomètre
const startTimer = () => {
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
  DOM.startButton.innerHTML = '<strong class="fas fa-redo" aria-hidden="true"></strong>';
  isRunning = true;
};

// Réinitialiser le chronomètre
const resetTimer = () => {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  timeLeft = getCurrentDuration();
  updateTimer();
  DOM.startButton.innerHTML = '<strong class="fas fa-play" aria-hidden="true"></strong>';
  DOM.timerDisplay.style.backgroundColor = 'red';
};

// Gestion du bouton de démarrage
DOM.startButton.addEventListener('click', () => {
  isRunning ? resetTimer() : startTimer();
});

// Gestion de la soumission du formulaire
DOM.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  resetTimer();  // Réinitialise et applique les nouvelles durées
});

// Initialisation à l'ouverture de la page
const initialize = () => {
  loadSettings();
  resetTimer();
};

// Charger les paramètres et initialiser le chronomètre
initialize();
