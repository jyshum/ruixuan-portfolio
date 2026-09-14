"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { LightboxProvider, useLightbox, type LightboxImage } from "./Lightbox";
import Reveal from "./Reveal";
import { clubInstagramLink } from "@/lib/links";
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

function Frame({
  tile,
  wall,
  alt,
  images,
  index,
}: {
  tile: PhoneTile;
  wall: Wall;
  alt: string;
  images: LightboxImage[];
  index: number;
}) {
  const caption = wall.pieces[tile.piece];
  const fullAlt = caption ? `${caption} — ${alt}` : alt;
  const [u0, v0, u1, v1] = tile.crop;
  const cw = u1 - u0;
  const ch = v1 - v0;
  const open = useLightbox();

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
      <Reveal delay={tile.delay} className="h-full w-full">
        <button
          type="button"
          onClick={() => open(images, index)}
          aria-label={`View larger: ${fullAlt}`}
          className="group relative block h-full w-full scale-[0.97] cursor-pointer overflow-hidden bg-cream-300"
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
              alt={fullAlt}
              fill
              loading="lazy"
              sizes={`(max-width: 768px) ${phone}vw, ${desk}vw`}
              style={{ objectFit: "cover" }}
            />
          </div>
        </button>
      </Reveal>
    </div>
  );
}

function TheWall({ wall, title }: { wall: Wall; title: string }) {
  const alt = `Ceramic work by RuiXuan Xu — ${title}`;
  // The lightbox gallery follows the original tile order (not the phone
  // reflow), so swiping through it matches the desktop composition's flow
  // rather than whatever order rows happened to wrap into on a phone.
  const images: LightboxImage[] = wall.tiles.map((tile) => {
    const caption = wall.pieces[tile.piece];
    return { src: tile.src, alt: caption ? `${caption} — ${alt}` : alt };
  });
  const indexByKey = new Map(
    wall.tiles.map((tile, i) => [`${tile.src}-${tile.x}-${tile.y}`, i]),
  );

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
              <p className="whitespace-nowrap text-[0.64rem] uppercase tracking-[0.28em] text-ink-400">
                {row.label.text}
              </p>
            </Reveal>
          </div>
        ) : (
          <div key={`row-${row.y}-${row.tiles[0].src}`} className="wall-row">
            {row.tiles.map((tile) => {
              const key = `${tile.src}-${tile.x}-${tile.y}`;
              return (
                <Frame
                  key={key}
                  tile={tile}
                  wall={wall}
                  alt={alt}
                  images={images}
                  index={indexByKey.get(key) ?? 0}
                />
              );
            })}
          </div>
        ),
      )}
    </div>
  );
}

/** Same hollow rectangle as the one between the hero and the portfolio,
 *  reused here to separate each category instead of a plain border. */
function SectionDivider() {
  return (
    <div
      aria-hidden
      className="mx-auto aspect-[100/1.5] w-3/5 border border-lilac-300/70"
    />
  );
}

function Section({ category }: { category: Category }) {
  // School alternates sides with its neighbours — the rail moves to the
  // right and the wall to the left. The wall's own composition is mirrored
  // in lib/walls.ts (each tile's x reflected across the wall's width), so
  // this is a true flip of the layout, not just the two columns swapping.
  const flip = category.slug === "school";

  return (
    <section id={category.slug} className="scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-10 px-6 md:grid-cols-12 md:px-12">
        {/* rail — stays with you while the category scrolls past.
            row-start-1 on both this and the wall below is load-bearing: with
            the wall's column-start coming *before* the rail's in source
            order, grid auto-placement would otherwise push the wall to row
            2, since its cursor can't move backward within a row — which
            silently breaks both the alignment and the sticky containing
            block. */}
        <div className={`md:col-span-4 md:row-start-1 ${flip ? "md:col-start-9" : ""}`}>
          <div className="md:sticky md:top-28">
            <p className="text-[0.64rem] uppercase tracking-[0.32em] text-lilac">
              {category.index}
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="font-display text-[2rem] leading-[0.95] tracking-[-0.02em] md:text-[2.5rem]">
                {category.title}
              </h2>
              {category.slug === "club" && (
                <a
                  href={clubInstagramLink.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative text-[0.66rem] uppercase tracking-[0.24em] text-ink-600 transition-colors duration-300 hover:text-lilac motion-reduce:transition-none"
                >
                  {clubInstagramLink.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-lilac transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                </a>
              )}
            </div>
            <div className="mt-6 space-y-4 text-[0.944rem] leading-[1.85] text-ink-600">
              {category.blurb.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* the wall — pushed to the outer margin so its edge stays on the
            one the navbar and the hero share, whichever side it's on */}
        <div
          className={`md:col-span-7 md:row-start-1 md:w-full ${
            flip ? "md:col-start-1 md:mr-auto" : "md:col-start-6 md:ml-auto"
          } ${WALL_MAX}`}
        >
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
        <Reveal className="md:col-span-6">
          <h2 className="font-display text-[min(8.5vw,7rem)] leading-[0.82] tracking-[-0.025em]">
            Port<span className="italic text-lilac">folio</span>
          </h2>
        </Reveal>

        <Reveal delay={100} className="md:col-span-6 md:col-start-7">
          <div className="w-full space-y-4 text-[1.003rem] leading-[1.9] text-ink-600 md:pb-2">
            <p>
              I hope to continue fusing wheeled bases with handbuilt spirals,
              florals and intrinsic design, while furthering and sharing my
              skills of experimentation with the materials around me.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <LightboxProvider>
      <div id="work" className="scroll-mt-20">
        <Opening />
        {categories.map((category, i) => (
          <div key={category.slug}>
            {i > 0 && <SectionDivider />}
            <Section category={category} />
          </div>
        ))}
      </div>
    </LightboxProvider>
  );
}
