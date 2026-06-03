import { Hero } from "@/components/site/home/hero";
import { FilmStill } from "@/components/site/home/film-still";
import { FilmStory } from "@/components/site/home/film-story";
import { PullQuote } from "@/components/site/home/pull-quote";
import { TeacherSplit } from "@/components/site/home/teacher-split";
import { Filmmaker } from "@/components/site/home/filmmaker";
import { ProofBand } from "@/components/site/home/proof-band";
import { Endorsements } from "@/components/site/home/endorsements";
import { Tiers } from "@/components/site/home/tiers";
import { FinalCta } from "@/components/site/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FilmStill />
      <FilmStory />
      <PullQuote />
      <TeacherSplit />
      <Filmmaker />
      <ProofBand />
      <Endorsements />
      <Tiers />
      <FinalCta />
    </>
  );
}
