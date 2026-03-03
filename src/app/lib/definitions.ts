import { UUID } from "crypto";

export interface User {
  id: string;

  full_name?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface ProjectUpdate {
  id: UUID;
  project_id: UUID;
  user_id: UUID;
  parent_id: string | null;
  content: string;
  created_at: string;
  metadata?: {
    headline?: string;
    category?: string;
    attachments?: Array<{ name: string; url: string; type: "image" | "file" }>;
  };
}

export interface Project {
  id: string;
  name: string;
  receiver_email: string;
  project_link: string;
  created_at: string;
  user_id: string;
  target_completion: string;
  project_updates?: ProjectUpdate[];
  profiles?: User;
}
export interface Attachment {
  name: string;
  url: string;
  type: "image" | "file";
}
