import React, { useEffect, useState } from "react";
import { readOnboardingState, migrationProgress, readPhase, setPhase } from "./migrationState.js";

const ACCENT = "#FD5000";
const ACCENT_DARK = "#D54400";
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
        <SetupJourney prog={prog} />
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

function SetupJourney({ prog }) {
  const [phase, setPhaseState] = useState(() => readPhase());
  const go = (n) => {
    const p = Math.max(1, Math.min(4, n));
    setPhaseState(p);
    setPhase(p);
  };

  const migrating = prog.active;
  const migrated = prog.done;
  const completedFraction = 1 + (migrated ? 1 : migrating ? prog.pct : 0);
  const phase1Pct = Math.round((completedFraction / 4) * 100);

  const meta = PHASE_META[phase];

  return (
    <div style={{
      marginBottom: 32, background: "#fff", border: `1.5px solid ${ACCENT}`,
      borderRadius: 16, padding: "22px 26px 20px", boxShadow: "0 8px 26px rgba(253,80,0,.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{meta.icon}</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY }}>{meta.title}</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "#FEF3EB", borderRadius: 999, padding: "3px 10px" }}>Phase {phase} of 4</span>
        </div>
        {phase === 1 && (
          <div style={{ fontSize: 14, color: TEXT_SEC }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY }}>{phase1Pct}%</span> completed
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ marginTop: 18 }}>
        {phase === 1 && <PhaseGettingStarted prog={prog} totalPct={phase1Pct} />}
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
            onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", transition: "background 140ms ease" }}>
            Next phase: {PHASE_META[phase + 1].title} →
          </button>
        ) : (
          <span style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>🎉 You're all set up</span>
        )}
      </div>
    </div>
  );
}

// Phase 1 — the onboarding + migration stepper.
function PhaseGettingStarted({ prog, totalPct }) {
  const migrating = prog.active;
  const migrated = prog.done;

  const steps = [
    { n: 1, title: "Onboarding", desc: "Your workspace basics are configured.", status: "done" },
    {
      n: 2,
      title: prog.source ? `Connect ${prog.source}` : "Connect existing CRM",
      desc: migrated ? "All your records are now in Zuper."
        : migrating ? "Migrating your customers, jobs & documents…"
        : "Bring your customers, jobs, and history across.",
      status: migrated ? "done" : migrating ? "active" : "pending",
      progress: migrating ? prog.pct : null,
      cta: !migrating && !migrated ? "Connect" : null,
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
  ];

  return (
    <div>
      <div style={{ height: 8, borderRadius: 999, background: "#F1ECE6", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ height: "100%", width: `${totalPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`, transition: "width .4s ease" }} />
      </div>
      {steps.map((step, i) => (
        <StepRow key={step.n} step={step} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}

// Phase 2 — review the generated setup, then create a real job + proposal.
const REVIEW_ITEMS = [
  { icon: "✅", name: "Checklist", desc: "Job checklists per category" },
  { icon: "📋", name: "Inspection form", desc: "On-site capture fields" },
  { icon: "🗂️", name: "Tasks", desc: "Standard task templates" },
  { icon: "🏷️", name: "Job categories", desc: "Generated from your services" },
  { icon: "🚦", name: "Status", desc: "Pipeline stages & statuses" },
  { icon: "📦", name: "Service package", desc: "Bundled services & pricing" },
  { icon: "📄", name: "Proposal Templates", desc: "Built from your sample" },
  { icon: "🧮", name: "CPQ", desc: "Quote configuration rules" },
];

function PhaseReview() {
  return (
    <div>
      <p style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "0 0 18px" }}>
        Review everything Zuper generated for you. Your goal in this phase: turn a sample into a
        <strong style={{ color: TEXT_PRIMARY }}> real job and a real proposal</strong>.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {REVIEW_ITEMS.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 14px", background: "#FCFCFB" }}>
            <span style={{ fontSize: 20, width: 34, textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{item.name}</div>
              <div style={{ fontSize: 12, color: TEXT_SEC, marginTop: 1 }}>{item.desc}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, whiteSpace: "nowrap", cursor: "pointer" }}>Review →</span>
          </div>
        ))}
      </div>

      {/* Goal callout */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, background: "linear-gradient(120deg, #FEF3EB, #FFF9F4)", border: "1px solid #F4D9C8", borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: TEXT_PRIMARY }}>Ready to go live?</div>
          <div style={{ fontSize: 13, color: TEXT_SEC, marginTop: 2 }}>Once your setup looks right, create your first real job and proposal.</div>
        </div>
        <button style={pillBtn(false)}>Create a job</button>
        <button style={pillBtn(true)}>Create a proposal</button>
      </div>
    </div>
  );
}

// Phase 3 — integrations across communication, payment, and lead management.
const INTEGRATION_GROUPS = [
  { icon: "💬", group: "Communication", providers: ["RingCentral", "Twilio", "Slack"] },
  { icon: "💳", group: "Payment", providers: ["Stripe", "QuickBooks Payments", "Square"] },
  { icon: "🎯", group: "Lead management", providers: ["HubSpot", "Angi", "Salesforce"] },
];

function PhaseIntegrations() {
  return (
    <div>
      <p style={{ fontSize: 14, color: TEXT_SEC, lineHeight: 1.5, margin: "0 0 18px" }}>
        Connect the tools you already run on so Zuper stays in sync end to end.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {INTEGRATION_GROUPS.map((g) => (
          <div key={g.group} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, background: "#FCFCFB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{g.icon}</span>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: TEXT_PRIMARY }}>{g.group}</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {g.providers.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "9px 12px", background: "#fff" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: TEXT_PRIMARY }}>{p}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT, cursor: "pointer" }}>Connect</span>
                </div>
              ))}
            </div>
          </div>
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
    background: disabled ? "#F3F4F6" : filled ? ACCENT : "#fff",
    color: disabled ? TEXT_MUT : filled ? "#fff" : ACCENT,
    border: filled || disabled ? "none" : `1.5px solid ${ACCENT}`,
    borderRadius: 999, padding: "9px 18px", fontSize: 13.5, fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
  };
}

function StepRow({ step, isLast }) {
  const done = step.status === "done";
  const active = step.status === "active";

  const marker = done ? (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>✓</span>
  ) : active ? (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `3px solid ${ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />
    </span>
  ) : (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `2px solid ${BORDER}`, flexShrink: 0 }} />
  );

  const stepLabelColor = done ? GREEN : active ? ACCENT : step.locked ? TEXT_MUT : ACCENT;

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
            <div style={{ height: 6, borderRadius: 999, background: "#F1ECE6", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(step.progress * 100)}%`, borderRadius: 999, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`, transition: "width .4s ease" }} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, marginTop: 6 }}>
              {Math.round(step.progress * 100)}% · migrating in the background
            </div>
          </div>
        )}
      </div>

      {/* Step action */}
      {step.cta && !done && (
        <button
          disabled={step.locked}
          style={{
            alignSelf: "center", flexShrink: 0,
            background: step.locked ? "#F7D9C9" : active ? ACCENT : "#fff",
            color: step.locked ? "#fff" : active ? "#fff" : ACCENT,
            border: active || step.locked ? "none" : `1.5px solid ${ACCENT}`,
            borderRadius: 999, padding: "9px 22px", fontSize: 14, fontWeight: 700,
            cursor: step.locked ? "not-allowed" : "pointer", whiteSpace: "nowrap",
          }}>
          {step.cta}
        </button>
      )}
    </div>
  );
}
