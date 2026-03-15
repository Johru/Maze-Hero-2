import {
  BlackDoor,
  GreenChest,
  GreenDoor,
  Guard,
  Monster,
  RedChest,
  RedDoor,
  Skeleton,
  Witch,
} from './classes';
import { monsterLevel } from './variables';

import { mapLayout } from './mapLayout';
import { patrolPaths } from './patrol';
export let monsterList: Monster[] = [];
export let mobList: Monster[] = [];
export let witchList: Monster[] = [];
export let doorList: Monster[] = [];
export let greenChestList: GreenChest[] = [];
export let redChestList: GreenChest[] = [];
export let chestList: GreenChest[] = [];
export let wallPositionList: number[][] = [];

export function emptyMapLists(): void {
  wallPositionList = [];
  witchList = [];
  doorList = [];
  greenChestList = [];
  redChestList = [];
  chestList = [];
  monsterList = [];
  mobList = [];
}

export let bossMonster = new Monster();
export let blackDoor = new BlackDoor();
export let greenPotionsTotal: number[] = [1, 1, 3];
export let redPotionsTotal: number[] = [0, 0, 1];

function spawn<T extends Monster>(
  coords: [number, number][],
  create: () => T,
  patrols?: [number, number][][],
  ...extraLists: T[][]
): void {
  coords.forEach(([x, y], index) => {
    const specimen = create();
    specimen.pickASpot(x, y);
    specimen.patrolPath = (patrols && patrols[index]) || [[x, y]];
    specimen.patrolIndex = 0;
    console.log(`${specimen.image} ${index} path:`, specimen.patrolPath);
    monsterList.push(specimen);
    extraLists.forEach(list => list.push(specimen));
  });
}

export function instantiateSetupArrays(): void {
  const currentLevel = monsterLevel - 1;
  const currentMap = mapLayout[currentLevel];
  wallPositionList = [...currentMap.walls];

  spawn(
    currentMap.witches,
    () => new Witch(),
    patrolPaths.witches[currentLevel],
    witchList,
    mobList
  );
  spawn(
    currentMap.skeletons,
    () => new Skeleton(),
    patrolPaths.skeletons[currentLevel],
    mobList
  );
  spawn(
    currentMap.guards,
    () => new Guard(),
    patrolPaths.guards[currentLevel],
    mobList
  );
  spawn(currentMap.blackDoor, () => new BlackDoor(), undefined, doorList);
  spawn(currentMap.greenDoors, () => new GreenDoor(), undefined, doorList);
  spawn(currentMap.redDoors, () => new RedDoor(), undefined, doorList);
  spawn(
    currentMap.greenChests,
    () => new GreenChest(),
    undefined,
    greenChestList,
    chestList
  );
  spawn(
    currentMap.redChests,
    () => new RedChest(),
    undefined,
    redChestList,
    chestList
  );

  currentMap.boss.forEach(([x, y]) => {
    bossMonster.pickASpot(x, y);
    bossMonster.patrolPath = (patrolPaths.boss[currentLevel] &&
      patrolPaths.boss[currentLevel][0]) || [[x, y]];
    bossMonster.patrolIndex = 0;
    monsterList.push(bossMonster);
    mobList.push(bossMonster);
  });

  monsterList.push(blackDoor);
  doorList.push(blackDoor);
}
