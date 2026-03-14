import { pushBoundariesToWallList, setup, mapSize, setMapSize } from './setup';
import { writeGameLog } from './utility';
import {
  renderFloor,
  renderWalls,
  printstats,
  clearCanvas,
  renderPauseScreen,
} from './map-render';
import {
  checkIfHeroDead,
  attemptToMoveHero,
  renderHero,
  increaseMapLevel,
  setHeroLevel,
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
  heroStats,
  updateSpeed,
  moveEveryXMiliseconds,
  monsterLevel,
  ctx,
  resetSpeed,
  resetMonstersLevel,
} from './variables';
import {
  instantiateSetupArrays,
  blackDoor,
  monsterList,
  emptyMapLists,
} from './mapgeneration';
import { getSprite, loadSprites } from './sprites';
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
let scoreArray: string[] = ['0', '0', '0', '0', '0'];
let finaleDone = false;
let lastUpdate = Date.now();
let currentTime = Date.now();
const fps: number = 60;
export let interval: ReturnType<typeof setInterval>;
window.onload = () => {
  loadSprites().then(() => {
    interval = setInterval(tickController, moveEveryXMiliseconds);
    updateGameState();
    setup();
    animate();
  });
};

//Game loop handling
function tickController() {
  if (heroStats.currentHP < 1) return;
  for (let specimen of monsterList) {
    attemptToMoveMonster(specimen);
  }
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
  if (monsterLevel > 3) {
    finale();
    return;
  }
  if (escapedown) return;
  clearCanvas();
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
}

//Reset when Map Level finished.
function checkVictoryConditions() {
  if (
    heroStats.x == blackDoor.x &&
    heroStats.y == blackDoor.y &&
    heroStats.hasKey
  ) {
    increaseMapLevel();
    if (monsterLevel > 3) {
      finale();
      return;
    }
    setMapSize();

    emptyMapLists();
    instantiateSetupArrays();
    pushBoundariesToWallList();
    resetMonsters();
    if (moveEveryXMiliseconds > 500) {
      updateSpeed(500);
      writeGameLog(`Monster Level Increases. Monsters now move faster!`);
    } else {
      writeGameLog(`Monster Level increases. Maximum speed reached.`);
    }
    clearInterval(interval);
    setMonsterSpeed();
    resetScrolling();
    assignKey();
  }
}
function finale() {
  if (finaleDone) return;
  escapedown = true;
  setScore();
  ctx.drawImage(getSprite('square'), 0, 0, 900, 600);
  ctx.font = '50px Arial';
  ctx.fillText(`Thank you for Playing!`, 100, 100);
  ctx.fillText(`Score: ${heroStats.highscore}`, 100, 160);
  ctx.drawImage(getSprite('space'), 100, 180, 90, 42);
  ctx.fillText(`to restart.`, 200, 215);
  ctx.fillText(`Previous Highscore:`, 200, 260);
  for (let i = 0; i < 5; i++) {
    ctx.fillText(`${scoreArray[i]}`, 200, 320 + 60 * i);
  }

  document.addEventListener('keydown', tempSpaceReset);
  console.log('event listener added');
  function tempSpaceReset(notHit: any) {
    switch (notHit.key) {
      case ' ':
        resetMonstersLevel();
        setMapSize();
        setup();
        resetSpeed(2000);
        clearInterval(interval);
        setMonsterSpeed();
        heroInit();
        resetScrolling();
        escapedown = false;

        document.removeEventListener('keydown', tempSpaceReset);
        console.log('event listener removed');
    }
  }
  finaleDone = true;
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

  console.log('scoreArray:');
  console.log(scoreArray);
  console.log('highscore:');
  console.log(heroStats.highscore);
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
        renderPauseScreen();
      } else if (escapedown) {
        escapedown = false;
        escapeanim = true;
        writeGameLog('Game is resumed');
      }

      break;
  }
});
//manage user input
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
