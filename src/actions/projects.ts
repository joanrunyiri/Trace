"use server";

import { createClient } from "@/src/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import slugify from "@sindresorhus/slugify";
import { redirect } from "next/navigation";
import type { Project } from "@/src/app/lib/definitions";
import {
  sendProjectInvite,
  sendProjectUpdate,
} from "@/src/app/lib/resend/mail";

export type FormState = {
  error?: string;
};
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export async function createProject(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const receiverEmail = formData.get("email") as string;
  const targetCompletion = formData.get("target_completion") as unknown;
  const projectSlug = slugify(name);
  const uniqueId = nanoid();
  const projectKey = `${projectSlug}-${uniqueId}`;

  const projectLink = projectKey;
  const fullProjectLink = `${baseUrl}/client/${projectKey}`;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  if (!name) return { error: "Project name is required" };
  if (!receiverEmail) return { error: "Client email is required" };

  const { error } = await supabase.from("projects").insert([
    {
      name,
      receiverEmail,
      targetCompletion,
      projectLink: projectLink,
    },
  ]);

  if (error) {
    console.error("Supabase Error:", error.message);
    return {
      error: "Oops! Please try again later.",
    };
  }

  try {
    const emailResult = await sendProjectInvite({
      to: receiverEmail,
      projectName: name,
      projectLink: fullProjectLink,
    });

    if (emailResult.error) {
      console.error("Resend Error:", emailResult.error);
    }
  } catch (e) {
    console.error("Mail trigger failed:", e);
  }

  revalidatePath("/");
  return { error: "" };
}

export async function updateProgress(
  project: Project,
  prevState: any,

  formData: FormData,
) {
  const supabase = await createClient();
  const headline = formData.get("headline") as string;
  const content = formData.get("content") as string;

  const files = formData.getAll("files") as File[];
  const fullProjectLink = `${baseUrl}/client/${project.project_link}`;
  const attachments = [];

  for (const file of files) {
    if (file.size === 0) continue;

    const isImage = file.type.startsWith("image/");
    const folder = isImage ? "images" : "files";
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${project.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("progress-updates")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("progress-updates").getPublicUrl(filePath);
    attachments.push({
      name: file.name,
      url: publicUrl,
      type: isImage ? "image" : "file",
    });
  }

  const { error } = await supabase.from("project_updates").insert({
    project_id: project.id,
    content: content,
    metadata: { headline, attachments: attachments },
  });

  if (error) {
    console.error("Supabase Error:", error.message);
    return {
      error: "Oops! Please try again later.",
    };
  }
  try {
    const emailResult = await sendProjectUpdate({
      to: project.receiver_email,
      projectName: project.name,
      projectLink: fullProjectLink,
    });

    if (emailResult.error) {
      console.error("Resend Error:", emailResult.error);
    }
  } catch (e) {
    console.error("Mail trigger failed:", e);
  }

  revalidatePath(`/designer`);
  redirect("/designer");
}
export async function updateClientComments(
  prevState: FormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectId = formData.get("project_id") as string;
  const parentId = formData.get("parent_id") as string;
  const content = formData.get("reply") as string;
  const attachments = JSON.parse(
    (formData.get("attachments") as string) || "[]",
  );

  if (!content) return { error: "Message cannot be empty" };

  const { error } = await supabase.from("project_updates").insert({
    project_id: projectId,
    parent_id: parentId,
    user_id: user?.id || null,
    content: content,
    metadata: {
      attachments,
    },
  });

  if (error) {
    console.error("Supabase Error:", error.message);
    return { error: "Oops! Please try again later." };
  }

  revalidatePath(`/client/${projectId}`);
  return { error: "" };
}

export async function closeProject(
  project: Project,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;

  // Delete files from storage bucket
  const filesFolderPath = `files/${projectId}`;
  const imagesFolderPath = `images/${projectId}`;

  const { data: files } = await supabase.storage
    .from("progress-updates")
    .list(filesFolderPath);

  if (files?.length) {
    const filePaths = files.map((file) => `${filesFolderPath}/${file.name}`);
    await supabase.storage.from("progress-updates").remove(filePaths);
  }

  const { data: images } = await supabase.storage
    .from("progress-updates")
    .list(imagesFolderPath);

  if (images?.length) {
    const imagePaths = images.map((file) => `${imagesFolderPath}/${file.name}`);
    await supabase.storage.from("progress-updates").remove(imagePaths);
  }

  // Set project as inactive to be deleted by cron job at midnight everyday

  const { error } = await supabase
    .from("projects")
    .update({ isActive: false })
    .eq("id", project.id);

  if (error) {
    console.error("Supabase Error:", error.message);
    return { error: "Oops! Please try again later." };
  }

  revalidatePath("/designer");

  redirect("/designer");
}
