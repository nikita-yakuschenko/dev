import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight,
  IconBook,
  IconKey,
  IconPlugConnected,
  IconServerCog,
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
  title: "Портал разработчика",
  description:
    "Документация HTTP API 1С УПП, правила интеграции и инженерные материалы AVGST.",
  path: "/",
});

const portalCards = [
  {
    title: "Документация API 1С УПП",
    description: "Обзор интеграции, контракт методов, параметры, примеры ответов и обработка ошибок.",
    href: "/api/1c-upp",
    icon: IconPlugConnected,
    status: "Опубликовано",
  },
  {
    title: "Авторизация и доступы",
    description: "HTTP Basic, UTF-8, получение учётных данных и правила безопасного хранения секретов.",
    href: "/api/1c-upp/auth",
    icon: IconKey,
    status: "Опубликовано",
  },
  {
    title: "Окружения и стенды",
    description: "Назначение контуров dev, test, stage и prod, правила стабильности и smoke-проверок.",
    href: "/api/1c-upp/environments",
    icon: IconServerCog,
    status: "Опубликовано",
  },
];

export default function HomePage() {
  return (
    <PortalShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AVGST Dev Portal",
          url: absoluteUrl("/"),
          hasPart: portalCards.map((card) => ({
            "@type": "WebPage",
            name: card.title,
            url: absoluteUrl(card.href),
          })),
        }}
      />
      <div className="flex flex-col gap-4">
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.14),transparent_30%)]" />
          <div className="relative max-w-4xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              dev.avgst.ru · AVGST engineering
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Корпоративный dev-портал для API и инженерных материалов.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Документация HTTP API 1С УПП для интеграторов: методы, авторизация,
              окружения, примеры запросов и changelog.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/api/1c-upp">
                  Открыть API 1С УПП
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/api">
                  Каталог API
                  <IconBook className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {portalCards.map((card) => (
            <Card
              key={card.href}
              className="group border-border/70 bg-card/65 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <card.icon className="size-5" />
                  </div>
                  <Badge variant="outline">{card.status}</Badge>
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="px-0 text-primary">
                  <Link href={card.href}>
                    Перейти
                    <IconArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </PortalShell>
  );
}
