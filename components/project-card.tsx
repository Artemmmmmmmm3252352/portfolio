import Image from "next/image";
import Link from "next/link";
import { AUTHOR_LABEL } from "@/lib/constants";
import { projectCoverUrl } from "@/lib/storage";
import { Locale, ProjectView } from "@/types/domain";

interface ProjectCardProps {
  locale: Locale;
  project: ProjectView;
}

export function ProjectCard({ locale, project }: ProjectCardProps) {
  const coverUrl = projectCoverUrl(project.coverPath);

  return (
    <Link className="project-card" href={`/${locale}/projects/${project.slug}`}>
      {coverUrl ? (
        <Image src={coverUrl} alt={project.title} width={800} height={500} className="project-cover" />
      ) : (
        <div className="project-cover" />
      )}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-excerpt">{project.excerpt}</p>
        <div className="meta-row">
          <span className="meta-tag meta-author">{AUTHOR_LABEL[project.author][locale]}</span>
          {project.tags.slice(0, 3).map((tag) => (
            <span className="meta-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
