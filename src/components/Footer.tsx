export default function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
        <p>RuiXuan Xu</p>
        <p>© {new Date().getFullYear()} — All work her own</p>
      </div>
    </footer>
  );
}
