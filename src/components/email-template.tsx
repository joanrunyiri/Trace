import * as React from "react";
import { Resend } from "resend";
interface EmailTemplateProps {
  to: string;
  projectName: string;
  projectLink: string;
}

export function InviteTemplate({
  projectName,
  projectLink,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "serif", color: "#1A1F2B" }}>
      <h1 style={{ fontStyle: "italic" }}>Welcome to your Project Stream</h1>
      <p>Hello,</p>
      <p>
        A new project stream has been initialized for:{" "}
        <strong>{projectName}</strong>.
      </p>
      <p>You can track the progress at the link below:</p>
      <div style={{ marginTop: "20px" }}>
        <a
          href={projectLink}
          style={{
            backgroundColor: "#1A1F2B",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "24px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
          }}
        >
          VIEW PROJECT STREAM
        </a>
      </div>
      <p style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "40px" }}>
        Powered by Ovelia Voyage
      </p>
    </div>
  );
}
export function UpdateTemplate({
  projectName,
  projectLink,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "serif", color: "#1A1F2B" }}>
      <h1 style={{ fontStyle: "italic" }}>Welcome to your Project Stream</h1>
      <p>Hello,</p>
      <p>
        A new project update has been made for: <strong>{projectName}</strong>.
      </p>
      <p>You can view the progress at the link below:</p>
      <div style={{ marginTop: "20px" }}>
        <a
          href={projectLink}
          style={{
            backgroundColor: "#1A1F2B",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "24px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
          }}
        >
          VIEW PROJECT STREAM
        </a>
      </div>
      <p style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "40px" }}>
        Powered by Ovelia Voyage
      </p>
    </div>
  );
}
