import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <h1 className="section-title">404</h1>
      <p className="subtle">Page not found.</p>
      <Link className="btn" href="/ru">
        Go home
      </Link>
    </div>
  );
}
