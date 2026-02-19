insert into public.site_content (
  id,
  studio_name,
  hero_title_ru,
  hero_title_en,
  hero_subtitle_ru,
  hero_subtitle_en,
  about_text_ru,
  about_text_en,
  strengths_ru,
  strengths_en,
  work_format_ru,
  work_format_en,
  contact_email
)
values (
  1,
  'Cursor.ai',
  'Делаем современные веб-продукты',
  'We build modern web products',
  'Web apps • UI/UX • Автоматизация',
  'Web apps • UI/UX • Automation',
  'Мы создаем цифровые продукты: от лендингов до внутренних сервисов и MVP.',
  'We create digital products from landing pages to internal tools and MVPs.',
  'Сильны в UX, архитектуре и быстром запуске.',
  'Strong in UX, architecture, and fast launch cycles.',
  'Работаем быстро, аккуратно, под ключ.',
  'We deliver fast, carefully, and turnkey.',
  'ernestartem@outlook.com'
)
on conflict (id) do update
set
  studio_name = excluded.studio_name,
  hero_title_ru = excluded.hero_title_ru,
  hero_title_en = excluded.hero_title_en,
  hero_subtitle_ru = excluded.hero_subtitle_ru,
  hero_subtitle_en = excluded.hero_subtitle_en,
  about_text_ru = excluded.about_text_ru,
  about_text_en = excluded.about_text_en,
  strengths_ru = excluded.strengths_ru,
  strengths_en = excluded.strengths_en,
  work_format_ru = excluded.work_format_ru,
  work_format_en = excluded.work_format_en,
  contact_email = excluded.contact_email;

insert into public.projects (
  slug,
  title_ru,
  title_en,
  excerpt_ru,
  excerpt_en,
  description_ru,
  description_en,
  author,
  cover_path,
  tags,
  project_date,
  status,
  published_at
)
values
  (
    'money-map',
    'MoneyMap',
    'MoneyMap',
    'Финтех-платформа с аналитикой расходов и прогнозами.',
    'Fintech platform with expense analytics and forecasting.',
    'Платформа для управления финансами с дашбордами, сегментацией транзакций и персональными рекомендациями.',
    'Financial management platform with dashboards, transaction segmentation, and personal recommendations.',
    'artem',
    'covers/demo-moneymap.jpg',
    array['Next.js', 'Supabase', 'AI'],
    '2025-09-01',
    'published',
    now()
  ),
  (
    'ops-hub',
    'OpsHub',
    'OpsHub',
    'Внутренний сервис для автоматизации операционных процессов.',
    'Internal service for operations automation.',
    'Сервис автоматизирует ручные процессы команды: постановку задач, контроль SLA и отчеты.',
    'This service automates team manual workflows: task creation, SLA control, and reporting.',
    'nikita',
    'covers/demo-opshub.jpg',
    array['Automation', 'Dashboard'],
    '2025-11-10',
    'published',
    now()
  ),
  (
    'launch-page-kit',
    'Launch Page Kit',
    'Launch Page Kit',
    'Конструктор премиальных лендингов с быстрой кастомизацией.',
    'Premium landing page starter kit with fast customization.',
    'Шаблонный набор блоков и анимаций для быстрого запуска маркетинговых страниц.',
    'Template collection of blocks and animations for launching marketing pages quickly.',
    'artem',
    'covers/demo-launchkit.jpg',
    array['Landing', 'UI/UX'],
    '2025-12-15',
    'published',
    now()
  )
on conflict (slug) do nothing;

update public.site_content
set
  hero_title_ru = U&'\0414\0435\043B\0430\0435\043C \0441\043E\0432\0440\0435\043C\0435\043D\043D\044B\0435 \043F\0440\043E\0434\0443\043A\0442\044B',
  hero_title_en = 'We build modern products',
  hero_subtitle_ru = U&'\0421\043E\0432\0440\0435\043C\0435\043D\043D\044B\0435 \043F\0440\043E\0434\0443\043A\0442\044B | UI/UX | \0410\0432\0442\043E\043C\0430\0442\0438\0437\0430\0446\0438\044F',
  hero_subtitle_en = 'Modern products | UI/UX | Automation',
  about_text_ru = U&'\041C\044B \043F\0440\043E\0435\043A\0442\0438\0440\0443\0435\043C \0438 \0437\0430\043F\0443\0441\043A\0430\0435\043C \0446\0438\0444\0440\043E\0432\044B\0435 \043F\0440\043E\0434\0443\043A\0442\044B: \043E\0442 MVP \0438 \043B\0435\043D\0434\0438\043D\0433\043E\0432 \0434\043E \0432\043D\0443\0442\0440\0435\043D\043D\0438\0445 \0441\0435\0440\0432\0438\0441\043E\0432.',
  strengths_ru = U&'\0421\0438\043B\044C\043D\044B \0432 \043F\0440\043E\0434\0443\043A\0442\043E\0432\043E\0439 \043B\043E\0433\0438\043A\0435, UX \0438 \0447\0438\0441\0442\043E\0439 \0440\0435\0430\043B\0438\0437\0430\0446\0438\0438.',
  work_format_ru = U&'\0420\0430\0431\043E\0442\0430\0435\043C \0431\044B\0441\0442\0440\043E, \0430\043A\043A\0443\0440\0430\0442\043D\043E \0438 \043F\043E\0434 \043A\043B\044E\0447.'
where id = 1;
