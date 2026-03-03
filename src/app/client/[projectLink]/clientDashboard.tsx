"use client";
import React from "react";
import { motion } from "framer-motion";
import { useActionState } from "react";
import { FormState, updateClientComments } from "@/src/actions/projects";
import { Send } from "lucide-react";
import type { Project, ProjectUpdate, Attachment } from "../../lib/definitions";
import { ImageAttachment, FileAttachment } from "@/src/components/Attachments";
import styles from "@/src/app/client/client.module.css";
import sharedStyles from "../../styles/shared.module.css";

interface ClientDashboardProps {
  project: Project;
}

function AttachmentList({ attachments }: { attachments?: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;
  const images = attachments.filter((a) => a.type === "image");
  const files = attachments.filter((a) => a.type === "file");
  return (
    <div className={styles.attachmentsList}>
      {images.map((attachment, i) => (
        <ImageAttachment key={`img-${i}`} attachment={attachment} />
      ))}
      {files.map((attachment, i) => (
        <FileAttachment key={`file-${i}`} attachment={attachment} />
      ))}
    </div>
  );
}
function ReplyForm({
  updateId,
  projectId,
}: {
  updateId: string;
  projectId: string;
}) {
  const [state, formAction, pending] = useActionState(updateClientComments, {
    error: "",
  });

  return (
    <form action={formAction} className={styles.replyForm}>
      <input type="hidden" name="parent_id" value={updateId} />
      <input type="hidden" name="project_id" value={projectId} />

      <div className={styles.replyInputWrapper}>
        <input
          name="reply"
          type="text"
          placeholder="Write a quick response..."
          className={sharedStyles.input}
        />
        <button type="submit" className={styles.replySendButton}>
          {pending ? "..." : <Send size={16} />}
        </button>
      </div>

      {state?.error && <p className={sharedStyles.errorText}>{state.error}</p>}
    </form>
  );
}

export default function ClientDashboard({ project }: ClientDashboardProps) {
  const initialState: FormState = {
    error: "",
  };
  const [state, formAction, pending] = useActionState(
    updateClientComments,
    initialState,
  );

  const allUpdates = project.project_updates ?? [];
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className={sharedStyles.container}>
        <div className={styles.content}>
          <header className={sharedStyles.header}>
            <div>
              <h2 className={styles.headerLabel}>Work Progress Stream</h2>
              <div className={sharedStyles.headerTitleRow}>
                <div className={sharedStyles.projectAvatar}>
                  {" "}
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <h1 className={sharedStyles.headerTitle}>{project.name}</h1>
              </div>
            </div>
            <div className={styles.headerRight}>
              <p className={sharedStyles.workspaceLabel}>
                {project.profiles?.full_name || ""}
              </p>
            </div>
          </header>

          <main className={styles.singleColumnStream}>
            {designerUpdates.length > 0 ? (
              designerUpdates.map((update) => {
                const replies = repliesByParent[update.id] ?? [];

                return (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.updateWrapper}
                  >
                    <div className={sharedStyles.updateCard}>
                      <div className={sharedStyles.updateHeader}>
                        <span className={sharedStyles.updateCategory}>
                          Project update
                        </span>
                        <span className={sharedStyles.updateDate}>
                          {formatDate(update.created_at)}
                        </span>
                      </div>

                      <h2 className={sharedStyles.updateHeadline}>
                        {update.metadata?.headline || "Progress Update"}
                      </h2>

                      <p className={styles.updateContent}>{update.content}</p>

                      <AttachmentList
                        attachments={update.metadata?.attachments}
                      />

                      {/* Client Replies */}
                      {replies.length > 0 && (
                        <div className={sharedStyles.clientFeedbackSection}>
                          {replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={sharedStyles.clientReply}
                            >
                              <div className={sharedStyles.clientReplyHeader}>
                                <span
                                  className={sharedStyles.clientReplyTimestamp}
                                >
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>

                              <p className={sharedStyles.clientReplyText}>
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <ReplyForm updateId={update.id} projectId={project.id} />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className={sharedStyles.label}>
                Waiting for the first project update...
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
