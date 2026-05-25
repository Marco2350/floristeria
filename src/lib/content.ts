/**
 * Static content: testimonials, FAQ, care-guide articles.
 */

export type Testimonial = {
  id: string;
  author: string;
  city: string;
  rating: number; // 1-5
  text: string;
  occasion?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Sofía R.",
    city: "El Progreso",
    rating: 5,
    text:
      "Las flores llegaron impecables y olían increíble. Mi mamá lloró al abrir la caja, y eso ya vale la pena.",
    occasion: "Día de la Madre",
  },
  {
    id: "t2",
    author: "Carlos M.",
    city: "Santa Rita",
    rating: 5,
    text:
      "Pedí un ramo personalizado y me lo armaron exactamente como lo describí. Lo entregaron en la hora exacta.",
  },
  {
    id: "t3",
    author: "Andrea V.",
    city: "El Progreso",
    rating: 5,
    text:
      "La suscripción semanal cambió mi casa. Cada lunes hay flores nuevas y siempre llegan a tiempo.",
    occasion: "Suscripción",
  },
  {
    id: "t4",
    author: "Marisol P.",
    city: "San Pedro Sula",
    rating: 5,
    text:
      "Calidad muy superior a las floristerías de la zona. Atención cálida y profesional desde el primer mensaje.",
  },
  {
    id: "t5",
    author: "Daniel H.",
    city: "El Progreso",
    rating: 5,
    text:
      "El detalle del papel kraft y el listón burgundy hicieron que el ramo se viera mucho más caro de lo que pagué.",
    occasion: "Aniversario",
  },
  {
    id: "t6",
    author: "Ximena C.",
    city: "Yoro",
    rating: 5,
    text:
      "Llamé porque necesitaba un arreglo de condolencias y fueron sensibles y rápidos. Mi familia agradece mucho.",
    occasion: "Condolencias",
  },
];

/* ── FAQ ────────────────────────────────────────────────── */
export type FaqItem = { q: string; a: string };

export const faqs: { category: string; items: FaqItem[] }[] = [
  {
    category: "Entregas y envíos",
    items: [
      {
        q: "¿Hacen entregas el mismo día?",
        a: "Sí, si haces tu pedido antes de las 14:00. Para entregas en colonias fuera del centro, lo confirmamos por WhatsApp.",
      },
      {
        q: "¿Cuáles son sus zonas de envío?",
        a: "Cubrimos El Progreso, Santa Rita, el resto del departamento de Yoro y la zona metropolitana de San Pedro Sula. Las zonas y precios los ves al hacer tu pedido. Para otros destinos, escríbenos antes.",
      },
      {
        q: "¿Puedo elegir hora específica de entrega?",
        a: "Sí, tenemos tres bloques (mañana, mediodía, tarde). Si necesitas una hora exacta, llámanos y lo coordinamos sin costo.",
      },
      {
        q: "¿Las entregas son sorpresa o avisan al destinatario?",
        a: "Tú decides. En el checkout marcas si quieres que sea sorpresa. Si es sorpresa, no llamamos antes — solo si la dirección genera dudas.",
      },
    ],
  },
  {
    category: "Productos y frescura",
    items: [
      {
        q: "¿De dónde vienen sus flores?",
        a: "Trabajamos con productores locales del valle de Sula y otros departamentos del país. Recogemos por la madrugada, así que todo lo que ves se cortó esa misma mañana o el día anterior.",
      },
      {
        q: "¿Cuánto duran los ramos?",
        a: "Con buen cuidado, mínimo 5–7 días. Te incluimos un sobrecito de alimento y una guía. Si en menos de 7 días algo no luce bien, lo reemplazamos.",
      },
      {
        q: "¿Puedo cambiar flores del catálogo si alguna no me gusta?",
        a: "Sí. Usa el personalizador o escríbenos. Si se puede, lo hacemos sin costo extra.",
      },
    ],
  },
  {
    category: "Personalización",
    items: [
      {
        q: "¿Puedo pedir flores específicas que no están en el catálogo?",
        a: "Sí, si están de temporada. Escríbenos por WhatsApp con lo que necesitas y te confirmamos disponibilidad y precio.",
      },
      {
        q: "¿La tarjeta dedicatoria tiene costo extra?",
        a: "No. La incluimos en cartulina de algodón, escrita a mano.",
      },
    ],
  },
  {
    category: "Pagos y cancelaciones",
    items: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Estamos integrando pagos con tarjeta directamente. Mientras tanto: transferencia bancaria y depósito. Te llegan los datos en el correo de confirmación.",
      },
      {
        q: "¿Puedo cancelar mi pedido?",
        a: "Sí, hasta 4 horas antes de la entrega. Si ya armamos el ramo, te ofrecemos crédito para la próxima compra.",
      },
      {
        q: "¿Cómo cancelo mi suscripción?",
        a: "Escríbenos por correo o WhatsApp. Sin pasos engorrosos. Tú decides cuándo.",
      },
    ],
  },
];

/* ── Care guide articles ───────────────────────────────── */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Cuidados" | "Estilo" | "Significado" | "Eventos";
  readingMinutes: number;
  hero: { gradient: string };
  body: { heading?: string; paragraph: string }[];
};

export const articles: Article[] = [
  {
    slug: "como-cuidar-rosas-cortadas",
    title: "Cómo cuidar tus rosas para que duren el doble",
    excerpt:
      "Cinco gestos pequeños que cambian todo. Aplica también para tulipanes y peonías.",
    category: "Cuidados",
    readingMinutes: 4,
    hero: { gradient: "from-rose-100 via-amber-50 to-stone-100" },
    body: [
      {
        paragraph:
          "Las flores cortadas no son frágiles — son sedientas. Si haces estas cinco cosas bien, te duran fácil 8–10 días sin perder estructura.",
      },
      {
        heading: "1. Corte en diagonal, bajo agua",
        paragraph:
          "Antes de meter la rosa al jarrón, corta 1–2 cm del tallo con un cuchillo afilado, en diagonal, sumergido en agua. Eso evita que entre aire y bloquee los conductos.",
      },
      {
        heading: "2. Quita hojas bajo la línea del agua",
        paragraph:
          "Las hojas sumergidas se pudren y contaminan el agua. Saca todo lo que vaya debajo del nivel.",
      },
      {
        heading: "3. Agua fría, no tibia",
        paragraph:
          "Las flores absorben mejor en agua fría. Cambia el agua cada dos días, y aprovecha para recortar 5 mm del tallo cada vez.",
      },
      {
        heading: "4. Lejos del sol directo y de la fruta",
        paragraph:
          "El calor las marchita rápido. Y la fruta madura emite etileno, que acelera el deterioro.",
      },
      {
        heading: "5. Usa el sobre que viene en el ramo",
        paragraph:
          "El polvo blanco que incluimos no es decoración — es alimento, regulador de pH y antibacterial. Diluye uno por jarrón.",
      },
    ],
  },
  {
    slug: "que-flores-regalar-segun-ocasion",
    title: "Qué flores regalar según la ocasión",
    excerpt:
      "Un mapa rápido por color y tipo. Para que no te equivoques nunca.",
    category: "Significado",
    readingMinutes: 5,
    hero: { gradient: "from-pink-100 via-amber-50 to-rose-100" },
    body: [
      {
        paragraph:
          "El lenguaje de las flores no es supersticioso — es lectura cultural. Estos son los códigos que la gente sí lee.",
      },
      {
        heading: "Amor romántico",
        paragraph:
          "Rosas rojas (las clásicas, no falla), peonías, tulipanes rojos. Si quieres ir menos obvio: rosas rosa polvo + velo de novia.",
      },
      {
        heading: "Amistad y cariño",
        paragraph:
          "Margaritas, girasoles, tulipanes amarillos. Colores cálidos, sin la carga romántica del rojo.",
      },
      {
        heading: "Felicitación profesional",
        paragraph:
          "Algo elegante y neutro: lirios blancos, orquídeas, hortensias azules. Comunica formalidad sin frialdad.",
      },
      {
        heading: "Condolencias",
        paragraph:
          "Lirios blancos, rosas blancas, eucalipto. Blancos y verdes — nada de colores brillantes. Habla en susurros.",
      },
      {
        heading: "Nacimiento",
        paragraph:
          "Tonos suaves: rosa polvo si es niña, amarillo y verde si es niño o si prefieres no asignar. Margaritas funcionan siempre.",
      },
    ],
  },
  {
    slug: "como-elegir-jarron",
    title: "Cómo elegir el jarrón correcto",
    excerpt: "Tres reglas que marcan la diferencia entre amateur y bonito.",
    category: "Estilo",
    readingMinutes: 3,
    hero: { gradient: "from-stone-100 via-amber-50 to-emerald-50" },
    body: [
      {
        paragraph:
          "El jarrón es la mitad del trabajo. Estas son las tres reglas que usamos en estudio.",
      },
      {
        heading: "1. Altura: jarrón = 1/2 del ramo",
        paragraph:
          "El jarrón debe medir aproximadamente la mitad de la altura total del ramo, contando flores y tallos. Más bajo y se desparrama, más alto y se ve cabeza pequeña.",
      },
      {
        heading: "2. Diámetro: justo, no apretado",
        paragraph:
          "El cuello del jarrón debe sostener los tallos sin apretarlos. Si los aprietas, no respiran y se pudren más rápido.",
      },
      {
        heading: "3. Color: contraste sutil",
        paragraph:
          "Si el ramo es muy colorido, jarrón neutro (vidrio, blanco, terracota). Si el ramo es monocromático, puedes jugar con un jarrón con personalidad.",
      },
    ],
  },
  {
    slug: "flores-de-temporada-en-mexico",
    title: "Flores de temporada en Honduras, mes a mes",
    excerpt:
      "Cuándo conseguir peonías, cuándo evitar los girasoles. La temporada importa más que el origen.",
    category: "Cuidados",
    readingMinutes: 4,
    hero: { gradient: "from-emerald-100 via-amber-100 to-rose-100" },
    body: [
      {
        paragraph:
          "Comprar en temporada significa más fresco, más barato y más bonito. Esta es la guía corta.",
      },
      {
        heading: "Primavera (marzo–mayo)",
        paragraph:
          "Peonías, tulipanes, lirios, ranúnculos, anémonas. Es el mejor momento del año si quieres variedad.",
      },
      {
        heading: "Verano (junio–agosto)",
        paragraph:
          "Girasoles, hortensias, lavanda, margaritas, dalias. Colores brillantes y volumen — perfectos para mesa larga.",
      },
      {
        heading: "Otoño (sept–nov)",
        paragraph:
          "Crisantemos, calas, eucalipto, gerberas y flores ornamentales propias de la temporada.",
      },
      {
        heading: "Invierno (dic–feb)",
        paragraph:
          "Amarilis, rosas (que están todo el año), poinsettias, hellebores. Menos variedad pero más drama.",
      },
    ],
  },
  {
    slug: "ramo-novia-segun-vestido",
    title: "Cómo elegir el ramo de novia según tu vestido",
    excerpt:
      "Una guía honesta, sin pasarse de pinterest. Para casarse con flores que realmente te van.",
    category: "Eventos",
    readingMinutes: 6,
    hero: { gradient: "from-stone-100 via-rose-50 to-amber-50" },
    body: [
      {
        paragraph:
          "El ramo de novia es de las pocas decisiones del día que sí se ve en cada foto. Vale la pena pensarlo.",
      },
      {
        heading: "Vestido recto / minimalista",
        paragraph:
          "Ramo pequeño y estructurado. Una sola flor protagonista (peonía gigante, cala) y verdes finos. Sin volumen.",
      },
      {
        heading: "Vestido princesa / con volumen",
        paragraph:
          "Ramo redondo, denso, abundante. Peonías, rosas y verdes generosos. Que compita con la falda.",
      },
      {
        heading: "Vestido boho / ligero",
        paragraph:
          "Ramo cascada o asimétrico, con flores silvestres, eucalipto largo, lazos al aire. Que se vea suelto, no atado.",
      },
      {
        heading: "Vestido vintage",
        paragraph:
          "Tonos polvo: rosa palo, durazno, crema. Peonías, lisianthus, rosas David Austin. Aire de jardín inglés.",
      },
      {
        heading: "Consejo de oficio",
        paragraph:
          "Trae fotos de tu vestido, no del ramo de Pinterest. El ramo se diseña alrededor de ti, no al revés.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
