import React from "react";

import Link from "next/link";

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#9CA3AF",
  fontSize: "13px",
  fontWeight: 400,
  letterSpacing: "-0.01em",
};

export default function OveliaLayout() {
  return (
    <nav
      style={{
        display: "flex",
        padding: "12px 40px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(106, 123, 162, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#6A7BA2",
        }}
      >
        Trace
      </span>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link href="/designer" style={navLinkStyle}>
          Dashboard
        </Link>

        <form
          action="/auth/signout"
          method="post"
          style={{ display: "flex", alignItems: "center" }}
        >
          <button
            style={{
              ...navLinkStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              lineHeight: "normal",
              display: "flex",
              alignItems: "center",
            }}
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
