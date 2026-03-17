import {
  ctx,
  tileWidth,
  monsterLevel,
  canvas,
  uiPanelX,
  uiPanelY,
  uiPanelWidth,
  uiPanelHeight,
} from './variables';
import { gameLog } from './utility';
import { heroStats } from './hero';
import {
  downdown,
  escapeanim,
  leftdown,
  pdown,
  rightdown,
  scrollingModifierX,
  scrollingModifierY,
  spacedown,
  updown,
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

export function printstats(): void {
  const fontSize = Math.floor(tileWidth * 0.27);
  const mediumFontSize = Math.floor(tileWidth * 0.24);
  const smallFontSize = Math.floor(tileWidth * 0.2);
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
    'MENU',
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
      ctx.font = `${smallFontSize}px Arial`;
      ctx.fillStyle = defaultFontColor;
    }
    ctx.fillText(
      `• ${gameLog[i]}`,
      logTextX,
      logTextStartY + smallFontSize * 1.3 * i
    );
  }
}

/*
  ctx.font = '20px Arial';
  ctx.fillText('Stats:', 660, 25);





  ctx.font = '20px Arial';
  ctx.fillText(`${heroStats.hasPotion}`, 1105, 17);

  if (pdown) {
    ctx.drawImage(getSprite('pButton'), 935, 0, 90, 90);
  } else {
    ctx.drawImage(getSprite('pButton'), 935, 0, 90, 90);
  }

  if (spacedown) {
    ctx.drawImage(getSprite('space'), 935, 280, 90, 42);
  } else {
    ctx.drawImage(getSprite('spaced'), 935, 280, 90, 48);
  }
  if (rightdown) {
    ctx.drawImage(getSprite('right'), 920, 345, 42, 42);
  } else {
    ctx.drawImage(getSprite('rightd'), 920, 345, 45, 45);
  }
  if (leftdown) {
    ctx.drawImage(getSprite('left'), 820, 345, 42, 42);
  } else {
    ctx.drawImage(getSprite('leftd'), 820, 345, 45, 45);
  }
  if (downdown) {
    ctx.drawImage(getSprite('down'), 870, 345, 42, 42);
  } else {
    ctx.drawImage(getSprite('downd'), 870, 345, 45, 45);
  }
  if (updown) {
    ctx.drawImage(getSprite('up'), 870, 295, 42, 42);
  } else {
    ctx.drawImage(getSprite('upd'), 870, 295, 45, 45);
  }
  if (escapeanim) {
    ctx.drawImage(getSprite('escape'), 670, 290, 100, 88);
  } else {
    ctx.drawImage(getSprite('escaped'), 670, 290, 100, 88);
  }
  if (heroStats.hasSword) {
    ctx.drawImage(getSprite('sword'), 1030, 90, 90, 90);
  }
  if (heroStats.hasPotion > 1000) {
    ctx.drawImage(getSprite('potion'), 1030, 180, 90, 90);
  }
  ctx.fillText(`Hero Level: ${heroStats.level}`, 660, 50);
  ctx.fillText(
    `HP:         ${heroStats.currentHP}/${heroStats.maxHP}`,
    660,
    75
  );
  ctx.fillText(`Defense:  ${heroStats.DP}`, 660, 100);
  ctx.fillText(`Attack:     ${heroStats.SP}`, 660, 125);
  if (heroStats.overKill == true) {
    ctx.fillText(`Overkill:   Active!`, 660, 150);
  } else {
    ctx.fillText(`Overkill:   Off`, 660, 150);
  }
  ctx.fillText(`Score:     ${heroStats.highscore}`, 660, 175);
  ctx.fillText(`Map Number:${monsterLevel}`, 660, 25);
  ctx.fillText(`Overkill Points: ${heroStats.overKillPoints}`, 660, 200);
  ctx.fillText(`XP: ${heroStats.currentXP}/${heroStats.neededXP}`, 660, 225);
  ctx.fillText(`Gold: ${heroStats.gold}`, 660, 250);

  ctx.fillText(`Game Log:`, 680, 430);
  ctx.font = '15px Arial';
  for (let i = 0; i < 10; i++) {
    if (gameLog[i] === undefined) continue;
    if (gameLog[i] == `YOU DIED`) {
      ctx.font = '16px Arial';
      ctx.fillStyle = 'red';
    } else {
      ctx.font = '15px Arial';
      ctx.fillStyle = 'black';
    }

    ctx.fillText(gameLog[i], 680, 450 + 20 * i);
  }
  ctx.fillStyle = 'black';*/

export function renderPauseScreen(): void {
  ctx.drawImage(getSprite('square'), 0, 0, 1120, 650);
  /*

  ctx.font = '20px Arial';
  ctx.fillText(`Winning the game: `, 70, 50);
  ctx.font = '12px Arial';
  ctx.fillText(
    `You win by reaching the end of level 3 and escaping through the final door.
 In each level, you need to find and slay the witch (blue robe) who has the yellow key called the Key.
  `,
    75,
    80
  );
  ctx.fillText(
    `This will allow you to pass through the door to the next level. Sometimes, doors of other colors will block your path. Explore chests to find matching keys.`,
    75,
    95
  );
  ctx.font = '20px Arial';
  ctx.fillText(`Scoring:`, 75, 125);
  ctx.font = '12px Arial';
  ctx.fillText(
    `Reaching the final door by any means is enough to win. You will receive a score though. If you are interested in a higher score, you will do better if you conserve your resources.`,
    75,
    150
  );
  ctx.fillText(
    `While it is technically possible to defeat every single monster on each level, your score will be higher if your health is high, you found all gold and you have unused potions left.`,
    75,
    165
  );
  ctx.fillText(
    `Hero level and XP is scored, too, but valued less. Avoiding enemies is therefore recommended. Minimum score is 40 and maximum 2040. Both extremes are highly unlikely.`,
    75,
    180
  );
  ctx.font = '20px Arial';
  ctx.fillText(`Fighting and Overkill:`, 75, 210);
  ctx.font = '12px Arial';
  ctx.fillText(
    `You can fight a monster by moving into it's square. Combat will be resolved automatically, you can check Game Log for results. Even weak monsters can cause some damage early on. `,
    75,
    235
  );
  ctx.fillText(
    `When you do more damage than needed to kill a monster, the extra damage will be converted to overkill points. By pressing space, you can activate Overkill mode. `,
    75,
    250
  );
  ctx.fillText(
    `On first round of next combat, you will deal extra damage equal to your accumulated overkill points, making it easier to kill tough enemies. Your overkill points will be consumed.`,
    75,
    265
  );
  ctx.font = '20px Arial';
  ctx.fillText(`Controls:`, 75, 295);
  ctx.font = '12px Arial';
  ctx.fillText(`Use Arrow Keys to move`, 75, 320);
  ctx.fillText(
    `Use Space Key to activate or deactivate the Overkill mode.`,
    75,
    335
  );
  ctx.fillText(`Use the P Key to drink a potion a restore 10HP.`, 75, 350);
  ctx.fillText(
    `Use Escape to pause the game and display these instructions. Pressing Escape again will unpause the game.`,
    75,
    365
  );

  ctx.font = '20px Arial';
  ctx.fillText(`About the game:`, 75, 395);
  ctx.font = '12px Arial';
  ctx.fillText(
    `This is a demo of a planned game based on a school project. All graphics are a placeholder. There will be more levels, more monsters, more treasure and artifacts to be found.`,
    75,
    430
  );
  ctx.fillText(
    `The basic principles will remain the same. I am currently working on monster pathfinding.
  At the moment, monters move randomly. Eventually, they will be able to chase the player,`,
    75,
    445
  );
  ctx.fillText(
    `until line of sight is broken. Then they will return to their predictable patrol routine. Some will have fixed routines, others will select from multiple possible paths randomly each round.`,
    75,
    460
  );
  ctx.fillText(
    `The game will then turn into a stealth puzzle. It will be hard if not impossible to kill all monsters. The player will have to pick the unavoidable fights and evaluate the danger involved,`,
    75,
    475
  );
  ctx.fillText(
    `lure monsters away from treasure and claim it before they come back, or just run frantically around and through openings, only to get trapped and have to fight their way out.`,
    75,
    490
  );
  ctx.fillText(
    `It is, and always will be, a silly little game requiring no funding. Feedback is, however, welcome. Once finished, I will add a contact form and a mailing list and publish the game on itch.io .`,
    75,
    505
  );
  ctx.fillText(``, 75, 520);
  */
}
