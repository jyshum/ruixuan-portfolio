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

export const club: Wall = {
  ref: { w: 1685, h: 10771 },
  tiles: [
    { src: "/club-23.jpg", x: 229, y: 0, w: 1371, h: 770, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-14.jpg", x: 525, y: 823, w: 1075, h: 829, crop: [0.108, 0.0, 0.838, 1.0], delay: 0 },
    { src: "/club-7.jpg", x: 100, y: 1030, w: 393, h: 622, crop: [0.0, 0.0, 0.838, 1.0], delay: 90 },
    { src: "/club-15.jpg", x: 296, y: 1675, w: 908, h: 588, crop: [0.081, 0.0, 0.952, 1.0], delay: 0 },
    { src: "/club-11.jpg", x: 1238, y: 1675, w: 362, h: 588, crop: [0.283, 0.0, 0.63, 1.0], delay: 90 },
    { src: "/club-12.jpg", x: 994, y: 2296, w: 606, h: 763, crop: [0.314, 0.138, 0.699, 1.0], delay: 0 },
    { src: "/club-13.jpg", x: 375, y: 2297, w: 597, h: 762, crop: [0.264, 0.0, 0.706, 1.0], delay: 90 },
    { src: "/club-25.jpg", x: 181, y: 3108, w: 301, h: 605, crop: [0.363, 0.08, 0.613, 0.974], delay: 0 },
    { src: "/club-24.jpg", x: 512, y: 3108, w: 1074, h: 605, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/club-20.jpg", x: 221, y: 3780, w: 1366, h: 771, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-19.jpg", x: 1112, y: 4578, w: 476, h: 555, crop: [0.25, 0.0, 0.733, 1.0], delay: 0 },
    { src: "/club-3.jpg", x: 806, y: 5184, w: 794, h: 1035, crop: [0.0, 0.0, 1.0, 0.98], delay: 0 },
    { src: "/club-21.jpg", x: 235, y: 5185, w: 546, h: 510, crop: [0.182, 0.0, 0.786, 1.0], delay: 90 },
    { src: "/club-22.jpg", x: 232, y: 5708, w: 549, h: 511, crop: [0.186, 0.0, 0.791, 1.0], delay: 90 },
    { src: "/club-16.jpg", x: 342, y: 6345, w: 410, h: 433, crop: [0.241, 0.0, 0.774, 1.0], delay: 0 },
    { src: "/club-17.jpg", x: 768, y: 6345, w: 412, h: 433, crop: [0.251, 0.0, 0.787, 1.0], delay: 90 },
    { src: "/club-18.jpg", x: 1195, y: 6345, w: 405, h: 433, crop: [0.236, 0.0, 0.763, 1.0], delay: 180 },
    { src: "/club-26.jpg", x: 184, y: 6886, w: 1416, h: 792, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-2.jpg", x: 140, y: 7721, w: 710, h: 534, crop: [0.0, 0.0, 0.992, 1.0], delay: 0 },
    { src: "/club-8.jpg", x: 881, y: 7721, w: 719, h: 534, crop: [0.0, 0.01, 1.0, 1.0], delay: 90 },
    { src: "/club-9.jpg", x: 878, y: 8281, w: 722, h: 531, crop: [0.0, 0.009, 1.0, 0.99], delay: 0 },
    { src: "/club-6.jpg", x: 883, y: 9078, w: 717, h: 539, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/club-1.jpg", x: 463, y: 9262, w: 391, h: 502, crop: [0.0, 0.0, 1.0, 0.963], delay: 90 },
    { src: "/club-5.jpg", x: 881, y: 9667, w: 719, h: 538, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/club-10.jpg", x: 270, y: 9809, w: 568, h: 943, crop: [0.0, 0.0, 0.452, 1.0], delay: 90 },
    { src: "/club-4.jpg", x: 879, y: 10228, w: 721, h: 543, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
  ],
  labels: [
    { text: "2024-2025", x: 645, y: 9210, w: 137, h: 24 },
  ],
  gaps: [
    { x: 139, y: 8279, w: 710, h: 533 },
  ],
};

export const school: Wall = {
  ref: { w: 1685, h: 14293 },
  tiles: [
    { src: "/school-21.jpg", x: 840, y: 44, w: 763, h: 1018, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-4.jpg", x: 643, y: 1104, w: 972, h: 789, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-9.jpg", x: 915, y: 1915, w: 700, h: 923, crop: [0.0, 0.0, 1.0, 0.992], delay: 0 },
    { src: "/school-7.jpg", x: 117, y: 2696, w: 768, h: 577, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-3.jpg", x: 919, y: 2866, w: 696, h: 488, crop: [0.0, 0.219, 1.0, 0.745], delay: 90 },
    { src: "/school-2.jpg", x: 180, y: 3389, w: 493, h: 656, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-5.jpg", x: 704, y: 3389, w: 875, h: 656, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-32.jpg", x: 450, y: 4079, w: 1126, h: 634, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-33.jpg", x: 160, y: 4744, w: 681, h: 738, crop: [0.233, 0.0, 0.752, 1.0], delay: 0 },
    { src: "/school-31.jpg", x: 861, y: 4744, w: 734, h: 868, crop: [0.257, 0.0, 0.732, 1.0], delay: 90 },
    { src: "/school-10.jpg", x: 1030, y: 5686, w: 572, h: 434, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-22.jpg", x: 188, y: 5822, w: 518, h: 691, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-6.jpg", x: 738, y: 6141, w: 864, h: 648, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-11.jpg", x: 221, y: 6804, w: 790, h: 592, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-23.jpg", x: 1042, y: 6804, w: 560, h: 746, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-34.jpg", x: 763, y: 7573, w: 839, h: 1119, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-17.jpg", x: 97, y: 8740, w: 747, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-18.jpg", x: 865, y: 8741, w: 750, h: 561, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-19.jpg", x: 97, y: 9321, w: 748, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-20.jpg", x: 865, y: 9321, w: 750, h: 562, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-12.jpg", x: 972, y: 9923, w: 643, h: 484, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-14.jpg", x: 555, y: 10327, w: 391, h: 574, crop: [0.0, 0.0, 0.911, 1.0], delay: 90 },
    { src: "/school-13.jpg", x: 969, y: 10419, w: 646, h: 482, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-16.jpg", x: 75, y: 10922, w: 629, h: 838, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-15.jpg", x: 732, y: 10922, w: 883, h: 1180, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-28.jpg", x: 270, y: 12328, w: 394, h: 704, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-30.jpg", x: 664, y: 12328, w: 951, h: 704, crop: [0.0, 0.011, 1.0, 1.0], delay: 90 },
    { src: "/school-25.jpg", x: 16, y: 13059, w: 1076, h: 807, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-24.jpg", x: 1124, y: 13215, w: 491, h: 651, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-26.jpg", x: 111, y: 13922, w: 494, h: 371, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/school-27.jpg", x: 631, y: 13923, w: 466, h: 370, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/school-29.jpg", x: 1118, y: 13923, w: 497, h: 370, crop: [0.0, 0.0, 1.0, 1.0], delay: 180 },
  ],
  labels: [
    { text: "2025-2026", x: 189, y: 0, w: 211, h: 47 },
    { text: "2024-2025", x: 158, y: 12193, w: 277, h: 73 },
  ],
  gaps: [],
};

export const asiaCourse: Wall = {
  ref: { w: 1685, h: 8256 },
  tiles: [
    { src: "/asia-course-6.jpg", x: 103, y: 0, w: 1305, h: 1172, crop: [0.034, 0.118, 0.883, 0.881], delay: 0 },
    { src: "/asia-course-10.png", x: 180, y: 1398, w: 1075, h: 606, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-11.jpg", x: 1284, y: 1398, w: 302, h: 606, crop: [0.371, 0.0, 0.652, 1.0], delay: 90 },
    { src: "/asia-course-5.jpg", x: 35, y: 2066, w: 1551, h: 873, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-4.jpg", x: 439, y: 3001, w: 397, h: 703, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-1.jpg", x: 910, y: 3001, w: 676, h: 483, crop: [0.0, 0.365, 0.965, 0.882], delay: 90 },
    { src: "/asia-course-12.jpg", x: 876, y: 3511, w: 710, h: 651, crop: [0.212, 0.059, 0.774, 0.973], delay: 90 },
    { src: "/asia-course-14.jpg", x: 191, y: 3724, w: 645, h: 650, crop: [0.216, 0.0, 0.775, 1.0], delay: 90 },
    { src: "/asia-course-13.jpg", x: 876, y: 4200, w: 710, h: 398, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/asia-course-3.jpg", x: 227, y: 4631, w: 662, h: 881, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-2.jpg", x: 924, y: 4631, w: 662, h: 881, crop: [0.0, 0.0, 1.0, 1.0], delay: 90 },
    { src: "/asia-course-7.jpg", x: 658, y: 5582, w: 928, h: 697, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-8.jpg", x: 354, y: 6314, w: 1232, h: 923, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
    { src: "/asia-course-9.jpg", x: 354, y: 7291, w: 1232, h: 965, crop: [0.0, 0.0, 1.0, 1.0], delay: 0 },
  ],
  labels: [
  ],
  gaps: [
  ],
};
