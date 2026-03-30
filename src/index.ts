import { pushBoundariesToWallList, setup, mapSize, setMapSize } from './setup';
import { writeGameLog } from './utility';
import { resolveSwap } from './monster';
import {
  renderFloor,
  renderWalls,
  printstats,
  clearCanvas,
  renderPauseScreen,
  renderDeathScreen,
  renderFinaleScreen,
} from './mapRender';
import {
  attemptToMoveHero,
  renderHero,
  increaseMapLevel,
  setHeroLevel,
  heroStats,
  heroInit,
} from './hero';
import {
  renderAllMonsters,
  checkIfBattleForMonsters,
  resetMonsters,
  assignKey,
  attemptToMoveMonster,
} from './monster';
import {
  updateSpeed,
  moveEveryXMiliseconds,
  monsterLevel,
  computeLayout,
  canvas,
  canvasWidth,
  canvasHeight,
  moveEveryXMilisecondsMinimum,
  moveEveryXMilisecondsIncrement,
  resetMonstersLevel,
  moveEveryXMilisecondsInitial,
} from './variables';
import {
  instantiateSetupArrays,
  blackDoor,
  monsterList,
  emptyMapLists,
} from './mapgeneration';
import { loadSprites } from './sprites';

export let scrollingModifierX: number = 0;
export let scrollingModifierY: number = 0;
export let pdown = false;
export let spacedown = false;
export let leftdown = false;
export let rightdown = false;
export let updown = false;
export let downdown = false;
export let escapedown = false;
export let escapeanim = false;
export type GameState = 'playing' | 'paused' | 'dead' | 'finale';
export let gameState: GameState = 'playing';
export let scoreArray: string[] = ['0', '0', '0', '0', '0'];
let lastUpdate = Date.now();
let currentTime = Date.now();
const fps: number = 60;
export let interval: ReturnType<typeof setInterval>;

window.onload = () => {
  computeLayout();
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  loadSprites().then(() => {
    interval = setInterval(tickController, moveEveryXMiliseconds);
    updateGameState();
    setup();
    animate();
  });
};

window.addEventListener('resize', () => {
  computeLayout();
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

function tickController() {
  if (heroStats.currentHP < 1) return;
  for (let specimen of monsterList) {
    attemptToMoveMonster(specimen);
  }
  resolveSwap();
}

export function resetScrolling(): void {
  scrollingModifierX = 0;
  scrollingModifierY = 0;
}

export function setMonsterSpeed(): void {
  interval = setInterval(tickController, moveEveryXMiliseconds);
}

function animate() {
  currentTime = Date.now();
  let elapsedTime = currentTime - lastUpdate;
  if (elapsedTime >= 1000 / fps) {
    updateGameState();
    lastUpdate = currentTime;
  }
  requestAnimationFrame(animate);
}

function updateGameState() {
  clearCanvas();
  switch (gameState) {
    case 'playing':
      renderFloor();
      renderWalls();
      printstats();
      renderAllMonsters();
      setHeroLevel();
      renderHero();
      checkIfBattleForMonsters();
      checkIfHeroDead();
      determineScore();
      checkVictoryConditions();
      break;
    case 'paused':
      renderPauseScreen();
      printstats();
      break;
    case 'dead':
      renderDeathScreen();
      break;
    case 'finale':
      renderFinaleScreen();
      break;
  }
}

export function checkIfHeroDead(): void {
  if (heroStats.currentHP < 1) {
    enterDeadState();
  }
}

function enterDeadState(): void {
  let deathCount = parseInt(localStorage.getItem('deaths') || '0') + 1;
  localStorage.setItem('deaths', deathCount.toString());
  gameState = 'dead';
  waitForRestart();
}

function enterFinaleState(): void {
  setScore();
  gameState = 'finale';
  waitForRestart();
}

function waitForRestart(): void {
  function onSpaceRestart(e: KeyboardEvent) {
    if (e.key !== ' ') return;
    document.removeEventListener('keydown', onSpaceRestart);
    restartGame();
  }
  document.addEventListener('keydown', onSpaceRestart);
}

function checkVictoryConditions() {
  if (
    heroStats.x == blackDoor.x &&
    heroStats.y == blackDoor.y &&
    heroStats.hasKey
  ) {
    increaseMapLevel();
    if (monsterLevel > 3) {
      enterFinaleState();
      return;
    }
    increaseSpeed();
    setMapSize();
    emptyMapLists();
    instantiateSetupArrays();
    pushBoundariesToWallList();
    resetMonsters();
    clearInterval(interval);
    setMonsterSpeed();
    resetScrolling();
    assignKey();
  }
}

function increaseSpeed() {
  if (moveEveryXMiliseconds > moveEveryXMilisecondsMinimum) {
    updateSpeed(moveEveryXMilisecondsIncrement);
    writeGameLog(`Monster Level Increases. Monsters now move faster!`);
  } else {
    writeGameLog(`Monster Level increases. Maximum speed reached.`);
  }
}

function restartGame(): void {
  heroInit();
  resetMonstersLevel();
  gameState = 'playing';
  setMapSize();
  emptyMapLists();
  instantiateSetupArrays();
  pushBoundariesToWallList();
  resetMonsters();
  clearInterval(interval);
  setMonsterSpeed();
  resetScrolling();
  assignKey();
}

function determineScore() {
  heroStats.highscore =
    heroStats.gold +
    heroStats.currentHP * 10 +
    heroStats.hasPotion * 150 +
    heroStats.currentXP * 3 +
    heroStats.level * 30;
}

function setScore() {
  determineScore();
  const emptyArray: number[] = [0, 0, 0, 0, 0];
  if (localStorage.getItem('score') === null)
    localStorage.setItem('score', emptyArray.toString());

  let jsStorage = localStorage.getItem('score')!.split(',');
  scoreArray = jsStorage.sort((a: any, b: any) => {
    return b - a;
  });

  let lowerNumber: string | number | undefined = scoreArray.find(element => {
    return parseInt(element) < heroStats.highscore;
  });
  if (lowerNumber === undefined) lowerNumber = 0;
  console.log(lowerNumber);
  const found = scoreArray.indexOf(lowerNumber!.toString());

  if (found > -1) {
    scoreArray.splice(found, 0, heroStats.highscore.toString());
    scoreArray.pop();
  }
  scoreArray = scoreArray.sort((a: any, b: any) => {
    return b - a;
  });

  localStorage.setItem('score', scoreArray.toString());
  console.log(localStorage);
}

document.addEventListener('keydown', function (keyHit) {
  switch (keyHit.key) {
    case 'Escape':
      if (escapedown == false) {
        escapedown = true;
        escapeanim = true;
        writeGameLog('Game is paused');
        gameState = 'paused';
        renderPauseScreen();
      } else if (escapedown) {
        escapedown = false;
        escapeanim = true;
        gameState = 'playing';
        writeGameLog('Game is resumed');
      }

      break;
  }
});

document.addEventListener('keydown', function (keyHit) {
  if (heroStats.currentHP < 1) return;
  if (escapedown) return;

  switch (keyHit.key) {
    case 'ArrowDown':
    case 's':
    case 'S':
      heroStats.facing = 'hero-down';
      if (attemptToMoveHero()) {
        heroStats.y++;
        if (heroStats.y > 5 && heroStats.y < mapSize - 4) {
          scrollingModifierY++;
        }
      }
      downdown = true;
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      heroStats.facing = 'hero-up';
      if (attemptToMoveHero()) {
        heroStats.y--;
        if (heroStats.y > 4 && heroStats.y < mapSize - 5) {
          scrollingModifierY--;
        }
      }
      updown = true;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      heroStats.facing = 'hero-left';
      if (attemptToMoveHero()) {
        heroStats.x--;
        if (heroStats.x > 4 && heroStats.x < mapSize - 5) {
          scrollingModifierX--;
        }
      }
      leftdown = true;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      heroStats.facing = 'hero-right';
      if (attemptToMoveHero()) {
        heroStats.x++;
        if (heroStats.x > 5 && heroStats.x < mapSize - 4) {
          scrollingModifierX++;
        }
      }
      rightdown = true;
      break;
    case 'P':
    case 'p':
      if (heroStats.hasPotion > 0) {
        let originalHP = heroStats.currentHP;
        heroStats.currentHP += 10;
        if (heroStats.currentHP > heroStats.maxHP) {
          heroStats.currentHP = heroStats.maxHP;
        }
        heroStats.hasPotion--;
        writeGameLog(`Potion restored ${heroStats.currentHP - originalHP} HP`);
      } else {
        writeGameLog('You dont have a potion.');
      }
      pdown = true;
      break;
    case ' ':
      if (heroStats.overKill == false) {
        heroStats.overKill = true;
      } else if (heroStats.overKill) heroStats.overKill = false;

      spacedown = true;
      break;
  }
});

document.addEventListener('keyup', function (keyHit) {
  switch (keyHit.key) {
    case 'p':
    case 'P':
      pdown = false;
      break;
    case ' ':
      spacedown = false;
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      updown = false;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      downdown = false;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      rightdown = false;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      leftdown = false;
      break;
    case 'Escape':
      escapeanim = false;
      break;
  }
});
