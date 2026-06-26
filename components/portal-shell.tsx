import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="portal-shell" className="h-svh overflow-hidden lg:grid lg:grid-cols-[18rem_1fr]">
      <AppSidebar />
      <div className="flex h-svh min-w-0 flex-col overflow-hidden">
        <SiteHeader />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
