"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";

import { sections } from "@/lib/links";

/**
 * Some Chrome configurations ignore programmatic smooth scrolling outright —
 * the call returns and the page never moves. Ask for smooth, then check that it
 * actually started and jump instead if it did not, so the nav always lands.
 */
function scrollToY(top: number) {
  const start = window.scrollY;
  if (Math.abs(top - start) < 2) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - start) < 2) {
      window.scrollTo({ top, behavior: "auto" });
    }
  }, 150);
}

/** Top of `el`, less whatever scroll-margin it carries for the sticky header. */
function targetOf(el: Element) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return window.scrollY + el.getBoundingClientRect().top - margin;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLLIElement>(null);

  /* Hover opens the menu on a mouse. Touch and keyboard get in through the
     chevron, which is a plain disclosure button — deliberately not opened by
     focus as well, since focus lands before click and the two would cancel. */
  const hasHover = useRef(true);
  useEffect(() => {
    hasHover.current = window.matchMedia("(hover: hover)").matches;
  }, []);

  // A tap anywhere else should put it away.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /** Tabbing out of the menu closes it, the same as moving the mouse away. */
  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  /**
   * A Link pointing at the URL you are already on is a no-op in the router, so
   * "About Me" and the wordmark did nothing until some other link had put a
   * hash in the address bar. Same-page targets are scrolled by hand instead.
   */
  function handleNav(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    if (pathname !== targetPath) return; // a real navigation — let the router run

    const target = hash ? document.getElementById(hash) : null;
    if (hash && !target) return; // nothing to scroll to; let the browser try

    event.preventDefault();
    scrollToY(target ? targetOf(target) : 0);
    window.history.replaceState(null, "", hash ? `#${hash}` : targetPath);
  }

  return (
    <header className="sticky top-0 z-50 bg-cream">
      <nav className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-6 md:px-12 md:py-8">
        <Link
          href="/"
          onClick={(event) => handleNav(event, "/")}
          className="font-display text-2xl tracking-tight text-ink transition-colors hover:text-lilac md:text-[1.75rem]"
        >
          RuiXuan Xu
        </Link>

        <ul className="flex items-baseline gap-7 md:gap-10">
          <li
            ref={menu}
            className="group relative"
            onMouseEnter={() => hasHover.current && setOpen(true)}
            onMouseLeave={() => hasHover.current && setOpen(false)}
            onBlur={handleBlur}
            onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Link
                href="/#work"
                onClick={(event) => handleNav(event, "/#work")}
                className="relative text-[0.8rem] font-medium uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-lilac md:text-[0.85rem]"
              >
                Portfolio
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-lilac transition-transform duration-300 group-hover:scale-x-100" />
              </Link>

              <button
                type="button"
                aria-expanded={open}
                aria-controls="portfolio-sections"
                aria-label="Portfolio sections"
                onClick={() => setOpen((wasOpen) => !wasOpen)}
                className="-m-2 p-2 text-ink transition-colors group-hover:text-lilac"
              >
                <svg
                  viewBox="0 0 10 6"
                  aria-hidden
                  className={`h-[0.4rem] w-[0.6rem] transition-transform duration-300 motion-reduce:transition-none ${
                    open ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1 1L5 5L9 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Padded rather than offset, so the pointer never crosses a gap on
                its way down from the label to the panel. */}
            <div
              id="portfolio-sections"
              className={`absolute left-0 top-full pt-4 transition duration-200 ease-out motion-reduce:transition-none ${
                open
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <ul className="min-w-[10.5rem] rounded-[3px] border border-ink/10 bg-cream-100 py-2 shadow-[0_8px_24px_-12px_rgba(43,38,32,0.28)]">
                {sections.map(({ slug, title }) => (
                  <li key={slug}>
                    <Link
                      href={`/#${slug}`}
                      tabIndex={open ? undefined : -1}
                      onClick={(event) => {
                        handleNav(event, `/#${slug}`);
                        setOpen(false);
                      }}
                      className="block px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-ink-600 transition-colors hover:bg-cream-300/50 hover:text-lilac"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li>
            <Link
              href="/"
              onClick={(event) => handleNav(event, "/")}
              className="group/link relative text-[0.8rem] uppercase tracking-[0.18em] font-normal text-ink-400 transition-colors hover:text-ink-600 md:text-[0.85rem]"
            >
              About Me
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-ink-400 transition-transform duration-300 group-hover/link:scale-x-100" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
