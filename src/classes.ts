import {} from './index';
import { mapSize } from './setup';
import { SpriteName } from './sprites';
import { monsterLevel } from './variables';
export class Treasure {}

export class Monster {
  open: boolean = false;
  x: number = 1;
  y: number = 0;
  image: SpriteName = 'boss';
  HP: number = 0;
  DP: number = 0;
  SP: number = 0;
  alive: boolean = true;
  hasKey: boolean = false;
  speed: number = 1;
  path: number[][] = [];
  patrolPath: number[][] = [];
  patrolIndex: number = 0;
  swapDestination: [number, number] | null = null;
  isDoor: boolean = false;
  heroLastSeenAt: [number, number] | null = null;

  pickASpot(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  init(): void {
    this.alive = true;
    this.HP = 15 + 5 * monsterLevel;
    this.DP = 3 + monsterLevel;
    this.SP = 5 + monsterLevel;
  }
}

export class Skeleton extends Monster {
  init(): void {
    this.image = 'skeleton';
    this.alive = true;
    this.HP = 10;
    this.DP = 1;
    this.SP = 2;
  }
}
export class Guard extends Monster {
  init(): void {
    this.image = 'guard';
    this.alive = true;
    this.HP = 12 + monsterLevel * 2;
    this.DP = 2 + monsterLevel;
    this.SP = 4 + monsterLevel;
  }
}
export class Witch extends Monster {
  init(): void {
    this.image = 'witch';
    this.alive = true;
    this.HP = 5;
    this.DP = 0;
    this.SP = 3;
  }
}
export class Door extends Monster {
  speed: number = 0;
  isDoor: boolean = true;
  init(): void {
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}
export class Chest extends Monster {
  speed: number = 0;
  gold: number = 0;
  hasPotion: boolean = false;
  hasSword: boolean = false;
  init(): void {
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}
export class BlackDoor extends Door {
  init(): void {
    this.image = 'blackDoor';
    this.pickASpot(mapSize, mapSize);
  }
}

export class GreenChest extends Chest {
  init(): void {
    this.image = 'greenChest';
  }
}
export class RedChest extends Chest {
  init(): void {
    this.image = 'redChest';
  }
}

export class GreenDoor extends Door {
  init(): void {
    this.image = 'greenDoor';
  }
}
export class RedDoor extends Door {
  init(): void {
    this.image = 'redDoor';
  }
}
