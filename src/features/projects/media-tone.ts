export type MediaTone = 0 | 1 | 2;

/** Picks one of three accent pairings for a project without a picture, stable per id. */
export const mediaTone = (id: string): MediaTone => (id.length % 3) as MediaTone;
