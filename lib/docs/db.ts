import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

import { seedDocs } from "@/lib/docs/seed";

let database: Database.Database | null = null;

function getDatabasePath() {
  if (process.env.DOCS_DB_PATH) {
    return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DOCS_DB_PATH);
  }

  return path.join(process.cwd(), "data", "docs.sqlite");
}

export function getDocsDb() {
  if (database) {
    return database;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  database = new Database(dbPath);
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS docs_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      section TEXT NOT NULL,
      nav_title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialDocs(database);

  return database;
}

export function resetDocsDbForTests() {
  database?.close();
  database = null;
}

function seedInitialDocs(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as count FROM docs_pages").get() as {
    count: number;
  };

  if (count.count > 0) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO docs_pages (title, slug, section, nav_title, sort_order, content)
    VALUES (@title, @slug, @section, @navTitle, @order, @content)
  `);

  const transaction = db.transaction(() => {
    for (const doc of seedDocs) {
      insert.run(doc);
    }
  });

  transaction();
}
