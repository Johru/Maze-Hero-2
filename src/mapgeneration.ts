import {
  BlackDoor,
  GreenChest,
  GreenDoor,
  Guard,
  Monster,
  RedChest,
  RedDoor,
  Skeleton,
  Witch,
} from './classes';
import {
  chestList,
  doorList,
  greenChestList,
  monsterLevel,
  monsterList,
  redChestList,
  witchList,
} from './variables';

interface ParsedLevel {
  walls: [number, number][];
  witches: [number, number][];
  guards: [number, number][];
  skeletons: [number, number][];
  boss: [number, number][];
  greenChests: [number, number][];
  redChests: [number, number][];
  greenDoors: [number, number][];
  redDoors: [number, number][];
  blackDoor: [number, number][];
}

function parseLevel(layout: string): ParsedLevel {
  const result: ParsedLevel = {
    walls: [],
    witches: [],
    guards: [],
    skeletons: [],
    boss: [],
    greenChests: [],
    redChests: [],
    greenDoors: [],
    redDoors: [],
    blackDoor: [],
  };

  layout
    .trim()
    .split('\n')
    .forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        switch (cell) {
          case '#':
            result.walls.push([x + 1, y + 1]);
            break;
          case 'W':
            result.witches.push([x + 1, y + 1]);
            break;
          case 'T':
            result.guards.push([x + 1, y + 1]);
            break;
          case 'S':
            result.skeletons.push([x + 1, y + 1]);
            break;
          case 'K':
            result.boss.push([x + 1, y + 1]);
            break;
          case 'b':
            result.blackDoor.push([x + 1, y + 1]);
            break;
          case 'g':
            result.greenDoors.push([x + 1, y + 1]);
            break;
          case 'r':
            result.redDoors.push([x + 1, y + 1]);
            break;
          case 'G':
            result.greenChests.push([x + 1, y + 1]);
            break;
          case 'R':
            result.redChests.push([x + 1, y + 1]);
            break;
        }
      });
    });

  return result;
}

export const mapsLayout = [
  parseLevel(`
..#...S##G
.##.##.#..
.....#.#S.
.###.#....
.#.#.#.###
.#.#...#..
...S.#....
##.....#g#
....####..
G.#...W#Kb
  `),
  parseLevel(`
.#...#G#....S..
.....#..T......
.##..#####r###.
.#S........#...
...##.##...###.
##.#.......#.T.
W#.#.#.##.#..##
.#...#..#.#....
.###.#T.#.####.
.....#G.#.#....
.###.####..T...
...........##..
###.S#.##.##...
..r..#..#..#.##
G.#..#.....#.gb
  `),
  parseLevel(`
.##.g...T...#.....SR
....#.G####.#.#..#S.
#r#.#.R#..r...#..#..
W.#.####.###G.#..###
GG#.S....#.####.T...
###.###.##.#.G####S.
....#......#.G#..#..
.R#...#.T..#...T.###
.Sr.#.#R.#.#.#G..#G.
.##...####.#.###.##.
.#..#.....S..T....#.
....##.##.#####.#.#r
g##.....#.#G.Tr.#..T
..#.###...#####T##.#
..#S#...#...T.......
W.#G#.###.#.###..##K
#####.#...#.TR#..#..
RS........$$..$..$.b
    `),
];
const currentLevel = monsterLevel - 1;
const currentMap = mapsLayout[currentLevel];

export let wallSetup: number[][] = [
  [
    3, 1, 8, 1, 9, 1, 2, 2, 3, 2, 5, 2, 6, 2, 8, 2, 6, 3, 8, 3, 2, 4, 3, 4, 4,
    4, 6, 4, 2, 5, 4, 5, 6, 5, 8, 5, 9, 5, 10, 5, 2, 6, 4, 6, 8, 6, 6, 7, 1, 8,
    2, 8, 8, 8, 10, 8, 5, 9, 6, 9, 7, 9, 8, 9, 3, 10, 8, 10,
  ],
  [
    2, 1, 6, 1, 8, 1, 6, 2, 2, 3, 3, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 12, 3,
    13, 3, 14, 3, 2, 4, 12, 4, 4, 5, 5, 5, 7, 5, 8, 5, 12, 5, 13, 5, 14, 5, 1,
    6, 2, 6, 4, 6, 12, 6, 2, 7, 4, 7, 6, 7, 8, 7, 9, 7, 11, 7, 14, 7, 15, 7, 2,
    8, 6, 8, 9, 8, 11, 8, 2, 9, 3, 9, 4, 9, 6, 9, 9, 9, 11, 9, 12, 9, 13, 9, 14,
    9, 6, 10, 9, 10, 11, 10, 2, 11, 3, 11, 4, 11, 6, 11, 7, 11, 8, 11, 9, 11,
    12, 12, 13, 12, 1, 13, 2, 13, 3, 13, 6, 13, 8, 13, 9, 13, 11, 13, 12, 13, 6,
    14, 9, 14, 12, 14, 14, 14, 15, 14, 3, 15, 6, 15, 12, 15,
  ],
  [
    2, 1, 3, 1, 13, 1, 5, 2, 8, 2, 9, 2, 10, 2, 11, 2, 13, 2, 15, 2, 18, 2, 1,
    3, 3, 3, 5, 3, 8, 3, 15, 3, 18, 3, 3, 4, 5, 4, 6, 4, 7, 4, 8, 4, 10, 4, 11,
    4, 12, 4, 15, 4, 18, 4, 19, 4, 20, 4, 3, 5, 10, 5, 12, 5, 13, 5, 14, 5, 15,
    5, 1, 6, 2, 6, 3, 6, 5, 6, 6, 6, 7, 6, 9, 6, 10, 6, 12, 6, 15, 6, 16, 6, 17,
    6, 18, 6, 5, 7, 12, 7, 15, 7, 18, 7, 2, 8, 3, 8, 4, 8, 5, 8, 7, 8, 8, 8, 9,
    8, 10, 8, 12, 8, 14, 8, 15, 8, 18, 8, 3, 9, 7, 9, 12, 9, 2, 10, 3, 10, 5,
    10, 7, 10, 10, 10, 14, 10, 15, 10, 16, 10, 18, 10, 19, 10, 20, 10, 5, 11, 7,
    11, 10, 11, 12, 11, 14, 11, 18, 11, 2, 12, 3, 12, 7, 12, 8, 12, 9, 12, 10,
    12, 12, 12, 14, 12, 15, 12, 16, 12, 18, 12, 19, 12, 2, 13, 5, 13, 19, 13, 5,
    14, 6, 14, 8, 14, 9, 14, 11, 14,

    12, 14, 13, 14, 14, 14,

    15, 14, 17, 14, 19, 14, 2, 15, 3, 15, 9, 15, 11, 15, 17, 15, 3, 16, 5, 16,
    6, 16, 7, 16, 11, 16, 12, 16, 13, 16, 14, 16, 15, 16, 17, 16, 18, 16, 20,
    16, 3, 17, 5, 17, 9, 17, 3, 18, 5, 18, 7, 18, 8, 18, 9, 18, 11, 18, 13, 18,
    14, 18, 15, 18, 18, 18, 19, 18, 1, 19, 2, 19, 3, 19, 4, 19, 5, 19, 7, 19,
    11, 19, 15, 19, 18, 19, 11, 20, 12, 20, 15, 20, 18, 20,
  ],
];

export let bossMonster = new Monster();
export let blackDoor = new BlackDoor();
export let greenPotionsTotal: number[] = [1, 1, 3];
export let redPotionsTotal: number[] = [0, 0, 1];

function spawn<T extends Monster>(
  coords: [number, number][],
  create: () => T,
  ...extraLists: T[][]
): void {
  coords.forEach(([x, y]) => {
    const specimen = create();
    specimen.pickASpot(x, y);
    monsterList.push(specimen);
    extraLists.forEach(list => list.push(specimen));
  });
}

export function instantiateSetupArrays(): void {
  spawn(currentMap.witches, () => new Witch(), witchList);
  spawn(currentMap.skeletons, () => new Skeleton());
  spawn(currentMap.guards, () => new Guard());
  spawn(currentMap.blackDoor, () => new BlackDoor(), doorList);
  spawn(currentMap.greenDoors, () => new GreenDoor(), doorList);
  spawn(currentMap.redDoors, () => new RedDoor(), doorList);
  spawn(
    currentMap.greenChests,
    () => new GreenChest(),
    greenChestList,
    chestList
  );
  spawn(currentMap.redChests, () => new RedChest(), redChestList, chestList);

  currentMap.boss.forEach(([x, y]) => {
    bossMonster.pickASpot(x, y);
    monsterList.push(bossMonster);
  });

  monsterList.push(blackDoor);
  doorList.push(blackDoor);
}
