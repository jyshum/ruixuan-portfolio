import { asiaCourse, club, school, type Wall } from "./walls";

export type Category = {
  slug: string;
  index: string;
  title: string;
  blurb: string;
  wall: Wall;
};

export const categories: Category[] = [
  {
    slug: "club",
    index: "01",
    title: "Club",
    blurb:
      "Placeholder — a sentence on the club work, the forms, the glazes used.",
    wall: club,
  },
  {
    slug: "school",
    index: "02",
    title: "School",
    blurb:
      "Placeholder — a sentence on the school pieces and what they were exploring.",
    wall: school,
  },
  {
    slug: "asia-course",
    index: "03",
    title: "Asia Course",
    blurb:
      "Placeholder — a sentence on what this body of work is and when it was made.",
    wall: asiaCourse,
  },
];
