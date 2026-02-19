import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <strong>Admin</strong>
          <Link className="chip" href="/admin">
            Dashboard
          </Link>
          <Link className="chip" href="/admin/projects">
            Projects
          </Link>
          <Link className="chip" href="/admin/content">
            Content
          </Link>
          <LogoutButton />
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
