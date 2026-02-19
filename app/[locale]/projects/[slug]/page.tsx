import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { AUTHOR_LABEL, SITE_COPY } from "@/lib/constants";
import { getPublishedProjectBySlug } from "@/lib/data";
import { localeDate, resolveLocale } from "@/lib/i18n";
import { projectCoverUrl } from "@/lib/storage";

export default async function ProjectDetailsPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocale(localeParam);
  const t = SITE_COPY[locale];
  const project = await getPublishedProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  const cover = projectCoverUrl(project.coverPath);
  const dateText = localeDate(locale, project.projectDate);

  return (
    <div className="page-shell">
      <Reveal delay={30} y={16}>
        <Link className="btn ghost" href={`/${locale}/projects`}>
          {t.backToProjects}
        </Link>
      </Reveal>

      <section className="section" style={{ marginTop: "1rem" }}>
        <Reveal delay={90} y={24}>
          {cover ? (
            <Image src={cover} alt={project.title} width={1400} height={860} className="project-cover" />
          ) : (
            <div className="project-cover" />
          )}
        </Reveal>
      </section>

      <section className="section" style={{ marginTop: "1.2rem" }}>
        <Reveal delay={130} y={24}>
          <h1 className="section-title" style={{ marginBottom: "0.5rem" }}>
            {project.title}
          </h1>
          <div className="meta-row" style={{ marginBottom: "1rem" }}>
            <span className="meta-tag meta-author">{AUTHOR_LABEL[project.author][locale]}</span>
            {dateText ? <span className="meta-tag">{dateText}</span> : null}
            {project.tags.map((tag) => (
              <span className="meta-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className="subtle" style={{ whiteSpace: "pre-wrap" }}>
            {project.description}
          </p>
        </Reveal>
      </section>
    </div>
  );
}
