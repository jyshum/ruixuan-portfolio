/**
 * The portfolio's sections, in the order they appear on the page. Lives here
 * rather than in portfolio.ts so the navbar can list them without pulling the
 * walls' placement data into the client bundle; portfolio.ts builds its
 * categories from this, so the two cannot drift.
 */
export type Section = { slug: string; title: string };

export const sections: Section[] = [
  { slug: "club", title: "Club" },
  { slug: "school", title: "School" },
  { slug: "asia-course", title: "Asia Course" },
];

export type ContactLink = {
  label: string;
  href: string;
  external: boolean;
};

export const contactLinks: ContactLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ruixuan-xu-7445693a6/",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/c3ramicsclub/",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:xu.ruixuan3579@gmail.com",
    external: false,
  },
];
