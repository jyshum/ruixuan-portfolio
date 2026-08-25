import Image from "next/image";

import { contactLinks } from "@/lib/links";

const bio = [
  "My name is 许瑞轩 (RuiXuan Xu), I am an upcoming grade 12 student at Lord Byng Secondary school with passions in ceramics and pharmaceutical microbiology.",
  "Ceramics was first introduced to me through various art classes taken as a kid, I furthered my pursuit through 3D studio design courses inside and out of school, as well as running the Lord Byng Ceramics Club since 2022.",
  "I hope to continue fusing wheeled bases with handbuilt spirals, florals and intrinsic design, while furthering and sharing my skills of experimentation with the materials around me.",
];

export default function Hero() {
  return (
    <section className="relative overflow-x-clip pb-24 pt-10 md:pb-36 md:pt-16">
      {/* soft lilac wash, kept faint so the page reads as cream */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 top-40 h-[34rem] w-[34rem] rounded-full bg-lilac-100/35 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-y-12 px-6 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:px-12">
        {/* eyebrow */}
        {/* z-30: the name below sets 205px type on 164px leading, so its glyph
            box overflows ~20px above its own line box and — being z-20 so it can
            cover the photo — swallowed every click on the resume link. */}
        <p
          className="rise relative z-30 flex items-center text-[0.66rem] uppercase tracking-[0.32em] text-ink-400 md:col-span-12 md:row-start-1 md:text-[0.68rem]"
          style={{ animationDelay: "60ms" }}
        >
          Ceramics Portfolio
          <span aria-hidden className="mx-3 text-ink-400/45 md:mx-4">
            |
          </span>
          <a
            href="/ruixuan-xu-resume.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 border-b border-lilac/40 pb-0.5 text-lilac transition-colors duration-300 hover:border-lilac motion-reduce:transition-none"
          >
            Resume
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="h-[0.7em] w-[0.7em] transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none"
            >
              <path
                d="M4 12L12 4M12 4H5.5M12 4V10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </p>

        {/* name — the photo tucks up behind its baseline */}
        <h1
          className="rise relative z-20 font-display leading-[0.8] tracking-[-0.025em] text-ink md:col-span-12 md:row-start-2 md:mt-9"
          style={{ animationDelay: "160ms" }}
        >
          <span className="block whitespace-nowrap text-[min(12vw,10rem)]">
            RuiXuan <span className="italic text-lilac">Xu</span>
          </span>
        </h1>

        {/* photo — centred in its five columns rather than pinned to the
            right edge, so it sits in the space instead of hugging the margin.
            Square corners: the arched top read as a locket next to type this
            severe, and the straight edges line up with the walls below. */}
        <div
          className="rise md:col-span-5 md:col-start-8 md:row-start-3 md:-mt-10 md:justify-self-end"
          style={{ animationDelay: "440ms" }}
        >
          {/* personalRuiPhoto.jpg is only 384x512, so anything past ~16rem is
              upscaled on a 2x screen and goes soft. The 3/4 box is the file's
              own ratio, which means the crop is lossless as well. */}
          <div className="relative mx-auto w-[min(100%,16rem)] md:w-[16rem]">
            {/* offset outline frame */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 border border-lilac-300/70 md:-translate-x-4 md:translate-y-4"
            />
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-300">
              <Image
                src="/personalRuiPhoto.jpg"
                alt="RuiXuan Xu loading glazed work into a kiln"
                fill
                priority
                sizes="(max-width: 768px) 70vw, 16rem"
                className="object-cover object-[58%_center]"
              />
            </div>
          </div>
        </div>

        {/* bio */}
        <div
          className="rise md:col-span-6 md:col-start-1 md:row-start-3 md:mt-16 md:self-start"
          style={{ animationDelay: "300ms" }}
        >
          {/* The opening line carries the name and the headline facts, so it
              is set a step up from the two that follow. The hierarchy is what
              keeps the block from reading as one undifferentiated slab. */}
          <div className="max-w-[32rem] space-y-5">
            {bio.map((paragraph, i) => (
              <p
                key={paragraph.slice(0, 24)}
                className={
                  i === 0
                    ? "text-[1rem] leading-[1.7] text-ink md:text-[1.05rem]"
                    : "text-[0.85rem] leading-[1.85] text-ink-600 md:text-[0.875rem]"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            {contactLinks.map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="group relative text-[0.66rem] uppercase tracking-[0.24em] text-ink-600 transition-colors duration-300 hover:text-lilac motion-reduce:transition-none"
                >
                  {label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-lilac transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
