import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin · Lirios" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <Image
          src="/lirios-logo.png"
          alt="Lirios"
          width={180}
          height={72}
          className="mx-auto h-20 w-auto object-contain"
        />
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl tracking-tight">
            Acceso administrador
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta zona es solo para el equipo de Lirios.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
