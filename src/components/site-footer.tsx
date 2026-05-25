import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { BUSINESS } from "@/lib/business";

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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.5h2.55l.38-2.97H13.5V8.65c0-.86.24-1.45 1.48-1.45h1.58V4.55c-.27-.04-1.2-.12-2.29-.12-2.27 0-3.82 1.39-3.82 3.93v2.18H7.9v2.97h2.55V21h3.05Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card text-card-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter strip */}
        <div className="grid items-center gap-6 border-b border-border/40 py-12 md:grid-cols-2">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
              Newsletter
            </p>
            <h3 className="mt-3 font-display text-3xl tracking-tight">
              Flores frescas, en tu correo cada lunes.
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Lo que llegó esa semana, las flores de temporada y descuentos
              exclusivos. Cero spam.
            </p>
          </div>
          <div>
            <NewsletterForm source="footer" />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Al suscribirte aceptas nuestra{" "}
              <Link href="/legal/privacidad" className="underline">
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-10 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <Image
              src="/lirios-logo.png"
              alt="Lirios — Floristería"
              width={180}
              height={72}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Floristería artesanal. Flores de temporada, arreglos cuidados a
              mano y ramos a medida.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a
                href={BUSINESS.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <InstagramIcon className="size-4" />
                {BUSINESS.social.instagram.handle}
              </a>
              <a
                href={BUSINESS.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Tienda
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="hover:text-foreground transition">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/personalizar" className="hover:text-foreground transition">
                  Personalizar ramo
                </Link>
              </li>
              <li>
                <Link href="/ocasiones" className="hover:text-foreground transition">
                  Ocasiones
                </Link>
              </li>
              <li>
                <Link href="/suscripcion" className="hover:text-foreground transition">
                  Suscripción
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-foreground transition">
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Ayuda
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/guia" className="hover:text-foreground transition">Guía de cuidados</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition">Preguntas frecuentes</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground transition">Contacto</Link></li>
              <li><Link href="/sobre" className="hover:text-foreground transition">Historia</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {BUSINESS.address.line1}, {BUSINESS.address.cityFull}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <a href={`tel:${BUSINESS.phone.tel}`} className="hover:text-foreground">
                  {BUSINESS.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {BUSINESS.hours.weekdays.label}: {BUSINESS.hours.weekdays.range}
                  <br />
                  {BUSINESS.hours.sunday.label}: {BUSINESS.hours.sunday.range}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-foreground"
                >
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Lirios — Floristería. Hecho con cariño.</p>
          <div className="flex gap-4">
            <Link href="/legal/terminos" className="hover:text-foreground">Términos</Link>
            <Link href="/legal/privacidad" className="hover:text-foreground">Privacidad</Link>
            <Link href="/legal/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
