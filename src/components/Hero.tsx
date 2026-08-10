import Image from "next/image";

const ARCH = "999px 999px 6px 6px";

export default function Hero() {
  return (
    <section className="relative overflow-x-clip px-6 pb-16 pt-4 md:px-12 md:pb-14 md:pt-6">
      {/* soft lilac wash, kept faint so the page reads as cream */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 top-40 h-[34rem] w-[34rem] rounded-full bg-lilac-100/45 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
        {/* eyebrow */}
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-ink-400 md:col-span-12 md:row-start-1 md:text-[0.75rem]">
          Ceramics <span className="mx-2 text-lilac">/</span> Hand-built objects
        </p>

        {/* name — spans the container; the photo tucks up behind its baseline */}
        <h1 className="relative z-20 font-display leading-[0.78] tracking-[-0.025em] text-ink md:col-span-12 md:row-start-2 md:mt-4">
          <span className="block whitespace-nowrap text-[min(20vw,17.5rem)]">
            RuiXuan <span className="italic text-lilac">Xu</span>
          </span>
        </h1>

        {/* photo */}
        <div className="md:col-span-5 md:col-start-8 md:row-start-3 md:-mt-20 md:justify-self-end">
          <div className="relative mx-auto w-[min(100%,20rem)] md:w-[21rem]">
            {/* offset outline frame */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 border border-lilac-300/70 md:translate-x-4 md:translate-y-4"
              style={{ borderRadius: ARCH }}
            />
            <div
              className="relative aspect-[3/4] w-full overflow-hidden bg-cream-300"
              style={{ borderRadius: ARCH }}
            >
              <Image
                src="/personalRuiPhoto.jpg"
                alt="RuiXuan Xu loading glazed work into a kiln"
                fill
                priority
                sizes="(max-width: 768px) 88vw, 21rem"
                className="object-cover object-[58%_center]"
              />
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="max-w-md md:col-span-5 md:col-start-1 md:row-start-3 md:mt-14 md:self-start">
          <p className="text-[1.05rem] leading-relaxed text-ink-600 md:text-[1.15rem]">
            Placeholder bio — a few lines on where Rui works, what she makes,
            and how she thinks about clay. Wheel-thrown and hand-built vessels,
            glazed in small batches, fired in the studio kiln.
          </p>
          <p className="mt-8 text-[0.75rem] uppercase tracking-[0.24em] text-ink-400">
            Based in <span className="text-lilac">— placeholder —</span>
          </p>
        </div>
      </div>
    </section>
  );
}
