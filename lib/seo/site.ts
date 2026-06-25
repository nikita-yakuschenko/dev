export const SITE_URL = "https://dev.avgst.ru";
export const SITE_NAME = "dev.avgst";
export const SITE_TITLE = "dev.avgst — портал разработчика AVGST";
export const SITE_DESCRIPTION =
  "Документация HTTP API 1С УПП, правила интеграции, методы, авторизация и changelog для команды AVGST.";
export const SITE_LOCALE = "ru_RU";
export const SITE_KEYWORDS = [
  "AVGST",
  "1С УПП",
  "HTTP API",
  "интеграция",
  "документация API",
  "dev.avgst",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function buildPageTitle(pageTitle?: string) {
  if (!pageTitle) {
    return SITE_TITLE;
  }

  return `${pageTitle} · ${SITE_NAME}`;
}

export function excerptFromMarkdown(content: string, maxLength = 160) {
  const plain = content
    .replace(/^#+\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_>#|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength - 1).trim()}…`;
}
