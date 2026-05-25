import { AdminShell } from "./admin-shell";

export const metadata = {
  title: "Admin · Lirios",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
