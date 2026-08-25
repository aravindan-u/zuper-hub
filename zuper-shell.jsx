import React, { useState, useEffect, useRef } from "react";
import { Home, Radar } from "lucide-react";
import HomePage from "./home-page.jsx";
import RadarPage from "./radar-page.jsx";
import SensePage from "./sense-page.jsx";
import SettingsPage from "./settings-page.jsx";

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT       = "#FD5000";
const ACCENT_BG    = "#FFF0E8";
const SIDEBAR_BG   = "#F9F9F9";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC     = "#6B7280";
const BORDER       = "#E5E7EB";
const HOVER_BG     = "#F3F4F6";
const W_EXPANDED   = 220;
const W_COLLAPSED  = 56;

// ─── Icon primitives ──────────────────────────────────────────────────────────
function Ico({ size = 18, color = "currentColor", children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const FunnelIcon   = ({ size, color }) => <Ico size={size} color={color}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></Ico>;
const HandshakeIcon= ({ size, color }) => <Ico size={size} color={color}><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></Ico>;
const HardHatIcon  = ({ size, color }) => <Ico size={size} color={color}><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a2 2 0 0 1 4 0v5"/><path d="M4 15v-3a6 6 0 0 1 12 0v3"/></Ico>;
const ReceiptIcon  = ({ size, color }) => <Ico size={size} color={color}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></Ico>;
const BookIcon     = ({ size, color }) => <Ico size={size} color={color}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Ico>;

// Sense — 3×3 grid of rounded squares (from Zupersensevision)
function SenseLogo({ size = 18, color = "#FD5000" }) {
  const rectSize = 5;
  const gap = 1.75;
  const viewBoxSize = rectSize * 3 + gap * 2;
  const grayColor = "#FDDCC4";

  // S pattern: alternating orange and gray
  const pattern = [true, false, true, false, true, false, true, false, true];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} fill="none">
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => {
          const index = row * 3 + col;
          const isOrange = pattern[index];
          return (
            <rect
              key={`${row}-${col}`}
              x={col * (rectSize + gap)}
              y={row * (rectSize + gap)}
              width={rectSize}
              height={rectSize}
              rx="1"
              fill={isOrange ? color : grayColor}
            />
          );
        })
      )}
    </svg>
  );
}
const GearIcon     = ({ size, color }) => <Ico size={size} color={color}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Ico>;
const SearchIcon   = ({ size = 16, color = TEXT_SEC }) => <Ico size={size} color={color}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></Ico>;
const PlusIcon     = ({ size = 16, color = "#fff" }) => <Ico size={size} color={color}><path d="M12 5v14M5 12h14"/></Ico>;
const ChevronDown  = ({ size = 13, color = TEXT_SEC }) => <Ico size={size} color={color}><path d="M6 9l6 6 6-6"/></Ico>;
const BellIcon     = ({ size = 16, color = TEXT_SEC }) => <Ico size={size} color={color}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Ico>;
const CalIcon      = ({ size = 16, color = TEXT_SEC }) => <Ico size={size} color={color}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ico>;

// ─── Hub config ───────────────────────────────────────────────────────────────
const HUBS = [
  {
    id: "lead", label: "Lead Hub", tagline: "Get the work",
    chipBg: "#FEF3EB", chipText: ACCENT, newLabel: "New Lead",
    Icon: FunnelIcon,
    items: [
      { id: "pipeline",       label: "Pipeline" },
      { id: "channels",       label: "Channels" },
      { id: "campaigns",      label: "Campaigns" },
      { id: "nova-playbooks", label: "Nova Playbooks" },
      { id: "health",         label: "Health" },
    ],
    bottom: [
      { id: "reporting", label: "Reporting" },
      { id: "settings",  label: "Settings" },
    ],
  },
  {
    id: "sales", label: "Sales Hub", tagline: "Win the work",
    chipBg: "#EBF5FB", chipText: "#1A6E9E", newLabel: "New Estimate",
    Icon: HandshakeIcon,
    items: [
      { id: "pipeline",   label: "Pipeline" },
      { id: "scheduling", label: "Scheduling" },
      { id: "estimates",  label: "Estimates" },
      { id: "proposals",  label: "Proposals" },
      { id: "contracts",  label: "Contracts" },
    ],
    bottom: [
      { id: "reporting", label: "Reporting" },
      { id: "settings",  label: "Settings" },
    ],
  },
  {
    id: "production", label: "Production Hub", tagline: "Do the work",
    chipBg: "#EBFAEF", chipText: "#1A7A3C", newLabel: "New Work Order",
    Icon: HardHatIcon,
    items: [
      { id: "pipeline",        label: "Pipeline" },
      { id: "scheduling",      label: "Scheduling" },
      { id: "crews",           label: "Crews" },
      { id: "materials",       label: "Materials & PO" },
      { id: "subcontractors",  label: "Subcontractors" },
      { id: "work-orders",     label: "Work Orders" },
      { id: "job-sites",       label: "Job Sites" },
    ],
    bottom: [
      { id: "reporting", label: "Reporting" },
      { id: "settings",  label: "Settings" },
    ],
  },
  {
    id: "finance", label: "Finance Hub", tagline: "Get paid for it",
    chipBg: "#F5EBFE", chipText: "#6B1AAA", newLabel: "New Invoice",
    Icon: ReceiptIcon,
    items: [
      { id: "invoices",       label: "Invoices" },
      { id: "payments",       label: "Payments" },
      { id: "ar",             label: "AR Management" },
      { id: "financing",      label: "Financing" },
      { id: "profitability",  label: "Profitability" },
    ],
    bottom: [
      { id: "reporting", label: "Reporting" },
      { id: "settings",  label: "Settings" },
    ],
  },
];

// Wrapper for SenseLogo to match Icon interface
const SenseIcon = (props) => <SenseLogo size={18} />;

// Top-section items (Home, Radar, Sense) shown above the hubs
const TOP_NAV = [
  { id: "home",  label: "Home",  Icon: Home },
  { id: "radar", label: "Radar", Icon: Radar },
  { id: "sense", label: "Sense", Icon: SenseIcon },
];

const GLOBAL_NAV = [
  { id: "academy", label: "Academy", Icon: BookIcon },
];

// ─── Command palette data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS = HUBS.flatMap(h =>
  [...h.items, ...h.bottom].map(item => ({
    hubId: h.id, hubLabel: h.label,
    label: item.label, chipBg: h.chipBg, chipText: h.chipText,
  }))
);

const AGENTS = [
  { id: "nova",     label: "Ask Nova",         desc: "Lead qualification & follow-up" },
  { id: "field",    label: "Ask Field Agent",   desc: "Job site & crew support" },
  { id: "dispatch", label: "Ask Dispatch",      desc: "Scheduling & routing" },
  { id: "ar",       label: "Ask AR Agent",      desc: "Invoice & payment queries" },
];

// ─── Open tabs mock ───────────────────────────────────────────────────────────
const OPEN_TABS = [
  { id: "job-1",  label: "Job #JN-245678",  type: "job" },
  { id: "inv-1",  label: "Invoice #771233", type: "invoice" },
  { id: "inv-2",  label: "Invoice #771233", type: "invoice" },
  { id: "inv-3",  label: "Invoice #771233", type: "invoice" },
];

// ─── Sidebar sub-item ─────────────────────────────────────────────────────────
function SubItem({ label, active, onClick, hubId, itemId }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(hubId, itemId)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        padding: "7px 14px 7px 38px",
        background: hov && !active ? HOVER_BG : "transparent",
        border: "none", cursor: "pointer", textAlign: "left",
        transition: "background 100ms ease",
      }}
    >
      <span style={{
        width: 5, height: 5, borderRadius: "50%", marginRight: 9, flexShrink: 0,
        background: active ? ACCENT : "transparent",
        border: active ? "none" : `1.5px solid ${BORDER}`,
        transition: "background 120ms ease",
      }} />
      <span style={{ fontSize: 13, color: active ? ACCENT : TEXT_SEC, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>
        {label}
      </span>
    </button>
  );
}

// ─── Sidebar hub row ──────────────────────────────────────────────────────────
function HubRow({ hub, isActive, expanded, onHubClick }) {
  const [hov, setHov] = useState(false);
  const sw = expanded ? W_EXPANDED : W_COLLAPSED;
  return (
    <button
      onClick={onHubClick}
      title={!expanded ? hub.label : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        padding: expanded ? "9px 14px 9px 11px" : "10px 0",
        justifyContent: expanded ? "flex-start" : "center",
        gap: expanded ? 10 : 0,
        background: isActive ? ACCENT_BG : hov ? HOVER_BG : "transparent",
        border: "none",
        borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent",
        cursor: "pointer", textAlign: "left",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      <hub.Icon size={18} color={isActive ? ACCENT : TEXT_SEC} />
      {expanded && (
        <>
          <span style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? ACCENT : TEXT_PRIMARY, whiteSpace: "nowrap", lineHeight: 1.3 }}>
              {hub.label}
            </div>
            <div style={{ fontSize: 10, color: isActive ? ACCENT : TEXT_SEC, opacity: 0.75, whiteSpace: "nowrap", marginTop: 1 }}>
              {hub.tagline}
            </div>
          </span>
          <ChevronDown
            size={12}
            color={isActive ? ACCENT : TEXT_SEC}
          />
        </>
      )}
    </button>
  );
}

// ─── Global nav item ──────────────────────────────────────────────────────────
function GlobalNavItem({ item, expanded, isActive, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={!expanded ? item.label : undefined}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        padding: expanded ? "9px 14px 9px 14px" : "10px 0",
        justifyContent: expanded ? "flex-start" : "center",
        gap: expanded ? 10 : 0,
        background: isActive ? ACCENT_BG : hov ? HOVER_BG : "transparent",
        border: "none", borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent",
        cursor: "pointer", textAlign: "left",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      <item.Icon size={18} color={isActive ? ACCENT : TEXT_SEC} />
      {expanded && <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? ACCENT : TEXT_PRIMARY, whiteSpace: "nowrap" }}>{item.label}</span>}
    </button>
  );
}

// ─── Tab strip tab ────────────────────────────────────────────────────────────
function Tab({ tab, active }) {
  const [hov, setHov] = useState(false);
  const isJob = tab.type === "job";
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "0 10px", height: 32, borderRadius: 6,
        background: active ? "#fff" : hov ? HOVER_BG : "transparent",
        border: `1px solid ${active ? BORDER : "transparent"}`,
        cursor: "pointer", flexShrink: 0,
        fontSize: 12, color: active ? TEXT_PRIMARY : TEXT_SEC,
        fontWeight: active ? 500 : 400,
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
        transition: "background 120ms ease",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isJob
          ? <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>
          : <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>
        }
      </svg>
      <span style={{ whiteSpace: "nowrap" }}>{tab.label}</span>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose, activeHub }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQuery(""); setSelected(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const results = query
    ? PALETTE_SECTIONS.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.hubLabel.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleKey = (e) => {
    const list = query ? results : [];
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, list.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Escape")    onClose();
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(2px)",
        zIndex: 100,
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        paddingTop: "14vh",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 560, background: "#fff", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
          animation: "paletteIn 150ms cubic-bezier(0.23,1,0.32,1) both",
        }}
      >
        {/* Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <SearchIcon size={17} color={TEXT_SEC} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKey}
            placeholder="Search, navigate, or type a command..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: TEXT_PRIMARY, background: "transparent" }}
          />
          <kbd style={{ fontSize: 11, background: "#F3F4F6", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "2px 6px", color: TEXT_SEC, fontFamily: "inherit" }}>ESC</kbd>
        </div>

        {/* Body */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {!query ? (
            <div style={{ padding: "14px 16px 16px" }}>
              {/* Agent chips */}
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>AI Agents</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                {AGENTS.map(agent => (
                  <button key={agent.id} style={{
                    padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`,
                    background: SIDEBAR_BG, cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{agent.label}</div>
                    <div style={{ fontSize: 11, color: TEXT_SEC, marginTop: 2 }}>{agent.desc}</div>
                  </button>
                ))}
              </div>

              {/* Hub quick-nav */}
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Hubs</div>
              {HUBS.map(hub => (
                <div key={hub.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid #F9F9F9`, cursor: "pointer" }}>
                  <hub.Icon size={15} color={TEXT_SEC} />
                  <span style={{ fontSize: 13, color: TEXT_PRIMARY, fontWeight: 500, flex: 1 }}>{hub.label}</span>
                  <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 99, background: hub.chipBg, color: hub.chipText, fontWeight: 600 }}>{hub.tagline}</span>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: 36, textAlign: "center", color: TEXT_SEC, fontSize: 14 }}>No results for "{query}"</div>
          ) : (
            <div style={{ padding: "6px 0" }}>
              {results.map((r, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 16px",
                    background: i === selected ? HOVER_BG : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <SearchIcon size={14} color={TEXT_SEC} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY, flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: TEXT_SEC }}>{r.hubLabel}</span>
                  <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 99, background: r.chipBg, color: r.chipText, fontWeight: 600, flexShrink: 0 }}>
                    {r.hubLabel.replace(" Hub", "")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────────────────────
export function ZuperShell({ children }) {
  const [activePage, setActivePage] = useState("home"); // "home", "radar", "sense", or hub-based
  const [activeHub, setActiveHub]   = useState("lead");
  const [activeItem, setActiveItem] = useState("pipeline");
  const [expanded, setExpanded]     = useState(true);
  const [palette, setPalette]       = useState(false);
  const [activeTab, setActiveTab]   = useState(OPEN_TABS[0].id);

  const hub = HUBS.find(h => h.id === activeHub);

  // Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPalette(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleHubClick = (hubId) => {
    if (activeHub === hubId) {
      setExpanded(v => !v);
    } else {
      setActiveHub(hubId);
      setActiveItem(HUBS.find(h => h.id === hubId).items[0].id);
      setExpanded(true);
    }
    setActivePage(`${hubId}-pipeline`);
  };

  const handleSubItemClick = (hubId, itemId) => {
    setActiveItem(itemId);
    setActivePage(`${hubId}-${itemId}`);
  };

  const sw = expanded ? W_EXPANDED : W_COLLAPSED;

  return (
    <>
      <style>{`
        @keyframes paletteIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        button { font-family: inherit; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F9F9F9" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: sw, minWidth: sw, flexShrink: 0,
          background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}`,
          display: "flex", flexDirection: "column",
          transition: "width 200ms ease-out, min-width 200ms ease-out",
          overflow: "hidden", position: "relative", zIndex: 10,
        }}>

          {/* Logo */}
          <div style={{
            height: 48, display: "flex", alignItems: "center",
            padding: expanded ? "0 14px" : "0",
            justifyContent: expanded ? "flex-start" : "center",
            borderBottom: `1px solid ${BORDER}`, flexShrink: 0, gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, background: ACCENT, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            {expanded && (
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
                zuper
              </span>
            )}
          </div>

          {/* Scrollable nav area */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "6px 0" }}>

            {/* Top section: Home · Radar · Sense */}
            {TOP_NAV.map(item => (
              <GlobalNavItem
                key={item.id}
                item={item}
                expanded={expanded}
                isActive={activePage === item.id}
                onClick={() => setActivePage(item.id)}
              />
            ))}

            <div style={{ height: 1, background: BORDER, margin: "6px 12px" }} />

            {/* Hub rows */}
            {HUBS.map(h => {
              const isActive = activeHub === h.id;
              const isOpen   = isActive && expanded;
              return (
                <div key={h.id}>
                  <HubRow
                    hub={h}
                    isActive={isActive}
                    expanded={expanded}
                    onHubClick={() => handleHubClick(h.id)}
                  />

                  {/* Sub-items (only when this hub is active & sidebar expanded) */}
                  {isOpen && (
                    <div style={{ paddingBottom: 4 }}>
                      {h.items.map(item => (
                        <SubItem
                          key={item.id}
                          label={item.label}
                          active={activeItem === item.id}
                          onClick={handleSubItemClick}
                          hubId={h.id}
                          itemId={item.id}
                        />
                      ))}

                      {/* Divider before Reporting / Settings */}
                      <div style={{ height: 1, background: BORDER, margin: "6px 14px 6px 38px" }} />

                      {h.bottom.map(item => (
                        <SubItem
                          key={item.id}
                          label={item.label}
                          active={activeItem === item.id}
                          onClick={handleSubItemClick}
                          hubId={h.id}
                          itemId={item.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Global divider */}
            <div style={{ height: 1, background: BORDER, margin: "6px 12px" }} />

            {/* Academy */}
            {GLOBAL_NAV.map(item => (
              <GlobalNavItem
                key={item.id}
                item={item}
                expanded={expanded}
                isActive={activePage === item.id}
                onClick={() => setActivePage(item.id)}
              />
            ))}
          </div>

          {/* Settings pinned at bottom */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: "4px 0", flexShrink: 0 }}>
            <GlobalNavItem
              item={{ id: "settings", label: "Settings", Icon: GearIcon }}
              expanded={expanded}
              isActive={activePage === "settings"}
              onClick={() => setActivePage("settings")}
            />
          </div>
        </div>

        {/* ── Right column: top bar + content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 48, display: "flex", alignItems: "center",
            background: "#fff", borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0, paddingLeft: 10, paddingRight: 14, gap: 6,
          }}>

            {/* Tab strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflow: "hidden" }}>
              {OPEN_TABS.map(tab => (
                <Tab key={tab.id} tab={tab} active={activeTab === tab.id} />
              ))}
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 3,
                  padding: "0 8px", height: 28, border: "none",
                  background: "transparent", cursor: "pointer",
                  fontSize: 12, color: TEXT_SEC, whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                All Tabs <ChevronDown size={11} />
              </button>
            </div>

            {/* Cmd+K search pill */}
            <button
              onClick={() => setPalette(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "0 11px", height: 30, borderRadius: 6,
                border: `1px solid ${BORDER}`, background: SIDEBAR_BG,
                cursor: "pointer", fontSize: 12, color: TEXT_SEC,
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              <SearchIcon size={13} />
              <span>Search or jump to...</span>
              <span style={{
                fontSize: 10, background: BORDER, borderRadius: 3,
                padding: "1px 5px", color: "#374151", fontWeight: 600,
              }}>⌘K</span>
            </button>

            {/* Self-serve onboarding entry points */}
            <button
              onClick={() => { window.location.hash = "#/onboarding"; }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 12px", height: 32, borderRadius: 6,
                background: ACCENT_BG, border: `1px solid #FFD2BC`,
                cursor: "pointer", fontSize: 13, fontWeight: 700, color: ACCENT,
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              Option 1 setup
            </button>
            <button
              onClick={() => { window.location.hash = "#/lead-hub-onboarding"; }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 12px", height: 32, borderRadius: 6,
                background: "#fff", border: `1px solid #FFD2BC`,
                cursor: "pointer", fontSize: 13, fontWeight: 700, color: ACCENT,
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              Option 2 Zuper setup
            </button>
            <button
              onClick={() => { window.location.hash = "#/login-first-onboarding"; }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 12px", height: 32, borderRadius: 6,
                background: "#fff", border: `1px solid #FFD2BC`,
                cursor: "pointer", fontSize: 13, fontWeight: 700, color: ACCENT,
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              Option 3 login setup
            </button>

            {/* Context-aware + New */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0 14px", height: 32, borderRadius: 6,
              background: ACCENT, border: "none",
              cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff",
              flexShrink: 0, whiteSpace: "nowrap",
            }}>
              <PlusIcon size={14} />
              {hub?.newLabel || "New"}
            </button>

            {/* Icon cluster */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              {[
                { label: "Calendar",      Icon: CalIcon },
                { label: "Notifications", Icon: BellIcon },
              ].map(({ label, Icon }) => {
                const [hov, setHov] = useState(false);
                return (
                  <button key={label} title={label}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                      background: hov ? HOVER_BG : "transparent", border: "none", cursor: "pointer", borderRadius: 6,
                    }}>
                    <Icon size={16} color={TEXT_SEC} />
                  </button>
                );
              })}
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#374151",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer", marginLeft: 2,
              }}>RG</div>
            </div>
          </div>

          {/* Main content area */}
          <div style={{ flex: 1, overflow: "hidden", background: "#F9F9F9" }}>
            {activePage === "home" ? <HomePage /> : activePage === "radar" ? <RadarPage /> : activePage === "sense" ? <SensePage /> : activePage === "settings" ? <SettingsPage /> : children}
          </div>
        </div>
      </div>

      {/* Command palette */}
      <CommandPalette open={palette} onClose={() => setPalette(false)} activeHub={activeHub} />
    </>
  );
}
