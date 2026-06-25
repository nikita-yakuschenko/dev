import fs from "node:fs";

const path = new URL("../lib/docs/seed.ts", import.meta.url);
let content = fs.readFileSync(path, "utf8");

const pairs: Array<[string, string]> = [
  ["Иванов И.И.", "Петров П.П."],
  ["responsible=Иванов", "responsible=Петров"],
  ["Основной склад", "Склад «Северный»"],
  ["warehouse=Основной", "warehouse=Северный"],
  ["?name=Основной", "?name=Северный"],
  ["sender=Основной", "sender=Северный"],
  ["ООО БетонПоставка", "ООО «ПримерПоставка»"],
  ["ИПК00000565", "ЗП-00001042"],
  ["АСН00000565", "ЗП-00001043"],
  ["`565` найдёт `ИПК00000565`, `АСН00000565`", "`042` найдёт `ЗП-00001042`, `ЗП-00001043`"],
  ["00005678", "ЗК-00002015"],
  ["00000123", "ЗР-00003001"],
  ["00000045", "СЧ-00004001"],
  ["00001234", "ДК-00001008"],
  ["inn=5260", "inn=7701"],
  ["1025200000000", "1027700000000"],
  ["Кирпич керамический", "Пример номенклатуры А"],
  ["receiver=Объект", "receiver=Южный"],
  ["&receiver=Объект", "&receiver=Южный"],
  ["Склад «Объект»", "Склад «Южный»"],
  ["12.12.2023", "12.12.2024"],
  ['const user = "Иванов";', 'const user = "demo_integrator";'],
  ['const password = "Пароль123";', 'const password = "DemoPass2026!";'],
  ['user = "Иванов"', 'user = "demo_integrator"'],
  ['password = "Пароль123"', 'password = "DemoPass2026!"'],
  ['curl -u "Иванов:Пароль123"', 'curl -u "demo_integrator:DemoPass2026!"'],
  ["Authorization: Basic 0JQu0LLQsNC9Og==", "Authorization: Basic ZGVtby1pbnRlZ3JhdG9yOkRlbW9QYXNzMjAyNiE="],
  ["Host: <ваш-gateway>", "Host: gateway-demo.example.internal"],
  ['"Код": "00001"', '"Код": "SKU-0100"'],
  ["?code=00001", "?code=SKU-0100"],
  ["status=утвержд", "status=соглас"],
  ["supplier=Бетон", "supplier=Пример"],
  ["ООО Поставщик Бетона", "ООО «ПримерПоставка»"],
  ["Бетон М300", "Смесь DEMO-M300"],
  ["?name=Бетон", "?name=Пример"],
  ["«БетонПоставка»", "«ПримерПоставка»"],
  ["Выдача на объект", "Выдача на демо-объект"],
  ["Заказ на производство ИПК00000565 от 12.12.2023 0:00:00", "Заказ на производство ЗП-00001042 от 12.12.2024 0:00:00"],
];

for (const [from, to] of pairs) {
  content = content.split(from).join(to);
}

fs.writeFileSync(path, content);
console.log(`Applied ${pairs.length} replacement rules.`);
