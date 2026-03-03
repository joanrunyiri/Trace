"use client";
import React from "react";
import { Briefcase, Plus } from "lucide-react";
import { FormState, createProject } from "@/src/actions/projects";
import { useActionState } from "react";
import type { User, Project } from "@/src/app/lib/definitions";
import Navbar from "@/src/components/Navbar";
import styles from "@/src/app/designer/designer.module.css";
import sharedStyles from "../styles/shared.module.css";

interface DesignerDashboardProps {
  user: User;
  projects: Project[];
}

export default function DesignerDashboard({
  user,
  projects,
}: DesignerDashboardProps) {
  const initialState: FormState = {
    error: "",
  };
  const [state, updateProgress, pending] = useActionState(
    createProject,
    initialState,
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          {/* TTTLE SECTION */}
          <header className={sharedStyles.header}>
            <div>
              <h2 className={sharedStyles.headerLabel}>Update Management</h2>
              <h1 className={sharedStyles.headerTitle}>
                {user?.user_metadata?.full_name}
              </h1>
            </div>
            <div className={sharedStyles.headerRight}>
              <p className={sharedStyles.workspaceLabel}>Workspace</p>
            </div>
          </header>

          <main>
            {/* CREATE WORKSTREAM */}
            <section className={styles.card}>
              <form action={updateProgress}>
                <h2 className={sharedStyles.cardTitle}>
                  Start New Work Stream
                </h2>

                <div className={styles.formGrid}>
                  <div>
                    <label className={sharedStyles.label}>
                      Client / Project Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      className={sharedStyles.input}
                      placeholder="e.g. The Boodles Residence"
                    />
                  </div>

                  <div>
                    <label className={sharedStyles.label}>Client Email</label>
                    <input
                      name="email"
                      type="text"
                      className={sharedStyles.input}
                      placeholder="joanrnyarua@gmail.com"
                    />
                  </div>

                  <div>
                    <label className={sharedStyles.label}>
                      Target Completion
                    </label>
                    <input
                      name="target_completion"
                      type="text"
                      className={sharedStyles.input}
                      placeholder="March 2026"
                    />
                  </div>
                </div>

                <div className={styles.formFooter}>
                  <span className={styles.formHint}>
                    A secure client portal will be provisioned on
                    initialization.
                  </span>
                  <button type="submit" className={sharedStyles.button}>
                    <Plus size={14} />{" "}
                    {pending ? "Creating..." : "Create stream"}
                  </button>
                </div>
                {state?.error && (
                  <p className={sharedStyles.errorText}>{state.error}</p>
                )}
              </form>
            </section>

            {/* Active Work Streams */}
            <section>
              <h2 className={styles.sectionTitle}>Active Work Streams</h2>
              {projects.length === 0 ? (
                <div className={styles.emptyStateCard}>
                  <p className={styles.formHint}>
                    No active work streams found. Start a new one above.
                  </p>
                </div>
              ) : (
                <div className={styles.projectList}>
                  {projects.map((project) => (
                    <div key={project.id} className={styles.projectCard}>
                      <div className={styles.projectMain}>
                        <div className={styles.iconContainer}>
                          <Briefcase size={18} strokeWidth={1.5} />
                        </div>
                        <div className={styles.projectInfo}>
                          <h3 className={styles.projectName}>{project.name}</h3>
                          <p className={styles.projectPhase}>
                            {project.project_updates?.[0]?.metadata?.headline ||
                              ""}
                          </p>
                        </div>
                      </div>

                      <div className={styles.projectActions}>
                        <a
                          href={`/designer/${project.id}`}
                          className={styles.editorLink}
                        >
                          Open Editor
                        </a>
                        <button className={styles.iconButton}>
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
