import { GreenChest, Monster } from './classes';
import { SpriteName } from './sprites';
import { d6 } from './utility';
export const canvas = document.querySelector(
  '.main-canvas'
) as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export let heroStats = {
  x: 1,
  y: 1,
  facing: 'hero-down' as SpriteName,
  level: 1,
  maxHP: d6(3) + 20,
  currentHP: 6,
  DP: d6(2),
  SP: d6(1) + 7,
  hasKey: false,
  hasPotion: 0,
  hasGreenKey: false,
  hasRedKey: false,
  hasSword: false,
  overKillPoints: 0,
  overKill: true,
  neededXP: 0,
  currentXP: 0,
  gold: 0,
  highscore: 0,
};
export let monsterLevel: number = 1;
export let heroXpArray: number[] = [0, 2, 6, 10, 14, 18, 28, 35, 43, 52, 72];
export let moveEveryXMiliseconds: number = 2000;
export function updateSpeed(speedChange: number): void {
  moveEveryXMiliseconds -= speedChange;
}
export function resetSpeed(newSpeed: number): void {
  moveEveryXMiliseconds = newSpeed;
}
export let tileWidth: number = 65;
export let monsterList: Monster[] = [];
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
}

export let monsterHasKey: number = 1;
export function updateMonsterHasKey(orderNumberOfMonster: number): number {
  return (monsterHasKey = orderNumberOfMonster);
}

export function updateMonstersLevel(increment: number): number {
  return (monsterLevel += increment);
}
export function resetMonstersLevel(): void {
  monsterLevel = 1;
}
let destination: number[] = [];
export function updateDestination(x: number, y: number): number[] {
  return (destination = [x, y]);
}
export function getDestination(): number[] {
  return destination;
}
