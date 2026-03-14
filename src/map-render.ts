import {
  ctx,
  tileWidth,
  heroStats,
  monsterLevel,
  canvas,
  wallPositionList,
} from './variables';
import { gameLog } from './utility';
import {} from './setup';
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
import { losArray, unblocked } from './monster';
import { getSprite } from './sprites';

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

export function paintLos(x: number, y: number): void {
  for (let i = 0; i < losArray.length; i++) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(
      (losArray[i][0] - 1) * tileWidth + (tileWidth - 25) / 2,
      (losArray[i][1] - 1) * tileWidth + (tileWidth - 25) / 2,
      25,
      25
    );
  }
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  if (unblocked) ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(
    (heroStats.x - 1) * tileWidth + tileWidth / 2,
    (heroStats.y - 1) * tileWidth + tileWidth / 2
  );
  ctx.lineTo(x * 65 - tileWidth / 2, y * 65 - tileWidth / 2);
  ctx.stroke();
  ctx.lineWidth = 1;
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
export function renderPauseScreen() {
  ctx.drawImage(getSprite('square'), 0, 0, 1120, 650);
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
}

export function printstats(): void {
  ctx.font = '20px Arial';
  ctx.fillText('Stats:', 660, 25);
  ctx.drawImage(getSprite('square'), 835, 0, 90, 90);
  ctx.drawImage(getSprite('square'), 835, 90, 90, 90);
  ctx.drawImage(getSprite('square'), 835, 180, 90, 90);
  ctx.drawImage(getSprite('square'), 1030, 0, 90, 90);
  ctx.drawImage(getSprite('square'), 1100, 0, 20, 20);
  ctx.drawImage(getSprite('square'), 1030, 90, 90, 90);
  ctx.drawImage(getSprite('square'), 1030, 180, 90, 90);
  ctx.drawImage(getSprite('square'), 1030, 270, 90, 90);
  ctx.drawImage(getSprite('square'), 650, 0, 185, 270);
  ctx.drawImage(getSprite('square'), 650, 400, 480, 250);
  if (heroStats.hasKey) {
    ctx.drawImage(getSprite('key'), 835, 0, 90, 90);
  }
  if (heroStats.overKill) {
    ctx.drawImage(getSprite('axe'), 1030, 270, 90, 90);
  }
  if (heroStats.hasGreenKey) {
    ctx.drawImage(getSprite('greenKey'), 835, 90, 90, 90);
  }
  if (heroStats.hasRedKey) {
    ctx.drawImage(getSprite('redKey'), 835, 180, 90, 90);
  }
  if (heroStats.hasPotion > 0) {
    ctx.drawImage(getSprite('potion'), 1030, 0, 90, 90);
  }
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
  ctx.fillStyle = 'black';
}
