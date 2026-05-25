import { LegalLayout } from "../legal-layout";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "Aviso de privacidad · Lirios" };

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Aviso de privacidad" updated="2026-01-15">
      <p>
        Lirios — Floristería (en adelante "nosotros") respeta tu privacidad.
        Este aviso explica qué datos recolectamos, para qué y cómo los
        protegemos, conforme a la Ley Federal de Protección de Datos Personales
        en Posesión de los Particulares.
      </p>

      <h2>1. Datos que recolectamos</h2>
      <ul>
        <li>Datos de contacto: nombre, correo, teléfono.</li>
        <li>Datos de entrega: dirección, datos del destinatario (cuando aplica).</li>
        <li>Datos de uso: páginas visitadas, productos vistos.</li>
        <li>Datos de pago: procesados directamente por nuestro proveedor (no almacenamos números de tarjeta).</li>
      </ul>

      <h2>2. Para qué los usamos</h2>
      <ul>
        <li>Procesar y entregar tus pedidos.</li>
        <li>Coordinar entregas con destinatarios.</li>
        <li>Enviarte confirmaciones, recordatorios y, si te suscribiste, novedades.</li>
        <li>Mejorar nuestro sitio y selección de productos.</li>
      </ul>

      <h2>3. Con quién compartimos</h2>
      <p>
        Con proveedores estrictamente necesarios: servicio de paquetería,
        procesador de pagos, plataforma de correo. Nunca vendemos tus datos a
        terceros.
      </p>

      <h2>4. Cómo los protegemos</h2>
      <p>
        Usamos conexión HTTPS, almacenamiento cifrado y acceso restringido al
        personal autorizado. Los pagos se procesan en infraestructura
        certificada PCI-DSS.
      </p>

      <h2>5. Tus derechos sobre tus datos</h2>
      <p>
        Puedes solicitar acceder, rectificar, cancelar u oponerte al tratamiento
        de tus datos personales. Escríbenos a{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> con tu
        solicitud.
      </p>

      <h2>6. Retención</h2>
      <p>
        Conservamos datos de pedidos por 5 años por obligaciones fiscales.
        Datos de marketing los conservamos mientras estés suscrito.
      </p>

      <h2>7. Cambios</h2>
      <p>
        Si actualizamos este aviso, publicamos la nueva versión aquí con su
        fecha. Los cambios sustanciales los notificamos por correo.
      </p>
    </LegalLayout>
  );
}
