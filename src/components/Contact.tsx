import Reveal from "./Reveal";

const links = [
  {
    label: "LinkedIn",
    value: "ruixuan-xu",
    href: "https://www.linkedin.com/in/ruixuan-xu-7445693a6/",
    external: true,
  },
  {
    label: "Instagram",
    value: "@c3ramicsclub",
    href: "https://www.instagram.com/c3ramicsclub/",
    external: true,
  },
  {
    label: "Email",
    value: "xu.ruixuan3579@gmail.com",
    href: "mailto:xu.ruixuan3579@gmail.com",
    external: false,
  },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="h-4 w-4 shrink-0 text-ink-400 transition-[transform,color] duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lilac motion-reduce:transition-none"
    >
      <path
        d="M4 12L12 4M12 4H5.5M12 4V10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-ink/10 px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-ink-400">
            Contact
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.9] tracking-[-0.02em]">
            Say <span className="italic text-lilac">hello</span>
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-12 md:mt-16">
          <ul>
            {links.map(({ label, value, href, external }) => (
              <li key={label} className="border-t border-ink/10 last:border-b">
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="group relative flex items-baseline gap-4 overflow-hidden py-6 md:py-8"
                >
                  {/* lilac wash wipes in from the left on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-lilac-100/45 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                  <span className="relative z-10 flex-1 font-display text-[2rem] leading-none tracking-tight transition-[color,transform] duration-500 ease-out group-hover:translate-x-3 group-hover:text-lilac motion-reduce:transition-none md:text-[3rem]">
                    {label}
                  </span>
                  <span className="relative z-10 hidden text-[0.8rem] uppercase tracking-[0.18em] text-ink-400 sm:block">
                    {value}
                  </span>
                  <span className="relative z-10 flex items-center pl-2 md:pl-6">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
