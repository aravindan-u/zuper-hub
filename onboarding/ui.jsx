import React, { useState } from "react";
import {
  Home, Building2, Layers, ShieldCheck, CircleDashed, Inbox, FileText, Calendar,
  Users, Receipt, ArrowRight, ArrowLeft, Check, CheckCircle2, Circle, Mail, Phone,
  Upload, Sparkles, MessageCircle, X, HelpCircle, LifeBuoy, Bot, Ticket,
  CalendarClock, ChevronRight, Search, Bell, Plus, MapPin, DollarSign, Zap,
  Trash2, Image, PartyPopper, Menu, Loader2, ArrowUpRight,
} from "lucide-react";

// ─── Theme tokens (warm, grounded, Zuper orange) ─────────────────────────────
export const T = {
  // Brand accent is CSS-variable driven so a single flow (e.g. Option 2) can
  // re-theme it on its root without affecting the others. Defaults = Zuper orange.
  brand: "var(--z-brand, #FD5000)", brandDark: "var(--z-brand-dark, #D54400)", brandBg: "var(--z-brand-bg, #FFF0E8)",
  text: "#1A1A1A", textSec: "#6B7280", textMut: "#9CA3AF",
  border: "#E7E3DC", borderSoft: "#EFEBE4",
  canvas: "#F7F4EF", surface: "#FFFFFF",
  green: "#1A7A3C", greenBg: "#EBFAEF", amber: "#B4690E", amberBg: "#FEF6E7",
  blue: "#1A6E9E", purple: "#6B1AAA",
  radius: 14, shadow: "0 1px 3px rgba(0,0,0,0.05)", shadowLg: "0 16px 40px rgba(20,10,0,0.14)",
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// ─── Icon registry (lets config reference icons by string name) ──────────────
const ICONS = {
  Home, Building2, Layers, ShieldCheck, CircleDashed, Inbox, FileText, Calendar,
  Users, Receipt, MapPin, DollarSign,
};
export function Icon({ name, size = 20, color = "currentColor", strokeWidth = 2 }) {
  const C = ICONS[name] || Circle;
  return <C size={size} color={color} strokeWidth={strokeWidth} />;
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", disabled, full, size = "md", IconR, IconL, type = "button" }) {
  const [hov, setHov] = useState(false);
  const pad = size === "lg" ? "13px 22px" : "10px 18px";
  const styles = {
    primary: { background: disabled ? "#F0D6C9" : hov ? T.brandDark : T.brand, color: "#fff", border: "none" },
    secondary: { background: hov ? "#F7F4EF" : "#fff", color: T.text, border: `1px solid ${T.border}` },
    ghost: { background: hov ? T.brandBg : "transparent", color: T.brand, border: "none" },
  }[variant];
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...styles, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: full ? "100%" : "auto", padding: pad, borderRadius: 10, fontFamily: T.font,
        fontSize: size === "lg" ? 16 : 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 140ms ease", boxShadow: variant === "primary" && !disabled ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
        whiteSpace: "nowrap",
      }}>
      {IconL && <IconL size={18} />}{children}{IconR && <IconR size={18} />}
    </button>
  );
}

// ─── Text field ──────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, placeholder, type = "text", hint, autoFocus, LeftIcon, maxLength }) {
  const [foc, setFoc] = useState(false);
  return (
    <label style={{ display: "block", textAlign: "left" }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 7 }}>{label}</div>}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, background: "#fff",
        border: `1.5px solid ${foc ? T.brand : T.border}`, borderRadius: 11, padding: "12px 14px",
        boxShadow: foc ? `0 0 0 3px ${T.brandBg}` : "none", transition: "all 130ms ease",
      }}>
        {LeftIcon && <LeftIcon size={18} color={T.textMut} />}
        <input
          type={type} value={value} placeholder={placeholder} autoFocus={autoFocus} maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
          style={{ flex: 1, border: "none", outline: "none", fontFamily: T.font, fontSize: 15, color: T.text, background: "transparent", minWidth: 0 }}
        />
      </div>
      {hint && <div style={{ fontSize: 12.5, color: T.textMut, marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

// ─── Selectable option card (single-question pills / segmentation) ───────────
export function OptionCard({ selected, onClick, title, desc, iconName, IconComp, compact }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
        padding: compact ? "13px 16px" : "16px 18px", borderRadius: 12, cursor: "pointer",
        background: selected ? T.brandBg : "#fff", fontFamily: T.font,
        border: `1.5px solid ${selected ? T.brand : hov ? "#D9D3CA" : T.border}`,
        boxShadow: hov && !selected ? "0 4px 14px rgba(0,0,0,0.06)" : "none",
        transition: "all 140ms ease",
      }}>
      {(iconName || IconComp) && (
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: selected ? T.brand : "#F3EFE8", color: selected ? "#fff" : T.textSec,
        }}>
          {IconComp ? <IconComp size={20} color={selected ? "#fff" : T.textSec} /> : <Icon name={iconName} size={20} color={selected ? "#fff" : T.textSec} />}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{title}</div>
        {desc && <div style={{ fontSize: 13, color: T.textSec, marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        border: `2px solid ${selected ? T.brand : "#D9D3CA"}`, background: selected ? T.brand : "transparent",
      }}>
        {selected && <Check size={13} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

// ─── Thin top progress bar (sign-up wizard, screens 1–11) ────────────────────
export function ProgressBar({ pct }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "#EAE5DD", zIndex: 50 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: T.brand, borderRadius: "0 3px 3px 0", transition: "width 400ms cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

// ─── Generated workspace logo (initials in a colored square) ─────────────────
const SWATCHES = ["#E8522A", "#1A6E9E", "#6B1AAA", "#1A7A3C", "#B4690E"];
export function LogoMark({ name, size = 44, radius = 11, src }) {
  if (src) return <img src={src} alt="" style={{ width: size, height: size, borderRadius: radius, objectFit: "cover" }} />;
  const clean = (name || "").trim();
  const initials = clean ? clean.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() : "";
  const color = SWATCHES[(clean.length || 0) % SWATCHES.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: clean ? `linear-gradient(135deg, ${color}, ${color}CC)` : "#EDE8E0", color: "#fff",
      fontWeight: 700, fontSize: size * 0.4, fontFamily: T.font,
    }}>
      {initials || <Image size={size * 0.4} color={T.textMut} />}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, maxWidth = 460, dismissible = true }) {
  if (!open) return null;
  return (
    <div onClick={dismissible ? onClose : undefined}
      style={{ position: "fixed", inset: 0, background: "rgba(20,12,4,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fade 180ms ease" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 18, maxWidth, width: "100%", boxShadow: T.shadowLg, animation: "pop 220ms cubic-bezier(0.34,1.56,0.64,1)", fontFamily: T.font, position: "relative", maxHeight: "88vh", overflowY: "auto" }}>
        {dismissible && (
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: T.textMut, padding: 4, zIndex: 2 }}>
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Persistent support widget (every screen) ────────────────────────────────
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Bot,          label: "Ask Zuper",       sub: "Get instant AI answers" },
    { icon: MessageCircle,label: "Chat with support",sub: "Typically replies in a few min" },
    { icon: Ticket,       label: "Raise a ticket",  sub: "For anything that needs a human" },
    { icon: CalendarClock,label: "Book time with us",sub: "15-min onboarding call" },
  ];
  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 90, fontFamily: T.font }}>
      {open && (
        <div style={{ position: "absolute", bottom: 68, right: 0, width: 300, background: "#fff", borderRadius: 16, boxShadow: T.shadowLg, border: `1px solid ${T.border}`, overflow: "hidden", animation: "pop 200ms cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ padding: "16px 18px", background: `linear-gradient(135deg, ${T.brand}, ${T.brandDark})`, color: "#fff" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Need a hand? 👋</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 2 }}>We're here the whole way through.</div>
          </div>
          <div style={{ padding: 8 }}>
            {items.map((it) => (
              <button key={it.label} onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "10px 10px", border: "none", background: "transparent", borderRadius: 10, cursor: "pointer", fontFamily: T.font }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F4EF")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: T.brandBg, color: T.brand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <it.icon size={18} />
                </div>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{it.label}</div><div style={{ fontSize: 12, color: T.textSec }}>{it.sub}</div></div>
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)}
        style={{ width: 56, height: 56, borderRadius: "50%", background: T.brand, color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(232,82,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

// keyframes injected once
export function GlobalStyle() {
  return (
    <style>{`
      @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
      @keyframes pop { from { opacity: 0; transform: translateY(10px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      @keyframes su { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
      * { box-sizing: border-box; }
      body { margin: 0; }
      .su { animation: su 420ms cubic-bezier(0.4,0,0.2,1) both; }
      input::placeholder { color: #B8B2A8; }
    `}</style>
  );
}

// re-export icons used by the app screens
export {
  ArrowRight, ArrowLeft, Check, CheckCircle2, Circle, Mail, Phone, Upload, Sparkles,
  X, HelpCircle, LifeBuoy, Bot, Ticket, CalendarClock, ChevronRight, Search, Bell,
  Plus, MapPin, DollarSign, Zap, Trash2, Image, PartyPopper, Menu, Loader2, ArrowUpRight,
  Home, Building2, Layers, ShieldCheck, Inbox, FileText, Calendar, Users, Receipt, MessageCircle,
};
