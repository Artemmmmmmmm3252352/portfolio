# Manual Smoke Checklist

1. Open `/` and verify redirect to `/ru`.
2. Open `/ru` and `/en`; verify localized hero copy.
3. Open `/ru/projects`; switch filters `Все`, `by Артём`, `by Никита`.
4. Open any project detail page and verify title, description, tags, date.
5. Submit contact form with valid data; verify success message.
6. Submit contact form with honeypot field set; verify request is ignored.
7. Try opening `/admin/projects` while logged out; verify redirect to `/admin/login`.
8. Login with allowlisted account; verify access to `/admin`.
9. Create project with cover and publish status; verify it appears publicly.
10. Hide project from admin list action; verify it disappears from public list.
11. Soft-delete project; verify it no longer appears in public/admin active list.
12. Update `/admin/content`; verify homepage content changes without code edits.
