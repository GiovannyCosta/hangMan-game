const listas = {
  Frutas: ["BANANA", "MELANCIA", "MORANGO", "UVA", "MANGA"],
  Cidades: ["MANAUS", "CURITIBA", "SAO PAULO", "FORTALEZA"],
  Paises: ["BRASIL", "ARGENTINA", "JAPAO", "FRANCA"],
};

// Elementos DOM
const alerts = document.getElementById("Alerts");
const display = document.querySelector("#display");
const btnKick = document.getElementById("btnChutar");
const displayKicks = document.getElementById("chutes");
const enterLetter = document.getElementById("enterLetter");
const imgForca = document.getElementById("imagem");
const btnRetry = document.getElementById("btnRecomecar");
// novos itens para menu de game
const areaJogo = document.getElementById("area-jogo");
const btnIniciar = document.getElementById("startGameBtn");
const menuInicial = document.getElementById("menu-inicial");
const categoriaRadios = document.getElementById("categoria-selecionada");

// Botão de voltar ao menu
const btnReturn = document.getElementById("btnCloseGame");

// Variáveis de controle
let letrasChutes, erros, randonItem, underscoreItem, selected;
const LIMITE_ERROS = 8;

function initGame(categoryName) {
  letrasChutes = [];

  erros = 0;

  // Corrigido: Se categoryName não existir, busca o valor do rádio marcado
  selected =
    categoryName ||
    document.querySelector('input[name="categoria"]:checked')?.value;
  const categoryList = listas[selected];

  // Corrigido: Verifica se a lista existe antes de prosseguir
  if (!categoryList) {
    areaJogo.classList.add("hidden");
    menuInicial.classList.remove("hidden");
    return;
  }

  randonItem =
    categoryList[Math.floor(Math.random() * categoryList.length)].toUpperCase();
  underscoreItem = Array(randonItem.length).fill("_");

  // Reset visual e transição de telas
  alerts.innerText = "";
  displayKicks.innerText = "";
  btnRetry.style.display = "none";
  enterLetter.style.display = "block";
  btnKick.style.display = "block";
  btnKick.disabled = false;
  enterLetter.disabled = false;

  menuInicial.classList.add("hidden");
  areaJogo.classList.remove("hidden");
  enterLetter.focus();

  updateScreen();
}

function updateScreen() {
  categoriaRadios.innerText = selected;
  display.innerText = underscoreItem.join(" ");
  letterSort = letrasChutes.sort();
  displayKicks.innerText = letterSort.join(", ");
  imgForca.src = `./assets/img/game-level-${erros}.png`;

  if (erros === 6) {
    alerts.innerText = "Cuidado! Você só tem mais 2 tentativas.";
  }

  if (erros >= LIMITE_ERROS) {
    endGame(`VOCÊ PERDEU! A palavra era: ${randonItem}`);
    btnRetry.classList.remove("hidden");
  } else if (!underscoreItem.includes("_")) {
    endGame("VOCÊ VENCEU! 🎉");
  }
}

btnKick.addEventListener("click", e => {
  e.preventDefault();
  let letterValue = enterLetter.value.toUpperCase().trim();

  if (!letterValue.match(/[a-zà-ùç]/i) || letterValue === "") {
    alerts.innerText = "Insira uma letra válida.";
    enterLetter.value = "";
    enterLetter.focus(); // Corrigido: foco no elemento de input
    return;
  }

  if (letrasChutes.includes(letterValue)) {
    alerts.innerText = "Você já chutou esta letra.";
    enterLetter.value = "";
    enterLetter.focus();
    return;
  }

  alerts.innerText = "";
  letrasChutes.push(letterValue);

  if (randonItem.includes(letterValue)) {
    for (let i = 0; i < randonItem.length; i++) {
      if (randonItem[i] === letterValue) underscoreItem[i] = letterValue;
    }
  } else {
    erros++;
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

// Botão Iniciar: Passa explicitamente o valor selecionado
btnIniciar.addEventListener("click", () => {
  const selected = document.querySelector(
    'input[name="categoria"]:checked',
  )?.value;
  if (selected) {
    initGame(selected);
  } else {
    alerts.innerText = "Por favor, selecione uma categoria.";
  }
});

// Botão Recomeçar
btnRetry.addEventListener("click", () => {
  initGame();
});

btnReturn.addEventListener("click", () => {
  areaJogo.classList.add("hidden");
  menuInicial.classList.remove("hidden");
  alerts.innerText = "";
  document
    .querySelectorAll('input[name="categoria"]')
    .forEach(r => (r.checked = false));
});

enterLetter.addEventListener("keypress", e => {
  if (e.key === "Enter") btnKick.click();
});

// Inicia apenas se houver seleção, caso contrário mantém o menu
window.onload = () => initGame();
