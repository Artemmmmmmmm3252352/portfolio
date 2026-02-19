import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { ProjectFilterTabs } from "@/components/project-filter-tabs";
import { Reveal } from "@/components/reveal";
import { SITE_COPY } from "@/lib/constants";
import { getPublishedProjects } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import type { Author, ProjectView } from "@/types/domain";

function resolveAuthor(value?: string): "all" | Author {
  if (value === "artem" || value === "nikita") {
    return value;
  }
  return "all";
}

export default async function ProjectsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ author?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { author: authorParam } = await searchParams;
  const locale = resolveLocale(localeParam);
  const author = resolveAuthor(authorParam);
  const t = SITE_COPY[locale];
  const projects = await getPublishedProjects(locale, author);

  return (
    <div className="page-shell">
      <Reveal delay={30} y={18}>
        <div className="btn-row" style={{ justifyContent: "space-between", marginBottom: "1rem" }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            {t.ourProjects}
          </h1>
          <Link className="btn ghost" href={`/${locale}`}>
            {locale === "ru" ? "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e" : "Back home"}
          </Link>
        </div>
      </Reveal>

      <Reveal delay={80} y={20}>
        <ProjectFilterTabs locale={locale} active={author} />
      </Reveal>

      <div className="grid projects">
        {projects.map((project: ProjectView, index) => (
          <Reveal key={project.id} delay={120 + index * 70} y={26}>
            <ProjectCard locale={locale} project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
