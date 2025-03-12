const apiUrl = "https://restcountries.com/v3.1/all";
let countries = [];
let currentQuestion = 0;
let score = 0;
const maxQuestions = 20;

const flagImage = document.getElementById("flagImage");
const optionsContainer = document.getElementById("options");
const resultText = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");
const scoreText = document.getElementById("score");
const scoreCard = document.getElementById("scoreCard"); // Sélectionner la carte de score

// Charger les pays depuis l'API
async function fetchCountries() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    countries = data.map((country) => ({
      name: country.name.common,
      flag: country.flags.svg,
    }));
    shuffleArray(countries);
    loadQuestion();
  } catch (error) {
    console.error("Erreur API :", error);
  }
}

// Mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Redémarrer le jeu
function restartGame() {
  score = 0; // Réinitialiser le score
  currentQuestion = 0; // Réinitialiser la question
  shuffleArray(countries); // Mélanger les pays à nouveau
  resultText.textContent = ""; // Réinitialiser le message de résultat
  scoreCard.classList.remove("hidden"); // Réafficher la carte de score
  nextBtn.style.display = "none"; // Masquer le bouton "Suivant" au début
  flagImage.style.display = "block"; // Réafficher l'image du drapeau

  // Réafficher le titre du jeu
  document.querySelector("h1").style.display = "block";

  // Recharger la première question
  loadQuestion();
}

// Charger une question
function loadQuestion() {
  if (currentQuestion >= maxQuestions) {
    endGame();
    return;
  }

  const correctCountry = countries[currentQuestion];
  flagImage.src = correctCountry.flag;
  optionsContainer.innerHTML = "";
  resultText.textContent = "";

  // Générer les choix
  let options = [correctCountry.name];
  while (options.length < 4) {
    let randomCountry =
      countries[Math.floor(Math.random() * countries.length)].name;
    if (!options.includes(randomCountry)) {
      options.push(randomCountry);
    }
  }

  shuffleArray(options);

  // Affichage des boutons
  options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add(
      "option",
      "bg-gray-200",
      "hover:bg-blue-500",
      "hover:text-white",
      "text-gray-800",
      "font-semibold",
      "py-3",
      "px-6",
      "rounded-lg",
      "shadow-md",
      "transition",
      "duration-200"
    );
    button.textContent = option;
    button.onclick = () => checkAnswer(option, correctCountry.name);
    optionsContainer.appendChild(button);
  });

  updateScoreText();
}

// Vérification de la réponse
function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
    resultText.textContent = "Bonne réponse ✅";
    resultText.className = "mt-6 text-green-600 text-2xl font-semibold";
  } else {
    resultText.innerHTML = `
      <p class="mt-6 text-red-600 text-2xl font-semibold">Faux ❌</p>
      <p class="mt-6 text-lg font-medium text-gray-800">C'était <strong>${correct} !</strong></p>
    `;
  }

  document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));
  updateScoreText();
  nextBtn.style.display = "inline-block"; // Afficher le bouton "Suivant" après avoir répondu
}

// Mettre à jour l'affichage du score
function updateScoreText() {
  scoreText.textContent = `Score : ${score} | Question ${
    currentQuestion + 1
  } / ${maxQuestions}`;
}

// Passer à la question suivante
nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < maxQuestions) {
    loadQuestion();
    nextBtn.classList.add("hidden");
  } else {
    endGame();
  }
};

// Fin du jeu
function endGame() {
  optionsContainer.innerHTML = "";
  flagImage.style.display = "none";

  // Masquer le titre du jeu
  document.querySelector("h1").style.display = "none";

  // Message d'encouragement en fonction du score
  let encouragementMessage = "";
  if (score < 5) {
    encouragementMessage =
      "Ce n'était pas facile, mais tu peux faire mieux la prochaine fois ! 💪";
  } else if (score < 10) {
    encouragementMessage = "Bien joué, tu as presque atteint la moitié ! 😎";
  } else if (score < 15) {
    encouragementMessage = "Super ! Tu maîtrises bien les drapeaux ! 🎉";
  } else {
    encouragementMessage = "Bravo ! Tu es un expert en drapeaux ! 🌟";
  }

  // Création des éléments pour structurer l'affichage sans espace
  resultText.innerHTML = `
        <div class="flex flex-col items-center justify-center m-0 p-0 h-full">
            <div class="text-3xl font-bold text-blue-700 mt-[-50px]">Quiz terminé ! 🎉</div>
            <div class="text-2xl font-semibold text-blue-600 mt-4">Score final : ${score} / ${maxQuestions}</div>
            <div class="text-xl font-medium text-gray-800 mt-4">${encouragementMessage}</div>
            <button 
              id="restartBtn" 
              class="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
            >
              Recommencer
            </button>
        </div>
      `;

  // Masquer le bouton "Suivant"
  nextBtn.style.display = "none";
  scoreCard.classList.add("hidden"); // Masquer le score après la fin du jeu

  // Ajouter l'événement au bouton "Recommencer"
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.onclick = restartGame;
}

// Démarrer le quiz
fetchCountries();
