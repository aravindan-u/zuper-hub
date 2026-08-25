import React, { useState, useEffect, useMemo } from "react";
import { BUCKETS, WORK_TYPES, PRIORITIES, COMPANY_SIZES, bucketForWorkType, money } from "./buckets.js";
import {
  T, Icon, Btn, Field, OptionCard, ProgressBar, LogoMark, Modal, SupportWidget, GlobalStyle,
  ArrowRight, ArrowLeft, Check, CheckCircle2, Circle, Mail, Phone, Upload, Sparkles, X,
  ChevronRight, Search, Bell, Plus, MapPin, DollarSign, Zap, Trash2, PartyPopper,
  Home, Building2, ShieldCheck, Inbox, FileText, Calendar, Users, Receipt, MessageCircle, ArrowUpRight,
} from "./ui.jsx";

const TOTAL_WIZARD = 11;

// ═══════════════ Layout helpers ═══════════════
function QuestionLayout({ step, onBack, title, subtitle, children, footer, wide }) {
  return (
    <div className="su" key={step} style={{ width: "100%", maxWidth: wide ? 620 : 460, margin: "0 auto", padding: "0 20px" }}>
      {onBack && (
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 14, marginBottom: 22, padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>
      )}
      <h1 style={{ fontSize: 27, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15.5, color: T.textSec, marginTop: 10, lineHeight: 1.5 }}>{subtitle}</p>}
      <div style={{ marginTop: 28 }}>{children}</div>
      {footer && <div style={{ marginTop: 28 }}>{footer}</div>}
    </div>
  );
}

// ═══════════════ Screens 1–11 ═══════════════
function Welcome({ onNext }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="su" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
        <ZuperLogo size={40} />
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Welcome to Zuper</h1>
      <p style={{ fontSize: 16.5, color: T.textSec, marginTop: 16, lineHeight: 1.6 }}>
        You can set this up yourself, and we'll guide you along the way. If you ever get stuck, we're here.
      </p>
      <div style={{ marginTop: 32 }}>
        <Btn size="lg" onClick={onNext} IconR={ArrowRight}>Let's get started</Btn>
      </div>
      <div style={{ marginTop: 20, fontSize: 13, color: T.textMut }}>Takes about 2 minutes · No credit card</div>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth={560}>
        <div style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.borderSoft}`, display: "flex", alignItems: "center", gap: 10 }}>
            <ZuperLogo size={30} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>Welcome to Zuper</div>
              <div style={{ fontSize: 12.5, color: T.textSec }}>A quick note from our CEO</div>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{
              position: "relative", minHeight: 270, borderRadius: 18, overflow: "hidden",
              background: `linear-gradient(135deg, #221812 0%, ${T.brandDark} 52%, ${T.brand} 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)",
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.24, backgroundImage: "radial-gradient(circle at 18% 24%, #fff 0 1px, transparent 1px), radial-gradient(circle at 76% 32%, #fff 0 1px, transparent 1px)", backgroundSize: "34px 34px, 48px 48px" }} />
              <div style={{ position: "absolute", left: 24, top: 24, display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 6px rgba(255,255,255,0.16)" }} />
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>CEO message</span>
              </div>
              <div style={{ position: "absolute", right: 22, top: 22, display: "flex", gap: 5 }}>
                {[18, 28, 13, 35, 22, 31].map((h, i) => (
                  <span key={i} style={{ width: 4, height: h, borderRadius: 5, background: "rgba(255,255,255,0.65)", alignSelf: "center" }} />
                ))}
              </div>
              <div style={{ position: "absolute", left: 26, bottom: 26, right: 26, display: "flex", alignItems: "end", gap: 18 }}>
                <div style={{ width: 96, height: 96, borderRadius: 24, background: "#fff", color: T.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, boxShadow: "0 18px 40px rgba(0,0,0,0.22)" }}>ZR</div>
                <div style={{ flex: 1, color: "#fff", textAlign: "left" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#fff", color: T.brand, marginBottom: 14, boxShadow: "0 10px 30px rgba(0,0,0,0.22)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.16, letterSpacing: "-0.02em" }}>You can set this up yourself.</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 8, opacity: 0.88 }}>We'll guide you along the way. If you ever get stuck, we're here.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn variant="secondary" full onClick={() => setOpen(false)}>Watch later</Btn>
              <Btn full onClick={() => { setOpen(false); onNext(); }} IconR={ArrowRight}>Continue setup</Btn>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SignUp({ data, set, onNext }) {
  const valid = /\S+@\S+\.\S+/.test(data.email);
  return (
    <QuestionLayout step={2} title="Create your account" subtitle="No passwords here — we'll send you a secure code.">
      <Field label="Work email" value={data.email} onChange={(v) => set("email", v)} placeholder="you@yourcompany.com" type="email" LeftIcon={Mail} autoFocus />
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={!valid} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function VerifyCode({ data, set, onNext, onBack }) {
  const code = data.code || "";
  return (
    <QuestionLayout step={3} onBack={onBack} title="Check your email" subtitle={<>We sent a 6-digit code to <b style={{ color: T.text }}>{data.email || "your inbox"}</b>. Enter it below to continue.</>}>
      <CodeInput value={code} onChange={(v) => set("code", v)} />
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13.5, color: T.textSec }}>Didn't get it? <span style={{ color: T.brand, fontWeight: 600, cursor: "pointer" }}>Resend code</span></div>
      </div>
      <div style={{ marginTop: 16, background: T.amberBg, border: `1px solid #F3E2C0`, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: T.amber, display: "flex", gap: 8 }}>
        <Zap size={15} style={{ flexShrink: 0, marginTop: 1 }} /> <span><b>Dev hint:</b> any 6 characters work — try <code style={{ fontFamily: "monospace" }}>123456</code>.</span>
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={code.replace(/\s/g, "").length < 6} onClick={onNext} IconR={ArrowRight}>Verify & continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function NamePhone({ data, set, onNext, onBack }) {
  const ok = data.firstName.trim() && data.lastName.trim() && data.phone.trim().length >= 7;
  return (
    <QuestionLayout step={4} onBack={onBack} title="Tell us who you are" subtitle="This is how we'll address you and reach you if a job needs attention.">
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="First name" value={data.firstName} onChange={(v) => set("firstName", v)} placeholder="Sam" autoFocus /></div>
        <div style={{ flex: 1 }}><Field label="Last name" value={data.lastName} onChange={(v) => set("lastName", v)} placeholder="Rivera" /></div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Field label="Mobile number" value={data.phone} onChange={(v) => set("phone", v)} placeholder="(555) 123-4567" type="tel" LeftIcon={Phone} />
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={!ok} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function WorkType({ data, set, onNext, onBack }) {
  const ok = data.workType && (data.workType !== "other" || data.workTypeOther.trim());
  return (
    <QuestionLayout step={5} onBack={onBack} title="What kind of work do you do?" subtitle="We'll tailor Zuper to how your business actually runs.">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {WORK_TYPES.map((w) => (
          <OptionCard key={w.id} compact selected={data.workType === w.id} onClick={() => set("workType", w.id)} title={w.label} iconName={w.icon} />
        ))}
      </div>
      {data.workType === "other" && (
        <div className="su" style={{ marginTop: 12 }}>
          <Field value={data.workTypeOther} onChange={(v) => set("workTypeOther", v)} placeholder="Tell us what you do…" autoFocus />
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={!ok} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function Branching({ data, set, onNext, onBack }) {
  const wt = data.workType;
  let q, opts;
  if (wt === "insurance") {
    q = "Do you handle the full claim or just the repair?";
    opts = ["Full claim", "Repair only"];
  } else if (wt === "other") {
    q = "Tell us a bit about how you get work";
  } else {
    q = "How does work usually reach you?";
    opts = ["Website leads", "Referrals", "Door knocking", "Phone calls"];
  }
  const ok = wt === "other" ? data.followup.trim() : !!data.followup;
  return (
    <QuestionLayout step={6} onBack={onBack} title={q} subtitle={wt === "commercial" ? "Commercial crews often juggle several bids at once — we'll set your pipeline up for that." : undefined}>
      {wt === "other" ? (
        <Field value={data.followup} onChange={(v) => set("followup", v)} placeholder="e.g. mostly repeat commercial clients and a few referrals…" autoFocus />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {opts.map((o) => <OptionCard key={o} compact selected={data.followup === o} onClick={() => set("followup", o)} title={o} />)}
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={!ok} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function FirstPriority({ data, set, onNext, onBack }) {
  return (
    <QuestionLayout step={7} onBack={onBack} title="What should work first?" subtitle="Pick one — we'll drop you straight into it with a template ready to go. You can do the rest anytime.">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PRIORITIES.map((p) => (
          <OptionCard key={p.id} compact selected={data.firstPriority === p.id} onClick={() => set("firstPriority", p.id)} title={p.label} desc={p.desc} iconName={p.icon} />
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn full size="lg" disabled={!data.firstPriority} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </div>
    </QuestionLayout>
  );
}

function CompanySize({ data, set, onNext, onBack }) {
  const sel = COMPANY_SIZES.find((s) => s.id === data.companySize);
  const crews = sel ? sel.crews : 1;
  return (
    <SplitLayout
      form={
        <QuestionLayout step={8} onBack={onBack} title="How big is your team?" subtitle="This shapes your schedule view and crew planning.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPANY_SIZES.map((s) => <OptionCard key={s.id} compact selected={data.companySize === s.id} onClick={() => set("companySize", s.id)} title={s.label} IconComp={Users} />)}
          </div>
          <div style={{ marginTop: 24 }}>
            <Btn full size="lg" disabled={!data.companySize} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
          </div>
        </QuestionLayout>
      }
      preview={<SchedulePreview crews={crews} />}
      previewLabel="Your schedule"
    />
  );
}

function CompanyBranding({ data, set, onNext, onBack, bucket }) {
  return (
    <SplitLayout
      form={
        <QuestionLayout step={9} onBack={onBack} title="Name your business" subtitle="This shows up on every estimate and invoice you send.">
          <Field label="Company name" value={data.companyName} onChange={(v) => set("companyName", v)} placeholder="e.g. Summit Roofing Co." autoFocus />
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 7 }}>Logo <span style={{ color: T.textMut, fontWeight: 400 }}>(optional)</span></div>
            <label style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px dashed ${T.border}`, borderRadius: 11, padding: "14px", cursor: "pointer", background: "#fff" }}>
              <LogoMark name={data.companyName} src={data.logo} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{data.logo ? "Logo added" : "Upload a logo"}</div>
                <div style={{ fontSize: 12.5, color: T.textSec }}>{data.logo ? "Click to replace" : "PNG or SVG — or we'll generate one for you"}</div>
              </div>
              <Upload size={18} color={T.textMut} />
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) set("logo", URL.createObjectURL(f)); }} />
            </label>
          </div>
          <div style={{ marginTop: 24 }}>
            <Btn full size="lg" disabled={!data.companyName.trim()} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
          </div>
        </QuestionLayout>
      }
      preview={<EstimatePreview name={data.companyName} logo={data.logo} bucket={bucket} />}
      previewLabel="Live estimate preview"
    />
  );
}

function ImportConnect({ set, onNext, onBack }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <QuestionLayout step={10} onBack={onBack} title="Bring your customers with you" subtitle="Import an existing customer list so you're not starting from scratch. You can also do this later.">
      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: "34px 20px", cursor: "pointer", background: "#fff", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.brandBg, color: T.brand, display: "flex", alignItems: "center", justifyContent: "center" }}><Upload size={22} /></div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Import your customers</div>
        <div style={{ fontSize: 13, color: T.textSec }}>Drop a CSV or Excel file, or click to browse</div>
        <input type="file" style={{ display: "none" }} onChange={() => { set("imported", true); onNext(); }} />
      </label>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={() => setConfirm(true)} style={{ background: "none", border: "none", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 14, textDecoration: "underline", textUnderlineOffset: 3 }}>Skip for now</button>
      </div>
      <Modal open={confirm} onClose={() => setConfirm(false)} maxWidth={420}>
        <div style={{ padding: "28px 26px" }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: T.text, margin: 0 }}>Continue without importing?</h3>
          <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 10, lineHeight: 1.5 }}>Are you sure you want to continue without importing your customers? You can always import them later from your account menu.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Btn variant="secondary" full onClick={() => setConfirm(false)}>Cancel</Btn>
            <Btn full onClick={() => { setConfirm(false); onNext(); }}>Yes, I'm sure</Btn>
          </div>
        </div>
      </Modal>
    </QuestionLayout>
  );
}

function StartTrial({ onNext, onBack, firstName }) {
  return (
    <div className="su" style={{ maxWidth: 460, margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 14, marginBottom: 22, padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${T.brand}, ${T.brandDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(232,82,42,0.35)" }}>
          <Sparkles size={32} color="#fff" />
        </div>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>You're all set{firstName ? `, ${firstName}` : ""}!</h1>
      <p style={{ fontSize: 16, color: T.textSec, marginTop: 12, lineHeight: 1.55 }}>Your <b style={{ color: T.text }}>14-day free trial</b> starts now — no credit card required. Let's get your workspace open.</p>
      <div style={{ marginTop: 30 }}>
        <Btn size="lg" onClick={onNext} IconR={ArrowRight}>Open my dashboard</Btn>
      </div>
    </div>
  );
}

// ═══════════════ Live product (Screens 12–14) ═══════════════
function LiveProduct({ data, bucket, onExit }) {
  const [view, setView] = useState("dashboard"); // dashboard | action
  const [tourOpen, setTourOpen] = useState(true);
  const [planOpen, setPlanOpen] = useState(false);
  const [firstWin, setFirstWin] = useState(false);
  const priority = PRIORITIES.find((p) => p.id === data.firstPriority) || PRIORITIES[1];
  const done = 1 + (firstWin ? 1 : 0);

  const completeFirstWin = () => { setFirstWin(true); setPlanOpen(true); setView("dashboard"); };

  return (
    <div style={{ display: "flex", height: "100vh", background: T.canvas, fontFamily: T.font }}>
      {/* Sidebar */}
      <aside style={{ width: 232, background: "#fff", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.borderSoft}` }}>
          <ZuperLogo size={26} />
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Zuper</span>
        </div>
        <nav style={{ padding: 10, flex: 1 }}>
          {[
            { label: "Dashboard", Icon: Home, active: view === "dashboard" },
            { label: bucket.recordNounPlural, Icon: Receipt },
            { label: "Schedule", Icon: Calendar },
            { label: "Customers", Icon: Users },
            { label: "Estimates", Icon: FileText },
          ].map((n) => (
            <div key={n.label} onClick={() => setView("dashboard")} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 9, cursor: "pointer", color: n.active ? T.brand : T.textSec, background: n.active ? T.brandBg : "transparent", fontSize: 14, fontWeight: n.active ? 600 : 500, marginBottom: 2 }}>
              <n.Icon size={18} /> {n.label}
            </div>
          ))}
        </nav>
        {/* quiet first-steps checklist item (not a blocking bar) */}
        <ChecklistItem done={done} onResume={() => setView("action")} firstWin={firstWin} priority={priority} />
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.borderSoft}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
            {(data.firstName[0] || "U") + (data.lastName[0] || "")}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.firstName} {data.lastName}</div>
            <div style={{ fontSize: 11.5, color: T.textMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.companyName}</div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ height: 60, background: "#fff", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 16, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark name={data.companyName} src={data.logo} size={30} radius={8} />
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{data.companyName}</span>
          </div>
          <div style={{ flex: 1, maxWidth: 420, marginLeft: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.canvas, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 12px" }}>
              <Search size={16} color={T.textMut} /><span style={{ fontSize: 14, color: T.textMut }}>Search {bucket.recordNounPlural.toLowerCase()}, customers…</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {onExit && (
              <button onClick={onExit} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 12px", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 13.5, fontWeight: 600 }}>
                <X size={15} /> Exit setup
              </button>
            )}
            <IconBtn><Bell size={19} color={T.textSec} /></IconBtn>
            <Btn IconL={Plus} onClick={() => setView("action")}>New {bucket.recordNoun}</Btn>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {view === "dashboard"
            ? <Dashboard data={data} bucket={bucket} priority={priority} firstWin={firstWin} onStart={() => setView("action")} />
            : <FirstAction data={data} bucket={bucket} priority={priority} onComplete={completeFirstWin} onBack={() => setView("dashboard")} />}
        </div>
      </div>

      {/* Screen 12: product-tour modal on first load (dismissible, non-blocking) */}
      <Modal open={tourOpen} onClose={() => setTourOpen(false)} maxWidth={440}>
        <div style={{ padding: "30px 28px 26px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: T.brandBg, color: T.brand, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Sparkles size={26} /></div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Welcome to your workspace 🎉</h3>
          <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 10, lineHeight: 1.55 }}>
            We've pre-loaded some sample {bucket.recordNounPlural.toLowerCase()} so you can see Zuper in action. Want a 60-second tour, or jump straight into <b style={{ color: T.text }}>{priority.label.toLowerCase()}</b>?
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Btn variant="secondary" full onClick={() => setTourOpen(false)}>Maybe later</Btn>
            <Btn full onClick={() => { setTourOpen(false); setView("action"); }} IconR={ArrowRight}>Start {priority.label.toLowerCase()}</Btn>
          </div>
        </div>
      </Modal>

      {/* Screen 14: deferred plan/trial modal — after the first action */}
      <Modal open={planOpen} onClose={() => setPlanOpen(false)} maxWidth={440}>
        <div style={{ padding: "30px 28px 26px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: T.greenBg, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><PartyPopper size={26} /></div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Nice — first {bucket.recordNoun} created!</h3>
          <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 10, lineHeight: 1.55 }}>
            You're on a free <b style={{ color: T.text }}>14-day trial of Zuper Grow</b>. Explore everything and decide what works best for your business — no pressure.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Btn variant="secondary" full onClick={() => setPlanOpen(false)}>Keep exploring</Btn>
            <Btn full onClick={() => { setPlanOpen(false); if (onExit) onExit(); }} IconR={onExit ? ArrowRight : ArrowUpRight}>
              {onExit ? "Go to my dashboard" : "Explore plans"}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ChecklistItem({ done, onResume, firstWin, priority }) {
  const [open, setOpen] = useState(false);
  const steps = [
    { label: "Create your account", done: true },
    { label: `First action — ${priority.label}`, done: firstWin },
    { label: "Add a customer", done: false },
    { label: "Invite a crew member", done: false },
    { label: "Connect your calendar", done: false },
    { label: "Send your first invoice", done: false },
  ];
  return (
    <div style={{ margin: "0 10px 8px", position: "relative" }}>
      {open && (
        <div style={{ position: "absolute", bottom: 52, left: 0, right: 0, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadowLg, padding: 12, animation: "pop 180ms ease" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8, padding: "0 4px" }}>First steps</div>
          {steps.map((s) => (
            <div key={s.label} onClick={!s.done ? onResume : undefined} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 6px", borderRadius: 8, cursor: s.done ? "default" : "pointer", fontSize: 13, color: s.done ? T.textMut : T.text }}>
              {s.done ? <CheckCircle2 size={16} color={T.green} /> : <Circle size={16} color={T.textMut} />}
              <span style={{ textDecoration: s.done ? "line-through" : "none" }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 11px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.canvas, cursor: "pointer", fontFamily: T.font }}>
        <div style={{ position: "relative", width: 22, height: 22 }}>
          <Zap size={16} color={T.brand} style={{ position: "absolute", top: 3, left: 3 }} />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>Help & first steps</span>
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: T.brand, background: T.brandBg, borderRadius: 20, padding: "2px 8px" }}>{done}/6</span>
      </button>
    </div>
  );
}

function Dashboard({ data, bucket, priority, firstWin, onStart }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const totalValue = bucket.sampleData.reduce((s, r) => s + r.value, 0);
  const kpis = [
    { label: "Pipeline value", value: money(totalValue) },
    { label: `Open ${bucket.recordNounPlural.toLowerCase()}`, value: String(bucket.sampleData.length) },
    { label: "This week", value: String(bucket.sampleData.filter((r) => r.date !== "—").length) },
  ];
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, margin: "0 auto" }}>
      <div className="su" style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec }}>{greet}</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", margin: "4px 0 0" }}>{data.firstName || "there"} 👋</h1>
        <p style={{ fontSize: 15, color: T.textSec, marginTop: 6 }}>Here's what's happening at {data.companyName}.</p>
      </div>

      {/* First-win CTA (guided first action) */}
      {!firstWin && (
        <div className="su" style={{ display: "flex", alignItems: "center", gap: 18, background: `linear-gradient(120deg, ${T.brandBg}, #FFF9F4)`, border: `1px solid #F4D9C8`, borderRadius: 16, padding: "18px 22px", marginBottom: 24 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: T.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={priority.icon} size={22} color="#fff" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Your first step: {priority.label.toLowerCase()}</div>
            <div style={{ fontSize: 13.5, color: T.textSec, marginTop: 2 }}>We've prepared a {bucket.label.toLowerCase()} template so you can finish in under a minute.</div>
          </div>
          <Btn onClick={onStart} IconR={ArrowRight}>Let's go</Btn>
        </div>
      )}

      {/* KPIs */}
      <div className="su" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, boxShadow: T.shadow }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.text, marginTop: 8 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline table (pre-seeded, never empty) */}
      <div className="su" style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.borderSoft}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Recent {bucket.recordNounPlural.toLowerCase()}</div>
          <div style={{ fontSize: 12.5, color: T.textMut }}>{bucket.sampleData.length} records · sample data</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ color: T.textSec, textAlign: "left" }}>
              {["Reference", bucket.recordNoun === "claim" ? "Claim" : "Title", "Customer", "Stage", "Value", "Date"].map((h) => (
                <th key={h} style={{ padding: "11px 20px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: `1px solid ${T.borderSoft}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bucket.sampleData.map((r) => (
              <tr key={r.ref} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                <td style={{ padding: "13px 20px", color: T.textSec, fontFamily: "monospace", fontSize: 12.5 }}>{r.ref}</td>
                <td style={{ padding: "13px 20px", color: T.text, fontWeight: 600 }}>{r.title}</td>
                <td style={{ padding: "13px 20px", color: T.textSec }}>{r.customer}{r.carrier ? ` · ${r.carrier}` : ""}</td>
                <td style={{ padding: "13px 20px" }}><StageBadge stage={r.stage} /></td>
                <td style={{ padding: "13px 20px", color: T.text, fontWeight: 600 }}>{money(r.value)}</td>
                <td style={{ padding: "13px 20px", color: T.textSec }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Guided first action (Screen 13) — routes by priority ───
function FirstAction({ data, bucket, priority, onComplete, onBack }) {
  return (
    <div style={{ padding: "24px 32px", maxWidth: 960, margin: "0 auto" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 14, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={16} /> Back to dashboard
      </button>
      {priority.id === "estimates" || priority.id === "invoice" ? <EstimateBuilder data={data} bucket={bucket} invoice={priority.id === "invoice"} onComplete={onComplete} />
        : priority.id === "schedule" ? <Scheduler data={data} bucket={bucket} onComplete={onComplete} />
        : priority.id === "leads" ? <LeadCapture bucket={bucket} onComplete={onComplete} />
        : <CrewAssign bucket={bucket} onComplete={onComplete} />}
    </div>
  );
}

function EstimateBuilder({ data, bucket, invoice, onComplete }) {
  const [lines, setLines] = useState(bucket.lineItems.map((l, i) => ({ ...l, id: i })));
  const [saved, setSaved] = useState(false);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  const doc = invoice ? "Invoice" : "Estimate";
  return (
    <div className="su">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Create your first {doc.toLowerCase()}</h1>
      <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 6 }}>Pre-filled with a <b style={{ color: T.text }}>{bucket.estimateTitle}</b> template. Tweak anything, then {invoice ? "send it" : "save it"}.</p>

      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, marginTop: 20, overflow: "hidden", boxShadow: T.shadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", background: T.canvas, borderBottom: `1px solid ${T.borderSoft}` }}>
          <LogoMark name={data.companyName} src={data.logo} size={40} />
          <div><div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{data.companyName}</div><div style={{ fontSize: 12.5, color: T.textSec }}>{doc} #{invoice ? "INV" : "EST"}-1001 · {bucket.estimateTitle}</div></div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ fontSize: 12, color: T.textSec }}>Prepared for</div><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{bucket.sampleData[0].customer}</div></div>
        </div>
        <div style={{ padding: "6px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead><tr style={{ color: T.textSec }}>
              <th style={thL}>Item</th><th style={thR}>Qty</th><th style={thR}>Unit</th><th style={thR}>Price</th><th style={thR}>Amount</th><th style={{ width: 40 }} />
            </tr></thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id} style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                  <td style={{ padding: "10px 12px" }}>
                    <input value={l.name} onChange={(e) => setLines((ls) => ls.map((x) => x.id === l.id ? { ...x, name: e.target.value } : x))} style={cellInput(true)} />
                  </td>
                  <td style={{ padding: "10px 6px" }}><input type="number" value={l.qty} onChange={(e) => setLines((ls) => ls.map((x) => x.id === l.id ? { ...x, qty: +e.target.value || 0 } : x))} style={{ ...cellInput(), width: 54, textAlign: "right" }} /></td>
                  <td style={{ padding: "10px 6px", textAlign: "right", color: T.textSec }}>{l.unit}</td>
                  <td style={{ padding: "10px 6px" }}><input type="number" value={l.price} onChange={(e) => setLines((ls) => ls.map((x) => x.id === l.id ? { ...x, price: +e.target.value || 0 } : x))} style={{ ...cellInput(), width: 74, textAlign: "right" }} /></td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: T.text }}>{money(l.qty * l.price)}</td>
                  <td style={{ padding: "10px 6px", textAlign: "center" }}><button onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMut }}><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setLines((ls) => [...ls, { id: Date.now(), name: "New line item", qty: 1, unit: "job", price: 0 }])}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "8px 12px 14px", background: "none", border: "none", color: T.brand, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: T.font }}>
            <Plus size={15} /> Add line item
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 22px", background: T.canvas, borderTop: `1px solid ${T.borderSoft}` }}>
          <div style={{ width: 240 }}>
            <Row k="Subtotal" v={money(subtotal)} /><Row k="Tax (8%)" v={money(tax)} />
            <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 8 }}><Row k="Total" v={money(total)} big /></div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
        <Btn size="lg" IconR={saved ? Check : ArrowRight} onClick={() => { setSaved(true); onComplete(); }}>
          {invoice ? "Send invoice" : "Save & send estimate"}
        </Btn>
        <span style={{ fontSize: 13, color: T.textMut }}>Edits are live — this is your real {doc.toLowerCase()}.</span>
      </div>
    </div>
  );
}

function Scheduler({ data, bucket, onComplete }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [placed, setPlaced] = useState({});
  const unplaced = bucket.sampleData.filter((r) => !placed[r.ref]);
  const place = (ref, day) => setPlaced((p) => ({ ...p, [ref]: day }));
  return (
    <div className="su">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Schedule your first {bucket.recordNounPlural.toLowerCase()}</h1>
      <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 6 }}>Assign a {bucket.recordNoun} to a day — click a day chip on any card below.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginTop: 20 }}>
        {days.map((d) => (
          <div key={d} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, minHeight: 120, padding: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textSec, textTransform: "uppercase", marginBottom: 8 }}>{d}</div>
            {bucket.sampleData.filter((r) => placed[r.ref] === d).map((r) => (
              <div key={r.ref} style={{ background: T.brandBg, border: `1px solid #F4D9C8`, borderRadius: 8, padding: "7px 9px", marginBottom: 6 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{r.title}</div>
                <div style={{ fontSize: 11, color: T.textSec }}>{money(r.value)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, marginBottom: 10 }}>Unscheduled ({unplaced.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {unplaced.map((r) => (
            <div key={r.ref} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.title}</div><div style={{ fontSize: 12.5, color: T.textSec }}>{r.customer} · {money(r.value)}</div></div>
              <div style={{ display: "flex", gap: 5 }}>{days.map((d) => <button key={d} onClick={() => place(r.ref, d)} style={dayChip}>{d}</button>)}</div>
            </div>
          ))}
          {unplaced.length === 0 && <div style={{ fontSize: 14, color: T.green, fontWeight: 600 }}>All scheduled 🎉</div>}
        </div>
      </div>
      <div style={{ marginTop: 22 }}><Btn size="lg" IconR={ArrowRight} onClick={onComplete}>Save schedule</Btn></div>
    </div>
  );
}

function LeadCapture({ bucket, onComplete }) {
  const [name, setName] = useState(""); const [src, setSrc] = useState("Website leads"); const [added, setAdded] = useState([]);
  const add = () => { if (!name.trim()) return; setAdded((a) => [{ name, src, id: Date.now() }, ...a]); setName(""); };
  return (
    <div className="su">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Capture your first lead</h1>
      <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 6 }}>Add an inbound lead so nothing slips through the cracks.</p>
      <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginTop: 18, boxShadow: T.shadow }}>
        <Field label="Customer name" value={name} onChange={setName} placeholder="e.g. Priya Nair" autoFocus />
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 7 }}>Source</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Website leads", "Referrals", "Door knocking", "Phone calls"].map((s) => (
            <button key={s} onClick={() => setSrc(s)} style={{ padding: "8px 12px", borderRadius: 20, border: `1.5px solid ${src === s ? T.brand : T.border}`, background: src === s ? T.brandBg : "#fff", color: src === s ? T.brand : T.textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>{s}</button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><Btn IconL={Plus} onClick={add} disabled={!name.trim()}>Add lead</Btn></div>
      </div>
      {added.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, marginBottom: 8 }}>Captured leads</div>
          {added.map((l) => (
            <div key={l.id} className="su" style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.brandBg, color: T.brand, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{l.name[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{l.name}</div><div style={{ fontSize: 12.5, color: T.textSec }}>{l.src}</div></div>
              <StageBadge stage="New Lead" />
            </div>
          ))}
          <div style={{ marginTop: 16 }}><Btn size="lg" IconR={ArrowRight} onClick={onComplete}>Save & continue</Btn></div>
        </div>
      )}
    </div>
  );
}

function CrewAssign({ bucket, onComplete }) {
  const crew = ["Alex Reed", "Jordan Kim", "Sam Rivera", "Chris Doyle"];
  const [assign, setAssign] = useState({});
  return (
    <div className="su">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Assign your crews</h1>
      <p style={{ fontSize: 14.5, color: T.textSec, marginTop: 6 }}>Put a crew member on each active {bucket.recordNoun}.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {bucket.sampleData.slice(0, 3).map((r) => (
          <div key={r.ref} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px 15px" }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.title}</div><div style={{ fontSize: 12.5, color: T.textSec }}>{r.address}</div></div>
            <select value={assign[r.ref] || ""} onChange={(e) => setAssign((a) => ({ ...a, [r.ref]: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: 9, border: `1.5px solid ${assign[r.ref] ? T.brand : T.border}`, background: "#fff", fontFamily: T.font, fontSize: 13.5, color: T.text, cursor: "pointer" }}>
              <option value="">Unassigned</option>{crew.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}><Btn size="lg" IconR={ArrowRight} onClick={onComplete} disabled={Object.values(assign).filter(Boolean).length === 0}>Save assignments</Btn></div>
    </div>
  );
}

// ═══════════════ Live-preview panels (screens 8 & 9) ═══════════════
function SchedulePreview({ crews }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, width: "100%", boxShadow: T.shadow }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <div style={{ width: 66 }} />
        {days.map((d) => <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: T.textSec }}>{d}</div>)}
      </div>
      {Array.from({ length: crews }).map((_, r) => (
        <div key={r} className="su" style={{ display: "flex", gap: 6, marginBottom: 7, alignItems: "center" }}>
          <div style={{ width: 66, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: ["#E8522A", "#1A6E9E", "#6B1AAA", "#1A7A3C", "#B4690E"][r % 5], opacity: 0.85 }} />
            <div style={{ height: 7, width: 30, borderRadius: 4, background: "#EAE5DD" }} />
          </div>
          {days.map((d, c) => {
            const filled = (r + c) % 3 !== 0;
            return <div key={d} style={{ flex: 1, height: 26, borderRadius: 6, background: filled ? `${["#E8522A", "#1A6E9E", "#6B1AAA", "#1A7A3C", "#B4690E"][r % 5]}22` : "#F4F1EC", border: filled ? `1px solid ${["#E8522A", "#1A6E9E", "#6B1AAA", "#1A7A3C", "#B4690E"][r % 5]}44` : "none" }} />;
          })}
        </div>
      ))}
      <div style={{ marginTop: 10, fontSize: 12, color: T.textMut, textAlign: "center" }}>{crews} crew{crews > 1 ? "s" : ""} · sample week</div>
    </div>
  );
}

function EstimatePreview({ name, logo, bucket }) {
  const subtotal = bucket.lineItems.reduce((s, l) => s + l.qty * l.price, 0);
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, width: "100%", boxShadow: T.shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${T.borderSoft}` }}>
        <LogoMark name={name} src={logo} size={42} />
        <div><div style={{ fontSize: 15, fontWeight: 700, color: name ? T.text : T.textMut, transition: "color 150ms" }}>{name || "Your Company"}</div><div style={{ fontSize: 12, color: T.textSec }}>Estimate #EST-1001</div></div>
      </div>
      <div style={{ padding: "14px 0" }}>
        {bucket.lineItems.slice(0, 4).map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <div style={{ height: 8, width: `${55 - i * 6}%`, borderRadius: 4, background: "#EDE8E0" }} />
            <div style={{ fontSize: 12.5, color: T.textSec }}>{money(l.qty * l.price)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${T.borderSoft}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Estimated total</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.brand }}>{money(Math.round(subtotal * 1.08))}</div>
      </div>
    </div>
  );
}

// ═══════════════ Split layout (form + live preview) ═══════════════
function SplitLayout({ form, preview, previewLabel }) {
  return (
    <div style={{ width: "100%", maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 44, alignItems: "start", padding: "0 24px" }} className="split">
      <div>{form}</div>
      <div className="su" style={{ position: "sticky", top: 90 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>{previewLabel}</div>
        {preview}
      </div>
    </div>
  );
}

// ═══════════════ Small shared bits ═══════════════
const StageColors = {
  "New Lead": T.textSec, "Estimate Sent": T.blue, Scheduled: T.brand, "In Progress": T.amber, Invoiced: T.green,
  "Site Survey": T.textSec, "Proposal Sent": T.blue, Permitting: T.amber, Install: T.brand,
  Inspection: T.textSec, "Claim Filed": T.blue, "Adjuster Approved": T.purple, "Repair Scheduled": T.brand,
};
function StageBadge({ stage }) {
  const c = StageColors[stage] || T.textSec;
  return <span style={{ fontSize: 12, fontWeight: 600, color: c, background: `${c}14`, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{stage}</span>;
}
function Row({ k, v, big }) { return <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: big ? 16 : 13.5, fontWeight: big ? 700 : 500, color: big ? T.text : T.textSec }}><span>{k}</span><span style={{ color: T.text }}>{v}</span></div>; }
function IconBtn({ children }) { return <button style={{ width: 38, height: 38, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</button>; }
function ZuperLogo({ size = 32 }) {
  return <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(135deg, #FF7A45, ${T.brand})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(253,80,0,0.3)" }}><Zap size={size * 0.55} color="#fff" fill="#fff" /></div>;
}
const thL = { padding: "10px 12px", textAlign: "left", fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", color: T.textSec };
const thR = { ...thL, textAlign: "right" };
const dayChip = { padding: "5px 8px", borderRadius: 7, border: `1px solid ${T.border}`, background: "#fff", color: T.textSec, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: T.font };
const cellInput = (bold) => ({ border: "1px solid transparent", borderRadius: 6, padding: "6px 8px", fontFamily: T.font, fontSize: 13.5, color: T.text, background: "transparent", width: "100%", fontWeight: bold ? 600 : 400, outline: "none" });

// 6-box code input
function CodeInput({ value, onChange }) {
  const chars = value.padEnd(6, " ").slice(0, 6).split("");
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <input autoFocus value={value} maxLength={6} onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1 }} id="code-real" />
      {chars.map((c, i) => (
        <div key={i} onClick={() => document.getElementById("code-real").focus()}
          style={{ flex: 1, height: 56, borderRadius: 12, border: `1.5px solid ${c.trim() ? T.brand : T.border}`, background: c.trim() ? T.brandBg : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: T.text, cursor: "text" }}>
          {c.trim()}
        </div>
      ))}
    </div>
  );
}

// ═══════════════ Root: the 14-screen state machine ═══════════════
// Dev convenience: deep-link to any screen for demos/QA, e.g.
//   /onboarding.html?step=9&wt=insurance&fp=estimates&name=Summit%20Roofing&size=6-10
const qp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

export default function OnboardingApp({ onExit } = {}) {
  const [step, setStep] = useState(() => Math.min(Math.max(parseInt(qp.get("step")) || 1, 1), 12));
  const [data, setData] = useState({
    email: qp.get("email") || "", code: "", firstName: qp.get("name")?.split(" ")[0] || "", lastName: qp.get("name")?.split(" ")[1] || "", phone: "",
    workType: qp.get("wt") || "", workTypeOther: "", followup: "", firstPriority: qp.get("fp") || "",
    companySize: qp.get("size") || "", companyName: qp.get("name") || "", logo: null, imported: false,
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, 12));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const bucket = useMemo(() => bucketForWorkType(data.workType), [data.workType]);

  // reset follow-up when the work-type changes (branching integrity)
  useEffect(() => { set("followup", ""); }, [data.workType]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const inProduct = step >= 12;

  return (
    <div style={{ minHeight: "100vh", background: inProduct ? T.canvas : T.canvas, fontFamily: T.font, color: T.text }}>
      <GlobalStyle />
      <style>{`@media (max-width: 820px){ .split{ grid-template-columns: 1fr !important; } .split > div:last-child{ display:none !important; } }`}</style>

      {!inProduct && <ProgressBar pct={(step / TOTAL_WIZARD) * 100} />}

      {onExit && !inProduct && (
        <button onClick={onExit}
          style={{ position: "fixed", top: 18, right: 22, zIndex: 60, display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 20, padding: "7px 13px", color: T.textSec, cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 600, boxShadow: T.shadow }}>
          <X size={15} /> Exit setup
        </button>
      )}

      {!inProduct ? (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0 100px" }}>
          {step === 1 && <Welcome onNext={next} />}
          {step === 2 && <SignUp data={data} set={set} onNext={next} />}
          {step === 3 && <VerifyCode data={data} set={set} onNext={next} onBack={back} />}
          {step === 4 && <NamePhone data={data} set={set} onNext={next} onBack={back} />}
          {step === 5 && <WorkType data={data} set={set} onNext={next} onBack={back} />}
          {step === 6 && <Branching data={data} set={set} onNext={next} onBack={back} />}
          {step === 7 && <FirstPriority data={data} set={set} onNext={next} onBack={back} />}
          {step === 8 && <CompanySize data={data} set={set} onNext={next} onBack={back} />}
          {step === 9 && <CompanyBranding data={data} set={set} onNext={next} onBack={back} bucket={bucket} />}
          {step === 10 && <ImportConnect set={set} onNext={next} onBack={back} />}
          {step === 11 && <StartTrial onNext={next} onBack={back} firstName={data.firstName} />}
        </div>
      ) : (
        <LiveProduct data={data} bucket={bucket} onExit={onExit} />
      )}

      <SupportWidget />
    </div>
  );
}
