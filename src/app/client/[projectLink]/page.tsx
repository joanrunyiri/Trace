import { createAnonClient } from "@/src/app/lib/supabase/server";
import { notFound } from "next/navigation";
import ClientDashboard from "./clientDashboard";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectLink: string }>;
}) {
  const { projectLink } = await params;
  const supabase = await createAnonClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_updates (*),
      profiles(*)
    `,
    )
    .eq("project_link", projectLink)

    .order("created_at", {
      referencedTable: "project_updates",
      ascending: false,
    })
    .single();

  if (!data) {
    notFound();
  }

  return <ClientDashboard project={data} />;
}
