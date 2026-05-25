import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .email("Correo no válido");

export const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^[\d\s+()-]+$/, "Teléfono no válido");

export const nameSchema = z.string().trim().min(2).max(80);

/** Newsletter subscription */
export const newsletterSchema = z.object({
  email: emailSchema,
  honeypot: z.string().max(0).optional(), // must be empty
  source: z.enum(["footer", "popup", "checkout"]).default("footer"),
});

/** Contact message */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z.string().trim().min(10).max(2000),
  honeypot: z.string().max(0).optional(),
});

/** Discount code lookup */
export const discountSchema = z.object({
  code: z.string().trim().min(2).max(40),
  subtotal: z.number().nonnegative(),
});

/** Order creation */
export const orderItemProductSchema = z.object({
  type: z.literal("product"),
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
  unitPrice: z.number().nonnegative(),
  title: z.string().min(1).max(200),
});

export const orderItemCustomSchema = z.object({
  type: z.literal("custom"),
  qty: z.number().int().min(1).max(20),
  unitPrice: z.number().nonnegative(),
  flowers: z
    .array(z.object({ flowerId: z.string(), qty: z.number().int().min(1).max(40) }))
    .min(1)
    .max(40),
  wrapId: z.string().min(1),
  ribbonId: z.string().min(1),
  cardMessage: z.string().max(240).default(""),
});

export const orderSchema = z.object({
  customer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  }),
  delivery: z.object({
    method: z.enum(["envio", "pickup"]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
    timeSlot: z.string().min(3).max(40),
    address: z.string().max(240).optional(),
    city: z.string().max(80).optional(),
    zone: z.string().max(80).optional(),
    zonePrice: z.number().nonnegative().default(0),
    recipientName: z.string().max(80).optional(),
    recipientPhone: z.string().max(20).optional(),
    cardMessage: z.string().max(240).optional(),
    surprise: z.boolean().default(false),
  }),
  items: z
    .array(z.discriminatedUnion("type", [orderItemProductSchema, orderItemCustomSchema]))
    .min(1)
    .max(20),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z
    .object({
      code: z.string().min(1).max(40),
      amount: z.number().nonnegative(),
    })
    .nullable(),
  total: z.number().nonnegative(),
  notes: z.string().max(500).optional(),
  honeypot: z.string().max(0).optional(),
});

/** Admin login */
export const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
});

/** Subscription signup */
export const subscriptionSchema = z.object({
  customer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: z.string().min(5).max(240),
    city: z.string().min(2).max(80),
  }),
  plan: z.enum(["semanal", "quincenal", "mensual"]),
  size: z.enum(["petit", "clasico", "grande"]),
  preferences: z.object({
    palette: z.string().max(80).default(""),
    notes: z.string().max(500).default(""),
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  honeypot: z.string().max(0).optional(),
});
