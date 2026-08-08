const { LIMITS, normalizeLetter, chooseEntry, createMask, applyGuess, imageLevel, calculateScore } = HangmanCore;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ui = { app:$("#app"),setup:$("#setup"),game:$("#game"),setupAlert:$("#setup-alert"),category:$("#category-label"),timer:$("#timer"),score:$("#score"),streak:$("#streak"),attempts:$("#attempts-label"),danger:$("#danger-progress"),image:$("#hangman-image"),lives:$("#lives"),word:$("#word-display"),clue:$("#clue-text"),feedback:$("#feedback"),keyboard:$("#keyboard"),used:$("#used-letters"),hint:$("#hint-button"),sound:$("#sound-toggle"),modal:$("#result-modal"),next:$("#next-button"),session:$("#session-number") };
let state = { category:"",difficulty:"arena",mode:"classic",word:"",clue:"",mask:[],used:new Set(),errors:0,limit:6,score:0,streak:0,seconds:0,session:1,locked:false,ended:false,muted:false,previousWord:"",hintUsed:false };
let timerId;
let audioContext;

window.addEventListener("load", () => setTimeout(() => $("#loader").classList.add("hidden-loader"), 1050));

function tone(frequency, duration=.08, type="sine", volume=.035) {
  if (state.muted) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type=type; oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(volume,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
  oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime+duration);
}
function playAudio(selector,volume=.5){if(state.muted)return;const audio=$(selector);audio.volume=volume;audio.currentTime=0;audio.play().catch(()=>{});}
function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;}
function announce(message,type="neutral"){ui.feedback.textContent=message;ui.feedback.className=`feedback ${type}`;}

function buildKeyboard(){
  ui.keyboard.innerHTML=ALPHABET.split("").map(letter=>`<button type="button" data-letter="${letter}" aria-label="Escolher letra ${letter}">${letter}</button>`).join("");
  ui.keyboard.addEventListener("click",event=>{const button=event.target.closest("button[data-letter]");if(!button)return;guess(button.dataset.letter);button.blur();});
}
function renderWord(reveal=false){
  ui.word.innerHTML=[...state.word].map((character,index)=>{if(character===" ")return '<span class="space" aria-hidden="true"></span>';const visible=reveal||state.mask[index]!=="_";return `<span class="letter-slot ${visible?"revealed":""}">${visible?character:""}</span>`;}).join("");
}
function renderStatus(){
  ui.category.textContent=state.category==="Aleatorio"?"ALEATÓRIA":state.category.toUpperCase();ui.timer.textContent=formatTime(state.seconds);ui.score.textContent=String(state.score).padStart(3,"0");ui.streak.textContent=String(state.streak).padStart(2,"0");ui.attempts.textContent=`${state.errors} / ${state.limit}`;ui.danger.style.width=`${state.errors/state.limit*100}%`;
  const level=imageLevel(state.errors,state.limit);ui.image.src=`./assets/img/game-level-${level}.png`;ui.image.alt=`Forca no estágio ${level} de 8`;ui.used.textContent=state.used.size?[...state.used].sort().join(" · "):"NENHUMA";ui.lives.innerHTML=Array.from({length:state.limit},(_,index)=>`<i class="${index<state.limit-state.errors?"safe":"lost"}"></i>`).join("");
  $$("#keyboard button").forEach(button=>{const used=state.used.has(button.dataset.letter);button.disabled=used||state.ended;button.classList.toggle("used",used);});renderWord();
}
function startTimer(){clearInterval(timerId);timerId=setInterval(()=>{if(!state.ended&&!state.locked){state.seconds++;ui.timer.textContent=formatTime(state.seconds);}},1000);}
function startGame(keepSession=false){
  const entry=chooseEntry(state.category,Math.random,state.previousWord);
  state={...state,word:entry.word,clue:entry.clue,mask:createMask(entry.word),used:new Set(),errors:0,limit:LIMITS[state.difficulty],seconds:0,locked:false,ended:false,hintUsed:false,previousWord:entry.word,score:keepSession?state.score:0,streak:keepSession?state.streak:0};
  ui.setup.classList.add("hidden");ui.game.classList.remove("hidden");ui.modal.hidden=true;ui.modal.classList.remove("show");ui.clue.textContent=state.clue;ui.hint.disabled=false;announce("ESCOLHA UMA LETRA PARA COMEÇAR");renderStatus();startTimer();
}
function selectOption(group,button,key){$$(`#${group} button`).forEach(item=>item.classList.toggle("active",item===button));state[key]=button.dataset[key];button.blur();}
function finishGame(won){
  state.ended=true;clearInterval(timerId);
  if(won){state.score+=calculateScore(state.word,state.errors,state.seconds,state.limit);state.streak++;playAudio(state.streak>=3?"#sound-achievement":"#sound-perfect",.62);}else{state.streak=0;tone(120,.55,"sawtooth",.05);ui.app.classList.add("screen-shake");setTimeout(()=>ui.app.classList.remove("screen-shake"),600);}
  renderWord(true);renderStatus();$("#result-symbol").textContent=won?"W":"X";$("#result-kicker").textContent=won?"PALAVRA DECIFRADA":"TENTATIVAS ESGOTADAS";$("#result-title").textContent=won?"VOCÊ VENCEU":"FIM DE JOGO";$("#result-word").textContent=state.word;$("#result-time").textContent=formatTime(state.seconds);$("#result-errors").textContent=state.errors;$("#result-score").textContent=state.score;ui.next.firstChild.textContent=state.mode==="streak"&&won?"PRÓXIMA PALAVRA ":"JOGAR NOVAMENTE ";ui.modal.querySelector(".result-card").className=`result-card ${won?"win":"loss"}`;
  const resultDelay = won ? 450 : 900;
  setTimeout(()=>{ui.modal.hidden=false;requestAnimationFrame(()=>ui.modal.classList.add("show"));},resultDelay);
}
function guess(rawLetter){
  if(state.locked||state.ended||ui.game.classList.contains("hidden"))return;
  const letter=normalizeLetter(rawLetter);if(!/^[A-Z]$/.test(letter))return announce("USE APENAS LETRAS DE A ATÉ Z","warning");
  if(state.used.has(letter)){announce(`A LETRA ${letter} JÁ FOI USADA`,"warning");tone(190,.08,"square",.025);return;}
  // O bloqueio curto absorve cliques duplos e teclas mantidas pressionadas.
  state.locked=true;state.used.add(letter);const result=applyGuess(state.word,state.mask,letter);state.mask=result.mask;
  if(result.matches){announce(result.matches>1?`${result.matches} LETRAS REVELADAS`:"LETRA CORRETA","success");playAudio("#sound-correct",.38);}else{state.errors++;announce("ESSA LETRA NÃO ESTÁ NA PALAVRA","danger");tone(145,.16,"sawtooth",.04);ui.image.classList.remove("hit");void ui.image.offsetWidth;ui.image.classList.add("hit");}
  renderStatus();if(!state.mask.includes("_"))finishGame(true);else if(state.errors>=state.limit)finishGame(false);else setTimeout(()=>{state.locked=false;},220);
}
function useHint(){
  if(state.locked||state.ended||state.hintUsed)return;const hidden=[...new Set([...state.word].filter((character,index)=>character!==" "&&state.mask[index]==="_"))];if(!hidden.length)return;
  state.hintUsed=true;ui.hint.disabled=true;state.errors++;const letter=hidden[Math.floor(Math.random()*hidden.length)];state.used.add(normalizeLetter(letter));state.mask=applyGuess(state.word,state.mask,letter).mask;announce(`DICA USADA: A LETRA ${letter} FOI REVELADA`,"warning");renderStatus();if(!state.mask.includes("_"))finishGame(true);else if(state.errors>=state.limit)finishGame(false);
}
function goToMenu(){clearInterval(timerId);state.ended=true;ui.modal.hidden=true;ui.modal.classList.remove("show");ui.game.classList.add("hidden");ui.setup.classList.remove("hidden");}

buildKeyboard();
$$('#categories button').forEach(button=>button.addEventListener("click",()=>selectOption("categories",button,"category")));
$$('#difficulties button').forEach(button=>button.addEventListener("click",()=>selectOption("difficulties",button,"difficulty")));
$$('#modes button').forEach(button=>button.addEventListener("click",()=>selectOption("modes",button,"mode")));
$("#start-button").addEventListener("click",()=>{if(!state.category)return ui.setupAlert.textContent="SELECIONE UMA CATEGORIA PARA ENTRAR NA ARENA";ui.setupAlert.textContent="";startGame(false);});
ui.hint.addEventListener("click",()=>{useHint();ui.hint.blur();});
$("#restart-button").addEventListener("click",()=>{state.session++;ui.session.textContent=String(state.session).padStart(2,"0");startGame(false);});
$("#back-button").addEventListener("click",goToMenu);$("#modal-menu-button").addEventListener("click",goToMenu);
ui.next.addEventListener("click",()=>{state.session++;ui.session.textContent=String(state.session).padStart(2,"0");startGame(state.mode==="streak"&&state.streak>0);});
ui.sound.addEventListener("click",()=>{state.muted=!state.muted;ui.sound.textContent=state.muted?"MUDO":"SOM";ui.sound.setAttribute("aria-label",state.muted?"Ativar som":"Desativar som");ui.sound.blur();if(!state.muted)tone(520);});
document.addEventListener("keydown",event=>{if(!ui.modal.hidden&&event.key==="Enter")return ui.next.click();if(event.key==="Escape"&&!ui.game.classList.contains("hidden"))return goToMenu();if(/^[a-zA-ZÀ-ÿ]$/.test(event.key))guess(event.key);});
