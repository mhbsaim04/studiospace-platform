import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <Container className="grid min-h-[75vh] place-items-center py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-7 sm:p-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </CardContent>
      </Card>
    </Container>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export const AuthLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-semibold text-primary hover:underline">{children}</Link>
);
