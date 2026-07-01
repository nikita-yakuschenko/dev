import { docHref } from "@/lib/docs/routes";

export type MethodCategoryId =
  | "system"
  | "finance"
  | "sales"
  | "suppliers"
  | "production"
  | "warehouse";

export type MethodCatalogEntry = {
  slug: string;
  navTitle: string;
  service: string;
  endpoint: string;
  docTitle: string;
};

export const METHOD_CATEGORIES: { id: MethodCategoryId; label: string; order: number }[] = [
  { id: "system", label: "Система", order: 10 },
  { id: "finance", label: "Финансы", order: 20 },
  { id: "sales", label: "Продажи", order: 30 },
  { id: "suppliers", label: "Поставщики", order: 40 },
  { id: "production", label: "Производство", order: 50 },
  { id: "warehouse", label: "Склад", order: 60 },
];

export const METHOD_CATALOG: Record<MethodCategoryId, MethodCatalogEntry[]> = {
  system: [
    {
      slug: "methods/health",
      navTitle: "Health",
      service: "health",
      endpoint: "GET /main/hs/health",
      docTitle: "Проверка доступности API",
    },
  ],
  finance: [
    {
      slug: "methods/cashflows-get",
      navTitle: "Денежные средства",
      service: "cashflows",
      endpoint: "GET /main/hs/cashflows/get",
      docTitle: "Получить ведомость по денежным средствам",
    },
    {
      slug: "methods/payments-get",
      navTitle: "Заявки на расходование",
      service: "payments",
      endpoint: "GET /main/hs/payments/get",
      docTitle: "Получить заявки на расходование средств",
    },
  ],
  sales: [
    {
      slug: "methods/orders-get",
      navTitle: "Заказы покупателей",
      service: "orders",
      endpoint: "GET /main/hs/orders/get",
      docTitle: "Получить заказы покупателей",
    },
  ],
  suppliers: [
    {
      slug: "methods/sorders-get",
      navTitle: "Заказы поставщикам",
      service: "sorders",
      endpoint: "GET /main/hs/sorders/get",
      docTitle: "Получить заказы поставщикам",
    },
    {
      slug: "methods/suppliers-get",
      navTitle: "Поставщики",
      service: "suppliers",
      endpoint: "GET /main/hs/suppliers/get",
      docTitle: "Получить поставщиков",
    },
  ],
  production: [
    {
      slug: "methods/morders-get",
      navTitle: "Заказы на производство",
      service: "morders",
      endpoint: "GET /main/hs/morders/get",
      docTitle: "Получить заказы на производство",
    },
    {
      slug: "methods/specifications-get",
      navTitle: "Спецификации",
      service: "specifications",
      endpoint: "GET /main/hs/specifications/get",
      docTitle: "Получить спецификации номенклатуры",
    },
  ],
  warehouse: [
    {
      slug: "methods/receipts-get",
      navTitle: "Поступления товаров и услуг",
      service: "receipts",
      endpoint: "GET /main/hs/receipts/get",
      docTitle: "Получить поступления товаров и услуг",
    },
    {
      slug: "methods/materials-get",
      navTitle: "Номенклатура",
      service: "materials",
      endpoint: "GET /main/hs/materials/get",
      docTitle: "Получить номенклатуру",
    },
    {
      slug: "methods/warehouses-get",
      navTitle: "Склады",
      service: "warehouses",
      endpoint: "GET /main/hs/warehouses/get",
      docTitle: "Получить склады",
    },
    {
      slug: "methods/balances-get",
      navTitle: "Остатки товаров",
      service: "balances",
      endpoint: "GET /main/hs/balances/get",
      docTitle: "Получить остатки товаров",
    },
    {
      slug: "methods/stockbalances-get",
      navTitle: "Стоимость остатков",
      service: "stockbalances",
      endpoint: "GET /main/hs/stockbalances/get",
      docTitle: "Получить стоимость остатков товаров",
    },
    {
      slug: "methods/transfers-get",
      navTitle: "Перемещения товаров",
      service: "transfers",
      endpoint: "GET /main/hs/transfers/get",
      docTitle: "Получить перемещения товаров",
    },
    {
      slug: "methods/demands-get",
      navTitle: "Требования-накладные",
      service: "demands",
      endpoint: "GET /main/hs/demands/get",
      docTitle: "Получить требования-накладные",
    },
  ],
};

const slugToCategory = new Map<string, MethodCategoryId>(
  METHOD_CATEGORIES.flatMap((category) =>
    METHOD_CATALOG[category.id].map((entry) => [entry.slug, category.id] as const),
  ),
);

export function getMethodCategoryId(slug: string): MethodCategoryId | undefined {
  return slugToCategory.get(slug);
}

export function getMethodSortOrder(slug: string): number | undefined {
  const categoryId = getMethodCategoryId(slug);
  if (!categoryId) {
    return undefined;
  }

  const category = METHOD_CATEGORIES.find((item) => item.id === categoryId);
  const index = METHOD_CATALOG[categoryId].findIndex((entry) => entry.slug === slug);

  if (!category || index < 0) {
    return undefined;
  }

  return category.order * 10 + index;
}

export function buildMethodsIndexMarkdown(): string {
  const sections = METHOD_CATEGORIES.map((category) => {
    const items = METHOD_CATALOG[category.id]
      .map(
        (entry) =>
          `- [${entry.docTitle}](${docHref(entry.slug)}) — \`${entry.endpoint}\``,
      )
      .join("\n");

    return `## ${category.label}\n\n${items}`;
  }).join("\n\n");

  return `# Методы API

Индекс HTTP-сервисов 1С УПП, доступных через gateway. Методы сгруппированы по предметным областям.

${sections}

## Требования к описанию метода

Каждая страница метода должна отвечать на четыре вопроса: зачем метод нужен, какие данные он принимает, что возвращает и как правильно обрабатывать ошибки.`;
}

export function buildOverviewMethodsTable(): string {
  return METHOD_CATEGORIES.map((category) => {
    const links = METHOD_CATALOG[category.id]
      .map((entry) => `[${entry.navTitle.toLowerCase()}](${docHref(entry.slug)})`)
      .join(", ");

    return `| ${category.label} | ${links} |`;
  }).join("\n");
}
