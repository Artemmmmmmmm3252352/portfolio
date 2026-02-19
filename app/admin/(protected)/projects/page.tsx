import Image from "next/image";
import Link from "next/link";
import { ProjectActions } from "@/components/admin/project-actions";
import { getAdminProjects } from "@/lib/data";
import { projectCoverUrl } from "@/lib/storage";
import type { ProjectRow } from "@/types/domain";

export default async function AdminProjectsPage() {
  const projects: ProjectRow[] = await getAdminProjects();

  return (
    <div>
      <div className="btn-row" style={{ justifyContent: "space-between", marginBottom: "0.8rem" }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          Projects
        </h1>
        <Link className="btn primary" href="/admin/projects/new">
          Add project
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: ProjectRow) => {
            const coverUrl = projectCoverUrl(project.cover_path);

            return (
              <tr key={project.id}>
                <td>
                  {coverUrl ? (
                    <Image src={coverUrl} alt={project.title_ru} width={90} height={56} style={{ borderRadius: 8 }} />
                  ) : (
                    <div style={{ width: 90, height: 56, borderRadius: 8, background: "#efefeb" }} />
                  )}
                </td>
                <td>{project.title_ru}</td>
                <td>{project.author === "artem" ? "by Артём" : "by Никита"}</td>
                <td>{project.status}</td>
                <td>{new Date(project.updated_at).toLocaleString()}</td>
                <td>
                  <ProjectActions id={project.id} status={project.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
