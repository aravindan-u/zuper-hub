// Post-onboarding homepage — a focused, sidebar-less landing (Remote-style
// layout) that reuses the onboarding warm-orange palette from onboarding/ui.jsx.
// The big "Things to do" slot is filled by the existing onboarding widget
// (SetupJourney), alongside three helper widgets: take a tour, reach onboarding
// support, and write to the CEO.
import React, { useEffect, useState } from "react";
import { readOnboardingState, migrationProgress, readProfile, startMigration } from "./migrationState.js";
import { SetupJourney } from "./home-page.jsx";
import { T, Modal, GlobalStyle, LogoMark } from "./onboarding/ui.jsx";
import {
  Search, Bell, HelpCircle, LifeBuoy, MessageCircle, CalendarClock,
  Bot, Ticket, Compass, Send, ArrowRight, PartyPopper, ChevronRight, PlayCircle,
} from "lucide-react";

// ─── Neutral, minimal design tokens (black primary + outline everywhere else) ─
const INK = "#111111";
const CARD_BORDER = "#EAEAEA";
const TILE_BG = "#F3F4F6";
const CARD_BG = "#FFFFFF";
const PAGE_BG = "#FBFAF9";

// Black primary button.
function PrimaryBtn({ children, onClick, disabled, IconR }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: disabled ? "#C7C7C7" : hov ? "#000" : INK, color: "#fff", border: "none",
        borderRadius: 10, padding: "10px 18px", fontSize: 14.5, fontWeight: 650, fontFamily: T.font,
        cursor: disabled ? "not-allowed" : "pointer", transition: "background 130ms ease", whiteSpace: "nowrap",
      }}>
      {children}{IconR && <IconR size={17} />}
    </button>
  );
}

// White outline button (secondary / everything else).
function OutlineBtn({ children, onClick, IconR }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: hov ? "#F7F7F6" : "#fff", color: INK, border: `1px solid #DDDCDA`,
        borderRadius: 10, padding: "10px 18px", fontSize: 14.5, fontWeight: 650, fontFamily: T.font,
        cursor: "pointer", transition: "background 130ms ease", whiteSpace: "nowrap",
      }}>
      {children}{IconR && <IconR size={17} />}
    </button>
  );
}

export default function HomeAfterOnboarding() {
  const onboarding = readOnboardingState();
  const profile = readProfile() || {};
  const firstName = profile.firstName || "there";
  const companyName = profile.companyName || "your workspace";

  // Live migration progress feeds the onboarding widget (SetupJourney).
  const [nowMs, setNowMs] = useState(() => Date.now());
  const prog = migrationProgress(onboarding, nowMs);
  useEffect(() => {
    if (!prog.active) return;
    const id = setInterval(() => setNowMs(Date.now()), 500);
    return () => clearInterval(id);
  }, [prog.active]);
  const onStartMigration = () => { startMigration({ source: prog.source, profile }); setNowMs(Date.now()); };

  const [supportOpen, setSupportOpen] = useState(false);
  const [ceoOpen, setCeoOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, fontFamily: T.font, color: T.text }}>
      <GlobalStyle />
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 32px 96px" }}>
        {/* ── Header ── */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <LogoMark name={companyName} src={profile.logo || undefined} size={48} radius={13} />
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 850, letterSpacing: "-0.02em", margin: 0, color: T.text }}>
                Hello, {firstName} <span style={{ fontWeight: 400 }}>👋</span>
              </h1>
              <p style={{ fontSize: 15.5, color: T.textSec, margin: "6px 0 0" }}>Here's what's going on today.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, paddingTop: 4 }}>
            <IconBtn icon={Search} />
            <IconBtn icon={HelpCircle} />
            <IconBtn icon={Bell} dot />
          </div>
        </header>

        {/* ── Row 1: the onboarding widget spans the full dashboard width ── */}
        <SetupJourney prog={prog} onStartMigration={onStartMigration} />

        {/* ── Row 2: take a tour + onboarding videos ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <WidgetCard
            icon={Compass}
            title="Take me on a tour"
            body="See how to make the most of Zuper and run your whole business from one place — in about two minutes."
            primary={{ label: "Take the tour", IconR: ArrowRight }}
            secondary={{ label: "What's new" }}
          />
          <WidgetCard
            icon={PlayCircle}
            title="Mastering Zuper"
            body="Short, practical walkthroughs — from your first job and proposal to invoicing and automations."
            primary={{ label: "Watch videos", IconR: ArrowRight }}
          />
        </div>

        {/* ── Row 3: onboarding team + write to CEO ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <WidgetCard
            icon={LifeBuoy}
            title="Reach out to onboarding team"
            body="Stuck on something during setup? Your dedicated onboarding team can jump on chat or a quick call."
            primary={{ label: "Contact onboarding", onClick: () => setSupportOpen(true) }}
          />
          <WidgetCard
            icon={Send}
            title="Write to CEO"
            body="Have feedback or a big idea? Send it straight to the top — our CEO reads every message personally."
            primary={{ label: "Write a message", onClick: () => setCeoOpen(true) }}
          />
        </div>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <CeoModal open={ceoOpen} onClose={() => setCeoOpen(false)} firstName={firstName} />
    </div>
  );
}

// ─── Widget card (matches the reference layout: header, divider, body, CTAs) ──
function WidgetCard({ icon: Icon, title, body, primary, secondary }) {
  return (
    <div style={{
      background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 22px 16px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: TILE_BG, color: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} />
        </div>
        <div style={{ fontSize: 16.5, fontWeight: 750, color: INK, lineHeight: 1.2 }}>{title}</div>
      </div>
      <div style={{ borderTop: `1px solid ${CARD_BORDER}` }} />
      <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 14.5, color: T.textSec, lineHeight: 1.55, margin: "0 0 20px", flex: 1 }}>{body}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {primary && <PrimaryBtn onClick={primary.onClick} IconR={primary.IconR}>{primary.label}</PrimaryBtn>}
          {secondary && <OutlineBtn onClick={secondary.onClick}>{secondary.label}</OutlineBtn>}
        </div>
      </div>
    </div>
  );
}

// ─── Top-bar icon button ─────────────────────────────────────────────────────
function IconBtn({ icon: Icon, dot }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", width: 40, height: 40, borderRadius: 10, border: "none", background: hov ? TILE_BG : "transparent", color: hov ? INK : T.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 130ms ease" }}>
      <Icon size={20} />
      {dot && <span style={{ position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: "50%", background: INK, border: `1.5px solid ${PAGE_BG}` }} />}
    </button>
  );
}

// ─── Onboarding support modal ────────────────────────────────────────────────
function SupportModal({ open, onClose }) {
  const items = [
    { icon: Bot, label: "Ask Zuper AI", sub: "Instant answers, any time" },
    { icon: MessageCircle, label: "Chat with an onboarding specialist", sub: "Typically replies in a few minutes" },
    { icon: CalendarClock, label: "Book a 1:1 onboarding call", sub: "15 minutes with your specialist" },
    { icon: Ticket, label: "Raise a ticket", sub: "For anything that needs a human" },
  ];
  return (
    <Modal open={open} onClose={onClose} maxWidth={470}>
      <div style={{ padding: "26px 26px 6px" }}>
        <div style={{ fontSize: 20, fontWeight: 850, color: T.text }}>Zuper onboarding support</div>
        <div style={{ fontSize: 14, color: T.textSec, marginTop: 4 }}>Your dedicated onboarding team is one tap away.</div>
      </div>
      <div style={{ padding: "10px 14px 22px" }}>
        {items.map((it) => (
          <button key={it.label}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F7F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            style={{ display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", padding: "12px 12px", border: "none", background: "transparent", borderRadius: 11, cursor: "pointer", fontFamily: T.font }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: TILE_BG, color: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <it.icon size={19} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>{it.label}</div>
              <div style={{ fontSize: 12.5, color: T.textSec, marginTop: 1 }}>{it.sub}</div>
            </div>
            <ChevronRight size={18} color={T.textMut} />
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─── Write-to-CEO modal (prototype — the note is not actually delivered) ─────
function CeoModal({ open, onClose, firstName }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => { if (open) { setMsg(""); setSent(false); } }, [open]);

  return (
    <Modal open={open} onClose={onClose} maxWidth={480}>
      {sent ? (
        <div style={{ padding: "36px 30px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: TILE_BG, color: INK, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <PartyPopper size={26} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 850, color: T.text }}>Your note is on its way ✉️</div>
          <div style={{ fontSize: 14, color: T.textSec, lineHeight: 1.55, margin: "8px auto 22px", maxWidth: 340 }}>
            Thanks{firstName && firstName !== "there" ? `, ${firstName}` : ""}. Our CEO reads every message and will get back to you personally.
          </div>
          <div style={{ display: "inline-flex" }}><PrimaryBtn onClick={onClose}>Done</PrimaryBtn></div>
        </div>
      ) : (
        <div style={{ padding: "26px 28px 24px" }}>
          <div style={{ fontSize: 20, fontWeight: 850, color: T.text }}>Write to our CEO</div>
          <div style={{ fontSize: 14, color: T.textSec, marginTop: 4, lineHeight: 1.5 }}>
            Feedback, a big idea, or something not working? It comes straight to the top.
          </div>
          <textarea
            value={msg} onChange={(e) => setMsg(e.target.value)} autoFocus
            placeholder="Hi, I wanted to share…"
            style={{ width: "100%", minHeight: 128, marginTop: 16, resize: "vertical", border: `1.5px solid ${CARD_BORDER}`, borderRadius: 12, padding: "13px 14px", fontFamily: T.font, fontSize: 14.5, color: T.text, outline: "none", lineHeight: 1.5, boxSizing: "border-box" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = INK)}
            onBlur={(e) => (e.currentTarget.style.borderColor = CARD_BORDER)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
            <PrimaryBtn disabled={!msg.trim()} onClick={() => setSent(true)} IconR={Send}>Send to CEO</PrimaryBtn>
          </div>
        </div>
      )}
    </Modal>
  );
}
