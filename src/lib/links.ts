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
