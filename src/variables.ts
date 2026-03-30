export const canvas = document.querySelector(
  '.main-canvas'
) as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export let monsterLevel: number = 1;
export let heroXpArray: number[] = [0, 2, 6, 10, 14, 18, 28, 35, 43, 52, 72];
export let tileWidth: number = 65;
export let gridWidth = 0;
export let gridHeight = 0;
export const CANVAS_MARGIN = 20;
export const CANVAS_BORDER = 1;
export const CANVAS_OFFSET = CANVAS_MARGIN + CANVAS_BORDER;
export let canvasHeight = window.innerHeight - CANVAS_OFFSET * 2;
export let canvasWidth = window.innerWidth - CANVAS_OFFSET * 2;
canvas.style.margin = `${CANVAS_MARGIN}px`;
canvas.style.border = `${CANVAS_BORDER}px solid black`;

export let moveEveryXMilisecondsInitial: number = 2000;
export let moveEveryXMilisecondsIncrement: number = 750;
export let moveEveryXMiliseconds: number = 2000;
export let moveEveryXMilisecondsMinimum: number = 500;

export const fontSize = Math.floor(tileWidth * 0.27);
export const mediumFontSize = Math.floor(tileWidth * 0.24);
export const smallFontSize = Math.floor(tileWidth * 0.2);

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
  moveEveryXMiliseconds = moveEveryXMilisecondsInitial;
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
      window.innerWidth * (1 - UI_PANEL_RATIO) - CANVAS_OFFSET * 2;
    const availableHeight = window.innerHeight - CANVAS_OFFSET * 2;

    const tileByWidth = Math.floor(availableWidth / GRID_COLS);
    const tileByHeight = Math.floor(availableHeight / GRID_ROWS);
    tileWidth = Math.min(tileByWidth, tileByHeight);

    gridWidth = tileWidth * GRID_COLS;
    gridHeight = tileWidth * GRID_ROWS;
    canvasWidth = gridWidth + Math.floor(window.innerWidth * UI_PANEL_RATIO); // total canvas including UI
    canvasHeight = gridHeight;
    uiPanelWidth = Math.floor(window.innerWidth * UI_PANEL_RATIO);
    uiPanelHeight = gridHeight;
    uiPanelX = gridWidth;
    uiPanelY = 0;
  } else {
    const availableWidth = window.innerWidth - CANVAS_OFFSET * 2;
    const availableHeight =
      window.innerHeight * (1 - UI_PANEL_RATIO) - CANVAS_OFFSET * 2;

    const tileByWidth = Math.floor(availableWidth / GRID_COLS);
    const tileByHeight = Math.floor(availableHeight / GRID_ROWS);
    tileWidth = Math.min(tileByWidth, tileByHeight);

    gridWidth = tileWidth * GRID_COLS;
    gridHeight = tileWidth * GRID_ROWS;
    canvasWidth = gridWidth;
    canvasHeight = gridHeight + Math.floor(window.innerHeight * UI_PANEL_RATIO);
    uiPanelWidth = canvasWidth;
    uiPanelHeight = Math.floor(window.innerHeight * UI_PANEL_RATIO);
    dpadWidth = uiPanelWidth * DPAD_RATIO;
    statsWidth = uiPanelWidth * ACTION_RATIO;
    uiPanelX = CANVAS_OFFSET + dpadWidth;
    uiPanelY = gridHeight;
  }
}
