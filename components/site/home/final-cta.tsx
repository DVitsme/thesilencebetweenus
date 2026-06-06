import { SupportButton } from "../support-button";

export function FinalCta() {
  return (
    <div className="bg-gold px-[34px] py-12 text-center sm:py-[84px]">
      <h2 className="text-ink mx-auto mb-3.5 max-w-[680px] font-serif text-[clamp(2.1rem,5vw,2.875rem)] leading-[1.07] tracking-[-0.6px]">
        Help this story be told.
      </h2>
      <p className="mx-auto mb-7 max-w-[540px] font-serif text-[20px] text-[#6b5409]">
        Join the Founding Supporters behind <em>The Silence Between Us</em>. Your name becomes part of
        the film, forever.
      </p>
      <SupportButton className="border-dark bg-dark text-on-dark text-[19px] hover:border-black hover:bg-black hover:text-white">
        Make a contribution →
      </SupportButton>
    </div>
  );
}
