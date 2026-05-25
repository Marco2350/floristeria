import { LegalLayout } from "../legal-layout";

export const metadata = { title: "Política de cookies · Lirios" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies" updated="2026-01-15">
      <p>
        Nuestro sitio usa cookies para funcionar correctamente y mejorar tu
        experiencia. Esta política explica cuáles y para qué.
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Pequeños archivos que se guardan en tu navegador cuando visitas un
        sitio. Sirven para recordar preferencias entre sesiones (idioma, lista
        de favoritos) y para medir uso del sitio.
      </p>

      <h2>Cookies que usamos</h2>
      <ul>
        <li>
          <strong>Funcionales:</strong> carrito de compra, favoritos, sesión de
          admin. Necesarias para que el sitio funcione.
        </li>
        <li>
          <strong>Analíticas:</strong> nos dicen qué páginas se visitan más, sin
          identificarte personalmente.
        </li>
        <li>
          <strong>Marketing:</strong> solo si te suscribes al newsletter,
          almacenamos un identificador para segmentar mejor lo que te enviamos.
        </li>
      </ul>

      <h2>Cómo controlarlas</h2>
      <p>
        Puedes bloquear o eliminar cookies desde la configuración de tu
        navegador. Si las bloqueas, algunas funciones pueden no trabajar
        correctamente.
      </p>

      <h2>Terceros</h2>
      <p>
        Algunas cookies pueden venir de servicios externos como nuestro
        proveedor de pagos. Cada uno tiene su propia política.
      </p>
    </LegalLayout>
  );
}
