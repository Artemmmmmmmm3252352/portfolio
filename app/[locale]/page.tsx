import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SITE_COPY } from "@/lib/constants";
import { getFeaturedProjects, getSiteContent } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import { teamPhotoUrl } from "@/lib/storage";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const [content, featuredProjects] = await Promise.all([getSiteContent(locale), getFeaturedProjects(locale, 3)]);
  const t = SITE_COPY[locale];
  const defaultAboutPhoto1 = "/foto-1.jpg";
  const defaultAboutPhoto2 = "/foto-2.png";

  return (
    <div className="page-shell">
      <Reveal delay={20} y={16}>
        <SiteHeader locale={locale} studioName={content.studioName} />
      </Reveal>

      <section className="hero">
        <Reveal className="hero-copy" delay={80}>
          <div>
            <h1>{content.heroTitle}</h1>
            <p className="hero-subtitle">{content.heroSubtitle}</p>
            <div className="btn-row hero-cta">
              <Link className="btn primary" href={`/${locale}/projects`}>
                {t.viewProjects}
              </Link>
              <a className="btn" href="#contacts">
                {t.discussProject}
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal className="hero-media" delay={180} y={36}>
          <Image
            src="/hero-3d-fon.png"
            alt={content.studioName}
            width={1600}
            height={1100}
            className="hero-shot"
            priority
          />
        </Reveal>
      </section>

      <section className="section">
        <Reveal delay={120}>
          <p className="intro-lead">
            {content.aboutText} {content.strengths} {content.workFormat}
          </p>
        </Reveal>
      </section>

      <section className="section projects-block" id="projects">
        <Reveal delay={140}>
          <div className="projects-frame">
            <h2 className="section-title">{t.ourProjects}</h2>
            <div className="grid projects">
              {featuredProjects.map((project, index) => (
                <Reveal key={project.id} delay={90 + index * 100} y={26}>
                  <ProjectCard locale={locale} project={project} />
                </Reveal>
              ))}
            </div>
            <div className="projects-cta">
              <Link className="btn projects-btn" href={`/${locale}/projects`}>
                {t.allProjects}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section two-col" id="about">
        <Reveal delay={100}>
          <article className="panel">
            <h2 className="section-title">{t.aboutTitle}</h2>
            <p className="subtle">{content.aboutText}</p>
            <p className="subtle">{content.strengths}</p>
            <p className="subtle">{content.workFormat}</p>
          </article>
        </Reveal>
        <Reveal delay={180}>
          <article className="panel">
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {content.teamPhoto1Path ? (
                <Image
                  src={teamPhotoUrl(content.teamPhoto1Path) ?? defaultAboutPhoto1}
                  alt="Team photo 1"
                  width={540}
                  height={540}
                  className="project-cover"
                />
              ) : (
                <Image src={defaultAboutPhoto1} alt="Team photo 1" width={540} height={540} className="project-cover" />
              )}
              {content.teamPhoto2Path ? (
                <Image
                  src={teamPhotoUrl(content.teamPhoto2Path) ?? defaultAboutPhoto2}
                  alt="Team photo 2"
                  width={540}
                  height={540}
                  className="project-cover"
                />
              ) : (
                <Image src={defaultAboutPhoto2} alt="Team photo 2" width={540} height={540} className="project-cover" />
              )}
            </div>
          </article>
        </Reveal>
      </section>

      <section className="section two-col" id="contacts">
        <Reveal delay={90}>
          <article className="panel">
            <h2 className="section-title">{t.contactTitle}</h2>
            <p>
              <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
            </p>
            <a className="btn ghost" href={`mailto:${content.contactEmail}`}>
              {t.writeUs}
            </a>
          </article>
        </Reveal>
        <Reveal delay={170}>
          <article className="panel">
            <ContactForm locale={locale} />
          </article>
        </Reveal>
      </section>
    </div>
  );
}
