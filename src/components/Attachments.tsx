import type { Attachment } from "../app/lib/definitions";
import { Download, Palette } from "lucide-react";
import styles from "@/src/app/client/client.module.css";

export function ImageAttachment({ attachment }: { attachment: Attachment }) {
  return (
    <div className={styles.imageAttachment}>
      <Palette
        size={28}
        strokeWidth={1.2}
        className={styles.imageAttachmentIcon}
      />

      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.imageAttachmentButton}
      >
        View or Download Renders
      </a>

      <span className={styles.imageAttachmentName}>
        {attachment.name || ""}
      </span>
    </div>
  );
}

export function FileAttachment({ attachment }: { attachment: Attachment }) {
  return (
    <div className={styles.fileAttachment}>
      <div className={styles.fileAttachmentInfo}>
        <span className={styles.fileAttachmentName}>{attachment.name}</span>
      </div>
      <a
        href={attachment.url}
        download={attachment.name}
        className={styles.fileAttachmentDownload}
      >
        Download
      </a>
    </div>
  );
}
