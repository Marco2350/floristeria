"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../productos/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { DiscountCode } from "@/lib/server/storage";

export function DiscountsEditor({ initial }: { initial: DiscountCode[] }) {
  const [codes, setCodes] = useState<DiscountCode[]>(initial);
  const [saving, setSaving] = useState(false);

  function update(idx: number, patch: Partial<DiscountCode>) {
    setCodes((cs) => cs.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function add() {
    setCodes((cs) => [
      ...cs,
      {
        code: "NUEVO",
        type: "percent",
        value: 10,
        minSubtotal: 0,
        active: true,
        description: "Descripción del cupón",
      },
    ]);
  }

  function remove(idx: number) {
    setCodes((cs) => cs.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(codes),
      });
      const data = await res.json();
      if (!data.ok) toast.error("Error al guardar");
      else toast.success("Guardado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {codes.map((c, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-[1fr_120px_120px_120px_auto] sm:items-end"
          >
            <div>
              <Label className="text-xs">Código</Label>
              <Input
                value={c.code}
                onChange={(e) => update(i, { code: e.target.value.toUpperCase() })}
                className="mt-1 h-9 uppercase"
              />
              <Label className="mt-2 block text-xs">Descripción</Label>
              <Input
                value={c.description}
                onChange={(e) => update(i, { description: e.target.value })}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <select
                value={c.type}
                onChange={(e) => update(i, { type: e.target.value as "percent" | "flat" })}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="percent">% descuento</option>
                <option value="flat">L. descuento</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Valor</Label>
              <Input
                type="number"
                value={c.value}
                onChange={(e) => update(i, { value: Number(e.target.value) })}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Mínimo</Label>
              <Input
                type="number"
                value={c.minSubtotal}
                onChange={(e) => update(i, { minSubtotal: Number(e.target.value) })}
                className="mt-1 h-9"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={c.active}
                  onChange={(v) => update(i, { active: v })}
                />
                <span className="text-xs">Activo</span>
              </div>
              <button
                onClick={() => remove(i)}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="inline size-3" /> Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={add}>
          <Plus className="mr-1 size-4" />
          Agregar cupón
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
