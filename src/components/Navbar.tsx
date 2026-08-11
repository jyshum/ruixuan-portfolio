import Link from "next/link";

const links = [
  { href: "/#work", label: "Portfolio", muted: false },
  { href: "/other-work", label: "Other Work", muted: true },
  { href: "/#contact", label: "Contact", muted: true },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cream">
      <nav className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-6 md:px-12 md:py-8">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-ink transition-colors hover:text-lilac md:text-[1.75rem]"
        >
          RuiXuan Xu
        </Link>

        <ul className="flex items-baseline gap-7 md:gap-10">
          {links.map(({ href, label, muted }) => (
            <li key={href}>
              <Link
                href={href}
                className={`group relative text-[0.8rem] uppercase tracking-[0.18em] transition-colors md:text-[0.85rem] ${
                  muted
                    ? "font-normal text-ink-400 hover:text-ink-600"
                    : "font-medium text-ink hover:text-lilac"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-lilac transition-transform duration-300 group-hover:scale-x-100 ${
                    muted ? "bg-ink-400" : ""
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
