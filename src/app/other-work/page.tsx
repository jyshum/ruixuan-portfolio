import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Other Work — RuiXuan Xu",
};

export default function OtherWork() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-ink-400">
            Other Work
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-[-0.02em]">
            Coming <span className="italic text-lilac">soon</span>
          </h1>
        </div>
      </main>
    </>
  );
}
