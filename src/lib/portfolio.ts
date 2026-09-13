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
    "Since 2022, I have worked to lead a friendly space of personalized tools, workshops and sales for students interested in pottery. I value teaching beginners handbuilding and wheeling techniques, designing our promotional posters and allocating budgets in order to create a welcoming and expressive space.",
    "In 2026, we raised $279.50 by refining and vending abandoned pottery pieces accumulated from the club and classes as a donation to the BC Children’s Hospital Foundation.",
    "Our club materials consist of low fire Plainsman L210/L212 stoneware clay bodies, and fresh Mayco glazes to pair. Though sometimes I have the courage to use some discontinued Duncan sloshes as well. I find experimenting with our limited selection very rewarding!",
  ],
  school: [
    "3D Studio Design — taken in grade 10 and 11. Final grades both 98%.",
    "In these two years of formatted courses, I have developed refinement in my documentation, as well as gained independence in continuously working through initial designs, construction issues, and kiln management.",
    "This coming semester, I hope to explore my limits by throwing upsized pieces and participating more often in the reclaim procedures.",
    "While the club has its own materials, much of it is shared or duplicated with the course’s. Other than a wider selection of Spectrum Underglazes, most pieces shown consist of stoneware and Mayco.",
  ],
  "asia-course": [
    "This course is the foundation of my wheeling skills. I spent two weeks driving into the mountains of Hunan, China where they taught us the history of pottery, as well as regional throwing and glazing methods.",
    "Throughout this course, I was exposed to various cultural differences compared to the west. From the variety and ample selections of clay (porcelain at different measurements of kaolin, stoneware with extra stone, etc.) as well as availability of tools and materials. I hope to go back soon!",
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
