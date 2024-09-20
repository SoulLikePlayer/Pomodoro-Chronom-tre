let timer;
let isRunning = false;
let isWorkMode = true;
let timeLeft; // On l'initialise plus tard dans le code

// Sélection des éléments DOM
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const modeLabel = document.getElementById('mode-label');
const workSound = document.getElementById('work-sound');
const restSound = document.getElementById('rest-sound');
const workDurationInput = document.getElementById('work-duration');
const restDurationInput = document.getElementById('rest-duration');
const settingsForm = document.getElementById('settings-form');

// Valeurs par défaut pour le travail et le repos
const defaultWorkDuration = 25; // 25 minutes
const defaultRestDuration = 5;  // 5 minutes

// Charger les durées du localStorage ou utiliser les valeurs par défaut
function loadSettings() {
  const savedWorkDuration = localStorage.getItem('workDuration');
  const savedRestDuration = localStorage.getItem('restDuration');

  // Si localStorage est vide, utiliser les valeurs par défaut
  workDurationInput.value = savedWorkDuration ? savedWorkDuration : defaultWorkDuration;
  restDurationInput.value = savedRestDuration ? savedRestDuration : defaultRestDuration;
}

// Sauvegarder les paramètres dans localStorage
function saveSettings() {
  localStorage.setItem('workDuration', workDurationInput.value);
  localStorage.setItem('restDuration', restDurationInput.value);
}

// Formatage du temps
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Mise à jour de l'affichage du chronomètre
function updateTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// Changement de mode Travail / Repos
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

// Démarrage du chronomètre
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

// Réinitialisation du chronomètre
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  updateTimeLeft();
  updateTimer();
  startButton.innerHTML = '<span class="fas fa-play" aria-hidden="true"></span>';
  timerDisplay.style.backgroundColor = 'red';
}

// Mise à jour du temps restant en fonction du mode
function updateTimeLeft() {
  const workDuration = parseInt(workDurationInput.value, 10) * 60;
  const restDuration = parseInt(restDurationInput.value, 10) * 60;
  timeLeft = isWorkMode ? workDuration : restDuration;
}

// Gestion du clic sur le bouton démarrer
startButton.addEventListener('click', () => {
  if (isRunning) {
    resetTimer();
  } else {
    updateTimeLeft();
    updateTimer();
    startTimer();
  }
});

// Gestion de la soumission du formulaire
settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveSettings();
  updateTimeLeft();
  updateTimer();
});

// Charger les paramètres et initialiser le chronomètre à l'ouverture de la page
loadSettings();
updateTimeLeft();  // Initialisation correcte de timeLeft
updateTimer();     // Mise à jour correcte de l'affichage du chronomètre
