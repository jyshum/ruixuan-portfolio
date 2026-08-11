import { asiaCourse, club, school, type Photo } from "./photos";

export type Tile = Photo & { ar: number };

/**
 * The 16:9 frames are all the same studio setup — one small vessel centred on a
 * cream backdrop with a lot of air around it. Shown at native width the piece
 * ends up thumbnail-sized, so those get cropped to a portrait frame. Everything
 * else is a fuller composition and keeps close to its own proportions.
 */
const STUDIO_AR = 1.7;
const PORTRAIT_CROP = 0.8;

function displayAspect({ w, h }: Photo): number {
  const native = w / h;
  if (native >= STUDIO_AR) return PORTRAIT_CROP;
  return Math.min(Math.max(native, 0.7), 1.4);
}

/**
 * Greedy justified rows, the way a print contact sheet is set: fill a row until
 * its combined aspect ratio hits the target, then let flexbox size every tile
 * so the row is flush on both edges and all tiles share one height.
 *
 * Cycling the target keeps the wall from marching along at one fixed height.
 */
const TARGETS = [2.45, 2.9, 2.6];

export function justify(photos: Photo[]): Tile[][] {
  const tiles: Tile[] = photos.map((p) => ({ ...p, ar: displayAspect(p) }));
  const rows: Tile[][] = [];
  let row: Tile[] = [];
  let sum = 0;
  let n = 0;

  for (const tile of tiles) {
    const target = TARGETS[n % TARGETS.length];
    row.push(tile);
    sum += tile.ar;
    if (sum < target) continue;

    // Closer to the target with this tile, or without it?
    const withTile = sum - target;
    const withoutTile = target - (sum - tile.ar);
    if (row.length > 1 && withTile > withoutTile) {
      row.pop();
      rows.push(row);
      n += 1;
      row = [tile];
      sum = tile.ar;
    } else {
      rows.push(row);
      n += 1;
      row = [];
      sum = 0;
    }
  }
  if (row.length) rows.push(row);
  return rows;
}

/**
 * The trailing row holds whatever is left over and would be stretched to an
 * absurd height by the flex sizing. Reporting the shortfall as a spacer keeps
 * it at the height of the rows above it. Only ever the last row — a short row
 * mid-wall is the packer working, and it should still run flush to both edges.
 */
export function lastRowSpacer(row: Tile[], index: number): number {
  const target = TARGETS[index % TARGETS.length];
  const sum = row.reduce((acc, t) => acc + t.ar, 0);
  return sum < target * 0.85 ? target - sum : 0;
}

export type Category = {
  slug: string;
  index: string;
  title: string;
  blurb: string;
  photos: Photo[];
};

export const categories: Category[] = [
  {
    slug: "club",
    index: "01",
    title: "Club",
    blurb:
      "Placeholder — a sentence on the club work, the forms, the glazes used.",
    photos: club,
  },
  {
    slug: "school",
    index: "02",
    title: "School",
    blurb:
      "Placeholder — a sentence on the school pieces and what they were exploring.",
    photos: school,
  },
  {
    slug: "asia-course",
    index: "03",
    title: "Asia Course",
    blurb:
      "Placeholder — a sentence on what this body of work is and when it was made.",
    photos: asiaCourse,
  },
];
