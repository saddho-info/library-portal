import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/portal/page-header";
import { NavIcon } from "@/components/portal/icons";
import { getNavItem } from "@/lib/navigation";

export function SectionStub({ href }: { href: string }) {
  const item = getNavItem(href);
  if (!item) {
    throw new Error(`Unknown portal section: ${href}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={item.label}
        description={item.description}
        actions={<Badge variant="muted">{item.phase}</Badge>}
      />
      <EmptyState
        title={`${item.label} is not wired yet`}
        description={`This section is a shell for ${item.phase}. Data, tables, and actions land when that phase is implemented.`}
        icon={<NavIcon name={item.icon} className="size-6 text-muted-foreground" />}
      />
    </div>
  );
}
