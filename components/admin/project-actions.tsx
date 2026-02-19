"use client";

import { useTransition } from "react";

interface ProjectActionsProps {
  id: string;
  status: "draft" | "published" | "hidden";
}

export function ProjectActions({ id, status }: ProjectActionsProps) {
  const [isPending, startTransition] = useTransition();

  function call(url: string, method: "POST" | "DELETE") {
    startTransition(async () => {
      await fetch(url, { method });
      window.location.reload();
    });
  }

  return (
    <div className="admin-actions">
      <a className="btn ghost small" href={`/admin/projects/${id}/edit`}>
        Edit
      </a>
      {status === "published" ? (
        <button
          className="btn small"
          disabled={isPending}
          onClick={() => call(`/api/admin/projects/${id}/hide`, "POST")}
          type="button"
        >
          Hide
        </button>
      ) : (
        <button
          className="btn small"
          disabled={isPending}
          onClick={() => call(`/api/admin/projects/${id}/publish`, "POST")}
          type="button"
        >
          Publish
        </button>
      )}
      <button
        className="btn small"
        disabled={isPending}
        onClick={() => {
          if (window.confirm("Delete project?")) {
            call(`/api/admin/projects/${id}`, "DELETE");
          }
        }}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
