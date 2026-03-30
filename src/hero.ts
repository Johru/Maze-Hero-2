import {
  getDestination,
  updateDestination,
  ctx,
  tileWidth,
  updateMonstersLevel,
  resetMonstersLevel,
  resetSpeed,
  heroXpArray,
} from './variables';
import { isNotAWall, battle, d6, writeGameLog } from './utility';
import {
  setMonsterSpeed,
  interval,
  scrollingModifierX,
  scrollingModifierY,
  resetScrolling,
} from './index';
import { setMapSize, setup } from './setup';
import { Monster } from './classes';
import { getSprite, SpriteName } from './sprites';
import { chestList, doorList, monsterList } from './mapgeneration';

export let heroStats = {
  x: 1,
  y: 1,
  facing: 'hero-down' as SpriteName,
  level: 1,
  maxHP: 20,
  currentHP: 6,
  DP: d6(2),
  SP: d6(1) + 7,
  hasKey: false,
  hasPotion: 0,
  hasGreenKey: false,
  hasRedKey: false,
  hasBlueKey: false,
  hasSword: false,
  overKillPoints: 0,
  overKill: true,
  neededXP: 0,
  currentXP: 0,
  gold: 0,
  highscore: 0,
  killedBy: '',
  damageDealt: 0,
  damageReceived: 0,
  enemiesKilled: 0,
};

export function heroInit(): void {
  heroStats.x = 1;
  heroStats.y = 1;
  heroStats.hasKey = false;
  heroStats.hasGreenKey = false;
  heroStats.hasRedKey = false;
  heroStats.hasBlueKey = false;
  heroStats.hasSword = false;
  heroStats.hasPotion = 0;
  heroStats.facing = 'hero-down';
  heroStats.level = 1;
  heroStats.gold = 0;
  heroStats.neededXP = heroXpArray[heroStats.level];
  heroStats.currentXP = 0;
  heroStats.maxHP = 20;
  heroStats.currentHP = 20;
  heroStats.DP = 3;
  heroStats.SP = 5;
  heroStats.currentHP = heroStats.maxHP;
  heroStats.overKillPoints = 0;
  heroStats.overKill = false;
  heroStats.killedBy = '';
  heroStats.damageDealt = 0;
  heroStats.enemiesKilled = 0;
  heroStats.damageReceived = 0;
}

export function increaseMapLevel(): void {
  heroStats.x = 1;
  heroStats.y = 1;
  heroStats.hasKey = false;
  heroStats.hasGreenKey = false;
  heroStats.hasRedKey = false;
  updateMonstersLevel(1);
}

export function renderHero(): void {
  ctx.drawImage(
    getSprite(heroStats.facing),
    (heroStats.x - 1 - scrollingModifierX) * tileWidth,
    (heroStats.y - 1 - scrollingModifierY) * tileWidth,
    tileWidth,
    tileWidth
  );
}

export function attemptToMoveHero(): boolean {
  makeDestination();
  checkIfBattle();
  if (blockIfDoor()) return false;
  checkChest();
  return isNotAWall();
}

export function blockIfDoor(): boolean {
  for (let i = 0; i < doorList.length; i++) {
    if (
      getDestination()[0] == doorList[i].x &&
      getDestination()[1] == doorList[i].y
    ) {
      if (!heroHasMatchingKey(doorList[i])) {
        return true;
      }
    }
  }
  return false;
}

export function checkChest(): void {
  for (let chest of chestList) {
    if (getDestination()[0] == chest.x && getDestination()[1] == chest.y) {
      if (chest.hasKey && chest.image == 'greenChest') {
        heroStats.hasGreenKey = true;
        writeGameLog('You obtained the green key.');
      }
      if (chest.hasSword) {
        heroStats.hasSword = true;
        chest.hasSword = false;
        heroStats.SP += 5;

        writeGameLog('You obtained the legendary Gigachad Sword.');
      }
      if (chest.hasKey && chest.image == 'redChest') {
        heroStats.hasRedKey = true;
        writeGameLog('You obtained the red key.');
      }
      if (chest.hasPotion) {
        heroStats.hasPotion++;
        writeGameLog('You found a potion.');
        chest.hasPotion = false;
      }
      if (chest.gold > 0) {
        heroStats.gold += chest.gold;
        chest.gold = 0;
        writeGameLog('You found 50 gold.');
      }
      if (chest.image == 'greenChest') {
        chest.image = 'greenChestOpen';
      }
      if (chest.image == 'redChest') {
        chest.image = 'redChestOpen';
      }
    }
  }
}

export function heroHasMatchingKey(door: Monster): boolean {
  switch (door.image) {
    case 'blackDoor':
      if (heroStats.hasKey) {
        return true;
      } else {
        writeGameLog("You don't have the Black Key!");
        return false;
      }
    case 'greenDoor':
      if (heroStats.hasGreenKey) {
        door.image = 'greenDoorOpen';
        door.open = true;
        return true;
      } else {
        writeGameLog("You don't have green key!");
        return false;
      }
    case 'redDoor':
      if (heroStats.hasRedKey) {
        door.image = 'redDoorOpen';
        door.open = true;
        return true;
      } else {
        writeGameLog("You don't have red key!");
        return false;
      }
    case 'redDoorOpen':
      return true;
    case 'greenDoorOpen':
      return true;
    default:
      return true;
  }
}

export function makeDestination(): number[] | undefined {
  if (heroStats.facing == 'hero-down')
    return updateDestination(heroStats.x, heroStats.y + 1);
  if (heroStats.facing == 'hero-up')
    return updateDestination(heroStats.x, heroStats.y - 1);
  if (heroStats.facing == 'hero-left')
    return updateDestination(heroStats.x - 1, heroStats.y);
  if (heroStats.facing == 'hero-right')
    return updateDestination(heroStats.x + 1, heroStats.y);
}

export function checkIfBattle(): void {
  for (let monster of monsterList) {
    if (
      getDestination()[0] == monster.x &&
      getDestination()[1] == monster.y &&
      monster.alive &&
      monster.speed > 0
    ) {
      battle(monster);
    }
  }
}

export function setHeroLevel(): void {
  if (heroStats.currentXP >= heroStats.neededXP) {
    heroStats.level++;
    if (heroStats.level > 1) writeGameLog('You leveled up.');
    heroStats.currentXP -= heroStats.neededXP;
    heroStats.neededXP = heroXpArray[heroStats.level];
    let hpBoost: number = d6(1);
    heroStats.maxHP += hpBoost;
    heroStats.currentHP += hpBoost;
    heroStats.DP += 1;
    heroStats.SP += 2;
  }
}
