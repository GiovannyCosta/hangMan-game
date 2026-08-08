(function exposeHangmanCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.HangmanCore = api;
})(
  typeof globalThis !== "undefined" ? globalThis : this,
  function createHangmanCore() {
    const WORDS = {
      Frutas: [
        { word: "ABACAXI", clue: "Tem uma coroa, mas não é rei." },
        {
          word: "MELANCIA",
          clue: "Grande, verde por fora e vermelha por dentro.",
        },
        {
          word: "MORANGO",
          clue: "Pequena fruta vermelha com sementes do lado de fora.",
        },
        {
          word: "MARACUJA",
          clue: "Fruta associada à calma e de sabor marcante.",
        },
        { word: "TANGERINA", clue: "Cítrica, perfumada e dividida em gomos." },
      ],
      Objetos: [
        { word: "CADEIRA", clue: "Tem pernas, mas não anda." },
        { word: "CADERNO", clue: "Guarda anotações entre folhas e capa." },
        {
          word: "GARRAFA",
          clue: "Recipiente usado para transportar líquidos.",
        },
        { word: "TESOURA", clue: "Duas lâminas que trabalham juntas." },
        { word: "TECLADO", clue: "Conjunto de teclas usado para escrever." },
      ],
      Cidades: [
        { word: "MANAUS", clue: "Capital brasileira cercada pela Amazônia." },
        {
          word: "CURITIBA",
          clue: "Capital paranaense conhecida pelo clima frio.",
        },
        { word: "FORTALEZA", clue: "Capital cearense banhada pelo Atlântico." },
        { word: "SALVADOR", clue: "Primeira capital do Brasil." },
        { word: "BRASILIA", clue: "Capital planejada em formato monumental." },
      ],
      Paises: [
        { word: "BRASIL", clue: "Maior país da América do Sul." },
        { word: "ARGENTINA", clue: "País vizinho conhecido pelo tango." },
        {
          word: "JAPAO",
          clue: "Arquipélago chamado de terra do sol nascente.",
        },
        {
          word: "ALEMANHA",
          clue: "País europeu conhecido por castelos e engenharia.",
        },
        { word: "PORTUGAL", clue: "País europeu onde se fala português." },
      ],
      Tecnologia: [
        {
          word: "ALGORITMO",
          clue: "Sequência de passos para resolver um problema.",
        },
        {
          word: "JAVASCRIPT",
          clue: "Linguagem muito usada para interatividade na web.",
        },
        {
          word: "NAVEGADOR",
          clue: "Programa usado para acessar páginas da internet.",
        },
        {
          word: "SERVIDOR",
          clue: "Computador que entrega dados a outros dispositivos.",
        },
        {
          word: "INTERFACE",
          clue: "Camada pela qual pessoas interagem com sistemas.",
        },
      ],
    };
    const LIMITS = { relax: 8, arena: 6, extreme: 4 };
    function normalizeLetter(value) {
      return String(value || "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    }
    function chooseEntry(category, random = Math.random, previousWord = "") {
      const source =
        category === "Aleatorio"
          ? Object.values(WORDS).flat()
          : WORDS[category];
      if (!source) throw new TypeError("Categoria inválida");
      const available =
        source.length > 1
          ? source.filter((entry) => entry.word !== previousWord)
          : source;
      return available[Math.floor(random() * available.length)];
    }
    function createMask(word) {
      return [...word].map((character) => (character === " " ? " " : "_"));
    }
    function applyGuess(word, mask, letter) {
      const normalized = normalizeLetter(letter);
      const nextMask = [...mask];
      let matches = 0;
      [...word].forEach((character, index) => {
        if (normalizeLetter(character) === normalized) {
          nextMask[index] = character;
          matches++;
        }
      });
      return { mask: nextMask, matches };
    }
    function imageLevel(errors, limit) {
      return Math.min(8, Math.round((errors / limit) * 8));
    }
    function calculateScore(word, errors, seconds, limit) {
      return Math.max(
        50,
        word.length * 35 + (limit - errors) * 40 - seconds * 2,
      );
    }
    return {
      WORDS,
      LIMITS,
      normalizeLetter,
      chooseEntry,
      createMask,
      applyGuess,
      imageLevel,
      calculateScore,
    };
  },
);
