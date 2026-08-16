import Image from "next/image";
import type { CSSProperties } from "react";

import Reveal from "./Reveal";
import { categories, type Category } from "@/lib/portfolio";
import { wallRows, type PhoneTile, type Wall } from "@/lib/walls";

/**
 * The walls are drawn as free compositions rather than packed rows, so from md
 * up each one is laid out on the reference canvas it was designed on and scaled
 * as a whole. Percentages against that canvas mean the gaps between photos hold
 * their exact proportions — nothing reflows, so nothing drifts out of place.
 *
 * A phone is too narrow to read that composition at scale, so below md the same
 * tiles reflow into justified rows. Both layouts are driven by the custom
 * properties set here and switched in globals.css.
 *
 * To move a photo, change its x/y/w/h in walls.ts; they are plain pixels in the
 * 1685px-wide space of the layout screenshots in design/layouts/.
 */
function pct(part: number, whole: number) {
  return `${((part / whole) * 100).toFixed(4)}%`;
}

function Frame({ tile, wall, alt }: { tile: PhoneTile; wall: Wall; alt: string }) {
  const [u0, v0, u1, v1] = tile.crop;
  const cw = u1 - u0;
  const ch = v1 - v0;

  // How much of the viewport the photo covers, before the crop scales it up:
  // most of the row on a phone, a share of the 9-of-12 column from md up.
  const phone = Math.ceil(((tile.frac * 94) / cw) * 10) / 10;
  const desk = Math.ceil((((tile.w / wall.ref.w) * 70) / cw) * 10) / 10;

  return (
    <div
      className="wall-tile"
      style={
        {
          "--ar": (tile.w / tile.h).toFixed(4),
          "--x": pct(tile.x, wall.ref.w),
          "--y": pct(tile.y, wall.ref.h),
          "--w": pct(tile.w, wall.ref.w),
          "--h": pct(tile.h, wall.ref.h),
        } as CSSProperties
      }
    >
      <Reveal
        delay={tile.delay}
        className="group relative h-full w-full overflow-hidden bg-cream-300"
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
            sizes={`(max-width: 768px) ${phone}vw, ${desk}vw`}
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
      className="wall w-full [container-type:inline-size]"
      style={{ "--wall-ar": `${wall.ref.w} / ${wall.ref.h}` } as CSSProperties}
    >
      {wallRows(wall).map((row) =>
        row.kind === "label" ? (
          <div
            key={`label-${row.label.text}-${row.y}`}
            className="wall-label"
            style={
              {
                "--x": pct(row.label.x, wall.ref.w),
                "--y": pct(row.label.y, wall.ref.h),
                "--w": pct(row.label.w, wall.ref.w),
                "--h": pct(row.label.h, wall.ref.h),
              } as CSSProperties
            }
          >
            <Reveal>
              <p className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.24em] text-ink-400">
                {row.label.text}
              </p>
            </Reveal>
          </div>
        ) : (
          <div key={`row-${row.y}-${row.tiles[0].src}`} className="wall-row">
            {row.tiles.map((tile) => (
              <Frame
                key={`${tile.src}-${tile.x}-${tile.y}`}
                tile={tile}
                wall={wall}
                alt={`Ceramic work by RuiXuan Xu — ${title}`}
              />
            ))}
          </div>
        ),
      )}
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
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <h2 className="font-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] md:text-[3.25rem]">
                {category.title}
              </h2>
              {category.link && (
                <a
                  href={category.link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative text-[0.72rem] uppercase tracking-[0.2em] text-ink-600 transition-colors duration-300 hover:text-lilac motion-reduce:transition-none"
                >
                  {category.link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-lilac transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                </a>
              )}
            </div>
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-ink-600">
              {category.blurb}
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
          <h2 className="font-display text-[min(11vw,9rem)] italic leading-[0.82] tracking-[-0.025em] text-lilac">
            Portfolio
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
