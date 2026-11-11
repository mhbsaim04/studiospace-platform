import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, actionLabel, href, onAction }: {
  icon: LucideIcon; title: string; description: string; actionLabel?: string; href?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/60 px-6 py-16 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-7" />
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && (href ? (
        <Button asChild className="mt-6"><Link href={href}>{actionLabel}</Link></Button>
      ) : (
        <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>
      ))}
    </div>
  );
}
