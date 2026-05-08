"use client";

import { useState } from "react";
import { motion, useAnimationControls } from "motion/react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgvwvqzj";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHAKE_KEYFRAMES = {
  x: [-10, 10, -8, 8, -4, 0],
  transition: { duration: 0.45, ease: "easeInOut" as const },
};

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const emailControls = useAnimationControls();
  const nameControls = useAnimationControls();

  function shakeEmail() {
    emailControls.start(SHAKE_KEYFRAMES);
  }
  function shakeName() {
    nameControls.start(SHAKE_KEYFRAMES);
  }

  function validateEmailValue(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return EMAIL_RE.test(trimmed) ? null : "Invalid email format";
  }
  function validateNameValue(value: string): string | null {
    return value.trim() ? null : "Name is required";
  }

  function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const error = validateEmailValue(e.target.value);
    setEmailError(error);
    if (error) shakeEmail();
  }
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (emailError && EMAIL_RE.test(e.target.value.trim())) {
      setEmailError(null);
    }
  }
  function handleNameBlur(e: React.FocusEvent<HTMLInputElement>) {
    const error = validateNameValue(e.target.value);
    setNameError(error);
    if (error) shakeName();
  }
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (nameError && e.target.value.trim()) {
      setNameError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");

    const nameInvalid = validateNameValue(name);
    const emailInvalid = validateEmailValue(email) ?? (email.trim() ? null : "Email is required");

    if (nameInvalid || emailInvalid) {
      if (nameInvalid) {
        setNameError(nameInvalid);
        shakeName();
      }
      if (emailInvalid) {
        setEmailError(emailInvalid);
        shakeEmail();
      }
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = (await res.json().catch(() => null)) as
          | { errors?: { message: string }[] }
          | null;
        setErrorMsg(json?.errors?.[0]?.message ?? "Could not send message.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col items-center text-base"
    >
      <div className="w-full max-w-lg">
        {/* Name */}
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          {nameError && (
            <span
              role="alert"
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {nameError}
            </span>
          )}
        </div>
        <motion.div
          animate={nameControls}
          className={`mt-2 mb-5 flex h-12 items-center overflow-hidden rounded-full border pl-4 transition-colors ${
            nameError
              ? "border-red-400/70 focus-within:ring-2 focus-within:ring-red-400/60"
              : "border-white/30 focus-within:ring-2 focus-within:ring-white/60"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
          <input
            id="name"
            name="name"
            type="text"
            onBlur={handleNameBlur}
            onChange={handleNameChange}
            aria-invalid={nameError ? true : undefined}
            className="h-full w-full bg-transparent px-3 text-base font-semibold text-[#fd5200] placeholder:font-normal placeholder:text-current placeholder:opacity-60 outline-none"
            placeholder="Your name"
            required
          />
        </motion.div>

        {/* Email */}
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          {emailError && (
            <span
              role="alert"
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {emailError}
            </span>
          )}
        </div>
        <motion.div
          animate={emailControls}
          className={`mt-2 mb-5 flex h-12 items-center overflow-hidden rounded-full border pl-4 transition-colors ${
            emailError
              ? "border-red-400/70 focus-within:ring-2 focus-within:ring-red-400/60"
              : "border-white/30 focus-within:ring-2 focus-within:ring-white/60"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            aria-invalid={emailError ? true : undefined}
            className="h-full w-full bg-transparent px-3 text-base outline-none"
            placeholder="you@example.com"
            required
          />
        </motion.div>

        {/* Message */}
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="mt-2 w-full resize-none rounded-2xl border border-white/30 bg-transparent p-4 text-base outline-none transition-all focus:ring-2 focus:ring-white/60"
          placeholder="Type your message here!"
          required
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold transition disabled:opacity-60 ${
            status === "sending"
              ? "bg-[#fd5200] text-white"
              : "bg-white text-black hover:bg-white/90 active:bg-[#fd5200] active:text-white"
          }`}
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && (
            <svg width="22" height="22" viewBox="0 0 21 20" fill="none">
              <path
                d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        {status === "success" && (
          <p className="mt-5 text-center text-base">
            Thanks — message received. I&apos;ll be in touch.
          </p>
        )}
        {status === "error" && (
          <p className="mt-5 text-center text-base opacity-80">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}
