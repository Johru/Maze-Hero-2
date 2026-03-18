import {
  ctx,
  tileWidth,
  canvas,
  uiPanelX,
  uiPanelY,
  uiPanelWidth,
  uiPanelHeight,
  gridWidth,
  gridHeight,
  canvasHeight,
  canvasWidth,
  fontSize,
  mediumFontSize,
  smallFontSize,
} from './variables';
import { gameLog } from './utility';
import { heroStats } from './hero';
import {
  pdown,
  scoreArray,
  scrollingModifierX,
  scrollingModifierY,
  spacedown,
} from './index';
import { getSprite, SpriteName } from './sprites';
import { wallPositionList } from './mapgeneration';
import e from 'express';

export function clearCanvas(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export function renderFloor(): void {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      renderFloorTile(i, j);
    }
  }
}

export function renderWalls(): void {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < wallPositionList.length; k++) {
        if (
          wallPositionList[k][0] == i + scrollingModifierX + 1 &&
          wallPositionList[k][1] == j + scrollingModifierY + 1
        ) {
          renderWallTile(i, j);
        }
      }
    }
  }
}

function renderWallTile(xPosition: number, yPosition: number): void {
  ctx.drawImage(
    getSprite('wall'),
    xPosition * tileWidth,
    yPosition * tileWidth,
    tileWidth,
    tileWidth
  );
}
function renderFloorTile(xPosition: number, yPosition: number): void {
  ctx.drawImage(
    getSprite('floor'),
    xPosition * tileWidth,
    yPosition * tileWidth,
    tileWidth,
    tileWidth
  );
  ctx.strokeStyle = 'black';
  ctx.strokeRect(
    xPosition * tileWidth,
    yPosition * tileWidth,
    tileWidth,
    tileWidth
  );
}

export function renderHeart(
  heartX: number,
  heartY: number,
  heartW: number,
  heartH: number
): void {
  const fillRatio = Math.max(
    0,
    Math.min(1, heroStats.currentHP / heroStats.maxHP)
  );

  const fillHeight = Math.floor(heartH * fillRatio);
  const offscreen = document.createElement('canvas');
  offscreen.width = heartW;
  offscreen.height = heartH;
  const offCtx = offscreen.getContext('2d') as CanvasRenderingContext2D;

  offCtx.drawImage(getSprite('heartfill'), 0, 0, heartW, heartH);
  offCtx.clearRect(0, 0, heartW, heartH - fillHeight);
  offCtx.globalCompositeOperation = 'destination-in';
  offCtx.drawImage(getSprite('heartmask'), 0, 0, heartW, heartH);
  ctx.drawImage(offscreen, heartX, heartY);
  ctx.drawImage(getSprite('heartframe'), heartX, heartY, heartW, heartH);
}

export function renderFinaleScreen(): void {
  let currentY = canvasHeight / 2 - tileWidth * 2;
  const startX = canvasWidth / 2 - tileWidth * 2;
  const gap = fontSize * 2;
  ctx.drawImage(getSprite('outerbackground'), 0, 0, canvasWidth, canvasHeight);
  ctx.font = `${fontSize * 2}px Arial`;
  ctx.fillText(`Thank you for Playing!`, startX, currentY);
  currentY += gap;
  ctx.fillText(`Score: ${heroStats.highscore}`, startX, currentY);
  currentY += gap;
  ctx.fillText(`Damage Dealt: ${heroStats.damageDealt}`, startX, currentY);
  currentY += gap;
  ctx.fillText(
    `Damage Received: ${heroStats.damageReceived}`,
    startX,
    currentY
  );
  currentY += gap;
  ctx.fillText(`Enemies Killed: ${heroStats.enemiesKilled}`, startX, currentY);
  currentY += gap;
  ctx.fillText('To restart, press', startX, currentY);
  ctx.drawImage(
    getSprite('space'),
    startX + fontSize * 20,
    currentY - fontSize,
    tileWidth * 2,
    (tileWidth * 2) / 3.7
  );
  currentY += gap;
  ctx.fillText(`Highscores:`, startX, currentY);
  currentY += gap;
  for (let i = 0; i < 5; i++) {
    ctx.fillText(`${scoreArray[i]}`, startX, currentY + fontSize * 2 * i);
  }
}

export function renderDeathScreen(): void {
  let currentY = canvasHeight / 2 - tileWidth * 2;
  const startX = canvasWidth / 2 - tileWidth * 2;
  const gap = fontSize * 2;
  ctx.drawImage(getSprite('outerbackground'), 0, 0, canvasWidth, canvasHeight);
  ctx.font = `${fontSize * 2}px Arial`;
  ctx.fillStyle = 'red';
  ctx.fillText('YOU DIED', startX, currentY);
  ctx.font = `${fontSize * 1.3}px Arial`;
  ctx.fillStyle = 'AntiqueWhite';
  currentY += gap;
  ctx.fillText(
    `HP: ${heroStats.currentHP} / ${heroStats.maxHP}`,
    startX,
    currentY
  );
  currentY += gap;
  ctx.fillText(`Score: ${heroStats.highscore}`, startX, currentY);
  currentY += gap;
  ctx.fillText(`Deaths: ${localStorage.getItem('deaths')}`, startX, currentY);
  currentY += gap;
  ctx.fillText(`Killed By: ${heroStats.killedBy}`, startX, currentY);
  currentY += gap;
  ctx.fillText(`Damage Dealt: ${heroStats.damageDealt}`, startX, currentY);
  currentY += gap;
  ctx.fillText(
    `Damage Received: ${heroStats.damageReceived}`,
    startX,
    currentY
  );
  currentY += gap;
  ctx.fillText(`Enemies Killed: ${heroStats.enemiesKilled}`, startX, currentY);
  currentY += gap;
  ctx.drawImage(
    getSprite('space'),
    startX + fontSize * 10,
    currentY - fontSize,
    tileWidth * 2,
    (tileWidth * 2) / 3.7
  );
  ctx.fillText('To restart, press', startX, currentY);
}

export function printstats(): void {
  const leftRightMargin = tileWidth * 0.5;
  const defaultFontColor = 'AntiqueWhite';
  const frameSize = tileWidth * 1.1;
  const framePlusGap = frameSize * 1.07;
  const innerX = uiPanelX + leftRightMargin;
  const innerWidth = uiPanelWidth - leftRightMargin * 2;

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = defaultFontColor;

  // OUTER BACKGROUND AND BORDER
  ctx.drawImage(
    getSprite('outerbackground'),
    uiPanelX,
    uiPanelY,
    uiPanelWidth,
    uiPanelHeight
  );
  ctx.drawImage(
    getSprite('outer-corner-left-top'),
    uiPanelX,
    uiPanelY,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('outer-corner-right-top'),
    uiPanelX + uiPanelWidth - tileWidth / 3,
    uiPanelY,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('outer-corner-left-bottom'),
    uiPanelX,
    uiPanelY + uiPanelHeight - tileWidth / 3,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('outer-corner-right-bottom'),
    uiPanelX + uiPanelWidth - tileWidth / 3,
    uiPanelY + uiPanelHeight - tileWidth / 3,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('outer-edge-top'),
    uiPanelX + tileWidth / 4,
    uiPanelY,
    innerWidth + leftRightMargin,
    tileWidth / 4
  );
  ctx.drawImage(
    getSprite('outer-edge-bottom'),
    uiPanelX + tileWidth / 4,
    uiPanelY + uiPanelHeight - tileWidth / 4,
    innerWidth + leftRightMargin,
    tileWidth / 4
  );
  ctx.drawImage(
    getSprite('outer-edge-left'),
    uiPanelX,
    uiPanelY + tileWidth / 4,
    tileWidth / 4,
    uiPanelHeight - tileWidth / 2
  );
  ctx.drawImage(
    getSprite('outer-edge-right'),
    uiPanelX + uiPanelWidth - tileWidth / 4,
    uiPanelY + tileWidth / 4,
    tileWidth / 4,
    uiPanelHeight - tileWidth / 2
  );

  // ── HEADER: HEART / HP / LEVEL / XP / GOLD / SCORE ──
  let currentY = uiPanelY + tileWidth * 0.5;
  const heartSize = tileWidth * 1.5;
  renderHeart(innerX, currentY, heartSize, heartSize);

  const statsX = innerX + heartSize + leftRightMargin * 0.5;
  const statsWidth = uiPanelX + uiPanelWidth - leftRightMargin - statsX;

  ctx.font = `bold ${Math.floor(fontSize * 1.3)}px Arial`;
  ctx.fillStyle = defaultFontColor;
  ctx.fillText(
    `HP ${heroStats.currentHP} / ${heroStats.maxHP}`,
    statsX,
    currentY + fontSize * 1.3
  );

  // XP bar
  const barY = currentY + fontSize * 2.5;
  const barWidth = statsWidth * 0.55;
  const barHeight = fontSize * 0.6;
  const xpRatio =
    heroStats.neededXP > 0 ? heroStats.currentXP / heroStats.neededXP : 0;
  ctx.font = `${mediumFontSize}px Arial`;
  ctx.fillText(`LVL ${heroStats.level}`, statsX, barY);
  const barX = statsX + tileWidth * 0.9;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY - barHeight, barWidth, barHeight);
  ctx.fillStyle = '#4af';
  ctx.fillRect(barX, barY - barHeight, barWidth * xpRatio, barHeight);
  ctx.fillStyle = defaultFontColor;
  ctx.fillText(
    `${heroStats.currentXP} / ${heroStats.neededXP}`,
    barX + barWidth + fontSize * 0.3,
    barY
  );

  // Gold and Score
  ctx.font = `${fontSize}px Arial`;
  const goldY = barY + fontSize * 0.8;
  const goldHeight = fontSize * 1.8;
  const halfStats = statsWidth * 0.5;
  ctx.drawImage(getSprite('gold'), statsX, goldY, goldHeight, goldHeight);
  ctx.fillText(
    `Gold ${heroStats.gold}`,
    statsX + goldHeight + fontSize * 0.5,
    goldY + goldHeight / 2 + fontSize * 0.4
  );

  ctx.drawImage(
    getSprite('score'),
    statsX + halfStats,
    goldY,
    goldHeight,
    goldHeight
  );
  ctx.fillText(
    `Score ${heroStats.highscore}`,
    statsX + halfStats + goldHeight + fontSize * 0.5,
    goldY + goldHeight / 2 + fontSize * 0.4
  );

  currentY += heartSize + leftRightMargin * 0.2;

  // ── DIVIDER + INVENTORY ──
  function drawSectionDivider(y: number, label: string): void {
    ctx.drawImage(
      getSprite('inner-edge-top'),
      innerX,
      y,
      innerWidth,
      tileWidth / 2
    );
  }

  drawSectionDivider(currentY, 'Inventory');
  currentY += fontSize * 2.5;

  // inventory row 1: potion, overkill star, sword, empty
  let overkillImageName: SpriteName | null;
  const overkillActive = heroStats.overKill ? 'on' : 'off';
  if (heroStats.overKillPoints > 15)
    overkillImageName = `overkill-${overkillActive}-large` as SpriteName;
  else if (heroStats.overKillPoints > 7)
    overkillImageName = `overkill-${overkillActive}-medium` as SpriteName;
  else if (heroStats.overKillPoints > 0)
    overkillImageName = `overkill-${overkillActive}-small` as SpriteName;
  else overkillImageName = null;
  const inventoryItems: (SpriteName | null)[] = [
    heroStats.hasPotion > 0 ? 'potion' : null,
    heroStats.hasSword ? 'sword2' : 'sword',
    overkillImageName,
  ];
  const inventoryNames = ['Potion', 'Weapon', 'Overkill'];

  inventoryItems.forEach((item, i) => {
    const fx = innerX + i * framePlusGap;
    ctx.font = `${mediumFontSize}px Arial`;
    ctx.fillText(inventoryNames[i], fx, currentY - fontSize * 0.3);
    ctx.drawImage(
      getSprite('square-frame'),
      fx,
      currentY,
      frameSize,
      frameSize
    );
    if (item)
      ctx.drawImage(getSprite(item), fx, currentY, frameSize, frameSize);
  });
  ctx.fillText(
    `${heroStats.hasPotion}`,
    innerX + framePlusGap * 0.75,
    currentY + fontSize * 1
  );
  ctx.fillText(
    'HELP',
    innerX + innerWidth - frameSize,
    currentY - fontSize * 0.3
  );
  ctx.drawImage(
    getSprite('escape'),
    innerX + innerWidth - frameSize,
    currentY + fontSize * 0.2,
    frameSize,
    frameSize
  );

  // inventory row 2: P button, SPACE button
  const buttonY = currentY + framePlusGap;
  ctx.drawImage(
    getSprite(pdown ? 'pdButton' : 'pButton'),
    innerX,
    buttonY,
    frameSize * 0.8,
    frameSize * 0.8
  );
  ctx.drawImage(
    getSprite(spacedown ? 'spaced' : 'space'),
    innerX + framePlusGap * 2,
    buttonY,
    frameSize * 1.5,
    frameSize * 0.5
  );

  currentY = buttonY + frameSize * 0.5 + leftRightMargin * 0.5;

  // ── DIVIDER + KEYS ──
  drawSectionDivider(currentY, 'Keys');
  currentY += tileWidth / 3 + fontSize * 0.5;

  const keyItems: (SpriteName | null)[] = [
    heroStats.hasKey ? 'key' : null,
    heroStats.hasGreenKey ? 'greenkey' : null,
    heroStats.hasRedKey ? 'redkey' : null,
    heroStats.hasBlueKey ? 'bluekey' : null,
  ];

  keyItems.forEach((item, i) => {
    const fx = innerX + i * framePlusGap;
    ctx.drawImage(
      getSprite('square-frame'),
      fx,
      currentY,
      frameSize,
      frameSize
    );
    if (item)
      ctx.drawImage(getSprite(item), fx, currentY, frameSize, frameSize);
  });

  currentY += framePlusGap + leftRightMargin * 0.5;

  // ── GAME LOG ──
  const logBottom = uiPanelY + uiPanelHeight - leftRightMargin;
  const logHeight = logBottom - currentY - tileWidth / 3;

  ctx.drawImage(
    getSprite('innerbackground'),
    innerX,
    currentY,
    innerWidth,
    logHeight + tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-corner-left-top'),
    innerX,
    currentY,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-corner-right-top'),
    innerX + innerWidth - tileWidth / 3,
    currentY,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-corner-left-bottom'),
    innerX,
    logBottom - tileWidth / 3,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-corner-right-bottom'),
    innerX + innerWidth - tileWidth / 3,
    logBottom - tileWidth / 3,
    tileWidth / 3,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-edge-top'),
    innerX + tileWidth / 3,
    currentY,
    innerWidth - (tileWidth / 3) * 2,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-edge-bottom'),
    innerX + tileWidth / 3,
    logBottom - tileWidth / 3,
    innerWidth - (tileWidth / 3) * 2,
    tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-edge-left'),
    innerX,
    currentY + tileWidth / 3,
    tileWidth / 3,
    logHeight - tileWidth / 3
  );
  ctx.drawImage(
    getSprite('inner-edge-right'),
    innerX + innerWidth - tileWidth / 3,
    currentY + tileWidth / 3,
    tileWidth / 3,
    logHeight - tileWidth / 3
  );

  const logTextX = innerX + tileWidth / 3 + fontSize * 0.5;
  const logTextStartY = currentY + tileWidth * 0.2 + fontSize;

  for (let i = 0; i < 10; i++) {
    if (gameLog[i] === undefined) continue;
    if (gameLog[i] === 'YOU DIED') {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'red';
    } else {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = defaultFontColor;
    }
    ctx.fillText(
      `• ${gameLog[i]}`,
      logTextX,
      logTextStartY + fontSize * 1.3 * i
    );
  }
}

export function renderPauseScreen(): void {
  ctx.drawImage(getSprite('outerbackground'), 0, 0, gridWidth, gridHeight);
  const leftRightMargin = tileWidth * 0.5;
  const defaultFontColor = 'AntiqueWhite';
  const frameSize = tileWidth * 1.1;
  const framePlusGap = frameSize * 1.07;
  const gapX = tileWidth * 0.4;
  const innerX = leftRightMargin;
  const innerWidth = gridWidth - leftRightMargin * 2;
  let currentY = leftRightMargin;
  ctx.font = `${smallFontSize}px Arial`;

  ctx.drawImage(
    getSprite('wasd'),
    innerX,
    currentY,
    frameSize * 1.8,
    frameSize
  );

  ctx.fillText(
    'Control your hero movement with WASD or Arrow keys',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.5
  );

  currentY += framePlusGap;

  ctx.drawImage(
    getSprite('blackDoor'),
    innerX + frameSize / 2,
    currentY,
    frameSize,
    frameSize
  );

  ctx.fillText(
    'Reach the black door to win a level. Three levels are a dungeon.',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.5
  );
  ctx.fillText(
    'More dungeons and dungeon selection menu will be added soon...',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.5 + fontSize
  );

  currentY += framePlusGap;

  ctx.drawImage(
    getSprite('overkill-on-large'),
    innerX + frameSize / 2,
    currentY,
    frameSize,
    frameSize
  );

  ctx.fillText(
    'As you kill enemies, you accumulate overkill points.',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.3
  );

  ctx.fillText(
    'Press space to activate/deactivate. When active, fights consume',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.3 + fontSize
  );
  ctx.fillText(
    'points to deal extra damage to stronger enemies.',
    innerX + frameSize * 1.8 + gapX,
    currentY + frameSize * 0.3 + fontSize * 2
  );
}
