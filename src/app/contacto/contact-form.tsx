"use client";

import { useState } from "react";
import { Loader2, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.length < 2 || !email.includes("@") || message.length < 10) {
      toast.error("Completa nombre, correo y un mensaje (mín. 10 caracteres).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "No pudimos enviar tu mensaje");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Error de red");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
          <Check className="size-7 text-primary" strokeWidth={1.6} />
        </div>
        <p className="font-display text-xl">Mensaje enviado</p>
        <p className="text-sm text-muted-foreground">
          Gracias. Te contestamos pronto, casi siempre el mismo día.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden="true"
      />
      <div>
        <Label htmlFor="cf-name">Nombre</Label>
        <Input
          id="cf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="cf-email">Correo</Label>
        <Input
          id="cf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="cf-msg">Mensaje</Label>
        <Textarea
          id="cf-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
          rows={6}
          placeholder="Cuéntanos qué necesitas…"
          className="mt-1.5 resize-none"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
          {message.length}/2000
        </p>
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  );
}
