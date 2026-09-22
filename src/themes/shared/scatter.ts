/** Kis, gyors, seed-elhető PRNG. A Math.random()-mal a dekor minden rendernél más lenne. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ScatterOptions {
  count: number;
  /** Belső és külső sugár — a dekor mérete a ContentBounds-ból jön (terv 6.1). */
  rMin: number;
  rMax: number;
  seed: number;
  /** true → gömbhéj (csillagmező), false → vízszintes gyűrű a talajon (növényzet). */
  shell?: boolean;
  /** A gömbhéj Y-lapítása: 1 = gömb, 0.55 = a PoC csillaghéja, 0 = sík. */
  flattenY?: number;
}

export interface ScatterItem {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  /** 0.7…1.3 — méret-változatosság; a példány magassági eltolása is ezzel skálázódik. */
  scale: number;
  /** Példányonkénti szél-fázis. Enélkül az egész mező EGYÜTT lengene (temak-poc.md 5.3). */
  phase: number;
  /** Két független 0…1 véletlen a hívónak: fajta/szín, illetve fényerő. */
  variant: number;
  jitter: number;
}

export function scatter({
  count,
  rMin,
  rMax,
  seed,
  shell = false,
  flattenY = 1,
}: ScatterOptions): ScatterItem[] {
  const rnd = mulberry32(seed);
  const items: ScatterItem[] = [];

  for (let i = 0; i < count; i += 1) {
    const angle = rnd() * Math.PI * 2;
    // sqrt-eloszlás: egyenletes rnd()-vel a pontok a belső sugár körül torlódnának
    const radius = rMin + (rMax - rMin) * Math.sqrt(rnd());
    const elevation = shell ? (rnd() - 0.5) * Math.PI : 0;
    const horizontal = radius * Math.cos(elevation);

    items.push({
      x: Math.cos(angle) * horizontal,
      y: shell ? Math.sin(elevation) * radius * flattenY : 0,
      z: Math.sin(angle) * horizontal,
      rotationY: rnd() * Math.PI * 2,
      scale: 0.7 + rnd() * 0.6,
      phase: rnd() * Math.PI * 2,
      variant: rnd(),
      jitter: rnd(),
    });
  }

  return items;
}
