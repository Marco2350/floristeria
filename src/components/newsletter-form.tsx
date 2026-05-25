"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  source?: "footer" | "popup" | "checkout";
  variant?: "inline" | "stacked";
  className?: string;
};

export function NewsletterForm({
  source = "footer",
  variant = "inline",
  className,
}: Props) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Correo no válido");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source, honeypot }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "Error al suscribirte");
      } else {
        toast.success(data.message || "¡Listo! Te avisaremos.");
        setEmail("");
      }
    } catch {
      toast.error("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        variant === "stacked" ? "flex flex-col gap-2" : "flex gap-2",
        className,
      )}
    >
      {/* Honeypot field, hidden from real users */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
        }}
        aria-hidden="true"
      />
      <div className={cn("relative flex-1", variant === "inline" && "min-w-0")}>
        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@correo.com"
          autoComplete="email"
          className="pl-9"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className={cn(variant === "stacked" ? "w-full" : "", "rounded-md")}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Suscribirme"
        )}
      </Button>
    </form>
  );
}
