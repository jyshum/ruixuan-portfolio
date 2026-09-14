"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type LightboxImage = { src: string; alt: string; caption?: string };

type LightboxState = { images: LightboxImage[]; index: number } | null;

const LightboxContext = createContext<
  ((images: LightboxImage[], index: number) => void) | null
>(null);

export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) throw new Error("useLightbox must be used within LightboxProvider");
  return open;
}

/** How far a touch has to travel before it counts as a swipe instead of a
 *  tap or an accidental drag. */
const SWIPE_THRESHOLD = 50;

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const touchStartX = useRef<number | null>(null);

  const open = useCallback((images: LightboxImage[], index: number) => {
    setState({ images, index });
  }, []);

  const close = useCallback(() => setState(null), []);

  const step = useCallback((delta: number) => {
    setState((current) => {
      if (!current) return current;
      const next =
        (current.index + delta + current.images.length) % current.images.length;
      return { ...current, index: next };
    });
  }, []);

  // Lock page scroll and wire up arrow-key / escape navigation while open.
  useEffect(() => {
    if (!state) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close, step]);

  const current = state ? state.images[state.index] : null;

  // Splits at the midpoint of the *image's own* rendered box — not the
  // surrounding backdrop — so a click only steps the gallery when it lands
  // on the picture itself.
  function stepFromClickX(event: { currentTarget: HTMLElement; clientX: number }) {
    if (!state || state.images.length < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    step(event.clientX - rect.left < rect.width / 2 ? -1 : 1);
  }

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && current && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-ink/95 p-4 md:p-10"
          onClick={close}
        >
          {/* z-10 keeps this above the picture's click band — the band used
              to reach right up under this corner and swallow the tap. */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 z-10 text-[2rem] font-display leading-none text-cream-100/80 transition-colors hover:text-cream-100 md:right-8 md:top-8"
          >
            &times;
          </button>

          {/* arrows alongside the click/swipe band, for anyone who'd rather
              hit a visible control than click or drag the photo itself */}
          {state.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 text-cream-100/70 transition-colors hover:text-cream-100 md:left-6"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="h-5 w-5 md:h-6 md:w-6">
                  <path
                    d="M10 3L5 8L10 13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 text-cream-100/70 transition-colors hover:text-cream-100 md:right-6"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="h-5 w-5 md:h-6 md:w-6">
                  <path
                    d="M6 3L11 8L6 13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="flex max-w-3xl flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- sized to
                its own content (w-auto h-auto) so the click band below can
                match the picture's real, rendered bounds; next/image's fill
                mode can't do that without knowing the source's pixel size. */}
            <img
              src={current.src}
              alt={current.alt}
              onClick={(event) => {
                event.stopPropagation();
                stepFromClickX(event);
              }}
              onTouchStart={(event) => {
                event.stopPropagation();
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                event.stopPropagation();
                if (touchStartX.current === null) return;
                const delta = event.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(delta) > SWIPE_THRESHOLD) step(delta < 0 ? 1 : -1);
                touchStartX.current = null;
              }}
              className={`h-auto max-h-[62vh] w-auto max-w-full select-none object-contain md:max-h-[68vh] ${
                state.images.length > 1 ? "cursor-pointer" : ""
              }`}
            />

            {current.caption && (
              <p
                onClick={(event) => event.stopPropagation()}
                className="max-w-2xl px-2 text-center text-[1.003rem] leading-[1.9] text-cream-100"
              >
                {current.caption}
              </p>
            )}

            {state.images.length > 1 && (
              <p
                onClick={(event) => event.stopPropagation()}
                className="text-[0.64rem] uppercase tracking-[0.28em] text-cream-100/60"
              >
                {state.index + 1} / {state.images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}
