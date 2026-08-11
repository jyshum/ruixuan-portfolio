"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const links = [
  { href: "/#work", label: "Portfolio", muted: false },
  { href: "/", label: "About Me", muted: true },
];

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
          {links.map(({ href, label, muted }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={(event) => handleNav(event, href)}
                className={`group relative text-[0.8rem] uppercase tracking-[0.18em] transition-colors md:text-[0.85rem] ${
                  muted
                    ? "font-normal text-ink-400 hover:text-ink-600"
                    : "font-medium text-ink hover:text-lilac"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    muted ? "bg-ink-400" : "bg-lilac"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
