import Image from "next/image";

import Reveal from "./Reveal";
import { categories, type Category } from "@/lib/portfolio";
import type { Tile, Wall } from "@/lib/walls";

/**
 * The walls are drawn as free compositions rather than packed rows, so each one
 * is laid out on the reference canvas it was designed on and scaled as a whole.
 * Percentages against that canvas mean the gaps between photos hold their exact
 * proportions at any width — nothing reflows, so nothing drifts out of place.
 *
 * To move a photo, change its x/y/w/h in walls.ts; they are plain pixels in the
 * 1685px-wide space of the layout screenshots in public/.
 */
function pct(part: number, whole: number) {
  return `${((part / whole) * 100).toFixed(4)}%`;
}

function Frame({ tile, wall, alt }: { tile: Tile; wall: Wall; alt: string }) {
  const [u0, v0, u1, v1] = tile.crop;
  const cw = u1 - u0;
  const ch = v1 - v0;

  // Widest the frame ever renders: the wall fills 9 of 12 columns of a 1400px
  // container. The source is scaled up by 1/cw to fill the frame after cropping.
  const shown = (tile.w / wall.ref.w) / cw;

  return (
    <div
      className="absolute"
      style={{
        left: pct(tile.x, wall.ref.w),
        top: pct(tile.y, wall.ref.h),
        width: pct(tile.w, wall.ref.w),
        height: pct(tile.h, wall.ref.h),
      }}
    >
      <Reveal
        delay={tile.delay}
        className="group relative h-full w-full overflow-hidden rounded-[3px] bg-cream-300"
      >
        {/* Blown up to 1/crop and pulled back by the crop origin, so the frame
            above shows exactly the part of the photo the layout called for. */}
        <div
          className="absolute transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
          style={{
            width: `${(100 / cw).toFixed(4)}%`,
            height: `${(100 / ch).toFixed(4)}%`,
            left: `${((-u0 / cw) * 100).toFixed(4)}%`,
            top: `${((-v0 / ch) * 100).toFixed(4)}%`,
          }}
        >
          <Image
            src={tile.src}
            alt={alt}
            fill
            loading="lazy"
            sizes={`(max-width: 768px) ${Math.ceil(shown * 92)}vw, ${Math.ceil(shown * 70)}vw`}
            style={{ objectFit: "cover" }}
          />
        </div>
      </Reveal>
    </div>
  );
}

function TheWall({ wall, title }: { wall: Wall; title: string }) {
  return (
    <div
      className="relative w-full [container-type:inline-size]"
      style={{ aspectRatio: `${wall.ref.w} / ${wall.ref.h}` }}
    >
      {wall.tiles.map((tile) => (
        <Frame
          key={`${tile.src}-${tile.x}-${tile.y}`}
          tile={tile}
          wall={wall}
          alt={`Ceramic work by RuiXuan Xu — ${title}`}
        />
      ))}

      {wall.labels.map((label) => (
        <div
          key={`${label.text}-${label.y}`}
          className="absolute flex items-center"
          style={{
            left: pct(label.x, wall.ref.w),
            top: pct(label.y, wall.ref.h),
            width: pct(label.w, wall.ref.w),
            height: pct(label.h, wall.ref.h),
          }}
        >
          <Reveal>
            <p
              className="whitespace-nowrap font-display italic leading-none tracking-[0.02em] text-ink"
              // Sized off the wall's own width so it scales with the composition.
              style={{ fontSize: `${((label.h / wall.ref.w) * 100 * 1.25).toFixed(3)}cqw` }}
            >
              {label.text}
            </p>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function Section({ category }: { category: Category }) {
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
              {category.wall.tiles.length} pieces
            </p>
          </div>
        </div>

        {/* the wall */}
        <div className="md:col-span-9">
          <TheWall wall={category.wall} title={category.title} />
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
