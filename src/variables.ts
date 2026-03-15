import { SpriteName } from './sprites';
import { d6 } from './utility';
export const canvas = document.querySelector(
  '.main-canvas'
) as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export let monsterLevel: number = 1;
export let heroXpArray: number[] = [0, 2, 6, 10, 14, 18, 28, 35, 43, 52, 72];
export let moveEveryXMiliseconds: number = 1000;
export function updateSpeed(speedChange: number): void {
  moveEveryXMiliseconds -= speedChange;
}
export function resetSpeed(newSpeed: number): void {
  moveEveryXMiliseconds = newSpeed;
}
export let tileWidth: number = 65;

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
