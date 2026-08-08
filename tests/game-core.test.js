const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeLetter,
  chooseEntry,
  createMask,
  applyGuess,
  imageLevel,
  calculateScore,
} = require("../assets/js/game-core.js");

test("normaliza letras acentuadas e entradas minúsculas", () => {
  assert.equal(normalizeLetter(" á "), "A");
  assert.equal(normalizeLetter("ç"), "C");
});

test("cria a máscara preservando espaços", () => {
  assert.deepEqual(createMask("SAO PAULO"), [
    "_",
    "_",
    "_",
    " ",
    "_",
    "_",
    "_",
    "_",
    "_",
  ]);
});

test("revela todas as ocorrências da letra escolhida", () => {
  const result = applyGuess("BANANA", createMask("BANANA"), "a");
  assert.equal(result.matches, 3);
  assert.deepEqual(result.mask, ["_", "A", "_", "A", "_", "A"]);
});

test("não repete imediatamente a palavra anterior", () => {
  const first = chooseEntry("Frutas", () => 0, "ABACAXI");
  assert.notEqual(first.word, "ABACAXI");
});

test("converte erros de qualquer dificuldade nos nove estágios", () => {
  assert.equal(imageLevel(0, 6), 0);
  assert.equal(imageLevel(3, 6), 4);
  assert.equal(imageLevel(6, 6), 8);
});

test("pontuação nunca fica abaixo do mínimo", () => {
  assert.equal(calculateScore("UVA", 8, 999, 8), 50);
  assert.ok(calculateScore("ALGORITMO", 0, 10, 6) > 50);
});
