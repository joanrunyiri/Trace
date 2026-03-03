import { createClient } from "@/src/app/lib/supabase/server";
import ProgressUpdate from "./progressUpdate";
import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_updates(
        id,
        content,
        created_at,
        parent_id,
        metadata
      )
    `,
    )
    .eq("id", id)
    .order("created_at", {
      referencedTable: "project_updates",
      ascending: false,
    })
    .single();
  if (error) {
    redirect("/designer");
  }

  return <ProgressUpdate user={user} project={data} />;
}
