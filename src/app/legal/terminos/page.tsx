import { LegalLayout } from "../legal-layout";

export const metadata = { title: "Términos y condiciones · Lirios" };

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="2026-01-15">
      <h2>1. Sobre estos términos</h2>
      <p>
        Al usar este sitio o cualquiera de nuestros servicios estás aceptando
        estos términos. Si no estás de acuerdo con alguno, no uses el sitio.
      </p>

      <h2>2. Pedidos</h2>
      <p>
        Procesamos pedidos en el orden en que se reciben. Confirmamos por correo
        en menos de 4 horas hábiles. Si no podemos surtir tu pedido por causa
        ajena (clima, escasez), te ofrecemos alternativas o reembolso completo.
      </p>

      <h2>3. Entregas</h2>
      <p>
        Las entregas se realizan en el horario y zona acordadas. Por causas
        ajenas (tráfico extraordinario, lluvia fuerte) podemos llegar hasta una
        hora más tarde sin que constituya incumplimiento.
      </p>

      <h2>4. Garantía de frescura</h2>
      <p>
        Si tu ramo no luce bien antes de 7 días contados desde la entrega, lo
        reemplazamos sin costo. Solo necesitamos una foto del estado actual.
      </p>

      <h2>5. Cancelaciones y reembolsos</h2>
      <p>
        Puedes cancelar hasta 4 horas antes de la entrega para reembolso
        completo. Después de esa hora, ofrecemos crédito por el valor del
        pedido en tu próxima compra.
      </p>

      <h2>6. Suscripciones</h2>
      <p>
        Las suscripciones se renuevan automáticamente según la frecuencia
        elegida. Puedes pausar o cancelar en cualquier momento escribiéndonos.
        Sin penalizaciones.
      </p>

      <h2>7. Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio (textos, imágenes, código) pertenece a
        Lirios — Floristería. No puede reproducirse sin autorización.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos en cualquier momento. La fecha de
        última actualización aparece arriba.
      </p>
    </LegalLayout>
  );
}
