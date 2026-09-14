import Image from "next/image";

import { contactLinks } from "@/lib/links";

const bio = [
  "My name is 许瑞轩 (RuiXuan Xu), I am a grade 12 student at Lord Byng Secondary school with passions in ceramics and pharmaceutical microbiology.",
  "Ceramics was first introduced to me through various art classes taken as a kid, I furthered my pursuit through 3D studio design courses inside and out of school, as well as running the Lord Byng Ceramics Club since 2022.",
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

        {/* name — its own row, so the photo can tuck up behind its baseline
            rather than being squeezed to match the text column's height. */}
        <h1
          className="rise relative z-20 font-display leading-[0.8] tracking-[-0.025em] text-ink md:col-span-6 md:row-start-2 md:mt-9"
          style={{ animationDelay: "160ms" }}
        >
          <span className="block origin-bottom scale-y-[0.85] whitespace-nowrap text-[min(12vw,10rem)]">
            RuiXuan <span className="italic text-lilac">Xu</span>
          </span>
        </h1>

        {/* bio + links on the left; the photo on the right, pulled up to
            overlap the name's baseline the way it originally sat. */}
        <div className="grid grid-cols-1 gap-y-12 md:col-span-12 md:row-start-3 md:mt-9 md:grid-cols-12 md:items-start md:gap-x-8 md:gap-y-0">
          <div
            className="rise flex flex-col md:col-span-6"
            style={{ animationDelay: "300ms" }}
          >
            <div className="max-w-[32rem] space-y-5">
              {bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-[1.003rem] leading-[1.7] text-ink"
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

          {/* photo — sized to hero-photo.jpg's own 16:9 ratio so the frame
              never crops it top or bottom; 95% width for a touch smaller,
              dropped down so its top lines up with "pharmaceutical" in the
              bio line above. */}
          <div
            className="rise relative mt-12 md:col-span-6 md:mt-0 md:w-[95%] md:translate-y-[31px]"
            style={{ animationDelay: "440ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 border border-lilac-300/70 md:translate-x-4"
            />
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-cream-300">
              <Image
                src="/hero-photo.jpg"
                alt="RuiXuan Xu photographing work in the ceramics studio"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
