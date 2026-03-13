import { GreenChest, Monster } from './classes';
import { d6 } from './utility';
export const canvas = document.querySelector(
  '.main-canvas'
) as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
export let skeleton = document.getElementById('skeleton') as HTMLImageElement;
export let heroUp = document.getElementById('hero-up') as HTMLImageElement;
export let heroDown = document.getElementById('hero-down') as HTMLImageElement;
export let heroLeft = document.getElementById('hero-left') as HTMLImageElement;
export let heroRight = document.getElementById(
  'hero-right'
) as HTMLImageElement;
export let floor = document.getElementById('floor') as HTMLImageElement;
export let wall = document.getElementById('wall') as HTMLImageElement;
export let boss = document.getElementById('boss') as HTMLImageElement;
export let blood = document.getElementById('blood') as HTMLImageElement;
export let key = document.getElementById('key') as HTMLImageElement;
export let die = document.getElementById('die') as HTMLImageElement;
export let potion = document.getElementById('potion') as HTMLImageElement;
export let door = document.getElementById('door') as HTMLImageElement;
export let doorOpen = document.getElementById('doorOpen') as HTMLImageElement;
export let greenDoor = document.getElementById('greenDoor') as HTMLImageElement;
export let greenDoorOpen = document.getElementById(
  'greenDoorOpen'
) as HTMLImageElement;
export let redDoor = document.getElementById('redDoor') as HTMLImageElement;
export let redDoorOpen = document.getElementById(
  'redDoorOpen'
) as HTMLImageElement;
export let greenChest = document.getElementById(
  'greenChest'
) as HTMLImageElement;
export let greenChestOpen = document.getElementById(
  'greenChestOpen'
) as HTMLImageElement;
export let redChest = document.getElementById('redChest') as HTMLImageElement;
export let redChestOpen = document.getElementById(
  'redChestOpen'
) as HTMLImageElement;
export let witch = document.getElementById('witch') as HTMLImageElement;
export let guard = document.getElementById('guard') as HTMLImageElement;
export let greenKey = document.getElementById('greenKey') as HTMLImageElement;
export let redKey = document.getElementById('redKey') as HTMLImageElement;
export let pButton = document.getElementById('pButton') as HTMLImageElement;
export let pdButton = document.getElementById('pdButton') as HTMLImageElement;
export let axe = document.getElementById('axe') as HTMLImageElement;
export let square = document.getElementById('square') as HTMLImageElement;
export let space = document.getElementById('space') as HTMLImageElement;
export let spaced = document.getElementById('spaced') as HTMLImageElement;
export let up = document.getElementById('up') as HTMLImageElement;
export let upd = document.getElementById('upd') as HTMLImageElement;
export let down = document.getElementById('down') as HTMLImageElement;
export let downd = document.getElementById('downd') as HTMLImageElement;
export let right = document.getElementById('right') as HTMLImageElement;
export let rightd = document.getElementById('rightd') as HTMLImageElement;
export let left = document.getElementById('left') as HTMLImageElement;
export let leftd = document.getElementById('leftd') as HTMLImageElement;
export let escape = document.getElementById('escape') as HTMLImageElement;
export let escaped = document.getElementById('escaped') as HTMLImageElement;
export let pause = document.getElementById('pause') as HTMLImageElement;
export let unpause = document.getElementById('unpause') as HTMLImageElement;
export let sword = document.getElementById('sword') as HTMLImageElement;
export let heroStats = {
  x: 1,
  y: 1,
  facing: 'heroDown',
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
