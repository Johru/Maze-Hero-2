import {
  heroDown,
  heroUp,
  heroLeft,
  heroRight,
  skeleton,
  boss,
  getDestination,
  heroStats,
  monsterHasKey,
  door,
  witch,
  guard,
  greenChest,
  greenDoor,
  greenChestOpen,
  redChestOpen,
  greenKey,
  redKey,
  pButton,
  pdButton,
  axe,
  square,
  wallPositionList,
  redChest,
  redDoor,
  up,
  upd,
  down,
  downd,
  left,
  leftd,
  right,
  rightd,
  escape,
  escaped,
  pause,
  unpause,
  greenDoorOpen,
  redDoorOpen,
} from './variables';
import { Monster } from './classes';
import {} from './setup';
import { witchSetup } from './mapgeneration';
export function d6(numberOfRolls: number): number {
  let total: number = 0;
  for (let i = 0; i < numberOfRolls; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }
  return total;
}
export function d3(numberOfRolls: number): number {
  let total: number = 0;
  for (let i = 0; i < numberOfRolls; i++) {
    total += Math.floor(Math.random() * 3) + 1;
  }
  return total;
}
export function getSpriteByName(name: string): HTMLImageElement {
  switch (name) {
    case 'heroDown':
      return heroDown;
    case 'heroUp':
      return heroUp;
    case 'heroLeft':
      return heroLeft;
    case 'heroRight':
      return heroRight;
    case 'skeleton':
      return skeleton;
    case 'boss':
      return boss;
    case 'door':
      return door;
    case 'witch':
      return witch;
    case 'guard':
      return guard;
    case 'greenChest':
      return greenChest;
    case 'greenDoor':
      return greenDoor;
    case 'greenDoorOpen':
      return greenDoorOpen;
    case 'greenChestOpen':
      return greenChestOpen;
    case 'redChestOpen':
      return redChestOpen;
    case 'greenKey':
      return greenKey;
    case 'redKey':
      return redKey;
    case 'pButton':
      return pButton;
    case 'pdButton':
      return pdButton;
    case 'axe':
      return axe;
    case 'square':
      return square;
    case 'redChest':
      return redChest;
    case 'redDoor':
      return redDoor;
    case 'redDoorOpen':
      return redDoorOpen;
    case 'up':
      return up;
    case 'upd':
      return upd;
    case 'down':
      return down;
    case 'downd':
      return downd;
    case 'left':
      return left;
    case 'leftd':
      return leftd;
    case 'right':
      return right;
    case 'rightd':
      return rightd;
    case 'escape':
      return escape;
    case 'escaped':
      return escaped;
    case 'pause':
      return pause;
    case 'nupause':
      return unpause;
    case 'sword':
      return unpause;
  }
  return heroDown;
}
export function checkIfMoveAllowed(): boolean {
  for (let i = 0; i < wallPositionList.length; i++) {
    if (
      getDestination()[0] == wallPositionList[i][0] &&
      getDestination()[1] == wallPositionList[i][1]
    )
      return false;
  }
  return true;
}

export function battle(monster: Monster): void {
  if (heroStats.currentHP < 1) return;
  let startingHP: number = heroStats.currentHP;
  let startingOverkill: number = heroStats.overKillPoints;
  let damageTracker: number = 0;
  let stopIfInfinite: number = 0;
  let overKillUsed = false;
  let xpGain = 0;
  while (monster.HP > 0 && stopIfInfinite < 10000) {
    let heroAttack: number = heroStats.SP + d3(1);
    if (heroStats.overKill == true) {
      heroAttack += heroStats.overKillPoints;
      heroStats.overKill = false;
      overKillUsed = true;
    }
    let monsterAttack: number = monster.SP + d3(1);
    if (heroAttack > monster.DP) {
      monster.HP -= heroAttack - monster.DP;
      damageTracker += heroAttack - monster.DP;
    }
    if (monsterAttack > heroStats.DP) {
      heroStats.currentHP -= monsterAttack - heroStats.DP;
    }
    if (monster.HP < 0) heroStats.overKillPoints += -1 * monster.HP;
    if (overKillUsed) heroStats.overKillPoints = 0;

    stopIfInfinite++;
  }

  if (monster.hasKey == true) {
    heroStats.hasKey = true;
  }
  monster.alive = false;
  if (heroStats.currentHP > 0) {
    if (monster.image == 'skeleton') xpGain = 1;
    if (monster.image == 'boss') xpGain = 3;
    if (monster.image == 'guard') xpGain = 2;

    writeGameLog(
      `HP lost ${
        startingHP - heroStats.currentHP
      } / Damage given ${damageTracker} / Overkill points ${
        heroStats.overKillPoints - startingOverkill
      } `
    );
  }
  heroStats.currentXP += xpGain;
  stopIfInfinite = 0;
}
export let gameLog: string[] = [];

export function writeGameLog(newLline: string): void {
  gameLog.slice(9, 1);
  for (let i = 9; i > 0; i--) {
    gameLog.splice(i, 1, gameLog[i - 1]);
  }
  gameLog[0] = newLline;
}
