import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight,
  IconClock,
  IconKey,
  IconPlugConnected,
} from "@tabler/icons-react";

import { JsonLd } from "@/components/json-ld";
import { PortalShell } from "@/components/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Каталог API",
  description:
    "Каталог интеграций AVGST: документация HTTP API 1С УПП, авторизация, окружения и changelog.",
  path: "/api",
});

const catalogCards = [
  {
    title: "API 1С УПП",
    description:
      "12 read-only методов: заказы, номенклатура, остатки, контрагенты, health check и общие правила контракта.",
    href: "/api/1c-upp",
    icon: IconPlugConnected,
    badge: "12 методов",
    primary: true,
  },
  {
    title: "Авторизация",
    description: "HTTP Basic, UTF-8 для кириллицы, выдача доступа и хранение секретов.",
    href: "/api/1c-upp/auth",
    icon: IconKey,
    badge: "Guide",
    primary: false,
  },
  {
    title: "Changelog",
    description: "История публикации документации и зафиксированных контрактов API.",
    href: "/api/1c-upp/changelog",
    icon: IconClock,
    badge: "2026-06-25",
    primary: false,
  },
];

export default function ApiCatalogPage() {
  return (
    <PortalShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Каталог API AVGST",
          url: absoluteUrl("/api"),
          hasPart: catalogCards.map((card) => ({
            "@type": "WebPage",
            name: card.title,
            url: absoluteUrl(card.href),
          })),
        }}
      />
      <div className="flex flex-col gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            API каталог
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Интеграции AVGST</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Публичная документация внутренних HTTP API: назначение методов, правила
            доступа, окружения и история изменений контрактов.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {catalogCards.map((card) => (
            <Card
              key={card.href}
              className={
                card.primary
                  ? "border-primary/30 bg-card/75 shadow-xl shadow-primary/5"
                  : "border-border/70 bg-card/55"
              }
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <card.icon className="size-5" />
                  </div>
                  <Badge variant={card.primary ? "default" : "outline"}>{card.badge}</Badge>
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant={card.primary ? "default" : "outline"}>
                  <Link href={card.href}>
                    Открыть
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
