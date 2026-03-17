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

export function parseLevel(layout: string): ParsedLevel {
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

export const mapLayout = [
  parseLevel(`
..#.gS.##G
.##.##.#..
.....#g#.S
.###.#....
.#.#.#.###
.#.#...#S.
.....#....
##.....#g#
....####..
.G#W...#Kb
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
G.#..#.....#Kgb
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
.R#...#.T..#...T....
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
