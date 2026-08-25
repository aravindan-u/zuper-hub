import React from "react";

const ACCENT = "#FD5000";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC = "#6B7280";
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

      {/* Finish-setup banner → launches the self-serve onboarding flow */}
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
          onClick={() => { window.location.hash = "#/onboarding"; }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C43D18")}
          onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
          style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 140ms ease" }}>
          Start setup guide →
        </button>
      </div>

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
