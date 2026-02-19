"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Locale } from "@/types/domain";

interface LocaleSwitchProps {
  locale: Locale;
}

export function LocaleSwitch({ locale }: LocaleSwitchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const getHref = (target: Locale) => {
    const segments = pathname.split("/");
    if (segments[1] === "ru" || segments[1] === "en") {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }

    const path = segments.join("/");
    return query ? `${path}?${query}` : path;
  };

  return (
    <div className="locale-switch">
      <Link className={cn("chip", locale === "ru" && "active")} href={getHref("ru")}>
        RU
      </Link>
      <Link className={cn("chip", locale === "en" && "active")} href={getHref("en")}>
        EN
      </Link>
    </div>
  );
}
