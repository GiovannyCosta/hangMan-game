const listas = {
  Frutas: ["BANANA", "MELANCIA", "MORANGO", "UVA", "MANGA"],
  Cidades: ["MANAUS", "CURITIBA", "SAO PAULO", "FORTALIZA"],
  Paises: ["BRASIL", "ARGENTINA", "JAPAO", "FRANCA"],
};

const alerts = document.getElementById("Alerts");

const selectModos = document.getElementById("typeItems");
const display = document.querySelector("#display");

// UI
const btnKick = document.getElementById("btnChutar");
const displayKicks = document.getElementById("chutes");
const enterLetter = document.getElementById("enterLetter");
const message = document.getElementById("mensagem");
const imgForca = document.getElementById("imagem");
const btnRetry = document.getElementById("btnRecomecar");

// // Variáveis de controle do jogo
let letrasChutes;
let maxErros;
let erros;
let randonItem = ""; // usado
let underscoreItem = ""; // usado

function initGame() {
  letrasChutes = [];
  erros = 0;
  maxErros = 7;

  let selected = selectModos.value;
  let category = listas[selected];

  if (!category) {
    btnKick.disabled = true;
    enterLetter.disabled = true;
    console.error("Erro: Categoria não encontrada!");
    return; // Para a função aqui se algo estiver errado
  }
  btnKick.disabled = false;
  enterLetter.disabled = false;

  const randonWord =
    category[Math.floor(Math.random() * category.length)].toUpperCase();
  randonItem = randonWord;

  underscoreItem = Array(randonItem.length).fill("_");

  console.clear();
  console.log("Status: OK - Categoria encontrada!");
  console.clear();
  console.log("Modo:", selected);
  console.log("Palavra sorteada:", randonItem);
  updateScreen();
}
function updateScreen() {
  display.innerText = underscoreItem.join(" ");
  displayKicks.innerText = letrasChutes.join(", ");
  imgForca.src = `./assets/img/game-level-${erros}.png`;

  if (maxErros === 0) {
    endGame("VOCÊ PERDEU!");
  } else if (!underscoreItem.includes("_")) {
    endGame("VOCÊ VENCEU!");
  }
}

btnKick.addEventListener("click", e => {
  let letterValue = enterLetter.value.toUpperCase().trim();
  if (!letterValue.match(/[a-zà-ùç]/i)) {
    alerts.innerText = "por favor insira uma letra valida.";
    enterLetter.value = "";
    enterLetter.focus();
    return;
  }

  if (letrasChutes.includes(letterValue)) {
    alerts.innerText =
      "voce já chutou esta letra, por favor tente uma diferente.";
    enterLetter.value = "";
    enterLetter.focus();
    return;
  }
  letrasChutes.push(letterValue);
  console.log(letrasChutes);
  if (randonItem.includes(letterValue)) {
    for (i = 0; i < randonItem.length; i++) {
      if (randonItem[i] === letterValue) {
        underscoreItem[i] = letterValue;
      }
    }
  } else {
    erros++;
    maxErros--;
  }
  enterLetter.value = "";
  e.preventDefault();
  updateScreen();
});

function endGame(msg) {
  btnKick.disabled = true;
  enterLetter.disabled = true;
  alerts.innerText = msg;
}

selectModos.addEventListener("change", initGame);
window.load = initGame();
