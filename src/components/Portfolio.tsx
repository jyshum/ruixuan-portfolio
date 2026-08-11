import Image from "next/image";

import Reveal from "./Reveal";
import {
  categories,
  justify,
  lastRowSpacer,
  type Category,
} from "@/lib/portfolio";

function Frame({ src, ar, alt }: { src: string; ar: number; alt: string }) {
  return (
    <div
      className="group relative shrink-0 overflow-hidden rounded-[3px] bg-cream-300"
      style={{ flexGrow: ar, flexBasis: 0, aspectRatio: ar }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 92vw, 32vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
      />
    </div>
  );
}

function Section({ category }: { category: Category }) {
  const rows = justify(category.photos);

  return (
    <section
      id={category.slug}
      className="scroll-mt-24 border-t border-ink/10 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-10 px-6 md:grid-cols-12 md:px-12">
        {/* rail — stays with you while the category scrolls past */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-lilac">
              {category.index}
            </p>
            <h2 className="mt-3 font-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] md:text-[3.25rem]">
              {category.title}
            </h2>
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-ink-600">
              {category.blurb}
            </p>
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.24em] text-ink-400">
              {category.photos.length} pieces
            </p>
          </div>
        </div>

        {/* the wall */}
        <div className="flex flex-col gap-3 md:col-span-9 md:gap-4">
          {rows.map((row, r) => {
            const spacer =
              r === rows.length - 1 ? lastRowSpacer(row, r) : 0;
            return (
              <Reveal key={r} className="flex flex-col gap-3 md:flex-row md:gap-4">
                {row.map((tile) => (
                  <Frame
                    key={tile.src}
                    src={tile.src}
                    ar={tile.ar}
                    alt={`Ceramic work by RuiXuan Xu — ${category.title}`}
                  />
                ))}
                {spacer > 0 && (
                  <div
                    aria-hidden
                    className="hidden md:block"
                    style={{ flexGrow: spacer, flexBasis: 0 }}
                  />
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Opening() {
  return (
    <div className="scroll-mt-24 px-6 pb-4 pt-16 md:px-12 md:pb-8 md:pt-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-x-8 gap-y-8 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <h2 className="font-display text-[min(11vw,9rem)] leading-[0.82] tracking-[-0.025em]">
            Port<span className="italic text-lilac">folio</span>
          </h2>
        </Reveal>

        <Reveal delay={100} className="md:col-span-4 md:col-start-9">
          <p className="max-w-sm text-[0.95rem] leading-[1.75] text-ink-600 md:pb-3">
            Placeholder — a few lines on where I want to take ceramics next: the
            forms I want to keep chasing, the glazes and firings I still want to
            test, and the kind of studio practice I hope to build around it.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div id="work" className="scroll-mt-20">
      <Opening />
      {categories.map((category) => (
        <Section key={category.slug} category={category} />
      ))}
    </div>
  );
}
