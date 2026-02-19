"use client";

import { FormEvent, useState } from "react";
import { SITE_COPY } from "@/lib/constants";
import { Locale } from "@/types/domain";

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = SITE_COPY[locale];
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("locale", locale);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      setError(t.contactFailed);
      setIsSending(false);
      return;
    }

    form.reset();
    setMessage(t.contactSuccess);
    setIsSending(false);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <input className="field" name="name" placeholder={t.name} required />
      <input className="field" name="email" type="email" placeholder={t.email} required />
      <textarea className="field" name="message" placeholder={t.message} required />
      <input type="text" name="hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      <button className="btn primary" disabled={isSending} type="submit">
        {isSending ? t.sending : t.send}
      </button>
      {message ? <p className="small">{message}</p> : null}
      {error ? <p className="small">{error}</p> : null}
    </form>
  );
}
