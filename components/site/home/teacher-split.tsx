import Image from "next/image";
import { Eyebrow, SectionHeading } from "../primitives";

export function TeacherSplit() {
  return (
    <section className="grid items-stretch md:grid-cols-2">
      {/* items-stretch gives this column a real height for the fill image */}
      <div className="border-line relative order-1 min-h-[280px] border-b md:order-2 md:min-h-[380px] md:border-b-0 md:border-l">
        <Image
          src="/images/teacher-at-school.jpg"
          alt="A teacher with students in a classroom"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex my-8 flex-col justify-center px-[34px] py-12 md:px-14">
        <Eyebrow>A guiding light</Eyebrow>
        <SectionHeading className="mb-4">One teacher decides to really see them.</SectionHeading>
        <p className="mb-4 font-serif text-[19px] leading-[1.7]">
          When the adults in their lives are too busy, too tired, or too afraid to ask the hard
          questions, one teacher refuses to look away. He becomes the steady presence these students
          didn&apos;t know they needed, proof that being noticed can change everything.
        </p>
        <p className="font-serif text-[19px] leading-[1.7]">
          It&apos;s the kind of relationship that saves lives quietly, every day, in real schools.
          This film honors it.
        </p>
      </div>
    </section>
  );
}
