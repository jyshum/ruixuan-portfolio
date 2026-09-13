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
  /** index into the wall's `pieces`. Several photos of one object share it, so
   *  every angle of a piece shows the same caption. */
  piece: number;
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
  /** one caption per object, in the order the wall reaches them */
  pieces: string[];
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
  ref: { w: 1685, h: 10238 },
  pieces: [
    "Wheel-thrown Vase + Handbuilt Ripples · Low-fire L210 · Mayco EL129 Slate",
    "Explored glaze combos (Mayco EL119 Burnished Steel, PC602 White Cascade, EL129 Slate, +2?) · Wheel-thrown Set",
    "Rippled Orchid Vase · dropped on the floor · Obscure underglaze (blue) + Mayco FN202 Yadro",
    "Sgraffito Cup · Spectrum 515 Black Underglaze · Wheel-thrown · carved while leather hard",
    "Miffy Dupe · Handbuilt (L212) · obscure Duncan glaze",
    "Plum & Petal Bowl · Wheel-thrown · Spectrum 1134 Chocolate + Mayco FN234 Royal Purple, PC602 White Cascade (petal detailing inside)",
    "Glaze combo Moon Jar · first successful moon jar! · Mayco FN234 Royal Purple, EL119 Burnished Steel, EL129 Slate, FN202 Yadro, FN039 Light Gray",
    "Clubs Day, works in progress & BCCHF Fundraiser",
    "Coiled Matcha Vessel · Duncan TM305 + Mayco FN001 White Glaze · reclaim (L210 + L212)",
    "Rippled Set · Handbuilt Cup and Bowl (L212) · Mayco FN009 Black",
    "Oyster Trinket Holder · Spectrum 726 Ivory + Mayco FN039 Light Gray, FN009 Black",
  ],
  tiles: [
    { src: "/club-23.jpg", piece: 0, x: 229, y: 0, w: 1371, h: 770, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-14.jpg", piece: 1, x: 525, y: 823, w: 1075, h: 829, crop: [0.108, 0.0, 0.838, 1.0], delay: 0 },
    { src: "/club-7.jpg", piece: 1, x: 100, y: 1030, w: 393, h: 622, crop: [0.0, 0.0, 0.838, 1.0], delay: 90 },
    { src: "/club-15.jpg", piece: 1, x: 296, y: 1675, w: 908, h: 588, crop: [0.081, 0.0, 0.952, 1.0], delay: 0 },
    { src: "/club-11.jpg", piece: 1, x: 1238, y: 1675, w: 362, h: 588, crop: [0.283, 0.0, 0.63, 1.0], delay: 90 },
    { src: "/club-12.jpg", piece: 1, x: 994, y: 2296, w: 606, h: 763, crop: [0.314, 0.138, 0.699, 1.0], delay: 0 },
    { src: "/club-13.jpg", piece: 1, x: 375, y: 2297, w: 597, h: 762, crop: [0.264, 0.0, 0.706, 1.0], delay: 90 },
    { src: "/club-25.jpg", piece: 2, x: 181, y: 3108, w: 301, h: 605, crop: [0.363, 0.08, 0.613, 0.974], delay: 0 },
    { src: "/club-24.jpg", piece: 2, x: 512, y: 3108, w: 1088, h: 605, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/club-20.jpg", piece: 3, x: 221, y: 3780, w: 1379, h: 771, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-19.jpg", piece: 3, x: 1124, y: 4578, w: 476, h: 555, crop: [0.25, 0.0, 0.733, 1.0], delay: 0 },
    { src: "/club-21.jpg", piece: 4, x: 475, y: 5175, w: 546, h: 510, crop: [0.182, 0.0, 0.786, 1.0], delay: 0 },
    { src: "/club-22.jpg", piece: 4, x: 1051, y: 5175, w: 549, h: 511, crop: [0.186, 0.0, 0.791, 1.0], delay: 90 },
    { src: "/club-16.jpg", piece: 5, x: 342, y: 5812, w: 410, h: 433, crop: [0.241, 0.0, 0.774, 1.0], delay: 0 },
    { src: "/club-17.jpg", piece: 5, x: 768, y: 5812, w: 412, h: 433, crop: [0.251, 0.0, 0.787, 1.0], delay: 90 },
    { src: "/club-18.jpg", piece: 5, x: 1195, y: 5812, w: 405, h: 433, crop: [0.236, 0.0, 0.763, 1.0], delay: 180 },
    { src: "/club-26.jpg", piece: 6, x: 184, y: 6353, w: 1416, h: 792, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-2.jpg", piece: 7, x: 140, y: 7188, w: 710, h: 534, crop: [0.0, 0.0, 0.992, 1.0], delay: 0 },
    { src: "/club-8.jpg", piece: 7, x: 881, y: 7188, w: 719, h: 534, crop: [0.0, 0.01, 1.0, 1.0], delay: 90 },
    { src: "/club-27.webp", piece: 7, x: 139, y: 7746, w: 710, h: 533, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-9.jpg", piece: 7, x: 878, y: 7748, w: 722, h: 531, crop: [0.0, 0.009, 1.0, 0.99], delay: 90 },
    { src: "/club-6.jpg", piece: 8, x: 883, y: 8545, w: 717, h: 539, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-1.jpg", piece: 8, x: 463, y: 8729, w: 391, h: 502, crop: [0.0, 0.0, 1.0, 0.963], delay: 90 },
    { src: "/club-5.jpg", piece: 9, x: 881, y: 9134, w: 719, h: 538, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/club-10.jpg", piece: 7, x: 270, y: 9276, w: 568, h: 943, crop: [0.0, 0.0, 0.452, 1.0], delay: 90 },
    { src: "/club-4.jpg", piece: 10, x: 879, y: 9695, w: 721, h: 543, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
  ],
  labels: [
    { text: "2025-2026", x: 189, y: 775, w: 300, h: 47 },
    { text: "2024-2025", x: 189, y: 8556, w: 300, h: 47 },
  ],
  gaps: [],
};

export const school: Wall = {
  ref: { w: 1685, h: 13460 },
  pieces: [
    "Stamp Prototypes · includes initials, period and design · explored handles, carving and sculpting",
    "Doubled Orchid Cups · sketch → bisqueware → glazed → glazeware · trimmed to fit · Handbuilt floral and handle",
    "Non-functional Kitchen Tiles · wave design · used an array of blue/gray Mayco glazes",
    "Twin Swans · from sketch to final · Handbuilt (L212) · Underglaze details (Spectrum)",
    "Rose Vessel · Wheeled base · Mayco FN202 Yadro",
    "Trinket Holder · Spectrum 726 Ivory + Duncan TM305",
    "Teapot · unknown Duncan glaze ran and stuck to kiln shelf",
    "Fishy Pinch Pots · Spectrum underglazes",
  ],
  tiles: [
    { src: "/school-21.jpg", piece: 0, x: 840, y: 44, w: 760, h: 1018, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-4.jpg", piece: 1, x: 20, y: 1082, w: 850, h: 701, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-9.jpg", piece: 1, x: 915, y: 1082, w: 685, h: 923, crop: [0.0, 0.0, 1.0, 0.992], delay: 0 },
    { src: "/school-7.jpg", piece: 1, x: 117, y: 1863, w: 768, h: 577, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-3.jpg", piece: 1, x: 919, y: 2033, w: 681, h: 488, crop: [0.0, 0.219, 1.0, 0.745], delay: 90 },
    { src: "/school-2.jpg", piece: 1, x: 180, y: 2556, w: 493, h: 656, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-5.jpg", piece: 1, x: 704, y: 2556, w: 896, h: 656, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-32.jpg", piece: 1, x: 450, y: 3246, w: 1150, h: 634, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-33.jpg", piece: 1, x: 160, y: 3911, w: 681, h: 738, crop: [0.233, 0.0, 0.752, 1.0], delay: 0 },
    { src: "/school-31.jpg", piece: 1, x: 861, y: 3911, w: 739, h: 868, crop: [0.257, 0.0, 0.732, 1.0], delay: 90 },
    { src: "/school-10.jpg", piece: 2, x: 1030, y: 4853, w: 570, h: 434, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-22.jpg", piece: 2, x: 188, y: 4989, w: 518, h: 691, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-6.jpg", piece: 2, x: 738, y: 5308, w: 862, h: 648, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-11.jpg", piece: 2, x: 221, y: 5971, w: 790, h: 592, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-23.jpg", piece: 2, x: 1042, y: 5971, w: 558, h: 746, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-34.jpg", piece: 2, x: 763, y: 6740, w: 837, h: 1119, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-17.jpg", piece: 3, x: 97, y: 7907, w: 747, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-18.jpg", piece: 3, x: 865, y: 7908, w: 735, h: 561, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-19.jpg", piece: 3, x: 97, y: 8488, w: 748, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-20.jpg", piece: 3, x: 865, y: 8488, w: 735, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-12.jpg", piece: 4, x: 972, y: 9090, w: 628, h: 484, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-14.jpg", piece: 4, x: 555, y: 9494, w: 391, h: 574, crop: [0.0, 0.0, 0.911, 1.0], delay: 90 },
    { src: "/school-13.jpg", piece: 4, x: 969, y: 9586, w: 631, h: 482, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-16.jpg", piece: 4, x: 75, y: 10089, w: 629, h: 838, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-15.jpg", piece: 4, x: 732, y: 10089, w: 868, h: 1180, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-28.jpg", piece: 5, x: 270, y: 11495, w: 394, h: 704, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-30.jpg", piece: 5, x: 664, y: 11495, w: 936, h: 704, crop: [0.0, 0.011, 1.0, 1.0], delay: 90 },
    { src: "/school-25.jpg", piece: 6, x: 16, y: 12226, w: 1076, h: 807, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-24.jpg", piece: 6, x: 1124, y: 12382, w: 476, h: 651, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-26.jpg", piece: 7, x: 111, y: 13089, w: 494, h: 371, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-27.jpg", piece: 7, x: 631, y: 13090, w: 466, h: 370, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-29.jpg", piece: 7, x: 1118, y: 13090, w: 482, h: 370, crop: [0.0, 0.0, 1.0, 1.0], delay: 180 },
  ],
  labels: [
    { text: "2025-2026", x: 189, y: 1020, w: 300, h: 47 },
    { text: "2024-2025", x: 189, y: 11282, w: 466, h: 73 },
  ],
  gaps: [],
};

export const asiaCourse: Wall = {
  ref: { w: 1685, h: 6860 },
  pieces: [
    "Sketch made in Procreate · completed all but moon jar",
    "Rippled Vase · Medium fire clay + Clear glaze (air-brushed)",
    "Works in progress",
    "Porcelain Vase · Cascading Vase · Orchid Trinket Box · all wheeled",
    "Fishy Keepsake Box · Handbuilt · textured wave surface · underglaze + airbrushed clear glaze",
    "Cascading Vase · Wheel-thrown base · altered form · metallic glaze",
    "Practiced forms on the wheel",
    "Ankylosaurus Pencil Case · underglaze + airbrushed clear coat",
    "Small glaze test bowls",
  ],
  tiles: [
    // the sketch that used to open the wall is gone; the vase pair now leads
    { src: "/asia-course-10.png", piece: 1, x: 180, y: 0, w: 1075, h: 606, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-11.jpg", piece: 1, x: 1284, y: 0, w: 316, h: 606, crop: [0.371, 0.0, 0.652, 1.0], delay: 90 },
    // bowls (new) + the wheel-practice photo, relocated up from further down the wall
    { src: "/asia-course-15.jpg", piece: 8, x: 180, y: 700, w: 660, h: 660, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-7.jpg", piece: 6, x: 870, y: 700, w: 730, h: 540, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/asia-course-5.jpg", piece: 2, x: 35, y: 1422, w: 1565, h: 873, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-4.jpg", piece: 4, x: 439, y: 2357, w: 397, h: 703, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-1.jpg", piece: 3, x: 910, y: 2357, w: 690, h: 483, crop: [0.0, 0.365, 0.965, 0.882], delay: 90 },
    { src: "/asia-course-12.jpg", piece: 4, x: 876, y: 2867, w: 724, h: 651, crop: [0.212, 0.059, 0.774, 0.973], delay: 90 },
    { src: "/asia-course-14.jpg", piece: 4, x: 191, y: 3080, w: 645, h: 650, crop: [0.216, 0.0, 0.775, 1.0], delay: 90 },
    { src: "/asia-course-13.jpg", piece: 4, x: 876, y: 3556, w: 724, h: 398, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/asia-course-3.jpg", piece: 5, x: 227, y: 3987, w: 662, h: 881, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-2.jpg", piece: 5, x: 924, y: 3987, w: 676, h: 881, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/asia-course-8.jpg", piece: 7, x: 354, y: 4918, w: 1246, h: 923, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-9.jpg", piece: 7, x: 354, y: 5895, w: 1246, h: 965, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
  ],
  labels: [
    { text: "Summer 2025", x: 189, y: 630, w: 389, h: 47 },
  ],
  gaps: [
  ],
};
