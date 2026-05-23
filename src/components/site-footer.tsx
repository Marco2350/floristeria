import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card text-card-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/lirios-logo.png"
            alt="Lirios — Floristería"
            width={180}
            height={72}
            className="h-16 w-auto object-contain"
          />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Floristería artesanal. Flores de temporada, arreglos cuidados a mano
            y ramos a medida.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            Tienda
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/catalogo" className="hover:text-foreground transition">Catálogo</Link></li>
            <li><Link href="/catalogo?cat=ramos" className="hover:text-foreground transition">Ramos</Link></li>
            <li><Link href="/catalogo?cat=arreglos" className="hover:text-foreground transition">Arreglos</Link></li>
            <li><Link href="/personalizar" className="hover:text-foreground transition">Personaliza tu ramo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            Contacto
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-muted-foreground" />
              <span>Av. de las Flores 142, Colonia Jardín</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 text-muted-foreground" />
              <span>+52 55 1234 5678</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />
              <span>hola@lirios.mx</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            Horario
          </h4>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Lun a Vie</dt>
              <dd>9:00 — 20:00</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Sábado</dt>
              <dd>10:00 — 18:00</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Domingo</dt>
              <dd>10:00 — 14:00</dd>
            </div>
          </dl>
          <Link
            href="https://instagram.com"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <InstagramIcon className="size-4" />
            @lirios
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Lirios — Floristería. Hecho con cariño.</p>
          <p>Diseñado en estudio. Construido con Next.js.</p>
        </div>
      </div>
    </footer>
  );
}

