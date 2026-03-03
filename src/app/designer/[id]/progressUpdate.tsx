"use client";
import React from "react";
import { Archive } from "lucide-react";
import { useState, useActionState, useRef } from "react";
import { Palette, Camera, Send, Image, X } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import sharedStyles from "../../styles/shared.module.css";

import {
  FormState,
  updateProgress,
  closeProject,
} from "@/src/actions/projects";
import type { User, Project, ProjectUpdate } from "@/src/app/lib/definitions";

import styles from "@/src/app/designer/designer.module.css";
interface ProjectProgressProps {
  user: User;
  project: Project;
}

function ClientReply({ reply }: { reply: ProjectUpdate }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className={sharedStyles.clientReply}>
      <span className={sharedStyles.clientReplyTimestamp}>
        {formatDate(reply.created_at)}
      </span>
      <p className={sharedStyles.clientReplyText}>{reply.content}</p>
    </div>
  );
}

export default function ProgressUpdate({ project }: ProjectProgressProps) {
  const initialState: FormState = { error: "" };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    updateProgress.bind(null, project),
    initialState,
  );
  const [closeState, closeFormAction, loading] = useActionState(
    closeProject.bind(null, project),
    initialState,
  );

  const allUpdates = project?.project_updates ?? [];
  const designerUpdates = allUpdates.filter((u) => u.parent_id === null);
  const clientReplies = allUpdates.filter((u) => u.parent_id !== null);

  const repliesByParent = clientReplies.reduce(
    (acc, reply) => {
      const parentId = reply.parent_id as string;
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(reply);
      return acc;
    },
    {} as Record<string, ProjectUpdate[]>,
  );

  const updatesWithReplies = designerUpdates.filter((update) =>
    clientReplies.some((reply) => reply.parent_id === update.id),
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(newFiles);
    }
  };

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.projectHeaderLeft}>
              <div className={sharedStyles.projectAvatar}>
                {project?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className={sharedStyles.headerLabel}>Project Workspace</h1>
                <p className={sharedStyles.headerTitle}>
                  {project?.name || "Untitled Stream"}
                </p>
              </div>
            </div>

            <div className={styles.projectHeaderRight}>
              <form action={closeFormAction}>
                <button
                  type="submit"
                  onClick={(e) => {
                    if (
                      !confirm(
                        "Close this project? It will be queued for deletion.",
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={styles.closeButton}
                >
                  <Archive size={12} className={styles.closeIcon} />
                  {loading ? "Closing..." : "Close Stream"}
                </button>
              </form>
            </div>
          </header>

          <main className={styles.mainGrid}>
            <section className={styles.mainSection}>
              <form action={handleSubmit}>
                <div className={styles.card}>
                  <h2 className={sharedStyles.cardTitle}>
                    Publish New Progress Update
                  </h2>

                  <input
                    className={styles.headlineInput}
                    name="headline"
                    placeholder="Update Headline..."
                  />

                  <textarea
                    className={styles.textarea}
                    name="content"
                    placeholder="Share project details or work progress..."
                  />

                  {selectedFiles.length > 0 && (
                    <div className={styles.selectedFiles}>
                      {selectedFiles.map((file, i) => (
                        <div key={i} className={styles.selectedFileItem}>
                          <Image
                            size={14}
                            className={styles.selectedFileIcon}
                          />
                          <span className={styles.selectedFileName}>
                            {file.name}
                          </span>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className={styles.removeFilesButton}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className={styles.addButtonsGrid}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="files"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.addButton}
                    >
                      <Camera size={16} /> + Attachments
                    </button>
                  </div>

                  <div className={styles.formFooter}>
                    <button
                      type="submit"
                      aria-label="Publish update to client stream"
                      className={styles.publishButton}
                    >
                      {pending ? "Publishing.." : "Publish to Stream"}
                      <Send size={14} />
                    </button>
                  </div>
                  {state?.error && (
                    <p className={sharedStyles.errorText}>{state.error}</p>
                  )}
                </div>
              </form>

              {/* Designer's Updates with Client Replies */}
              {updatesWithReplies.length > 0 && (
                <div className={styles.postedUpdatesSection}>
                  <h2 className={sharedStyles.cardTitle}>Client Updates</h2>

                  {updatesWithReplies.map((update) => {
                    const replies = repliesByParent[update.id] ?? [];

                    return (
                      <div key={update.id} className={sharedStyles.updateCard}>
                        <div className={sharedStyles.updateHeader}>
                          <span className={sharedStyles.updateCategory}>
                            Update
                          </span>
                          <span className={sharedStyles.updateDate}>
                            {formatDate(update.created_at)}
                          </span>
                        </div>

                        <h3 className={sharedStyles.updateHeadline}>
                          {update.metadata?.headline || "Progress Update"}
                        </h3>
                        <p className={sharedStyles.updateContent}>
                          {update.content}
                        </p>

                        {/* Client Replies */}
                        {replies.length > 0 && (
                          <div className={sharedStyles.clientFeedbackSection}>
                            <span className={sharedStyles.clientFeedbackTitle}>
                              Client Feedback
                            </span>
                            {replies.map((reply) => (
                              <ClientReply key={reply.id} reply={reply} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <aside className={styles.sidebar}>
              <div className={`${styles.sidebarCard} ${styles.pendingCard}`}>
                <div className={styles.pendingIcon}>
                  <Palette size={20} />
                </div>
                <h3 className={styles.pendingTitle}>Pending Feedback</h3>
                <p className={styles.pendingText}>
                  {clientReplies.length > 0
                    ? `${clientReplies.length} client response${clientReplies.length > 1 ? "s" : ""} to review`
                    : "No pending feedback"}
                </p>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}
