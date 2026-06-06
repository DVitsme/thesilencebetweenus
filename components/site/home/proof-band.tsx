import Link from "next/link";
import Image from "next/image";
import { PROOF_STATS, PARTNER_GROUPS } from "@/content/proof";

export function ProofBand() {
  return (
    <section className="bg-dark text-on-dark py-10 sm:py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <span className="text-on-dark-muted mb-2 block text-center font-serif text-[16px] italic">
          Why you can trust this
        </span>
        <h2 className="mx-auto mb-9 max-w-[620px] text-center font-serif text-[clamp(1.9rem,4vw,2.25rem)] leading-[1.1] tracking-[-0.3px] text-white">
          This isn&apos;t a first-timer with a dream and a camera.
        </h2>

        <div className="mx-auto mb-12 grid max-w-[920px] grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {PROOF_STATS.map((s) => (
            <div key={s.big} className="text-center">
              <div className="font-serif text-[46px] leading-[0.9]">{s.big}</div>
              <div className="text-on-dark-muted mt-2 font-serif text-[14.5px] leading-[1.35] italic">
                {s.cap}
              </div>
            </div>
          ))}
        </div>

        {PARTNER_GROUPS.map((g) => (
          <div key={g.label} className="mb-6">
            <div
              className={`mb-3 text-center font-serif text-[15px] italic ${g.lead ? "text-gold" : "text-on-dark-muted"}`}
            >
              {g.label}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {g.logos.map((l) => (
                // Light chip so partner logos (most are built for white) read on the dark band.
                <div
                  key={l.src}
                  className="bg-card-paper relative h-[66px] w-[158px] overflow-hidden rounded-[6px]"
                  title={l.name}
                >
                  <Image src={l.src} alt={l.name} fill sizes="158px" className="object-contain p-3" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-7 text-center">
          <Link
            href="/portfolio"
            className="text-on-dark hover:bg-on-dark hover:text-dark inline-flex items-center gap-2 rounded-full border border-[#6a6151] px-7 py-3 font-serif text-[16.5px] italic transition-colors"
          >
            See the full body of work →
          </Link>
        </div>
      </div>
    </section>
  );
}
