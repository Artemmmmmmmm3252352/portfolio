import Link from "next/link";
import { getAdminProjects } from "@/lib/data";

export default async function AdminDashboardPage() {
  const projects = await getAdminProjects();
  const published = projects.filter((item) => item.status === "published").length;
  const drafts = projects.filter((item) => item.status === "draft").length;
  const hidden = projects.filter((item) => item.status === "hidden").length;

  return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        <article className="panel">
          <p className="small subtle">Total</p>
          <strong>{projects.length}</strong>
        </article>
        <article className="panel">
          <p className="small subtle">Published</p>
          <strong>{published}</strong>
        </article>
        <article className="panel">
          <p className="small subtle">Draft</p>
          <strong>{drafts}</strong>
        </article>
        <article className="panel">
          <p className="small subtle">Hidden</p>
          <strong>{hidden}</strong>
        </article>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Link className="btn" href="/admin/projects/new">
          Create new project
        </Link>
      </div>
    </div>
  );
}
