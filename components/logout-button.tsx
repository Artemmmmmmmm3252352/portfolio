"use client";

export function LogoutButton() {
  async function onClick() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button className="btn ghost" onClick={onClick} type="button">
      Logout
    </button>
  );
}
