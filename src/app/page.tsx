"use client";

import { useActionState } from "react";
import { login } from "@/src/app/auth/actions";
import styles from "@/src/app/auth/auth.module.css";
import Link from "next/link";
import sharedStyles from "../app/styles/shared.module.css";

export default function Login() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={sharedStyles.headerLabel}>Login</h2>
      </div>

      <main className={styles.card}>
        <form action={formAction} className={styles.form}>
          <label className={sharedStyles.label}>Email Address</label>
          <input
            name="email"
            type="email"
            required
            className={sharedStyles.input}
          />

          <label className={sharedStyles.label}>Password</label>
          <input
            name="password"
            type="password"
            required
            className={sharedStyles.input}
          />

          {state?.error && <p className={styles.error}>{state.error}</p>}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={pending}
              className={sharedStyles.button}
            >
              {pending ? "Verifying..." : "Login"}
            </button>
          </div>
          <p
            className={styles.formHint}
            style={{ textAlign: "center", marginTop: "1.5rem" }}
          >
            Don't have an account?{" "}
            <Link
              href="auth/signUp"
              style={{
                color: "var(--color-accent)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
