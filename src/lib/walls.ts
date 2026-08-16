// Traced off the layout screenshots kept in design/layouts/. Coordinates are in
// those screenshots' own pixel space (1685px wide); the wall scales the whole
// composition to whatever width it is given, so the spacing between photos stays
// exactly as it was drawn. Move a photo by editing its x/y/w/h below.
//
// `crop` is the part of the source the screenshot actually showed. [0, 0, 1, 1]
// means a plain centred cover crop, which is the right default for a photo whose
// framing has not been measured against a screenshot.

export type Tile = {
  src: string;
  /** placement in reference-canvas pixels */
  x: number;
  y: number;
  w: number;
  h: number;
  /** the part of the source photo this frame shows, as [x0, y0, x1, y1] in 0..1 */
  crop: [number, number, number, number];
  /** reveal stagger for tiles that sit side by side, in ms */
  delay: number;
};

export type Label = { text: string; x: number; y: number; w: number; h: number };

/** A frame the screenshot calls for that has no matching photo in public/ yet. */
export type Gap = { x: number; y: number; w: number; h: number };

export type Wall = {
  /** reference canvas the coordinates above are measured in */
  ref: { w: number; h: number };
  tiles: Tile[];
  labels: Label[];
  gaps: Gap[];
};

/* ------------------------------------------------------------------ *
 * Phone layout
 *
 * Held to its drawn proportions on a phone, a wall becomes a postcard of
 * itself: two thirds of these photos land under 120px and the composition's
 * generous margins turn into dead space. So below the md breakpoint the wall
 * reflows — photos that were drawn beside each other stay beside each other,
 * but each group is set as a justified row across the full width.
 *
 * These numbers describe the phone, not the drawing: the wall is 342px wide on
 * a 390px screen, and a photo below MIN_TILE is too small to read.
 * ------------------------------------------------------------------ */
const PHONE_ROW = 342;
const PHONE_GAP = 8;
const MAX_PER_ROW = 3;
const MIN_TILE = 100;
/** three landscape photos across is a 82px-tall strip — too short to read */
const MIN_ROW_H = 100;
/** a lone narrow crop at full width would tower over the screen */
const MAX_ROW_H = 520;

const aspect = (t: Tile) => t.w / t.h;

function rowWidths(tiles: Tile[]): number[] {
  const avail = PHONE_ROW - PHONE_GAP * (tiles.length - 1);
  const sum = tiles.reduce((acc, t) => acc + aspect(t), 0);
  return tiles.map((t) => (avail * aspect(t)) / sum);
}

/** every tile in a justified row shares this height */
function rowHeight(tiles: Tile[]): number {
  return rowWidths(tiles)[0] / aspect(tiles[0]);
}

export type PhoneTile = Tile & { /** share of the row's width, 0..1 */ frac: number };
export type WallRow =
  | { kind: "row"; y: number; tiles: PhoneTile[] }
  | { kind: "label"; y: number; label: Label };

/** Groups a wall's tiles the way the drawing groups them, then splits any group
 *  too wide to read on a phone. Order — and so the desktop DOM — is top to bottom. */
export function wallRows(wall: Wall): WallRow[] {
  // A "band" is one moment in the wall: every tile whose vertical span overlaps.
  const bands: Tile[][] = [];
  let band: Tile[] = [];
  let bottom = -1;
  for (const tile of [...wall.tiles].sort((a, b) => a.y - b.y || a.x - b.x)) {
    if (band.length && tile.y >= bottom) {
      bands.push(band);
      band = [];
      bottom = -1;
    }
    band.push(tile);
    bottom = Math.max(bottom, tile.y + tile.h);
  }
  if (band.length) bands.push(band);

  const rows: WallRow[] = [];
  for (const b of bands) {
    b.sort((a, c) => a.x - c.x || a.y - c.y);

    const packed: Tile[][] = [];
    let current: Tile[] = [];
    for (const tile of b) {
      const trial = [...current, tile];
      const tooSmall =
        Math.min(...rowWidths(trial)) < MIN_TILE || rowHeight(trial) < MIN_ROW_H;
      if (current.length && (trial.length > MAX_PER_ROW || tooSmall)) {
        packed.push(current);
        current = [tile];
      } else {
        current = trial;
      }
    }
    if (current.length) packed.push(current);

    // Splitting can strand a tall narrow crop on its own. Those read as accents
    // in the drawing, not headliners, so put them back beside their neighbour
    // even though it costs them some width.
    for (let i = 0; i < packed.length; i += 1) {
      const row = packed[i];
      if (row.length !== 1 || PHONE_ROW / aspect(row[0]) <= MAX_ROW_H) continue;
      const before = packed[i - 1];
      const after = packed[i + 1];
      if (before && before.length < MAX_PER_ROW) before.push(row[0]);
      else if (after && after.length < MAX_PER_ROW) after.unshift(row[0]);
      else continue;
      packed.splice(i, 1);
      i -= 1;
    }

    for (const row of packed) {
      const widths = rowWidths(row);
      rows.push({
        kind: "row",
        y: Math.min(...row.map((t) => t.y)),
        tiles: row.map((t, i) => ({ ...t, frac: widths[i] / PHONE_ROW })),
      });
    }
  }

  for (const label of wall.labels) rows.push({ kind: "label", y: label.y, label });
  return rows.sort((a, b) => a.y - b.y);
}

export const club: Wall = {
  ref: { w: 1685, h: 10547 },
  tiles: [
    { src: "/club-23.jpg", x: 229, y: 0, w: 1371, h: 770, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/club-14.jpg", x: 525, y: 810, w: 1075, h: 829, crop: [0.108, 0, 0.838, 1], delay: 0 },
    { src: "/club-7.jpg", x: 92, y: 1017, w: 393, h: 622, crop: [0, 0, 0.838, 1], delay: 90 },
    { src: "/club-15.jpg", x: 290, y: 1679, w: 908, h: 588, crop: [0.081, 0, 0.952, 1], delay: 0 },
    { src: "/club-11.jpg", x: 1238, y: 1679, w: 362, h: 588, crop: [0.283, 0, 0.63, 1], delay: 90 },
    { src: "/club-12.jpg", x: 994, y: 2307, w: 606, h: 763, crop: [0.314, 0.138, 0.699, 1], delay: 0 },
    { src: "/club-13.jpg", x: 357, y: 2308, w: 597, h: 762, crop: [0.264, 0, 0.706, 1], delay: 90 },
    { src: "/club-25.jpg", x: 171, y: 3110, w: 301, h: 605, crop: [0.363, 0.08, 0.613, 0.974], delay: 0 },
    { src: "/club-24.jpg", x: 512, y: 3110, w: 1074, h: 605, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/club-20.jpg", x: 221, y: 3755, w: 1366, h: 771, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/club-19.jpg", x: 1112, y: 4566, w: 476, h: 555, crop: [0.25, 0, 0.733, 1], delay: 0 },
    { src: "/club-3.jpg", x: 806, y: 5161, w: 794, h: 1035, crop: [0, 0, 1, 0.98], delay: 0 },
    { src: "/club-21.jpg", x: 220, y: 5162, w: 546, h: 510, crop: [0.182, 0, 0.786, 1], delay: 90 },
    { src: "/club-22.jpg", x: 217, y: 5685, w: 549, h: 511, crop: [0.186, 0, 0.791, 1], delay: 90 },
    { src: "/club-16.jpg", x: 293, y: 6236, w: 410, h: 433, crop: [0.241, 0, 0.774, 1], delay: 0 },
    { src: "/club-17.jpg", x: 743, y: 6236, w: 412, h: 433, crop: [0.251, 0, 0.787, 1], delay: 90 },
    { src: "/club-18.jpg", x: 1195, y: 6236, w: 405, h: 433, crop: [0.236, 0, 0.763, 1], delay: 180 },
    { src: "/club-26.jpg", x: 184, y: 6709, w: 1416, h: 792, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/club-2.jpg", x: 131, y: 7541, w: 710, h: 534, crop: [0, 0, 0.992, 1], delay: 0 },
    { src: "/club-8.jpg", x: 881, y: 7541, w: 719, h: 534, crop: [0, 0.01, 1, 1], delay: 90 },
    { src: "/club-27.webp", x: 128, y: 8115, w: 710, h: 533, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/club-9.jpg", x: 878, y: 8117, w: 722, h: 531, crop: [0, 0.009, 1, 0.99], delay: 90 },
    { src: "/club-6.jpg", x: 883, y: 8854, w: 717, h: 539, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/club-1.jpg", x: 463, y: 9038, w: 391, h: 502, crop: [0, 0, 1, 0.963], delay: 90 },
    { src: "/club-5.jpg", x: 881, y: 9443, w: 719, h: 538, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/club-10.jpg", x: 270, y: 9585, w: 568, h: 943, crop: [0, 0, 0.452, 1], delay: 90 },
    { src: "/club-4.jpg", x: 879, y: 10004, w: 721, h: 543, crop: [0, 0, 1, 1], delay: 90 },
  ],
  labels: [
    { text: "2024-2025", x: 100, y: 8752, w: 320, h: 46 },
  ],
  gaps: [],
};

export const school: Wall = {
  ref: { w: 1685, h: 13535 },
  tiles: [
    { src: "/school-21.jpg", x: 840, y: 102, w: 763, h: 1018, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-4.jpg", x: 180, y: 1160, w: 864, h: 701, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-9.jpg", x: 1084, y: 1160, w: 531, h: 701, crop: [0, 0, 1, 0.992], delay: 0 },
    { src: "/school-7.jpg", x: 111, y: 1901, w: 768, h: 577, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-3.jpg", x: 919, y: 2071, w: 696, h: 488, crop: [0, 0.219, 1, 0.745], delay: 90 },
    { src: "/school-2.jpg", x: 171, y: 2599, w: 493, h: 656, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-5.jpg", x: 704, y: 2599, w: 875, h: 656, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-32.jpg", x: 450, y: 3295, w: 1126, h: 634, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-33.jpg", x: 140, y: 3969, w: 681, h: 738, crop: [0.233, 0, 0.752, 1], delay: 0 },
    { src: "/school-31.jpg", x: 861, y: 3969, w: 734, h: 868, crop: [0.257, 0, 0.732, 1], delay: 90 },
    { src: "/school-10.jpg", x: 1030, y: 4877, w: 572, h: 434, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-22.jpg", x: 180, y: 5013, w: 518, h: 691, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-6.jpg", x: 738, y: 5332, w: 864, h: 648, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-11.jpg", x: 212, y: 6020, w: 790, h: 592, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-23.jpg", x: 1042, y: 6020, w: 560, h: 746, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-34.jpg", x: 763, y: 6806, w: 839, h: 1119, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-17.jpg", x: 78, y: 7965, w: 747, h: 562, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-18.jpg", x: 865, y: 7966, w: 750, h: 561, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-19.jpg", x: 77, y: 8567, w: 748, h: 562, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-20.jpg", x: 865, y: 8567, w: 750, h: 562, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-12.jpg", x: 972, y: 9169, w: 643, h: 484, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-14.jpg", x: 538, y: 9573, w: 391, h: 574, crop: [0, 0, 0.911, 1], delay: 90 },
    { src: "/school-13.jpg", x: 969, y: 9665, w: 646, h: 482, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-16.jpg", x: 63, y: 10187, w: 629, h: 838, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-15.jpg", x: 732, y: 10187, w: 883, h: 1180, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-28.jpg", x: 230, y: 11573, w: 394, h: 704, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-30.jpg", x: 664, y: 11573, w: 951, h: 704, crop: [0, 0.011, 1, 1], delay: 90 },
    { src: "/school-25.jpg", x: 16, y: 12317, w: 1076, h: 807, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-24.jpg", x: 1132, y: 12473, w: 491, h: 651, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-26.jpg", x: 78, y: 13164, w: 494, h: 371, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/school-27.jpg", x: 612, y: 13165, w: 466, h: 370, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/school-29.jpg", x: 1118, y: 13165, w: 497, h: 370, crop: [0, 0, 1, 1], delay: 180 },
  ],
  labels: [
    { text: "2025-2026", x: 100, y: 0, w: 320, h: 46 },
    { text: "2024-2025", x: 100, y: 11471, w: 320, h: 46 },
  ],
  gaps: [],
};

export const asiaCourse: Wall = {
  ref: { w: 1685, h: 8127 },
  tiles: [
    { src: "/asia-course-6.jpg", x: 190, y: 0, w: 1305, h: 1305, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-10.png", x: 169, y: 1345, w: 1075, h: 606, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-11.jpg", x: 1284, y: 1345, w: 302, h: 606, crop: [0.371, 0, 0.652, 1], delay: 90 },
    { src: "/asia-course-5.jpg", x: 35, y: 1991, w: 1551, h: 873, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-4.jpg", x: 439, y: 2904, w: 397, h: 703, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-1.jpg", x: 910, y: 2904, w: 676, h: 483, crop: [0, 0.365, 0.965, 0.882], delay: 90 },
    { src: "/asia-course-12.jpg", x: 876, y: 3414, w: 710, h: 651, crop: [0.212, 0.059, 0.774, 0.973], delay: 90 },
    { src: "/asia-course-14.jpg", x: 191, y: 3627, w: 645, h: 650, crop: [0.216, 0, 0.775, 1], delay: 90 },
    { src: "/asia-course-13.jpg", x: 876, y: 4103, w: 710, h: 398, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/asia-course-3.jpg", x: 222, y: 4541, w: 662, h: 881, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-2.jpg", x: 924, y: 4541, w: 662, h: 881, crop: [0, 0, 1, 1], delay: 90 },
    { src: "/asia-course-7.jpg", x: 658, y: 5462, w: 928, h: 697, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-8.jpg", x: 354, y: 6199, w: 1232, h: 923, crop: [0, 0, 1, 1], delay: 0 },
    { src: "/asia-course-9.jpg", x: 354, y: 7162, w: 1232, h: 965, crop: [0, 0, 1, 1], delay: 0 },
  ],
  labels: [
  ],
  gaps: [],
};
