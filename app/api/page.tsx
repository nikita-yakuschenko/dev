import Link from "next/link";
import {
  IconArrowRight,
  IconClock,
  IconPlugConnected,
  IconShieldCheck,
} from "@tabler/icons-react";

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

export default function ApiCatalogPage() {
  return (
    <PortalShell>
      <div className="flex flex-col gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            API каталог
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Интеграции AVGST</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Здесь будут собраны внутренние и внешние API: назначение, методы,
            правила доступа, окружения и история изменений.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-primary/30 bg-card/75 shadow-xl shadow-primary/5">
            <CardHeader>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <IconPlugConnected className="size-5" />
                </div>
                <Badge>Активный старт</Badge>
              </div>
              <CardTitle>API 1С УПП</CardTitle>
              <CardDescription>
                Первый раздел портала: структура документации, шаблон метода и
                базовые страницы для команды.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/api/1c-upp">
                  Открыть документацию
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/55">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <IconShieldCheck className="size-5" />
              </div>
              <CardTitle>Доступы и политики</CardTitle>
              <CardDescription>
                Будущий раздел для правил авторизации, токенов, ролей и
                сетевых ограничений.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/70 bg-card/55">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <IconClock className="size-5" />
              </div>
              <CardTitle>Журнал изменений</CardTitle>
              <CardDescription>
                Единая история изменений API, версий контрактов и
                договорённостей по совместимости.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
