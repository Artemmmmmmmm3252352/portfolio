import { ProjectForm } from "@/components/admin/project-form";

export default function AdminNewProjectPage() {
  return (
    <div>
      <h1 className="section-title">New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
