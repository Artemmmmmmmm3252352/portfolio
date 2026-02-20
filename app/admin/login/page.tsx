"use client";

import { FormEvent, useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/admin");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) {
      setNextPath(next);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Login failed" }));
      setError(payload.error ?? "Login failed");
      setLoading(false);
      return;
    }

    const payload = await response.json();
    window.location.href = payload.next ?? "/admin";
  }

  return (
    <div className="admin-shell">
      <div className="panel" style={{ maxWidth: 460, margin: "4rem auto" }}>
        <h1 className="section-title" style={{ marginBottom: "1rem" }}>
          Admin Login
        </h1>
        <form className="form" onSubmit={onSubmit}>
          <input
            className="field"
            type="text"
            name="email"
            placeholder="Login or email"
            autoComplete="username"
            required
          />
          <input className="field" type="password" name="password" placeholder="Password" required />
          <input type="hidden" name="next" value={nextPath} />
          <button className="btn primary" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {error ? <p className="small">{error}</p> : null}
      </div>
    </div>
  );
}
