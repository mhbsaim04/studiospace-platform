"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Container, PageHeader } from "@/components/container";
import { useAuth } from "@/components/auth-provider";
import { EmptyState } from "@/components/empty-state";
import { PrivateRoute } from "@/components/private-route";
import { PageSpinner } from "@/components/spinner";
import { StudioForm } from "@/components/studio-form";
import { api } from "@/lib/api";
import type { Studio } from "@/lib/types";

function EditInner() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<Studio>(`/studios/${id}`).then(setStudio).catch(() => setFailed(true));
  }, [id]);

  if (failed) return <Container className="py-16"><EmptyState icon={SearchX} title="Studio not found" description="This listing no longer exists." actionLabel="My Studio Listings" href="/my-listings" /></Container>;
  if (!studio) return <PageSpinner />;
  if (studio.ownerEmail !== user?.email) return <Container className="py-16"><EmptyState icon={SearchX} title="You can't edit this listing" description="Only the host who created a studio can update it." actionLabel="My Studio Listings" href="/my-listings" /></Container>;

  return (
    <Container className="max-w-4xl py-12">
      <PageHeader title="Update studio" subtitle="Change anything below and save. Your host details stay locked." />
      <StudioForm studio={studio} />
    </Container>
  );
}

export default function EditStudioPage() {
  return <PrivateRoute><EditInner /></PrivateRoute>;
}
