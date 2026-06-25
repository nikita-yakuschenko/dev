import { getDocsDb } from "@/lib/docs/db";
import { docInputSchema, type DocInput, type DocPage } from "@/lib/docs/types";

type DocRow = {
  id: number;
  title: string;
  slug: string;
  section: string;
  nav_title: string;
  sort_order: number;
  content: string;
  created_at: string;
  updated_at: string;
};

function mapDoc(row: DocRow): DocPage {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    section: row.section,
    navTitle: row.nav_title,
    order: row.sort_order,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeDocSlug(slug?: string | string[]) {
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return "overview";
  }

  const value = Array.isArray(slug) ? slug.join("/") : slug;

  return value === "" ? "overview" : value;
}

export function listDocs(section = "1c-upp") {
  const rows = getDocsDb()
    .prepare(
      `
      SELECT * FROM docs_pages
      WHERE section = ?
      ORDER BY sort_order ASC, title ASC
    `,
    )
    .all(section) as DocRow[];

  return rows.map(mapDoc);
}

export function searchDocs(query: string, section = "1c-upp") {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return listDocs(section);
  }

  const likeQuery = `%${trimmedQuery}%`;
  const rows = getDocsDb()
    .prepare(
      `
      SELECT * FROM docs_pages
      WHERE section = ?
        AND (
          title LIKE ?
          OR slug LIKE ?
          OR nav_title LIKE ?
          OR content LIKE ?
        )
      ORDER BY sort_order ASC, title ASC
    `,
    )
    .all(section, likeQuery, likeQuery, likeQuery, likeQuery) as DocRow[];

  return rows.map(mapDoc);
}

export function getDocBySlug(slug: string, section = "1c-upp") {
  const row = getDocsDb()
    .prepare("SELECT * FROM docs_pages WHERE slug = ? AND section = ?")
    .get(slug, section) as DocRow | undefined;

  return row ? mapDoc(row) : null;
}

export function getDocById(id: number) {
  const row = getDocsDb()
    .prepare("SELECT * FROM docs_pages WHERE id = ?")
    .get(id) as DocRow | undefined;

  return row ? mapDoc(row) : null;
}

export function createDoc(input: DocInput) {
  const doc = docInputSchema.parse(input);
  const result = getDocsDb()
    .prepare(
      `
      INSERT INTO docs_pages (title, slug, section, nav_title, sort_order, content)
      VALUES (@title, @slug, @section, @navTitle, @order, @content)
    `,
    )
    .run(doc);

  return getDocById(Number(result.lastInsertRowid));
}

export function upsertDocBySlug(input: DocInput) {
  const doc = docInputSchema.parse(input);
  const existing = getDocBySlug(doc.slug, doc.section);

  if (existing) {
    return updateDoc(existing.id, doc);
  }

  return createDoc(doc);
}

export function updateDoc(id: number, input: DocInput) {
  const doc = docInputSchema.parse(input);
  getDocsDb()
    .prepare(
      `
      UPDATE docs_pages
      SET title = @title,
          slug = @slug,
          section = @section,
          nav_title = @navTitle,
          sort_order = @order,
          content = @content,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `,
    )
    .run({ ...doc, id });

  return getDocById(id);
}

export function deleteDoc(id: number) {
  const result = getDocsDb().prepare("DELETE FROM docs_pages WHERE id = ?").run(id);

  return result.changes > 0;
}

export function deleteDocBySlug(slug: string, section = "1c-upp") {
  const existing = getDocBySlug(slug, section);

  if (!existing) {
    return false;
  }

  return deleteDoc(existing.id);
}
