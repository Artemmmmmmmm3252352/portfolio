import Link from "next/link";
import { AUTHOR_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Author, Locale } from "@/types/domain";

interface ProjectFilterTabsProps {
  locale: Locale;
  active: "all" | Author;
}

export function ProjectFilterTabs({ locale, active }: ProjectFilterTabsProps) {
  return (
    <div className="chip-tabs">
      {AUTHOR_FILTERS.map((item: { value: "all" | Author; label: Record<Locale, string> }) => (
        <Link
          key={item.value}
          className={cn("chip", active === item.value && "active")}
          href={`/${locale}/projects${item.value === "all" ? "" : `?author=${item.value}`}`}
        >
          {item.label[locale]}
        </Link>
      ))}
    </div>
  );
}
