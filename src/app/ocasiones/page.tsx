import { Reveal, StaggerChildren } from "@/components/reveal";
import { occasions } from "@/lib/occasions";
import { OccasionCard } from "./occasion-card";

export const metadata = {
  title: "Ocasiones · Lirios",
  description:
    "Flores curadas para San Valentín, Día de la Madre, cumpleaños, aniversarios y más.",
};

export default function OccasionsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <Reveal>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Ocasiones
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
          Para cada momento <span className="italic text-primary">importante</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Curamos selecciones para los días que más se piden. Si no encuentras
          la ocasión exacta, personaliza tu ramo.
        </p>
      </Reveal>

      <StaggerChildren
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.08}
      >
        {occasions.map((o) => (
          <OccasionCard key={o.slug} occasion={o} />
        ))}
      </StaggerChildren>
    </div>
  );
}
