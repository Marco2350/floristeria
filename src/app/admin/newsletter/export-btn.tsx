"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subscriber } from "@/lib/server/storage";

export function NewsletterExport({ subscribers }: { subscribers: Subscriber[] }) {
  function download() {
    const csv = [
      "email,source,subscribedAt",
      ...subscribers.map((s) => `${s.email},${s.source},${s.subscribedAt}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lirios-suscriptores-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button onClick={download} variant="outline" disabled={subscribers.length === 0}>
      <Download className="mr-2 size-4" />
      Exportar CSV
    </Button>
  );
}
