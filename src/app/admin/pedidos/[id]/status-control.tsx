"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = [
  "pendiente",
  "confirmado",
  "preparando",
  "en-camino",
  "entregado",
  "cancelado",
] as const;

export function OrderStatusControl({
  id,
  initial,
}: {
  id: string;
  initial: (typeof STATUSES)[number];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<typeof initial>(initial);
  const [loading, setLoading] = useState(false);

  async function update(next: (typeof STATUSES)[number]) {
    if (next === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error("No se pudo actualizar");
        return;
      }
      setStatus(next);
      toast.success(`Estado: ${next.replace("-", " ")}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <select
        value={status}
        onChange={(e) => update(e.target.value as (typeof STATUSES)[number])}
        disabled={loading}
        className={cn(
          "h-9 rounded-md border border-input bg-card px-3 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("-", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
