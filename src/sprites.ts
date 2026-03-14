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
  'greenKey',
  'redKey',
  'pButton',
  'pdButton',
  'axe',
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
