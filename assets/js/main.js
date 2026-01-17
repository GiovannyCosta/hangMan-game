//
const listas = {
  Frutas: ["BANANA", "MELANCIA", "MORANGO", "UVA", "MANGA"],
  Cidades: ["MANAUS", "CURITIBA", "SAO PAULO", "FORTALEZA"],
  Paises: ["BRASIL", "ARGENTINA", "JAPAO", "FRANCA"],
};

// Elementos DOM
const alerts = document.getElementById("Alerts");
const selectModos = document.getElementById("typeItems");
const display = document.querySelector("#display");
const btnKick = document.getElementById("btnChutar");
const displayKicks = document.getElementById("chutes");
const enterLetter = document.getElementById("enterLetter");
const imgForca = document.getElementById("imagem");
const btnRetry = document.getElementById("btnRecomecar");

// Variáveis de controle
let letrasChutes, erros, randonItem, underscoreItem;
const LIMITE_ERROS = 8; //

function initGame() {
  letrasChutes = [];
  erros = 0;

  const category = listas[selectModos.value];
  if (!category) return;

  randonItem =
    category[Math.floor(Math.random() * category.length)].toUpperCase();
  underscoreItem = Array(randonItem.length).fill("_");

  // Reset visual total
  alerts.innerText = "";
  displayKicks.innerText = "";
  btnRetry.style.display = "none";
  enterLetter.style.display = "block";
  btnKick.style.display = "block";
  btnKick.disabled = false;
  enterLetter.disabled = false;
  enterLetter.focus();

  updateScreen();
}

function updateScreen() {
  display.innerText = underscoreItem.join(" ");
  displayKicks.innerText = letrasChutes.join(", ");
  imgForca.src = `./assets/img/game-level-${erros}.png`; //

  // Verifica vitória/derrota
  if (erros >= LIMITE_ERROS) {
    endGame(`VOCÊ PERDEU! A palavra era: ${randonItem}`);
  } else if (!underscoreItem.includes("_")) {
    endGame("VOCÊ VENCEU! 🎉");
  }
}

btnKick.addEventListener("click", e => {
  e.preventDefault();
  let letterValue = enterLetter.value.toUpperCase().trim();

  // Validações
  if (!letterValue.match(/[a-zà-ùç]/i) || letterValue === "") {
    alerts.innerText = "Insira uma letra válida.";
    enterLetter.value = "";
    letterValue.focus();

    return;
  }
  if (letrasChutes.includes(letterValue)) {
    alerts.innerText = "Você já chutou esta letra.";
    enterLetter.value = "";
    letterValue.focus();
    return;
  }

  alerts.innerText = "";
  letrasChutes.push(letterValue);

  if (randonItem.includes(letterValue)) {
    for (let i = 0; i < randonItem.length; i++) {
      if (randonItem[i] === letterValue) underscoreItem[i] = letterValue;
    }
  } else {
    erros++; // Apenas incrementa erros
  }

  enterLetter.value = "";
  enterLetter.focus();
  updateScreen();
});

function endGame(msg) {
  alerts.innerText = msg;
  enterLetter.style.display = "none";
  btnKick.style.display = "none";
  btnRetry.style.display = "block";
}

// Eventos
selectModos.addEventListener("change", initGame);
btnRetry.addEventListener("click", initGame);
enterLetter.addEventListener("keypress", e => {
  if (e.key === "Enter") btnKick.click();
});

// Inicialização correta
window.onload = initGame;
