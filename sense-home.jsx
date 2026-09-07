// Sense-style dashboard home — a faithful reproduction of the Zuper Sense Vision
// homepage (left icon rail + top bar + "What needs you today?" prompt hero +
// Needs-you / Radar / Today cards). Referenced from Zuper-Design/Zupersensevision.
import React, { useState } from "react";
import { readProfile } from "./migrationState.js";
import {
  Home, Radar, Briefcase, CalendarDays, Contact, Clock, Package, Wallet, Settings,
  PanelLeftClose, SlidersHorizontal, Sparkles, HelpCircle, Search, Bell, ChevronDown,
  X, Plus, Mic, Users, DollarSign, Gauge, TrendingUp, LayoutGrid, Stamp, FlaskConical,
  ChevronRight, Rocket,
} from "lucide-react";

const BRAND = "#FD5000";
const BRAND_BG = "#FFF1EA";
const INK = "#1C1E21";
const SEC = "#6B7280";
const MUT = "#9CA3AF";
const LINE = "#ECECEA";
const CANVAS = "#F7F4EF";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const NAV = [
  { icon: Home, label: "Home", active: true },
  { icon: Radar, label: "Radar" },
  { icon: Briefcase, label: "Work" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: Contact, label: "CRM" },
  { icon: Clock, label: "Timesheets" },
  { icon: Package, label: "Inventory" },
  { icon: Wallet, label: "Finance" },
];

const CHIPS = [
  { icon: Users, label: "Team Performance" },
  { icon: DollarSign, label: "Revenue Analysis" },
  { icon: Gauge, label: "Efficiency Metrics" },
  { icon: TrendingUp, label: "Growth trends" },
];

export default function SenseHome() {
  const profile = readProfile() || {};
  const firstName = profile.firstName || "Martin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#fff", fontFamily: FONT, color: INK }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }
        .sh-scroll::-webkit-scrollbar { width: 10px; } .sh-scroll::-webkit-scrollbar-thumb { background: #E7E3DC; border-radius: 6px; border: 3px solid #fff; }`}</style>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <div className="sh-scroll" style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          <ContentToolbar />
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 40px 120px" }}>
            {/* Greeting */}
            <div style={{ textAlign: "center", marginTop: 46 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: SEC }}>
                <DotGrid /> {greeting}, {firstName}
              </div>
              <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", color: INK, margin: "14px 0 0", lineHeight: 1.1 }}>
                What needs you today?
              </h1>
            </div>

            {/* Prompt box */}
            <div style={{ marginTop: 30, maxWidth: 960, marginLeft: "auto", marginRight: "auto" }}>
              <PromptBox />
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                {CHIPS.map((c) => (
                  <button key={c.label} style={chipStyle}>
                    <c.icon size={15} color={SEC} /> {c.label}
                  </button>
                ))}
                <button style={{ ...chipStyle, padding: "9px 12px" }}><LayoutGrid size={16} color={SEC} /></button>
              </div>
            </div>

            {/* Needs you */}
            <div style={{ marginTop: 54 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: INK }}>Needs you</span>
                <span style={{ fontSize: 13.5, color: MUT }}>9 records</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 20, alignItems: "start" }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Card>
                    <CardHead icon={Users} title="Unassigned jobs today" badge="2" />
                    <JobRow n="#4462" name="Prewitt residence" sub="Starts 11:00 · materials already dropped" right="in 2h 18m" />
                    <JobRow n="#4471" name="Alder Court" sub="Starts 14:00 · materials not delivered" right="in 5h 18m" last />
                  </Card>

                  <Card>
                    <CardHead icon={Stamp} title="Approvals waiting on you" badge="4" action="View all" />
                    <JobRow n="PO #4471" name="Beacon Supply" sub="Blocks Wednesday's Sandoval install" right="$8,240 · 6 days" rightTone={BRAND} last />
                  </Card>
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ ...cardStyle, borderColor: "#F0E2D6", background: "linear-gradient(180deg,#FFFDFB,#FFF8F2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px 8px" }}>
                      <span style={{ fontSize: 15.5, fontWeight: 800, color: INK }}>Radar</span>
                      <span style={badge}>2</span>
                    </div>
                    <RadarRow tag="Hail alert" at="6:10am" body="6 jobs are in Thursday's hail path, 2 with decking open" />
                    <RadarRow tag="Material orders unsent" at="Monday" body="3 orders sat past the 2-day limit — the limit is none" last />
                  </div>

                  <div style={cardStyle}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px 12px" }}>
                      <span style={{ fontSize: 15.5, fontWeight: 800, color: INK }}>Today</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 700, color: SEC, cursor: "pointer" }}>Schedule</span>
                    </div>
                    <MiniWeek />
                    <div style={{ padding: "4px 18px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${LINE}` }}>
                        <span style={{ width: 3, height: 30, borderRadius: 2, background: BRAND, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>Sandoval install</div>
                          <div style={{ fontSize: 12, color: SEC }}>8:00 AM · Crew A · 3 stops</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sense button */}
      <button title="Zuper Sense" style={{ position: "fixed", right: 26, bottom: 26, width: 56, height: 56, borderRadius: "50%", background: "#1C1E21", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FlaskConical size={23} />
      </button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  return (
    <aside style={{ width: 78, flexShrink: 0, background: "#fff", borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, paddingBottom: 12 }}>
      <ZuperMark />
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 16, width: "100%", alignItems: "center" }}>
        {NAV.map((item) => <NavItem key={item.label} item={item} />)}
      </nav>
      <div style={{ marginTop: "auto" }}>
        <NavItem item={{ icon: Settings, label: "Settings" }} />
      </div>
    </aside>
  );
}

function NavItem({ item }) {
  const [hov, setHov] = useState(false);
  const active = item.active;
  const tint = active || hov;
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 62, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "9px 0", border: "none", background: "transparent", cursor: "pointer", fontFamily: FONT }}>
      <span style={{ width: 42, height: 34, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: active ? BRAND_BG : hov ? "#F5F4F2" : "transparent", transition: "background 120ms ease" }}>
        <item.icon size={21} color={tint ? BRAND : "#4B5563"} strokeWidth={active ? 2.3 : 2} />
      </span>
      <span style={{ fontSize: 11, fontWeight: active ? 700 : 600, color: active ? INK : SEC }}>{item.label}</span>
    </button>
  );
}

function ZuperMark() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16l-9 7h9L4 20l9-7H4z" fill={BRAND} /></svg>
    </div>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────
export function TopBar() {
  return (
    <header style={{ height: 54, flexShrink: 0, background: CANVAS, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 9, padding: "6px 10px", fontSize: 13, fontWeight: 650, color: INK, maxWidth: 200 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Job -#JN-245…</span>
          <X size={13} color={MUT} />
        </div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", fontSize: 13, fontWeight: 650, color: SEC, cursor: "pointer", fontFamily: FONT }}>
          All Tabs <ChevronDown size={14} />
        </button>
      </div>
      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => { window.location.hash = "#/setup"; }}
          title="Start the guided onboarding"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: BRAND, border: "none", borderRadius: 9, padding: "7px 13px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: FONT }}>
          <Rocket size={15} /> Onboarding
        </button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 9, padding: "6px 12px", fontSize: 13, fontWeight: 700, color: INK, cursor: "pointer", fontFamily: FONT }}>
          <DotGrid small /> Ask Sense
        </button>
        <TopIcon icon={HelpCircle} />
        <TopIcon icon={Search} />
        <TopIcon icon={Bell} dot />
        <TopIcon icon={Settings} />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 800, marginLeft: 4 }}>MJ</div>
      </div>
    </header>
  );
}

function TopIcon({ icon: Icon, dot }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", width: 34, height: 34, borderRadius: 9, border: "none", background: hov ? "#EFEBE4" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={18} color={SEC} />
      {dot && <span style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: "50%", background: BRAND, border: `1.5px solid ${CANVAS}` }} />}
    </button>
  );
}

export function ContentToolbar() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 0" }}>
      <button style={toolBtn}><PanelLeftClose size={18} color={SEC} /></button>
      <button style={toolBtn}><SlidersHorizontal size={18} color={SEC} /></button>
    </div>
  );
}

// ─── Prompt box (reusable) ───────────────────────────────────────────────────
export function PromptField({ value, onChange, onSubmit, placeholder = "What's the revenue for this quarter?" }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1.5px solid ${foc ? "#D9D3CA" : LINE}`, borderRadius: 16, padding: "14px 16px", boxShadow: foc ? "0 8px 30px rgba(20,10,0,.08)" : "0 2px 10px rgba(20,10,0,.04)", transition: "all 140ms ease" }}>
      <Search size={19} color={MUT} style={{ flexShrink: 0 }} />
      <input
        value={value} onChange={(e) => onChange?.(e.target.value)} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSubmit?.(); } }}
        placeholder={placeholder}
        style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT, fontSize: 16, color: INK, background: "transparent", minWidth: 0 }}
      />
      <button onClick={() => onSubmit?.()} style={roundIcon}><Plus size={18} color={SEC} /></button>
      <button style={roundIcon}><Mic size={18} color={SEC} /></button>
    </div>
  );
}

function PromptBox() {
  const [q, setQ] = useState("");
  return <PromptField value={q} onChange={setQ} onSubmit={() => {}} />;
}

// ─── Cards & rows ────────────────────────────────────────────────────────────
const cardStyle = { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,.03)" };
function Card({ children }) { return <div style={cardStyle}>{children}</div>; }

function CardHead({ icon: Icon, title, badge, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" }}>
      <Icon size={17} color={SEC} />
      <span style={{ fontSize: 15, fontWeight: 800, color: INK, flex: 1 }}>{title}</span>
      {action && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 700, color: SEC, cursor: "pointer" }}>{action} <ChevronRight size={14} /></span>}
      {badge && <span style={badgeGrey}>{badge}</span>}
    </div>
  );
}

function JobRow({ n, name, sub, right, rightTone, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: `1px solid ${LINE}`, background: hov ? "#FBFAF8" : "transparent", cursor: "pointer" }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}><span style={{ color: SEC, fontWeight: 700 }}>{n}</span> · {name}</div>
        <div style={{ fontSize: 12.5, color: SEC, marginTop: 2 }}>{sub}</div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: rightTone || SEC, whiteSpace: "nowrap" }}>{right}</span>
    </div>
  );
}

function RadarRow({ tag, at, body, last }) {
  return (
    <div style={{ padding: "12px 18px", borderTop: `1px solid #F0E6DB` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#8A6552" }}>{tag}</span>
        <span style={{ fontSize: 12, color: MUT }}>{at}</span>
      </div>
      <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.5, marginTop: 5 }}>{body}</div>
    </div>
  );
}

function MiniWeek() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date().getDay();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "0 18px 8px" }}>
      {days.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: MUT }}>{d}</span>
          <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, background: i === today ? INK : "transparent", color: i === today ? "#fff" : SEC }}>{20 + i}</span>
        </div>
      ))}
    </div>
  );
}

export function DotGrid({ small }) {
  const s = small ? 14 : 18;
  return (
    <span style={{ display: "inline-grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1.5, width: s, height: s }}>
      {[BRAND, "#F7B79F", BRAND, "#F7B79F", BRAND, "#F7B79F", BRAND, "#F7B79F", BRAND].map((c, i) => (
        <span key={i} style={{ background: c, borderRadius: 1 }} />
      ))}
    </span>
  );
}

const chipStyle = { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 999, padding: "9px 15px", fontSize: 13.5, fontWeight: 600, color: INK, cursor: "pointer", fontFamily: FONT, boxShadow: "0 1px 2px rgba(0,0,0,.03)" };
const roundIcon = { width: 34, height: 34, borderRadius: 10, border: "none", background: "#F5F4F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const toolBtn = { width: 34, height: 34, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const badge = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 22, borderRadius: 999, background: BRAND_BG, color: BRAND, fontSize: 12, fontWeight: 800, padding: "0 7px" };
const badgeGrey = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 22, borderRadius: 999, background: "#F2F4F7", color: SEC, fontSize: 12, fontWeight: 800, padding: "0 7px" };
