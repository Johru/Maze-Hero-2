import {
  tileWidth,
  ctx,
  updateDestination,
  getDestination,
  monsterLevel,
} from './variables';
import { isNotAWall, battle } from './utility';
import { Monster } from './classes';
import { escapedown, scrollingModifierX, scrollingModifierY } from './index';
import {
  chestList,
  doorList,
  greenChestList,
  greenPotionsTotal,
  mobList,
  monsterList,
  redChestList,
  redPotionsTotal,
  wallPositionList,
  witchList,
} from './mapgeneration';
import {} from './mapRender';
import { getSprite } from './sprites';
import { heroStats } from './hero';
export let pathToPaint: number[][] = [];
export let unblocked = false;

export function renderAllMonsters(): void {
  for (let i = 0; i < chestList.length; i++) {
    renderMonster(chestList[i]);
  }
  for (let i = 0; i < doorList.length; i++) {
    renderMonster(doorList[i]);
  }
  for (let i = 0; i < mobList.length; i++) {
    renderDeadMonster(mobList[i]);
  }
  for (let i = 0; i < mobList.length; i++) {
    renderMonster(mobList[i]);
  }
}

export function renderMonster(specimen: Monster): void {
  if (
    specimen.alive &&
    specimen.x - scrollingModifierX <= 10 &&
    specimen.y - scrollingModifierY <= 10
  ) {
    ctx.drawImage(
      getSprite(specimen.image),
      (specimen.x - 1 - scrollingModifierX) * tileWidth,
      (specimen.y - 1 - scrollingModifierY) * tileWidth,
      tileWidth,
      tileWidth
    );
  }
}
export function renderDeadMonster(specimen: Monster): void {
  if (
    !specimen.alive &&
    specimen.x - scrollingModifierX <= 10 &&
    specimen.y - scrollingModifierY <= 10
  ) {
    ctx.drawImage(
      getSprite('blood'),
      (specimen.x - 1 - scrollingModifierX) * tileWidth,
      (specimen.y - 1 - scrollingModifierY) * tileWidth,
      tileWidth,
      tileWidth
    );
  }
}

export function resetMonsters(): void {
  for (let monster of monsterList) {
    monster.init();
  }

  const greenKeyChest =
    greenChestList[Math.floor(Math.random() * greenChestList.length)];
  const redKeyChest =
    redChestList[Math.floor(Math.random() * redChestList.length)];
  const swordChest =
    monsterLevel === 3
      ? redChestList[Math.floor(Math.random() * redChestList.length)]
      : null;

  let greenChestPotion = greenPotionsTotal[monsterLevel - 1];
  let redChestPotion = redPotionsTotal[monsterLevel - 1];

  for (let chest of greenChestList) {
    if (chest === greenKeyChest) {
      chest.hasKey = true;
    } else if (greenChestPotion > 0) {
      chest.hasPotion = true;
      greenChestPotion--;
    } else {
      chest.gold = 50;
    }
  }

  for (let chest of redChestList) {
    if (chest === swordChest) chest.hasSword = true;
    if (chest === redKeyChest) {
      chest.hasKey = true;
    } else if (redChestPotion > 0) {
      chest.hasPotion = true;
      redChestPotion--;
    } else {
      chest.gold = 50;
    }
  }
}

export function iterateList(input: any): void {
  for (let specimen of monsterList) {
    input(specimen);
  }
}

export const losArray: number[][] = [];

export function checkLineOfSight(monsterX: number, monsterY: number): boolean {
  losArray.length = 0;
  let x1 = monsterX;
  let y1 = monsterY;
  let x0 = heroStats.x;
  let y0 = heroStats.y;
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;

  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let err = (dx > dy ? dx : -dy) / 2;

  let break50 = 0;
  while (true) {
    if (break50 > 50) {
      console.log('infinite loop broken');
      break;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }
    if (err > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }
    if (err > -dx) losArray.push([x0, y0]);
    if (err < dy) {
      err += dx;
      y0 += sy;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }

    losArray.push([x0, y0]);
    break50++;
  }
  unblocked = true;

  for (let i = 0; i < losArray.length; i++) {
    if (!isLOSunblocked(losArray[i][0], losArray[i][1])) unblocked = false;
  }

  return unblocked;
}

interface Node {
  thisNodeX: number;
  thisNodeY: number;
  fScore: number;
  gScore: number;
  prevNode: number[];
}

export function findShortestPath(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number
): number[][] {
  let currentNode: Node = {
    thisNodeX: startX,
    thisNodeY: startY,
    fScore: 999,
    gScore: 0,
    prevNode: [],
  };

  let openList: Node[] = [];
  let closedList: Node[] = [];
  let exploreList: number[][] = [];

  openList.push(currentNode);

  loop1: while (openList.length > 0) {
    exploreList.length = 0;

    exploreList = [
      [currentNode.thisNodeX, currentNode.thisNodeY - 1],
      [currentNode.thisNodeX + 1, currentNode.thisNodeY],
      [currentNode.thisNodeX, currentNode.thisNodeY + 1],
      [currentNode.thisNodeX - 1, currentNode.thisNodeY],
    ];

    loop2: for (let i = 0; i < 4; i++) {
      if (isWall(exploreList[i][0], exploreList[i][1])) {
        continue loop2;
      }

      if (isOnClosedList(exploreList[i][0], exploreList[i][1])) {
        continue loop2;
      }

      if (isOnOpenList(exploreList[i][0], exploreList[i][1])) {
        continue loop2;
      }

      let fX = exploreList[i][0] - targetX;
      let fY = exploreList[i][1] - targetY;
      let gScore = currentNode.gScore + 1;
      let fScore = Math.sqrt(fX * fX + fY * fY) + gScore;

      let newNode = {
        thisNodeX: exploreList[i][0],
        thisNodeY: exploreList[i][1],
        fScore: fScore,
        gScore: gScore,
        prevNode: [currentNode.thisNodeX, currentNode.thisNodeY],
      };
      openList.push(newNode);
    }

    openList.sort((a, b) => (a.fScore < b.fScore ? -1 : 1));

    let clone = JSON.parse(JSON.stringify(currentNode));
    closedList.push(clone);

    currentNode = JSON.parse(JSON.stringify(openList[0]));

    openList.shift();

    if (currentNode.thisNodeX == targetX && currentNode.thisNodeY == targetY) {
      let shortestPath: number[][] = [];
      let current = [currentNode.thisNodeX, currentNode.thisNodeY];
      shortestPath.push(current);

      let previous = closedList.find(
        element =>
          element.thisNodeX == currentNode.prevNode[0] &&
          element.thisNodeY == currentNode.prevNode[1]
      );

      for (let i = 0; i < currentNode.gScore; i++) {
        shortestPath.push([previous.thisNodeX, previous.thisNodeY]);
        let previous2 = closedList.find(
          element =>
            element.thisNodeX == previous.prevNode[0] &&
            element.thisNodeY == previous.prevNode[1]
        );
        previous = previous2;
      }
      return shortestPath.reverse();
      break loop1;
    }
  }

  function isOnOpenList(x: number, y: number) {
    for (let node of openList) {
      if (node.thisNodeX == x && node.thisNodeY == y) return true;
    }
    return false;
  }

  function isOnClosedList(x: number, y: number) {
    for (let node of closedList) {
      if (node.thisNodeX == x && node.thisNodeY == y) return true;
    }
    return false;
  }

  function isWall(x: number, y: number): boolean {
    for (let i = 0; i < wallPositionList.length; i++) {
      if (x == wallPositionList[i][0] && y == wallPositionList[i][1])
        return true;
    }
    for (let monster of doorList) {
      if (monster.x !== x || monster.y !== y) continue;
      if (monster.isDoor && !monster.open) return true;
    }
    return false;
  }
}

export function isLOSunblocked(x: number, y: number): boolean {
  for (let i = 0; i < wallPositionList.length; i++) {
    if (x == wallPositionList[i][0] && y == wallPositionList[i][1]) {
      return false;
    }
  }
  return true;
}

function getShuffledDirections(): number[] {
  return [1, 2, 3, 4].sort(() => Math.random() - 0.5);
}

function tryMove(specimen: Monster): void {
  const dest = getDestination();
  if (isNotAWall() && isNotAMonster(specimen)) {
    specimen.x = dest[0];
    specimen.y = dest[1];
    specimen.swapDestination = null;
  } else {
    specimen.swapDestination = [dest[0], dest[1]];
  }
}

export function resolveSwap(): void {
  for (let specimen of mobList) {
    if (specimen.swapDestination) {
      for (let specimen2 of mobList) {
        if (!specimen2.swapDestination) {
          continue;
        }
        if (specimen2 === specimen) continue;
        console.log(
          `${specimen.image} at (${specimen.x},${specimen.y}) wants to swap with ${specimen2.image} at (${specimen2.x},${specimen2.y})`
        );
        if (
          specimen.x == specimen2.swapDestination[0] &&
          specimen.y == specimen2.swapDestination[1] &&
          specimen2.x == specimen.swapDestination[0] &&
          specimen2.y == specimen.swapDestination[1]
        ) {
          [specimen.x, specimen2.x] = [specimen2.x, specimen.x];
          [specimen.y, specimen2.y] = [specimen2.y, specimen.y];
          specimen.swapDestination = null;
          specimen2.swapDestination = null;
        }
      }
    }
  }
}

export function attemptToMoveMonster(specimen: Monster): void {
  if (escapedown) return;
  if (!specimen.alive || specimen.speed <= 0) return;

  if (checkLineOfSight(specimen.x, specimen.y) && specimen.image !== 'witch') {
    // update last seen position
    specimen.heroLastSeenAt = [heroStats.x, heroStats.y];

    specimen.path = findShortestPath(
      specimen.x,
      specimen.y,
      heroStats.x,
      heroStats.y
    );
    if (!specimen.path) {
      specimen.path = [];
      return;
    }
    specimen.path.shift();

    if (specimen.path.length > 0) {
      updateDestination(specimen.path[0][0], specimen.path[0][1]);
      if (isNotAWall() && isNotAMonster(specimen)) {
        specimen.x = getDestination()[0];
        specimen.y = getDestination()[1];
        specimen.path.shift();
        specimen.swapDestination = null;
      } else {
        specimen.swapDestination = [getDestination()[0], getDestination()[1]];
      }
    }
  } else if (specimen.heroLastSeenAt) {
    // no LOS but remember where hero was — path there first
    const [lastX, lastY] = specimen.heroLastSeenAt;

    if (specimen.x === lastX && specimen.y === lastY) {
      // reached last known position, give up
      specimen.heroLastSeenAt = null;
      specimen.path = [];
      return;
    }

    const chaseRoute = findShortestPath(specimen.x, specimen.y, lastX, lastY);

    if (!chaseRoute || chaseRoute.length === 0) {
      specimen.heroLastSeenAt = null;
      return;
    }
    chaseRoute.shift();

    if (chaseRoute.length > 0) {
      updateDestination(chaseRoute[0][0], chaseRoute[0][1]);
      tryMove(specimen);
    }
  } else if (specimen.patrolPath.length > 0) {
    const target = specimen.patrolPath[specimen.patrolIndex];

    if (specimen.x === target[0] && specimen.y === target[1]) {
      specimen.patrolIndex =
        (specimen.patrolIndex + 1) % specimen.patrolPath.length;
    }

    const nextTarget = specimen.patrolPath[specimen.patrolIndex];
    const patrolRoute = findShortestPath(
      specimen.x,
      specimen.y,
      nextTarget[0],
      nextTarget[1]
    );

    if (!patrolRoute || patrolRoute.length === 0) return;
    patrolRoute.shift();

    if (patrolRoute.length > 0) {
      updateDestination(patrolRoute[0][0], patrolRoute[0][1]);
      tryMove(specimen);
    }
  } else {
    for (const direction of getShuffledDirections()) {
      monsterDestination(direction, specimen);
      tryMove(specimen);
      break;
    }
  }
}

function monsterDestination(input: number, specimen: Monster) {
  switch (input) {
    case 1: //down
      updateDestination(specimen.x, specimen.y + 1);
      break;
    case 2: //up
      updateDestination(specimen.x, specimen.y - 1);
      break;
    case 3: //left
      updateDestination(specimen.x - 1, specimen.y);
      break;
    case 4: //right
      updateDestination(specimen.x + 1, specimen.y);
      break;
  }
}

function isNotAMonster(specimen: Monster) {
  for (let monster of monsterList) {
    if (monster === specimen) continue;
    if (
      monster.x === getDestination()[0] &&
      monster.y === getDestination()[1] &&
      monster.alive &&
      !monster.open
    ) {
      return false;
    }
  }
  return true;
}

export function assignKey(): void {
  const luckyWitch = witchList[Math.floor(Math.random() * witchList.length)];
  for (let witch of witchList) {
    witch.hasKey = witch === luckyWitch;
  }
}

export function checkIfBattleForMonsters(): void {
  for (let monster of monsterList) {
    if (
      heroStats.x == monster.x &&
      heroStats.y == monster.y &&
      monster.alive &&
      monster.speed > 0
    ) {
      battle(monster);
    }
  }
}
