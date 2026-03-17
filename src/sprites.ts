const SPRITE_IDS = [
  'floor',
  'wall',
  'hero-up',
  'hero-down',
  'hero-left',
  'hero-right',
  'skeleton',
  'boss',
  'blood',
  'key',
  'youdied',
  'potion',
  'blackDoor',
  'doorOpen',
  'guard',
  'witch',
  'greenDoor',
  'greenDoorOpen',
  'greenChest',
  'greenChestOpen',
  'redDoor',
  'redDoorOpen',
  'redChest',
  'redChestOpen',
  'greenkey',
  'redkey',
  'pButton',
  'pdButton',
  'square',
  'space',
  'spaced',
  'up',
  'upd',
  'down',
  'downd',
  'left',
  'leftd',
  'right',
  'rightd',
  'escape',
  'escaped',
  'pause',
  'unpause',
  'sword',
  'heartframe',
  'heartfill',
  'heartmask',
  'inner-corner-left-top',
  'inner-corner-right-top',
  'inner-corner-left-bottom',
  'inner-corner-right-bottom',
  'outer-corner-left-top',
  'outer-corner-right-top',
  'outer-corner-left-bottom',
  'outer-corner-right-bottom',
  'outer-edge-top',
  'outer-edge-bottom',
  'outer-edge-left',
  'outer-edge-right',
  'inner-edge-top',
  'inner-edge-bottom',
  'inner-edge-left',
  'inner-edge-right',
  'innerbackground',
  'outerbackground',
  'ornamentshield',
  'square-frame',
  'overkill-off-small',
  'overkill-off-medium',
  'overkill-off-large',
  'overkill-on-large',
  'overkill-on-medium',
  'overkill-on-small',
  'gold',
  'score',
  'sword2',
  'sword3',
  'bluekey',
] as const;

export type SpriteName = typeof SPRITE_IDS[number];

export const sprites: Record<SpriteName, HTMLImageElement> = {} as Record<
  SpriteName,
  HTMLImageElement
>;

export function loadSprites(): Promise<void[]> {
  const failed: string[] = [];

  return Promise.all(
    SPRITE_IDS.map(
      id =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            sprites[id] = img;
            resolve();
          };
          img.onerror = () => {
            failed.push(id);
            resolve();
          };
          img.src = `img/${id.toLowerCase()}.png`;
        })
    )
  ).then(result => {
    if (failed.length > 0) {
      console.warn('Failed to load sprites:', failed);
    }
    return result;
  });
}

export function getSprite(name: SpriteName): HTMLImageElement {
  const sprite = sprites[name];
  if (!sprite) {
    throw new Error(
      `Sprite not loaded: "${name}" — check SPRITE_IDS and your img/ folder`
    );
  }
  return sprite;
}
