export function docHref(slug: string) {
  return slug === "overview" ? "/api/1c-upp" : `/api/1c-upp/${slug}`;
}

export function docPriority(slug: string) {
  if (slug === "overview") {
    return 1;
  }

  if (slug === "methods") {
    return 0.9;
  }

  if (slug.startsWith("methods/")) {
    return 0.8;
  }

  if (slug === "auth" || slug === "environments") {
    return 0.85;
  }

  return 0.7;
}
