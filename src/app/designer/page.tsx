import { createClient } from "@/src/app/lib/supabase/server";
import { redirect } from "next/navigation";
import DesignerDashboard from "./designerDashboard";
import sharedStyles from "../styles/shared.module.css";
import styles from "../designer/designer.module.css";
import Navbar from "../../components/Navbar";

export default async function DesignerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
    *,
    project_updates (
      id,
      metadata,
      content,
      created_at
    )
  `,
    )
    .eq("isActive", true)
    .eq("user_id", user.id)
    .order("created_at", {
      foreignTable: "project_updates",
      ascending: false,
    })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.errorContainer}>
          <p className={sharedStyles.errorText}>
            Could not retrieve your work streams. Please try again later.
          </p>
        </div>
      </>
    );
  }

  return <DesignerDashboard user={user} projects={data} />;
}
