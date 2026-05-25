import { SubscriptionClient } from "./subscription-client";

export const metadata = {
  title: "Suscripción · Lirios",
  description:
    "Flores frescas cada semana, quincena o mes. Te llegan a casa o a la oficina.",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
