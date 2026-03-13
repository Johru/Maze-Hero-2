import {} from './index';
import {
  bossSetup,
  greenChestSetup,
  greenDoorSetup,
  guardSetup,
  redChestSetup,
  redDoorSetup,
  skeletonSetup,
  witchSetup,
} from './mapgeneration';
import { mapSize } from './setup';
import { SpriteName } from './sprites';
import { monsterLevel } from './variables';
export class Treasure {}

export class Monster {
  orderNumber: number;
  x: number;
  y: number;
  image: SpriteName;
  HP: number;
  DP: number;
  SP: number;
  alive: boolean;
  hasKey: boolean;
  speed: number = 1;
  path: number[][] = [];
  constructor(
    order: number,
    x: number = 1,
    y: number = 0,
    image: SpriteName = 'boss',
    hp: number = 0,
    DP: number = 0,
    SP: number = 0,
    alive: boolean = true,
    hasKey: boolean = false
  ) {
    this.orderNumber = order;
    this.x = x;
    this.y = y;
    this.image = image;
    this.HP = hp;
    this.DP = DP;
    this.SP = SP;
    this.alive = alive;
    this.hasKey = hasKey;
  }
  pickASpot(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  init(): void {
    this.pickASpot(
      bossSetup[monsterLevel - 1][0],
      bossSetup[monsterLevel - 1][1]
    );
    this.alive = true;
    this.HP = 15 + 5 * monsterLevel;
    this.DP = 3 + monsterLevel;
    this.SP = 5 + monsterLevel;
  }
}
export class Skeleton extends Monster {
  init(): void {
    this.image = 'skeleton';
    this.pickASpot(
      skeletonSetup[monsterLevel - 1][this.orderNumber * 2],
      skeletonSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 10;
    this.DP = 1;
    this.SP = 2;
  }
}
export class Guard extends Monster {
  init(): void {
    this.image = 'guard';
    this.pickASpot(
      guardSetup[monsterLevel - 1][this.orderNumber * 2],
      guardSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 12 + monsterLevel * 2;
    this.DP = 2 + monsterLevel;
    this.SP = 4 + monsterLevel;
  }
}
export class Witch extends Monster {
  init(): void {
    this.image = 'witch';
    this.pickASpot(
      witchSetup[monsterLevel - 1][this.orderNumber * 2],
      witchSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 5;
    this.DP = 0;
    this.SP = 3;
  }
}
export class Door extends Monster {
  speed: number = 0;

  init(): void {
    this.image = 'door';
    this.pickASpot(mapSize, mapSize);
    // this.alive = true;
    this.alive = true;
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}

export class GreenChest extends Monster {
  speed: number = 0;
  gold: number = 0;
  open: boolean = false;
  hasPotion: boolean = false;
  hasSword: boolean = false;

  init(): void {
    this.image = 'greenChest';
    this.pickASpot(
      greenChestSetup[monsterLevel - 1][this.orderNumber * 2],
      greenChestSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}
export class RedChest extends Monster {
  speed: number = 0;
  gold: number = 0;
  open: boolean = false;
  hasPotion: boolean = false;
  hasSword: boolean = false;

  init(): void {
    this.image = 'redChest';
    this.pickASpot(
      redChestSetup[monsterLevel - 1][this.orderNumber * 2],
      redChestSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.hasSword = false;
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}

export class GreenDoor extends Monster {
  speed: number = 0;
  init(): void {
    this.image = 'greenDoor';
    this.pickASpot(
      greenDoorSetup[monsterLevel - 1][this.orderNumber * 2],
      greenDoorSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}
export class RedDoor extends Monster {
  speed: number = 0;
  init(): void {
    this.image = 'redDoor';
    this.pickASpot(
      redDoorSetup[monsterLevel - 1][this.orderNumber * 2],
      redDoorSetup[monsterLevel - 1][this.orderNumber * 2 + 1]
    );
    this.alive = true;
    this.HP = 0;
    this.DP = 0;
    this.SP = 0;
  }
}
