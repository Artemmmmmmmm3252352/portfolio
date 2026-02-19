import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminProjectById } from "@/lib/data";

export default async function AdminEditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="section-title">Edit Project</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
