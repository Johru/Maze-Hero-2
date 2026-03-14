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
import { monsterLevel } from './variables';

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
.....#R.#.#....
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
.####.####.#r##..#..
.R#...#.T..#...T.###
.##.#.#..#...###.###
.Sr.#.#R.#.#.#G..#G.
.##...####.#.###.##.
.#..#.....S..T....#.
....##.##.#####.#.#r
g##.....#.#G.Tr.#..T
..#.###...#####T##.#
..#S#...#...T.......
W.#G#.###.#.###..##K
#####.#...#.TR#..#..
RS........##..#..#.b
    `),
];

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
  const currentLevel = monsterLevel - 1;
  const currentMap = mapsLayout[currentLevel];
  wallPositionList = [...currentMap.walls];
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
