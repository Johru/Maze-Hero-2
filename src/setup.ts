import { assignKey, resetMonsters } from './monster';
import { heroInit } from './hero';
import { monsterLevel } from './variables';
import {
  emptyMapLists,
  instantiateSetupArrays,
  wallPositionList,
} from './mapgeneration';

export let mapSize: number = 10;

export function setup(): void {
  emptyMapLists();
  instantiateSetupArrays();
  pushBoundariesToWallList();
  heroInit();
  resetMonsters();
  assignKey();
}

export function pushBoundariesToWallList(): void {
  for (let j = 1; j < mapSize + 1; j++) {
    wallPositionList.push([j, mapSize + 1]);
  }
  for (let j = 1; j < mapSize + 1; j++) {
    wallPositionList.push([j, 0]);
  }
  for (let k = 1; k < mapSize + 1; k++) {
    wallPositionList.push([0, k]);
  }
  for (let k = 1; k < mapSize + 1; k++) {
    wallPositionList.push([mapSize + 1, k]);
  }
}

export function setMapSize(): void {
  mapSize = 5 + monsterLevel * 5;
}
