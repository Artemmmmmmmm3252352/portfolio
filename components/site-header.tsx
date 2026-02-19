import Link from "next/link";
import { SITE_COPY } from "@/lib/constants";
import { Locale } from "@/types/domain";
import { LocaleSwitch } from "@/components/locale-switch";

interface SiteHeaderProps {
  locale: Locale;
  studioName: string;
}

export function SiteHeader({ locale, studioName }: SiteHeaderProps) {
  const t = SITE_COPY[locale];
  const [brandMain, brandTail] = studioName.split(".");

  return (
    <header className="top-nav">
      <Link className="nav-brand" href={`/${locale}`}>
        {brandTail ? (
          <>
            {brandMain}
            <span className="brand-muted">.{brandTail}</span>
          </>
        ) : (
          studioName
        )}
      </Link>
      <nav className="nav-links">
        <a href="#projects">{t.navProjects}</a>
        <a href="#about">{t.navAbout}</a>
        <a href="#contacts">{t.navContacts}</a>
      </nav>
      <div className="header-actions">
        <LocaleSwitch locale={locale} />
        <a className="btn" href="#contacts">
          {t.writeUs}
        </a>
      </div>
    </header>
  );
}
