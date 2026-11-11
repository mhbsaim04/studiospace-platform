"use client";
import { Container, PageHeader } from "@/components/container";
import { PrivateRoute } from "@/components/private-route";
import { StudioForm } from "@/components/studio-form";

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <Container className="max-w-4xl py-12">
        <PageHeader title="Add a new studio" subtitle="Tell creators about your space. You can edit the listing any time." />
        <StudioForm />
      </Container>
    </PrivateRoute>
  );
}
