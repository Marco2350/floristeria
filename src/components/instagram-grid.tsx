import { Heart, MessageCircle } from "lucide-react";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { BUSINESS } from "@/lib/business";

type Post = {
  caption: string;
  likes: number;
  comments: number;
  bg: string;
};

const posts: Post[] = [
  {
    caption: "Ramo de novia · sábado en El Progreso",
    likes: 412,
    comments: 28,
    bg: "#F7E5E8",
  },
  {
    caption: "Amaneceres en jarrón ☀️",
    likes: 287,
    comments: 14,
    bg: "#FBF1DC",
  },
  {
    caption: "Tonos morados para una graduación",
    likes: 356,
    comments: 19,
    bg: "#E6E0EE",
  },
  {
    caption: "Doce rojas para un aniversario",
    likes: 528,
    comments: 33,
    bg: "#F3D9DE",
  },
  {
    caption: "Campestre · regalo sin razón",
    likes: 198,
    comments: 11,
    bg: "#EDF1E7",
  },
  {
    caption: "Mesa de domingo en familia",
    likes: 374,
    comments: 22,
    bg: "#F1ECE3",
  },
];

export function InstagramGrid() {
  // Duplicate so the loop is seamless.
  const reel = [...posts, ...posts];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-12">
      <div className="grid grid-cols-12 items-end gap-6">
        <div className="col-span-12 md:col-span-7">
          <h2 className="display-md text-balance">
            Lo último
            <br />
            <span className="italic" style={{ color: "var(--ochre-deep)" }}>
              del taller
            </span>.
          </h2>
          <p className="mt-4 max-w-md text-base text-[var(--ink-soft)]">
            Cada ramo que sale, lo capturamos. Síguenos para ver lo que se va
            esta semana.
          </p>
        </div>
        <a
          href={BUSINESS.social.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-12 inline-flex items-center gap-2 text-sm text-[var(--ink-deep)] underline-offset-4 hover:underline md:col-span-5 md:justify-end"
        >
          {BUSINESS.social.instagram.handle}
          <span aria-hidden>→</span>
        </a>
      </div>

      <div className="marquee-group relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div
          className="marquee flex w-max flex-row flex-nowrap gap-3 sm:gap-4"
          style={{ ["--marquee-duration" as string]: "60s" }}
        >
          {reel.map((p, i) => (
            <a
              key={i}
              href={BUSINESS.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square w-48 shrink-0 overflow-hidden rounded-2xl sm:w-56 lg:w-60"
              style={{ background: p.bg }}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                <LogoPlaceholder
                  size={220}
                  background={p.bg}
                  className="flex h-full w-full items-center justify-center"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-3 text-background opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-xs leading-snug line-clamp-2">{p.caption}</p>
                <div className="mt-2 flex gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3 fill-background" />
                    {p.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-3" />
                    {p.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
