import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      outline: "bg-card/90 text-foreground backdrop-blur",
      pending: "border-amber-300/60 bg-amber-100 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
      confirmed: "border-emerald-300/60 bg-emerald-100 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
      completed: "border-sky-300/60 bg-sky-100 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300",
      cancelled: "border-rose-300/60 bg-rose-100 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
