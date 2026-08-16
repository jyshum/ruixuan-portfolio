import { sections } from "./links";
import { asiaCourse, club, school, type Wall } from "./walls";

export type Category = {
  slug: string;
  index: string;
  title: string;
  blurb: string;
  wall: Wall;
};

const walls: Record<string, Wall> = {
  club,
  school,
  "asia-course": asiaCourse,
};

const blurbs: Record<string, string> = {
  club: "Placeholder — a sentence on the club work, the forms, the glazes used.",
  school:
    "Placeholder — a sentence on the school pieces and what they were exploring.",
  "asia-course":
    "Placeholder — a sentence on what this body of work is and when it was made.",
};

/** Slug and title come from lib/links.ts, which the navbar reads too. */
export const categories: Category[] = sections.map(({ slug, title }, i) => ({
  slug,
  title,
  index: String(i + 1).padStart(2, "0"),
  blurb: blurbs[slug],
  wall: walls[slug],
}));
