const listas = {
  Frutas: ["BANANA", "MELANCIA", "MORANGO", "UVA", "MANGA"],
  Cidades: ["MANAUS", "CURITIBA", "SAO PAULO", "FORTALEZA"],
  Paises: ["BRASIL", "ARGENTINA", "JAPAO", "FRANCA", "ALEMANHA"],
  Objetos: ["CADEIRA", "MESA", "LAPIS", "CELULAR", "CADERNO", "GARRAFA"],
};

// Elementos DOM
const alerts = document.getElementById("Alerts");
const menuAlerts = document.getElementById("menuAlerts");
const display = document.querySelector("#display");
const btnKick = document.getElementById("btnChutar");
const displayKicks = document.getElementById("chutes");
const enterLetter = document.getElementById("enterLetter");
const imgForca = document.getElementById("imagem");
const btnRetry = document.getElementById("btnRecomecar");
const areaJogo = document.getElementById("area-jogo");
const btnIniciar = document.getElementById("startGameBtn");
const menuInicial = document.getElementById("menu-inicial");
const categoriaRadios = document.getElementById("categoria-selecionada");
const btnReturn = document.getElementById("btnCloseGame");

// Variaveis de controle
let letrasChutes;
let erros;
let randonItem;
let underscoreItem;
let selected;

const LIMITE_ERROS = 8;

function clearAlerts() {
  alerts.innerText = "";
  menuAlerts.innerText = "";
}

function normalizeLetter(letter) {
  return letter
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function initGame(categoryName) {
  letrasChutes = [];
  erros = 0;

  selected = categoryName || document.querySelector('input[name="categoria"]:checked')?.value;
  const categoryList = listas[selected];

  if (!categoryList) {
    areaJogo.classList.add("hidden");
    menuInicial.classList.remove("hidden");
    menuAlerts.innerText = "Por favor, selecione uma categoria.";
    return;
  }

  randonItem = categoryList[Math.floor(Math.random() * categoryList.length)].toUpperCase();
  underscoreItem = randonItem.split("").map((char) => (char === " " ? " " : "_"));

  clearAlerts();
  displayKicks.innerText = "";

  btnRetry.classList.add("hidden");
  enterLetter.classList.remove("hidden");
  btnKick.classList.remove("hidden");

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

  const letterSort = [...letrasChutes].sort();
  displayKicks.innerText = letterSort.join(", ");
  imgForca.src = `./assets/img/game-level-${erros}.png`;

  if (erros === LIMITE_ERROS - 2) {
    alerts.innerText = "Cuidado! Voce so tem mais 2 tentativas.";
  }

  if (erros >= LIMITE_ERROS) {
    endGame(`VOCE PERDEU! A palavra era: ${randonItem}`);
  } else if (!underscoreItem.includes("_")) {
    endGame("VOCE VENCEU!");
  }
}

btnKick.addEventListener("click", (e) => {
  e.preventDefault();
  const letterValue = normalizeLetter(enterLetter.value);

  if (!/^[A-Z]$/.test(letterValue)) {
    alerts.innerText = "Insira uma letra valida.";
    enterLetter.value = "";
    enterLetter.focus();
    return;
  }

  if (letrasChutes.includes(letterValue)) {
    alerts.innerText = "Voce ja chutou esta letra.";
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
  enterLetter.disabled = true;
  btnKick.disabled = true;
  enterLetter.classList.add("hidden");
  btnKick.classList.add("hidden");
  btnRetry.classList.remove("hidden");
}

btnIniciar.addEventListener("click", () => {
  const selectedCategory = document.querySelector('input[name="categoria"]:checked')?.value;

  if (selectedCategory) {
    initGame(selectedCategory);
  } else {
    menuAlerts.innerText = "Por favor, selecione uma categoria.";
  }
});

btnRetry.addEventListener("click", () => {
  initGame(selected);
});

btnReturn.addEventListener("click", () => {
  areaJogo.classList.add("hidden");
  menuInicial.classList.remove("hidden");
  clearAlerts();
  document.querySelectorAll('input[name="categoria"]').forEach((radio) => {
    radio.checked = false;
  });
});

enterLetter.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnKick.click();
  }
});
