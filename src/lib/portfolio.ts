import { sections } from "./links";
import { asiaCourse, club, school, type Wall } from "./walls";

export type Category = {
  slug: string;
  index: string;
  title: string;
  /** one entry per paragraph in the sticky rail */
  blurb: string[];
  wall: Wall;
};

const walls: Record<string, Wall> = {
  club,
  school,
  "asia-course": asiaCourse,
};

const blurbs: Record<string, string[]> = {
  club: [
    "Since 2022, I have worked to lead a friendly space of personalized tools, workshops and sales for students interested in pottery. In 2026, we raised $279.50 by refining and vending abandoned pottery pieces accumulated from the club and classes as a donation to the BC Children’s Hospital Foundation. I value teaching beginners handbuilding and wheeling techniques, designing our promotional posters and allocating budgets in order to create a welcoming, expressive and flexible space for students wanting to expand and exceed past rigid assignment rubrics, like I did myself.",
    "Our club materials consist of low fire Plainsman L210/L212 stoneware clay bodies, and fresh Mayco glazes to pair. Though sometimes I have the courage to use some discontinued Duncan sloshes as well. I find experimenting with our limited selection very rewarding!",
  ],
  school: [
    "3D Studio Design — taken in grade 10 and 11. Final grades both 98%.",
    "In these two years of formatted courses, I have developed refinement in my documentation, use of techniques, and materials, as well as gained independence in continuously working through initial designs, construction issues, and kiln management. This year especially, I focused on incorporating wheeled pieces into skills I learned in the past.",
    "This coming semester, I hope to explore my limits by throwing upsized pieces and participating more often in the reclaim procedures. All while continuing to learn from others and applying new techniques.",
  ],
  "asia-course": [
    "This course is the foundation of my wheeling skills. I spent two weeks driving into the mountains of Hunan where they taught us the history of pottery, throwing techniques and glazing methods. My first 4 hours were spent centering pieces of clay.",
  ],
};

/** Slug and title come from lib/links.ts, which the navbar reads too. */
export const categories: Category[] = sections.map(({ slug, title }, i) => ({
  slug,
  title,
  index: String(i + 1).padStart(2, "0"),
  blurb: blurbs[slug],
  wall: walls[slug],
}));
