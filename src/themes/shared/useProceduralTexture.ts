import { useEffect, useMemo } from 'react';
import type { Texture } from 'three';

/**
 * Eljárásos textúra témánként KÜLÖN példánnyal, garantált felszabadítással.
 *
 * A PoC-ban a csillag- és árnyék-textúrát több anyag OSZTOTTA, és a témaváltáskori
 * dispose() a még használatban lévő példányt is felszabadította — néma hiba, csak a
 * látvány tűnt el (temak-poc.md 6.1). Itt minden hívás saját textúrát kap, és a
 * felszabadítás pontosan akkor történik, amikor a hívó komponens lekerül a fáról.
 */
export function useProceduralTexture(
  factory: () => Texture | null,
  deps: unknown[] = [],
): Texture | null {
  // a deps tömb dinamikus, ezért a lint-szabály itt nem tud ellenőrizni — szándékos
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  const texture = useMemo(factory, deps);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}
