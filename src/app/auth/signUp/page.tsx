"use client";

import { useActionState } from "react";
import { signup } from "../actions";
import styles from "@/src/app/auth/auth.module.css";
import Link from "next/link";
import sharedStyles from "../../styles/shared.module.css";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, { error: "" });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={sharedStyles.headerLabel}>Create Account</h2>
      </div>

      <main className={styles.card}>
        <form action={formAction} className={styles.form}>
          <label className={sharedStyles.label} htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className={sharedStyles.input}
            placeholder="Alexander Rose"
          />

          <label className={sharedStyles.label} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={sharedStyles.input}
            placeholder="sayhello@ovelia.tech"
          />

          <label className={sharedStyles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
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
              {pending ? "Creating Account..." : "Sign up"}
            </button>

            <p className={styles.formHint}>
              Already have an account? <Link href="/">Login</Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
