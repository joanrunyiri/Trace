import { Resend } from "resend";
import {
  InviteTemplate,
  UpdateTemplate,
} from "../../../components/email-template";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);
const from = process.env.NEXT_EMAIL_ADDRESS;

export async function sendProjectInvite({
  to,
  projectName,
  projectLink,
}: {
  to: string;
  projectName: string;
  projectLink: string;
}) {
  return await resend.emails.send({
    from: `Trace <${from}>`,
    to: [to],
    subject: `Project Initialized: ${projectName}`,
    react: InviteTemplate({ to, projectName, projectLink }),
  });
}

export async function sendProjectUpdate({
  to,
  projectName,
  projectLink,
}: {
  to: string;
  projectName: string;
  projectLink: string;
}) {
  return await resend.emails.send({
    from: `Trace <${from}>`,
    to: [to],
    subject: `Project Initialized: ${projectName}`,
    react: UpdateTemplate({ to, projectName, projectLink }),
  });
}
