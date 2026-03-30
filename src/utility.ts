import { getDestination } from './variables';
import { Monster } from './classes';
import {} from './setup';
import { wallPositionList } from './mapgeneration';
import { heroStats } from './hero';
import { SpriteName } from './sprites';
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

export function isNotAWall(): boolean {
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
    if (monster.HP < 0) {
      heroStats.enemiesKilled++;
      heroStats.overKillPoints += -1 * monster.HP;
      if (overKillUsed) heroStats.overKillPoints = 0;
    }
    stopIfInfinite++;
  }

  if (monster.hasKey == true) {
    heroStats.hasKey = true;
  }
  const hpLost = startingHP - heroStats.currentHP;
  monster.alive = false;
  if (heroStats.currentHP > 0) {
    if (monster.image == 'skeleton') xpGain = 1;
    if (monster.image == 'boss') xpGain = 5;
    if (monster.image == 'guard') xpGain = 3;

    writeGameLog(
      `HP lost ${hpLost} / Damage given ${damageTracker} / Overkill points ${
        heroStats.overKillPoints - startingOverkill
      } `
    );
  }
  heroStats.damageDealt += damageTracker;
  heroStats.damageReceived += hpLost;
  heroStats.currentXP += xpGain;
  stopIfInfinite = 0;
  const monsterNames: Partial<Record<SpriteName, string>> = {
    boss: 'Dark Knight',
    skeleton: 'Goblin',
    guard: 'Troll',
  };

  if (heroStats.currentHP < 1) {
    heroStats.killedBy = monsterNames[monster.image] || 'Unknown';
  }
}

export let gameLog: string[] = [];

export function writeGameLog(newLline: string): void {
  const logLength = 8;
  gameLog.slice(logLength, 1);
  for (let i = logLength; i > 0; i--) {
    gameLog.splice(i, 1, gameLog[i - 1]);
  }
  gameLog[0] = newLline;
}
