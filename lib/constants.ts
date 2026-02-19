import { Author, Locale } from "@/types/domain";

export const LOCALES: Locale[] = ["ru", "en"];

export const DEFAULT_LOCALE: Locale = "ru";

export const AUTHOR_FILTERS: Array<{ value: "all" | Author; label: Record<Locale, string> }> = [
  { value: "all", label: { ru: "Все", en: "All" } },
  { value: "artem", label: { ru: "by Артём", en: "by Artem" } },
  { value: "nikita", label: { ru: "by Никита", en: "by Nikita" } }
];

export const AUTHOR_LABEL: Record<Author, Record<Locale, string>> = {
  artem: { ru: "by Артём", en: "by Artem" },
  nikita: { ru: "by Никита", en: "by Nikita" }
};

export const SITE_COPY = {
  ru: {
    navProjects: "Проекты",
    navAbout: "О нас",
    navContacts: "Контакты",
    writeUs: "Написать",
    viewProjects: "Посмотреть проекты",
    discussProject: "Обсудить проект",
    allProjects: "Смотреть все проекты",
    ourProjects: "Наши проекты",
    aboutTitle: "О нас",
    contactTitle: "Контакты",
    backToProjects: "Назад к проектам",
    send: "Отправить",
    sending: "Отправка...",
    name: "Имя",
    email: "Email",
    message: "Сообщение",
    contactSuccess: "Спасибо! Сообщение отправлено.",
    contactFailed: "Не удалось отправить сообщение. Попробуйте позже.",
    adminProjects: "Проекты",
    adminContent: "Контент",
    adminLogout: "Выйти",
    adminLogin: "Вход в админку",
    adminDashboard: "Панель управления",
    adminNewProject: "Новый проект",
    adminSave: "Сохранить",
    adminDelete: "Удалить",
    adminPublish: "Опубликовать",
    adminHide: "Скрыть"
  },
  en: {
    navProjects: "Projects",
    navAbout: "About",
    navContacts: "Contacts",
    writeUs: "Contact",
    viewProjects: "View projects",
    discussProject: "Discuss project",
    allProjects: "See all projects",
    ourProjects: "Our projects",
    aboutTitle: "About us",
    contactTitle: "Contacts",
    backToProjects: "Back to projects",
    send: "Send",
    sending: "Sending...",
    name: "Name",
    email: "Email",
    message: "Message",
    contactSuccess: "Thanks! Your message has been sent.",
    contactFailed: "Unable to send message. Please try again later.",
    adminProjects: "Projects",
    adminContent: "Content",
    adminLogout: "Logout",
    adminLogin: "Admin login",
    adminDashboard: "Dashboard",
    adminNewProject: "New project",
    adminSave: "Save",
    adminDelete: "Delete",
    adminPublish: "Publish",
    adminHide: "Hide"
  }
} as const;
