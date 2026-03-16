export const canvas = document.querySelector(
  '.main-canvas'
) as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export let monsterLevel: number = 1;
export let heroXpArray: number[] = [0, 2, 6, 10, 14, 18, 28, 35, 43, 52, 72];
export let tileWidth: number = 65;
export let canvasWidth = 0;
export let canvasHeight = 0;
export const CANVAS_MARGIN = 20;
export const CANVAS_BORDER = 1;
export const CANVAS_OFFSET = CANVAS_MARGIN + CANVAS_BORDER;
canvas.style.margin = `${CANVAS_MARGIN}px`;
canvas.style.border = `${CANVAS_BORDER}px solid black`;

export let moveEveryXMiliseconds: number = 1000;

export function updateSpeed(speedChange: number): void {
  moveEveryXMiliseconds -= speedChange;
}
export function resetSpeed(newSpeed: number): void {
  moveEveryXMiliseconds = newSpeed;
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

const GRID_COLS = 10;
const GRID_ROWS = 10;
const UI_PANEL_RATIO = 0.37;
export const CONTROLLER_RATIO = 0.35;
export const DPAD_RATIO = 0.4;
export const ACTION_RATIO = 0.6;
type LayoutMode = 'side' | 'bottom';
export let layoutMode: LayoutMode = 'side';
export let uiPanelHeight: number = 0;
export let uiPanelX: number = 0;
export let uiPanelY: number = 0;
export let uiPanelWidth = 0;
export let dpadWidth = 150;
export let statsWidth = 0;

export function computeLayout(): void {
  layoutMode = window.innerWidth > window.innerHeight ? 'side' : 'bottom';
  if (layoutMode === 'side') {
    const availableWidth =
      window.innerWidth * (1 - UI_PANEL_RATIO) - CANVAS_OFFSET;
    const availableHeight = window.innerHeight - CANVAS_OFFSET * 2;

    const tileByWidth = Math.floor(availableWidth / GRID_COLS);
    const tileByHeight = Math.floor(availableHeight / GRID_ROWS);
    tileWidth = Math.min(tileByWidth, tileByHeight);

    canvasWidth = tileWidth * GRID_COLS;
    canvasHeight = tileWidth * GRID_ROWS;
    uiPanelWidth = window.innerWidth - canvasWidth - CANVAS_OFFSET * 2;
    uiPanelHeight = window.innerHeight - CANVAS_OFFSET;
    uiPanelX = canvasWidth + CANVAS_OFFSET;
    uiPanelY = CANVAS_OFFSET;
  } else {
    const availableWidth = window.innerWidth - CANVAS_OFFSET * 2;
    const availableHeight =
      window.innerHeight * (1 - UI_PANEL_RATIO) - CANVAS_OFFSET * 2;

    const tileByWidth = Math.floor(availableWidth / GRID_COLS);
    const tileByHeight = Math.floor(availableHeight / GRID_ROWS);
    tileWidth = Math.min(tileByWidth, tileByHeight);

    canvasWidth = tileWidth * GRID_COLS;
    canvasHeight = tileWidth * GRID_ROWS;
    uiPanelWidth = window.innerWidth - CANVAS_OFFSET * 2;
    uiPanelHeight = window.innerHeight - canvasHeight - CANVAS_OFFSET * 2;
    dpadWidth = uiPanelWidth * DPAD_RATIO;
    statsWidth = uiPanelWidth * ACTION_RATIO;
    uiPanelX = CANVAS_OFFSET + dpadWidth;
    uiPanelY = canvasHeight + CANVAS_OFFSET;
  }
}
