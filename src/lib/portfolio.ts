import { contactLinks, sections, type ContactLink } from "./links";
import { asiaCourse, club, school, type Wall } from "./walls";

export type Category = {
  slug: string;
  title: string;
  blurb: string;
  wall: Wall;
  /** shown beside the title — the club has its own account */
  link?: ContactLink;
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

const instagram = contactLinks.find((l) => l.label === "Instagram");

/** Slug and title come from lib/links.ts, which the navbar reads too. */
export const categories: Category[] = sections.map(({ slug, title }) => ({
  slug,
  title,
  blurb: blurbs[slug],
  wall: walls[slug],
  ...(slug === "club" && instagram ? { link: instagram } : {}),
}));
