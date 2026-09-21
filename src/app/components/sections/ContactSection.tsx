import { useRef, useState } from "react";
import { Mail, Phone, MapPin, ExternalLink, Loader2, Check, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../icons";
import type { ContactInfo, SocialLink, PersonalInfo } from "@/types/portfolio";

type SendStatus = "idle" | "sending" | "success" | "error";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const socialIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  external: ExternalLink,
};

export function ContactSection({
  contactInfo,
  socialLinks,
  personalInfo,
}: {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  personalInfo: PersonalInfo;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SendStatus>("idle");

  const visibleSocials = socialLinks
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  const contactItems = [
    { icon: Mail, label: "Email", text: contactInfo.email },
    ...(contactInfo.phone && contactInfo.phone !== "#"
      ? [{ icon: Phone, label: "Phone", text: contactInfo.phone }]
      : []),
    { icon: MapPin, label: "Location", text: contactInfo.location },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || status === "sending") return;

    setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      formRef.current.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const buttonLabel = {
    idle: "Send Message",
    sending: "Sending…",
    success: "Message Sent!",
    error: "Failed — Try Again",
  }[status];

  const ButtonIcon = {
    idle: null,
    sending: <Loader2 size={14} className="animate-spin" />,
    success: <Check size={14} />,
    error: <X size={14} />,
  }[status];

  return (
    <section>
      {/* Inline heading */}
      <div className="mb-8">
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--pf-fg-4)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 8,
          }}
        >
          Get In Touch
        </p>
        <p
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 700,
            color: "var(--pf-fg)",
            fontFamily: "'Satoshi', sans-serif",
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Let's Work Together
        </p>
        <p style={{ color: "var(--pf-fg-3)", fontSize: 14, maxWidth: 480 }}>
          Have a project in mind or just want to connect? Drop me a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ label: "Name", name: "name", type: "text" }, { label: "Email", name: "email", type: "email" }].map(({ label, name, type }) => (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={label}
                  aria-label={label}
                  required
                  className="w-full outline-none"
                  style={{
                    background: "var(--pf-input-bg)",
                    border: "1px solid var(--pf-input-border)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: "var(--pf-input-fg)",
                    fontSize: 14,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border-focus)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border)"; }}
                />
              ))}
            </div>
            <input
              name="title"
              type="text"
              placeholder="Subject"
              aria-label="Subject"
              required
              className="w-full outline-none"
              style={{
                background: "var(--pf-input-bg)",
                border: "1px solid var(--pf-input-border)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "var(--pf-input-fg)",
                fontSize: 14,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border)"; }}
            />
            <textarea
              name="message"
              placeholder="Message"
              aria-label="Message"
              required
              rows={5}
              className="w-full outline-none resize-none"
              style={{
                background: "var(--pf-input-bg)",
                border: "1px solid var(--pf-input-border)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "var(--pf-input-fg)",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--pf-input-border)"; }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{
                background: status === "success" ? "#22c55e" : status === "error" ? "#ef4444" : "var(--pf-tab-active-bg)",
                color: status === "idle" ? "var(--pf-action-fg)" : "#FFF",
                fontWeight: 600,
                padding: "12px 32px",
                borderRadius: 999,
                border: status === "idle" ? "1px solid var(--pf-action-border)" : "none",
                fontSize: 14,
                transition: "all .2s",
                opacity: status === "sending" ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (status === "idle") { e.currentTarget.style.borderColor = "var(--pf-action-border-hover)"; e.currentTarget.style.color = "var(--pf-action-fg-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { if (status === "idle") { e.currentTarget.style.borderColor = "var(--pf-action-border)"; e.currentTarget.style.color = "var(--pf-action-fg)"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              {ButtonIcon}
              {buttonLabel}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-5 h-full"
            style={{ background: "var(--pf-surface-hover)", border: "1px solid var(--pf-border)" }}
          >
            <div className="space-y-4 mb-6">
              {contactItems.map(({ icon: Icon, label, text }) => (
                <div key={label}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pf-fg-4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{label}</p>
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} color="var(--pf-fg-4)" />
                    <p style={{ color: "var(--pf-fg-2)", fontSize: 13 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--pf-border)", paddingTop: 16 }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pf-fg-4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Social</p>
              <div className="flex gap-2">
                {visibleSocials.map((s, i) => {
                  const Icon = socialIconMap[s.platform] ?? ExternalLink;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.platform} profile`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{ background: "var(--pf-input-bg)", border: "1px solid var(--pf-input-border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pf-border-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pf-input-border)")}
                    >
                      <Icon size={15} color="var(--pf-fg-3)" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6" style={{ borderTop: "1px solid var(--pf-border)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p style={{ color: "var(--pf-fg-footer)", fontSize: 12 }}>© 2026 {personalInfo.name}. All rights reserved.</p>
          <p style={{ color: "var(--pf-fg-footer)", fontSize: 12 }}>I love ˗ˏˋ☕︎ˎˊ˗ and code</p>
        </div>
      </div>
    </section>
  );
}
