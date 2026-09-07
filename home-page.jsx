import React, { useEffect, useState } from "react";
import { readOnboardingState, migrationProgress, readPhase, setPhase, startMigration, readCardStatus, setCardStatus as persistCardStatus } from "./migrationState.js";
import { Modal, Field, ArrowRight } from "./onboarding/ui.jsx";
import { CreditCard, Plus, Check, ArrowUpRight, Smartphone } from "lucide-react";

const ACCENT = "#FD5000";
const ACCENT_DARK = "#D54400";
const INK = "#111111";
const INK_HOVER = "#000000";
const OUTLINE_BORDER = "#DDDCDA";
const NEUTRAL_TILE = "#F3F4F6";
const CARD_LINE = "#EAEAEA";
const GREEN = "#1A7A3C";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC = "#6B7280";
const TEXT_MUT = "#9CA3AF";
const BORDER = "#E5E7EB";
const HOVER_BG = "#F3F4F6";

const SUGGESTED_ACTIONS = [
  { title: "Open Inspections", desc: "Sales Hub", icon: "📋", accent: "#EBF5FB", color: "#1A6E9E" },
  { title: "Jobs in Progress", desc: "Production Hub", icon: "🔨", accent: "#EBFAEF", color: "#1A7A3C" },
  { title: "Pending Payments", desc: "Finance Hub", icon: "💰", accent: "#F5EBFE", color: "#6B1AAA" },
  { title: "Today's Leads", desc: "Lead Hub", icon: "📊", accent: "#FEF3EB", color: ACCENT },
  { title: "Revenue Report", desc: "Finance Hub", icon: "📈", accent: "#F5EBFE", color: "#6B1AAA" },
  { title: "Crew Status", desc: "Production Hub", icon: "👥", accent: "#EBFAEF", color: "#1A7A3C" },
];

export default function HomePage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Onboarding + migration state drives the Getting Started card below.
  const onboarding = readOnboardingState();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const prog = migrationProgress(onboarding, nowMs);
  useEffect(() => {
    if (!prog.active) return;
    const id = setInterval(() => setNowMs(Date.now()), 500);
    return () => clearInterval(id);
  }, [prog.active]);

  // Kick off migration from the dashboard line item (when it was dismissed on the
  // success screen), then re-read state on the next render.
  const onStartMigration = () => { startMigration({ source: prog.source }); setNowMs(Date.now()); };

  const onboardingComplete = Boolean(onboarding && onboarding.completed);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_SEC, marginBottom: 8 }}>Welcome back</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: "-0.02em", marginBottom: 12 }}>
          {greeting}, Aravind 👋
        </h1>
        <p style={{ fontSize: 16, color: TEXT_SEC, lineHeight: 1.5 }}>
          Here's what's happening across your business today.
        </p>
      </div>

      {onboardingComplete ? (
        <SetupJourney prog={prog} onStartMigration={onStartMigration} />
      ) : (
        /* Finish-setup banner → launches the self-serve onboarding flow */
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 32,
          background: "linear-gradient(120deg, #FEF3EB, #FFF9F4)", border: "1px solid #F4D9C8",
          borderRadius: 14, padding: "16px 20px",
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: ACCENT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>✨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Finish setting up your workspace</div>
            <div style={{ fontSize: 13.5, color: TEXT_SEC, marginTop: 2 }}>Take the 2-minute guided setup to tailor Zuper to your business.</div>
          </div>
          <button
            onClick={() => { window.location.hash = "#/setup"; }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#C43D18")}
            onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
            style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 140ms ease" }}>
            Start setup guide →
          </button>
        </div>
      )}

      {/* Hub Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
        {[
          { hub: "Lead Hub", label: "Leads received", value: "24", change: "+8%" },
          { hub: "Sales Hub", label: "Open inspections", value: "12", change: "+2" },
          { hub: "Production Hub", label: "Jobs in progress", value: "8", change: "-1" },
          { hub: "Finance Hub", label: "Overdue invoices", value: "$4.2k", change: "3 invoices" },
        ].map((card, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {card.hub}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 8, letterSpacing: "-0.02em" }}>
              {card.value}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: TEXT_SEC }}>{card.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Actions */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 20 }}>Suggested actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {SUGGESTED_ACTIONS.map((action, i) => (
            <button key={i} style={{
              padding: 24, borderRadius: 8, border: "1px solid " + BORDER,
              background: "#fff", textAlign: "left",
              cursor: "pointer", transition: "all 150ms ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = HOVER_BG;
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{action.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>{action.title}</div>
              <div style={{ fontSize: 12, color: TEXT_SEC }}>{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 16 }}>Recent activity</h2>
        <div style={{ padding: 20, borderRadius: 8, border: `1px solid ${BORDER}`, background: "#fff" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { time: "2 hours ago", action: "Invoice #4521 marked as paid", hub: "Finance" },
              { time: "4 hours ago", action: "Job #1041 moved to production", hub: "Production" },
              { time: "6 hours ago", action: "3 new leads from Google Ads", hub: "Lead" },
              { time: "8 hours ago", action: "Proposal #ES-891 viewed by client", hub: "Sales" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: 12, borderBottom: i < 3 ? `1px solid ${BORDER}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>{item.action}</div>
                  <div style={{ fontSize: 11, color: TEXT_SEC, marginTop: 2 }}>{item.time}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4,
                  background: "#F3F4F6", color: TEXT_SEC,
                }}>
                  {item.hub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phased setup journey (shown once onboarding is complete) ────────────────
// Phase 1 is the migration/getting-started stepper; "Next phase" walks the user
// through Review & configure → Integrations → Automation.
const PHASE_META = {
  1: { icon: "🔥", title: "Getting Started" },
  2: { icon: "🧭", title: "Review & configure" },
  3: { icon: "🔌", title: "Integrations" },
  4: { icon: "🤖", title: "Automation" },
};

export function SetupJourney({ prog, onStartMigration }) {
  const [phase, setPhaseState] = useState(() => readPhase());
  const go = (n) => {
    const p = Math.max(1, Math.min(4, n));
    setPhaseState(p);
    setPhase(p);
  };

  // Card-on-file is the last step of phase 1; it opens the same card screen used
  // during onboarding.
  const [cardStatus, setCardState] = useState(() => readCardStatus());
  const [cardOpen, setCardOpen] = useState(false);
  const setCard = (status) => { setCardState(status); persistCardStatus(status); setCardOpen(false); };

  // "Get the Zuper mobile app" step — iOS / Android CTAs each open a QR popup.
  const [mobilePlatform, setMobilePlatform] = useState(null);

  const migrating = prog.active;
  const migrated = prog.done;
  const completedFraction = 1 + (migrated ? 1 : migrating ? prog.pct : 0);
  const phase1Pct = Math.round((completedFraction / 4) * 100);

  const meta = PHASE_META[phase];

  return (
    <div style={{
      marginBottom: 32, background: "#fff", border: `1px solid ${CARD_LINE}`,
      borderRadius: 16, padding: "22px 26px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{meta.icon}</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY }}>{meta.title}</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: TEXT_SEC, background: NEUTRAL_TILE, borderRadius: 999, padding: "3px 10px" }}>Phase {phase} of 4</span>
        </div>
        {phase === 1 && (
          <div style={{ fontSize: 14, color: TEXT_SEC }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY }}>{phase1Pct}%</span> completed
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ marginTop: 18 }}>
        {phase === 1 && <PhaseGettingStarted prog={prog} totalPct={phase1Pct} onStartMigration={onStartMigration} cardStatus={cardStatus} onOpenCard={() => setCardOpen(true)} onOpenMobile={(p) => setMobilePlatform(p)} />}
        {phase === 2 && <PhaseReview />}
        {phase === 3 && <PhaseIntegrations />}
        {phase === 4 && <PhaseAutomation />}
      </div>

      {/* Footer nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={() => go(phase - 1)}
          disabled={phase === 1}
          style={{ background: "none", border: "none", color: phase === 1 ? TEXT_MUT : TEXT_SEC, fontSize: 13.5, fontWeight: 700, cursor: phase === 1 ? "default" : "pointer", opacity: phase === 1 ? 0.5 : 1 }}>
          ← {phase > 1 ? PHASE_META[phase - 1].title : "Back"}
        </button>
        {phase < 4 ? (
          <button
            onClick={() => go(phase + 1)}
            onMouseEnter={(e) => (e.currentTarget.style.background = INK_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.background = INK)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: INK, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14.5, fontWeight: 650, cursor: "pointer", transition: "background 140ms ease" }}>
            Next phase: {PHASE_META[phase + 1].title} →
          </button>
        ) : (
          <span style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>🎉 You're all set up</span>
        )}
      </div>

      <CardOnFileModal
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        onSave={() => setCard("added")}
        onSkip={() => setCard("skipped")}
      />
      <AppQRModal platform={mobilePlatform} onClose={() => setMobilePlatform(null)} />
    </div>
  );
}

// ─── Mobile-app QR popup (platform-specific) ─────────────────────────────────
function AppleLogo({ size = 20, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden><path d="M16.365 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.98 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.2-2.98.8-.94 2.15-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.51 3.12-.95 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8-1.29-1.82-2.32-4.63-2.32-7.28 0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.37 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.95 4.45z"/></svg>;
}
function AndroidLogo({ size = 20, color = "#3DDC84" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden><path d="M17.52 9.32l1.99-3.45a.42.42 0 10-.72-.42l-2.02 3.5A12.2 12.2 0 0012 7.5c-1.82 0-3.53.42-5.14 1.14L4.85 5.14a.42.42 0 10-.72.42l1.99 3.45C2.6 11.35.63 14.7.31 18.5h23.38c-.32-3.8-2.29-7.15-6.17-9.18zM7.03 15.34a1.15 1.15 0 110-2.3 1.15 1.15 0 010 2.3zm9.94 0a1.15 1.15 0 110-2.3 1.15 1.15 0 010 2.3z"/></svg>;
}

const STORES = {
  ios: { url: "https://apps.apple.com/app/zuper-field-service/id1234567890", store: "App Store", sub: "iPhone & iPad", Logo: AppleLogo, logoColor: "#111" },
  android: { url: "https://play.google.com/store/apps/details?id=com.zuper.app", store: "Google Play", sub: "Android phones & tablets", Logo: AndroidLogo, logoColor: "#3DDC84" },
};

function AppQRModal({ platform, onClose }) {
  const s = STORES[platform] || STORES.ios;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=6&data=${encodeURIComponent(s.url)}`;
  return (
    <Modal open={platform != null} onClose={onClose} maxWidth={400}>
      <div style={{ padding: "28px 28px 26px", textAlign: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: NEUTRAL_TILE, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <s.Logo size={24} color={s.logoColor} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 850, color: TEXT_PRIMARY }}>Get Zuper for {platform === "android" ? "Android" : "iOS"}</div>
        <div style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "6px auto 20px", maxWidth: 300 }}>
          Scan this code with your {s.sub.split(" ")[0]} to install Zuper — run jobs, capture photos, and update statuses from the field.
        </div>

        <div style={{ display: "inline-flex", padding: 14, background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <img src={qrSrc} alt={`QR code to download Zuper on ${s.store}`} width={186} height={186} style={{ display: "block", borderRadius: 6 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <a href={s.url} target="_blank" rel="noreferrer" style={storePill}>
            <s.Logo size={16} color={s.logoColor} /> {s.store}
          </a>
        </div>
        <div style={{ fontSize: 12, color: TEXT_MUT, marginTop: 14 }}>Point your phone camera at the code to open the link.</div>
      </div>
    </Modal>
  );
}

const storePill = { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: INK, border: `1px solid ${OUTLINE_BORDER}`, borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 650, textDecoration: "none", cursor: "pointer" };

// ─── Card on file (reuses the onboarding card screen) ────────────────────────
function CardOnFileModal({ open, onClose, onSave, onSkip }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  useEffect(() => { if (open) { setName(""); setNumber(""); setExpiry(""); setCvc(""); } }, [open]);
  const ready = name.trim().length > 2 && number.replace(/\s/g, "").length >= 12 && expiry.trim().length >= 4 && cvc.trim().length >= 3;

  return (
    <Modal open={open} onClose={onClose} maxWidth={460}>
      <div style={{ padding: "26px 28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: NEUTRAL_TILE, color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={20} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 850, color: TEXT_PRIMARY }}>Add a card on file</div>
        </div>
        <div style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, marginBottom: 18 }}>
          Optional. Nothing is charged during your trial — this just keeps your workspace running when it ends.
        </div>
        <Field label="Name on card" value={name} onChange={setName} placeholder="Sam Rivera" />
        <div style={{ marginTop: 12 }}>
          <Field label="Card number" value={number} onChange={setNumber} placeholder="0000 0000 0000 0000" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Field label="Expiry" value={expiry} onChange={setExpiry} placeholder="MM/YY" />
          <Field label="CVC" value={cvc} onChange={setCvc} placeholder="123" />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 14, fontSize: 12.5, color: TEXT_SEC, lineHeight: 1.5 }}>
          <span style={{ marginTop: 1 }}>💡</span>
          <span>Prototype — this form is a mockup and nothing is sent anywhere. Do not enter a real card.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <button onClick={onSkip} style={{ background: "#fff", border: `1px solid ${OUTLINE_BORDER}`, color: INK, fontSize: 14, fontWeight: 650, cursor: "pointer", borderRadius: 10, padding: "10px 16px" }}>Skip for now</button>
          <button disabled={!ready} onClick={onSave}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ready ? INK : "#C7C7C7", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14.5, fontWeight: 650, cursor: ready ? "pointer" : "not-allowed" }}>
            Save card <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Phase 1 — the onboarding + migration stepper.
function PhaseGettingStarted({ prog, totalPct, onStartMigration, cardStatus = "none", onOpenCard, onOpenMobile }) {
  const migrating = prog.active;
  const migrated = prog.done;
  const cardAdded = cardStatus === "added";

  const steps = [
    { n: 1, title: "Onboarding", desc: "Your workspace basics are configured.", status: "done" },
    {
      n: 2,
      title: prog.source ? `Migrate data from ${prog.source}` : "Migrate your data",
      desc: migrated ? "All your records are now in Zuper."
        : migrating ? "Migrating your customers, jobs & documents…"
        : "You skipped this — bring your customers, jobs, and history across whenever you're ready.",
      status: migrated ? "done" : migrating ? "active" : "pending",
      progress: migrating ? prog.pct : null,
      cta: !migrating && !migrated ? "Start migration" : null,
      onCta: onStartMigration,
    },
    {
      n: 3,
      title: migrated ? "Create a proposal" : "Create sample proposal",
      desc: migrated ? "Send your first branded quote to a customer." : "We'll prefill an example so you can see how quoting works.",
      status: "pending", cta: "Start",
    },
    {
      n: 4,
      title: migrated ? "Create a job" : "Create sample Job",
      desc: migrated ? "Schedule your first real job and assign a crew." : "Try a sample job to walk the production workflow.",
      status: "pending", cta: "Start", locked: !migrated,
      note: !migrated ? "opens after migration completes" : null,
    },
    {
      n: 5,
      title: "Get the Zuper mobile app",
      desc: "Run jobs, capture photos, and update statuses from the field.",
      status: "pending",
      ctas: [
        { label: "iOS", Logo: AppleLogo, logoColor: "#111", onClick: () => onOpenMobile("ios") },
        { label: "Android", Logo: AndroidLogo, logoColor: "#3DDC84", onClick: () => onOpenMobile("android") },
      ],
    },
  ];

  return (
    <div>
      <div style={{ height: 8, borderRadius: 999, background: "#EFEFEF", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ height: "100%", width: `${totalPct}%`, borderRadius: 999, background: INK, transition: "width .4s ease" }} />
      </div>
      {steps.map((step, i) => (
        <StepRow key={step.n} step={step} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}

// Phase 2 — review the generated setup, then create a real job + proposal.
// Grouped instead of 9 separate cards, so it reads as "here's what's ready"
// rather than a wall of to-dos.
const REVIEW_GROUPS = [
  { label: "Work", items: ["Job categories", "Statuses", "Checklists", "Inspection forms", "Tasks"] },
  { label: "Catalog & pricing", items: ["Suppliers & distributors", "Service packages", "Quoting rules"] },
  { label: "Proposal", items: ["Templates from your sample"] },
];

function PhaseReview() {
  return (
    <div>
      <p style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "0 0 16px" }}>
        Zuper built your workspace from your setup. Skim what's ready, then go live.
      </p>

      {/* One tidy card: everything generated, grouped and confirmed */}
      <div style={{ border: `1px solid ${CARD_LINE}`, borderRadius: 14, background: "#fff", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: `1px solid ${CARD_LINE}` }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: TEXT_PRIMARY }}>Generated for you</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: GREEN, background: "#EBFAEF", borderRadius: 999, padding: "3px 10px" }}>
            <Check size={12} /> Ready to review
          </span>
        </div>
        {REVIEW_GROUPS.map((g, i) => (
          <div key={g.label} style={{ display: "grid", gridTemplateColumns: "132px 1fr", gap: 14, alignItems: "start", padding: "13px 16px", borderTop: i === 0 ? "none" : `1px solid ${CARD_LINE}` }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: TEXT_MUT, paddingTop: 3 }}>{g.label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {g.items.map((item) => (
                <span key={item} style={{ fontSize: 12.5, fontWeight: 600, color: TEXT_PRIMARY, background: NEUTRAL_TILE, borderRadius: 8, padding: "5px 10px" }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ padding: "11px 16px", borderTop: `1px solid ${CARD_LINE}`, textAlign: "right" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: INK, cursor: "pointer" }}>Review details →</span>
        </div>
      </div>

      {/* Single, neutral go-live row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, background: "#FAFAF9", border: `1px solid ${CARD_LINE}`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: TEXT_PRIMARY }}>Ready to go live?</div>
          <div style={{ fontSize: 13, color: TEXT_SEC, marginTop: 2 }}>Turn your sample into a real job and proposal.</div>
        </div>
        <button style={pillBtn(false)}>Create a job</button>
        <button style={pillBtn(true)}>Create a proposal</button>
      </div>

      <div style={{ fontSize: 12.5, color: TEXT_MUT, marginTop: 12, paddingLeft: 2 }}>
        Team invites unlock after your first proposal — pre-filled from your job data, no re-entry.
      </div>
    </div>
  );
}

// Phase 3 — add-ons contractors turn on as they grow (marketplace-style cards).
const ADDONS = [
  {
    key: "connect",
    eyebrow: "Works with every plan",
    title: "Zuper Connect",
    desc: "Sync the tools you already run on — CRM, phone, and calendars — so every job, contact, and update lives in one place.",
    price: "$29", cadence: "/ mo", note: "Billed monthly",
    cta: "add",
  },
  {
    key: "pay",
    eyebrow: "Available on all plans",
    title: "Zuper Pay",
    desc: "Take card and ACH payments right on your invoices and get paid faster — no separate processor to wire up.",
    price: "2.9%", cadence: "+ 30¢ / txn", note: "No monthly fee",
    cta: "add",
  },
  {
    key: "estimator",
    eyebrow: "AI-powered",
    title: "Instant Estimator",
    desc: "Generate qualified leads with satellite-based roofing estimates. Drop your estimator into your site and marketing.",
    price: "$149", cadence: "/ mo", note: "Billed monthly",
    cta: "demo",
  },
];

const addonPreviewPanel = { background: "#F7F7F6", border: `1px solid ${CARD_LINE}`, borderRadius: 12, padding: "16px 14px", minHeight: 128, display: "flex", flexDirection: "column", justifyContent: "center" };

function AddonConnectPreview() {
  const tiles = [["CRM", "#EAF1FB", "#1A6E9E"], ["Phone", "#EFEAFB", "#6B1AAA"], ["Cal", "#EAF7EF", "#1A7A3C"], ["QBO", "#FBF0EA", "#B4690E"]];
  return (
    <div style={addonPreviewPanel}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {tiles.map(([label, bg, fg]) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: TEXT_SEC, fontWeight: 600 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: GREEN }} /> 40+ integrations, synced live
      </div>
    </div>
  );
}

function AddonPayPreview() {
  return (
    <div style={addonPreviewPanel}>
      <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 10, padding: "12px 14px", boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: TEXT_SEC }}>Invoice #4471</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: GREEN, background: "#EBFAEF", borderRadius: 999, padding: "2px 8px" }}>PAID</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: TEXT_PRIMARY, marginTop: 6 }}>$8,240.00</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, fontSize: 11.5, color: TEXT_SEC }}>
          <span style={{ width: 26, height: 17, borderRadius: 3, background: "#1A1F71" }} /> Visa •••• 4242
        </div>
      </div>
    </div>
  );
}

function AddonEstimatorPreview() {
  return (
    <div style={addonPreviewPanel}>
      <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 10, padding: "12px 14px", boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: TEXT_PRIMARY }}>Your estimate is ready</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#6b6b6b,#3a3a3a)", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY }}>Classic Shingles</div>
            <div style={{ fontSize: 12, color: TEXT_SEC, marginTop: 1 }}>$19,893 – $21,938</div>
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: INK, color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 11.5, fontWeight: 700 }}>
          Get free proposal <ArrowUpRight size={13} />
        </div>
      </div>
    </div>
  );
}

const ADDON_PREVIEWS = { connect: AddonConnectPreview, pay: AddonPayPreview, estimator: AddonEstimatorPreview };

function AddonCard({ addon, added, onToggle }) {
  const Preview = ADDON_PREVIEWS[addon.key];
  return (
    <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${CARD_LINE}`, borderRadius: 16, background: "#fff", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "18px 18px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ alignSelf: "flex-start", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: TEXT_SEC, background: NEUTRAL_TILE, borderRadius: 999, padding: "4px 10px" }}>{addon.eyebrow}</span>
        <div style={{ fontSize: 18, fontWeight: 850, color: TEXT_PRIMARY, margin: "12px 0 6px" }}>{addon.title}</div>
        <div style={{ fontSize: 13, color: TEXT_SEC, lineHeight: 1.5, marginBottom: 16 }}>{addon.desc}</div>
        <div style={{ marginTop: "auto" }}><Preview /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "14px 18px", background: "#FAFAF9", borderTop: `1px solid ${CARD_LINE}` }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: TEXT_PRIMARY }}>{addon.price}</span>
            <span style={{ fontSize: 12.5, color: TEXT_SEC, fontWeight: 600 }}> {addon.cadence}</span>
          </div>
          <div style={{ fontSize: 11, color: TEXT_MUT, marginTop: 1 }}>{addon.note}</div>
        </div>
        {addon.cta === "demo" ? (
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: INK, border: `1px solid ${OUTLINE_BORDER}`, borderRadius: 10, padding: "9px 16px", fontSize: 13.5, fontWeight: 650, cursor: "pointer", whiteSpace: "nowrap" }}>
            Book a demo <ArrowUpRight size={15} />
          </button>
        ) : (
          <button onClick={onToggle} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: added ? "#fff" : INK, color: added ? INK : "#fff", border: added ? `1px solid ${OUTLINE_BORDER}` : "none", borderRadius: 10, padding: "9px 18px", fontSize: 13.5, fontWeight: 650, cursor: "pointer", whiteSpace: "nowrap" }}>
            {added ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add</>}
          </button>
        )}
      </div>
    </div>
  );
}

function PhaseIntegrations() {
  const [added, setAdded] = useState({});
  const toggle = (key) => setAdded((a) => ({ ...a, [key]: !a[key] }));
  return (
    <div>
      <p style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "0 0 18px" }}>
        The add-ons serious contractors turn on with their plan. Switch more of Zuper on as you grow — no re-setup, billed alongside your subscription.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {ADDONS.map((addon) => (
          <AddonCard key={addon.key} addon={addon} added={!!added[addon.key]} onToggle={() => toggle(addon.key)} />
        ))}
      </div>
    </div>
  );
}

// Phase 4 — Zuper AI agents (sourced from zuper.co).
const AGENTS = [
  { name: "Zuper Sense", available: true, desc: "AI intelligence layer — ask about your operations in plain English." },
  { name: "CSR Agent", available: true, desc: "AI receptionist — books inspections and creates jobs, even after hours." },
  { name: "Field Agent", available: true, desc: "Guides technicians on site and captures the whole visit." },
  { name: "AR Agent", available: false, desc: "Chases invoices and collects payments automatically." },
  { name: "Marketing Agent", available: false, desc: "Runs campaigns and follows up with leads for you." },
  { name: "Sales Coach Agent", available: false, desc: "Coaches your reps to win more quotes." },
];

function PhaseAutomation() {
  return (
    <div>
      <p style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "0 0 18px" }}>
        Put Zuper AI agents to work. These are the agents available from <strong style={{ color: TEXT_PRIMARY }}>zuper.co</strong>.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {AGENTS.map((a) => (
          <div key={a.name} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", background: "#FCFCFB" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: "#F5EBFE", color: "#6B1AAA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</span>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: TEXT_PRIMARY }}>{a.name}</span>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", padding: "3px 8px", borderRadius: 999, background: a.available ? "#EBFAEF" : "#F3F4F6", color: a.available ? GREEN : TEXT_MUT }}>
                {a.available ? "Available" : "Coming soon"}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: TEXT_SEC, lineHeight: 1.45, margin: "10px 0 12px" }}>{a.desc}</div>
            <button disabled={!a.available} style={pillBtn(a.available, !a.available)}>
              {a.available ? "Activate agent" : "Notify me"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function pillBtn(filled, disabled = false) {
  return {
    background: disabled ? "#F3F4F6" : filled ? INK : "#fff",
    color: disabled ? TEXT_MUT : filled ? "#fff" : INK,
    border: filled || disabled ? "none" : `1px solid ${OUTLINE_BORDER}`,
    borderRadius: 999, padding: "9px 18px", fontSize: 13.5, fontWeight: 650,
    cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
  };
}

function StepRow({ step, isLast }) {
  const done = step.status === "done";
  const active = step.status === "active";

  const marker = done ? (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>✓</span>
  ) : active ? (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `3px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: INK }} />
    </span>
  ) : (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `2px solid ${BORDER}`, flexShrink: 0 }} />
  );

  const stepLabelColor = done ? GREEN : active ? INK : TEXT_MUT;

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* Marker + connecting line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {marker}
        {!isLast && <div style={{ flex: 1, width: 2, background: done ? GREEN : BORDER, marginTop: 4, minHeight: 30 }} />}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 12 : 22, opacity: step.locked ? 0.72 : 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: stepLabelColor }}>
          Step {step.n}
          {step.note && <span style={{ color: TEXT_MUT, fontWeight: 500 }}> ({step.note})</span>}
        </div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: done ? TEXT_MUT : TEXT_PRIMARY, textDecoration: done ? "line-through" : "none", marginTop: 3 }}>
          {step.title}
        </div>
        <div style={{ fontSize: 13, color: TEXT_SEC, textDecoration: done ? "line-through" : "none", marginTop: 3 }}>
          {step.desc}
        </div>

        {/* Live migration progress for the CRM step */}
        {step.progress != null && (
          <div style={{ marginTop: 10, maxWidth: 420 }}>
            <div style={{ height: 6, borderRadius: 999, background: "#EFEFEF", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(step.progress * 100)}%`, borderRadius: 999, background: INK, transition: "width .4s ease" }} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: TEXT_SEC, marginTop: 6 }}>
              {Math.round(step.progress * 100)}% · migrating in the background
            </div>
          </div>
        )}
      </div>

      {/* Step action — either a single CTA or a set of platform CTAs */}
      {step.ctas && !done ? (
        <div style={{ alignSelf: "center", flexShrink: 0, display: "flex", gap: 8 }}>
          {step.ctas.map((c) => (
            <button key={c.label} onClick={c.onClick}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: INK, border: `1px solid ${OUTLINE_BORDER}`, borderRadius: 10, padding: "9px 16px", fontSize: 14, fontWeight: 650, cursor: "pointer", whiteSpace: "nowrap" }}>
              <c.Logo size={16} color={c.logoColor} /> {c.label}
            </button>
          ))}
        </div>
      ) : step.cta && !done ? (
        <button
          disabled={step.locked}
          onClick={step.onCta}
          style={{
            alignSelf: "center", flexShrink: 0,
            background: step.locked ? "#F3F4F6" : "#fff",
            color: step.locked ? TEXT_MUT : INK,
            border: step.locked ? "none" : `1px solid ${OUTLINE_BORDER}`,
            borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 650,
            cursor: step.locked ? "not-allowed" : "pointer", whiteSpace: "nowrap",
          }}>
          {step.cta}
        </button>
      ) : null}
    </div>
  );
}
