import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import { mulberry32 } from './scatter';

/**
 * Node-környezetben (Vitest) nincs `document`. A gyárak ilyenkor null-t adnak, a hívó
 * komponensek pedig textúra nélkül is renderelhetők — így a themes/ modulok importálhatók
 * maradnak tesztből is (04-terv-v2.md 9., teszt-környezeti előfeltétel).
 */
function createContext(size: number): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas.getContext('2d');
}

function toTexture(ctx: CanvasRenderingContext2D): CanvasTexture {
  const texture = new CanvasTexture(ctx.canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * Csillag- és pollen-sprite. A gradiens-megállók a PoC-ból: szűk mag + hosszan elhaló haló.
 * Emiatt lehet a sprite MÉRETE nagyobb, mint amekkorának a csillag látszik — és emiatt szűnt
 * meg a „kockás csillag" panasz a textúra nélküli PointsMaterial helyett (temak-poc.md 5.1).
 */
export function makeStarTexture(): Texture | null {
  const ctx = createContext(64);
  if (!ctx) return null;

  // A csillagmező pontjai gyakran csak 2-4px-esek a nagy kameratávolság miatt — a szűk
  // (0.16-os) mag ilyenkor a felbontás alá esik és a csillag "eltűnik". A tágabb, fényesebb
  // mag garantálja, hogy a sprite kis méretben is opak pixelt adjon, nem csak halvány ködöt.
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.32, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.35)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return toTexture(ctx);
}

/** Fake kontaktárnyék: radiális fekete folt. „Leteszi" a tárgyat a földre shadow map nélkül. */
export function makeShadowTexture(): Texture | null {
  const ctx = createContext(128);
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)');
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.28)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  return toTexture(ctx);
}

const GROUND_SIZE = 256;
const GROUND_PATCHES = 1100;

/** Talaj-noise: ~1100 folt három árnyalatban. A PoC leglátványosabb egyetlen javítása. */
export function makeGroundTexture(colors: readonly string[], seed = 7): Texture | null {
  const ctx = createContext(GROUND_SIZE);
  if (!ctx) return null;

  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, GROUND_SIZE, GROUND_SIZE);

  const rnd = mulberry32(seed);
  for (let i = 0; i < GROUND_PATCHES; i += 1) {
    const x = rnd() * GROUND_SIZE;
    const y = rnd() * GROUND_SIZE;
    const radius = 1.5 + rnd() * 4.5;
    ctx.fillStyle = colors[1 + Math.floor(rnd() * (colors.length - 1))];

    // a csempehatáron átlógó foltot a szemközti oldalon is kirajzoljuk, különben
    // a RepeatWrapping 16x16-os ismétlésénél látszana a varrat
    for (const dx of [-GROUND_SIZE, 0, GROUND_SIZE]) {
      for (const dy of [-GROUND_SIZE, 0, GROUND_SIZE]) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = toTexture(ctx);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

/** Ég-kupola függőleges gradiense. A gömb UV-jén v = 1 a zenit, ez a canvas TETEJE. */
export function makeSkyTexture(zenith: string, horizon: string): Texture | null {
  const ctx = createContext(64);
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, zenith);
  gradient.addColorStop(0.7, horizon);
  gradient.addColorStop(1, horizon);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return toTexture(ctx);
}
