import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const seedPath = path.join(process.cwd(), "lib/docs/seed.ts");

const forbiddenTokens = [
  "Якущенко",
  "Анжелика",
  "Ярославская",
  "Авангард",
  "Ромашка",
  "Сбербанк",
  "5260123456",
  "Домокомплект",
  "Панель стеновая",
  "Цемент М500",
  "293 дом",
  "объект 293",
  "ООО Подрядчик",
  "Петров П.П.",
  "ИПК00000565",
  "12.12.2023",
  "Иванов",
  "Пароль123",
  "БетонПоставка",
  "Бетон М300",
];

describe("documentation seed privacy", () => {
  it("does not contain real-looking sample data", () => {
    const seed = fs.readFileSync(seedPath, "utf8");
    const matches = forbiddenTokens.filter((token) => seed.includes(token));

    expect(matches, `Forbidden tokens found: ${matches.join(", ")}`).toEqual([]);
  });
});
