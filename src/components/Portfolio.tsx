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
/**
 * The widest any category's photo grid may draw. Every tile is placed as a
 * share of its wall, so this single value scales all of them together —
 * change it here rather than touching the walls in lib/walls.ts.
 */
const WALL_MAX = "md:max-w-[42rem]";

function pct(part: number, whole: number) {
  return `${((part / whole) * 100).toFixed(4)}%`;
}

function Frame({ tile, wall, alt }: { tile: PhoneTile; wall: Wall; alt: string }) {
  const caption = wall.pieces[tile.piece];
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
            alt={caption ? `${caption} — ${alt}` : alt}
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
                // The drawn size, as a share of the wall's own width so it
                // tracks the composition instead of the viewport.
                "--fs": `${((row.label.h / wall.ref.w) * 100 * 1.6).toFixed(3)}cqw`,
                "--x": pct(row.label.x, wall.ref.w),
                "--y": pct(row.label.y, wall.ref.h),
                "--w": pct(row.label.w, wall.ref.w),
                "--h": pct(row.label.h, wall.ref.h),
              } as CSSProperties
            }
          >
            <Reveal>
              <p className="whitespace-nowrap font-display italic leading-none tracking-[0.02em] text-lilac">
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
      className="scroll-mt-24 border-t border-ink/10 py-20 md:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-10 px-6 md:grid-cols-12 md:px-12">
        {/* rail — stays with you while the category scrolls past */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <p className="text-[0.64rem] uppercase tracking-[0.32em] text-lilac">
              {category.index}
            </p>
            <h2 className="mt-4 font-display text-[2rem] leading-[0.95] tracking-[-0.02em] md:text-[2.5rem]">
              {category.title}
            </h2>
            <div className="mt-6 max-w-[17rem] space-y-4 text-[0.8rem] leading-[1.85] text-ink-600">
              {category.blurb.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-7 text-[0.64rem] uppercase tracking-[0.28em] text-ink-400">
              {category.wall.tiles.length} pieces
            </p>
          </div>
        </div>

        {/* the wall — pushed to the right margin so its edge stays on the
            one the navbar and the hero share */}
        <div className={`md:col-span-8 md:col-start-5 md:ml-auto md:w-full ${WALL_MAX}`}>
          <TheWall wall={category.wall} title={category.title} />
        </div>
      </div>
    </section>
  );
}

function Opening() {
  return (
    <div className="scroll-mt-24 pb-10 pt-24 md:pb-16 md:pt-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-x-8 gap-y-8 px-6 md:grid-cols-12 md:px-12">
        <Reveal className="md:col-span-7">
          <h2 className="font-display text-[min(8.5vw,7rem)] leading-[0.82] tracking-[-0.025em]">
            Port<span className="italic text-lilac">folio</span>
          </h2>
        </Reveal>

        <Reveal delay={100} className="md:col-span-4 md:col-start-9">
          <p className="max-w-[22rem] text-[0.85rem] leading-[1.9] text-ink-600 md:pb-2">
            I hope to continue learning and expanding what I know about the
            types of clay, forms and textures I can create.
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
