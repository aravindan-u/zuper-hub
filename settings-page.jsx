import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Settings, LayoutGrid, FileText, Briefcase, ClipboardList, ListChecks,
  Bell, BookOpen, Ruler, Image, Wallet, UserPlus, UsersRound, ShieldCheck,
  Shield, Key, LogIn, Network, FileInput, FileOutput, History, Code,
  Webhook, Plug, LayoutDashboard, MessageSquareHeart, Palette, Users,
  Search, Clock, ChevronRight, SearchX, TrendingUp, DollarSign, Sparkles,
} from "lucide-react";

// ─── Design tokens (mirror zuper-shell.jsx) ────────────────────────────────────
const ACCENT       = "#E8522A";
const ACCENT_BG    = "#FEF3EB";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC     = "#6B7280";
const BORDER       = "#E5E7EB";
const HOVER_BG     = "#F3F4F6";
const CANVAS       = "#F9F9F9";

// Muted tile palettes (warm, never neon — per design principles)
const TILE = {
  blue:   { bg: "#EBF5FB", fg: "#1A6E9E" },
  green:  { bg: "#EBFAEF", fg: "#1A7A3C" },
  purple: { bg: "#F5EBFE", fg: "#6B1AAA" },
  orange: { bg: "#FEF3EB", fg: "#E8522A" },
  pink:   { bg: "#FDECF3", fg: "#B21E63" },
  teal:   { bg: "#E7F7F5", fg: "#0F766E" },
  amber:  { bg: "#FEF6E7", fg: "#B4690E" },
  indigo: { bg: "#EEEEFB", fg: "#4F46E5" },
};

// ─── Data model: every settings menu ──────────────────────────────────────────
const RECENT = [
  { title: "Job Category Hub",    Icon: LayoutGrid, tile: "green"  },
  { title: "User Management",     Icon: UserPlus,   tile: "green"  },
  { title: "API Keys",            Icon: Key,        tile: "purple" },
  { title: "Document Templates",  Icon: FileText,   tile: "pink"   },
  { title: "Roles & Permissions", Icon: ShieldCheck,tile: "orange" },
];

const SECTIONS = [
  { label: "General", Icon: Settings, accent: TILE.indigo.fg, items: [
    { title: "General Job Settings", desc: "Manage overall job settings", Icon: Settings, tile: "indigo" },
  ]},
  { label: "Categories & Tasks", Icon: LayoutGrid, accent: TILE.green.fg, items: [
    { title: "Job Category Hub",         desc: "Manage Category, Status, Checklist & more", Icon: LayoutGrid, tile: "green"  },
    { title: "Task Template",            desc: "Create and manage task templates",          Icon: FileText,   tile: "green"  },
    { title: "Non Job Event Categories", desc: "Manage Non Job Event categories",           Icon: Briefcase,  tile: "indigo" },
  ]},
  { label: "Templates & Custom Fields", Icon: FileText, accent: TILE.indigo.fg, items: [
    { title: "Job Card Templates", desc: "Create & manage job card template",  Icon: ClipboardList, tile: "purple" },
    { title: "Document Templates", desc: "Create & manage document templates", Icon: FileText,      tile: "pink", badge: "New" },
    { title: "Job Custom Fields",  desc: "Manage custom fields for job",        Icon: ListChecks,    tile: "amber"  },
    { title: "Inspection Forms",   desc: "Create and Manage inspection forms",  Icon: ClipboardList, tile: "pink"   },
  ]},
  { label: "Notifications", Icon: Bell, accent: TILE.orange.fg, items: [
    { title: "Job Notifications", desc: "Customize and manage job notifications", Icon: Bell, tile: "orange" },
  ]},
  { label: "Operations", Icon: TrendingUp, accent: TILE.blue.fg, items: [
    { title: "Skillsets",        desc: "Create and manage skillsets",           Icon: BookOpen, tile: "purple" },
    { title: "Measurements",     desc: "Manage Measurement Token and view all", Icon: Ruler,    tile: "orange", badge: "New" },
    { title: "Gallery Settings", desc: "Manage Default Albums",                 Icon: Image,    tile: "blue",   badge: "New" },
  ]},
  { label: "Finance", Icon: DollarSign, accent: TILE.green.fg, items: [
    { title: "Job Costing & Expenses", desc: "Manage labor costs, price markups, and more", Icon: Wallet, tile: "green", badge: "New" },
  ]},
  { label: "Users & Teams", Icon: Users, accent: TILE.purple.fg, items: [
    { title: "User Management", desc: "Create & manage users",        Icon: UserPlus,   tile: "green"  },
    { title: "Team Management", desc: "Create & manage teams",        Icon: UsersRound, tile: "purple" },
    { title: "User Groups",     desc: "Organize users into groups",   Icon: Users,      tile: "teal"   },
    { title: "Access Control",  desc: "Manage what each role can do", Icon: ShieldCheck,tile: "blue"   },
  ]},
  { label: "Security", Icon: Shield, accent: "#B23B3B", items: [
    { title: "Roles & Permissions", desc: "Define access levels",                     Icon: ShieldCheck, tile: "pink"   },
    { title: "Single Sign-On",      desc: "Configure SAML / OAuth login",             Icon: Key,         tile: "indigo" },
    { title: "Login Logs",          desc: "A comprehensive repository of all logins", Icon: LogIn,       tile: "pink"   },
    { title: "IP Restrictions",     desc: "Restrict workspace access by IP address",  Icon: Network,     tile: "blue"   },
  ]},
  { label: "Data Administration", Icon: History, accent: TILE.blue.fg, items: [
    { title: "Import Data", desc: "Bulk import records via CSV",         Icon: FileInput,  tile: "blue"  },
    { title: "Export Data", desc: "Export module data",                  Icon: FileOutput, tile: "teal"  },
    { title: "Audit Logs",  desc: "Track changes across the workspace",  Icon: History,    tile: "amber" },
  ]},
  { label: "Developer Hub", Icon: Code, accent: TILE.indigo.fg, items: [
    { title: "API Keys",     desc: "Generate and manage API keys", Icon: Key,     tile: "purple" },
    { title: "Webhooks",     desc: "Configure event webhooks",     Icon: Webhook, tile: "indigo" },
    { title: "Integrations", desc: "Connect third-party apps",     Icon: Plug,    tile: "blue"   },
  ]},
  { label: "Customer Experience", Icon: MessageSquareHeart, accent: TILE.pink.fg, items: [
    { title: "Customer Portal", desc: "Configure the self-service portal", Icon: LayoutDashboard,     tile: "pink"  },
    { title: "Feedback Forms",  desc: "Collect customer feedback",         Icon: MessageSquareHeart,  tile: "pink"  },
    { title: "Branding",        desc: "Customize logos and colors",        Icon: Palette,             tile: "amber" },
  ]},
];

// ─── Small building blocks ─────────────────────────────────────────────────────
function SectionLabel({ Icon, accent, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon size={16} color={accent} />
      <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_SEC, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {children}
      </span>
    </div>
  );
}

function NewBadge() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color: ACCENT, background: ACCENT_BG,
      borderRadius: 5, padding: "2px 6px", letterSpacing: "0.02em", flexShrink: 0,
    }}>New</span>
  );
}

function SettingCard({ item }) {
  const [hov, setHov] = useState(false);
  const t = TILE[item.tile];
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
        padding: 16, borderRadius: 10, background: "#fff", cursor: "pointer",
        border: `1px solid ${hov ? "#DAD9D4" : BORDER}`,
        boxShadow: hov ? "0 6px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all 160ms cubic-bezier(0.4,0,0.2,1)",
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: t.bg, color: t.fg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <item.Icon size={22} color={t.fg} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </span>
          {item.badge && <NewBadge />}
        </div>
        <div style={{ fontSize: 12.5, color: TEXT_SEC, marginTop: 3, lineHeight: 1.4 }}>{item.desc}</div>
      </div>
      <ChevronRight size={18} color="#B8B7B2" style={{ flexShrink: 0 }} />
    </button>
  );
}

function RecentCard({ item }) {
  const [hov, setHov] = useState(false);
  const t = TILE[item.tile];
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
        padding: 12, borderRadius: 10, background: "#fff", cursor: "pointer",
        border: `1px solid ${hov ? "#DAD9D4" : BORDER}`,
        boxShadow: hov ? "0 6px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all 160ms cubic-bezier(0.4,0,0.2,1)",
      }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, background: t.bg, color: t.fg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <item.Icon size={18} color={t.fg} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {item.title}
      </span>
    </button>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  // ⌘K / Ctrl+K focuses this page's search when Settings is open
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    if (!searching) return SECTIONS;
    return SECTIONS
      .map(sec => ({ ...sec, items: sec.items.filter(it =>
        (it.title + " " + it.desc).toLowerCase().includes(q)) }))
      .filter(sec => sec.items.length > 0);
  }, [q, searching]);

  const noResults = searching && filtered.length === 0;

  return (
    <div style={{ height: "100%", overflowY: "auto", background: CANVAS }}>
      <style>{`
        @keyframes su { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .su { animation: su 380ms cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      <div style={{ padding: "32px 40px 64px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Hero search */}
        <div className="su" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px 0 36px" }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: "-0.02em" }}>
            What do you want to configure?
          </h1>
          <p style={{ fontSize: 15, color: TEXT_SEC, marginTop: 8 }}>
            Search across every setting, or browse by category below.
          </p>
          <div style={{ position: "relative", width: "100%", maxWidth: 620, marginTop: 22 }}>
            <Search size={19} color={TEXT_SEC} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search settings — e.g. custom fields, API keys, roles…"
              style={{
                width: "100%", height: 50, paddingLeft: 46, paddingRight: 72,
                borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff",
                fontSize: 15, color: TEXT_PRIMARY, fontFamily: "inherit", outline: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color 150ms, box-shadow 150ms",
              }}
              onFocus={e => { e.target.style.borderColor = "#C9C8C3"; e.target.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"; }}
              onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
            />
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4, pointerEvents: "none" }}>
              <kbd style={{ fontSize: 11, background: "#F3F4F6", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "2px 6px", color: TEXT_SEC, fontFamily: "inherit" }}>⌘</kbd>
              <kbd style={{ fontSize: 11, background: "#F3F4F6", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "2px 6px", color: TEXT_SEC, fontFamily: "inherit" }}>K</kbd>
            </div>
          </div>
        </div>

        {/* Recently used */}
        {!searching && (
          <div className="su" style={{ marginBottom: 36, animationDelay: "60ms" }}>
            <SectionLabel Icon={Clock} accent={TEXT_SEC}>Recently used</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {RECENT.map((item, i) => <RecentCard key={i} item={item} />)}
            </div>
          </div>
        )}

        {/* Directory header + promo */}
        <div className="su" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 22, animationDelay: "100ms" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
            {searching ? "Search results" : "All Settings"}
          </h2>
          {!searching && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 10px 12px",
              borderRadius: 12, background: "linear-gradient(135deg,#FFF7F2,#FEF3EB)", border: `1px solid #F6D9C7`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>Explore new features</span>
                  <NewBadge />
                </div>
                <div style={{ fontSize: 12.5, color: TEXT_SEC, marginTop: 2 }}>We've added new modules to make management easier.</div>
              </div>
            </div>
          )}
        </div>

        {/* Directory */}
        {noResults ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "56px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: HOVER_BG, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <SearchX size={28} color={TEXT_SEC} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>No settings found</div>
            <div style={{ fontSize: 14, color: TEXT_SEC, marginTop: 4 }}>Try a different keyword.</div>
            <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} style={{
              marginTop: 18, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`,
              background: "#fff", color: TEXT_PRIMARY, fontSize: 13, fontWeight: 500, fontFamily: "inherit",
              cursor: "pointer",
            }}>Clear search</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {filtered.map((sec, si) => (
              <section key={sec.label} className="su" style={{ animationDelay: `${120 + si * 40}ms` }}>
                <SectionLabel Icon={sec.Icon} accent={sec.accent}>{sec.label}</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {sec.items.map((item, i) => <SettingCard key={i} item={item} />)}
                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
