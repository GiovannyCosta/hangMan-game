<p align="center">
  <img src="./assets/img/readme/ultima-letra-banner-v2.png" alt="Última Letra — Hangman Arena" width="100%">
</p>

<p align="center">
  <strong>Descubra a palavra antes que sua última tentativa desapareça.</strong>
</p>

<p align="center">
  <a href="https://ultimaletra.netlify.app/"><strong>Jogar agora</strong></a>
  ·
  <a href="https://github.com/GiovannyCosta/hangMan-game">Repositório</a>
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-323330?style=flat-square&logo=javascript&logoColor=F7DF1E">
  <img alt="Testes" src="https://img.shields.io/badge/testes-node%3Atest-c9ff3d?style=flat-square&logo=node.js&logoColor=111">
</p>

## Sobre

**Última Letra — Hangman Arena** transforma o tradicional jogo da forca em uma experiência de arena. A interface combina teclado virtual, controles físicos, dicas, dificuldades ajustáveis, pontuação e uma sequência contínua de palavras.

## Modos de jogo

- **Clássico:** uma palavra por partida, com resultado individual.
- **Sequência:** acerte palavras consecutivas e acumule pontuação e sequência.

## Dificuldades

- **Relax:** até 8 erros.
- **Arena:** até 6 erros.
- **Extremo:** até 4 erros.

Os nove desenhos disponíveis da forca são distribuídos proporcionalmente em todas as dificuldades.

## Recursos

- Seis opções de categoria, incluindo seleção aleatória.
- Dicas contextuais com custo de uma tentativa.
- Teclado virtual completo e suporte ao teclado físico.
- `Esc` retorna ao menu e `Enter` avança após o resultado.
- Letras duplicadas são bloqueadas sem consumir tentativa.
- Proteção contra clique duplo, tecla mantida e excesso de entradas.
- Cronômetro, pontuação, sequência e histórico de letras.
- Efeitos sonoros com arquivos locais e tons complementares produzidos pela Web Audio API.
- Loading temático e animações para acerto, erro, vitória e derrota.
- Layout responsivo para celular, tablet e desktop.
- Suporte à preferência de redução de movimento.

## Como jogar

1. Escolha uma categoria.
2. Defina a dificuldade e o modo.
3. Clique em **Entrar na arena**.
4. Use o teclado virtual ou digite uma letra no teclado físico.
5. Se precisar, revele uma letra usando a dica — ela custa um erro.
6. Complete a palavra antes de atingir o limite de falhas.

## Executando localmente

```bash
git clone https://github.com/GiovannyCosta/hangMan-game.git
cd hangMan-game
```

Abra o arquivo `index.html` no navegador. A interface não exige build nem instalação de dependências.

## Testes

Os testes usam o executor nativo do Node.js e cobrem normalização, máscaras, múltiplas ocorrências, palavras duplicadas, níveis visuais e pontuação.

```bash
npm test
```

Validação completa de sintaxe e testes:

```bash
npm run check
```

## Estrutura

```text
assets/
  css/style.css          Interface e responsividade
  img/                   Nove estágios da forca e banner
  js/game-core.js        Regras isoladas e testáveis
  js/main.js             Interface, áudio e eventos
tests/
  game-core.test.js      Testes unitários
```

## Publicação

O projeto está disponível no Netlify:

**https://ultimaletra.netlify.app/**

<p align="center">
    Desenvolvido com letras, pistas e dedicação por <strong>Giovanny Costa | Arghata</strong>.
</p>
