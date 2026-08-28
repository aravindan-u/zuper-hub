import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Copy, Lightbulb, Package, RefreshCcw } from "lucide-react";
import { WORK_TYPES, bucketForWorkType } from "./buckets.js";
import {
  T, Btn, ProgressBar, LogoMark, SupportWidget, GlobalStyle,
  ArrowRight, ArrowLeft, CheckCircle2, Circle, Inbox, FileText, Users,
  Receipt, Zap, X, Plus, LifeBuoy,
} from "./ui.jsx";

const HUBS = [
  { id: "lead", label: "Zuper", phase: "Run the business", icon: Inbox, note: "Start here" },
  { id: "sales", label: "Sales Hub", phase: "Win the work", icon: FileText },
  { id: "production", label: "Production Hub", phase: "Do the work", icon: Users },
  { id: "finance", label: "Finance Hub", phase: "Get paid", icon: Receipt },
];

const PreviewContext = createContext({ data: seedlessPreviewData(), bucket: null, migration: null, selectedHub: "", wizardStep: 0, mode: "wizard" });

function seedlessPreviewData() {
  return {
    firstName: "",
    lastName: "",
    role: "",
    companyName: "",
    logo: null,
    websiteUrl: "",
    websiteFetched: false,
    workType: "",
    workflow: [],
    materials: [],
    suppliers: [],
    manufacturers: [],
    proposalPath: "",
    proposalTemplate: "",
    sourceName: "",
    followup: "",
    costPerLead: "",
    invitedEmail: "",
    invitedRole: "",
    currentSystem: "",
    insuranceMode: "",
    businessHours: "",
    cpqFileName: "",
    cpqSkipped: false,
    integrations: [],
    communicationPlatform: "",
  };
}

const CRM_SOURCES = ["JobNimbus", "AccuLynx", "Leap", "CompanyCam"];
const CURRENT_SYSTEMS = ["AccuLynx", "JobNimbus", "ServiceTitan", "Spreadsheets", "Another tool", "Starting fresh"];
const MATERIALS = ["Shingles", "Metal roofing", "Tiles", "Underlayment", "Gutters", "Flashing"];
const MANUFACTURERS = ["GAF", "Owens Corning", "CertainTeed", "IKO", "Tamko", "Atlas"];
// Inventory step: distributors you buy through, and the brands they carry.
const SUPPLIER_CATALOG = [
  { id: "SRS Distribution", short: "SRS", tone: "#111827" },
  { id: "QXO", short: "QXO", tone: "#1d4ed8" },
  { id: "ABC Supply", short: "ABC", tone: "#dc2626" },
];
// Prefill demo: the website step auto-fetches this company instead of asking the user to type one.
const PREFILL_WEBSITE = "www.mavenroof.com";
const PREFILL_PROFILE = {
  name: "Maven Roofing",
  services: ["Roof replacement", "Roof repair", "Commercial roofing", "Storm damage"],
  workType: "both",
  insuranceMode: "Both",
  businessHours: "Weekdays, 8 AM-5 PM",
  serviceArea: "Eastern North Carolina",
  phone: "(910) 294-9817",
  logo: "https://www.google.com/s2/favicons?domain=mavenroof.com&sz=128",
};
// "Starting fresh" stays the stored sentinel the migration checks already look for.
const BUSINESS_SYSTEMS = [
  {
    id: "JobNimbus", label: "JobNimbus", logo: "/logo-jobnimbus.png",
    note: "Import leads, jobs, and contacts",
    imports: [["1,284", "Contacts"], ["342", "Jobs"], ["96", "Documents"]],
    brings: ["Contacts and lead sources", "Job stages and statuses", "Estimates and attached documents"],
  },
  {
    id: "Roofr", label: "Roofr", logo: "/logo-roofr.png",
    note: "Import measurements and proposals",
    imports: [["208", "Measurements"], ["164", "Proposals"], ["12", "Templates"]],
    brings: ["Roof measurement reports", "Proposal templates and pricing", "Customer records"],
  },
  {
    id: "AccuLynx", label: "AccuLynx", logo: "/logo-acculynx.png",
    note: "Import jobs, estimates, and documents",
    imports: [["961", "Jobs"], ["437", "Estimates"], ["1,120", "Documents"]],
    brings: ["Jobs and work orders", "Estimates and price lists", "Photos and claim documents"],
  },
  { id: "Starting fresh", label: "Start from scratch", logo: null, note: "No existing system to bring over" },
];
const CONNECT_STEPS = ["Verifying credentials", "Reading your configuration", "Preparing the import"];
const MANUFACTURER_CATALOG = [
  { id: "GAF", short: "GAF", tone: "#dc2626", carriers: ["SRS", "QXO", "ABC"], parts: 6 },
  { id: "CertainTeed", short: "CT", tone: "#b91c1c", carriers: ["SRS", "ABC"], parts: 5 },
  { id: "Owens Corning", short: "OC", tone: "#1d4ed8", carriers: ["SRS", "QXO"], parts: 5 },
];
const INVITE_ROLES = ["Sales", "Inspector", "Production", "Dispatcher", "Finance", "Admin"];
const WEBSITE_SERVICE_OPTIONS = ["Roof replacement", "Roof repair", "Storm damage", "Commercial roofing", "Gutters", "Skylights"];
// Order follows the onboarding stage plan: CRM + services, then products and
// vendors, then users and teams, then data migration / platforms.
const ONBOARDING_GROUPS = ["Work setup", "Catalog and pricing", "People and delivery", "Platforms"];
const INSURANCE_MODES = ["Insurance work", "Non-insurance work", "Both"];
const BUSINESS_HOURS = ["Weekdays, 8 AM-5 PM", "Weekdays, 7 AM-6 PM", "Monday-Saturday", "24/7 emergency coverage", "Set hours manually"];
const TIME_OPTIONS = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
const PLATFORM_INTEGRATIONS = ["QBO", "HubSpot", "None yet"];
const COMMUNICATION_PLATFORMS = ["RingCentral", "Twilio", "No existing platform"];
const MEASUREMENT_TOOLS = [
  { id: "EagleView", note: "Aerial roof measurement reports" },
  { id: "Hover", note: "3D property models from photos" },
  { id: "RoofSnap", note: "On-site measurement and estimating" },
  { id: "None yet", note: "We measure manually today" },
];
const ONBOARDING_SCHEMA_VERSION = "zuper-login-first-onboarding-v1";
// Login-first variant: no "Who are you?" step, so the wizard is one screen shorter than Option 2.
const WIZARD_STEP_COUNT = 7;
// CRM path collapses inventory/proposal/quoting/invite/platforms into one summary.
const MIGRATION_STEP_COUNT = 6;
// What a connected CRM hands over, so the summary has something to affirm.
const MIGRATION_PREFILL = {
  // Services/coverage read out of the CRM — this is the "auto-filled where possible" half
  // of the migrate step; the user can still switch to manual entry.
  companyName: PREFILL_PROFILE.name,
  logo: PREFILL_PROFILE.logo,
  services: PREFILL_PROFILE.services,
  insuranceMode: PREFILL_PROFILE.insuranceMode,
  workType: PREFILL_PROFILE.workType,
  businessHours: PREFILL_PROFILE.businessHours,
  suppliers: ["SRS Distribution", "ABC Supply"],
  manufacturers: ["GAF", "CertainTeed"],
  proposalPath: "Template",
  proposalTemplate: "Insurance",
  integrations: ["QBO"],
  communicationPlatform: "RingCentral",
  subcontractors: ["Coastal Gutter Co.", "Piedmont Sheet Metal"],
  teammates: [
    { email: "dana@mavenroof.com", role: "Sales" },
    { email: "marcus@mavenroof.com", role: "Production" },
    { email: "priya@mavenroof.com", role: "Finance" },
  ],
  transactional: [["412", "Jobs"], ["286", "Invoices"], ["173", "Quotes"]],
};

const seed = {
  email: "",
  code: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: "Admin",
  workType: "",
  followup: "",
  sourceName: "",
  costPerLead: "",
  attributionId: "",
  companyName: "",
  websiteUrl: "",
  websiteFetched: false,
  websiteVisited: false,
  migrationFetched: false,
  currentSystem: "",
  migrationConnected: "",
  subcontractors: [],
  measurementTools: [],
  proposalFileName: "",
  cardAdded: false,
  cardSkipped: false,
  affirmed: [],
  triggerProductImport: true,
  triggerJumpStart: true,
  triggerInvites: true,
  triggerDataMigration: false,
  insuranceMode: "",
  // No business-hours question any more — the website prefill supplies this.
  businessHours: "",
  businessHoursStart: "8:00 AM",
  businessHoursEnd: "5:00 PM",
  services: [],
  workflow: [],
  materials: [],
  suppliers: [],
  manufacturers: [],
  proposalPath: "",
  proposalTemplate: "",
  proposalUploaded: false,
  cpqFileName: "",
  cpqSkipped: false,
  integrations: [],
  communicationPlatform: "",
  teammates: [],
  invitedEmail: "",
  invitedRole: "Sales",
  logo: null,
};

class OnboardingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: T.font }}>
        <div style={{ width: "100%", maxWidth: 620, border: "1px solid #333", borderRadius: 16, background: "#171717", padding: 24 }}>
          <h1 style={{ ...h1, fontSize: 24 }}>Onboarding hit an error</h1>
          <p style={{ ...p, marginBottom: 16 }}>Refresh the page to restart the prototype. Error detail:</p>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#ffb4a1", background: "#241414", border: "1px solid #4a2424", borderRadius: 12, padding: 14, fontSize: 12 }}>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      </div>
    );
  }
}

export default function LoginFirstOnboardingApp({ onExit } = {}) {
  const [mode, setMode] = useState("email");
  const [data, setData] = useState(seed);
  const [selectedHub, setSelectedHub] = useState("");
  const [wizardStep, setWizardStep] = useState(0);
  const [migration, setMigration] = useState({ source: "", complete: false });
  const [connectionState, setConnectionState] = useState("happy");
  const [handoff, setHandoff] = useState(null);
  const [playbook, setPlaybook] = useState(false);
  const [initialBehaviorPrompt, setInitialBehaviorPrompt] = useState(null);
  const [leads, setLeads] = useState([]);

  const bucket = useMemo(() => bucketForWorkType(data.workType), [data.workType]);
  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__loginFirstOnboardingSchemaVersion === ONBOARDING_SCHEMA_VERSION) return;
    window.__loginFirstOnboardingSchemaVersion = ONBOARDING_SCHEMA_VERSION;
    setMode("email");
    setData(seed);
    setSelectedHub("");
    setWizardStep(0);
    setMigration({ source: "", complete: false });
    setConnectionState("happy");
    setHandoff(null);
    setPlaybook(false);
    setInitialBehaviorPrompt(null);
    setLeads([]);
  }, []);

  const enterProduct = (opts = {}) => {
    const source = opts.source || migration.source;
    const nextLeads = bucket.sampleLeads.map((lead, index) => ({
      ...lead,
      migrated: Boolean(source),
      status: index === 0 && source ? "New" : lead.status,
    }));
    setMigration((m) => ({ ...m, complete: Boolean(source) }));
    setLeads(nextLeads);
    setInitialBehaviorPrompt(opts.behaviorPrompt || null);
    setMode("product");
  };

  const exit = () => {
    if (onExit) onExit();
  };

  return (
    <OnboardingErrorBoundary key={ONBOARDING_SCHEMA_VERSION}>
    <PreviewContext.Provider value={{ data, bucket, migration, selectedHub, wizardStep, mode }}>
      <div style={{ minHeight: "100vh", background: mode === "product" ? T.canvas : mode === "email" ? "#F8F0EB" : mode === "welcome" ? "#fff" : "#050505", fontFamily: T.font, color: T.text }}>
        <GlobalStyle />
        <style>{`
          @keyframes lh-spin { to { transform: rotate(360deg); } }
          @media (max-width: 860px) {
            .lh-grid-2, .lh-product { grid-template-columns: 1fr !important; }
            .lh-shell { grid-template-columns: 1fr !important; }
            .lh-shell-preview { display: none !important; }
            .lh-sidebar { position: static !important; width: auto !important; min-height: auto !important; border-right: 0 !important; border-bottom: 1px solid ${T.border}; }
            .lh-top { flex-wrap: wrap !important; height: auto !important; padding: 12px !important; }
            .lh-table-head { display: none !important; }
            .lh-lead-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {mode !== "product" && mode !== "welcome" && mode !== "email" && <ProgressBar pct={progressFor(mode, wizardStep, data)} />}
        {onExit && <ExitButton onClick={exit} />}

      {mode === "email" && <WelcomeEmailScreen onStart={() => { setMode("wizard"); setWizardStep(0); }} />}
      {mode === "welcome" && <WelcomeScreen onStart={() => { setMode("wizard"); setWizardStep(0); }} />}
      {mode === "hub" && (
        <HubPicker
          selectedHub={selectedHub}
          setSelectedHub={setSelectedHub}
          onStartFresh={() => { setMode("wizard"); setWizardStep(3); }}
        />
      )}
      {mode === "migration-source" && (
        <MigrationSource
          source={migration.source}
          setSource={(source) => setMigration((m) => ({ ...m, source }))}
          onBack={() => setMode("hub")}
          onNext={() => setMode("migration-preview")}
        />
      )}
      {mode === "migration-preview" && <MigrationPreview source={migration.source} onBack={() => setMode("migration-source")} onNext={() => setMode("migration-reconnect")} />}
      {mode === "migration-reconnect" && (
        <MigrationReconnect
          data={data}
          set={set}
          connectionState={connectionState}
          setConnectionState={setConnectionState}
          source={migration.source}
          onBack={() => setMode("migration-preview")}
          onComplete={() => {
            setMigration((m) => ({ ...m, complete: true }));
            setMode("wizard");
            setWizardStep(8);
          }}
        />
      )}
      {mode === "wizard" && (
        <LeadWizard
          step={wizardStep}
          setStep={setWizardStep}
          data={data}
          set={set}
          bucket={bucket}
          connectionState={connectionState}
          setConnectionState={setConnectionState}
          onComplete={(opts) => enterProduct(opts)}
        />
      )}
      {mode === "product" && (
        <LeadProduct
          data={data}
          bucket={bucket}
          leads={leads.length ? leads : bucket.sampleLeads}
          setLeads={setLeads}
          migration={migration}
          handoff={handoff}
          setHandoff={setHandoff}
          playbook={playbook}
          setPlaybook={setPlaybook}
          initialBehaviorPrompt={initialBehaviorPrompt}
          onExit={exit}
        />
      )}

        <SupportWidget />
      </div>
    </PreviewContext.Provider>
    </OnboardingErrorBoundary>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Hero artwork, faded into the page */}
      <div style={{ position: "relative", width: "100%", height: "clamp(250px, 30vw, 430px)", overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/zuper-hero.png"
          alt="A street of homes at sunset"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0) 45%, rgba(255,255,255,.72) 78%, #fff 100%)" }} />
        <div style={heroPill}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
          Built for roofers
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 72px" }}>
        <div style={{ maxWidth: 680, textAlign: "center" }}>
          <div style={{ color: T.brand, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Welcome to Zuper
          </div>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 62px)", lineHeight: 1.05, letterSpacing: "-0.035em", fontWeight: 900, color: "#111", margin: "18px 0 0" }}>
            Transform your<br />roofing business
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: "#4b5563", margin: "22px auto 0", maxWidth: 560 }}>
            From the first call to the final invoice — schedule crews, win quotes on the roof, and get paid faster.
            Let&apos;s set up your workspace.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 34, flexWrap: "wrap" }}>
            <Btn size="lg" onClick={onStart}>Get started</Btn>
            <button onClick={onStart} style={{ border: "none", background: "transparent", color: "#111", fontSize: 15.5, fontWeight: 850, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
              Take a 2-min tour <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HubPicker({ selectedHub, setSelectedHub, onStartFresh }) {
  const selected = HUBS.find((h) => h.id === selectedHub);
  return (
    <ShellCard width={900}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={h1}>Start Zuper setup.</h1>
        <p style={p}>Start with the core Zuper workspace and then turn on the defaults your business needs.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }} className="lh-grid-2">
        {HUBS.map((hub) => (
          <button key={hub.id} onClick={() => setSelectedHub(hub.id)} style={hubTile(selectedHub === hub.id)}>
            <hub.icon size={24} color={selectedHub === hub.id ? T.brand : T.textSec} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#f4f4f4" }}>{hub.label}</span>
            <span style={{ fontSize: 12.5, color: "#9c9c9c" }}>{hub.phase}</span>
            {hub.note && <span style={{ marginTop: 8, fontSize: 11, fontWeight: 800, color: T.brand, background: T.brandBg, borderRadius: 20, padding: "3px 9px" }}>{hub.note}</span>}
          </button>
        ))}
      </div>
      {selected && selected.id !== "lead" && (
        <div style={softNote}>
          {selected.label} setup can happen later from inside Zuper. Start with the core workspace first.
        </div>
      )}
      <Footer><Btn disabled={selectedHub !== "lead"} onClick={onStartFresh} IconR={ArrowRight}>Continue with Zuper</Btn></Footer>
    </ShellCard>
  );
}

function MigrationSource({ source, setSource, onBack, onNext }) {
  return (
    <ShellCard width={760}>
      <Back onClick={onBack} />
      <h1 style={h1}>Pick your source CRM</h1>
      <p style={p}>This is mocked for the prototype. The next screen previews counts and warnings before anything lands in Zuper.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 22 }} className="lh-grid-2">
        {CRM_SOURCES.map((crm) => <DarkOption key={crm} selected={source === crm} onClick={() => setSource(crm)} title={crm} desc="Customers, jobs, lead sources" />)}
      </div>
      <Footer><Btn disabled={!source} onClick={onNext} IconR={ArrowRight}>Preview migration</Btn></Footer>
    </ShellCard>
  );
}

function MigrationPreview({ source, onBack, onNext }) {
  const counts = [
    ["Contacts", "428"],
    ["Properties", "391"],
    ["Jobs", "116"],
    ["Lead sources", "9"],
  ];
  return (
    <ShellCard width={820}>
      <Back onClick={onBack} />
      <h1 style={h1}>Preview {source} migration</h1>
      <p style={p}>Nothing imports until the source is mapped and reconnected.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }} className="lh-grid-2">
        {counts.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>
      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <Warning text="17 contacts have no phone number. They will import as email-only leads." />
        <Warning text="3 lead sources have ambiguous names. Review mapping before import." />
      </div>
      <Footer>
        <Btn variant="secondary" onClick={onNext}>Customize mapping</Btn>
        <Btn onClick={onNext} IconR={ArrowRight}>Start migration</Btn>
      </Footer>
    </ShellCard>
  );
}

function MigrationReconnect({ data, set, connectionState, setConnectionState, source, onBack, onComplete }) {
  return (
    <ShellCard width={860}>
      <Back onClick={onBack} />
      <h1 style={h1}>Reconnect sources from {source}</h1>
      <p style={p}>Each source needs attribution before it can go live in Zuper.</p>
      <LeadSourceForm data={data} set={set} connectionState={connectionState} setConnectionState={setConnectionState} />
      <IntegrationRows source={source} connectionState={connectionState} setConnectionState={setConnectionState} />
      <Footer><Btn disabled={!sourceFieldsOk(data)} onClick={onComplete} IconR={ArrowRight}>Activate source and open Zuper</Btn></Footer>
    </ShellCard>
  );
}

function LeadWizard({ step, setStep, data, set, bucket, onComplete }) {
  // Flow after the welcome email link: tools in use -> migrate -> confirm ->
  // card on file (optional) -> done.
  const screens = [
    <CrmScreen data={data} set={set} onNext={() => setStep(1)} />,
    <VendorToolsScreen data={data} set={set} onBack={() => setStep(0)} onNext={() => setStep(2)} />,
    <MigrateDataScreen data={data} set={set} onBack={() => setStep(1)} onNext={() => setStep(3)} />,
    <TeamConfirmScreen data={data} set={set} bucket={bucket} onBack={() => setStep(2)} onNext={() => setStep(4)} />,
    <ProposalSetupScreen data={data} set={set} onBack={() => setStep(3)} onNext={() => setStep(5)} />,
    <CardOnFileScreen data={data} set={set} onBack={() => setStep(4)} onNext={() => setStep(6)} />,
    <RecapScreen data={data} bucket={bucket} onBack={() => setStep(5)} onCreateJob={() => onComplete({ behaviorPrompt: "technician" })} />,
  ];
  const safeStep = Number.isInteger(step) && step >= 0 && step < screens.length ? step : 0;
  return screens[safeStep];
}

function isMigrating(data) {
  return Boolean(data.currentSystem) && data.currentSystem !== "Starting fresh";
}

// The welcome landing page now carries the intro, so this screen goes straight to the form.
function LoginScreen({ data, set, onBack, onNext }) {
  const email = textOf(data.email);
  const valid = /\S+@\S+\.\S+/.test(email);
  // This variant has no "Who are you?" step, so seed the owner name from the login address.
  const sendCode = () => {
    if (!data.firstName) set("firstName", firstNameFromEmail(email));
    onNext();
  };
  return (
    <Question title="Log in with your email" subtitle="No passwords — enter your work email and we'll send a one-time login code." onBack={onBack}>
      <DarkField label="Work email" value={email} onChange={(v) => set("email", v)} placeholder="you@roofingco.com" />
      <Footer><Btn disabled={!valid} onClick={sendCode} IconR={ArrowRight}>Send login code</Btn></Footer>
    </Question>
  );
}

function CodeScreen({ data, set, onBack, onNext }) {
  const code = textOf(data.code);
  return (
    <Question title="Verify your email" subtitle="Use any 6 characters for this prototype." onBack={onBack}>
      <DarkField label="Code" value={code} maxLength={6} onChange={(v) => set("code", v)} placeholder="123456" />
      <Footer><Btn disabled={code.length < 6} onClick={onNext} IconR={ArrowRight}>Verify</Btn></Footer>
    </Question>
  );
}

const FETCH_STEPS = ["Business name and logo", "Services you provide", "Service area and coverage", "Suggested work defaults"];

function WebsiteFetchScreen({ data, set, onBack, onNext }) {
  // Auto-fetch only the first time through; coming Back should not re-run it.
  const [status, setStatus] = useState(data.websiteFetched ? "done" : data.websiteVisited ? "idle" : "fetching");
  const [revealed, setRevealed] = useState(data.websiteFetched ? FETCH_STEPS.length : 0);
  const services = listOf(data.services);
  const websiteUrl = textOf(data.websiteUrl);
  const hasWebsite = websiteUrl.trim().length > 3;

  // Straight after email verification we prefill from the company's site rather than asking them to type it.
  useEffect(() => {
    if (status !== "fetching") return;
    set("websiteVisited", true);
    if (!textOf(data.websiteUrl)) set("websiteUrl", PREFILL_WEBSITE);
    const timers = FETCH_STEPS.map((_, index) =>
      setTimeout(() => setRevealed(index + 1), 380 * (index + 1))
    );
    const done = setTimeout(() => {
      set("companyName", PREFILL_PROFILE.name);
      set("logo", PREFILL_PROFILE.logo);
      set("services", PREFILL_PROFILE.services);
      set("workType", PREFILL_PROFILE.workType);
      set("insuranceMode", PREFILL_PROFILE.insuranceMode);
      set("businessHours", PREFILL_PROFILE.businessHours);
      set("websiteFetched", true);
      setStatus("done");
    }, 380 * FETCH_STEPS.length + 420);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const commitServices = (next) => {
    set("services", next);
    set("workType", inferWorkTypeFromSetup(next, data.insuranceMode));
  };
  const commitInsuranceMode = (mode) => {
    set("insuranceMode", mode);
    set("workType", inferWorkTypeFromSetup(services, mode));
  };
  const fetchWebsite = () => {
    if (normalizeWebsiteHost(websiteUrl) === normalizeWebsiteHost(PREFILL_WEBSITE)) {
      setRevealed(0);
      setStatus("fetching");
      return;
    }
    const profile = inferProfileFromWebsite(websiteUrl);
    set("companyName", profile.name);
    set("logo", profile.logo);
    set("services", profile.services);
    set("workType", profile.workType);
    set("insuranceMode", profile.insuranceMode);
    set("websiteFetched", true);
    setStatus("done");
  };
  const addManually = () => {
    set("websiteFetched", false);
    setStatus("manual");
  };
  const skipWebsite = () => {
    set("websiteUrl", "");
    set("websiteFetched", false);
    setStatus("idle");
    onNext();
  };
  if (status === "fetching") {
    return (
      <Question group="Work setup" title="Fetching your information" subtitle={`Reading ${normalizeWebsiteHost(websiteUrl) || normalizeWebsiteHost(PREFILL_WEBSITE)} to prefill your workspace. This only takes a moment.`} onBack={onBack}>
        <div style={darkPanel}>
          <div style={{ display: "grid", gap: 12 }}>
            {FETCH_STEPS.map((label, index) => {
              const done = index < revealed;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 11, opacity: done ? 1 : 0.45, transition: "opacity .3s ease" }}>
                  {done
                    ? <CheckCircle2 size={17} color="#5fd18b" style={{ flexShrink: 0 }} />
                    : <span style={fetchSpinner} />}
                  <span style={{ color: done ? "#f1f1f1" : "#9a9a9a", fontSize: 14, fontWeight: 800 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...hintRow, marginTop: 16 }}>
          <Lightbulb size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Everything Zuper finds is editable on the next screen.</span>
        </div>
      </Question>
    );
  }

  return (
    <Question group="Work setup" title="Start from your website" subtitle="Zuper prefilled this from your website. Review it and change anything that looks off." onBack={onBack}>
      <DarkField label="Website" value={websiteUrl} onChange={(v) => { set("websiteUrl", v); setStatus("idle"); }} placeholder="https://yourroofingcompany.com" />
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <Btn variant="secondary" disabled={!hasWebsite} onClick={fetchWebsite}>Fetch from website</Btn>
        <button onClick={addManually} style={darkLink}>Add manually</button>
        <button onClick={skipWebsite} style={darkMutedLink}>Skip</button>
      </div>
      {(status === "done" || status === "manual") && (
        <div style={{ ...darkPanel, marginTop: 18 }}>
          {status === "done" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <LogoMark name={data.companyName} src={data.logo} size={46} radius={12} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#f4f4f4", fontSize: 16, fontWeight: 900 }}>{data.companyName}</div>
                <div style={{ color: "#9a9a9a", fontSize: 12.5 }}>Found from {normalizeWebsiteHost(websiteUrl)}</div>
                {data.companyName === PREFILL_PROFILE.name && (
                  <div style={{ color: "#8f8f8f", fontSize: 12, marginTop: 3 }}>
                    {PREFILL_PROFILE.serviceArea} · {PREFILL_PROFILE.phone}
                  </div>
                )}
              </div>
            </div>
          )}
          <MultiSelectGroup label="Services you provide" options={WEBSITE_SERVICE_OPTIONS} selected={services} onToggle={(value) => toggleList(services, value, commitServices)} />
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>Insurance / non-insurance</div>
            <div style={{ display: "grid", gap: 10 }}>
              {INSURANCE_MODES.map((mode) => (
                <DarkOption key={mode} selected={data.insuranceMode === mode} onClick={() => commitInsuranceMode(mode)} title={mode} />
              ))}
            </div>
          </div>
        </div>
      )}
      {(status === "done" || status === "manual") && <Footer><Btn disabled={!services.length || !data.insuranceMode} onClick={onNext} IconR={ArrowRight}>{status === "done" ? "Use this info" : "Continue"}</Btn></Footer>}
    </Question>
  );
}

function NameScreen({ data, set, onBack, onNext }) {
  const ok = data.firstName && data.lastName && data.phone && data.role && data.companyName;
  return (
    <Question group="People and delivery" title="Who are you?" subtitle="These details personalize your Zuper workspace and first-run queue." onBack={onBack}>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "end", marginBottom: 14 }} className="lh-grid-2">
        <label style={{ display: "block" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#d8d8d8", marginBottom: 8 }}>Company logo</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LogoMark name={data.companyName} src={data.logo} size={54} radius={14} />
            <span style={uploadButton}>Upload logo</span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) set("logo", URL.createObjectURL(file)); }} />
          </div>
        </label>
        <DarkField label="Company name" value={data.companyName} onChange={(v) => set("companyName", v)} placeholder="Your roofing company" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="lh-grid-2">
        <DarkField label="First name" value={data.firstName} onChange={(v) => set("firstName", v)} placeholder="Sam" />
        <DarkField label="Last name" value={data.lastName} onChange={(v) => set("lastName", v)} placeholder="Rivera" />
      </div>
      <div style={{ marginTop: 12 }}><DarkField label="Mobile number" value={data.phone} onChange={(v) => set("phone", v)} placeholder="(555) 123-4567" /></div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#d8d8d8", marginBottom: 8 }}>Your role</div>
        <div style={{ display: "grid", gap: 10 }}>
          {["IT Admin", "CEO", "Other"].map((role) => (
            <DarkOption key={role} selected={data.role === role} onClick={() => set("role", role)} title={role} />
          ))}
        </div>
      </div>
      <Footer><Btn disabled={!ok} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function WorkTypeScreen({ data, set, onBack, onNext }) {
  return (
    <Question group="Work setup" title="What work should Zuper support?" subtitle="This sets job stages, categories, and sample queue data." onBack={onBack}>
      <div style={{ display: "grid", gap: 10 }}>
        {WORK_TYPES.map((work) => <DarkOption key={work.id} selected={data.workType === work.id} onClick={() => set("workType", work.id)} title={work.label} />)}
      </div>
      <Footer><Btn disabled={!data.workType} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function ServicesCoverageScreen({ data, set, onBack, onNext }) {
  const services = listOf(data.services);
  return (
    <Question group="Work setup" title="Review setup details" subtitle="Review the services Zuper should use for job categories, then mark whether they include insurance work." onBack={onBack}>
      <MultiSelectGroup label="Services you provide" options={WEBSITE_SERVICE_OPTIONS} selected={services} onToggle={(value) => toggleList(services, value, (next) => set("services", next))} />
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>Insurance / non-insurance</div>
        <div style={{ display: "grid", gap: 10 }}>
          {INSURANCE_MODES.map((mode) => (
            <DarkOption key={mode} selected={data.insuranceMode === mode} onClick={() => set("insuranceMode", mode)} title={mode} />
          ))}
        </div>
      </div>
      <Footer><Btn disabled={!services.length || !data.insuranceMode} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function BusinessSystemScreen({ data, set, onBack, onNext }) {
  const selected = BUSINESS_SYSTEMS.find((system) => system.id === data.currentSystem);
  const migrating = Boolean(selected && selected.logo);
  // Guard the empty-string case: both fields start as "" and would compare equal.
  const connected = Boolean(data.currentSystem) && data.migrationConnected === data.currentSystem;
  const canContinue = data.currentSystem === "Starting fresh" || connected;
  return (
    <Question
      group="Work setup"
      title="How do you conduct your business right now?"
      subtitle="If you already run on another system, Zuper can bring your existing work across instead of starting empty."
      onBack={onBack}
    >
      <div style={{ display: "grid", gap: 10 }}>
        {/* Once a system is picked the list collapses to just that one; "Change" reopens it. */}
        {(selected ? [selected] : BUSINESS_SYSTEMS).map((system) => {
          const active = data.currentSystem === system.id;
          const body = (
            <>
              <span style={systemLogoTile}>
                {system.logo
                  ? <img src={system.logo} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                  : <Plus size={20} color="#6b7280" />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 16, fontWeight: 850, color: "#f4f4f4" }}>{system.label}</span>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 750, color: "#9a9a9a", marginTop: 3 }}>{system.note}</span>
              </span>
            </>
          );
          if (active) {
            return (
              <React.Fragment key={system.id}>
                <div style={{ ...systemCard(true), cursor: "default" }}>
                  {body}
                  <button
                    onClick={() => { set("currentSystem", ""); set("migrationConnected", ""); }}
                    style={{ ...darkLink, whiteSpace: "nowrap" }}
                  >
                    Change platform
                  </button>
                </div>
                {system.logo && (
                  <MigrationCredentials
                    system={system}
                    connected={connected}
                    onConnected={() => {
                      set("migrationConnected", system.id);
                      Object.entries(MIGRATION_PREFILL).forEach(([key, value]) => set(key, value));
                    }}
                  />
                )}
              </React.Fragment>
            );
          }
          return (
            <button
              key={system.id}
              onClick={() => { set("currentSystem", system.id); set("migrationConnected", ""); }}
              style={systemCard(false)}
            >
              {body}
              <span style={radioMark(false)} />
            </button>
          );
        })}
      </div>
      <Footer>
        <Btn disabled={!canContinue} onClick={onNext} IconR={ArrowRight}>
          {migrating && connected ? "Continue with import" : "Continue"}
        </Btn>
      </Footer>
    </Question>
  );
}

// Prototype only: credentials live in local state, are never persisted into the
// onboarding data object, and are not sent anywhere.
function MigrationCredentials({ system, connected, onConnected }) {
  const [account, setAccount] = useState("");
  const [secret, setSecret] = useState("");
  const [useApiKey, setUseApiKey] = useState(false);
  const [phase, setPhase] = useState(connected ? "done" : "idle");
  const [step, setStep] = useState(0);
  const ready = useApiKey ? secret.trim().length > 5 : /\S+@\S+\.\S+/.test(account) && secret.length > 3;

  useEffect(() => {
    if (phase !== "connecting") return;
    const timers = CONNECT_STEPS.map((_, index) => setTimeout(() => setStep(index + 1), 460 * (index + 1)));
    const done = setTimeout(() => { setPhase("done"); onConnected(); }, 460 * CONNECT_STEPS.length + 380);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "done") {
    return (
      <div style={{ ...darkPanel, borderColor: "rgba(52,168,95,.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <CheckCircle2 size={17} color="#5fd18b" />
          <span style={{ fontSize: 14.5, fontWeight: 900, color: "#f1f1f1" }}>{system.label} connected</span>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: "#8f8f8f", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
          What Zuper will bring over
        </div>
        <div style={{ display: "grid", gap: 7 }}>
          {system.brings.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <CheckCircle2 size={14} color="#5fd18b" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 750, color: "#d8d8d8" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "connecting") {
    return (
      <div style={darkPanel}>
        <div style={{ display: "grid", gap: 12 }}>
          {CONNECT_STEPS.map((label, index) => {
            const done = index < step;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 11, opacity: done ? 1 : 0.45, transition: "opacity .3s ease" }}>
                {done ? <CheckCircle2 size={17} color="#5fd18b" style={{ flexShrink: 0 }} /> : <span style={fetchSpinner} />}
                <span style={{ color: done ? "#f1f1f1" : "#9a9a9a", fontSize: 14, fontWeight: 800 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={darkPanel}>
      <div style={cardTitle}>Connect your {system.label} account</div>
      {useApiKey ? (
        <DarkField label="API key" value={secret} type="password" onChange={setSecret} placeholder={`${system.label} API key`} />
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <DarkField label="Email" value={account} onChange={setAccount} placeholder={`you@company.com`} />
          <DarkField label="Password" value={secret} type="password" onChange={setSecret} placeholder="••••••••" />
        </div>
      )}
      <div style={{ ...hintRow, marginTop: 14 }}>
        <Lightbulb size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Zuper uses these once to read your data and configuration, then discards them. Prototype — nothing is sent anywhere.</span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
        <Btn disabled={!ready} onClick={() => { setStep(0); setPhase("connecting"); }} IconR={ArrowRight}>
          Connect and import
        </Btn>
        <button onClick={() => { setUseApiKey(!useApiKey); setSecret(""); }} style={darkLink}>
          {useApiKey ? "Use email and password" : "Use an API key instead"}
        </button>
      </div>
    </div>
  );
}

function BusinessHoursScreen({ data, set, onBack, onNext }) {
  const manual = data.businessHours === "Set hours manually";
  return (
    <Question group="Work setup" title="What are your business hours?" subtitle="Pick the closest schedule or set a simple manual range." onBack={onBack}>
      <div style={{ display: "grid", gap: 10 }}>
        {BUSINESS_HOURS.map((hours) => (
          <DarkOption key={hours} selected={data.businessHours === hours} onClick={() => set("businessHours", hours)} title={hours} />
        ))}
      </div>
      {manual && (
        <div style={{ ...darkPanel, marginTop: 16 }}>
          <div style={cardTitle}>Manual hours</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="lh-grid-2">
            <DarkSelect label="Open" value={data.businessHoursStart} options={TIME_OPTIONS} onChange={(v) => set("businessHoursStart", v)} />
            <DarkSelect label="Close" value={data.businessHoursEnd} options={TIME_OPTIONS} onChange={(v) => set("businessHoursEnd", v)} />
          </div>
          <div style={{ color: "#9a9a9a", fontSize: 12.5, marginTop: 10 }}>Applies Monday-Friday. You can add weekend and holiday rules later.</div>
        </div>
      )}
      <Footer><Btn disabled={!data.businessHours} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function FollowupScreen({ data, set, onBack, onNext }) {
  const insurance = data.workType === "insurance";
  const other = data.workType === "other";
  const opts = insurance ? ["Full claim", "Repair only"] : ["Website leads", "Referrals", "Door knocking", "Phone calls"];
  return (
    <Question group="Work setup" title={insurance ? "Do you handle the full claim or just the repair?" : other ? "Tell us how work reaches you" : "How does work start?"} subtitle="This tunes default source categories." onBack={onBack}>
      {other ? (
        <DarkField label="Work source" value={data.followup} onChange={(v) => set("followup", v)} placeholder="Mostly repeat commercial clients" />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>{opts.map((opt) => <DarkOption key={opt} selected={data.followup === opt} onClick={() => set("followup", opt)} title={opt} />)}</div>
      )}
      <Footer><Btn disabled={!data.followup} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function CurrentSystemScreen({ data, set, onBack, onNext }) {
  return (
    <Question group="Platforms" title="How do you manage your business today?" subtitle="We will use this to bring over what already works, or start clean if you prefer." onBack={onBack}>
      <div style={{ display: "grid", gap: 10 }}>
        {CURRENT_SYSTEMS.map((system) => (
          <DarkOption key={system} selected={data.currentSystem === system} onClick={() => set("currentSystem", system)} title={system} />
        ))}
      </div>
      <Footer><Btn disabled={!data.currentSystem} onClick={() => onNext(data.currentSystem)} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function WorkflowGenerateScreen({ data, set, bucket, onBack, onNext }) {
  const savedWorkflow = listOf(data.workflow);
  const services = listOf(data.services);
  const flow = savedWorkflow.length ? savedWorkflow : workflowFor(bucket, data);
  const categories = jobDefaultTreeFor(data, bucket);
  return (
    <Question group="Work setup" title="Zuper has prepared your work defaults." subtitle="Job categories, durations, and statuses are generated from your services, insurance mode, and hours." onBack={onBack}>
      <div style={darkPanel}>
        <div style={cardTitle}>Work setup summary</div>
        <div style={{ display: "grid", gap: 9 }}>
          <InfoDark label="Services" value={services.join(", ") || "Ready"} />
          <InfoDark label="Coverage" value={data.insuranceMode || "Ready"} />
          <InfoDark label="Business hours" value={businessHoursLabel(data) || "Ready"} />
          <InfoDark label="Generated categories" value={`${categories.length} categories`} />
          <InfoDark label="Workflow" value={`${flow.length} stages`} />
        </div>
      </div>
      <Footer>
        <Btn onClick={() => { if (!savedWorkflow.length) set("workflow", flow); onNext(); }} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

function ProposalScreen({ data, set, bucket, onBack, onNext }) {
  const [uploadedName, setUploadedName] = useState("");
  const templates = ["Simple", "Detailed", bucket.id === "insuranceRoofing" ? "Insurance" : "Insurance"];
  return (
    <Question group="Catalog and pricing" title="Choose your proposal style" subtitle="Pick the proposal layout that best represents your brand. The preview on the right updates from your choice." onBack={onBack}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={darkPanel}>
          <div style={cardTitle}>Upload an existing proposal</div>
          <label style={uploadZone}>
            <UploadIcon />
            <span>{uploadedName || "Drop a PDF or DOCX, or click to browse"}</span>
            <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { setUploadedName(file.name); set("proposalPath", "Upload"); set("proposalUploaded", true); } }} />
          </label>
          {data.proposalUploaded && (
            <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
              {["Detected branding", "Customer info fields", "Product lines", "Pricing", "Signature area"].map((item) => <FoundItem key={item}>{item}</FoundItem>)}
              <Btn onClick={() => { set("proposalPath", "Upload"); onNext(); }} IconR={ArrowRight}>Create my proposal template</Btn>
            </div>
          )}
        </div>
        <div style={darkPanel}>
          <div style={cardTitle}>Choose a template</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }} className="lh-grid-2">
            {templates.map((template) => (
              <button key={template} onClick={() => { set("proposalPath", "Template"); set("proposalTemplate", template); }} style={choiceTile(data.proposalTemplate === template)}>
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer>
        <button onClick={() => { set("proposalPath", "Later"); onNext(); }} style={darkLink}>I'll do this later</button>
        <Btn disabled={data.proposalPath === "Upload" && !data.proposalUploaded} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

// CRM path: every downstream stage is prefilled from the import, so the user
// affirms one summary instead of re-answering each question.
function MigrationSummaryScreen({ data, set, bucket, onBack, onNext }) {
  const source = data.currentSystem;
  const categories = jobDefaultTreeFor(data, bucket);
  const services = listOf(data.services);
  const suppliers = listOf(data.suppliers);
  const subcontractors = listOf(data.subcontractors);
  const teammates = listOf(data.teammates);
  const affirmed = listOf(data.affirmed);
  const affirm = (id) => toggleList(affirmed, id, (next) => set("affirmed", next));

  const sections = [
    {
      id: "services",
      icon: Inbox,
      title: "Services offered",
      note: `Read from your ${source} job types and price list.`,
      chips: [...services, data.insuranceMode].filter(Boolean),
    },
    {
      id: "products",
      icon: FileText,
      title: "Product set-up",
      note: `${categories.length} product categories identified from ${source}.`,
      chips: categories.map((item) => item.category),
      trigger: { key: "triggerProductImport", label: "Trigger product master import" },
    },
    {
      id: "vendors",
      icon: Package,
      title: "Vendors and sub-contractors",
      note: "Matched to the vendors already attached to your purchase orders.",
      chips: [...suppliers, ...subcontractors],
      trigger: { key: "triggerJumpStart", label: "Trigger Jump Start" },
    },
    {
      id: "people",
      icon: Users,
      title: "Users and teams",
      note: `${teammates.length} users found. Edit roles later in Settings.`,
      chips: teammates.map((member) => `${member.email} · ${member.role}`),
      trigger: { key: "triggerInvites", label: "Send email invitations" },
    },
  ];

  const allAffirmed = sections.every((section) => affirmed.includes(section.id));

  return (
    <Question
      group="Catalog and pricing"
      title={`Here is what we found in ${source}`}
      subtitle="Zuper prefilled your workspace from the import. Confirm each section — you can change any of it later."
      onBack={onBack}
    >
      <div style={{ display: "grid", gap: 10 }}>
        {sections.map((section) => (
          <SummarySection
            key={section.id}
            section={section}
            confirmed={affirmed.includes(section.id)}
            onConfirm={() => affirm(section.id)}
            triggerOn={section.trigger ? Boolean(data[section.trigger.key]) : false}
            onTrigger={section.trigger ? () => set(section.trigger.key, !data[section.trigger.key]) : null}
          />
        ))}

        {/* Stage 6 in the plan — optional, so it never blocks Continue. */}
        <div style={{ ...darkPanel, borderStyle: "dashed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={recapIconTile}><RefreshCcw size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#f4f4f4" }}>Transactional data migration</div>
              <div style={{ fontSize: 12.5, fontWeight: 750, color: "#9a9a9a", marginTop: 3 }}>Optional — runs in the background after setup.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0" }}>
            {MIGRATION_PREFILL.transactional.map(([value, label]) => (
              <div key={label} style={recapStatCard}>
                <div style={{ fontSize: 20, fontWeight: 950, color: "#f4f4f4", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8f8f8f", marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
          <DarkOption
            selected={Boolean(data.triggerDataMigration)}
            onClick={() => set("triggerDataMigration", !data.triggerDataMigration)}
            title="Initiate data import"
          />
        </div>
      </div>
      <Footer>
        <Btn disabled={!allAffirmed} onClick={onNext} IconR={ArrowRight}>
          {allAffirmed ? "Confirm and continue" : "Confirm each section"}
        </Btn>
      </Footer>
    </Question>
  );
}

function SummarySection({ section, confirmed, onConfirm, triggerOn, onTrigger }) {
  const SectionIcon = section.icon;
  return (
    <div style={{ ...darkPanel, borderColor: confirmed ? "rgba(52,168,95,.4)" : "#303030" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={recapIconTile}><SectionIcon size={16} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#f4f4f4" }}>{section.title}</div>
          <div style={{ fontSize: 12.5, fontWeight: 750, color: "#9a9a9a", marginTop: 3 }}>{section.note}</div>
        </div>
        <button onClick={onConfirm} style={{ ...darkLink, display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", color: confirmed ? "#5fd18b" : "#dcdcdc" }}>
          {confirmed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {confirmed ? "Confirmed" : "Looks right"}
        </button>
      </div>
      {section.chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {section.chips.map((chip) => <span key={chip} style={summaryChip}>{chip}</span>)}
        </div>
      )}
      {onTrigger && (
        <button onClick={onTrigger} style={{ ...darkLink, display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, color: triggerOn ? "#5fd18b" : "#dcdcdc" }}>
          <span style={checkBox(triggerOn)}>{triggerOn && "✓"}</span>
          {section.trigger.label}
        </button>
      )}
    </div>
  );
}

// ─── Welcome email: the flow starts by clicking through from the inbox ───────
function WelcomeEmailScreen({ onStart }) {
  const steps = [
    "Tell us a bit about how your business works",
    "We'll import your existing data and set up your workflow, catalog, and proposal template automatically",
    "Invite your team",
    "Run your first real job",
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#F8F0EB", padding: "0 0 40px", color: "#191919" }}>
      <div style={{ textAlign: "center", padding: "32px 16px 24px" }}>
        <img src="/zuper-wordmark.png" alt="Zuper" style={{ height: 26, width: "auto", display: "inline-block" }} />
      </div>

      <div style={emailCard}>
        <div style={{ padding: "44px 44px 0" }}>
          <h1 style={{ fontWeight: 800, fontSize: 32, lineHeight: 1.14, letterSpacing: "-.025em", margin: 0, textAlign: "center" }}>
            Welcome to Zuper! Let&rsquo;s transform how you run your business.
          </h1>
        </div>

        <div style={{ padding: "32px 0 0" }}>
          <img src="/zuper-hero.png" alt="" style={{ display: "block", width: "100%", height: "auto" }} />
        </div>

        <div style={{ padding: "36px 44px 0", display: "grid", gap: 18, fontSize: 16, lineHeight: 1.62, color: "#3F3F3F" }}>
          <p style={{ margin: 0 }}>Hi Sam,</p>
          <p style={{ margin: 0 }}>You&rsquo;re in! And we&rsquo;re genuinely excited about what&rsquo;s next, because this is the moment your roofing business starts running differently.</p>
          <p style={{ margin: 0 }}>We know you&rsquo;re not starting from zero. Bring your customers, jobs, and history over with you, and Zuper will feel familiar fast.</p>
          <p style={{ margin: 0 }}>This isn&rsquo;t a handoff to a support ticket queue. A real team is behind this, listening to what you need and moving quickly to get you there. You can set this up yourself, and we&rsquo;ll guide you along the way. If you ever get stuck, we&rsquo;re right here.</p>
        </div>

        <div style={{ margin: "30px 44px 0", borderRadius: 12 }}>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em", color: T.brand, marginBottom: 18, fontWeight: 800 }}>
            Here&rsquo;s what to expect
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {steps.map((label, index) => (
              <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={emailStepDot}>{index + 1}</span>
                <span style={{ fontSize: 15, lineHeight: 1.55, color: "#191919" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "26px 44px 0" }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.62, color: "#3F3F3F" }}>
            Most of this is already done for you. You&rsquo;re mostly confirming, not building from scratch.
          </p>
        </div>

        <div style={{ padding: "34px 44px 44px", textAlign: "center" }}>
          <button onClick={onStart} style={emailCta}>Let&rsquo;s set up Zuper</button>
          <div style={{ marginTop: 16, fontSize: 13, color: "#767676" }}>Takes about 10 minutes. No credit card required.</div>
        </div>
      </div>

      <div style={{ width: 600, maxWidth: "100%", margin: "0 auto", padding: "28px 44px 0", boxSizing: "border-box", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 14px", fontSize: 13, color: "#767676", marginBottom: 16 }}>
          <span>Help center</span><span>&middot;</span><span>Talk to your onboarding team</span><span>&middot;</span><span>Privacy policy</span>
        </div>
        <img src="/zuper-wordmark.png" alt="Zuper" style={{ height: 18, width: "auto", display: "inline-block", opacity: 0.55, marginBottom: 12 }} />
        <div style={{ fontSize: 11, lineHeight: 1.7, color: "#9A9A9A" }}>
          Zuper, Inc. &middot; The AI operating system for field service.<br />
          You&rsquo;re receiving this because you created a Zuper account. <span style={{ textDecoration: "underline" }}>Unsubscribe</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: the CRM you run on today ──────────────────────────────────────
function CrmScreen({ data, set, onBack, onNext }) {
  const selected = BUSINESS_SYSTEMS.find((system) => system.id === data.currentSystem);
  const connected = Boolean(data.currentSystem) && data.migrationConnected === data.currentSystem;
  const ready = data.currentSystem === "Starting fresh" || connected;

  return (
    <Question
      group="Work setup"
      title="Which CRM do you run on today?"
      subtitle="Connect it and Zuper will pull your customers, jobs, and setup across instead of starting empty."
      onBack={onBack}
    >
      <div style={{ display: "grid", gap: 10 }}>
        {(selected ? [selected] : BUSINESS_SYSTEMS).map((system) => {
          const active = data.currentSystem === system.id;
          const body = (
            <>
              <span style={systemLogoTile}>
                {system.logo
                  ? <img src={system.logo} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                  : <Plus size={20} color="#6b7280" />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 16, fontWeight: 850, color: "#f4f4f4" }}>{system.label}</span>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 750, color: "#9a9a9a", marginTop: 3 }}>{system.note}</span>
              </span>
            </>
          );
          if (active) {
            return (
              <React.Fragment key={system.id}>
                <div style={{ ...systemCard(true), cursor: "default" }}>
                  {body}
                  <button
                    onClick={() => { set("currentSystem", ""); set("migrationConnected", ""); }}
                    style={{ ...darkLink, whiteSpace: "nowrap" }}
                  >
                    Change platform
                  </button>
                </div>
                {system.logo && (
                  <MigrationCredentials
                    system={system}
                    connected={connected}
                    onConnected={() => {
                      set("migrationConnected", system.id);
                      Object.entries(MIGRATION_PREFILL).forEach(([key, value]) => set(key, value));
                    }}
                  />
                )}
              </React.Fragment>
            );
          }
          return (
            <button
              key={system.id}
              onClick={() => { set("currentSystem", system.id); set("migrationConnected", ""); }}
              style={systemCard(false)}
            >
              {body}
              <span style={radioMark(false)} />
            </button>
          );
        })}
      </div>

      <Footer>
        <Btn disabled={!ready} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

// ─── Step 2: the vendors and measurement tools alongside it ────────────────
function VendorToolsScreen({ data, set, onBack, onNext }) {
  const vendors = listOf(data.suppliers);
  const measurement = listOf(data.measurementTools);

  return (
    <Question
      group="Catalog and pricing"
      title="What else do you work with?"
      subtitle="Vendors set up your parts catalog, and your measurement tool feeds roof reports straight into estimates."
      onBack={onBack}
    >
      <div style={sectionLabel}>Your vendors</div>
      <div style={{ display: "grid", gap: 10 }}>
        {SUPPLIER_CATALOG.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            selected={vendors.includes(supplier.id)}
            onToggle={() => toggleList(vendors, supplier.id, (next) => set("suppliers", next))}
          />
        ))}
      </div>

      <div style={{ ...sectionLabel, marginTop: 28 }}>Your measurement tool</div>
      <div style={{ display: "grid", gap: 10 }}>
        {MEASUREMENT_TOOLS.map((tool) => {
          const on = measurement.includes(tool.id);
          return (
            <button
              key={tool.id}
              onClick={() => toggleList(measurement, tool.id, (next) => set("measurementTools", next))}
              style={systemCard(on)}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15.5, fontWeight: 850, color: "#f4f4f4" }}>{tool.id}</span>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 750, color: "#9a9a9a", marginTop: 3 }}>{tool.note}</span>
              </span>
              <span style={checkBox(on)}>{on && "✓"}</span>
            </button>
          );
        })}
      </div>

      <Footer>
        <Btn onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

// ─── Step 2: pull the data across, with a manual fallback for services ──────
const MIGRATE_STEPS = ["Customers and contacts", "Jobs and job history", "Services and price list", "Users and teams"];

function MigrateDataScreen({ data, set, onBack, onNext }) {
  const migrating = isMigrating(data);
  const [phase, setPhase] = useState(() => (migrating && !data.migrationFetched ? "fetching" : "done"));
  const [step, setStep] = useState(() => (data.migrationFetched ? MIGRATE_STEPS.length : 0));
  const services = listOf(data.services);
  const source = data.currentSystem;
  const autoFilled = migrating && data.migrationFetched;

  useEffect(() => {
    if (phase !== "fetching") return;
    const timers = MIGRATE_STEPS.map((_, index) => setTimeout(() => setStep(index + 1), 420 * (index + 1)));
    const done = setTimeout(() => { set("migrationFetched", true); setPhase("done"); }, 420 * MIGRATE_STEPS.length + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const commitServices = (next) => {
    set("services", next);
    set("workType", inferWorkTypeFromSetup(next, data.insuranceMode));
  };

  if (phase === "fetching") {
    return (
      <Question group="Work setup" title={`Reading your ${source} setup`} subtitle="This runs once. Nothing in your existing system changes." onBack={onBack}>
        <div style={darkPanel}>
          <div style={{ display: "grid", gap: 12 }}>
            {MIGRATE_STEPS.map((label, index) => {
              const done = index < step;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 11, opacity: done ? 1 : 0.45, transition: "opacity .3s ease" }}>
                  {done ? <CheckCircle2 size={17} color="#5fd18b" style={{ flexShrink: 0 }} /> : <span style={fetchSpinner} />}
                  <span style={{ color: done ? "#f1f1f1" : "#9a9a9a", fontSize: 14, fontWeight: 800 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Question>
    );
  }

  return (
    <Question
      group="Work setup"
      title={migrating ? `What we read from ${source}` : "Tell us what you do"}
      subtitle={migrating
        ? "Zuper filled in what it could. Add or remove anything below — your records import later, once setup is done."
        : "No system to read from, so pick the services you offer and Zuper will build your defaults."}
      onBack={onBack}
    >
      <div style={darkPanel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ ...cardTitle, marginBottom: 0 }}>Services you provide</div>
          {autoFilled && (
            <span style={{ ...summaryChip, borderColor: "rgba(52,168,95,.45)", color: "#7ee2a2" }}>Auto-filled</span>
          )}
        </div>

        <MultiSelectGroup
          label=""
          options={WEBSITE_SERVICE_OPTIONS}
          selected={services}
          onToggle={(value) => toggleList(services, value, commitServices)}
        />

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>Insurance / non-insurance</div>
          <div style={{ display: "grid", gap: 10 }}>
            {INSURANCE_MODES.map((mode) => (
              <DarkOption
                key={mode}
                selected={data.insuranceMode === mode}
                onClick={() => { set("insuranceMode", mode); set("workType", inferWorkTypeFromSetup(services, mode)); }}
                title={mode}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer>
        <Btn disabled={!services.length || !data.insuranceMode} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

// ─── Step 4: confirm who works here ────────────────────────────────────────
function TeamConfirmScreen({ data, set, bucket, onBack, onNext }) {
  const teammates = listOf(data.teammates);
  const categories = jobDefaultTreeFor(data, bucket);
  const removeTeammate = (index) => set("teammates", teammates.filter((_, i) => i !== index));
  const addTeammate = () => {
    const email = textOf(data.invitedEmail).trim();
    if (!email) return;
    set("teammates", [...teammates, { email, role: data.invitedRole || "Sales" }]);
    set("invitedEmail", "");
  };

  return (
    <Question
      group="People and delivery"
      title="Confirm your team"
      subtitle={`Zuper generated ${categories.length} job categories from your services. Confirm who should have access — you can change roles later in Settings.`}
      onBack={onBack}
    >
      <div style={darkPanel}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #303030" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#f1f1f1", fontSize: 13.5, fontWeight: 850 }}>You</div>
            <div style={{ color: "#9a9a9a", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {textOf(data.email) || "sam@mavenroof.com"}
            </div>
          </div>
          <span style={{ ...summaryChip, borderColor: "#3a3a3a" }}>Admin</span>
        </div>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {teammates.length === 0 && (
            <div style={{ color: "#8f8f8f", fontSize: 13, fontWeight: 750 }}>No other users yet — add anyone who should have access.</div>
          )}
          {teammates.map((member, index) => (
            <div key={`${member.email}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center" }}>
              <div style={{ color: "#f1f1f1", fontSize: 13.5, fontWeight: 800, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{member.email}</div>
              <span style={{ ...summaryChip, borderColor: "#333" }}>{member.role}</span>
              <button onClick={() => removeTeammate(index)} style={darkMutedLink}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr", gap: 12, marginTop: 16 }} className="lh-grid-2">
          <DarkField label="Email" value={data.invitedEmail} onChange={(v) => set("invitedEmail", v)} placeholder="teammate@roofingco.com" />
          <label style={{ display: "block" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#ddd", marginBottom: 8 }}>Role</div>
            <select value={data.invitedRole} onChange={(e) => set("invitedRole", e.target.value)} style={darkInput}>
              {INVITE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <Btn variant="secondary" disabled={!textOf(data.invitedEmail).trim()} onClick={addTeammate}>Add user</Btn>
        </div>
      </div>

      <Footer><Btn onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

// ─── Step 5: a sample proposal for Zuper to learn from (required) ──────────
function ProposalSetupScreen({ data, set, onBack, onNext }) {
  return (
    <Question
      group="Catalog and pricing"
      title="Set up your proposal"
      subtitle="Upload one proposal you have sent before. Zuper reads its structure, line items, and pricing to build your template."
      onBack={onBack}
    >
      <div style={darkPanel}>
        <label style={uploadZone}>
          <UploadIcon />
          <span>{data.proposalFileName || "Drop a PDF, DOCX, XLSX, or CSV file, or click to browse"}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              set("proposalFileName", file.name);
              set("cpqFileName", file.name);
              set("proposalPath", "Upload");
              set("proposalUploaded", true);
            }}
          />
        </label>

        {data.proposalFileName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 14 }}>
            <CheckCircle2 size={16} color="#5fd18b" />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#d8d8d8" }}>
              Zuper will build your proposal template from this file.
            </span>
          </div>
        ) : (
          <div style={{ ...hintRow, marginTop: 14 }}>
            <AlertTriangle size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Required — Zuper needs one example to build your proposal template.</span>
          </div>
        )}
      </div>

      <Footer>
        <Btn disabled={!data.proposalFileName} onClick={onNext} IconR={ArrowRight}>
          {data.proposalFileName ? "Continue" : "Upload a proposal to continue"}
        </Btn>
      </Footer>
    </Question>
  );
}

// ─── Step 4: card on file, optional, right before the product ───────────────
function CardOnFileScreen({ data, set, onBack, onNext }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const ready = name.trim().length > 2 && number.replace(/\s/g, "").length >= 12 && expiry.trim().length >= 4 && cvc.trim().length >= 3;

  if (data.cardAdded) {
    return (
      <Question group="Platforms" title="Card on file" subtitle="You are all set — we will not charge anything during your trial." onBack={onBack}>
        <div style={{ ...darkPanel, borderColor: "rgba(52,168,95,.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle2 size={17} color="#5fd18b" />
            <span style={{ fontSize: 14.5, fontWeight: 900, color: "#f1f1f1" }}>Card saved</span>
          </div>
          <div style={{ color: "#9a9a9a", fontSize: 13, marginTop: 8 }}>Billing starts only when your trial ends. Remove it any time in Settings.</div>
        </div>
        <Footer><Btn onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
      </Question>
    );
  }

  return (
    <Question
      group="Platforms"
      title="Add a card on file"
      subtitle="Optional. Nothing is charged during your trial — this just keeps your workspace running when it ends."
      onBack={onBack}
    >
      <div style={darkPanel}>
        <DarkField label="Name on card" value={name} onChange={setName} placeholder="Sam Rivera" />
        <div style={{ marginTop: 12 }}>
          <DarkField label="Card number" value={number} onChange={setNumber} placeholder="0000 0000 0000 0000" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }} className="lh-grid-2">
          <DarkField label="Expiry" value={expiry} onChange={setExpiry} placeholder="MM/YY" />
          <DarkField label="CVC" value={cvc} onChange={setCvc} placeholder="123" />
        </div>
        <div style={{ ...hintRow, marginTop: 14 }}>
          <Lightbulb size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Prototype — this form is a mockup and nothing is sent anywhere. Do not enter a real card.</span>
        </div>
      </div>

      <Footer>
        <button onClick={() => { set("cardSkipped", true); onNext(); }} style={darkLink}>Skip for now</button>
        <Btn disabled={!ready} onClick={() => { set("cardAdded", true); set("cardSkipped", false); onNext(); }} IconR={ArrowRight}>
          Save card
        </Btn>
      </Footer>
    </Question>
  );
}

function InventoryScreen({ data, set, onBack, onNext }) {
  const suppliers = listOf(data.suppliers);
  const manufacturers = listOf(data.manufacturers);
  const connectedShorts = SUPPLIER_CATALOG.filter((s) => suppliers.includes(s.id)).map((s) => s.short);
  return (
    <Question
      group="Catalog and pricing"
      title="Set up your inventory"
      subtitle="Connect the suppliers you buy through, then pick the manufacturers you install. Zuper builds your parts catalog from both."
      onBack={onBack}
    >
      <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>Who are the suppliers you connect with?</div>
      <div style={hintRow}>
        <Lightbulb size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Connect one or more suppliers to pull in their catalog without linking products individually.</span>
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {SUPPLIER_CATALOG.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            selected={suppliers.includes(supplier.id)}
            onToggle={() => toggleList(suppliers, supplier.id, (next) => set("suppliers", next))}
          />
        ))}
      </div>
      <div style={{ borderTop: "1px solid #2a2a2a", margin: "18px 0 0", paddingTop: 14 }}>
        <button style={darkLink}>Import parts using a CSV file instead</button>
      </div>

      <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", margin: "26px 0 10px" }}>Who are the manufacturers you work with?</div>
      <div style={{ display: "grid", gap: 10 }}>
        {MANUFACTURER_CATALOG.map((manufacturer) => (
          <ManufacturerCard
            key={manufacturer.id}
            manufacturer={manufacturer}
            connectedShorts={connectedShorts}
            selected={manufacturers.includes(manufacturer.id)}
            onToggle={() => toggleList(manufacturers, manufacturer.id, (next) => set("manufacturers", next))}
          />
        ))}
      </div>
      <Footer>
        <Btn disabled={!suppliers.length || !manufacturers.length} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

function SupplierCard({ supplier, selected, onToggle }) {
  return (
    <button onClick={onToggle} style={darkOption(selected)}>
      <span style={radioMark(selected)}>{selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#111" }} />}</span>
      <BrandTile label={supplier.short} tone={supplier.tone} />
      <span style={{ flex: 1, fontSize: 16, fontWeight: 850, color: "#f4f4f4" }}>{supplier.id}</span>
    </button>
  );
}

function ManufacturerCard({ manufacturer, connectedShorts, selected, onToggle }) {
  return (
    <button onClick={onToggle} style={darkOption(selected)}>
      <BrandTile label={manufacturer.short} tone={manufacturer.tone} filled />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15.5, fontWeight: 850, color: "#f4f4f4" }}>{manufacturer.id}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap", fontSize: 12, fontWeight: 800 }}>
          {manufacturer.carriers.map((short, index) => (
            <React.Fragment key={short}>
              {index > 0 && <span style={{ color: "#5a5a5a" }}>·</span>}
              <span style={{ color: connectedShorts.includes(short) ? "#d8d8d8" : "#6b6b6b" }}>{short}</span>
            </React.Fragment>
          ))}
        </span>
      </span>
      <span style={checkBox(selected)}>{selected && "✓"}</span>
    </button>
  );
}

function BrandTile({ label, tone, filled = false, size = 40 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 10, flexShrink: 0,
      background: filled ? tone : "#fff",
      border: `1px solid ${filled ? tone : "#e5e7eb"}`,
      color: filled ? "#fff" : tone,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: label.length > 3 ? 10 : 12, fontWeight: 950, letterSpacing: "-0.02em",
    }}>{label}</span>
  );
}

function CatalogScreen({ data, set, onBack, onNext }) {
  const migrationPath = data.currentSystem && data.currentSystem !== "Starting fresh";
  const materials = listOf(data.materials);
  const manufacturers = listOf(data.manufacturers);
  return (
    <Question
      group="Catalog and pricing"
      title={migrationPath ? `Bring over products from ${data.currentSystem}` : "What materials do you work with?"}
      subtitle={migrationPath ? "Review the catalog Zuper found before it appears in your first estimate." : ""}
      onBack={onBack}
    >
      {migrationPath ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }} className="lh-grid-2">
            <Metric label="Products" value="184" /><Metric label="Groups" value="14" /><Metric label="Price rows" value="612" />
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            <Warning text="12 items have missing labor notes. Zuper will keep them for review." />
            <Warning text="6 product names look duplicated and can be merged later." />
          </div>
          <Footer><Btn onClick={onNext} IconR={ArrowRight}>Start migration</Btn></Footer>
        </>
      ) : (
        <>
          <MultiSelectGroup label="Materials" options={MATERIALS} selected={materials} onToggle={(value) => toggleList(materials, value, (next) => set("materials", next))} />
          <MultiSelectGroup label="Manufacturers" options={MANUFACTURERS} selected={manufacturers} onToggle={(value) => toggleList(manufacturers, value, (next) => set("manufacturers", next))} />
          <Footer><Btn disabled={!materials.length || !manufacturers.length} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
        </>
      )}
    </Question>
  );
}

function CPQImportScreen({ data, set, onBack, onNext }) {
  const completeWithFile = (file) => {
    if (!file) return;
    set("cpqFileName", file.name);
    set("cpqSkipped", false);
  };
  const skip = () => {
    set("cpqFileName", "");
    set("cpqSkipped", true);
    onNext();
  };
  return (
    <Question group="Catalog and pricing" title="Intelligent quoting" subtitle="Upload an existing proposal so Zuper can learn your proposal structure, line items, and quoting style. You can skip this and finish it later." onBack={onBack}>
      <div style={darkPanel}>
        <div style={cardTitle}>Existing proposal</div>
        <label style={uploadZone}>
          <UploadIcon />
          <span>{data.cpqFileName || "Drop a PDF, DOCX, XLSX, XLS, or CSV file, or click to browse"}</span>
          <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => completeWithFile(e.target.files?.[0])} />
        </label>
        <div style={{ color: "#9a9a9a", fontSize: 13, lineHeight: 1.45, marginTop: 12 }}>
          Zuper will use this to create starter products, service masters, price rows, and quoting templates.
        </div>
      </div>
      <Footer>
        <button onClick={skip} style={darkLink}>Skip this step</button>
        <Btn disabled={!data.cpqFileName} onClick={onNext} IconR={ArrowRight}>Continue</Btn>
      </Footer>
    </Question>
  );
}

function InviteScreen({ data, set, onBack, onNext }) {
  const teammates = listOf(data.teammates);
  const addTeammate = () => {
    const email = textOf(data.invitedEmail).trim();
    if (!email) return;
    set("teammates", [...teammates, { email, role: data.invitedRole || "Sales" }]);
    set("invitedEmail", "");
  };
  const removeTeammate = (index) => {
    set("teammates", teammates.filter((_, i) => i !== index));
  };
  return (
    <Question group="People and delivery" title="Invite teammates" subtitle="Add anyone who should help with sales, inspections, production, dispatch, or finance. This is optional." onBack={onBack}>
      <div style={{ ...darkPanel, marginBottom: 18, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "#f1f1f1", fontSize: 13.5, fontWeight: 850 }}>You</div>
          <div style={{ color: "#9a9a9a", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{textOf(data.email) || "Workspace owner"}</div>
        </div>
        <select value={data.role || "Admin"} onChange={(e) => set("role", e.target.value)} style={{ ...darkInput, width: "auto", minWidth: 140 }}>
          {INVITE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr", gap: 12 }} className="lh-grid-2">
        <DarkField label="Email" value={data.invitedEmail} onChange={(v) => set("invitedEmail", v)} placeholder="teammate@roofingco.com" />
        <label style={{ display: "block" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#ddd", marginBottom: 8 }}>Role</div>
          <select value={data.invitedRole} onChange={(e) => set("invitedRole", e.target.value)} style={darkInput}>
            {INVITE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <Btn variant="secondary" disabled={!textOf(data.invitedEmail).trim()} onClick={addTeammate}>Add teammate</Btn>
        <button onClick={() => set("invitedEmail", "")} style={darkLink}>Clear</button>
      </div>
      {teammates.length > 0 && (
        <div style={{ ...darkPanel, marginTop: 16, display: "grid", gap: 8 }}>
          {teammates.map((member, index) => (
            <div key={`${member.email}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", borderBottom: index < teammates.length - 1 ? "1px solid #303030" : "none", paddingBottom: index < teammates.length - 1 ? 8 : 0 }}>
              <div>
                <div style={{ color: "#f1f1f1", fontSize: 13.5, fontWeight: 850 }}>{member.email}</div>
                <div style={{ color: "#9a9a9a", fontSize: 12 }}>{member.role}</div>
              </div>
              <button onClick={() => removeTeammate(index)} style={darkMutedLink}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <Footer><Btn onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function PlatformQuestionsScreen({ data, set, onBack, onNext }) {
  const integrations = listOf(data.integrations);
  const toggleIntegration = (value) => {
    if (value === "None yet") {
      set("integrations", integrations.includes("None yet") ? [] : ["None yet"]);
      return;
    }
    const withoutNone = integrations.filter((item) => item !== "None yet");
    toggleList(withoutNone, value, (next) => set("integrations", next));
  };
  return (
    <Question group="Platforms" title="Which platforms should connect to Zuper?" subtitle="Tell us about finance, CRM, and communication tools so the workspace starts with the right extension plan." onBack={onBack}>
      <MultiSelectGroup label="Integrations" options={PLATFORM_INTEGRATIONS} selected={integrations} onToggle={toggleIntegration} />
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>Do you have an existing communication platform?</div>
        <div style={{ display: "grid", gap: 10 }}>
          {COMMUNICATION_PLATFORMS.map((platform) => (
            <DarkOption key={platform} selected={data.communicationPlatform === platform} onClick={() => set("communicationPlatform", platform)} title={platform} />
          ))}
        </div>
      </div>
      <Footer><Btn disabled={!integrations.length || !data.communicationPlatform} onClick={onNext} IconR={ArrowRight}>Continue</Btn></Footer>
    </Question>
  );
}

function RecapScreen({ data, bucket, onBack, onCreateJob }) {
  const services = listOf(data.services);
  const suppliers = listOf(data.suppliers);
  const manufacturers = listOf(data.manufacturers);
  const integrations = listOf(data.integrations);
  const workflow = listOf(data.workflow);
  const teammates = listOf(data.teammates);
  const categories = jobDefaultTreeFor(data, bucket);
  const flow = workflow.length ? workflow : workflowFor(bucket, data);
  const stats = [
    [categories.length, categories.length === 1 ? "Job category" : "Job categories"],
    [flow.length, "Workflow stages"],
    [manufacturers.length, manufacturers.length === 1 ? "Manufacturer" : "Manufacturers"],
    [suppliers.length + integrations.filter((item) => item !== "None yet").length, "Connections"],
  ];
  const recap = [
    { icon: Inbox, label: "Work setup", value: [services.join(", ") || bucket.label, data.insuranceMode, businessHoursLabel(data)].filter(Boolean).join(" · ") },
    { icon: RefreshCcw, label: "Workflow", value: flow.join(" → ") },
    { icon: Package, label: "Inventory", value: [
      suppliers.length ? `${suppliers.join(", ")} connected` : "No suppliers connected",
      manufacturers.length ? manufacturers.join(", ") : "",
    ].filter(Boolean).join(" · ") },
    { icon: FileText, label: "Catalog and pricing", value: [
      data.currentSystem && data.currentSystem !== "Starting fresh" ? `Imported from ${data.currentSystem}` : "",
      data.proposalPath === "Upload" ? "Proposal from upload" : data.proposalPath === "Template" ? `${data.proposalTemplate} proposal` : "Proposal not added yet",
      data.cpqFileName ? `Intelligent quoting: ${data.cpqFileName}` : data.cpqSkipped ? "Intelligent quoting saved for later" : "",
    ].filter(Boolean).join(" · ") },
    { icon: Zap, label: "Platforms", value: [integrations.join(", "), data.communicationPlatform, data.sourceName || data.currentSystem].filter(Boolean).join(" · ") },
    { icon: Users, label: "People and delivery", value: [
      `You as ${data.role || "Admin"}`,
      teammates.length ? teammates.map((member) => `${member.email} as ${member.role}`).join(", ") : "no teammates invited yet",
    ].join(" · ") },
  ];
  return (
    <Question
      title="Onboarding successful"
      subtitle="Zuper has preloaded your workspace from your answers. Review the configuration before you set up your first job."
      onBack={onBack}
    >
      <div style={successPill}><CheckCircle2 size={15} /> Setup complete</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "16px 0 18px" }}>
        {stats.map(([value, label]) => (
          <div key={label} style={recapStatCard}>
            <div style={{ fontSize: 24, fontWeight: 950, color: "#f4f4f4", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8f8f8f", marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {recap.map((row) => <RecapCard key={row.label} icon={row.icon} label={row.label} value={row.value || "Ready"} />)}
      </div>
      <Footer><Btn size="lg" onClick={onCreateJob} IconR={ArrowRight}>Go to your workspace</Btn></Footer>
    </Question>
  );
}

function RecapCard({ icon: RowIcon, label, value }) {
  return (
    <div style={recapCard}>
      <span style={recapIconTile}><RowIcon size={17} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#8f8f8f", textTransform: "uppercase", letterSpacing: ".09em" }}>{label}</div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: "#f1f1f1", lineHeight: 1.5, marginTop: 5, wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>
  );
}

function SourceConnectionScreen({ data, set, bucket, connectionState, setConnectionState, onBack, onNext }) {
  return (
    <ShellCard width={880}>
      <Back onClick={onBack} />
      <GroupHeader active="Platforms" />
      <h1 style={h1}>Connect your first lead source</h1>
      <p style={p}>Zuper requires attribution before a source can go live.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="lh-grid-2">
        <div>
          <LeadSourceForm data={data} set={set} connectionState={connectionState} setConnectionState={setConnectionState} />
          <Footer><Btn disabled={!sourceFieldsOk(data)} onClick={onNext} IconR={ArrowRight}>Activate source</Btn></Footer>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: T.textMut, textTransform: "uppercase", marginBottom: 10 }}>Zuper defaults</div>
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{bucket.label}</div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7 }}>{bucket.leadSourceCategories.map((s) => <Pill key={s}>{s}</Pill>)}</div>
            <div style={{ marginTop: 14 }}>{bucket.leadStages.map((stage, i) => <TrackerDot key={stage} label={stage} active={i < 2} />)}</div>
          </div>
        </div>
      </div>
    </ShellCard>
  );
}

function LeadSourceForm({ data, set, connectionState, setConnectionState }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <DarkField label="Source name" value={data.sourceName} onChange={(v) => set("sourceName", v)} placeholder="Google Local Services" />
      <DarkField label="Average cost per lead" value={data.costPerLead} onChange={(v) => set("costPerLead", v)} placeholder="85" type="number" />
      <DarkField label="Attribution identifier" value={data.attributionId} onChange={(v) => set("attributionId", v)} placeholder="SuperConnect number" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn variant={connectionState === "happy" ? "primary" : "secondary"} onClick={() => setConnectionState("happy")}>Demo happy path</Btn>
        <Btn variant={connectionState === "friction" ? "primary" : "secondary"} onClick={() => setConnectionState("friction")}>Demo friction path</Btn>
      </div>
      <ConnectionStatus state={connectionState} />
    </div>
  );
}

function ConnectionStatus({ state }) {
  const failed = state === "friction";
  return (
    <div style={{ background: "#fff", border: `1px solid ${failed ? "#F3C783" : T.border}`, borderRadius: 14, padding: 14 }}>
      {["Webhook URL", "Send test lead", "Source is live"].map((step, i) => {
        const isFail = failed && i === 1;
        const done = !failed || i === 0;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
            {isFail ? <AlertTriangle size={17} color={T.amber} /> : done ? <CheckCircle2 size={17} color={T.green} /> : <Circle size={17} color={T.textMut} />}
            <span style={{ fontSize: 13.5, fontWeight: 700, color: isFail ? T.amber : done ? T.text : T.textSec }}>{isFail ? "Test lead not received within 60 seconds" : step}</span>
          </div>
        );
      })}
      {failed && (
        <div style={{ marginTop: 10, background: T.amberBg, borderRadius: 10, padding: 12, color: T.amber, fontSize: 13.5, lineHeight: 1.45 }}>
          This usually means the webhook URL was pasted incorrectly, or the test was not sent from the source.
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <SmallAction icon={Copy}>Verify URL</SmallAction>
            <SmallAction icon={RefreshCcw}>Retry test</SmallAction>
            <SmallAction icon={LifeBuoy}>Get help from CS</SmallAction>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationRows({ source, connectionState, setConnectionState }) {
  return (
    <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
      {["Website form", "Call tracking"].map((name, i) => (
        <div key={name} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }} className="lh-grid-2">
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{name}</div>
            <code style={{ display: "block", marginTop: 5, fontSize: 12, color: T.textSec, wordBreak: "break-all" }}>https://hooks.zuper.test/{source.toLowerCase()}/{i + 1}/lead</code>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => navigator.clipboard?.writeText(`https://hooks.zuper.test/${source.toLowerCase()}/${i + 1}/lead`)} IconL={Copy}>Copy URL</Btn>
            <Btn variant="secondary" onClick={() => setConnectionState(connectionState === "happy" ? "friction" : "happy")}>Test connection</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrialScreen({ firstName, onBack, onNext }) {
  return (
    <CenteredShell title={`Zuper is ready${firstName ? `, ${firstName}` : ""}.`} subtitle="14-day free trial, no credit card required. Open your workspace and create the first job.">
      <Back onClick={onBack} />
      <Btn size="lg" onClick={onNext} IconR={ArrowRight}>Open Zuper</Btn>
    </CenteredShell>
  );
}

function LeadProduct({ data, bucket, onExit }) {
  return <SetupDashboard data={data} bucket={bucket} onExit={onExit} />;
}

function SetupDashboard({ data, bucket, onExit }) {
  const actions = setupActionsFor(data, bucket);
  const companyName = data.companyName || "Zuper workspace";
  const ownerName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Account owner";
  const completed = actions.filter((action) => action.state === "Ready").length;
  const pct = Math.max(50, Math.round((completed / Math.max(actions.length, 1)) * 100));

  return (
    <div className="lh-product" style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", minHeight: "100vh", background: "#f7f7f5", color: T.text }}>
      <aside className="lh-sidebar" style={{ background: "#fff", borderRight: `1px solid ${T.border}`, minHeight: "100vh", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <LogoMark name={companyName} src={data.logo} size={42} radius={12} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{companyName}</div>
            <div style={{ fontSize: 12.5, color: T.textSec }}>{ownerName}</div>
          </div>
        </div>
        {["Home", "Jobs", "Catalog", "Integrations", "Settings"].map((item, i) => <NavItem key={item} label={item} active={i === 0} />)}
        <div style={{ marginTop: 28, borderTop: `1px solid ${T.borderSoft}`, paddingTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: T.textMut, textTransform: "uppercase", marginBottom: 10 }}>Setup groups</div>
          {ONBOARDING_GROUPS.map((group) => <div key={group} style={{ fontSize: 13.5, color: T.textSec, fontWeight: 750, padding: "7px 0" }}>{group}</div>)}
        </div>
      </aside>
      <main style={{ minWidth: 0, padding: "28px 36px 96px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, marginBottom: 56 }}>
          <div style={{ fontSize: 13, color: T.textSec, fontWeight: 850 }}>Zuper setup</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ border: "none", background: "transparent", color: T.text, fontSize: 14, fontWeight: 850, cursor: "pointer" }}>Help and feedback</button>
            {onExit && <Btn variant="secondary" onClick={onExit} IconL={X}>Exit</Btn>}
          </div>
        </header>
        <section style={{ maxWidth: 920, margin: "0 auto" }}>
          <h1 style={{ fontSize: 42, lineHeight: 1.08, fontWeight: 950, color: "#171717", margin: 0, textAlign: "center" }}>Finish setting up Zuper</h1>
          <p style={{ fontSize: 18, lineHeight: 1.45, color: "#4b5563", margin: "18px auto 36px", maxWidth: 700, textAlign: "center" }}>
            We have preloaded the configurations based on your preferences. Before you can set up your first job, review below.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {actions.map((action) => (
              <div key={action.title} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: 22, display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 18, alignItems: "center", boxShadow: "0 1px 2px rgba(17,17,17,.03)" }} className="lh-grid-2">
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: action.accentBg, color: action.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 950, fontSize: 13 }}>{action.initials}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 16.5, color: T.text, fontWeight: 900 }}>{action.title}</div>
                    <span style={{ borderRadius: 20, background: action.state === "Ready" ? T.greenBg : T.brandBg, color: action.state === "Ready" ? T.green : T.brand, padding: "3px 8px", fontSize: 11, fontWeight: 900 }}>{action.state}</span>
                  </div>
                  <div style={{ marginTop: 5, color: T.textSec, fontSize: 14, lineHeight: 1.4 }}>{action.body}</div>
                </div>
                <Btn variant="secondary">{action.cta}</Btn>
              </div>
            ))}
          </div>
        </section>
        <div style={{ position: "fixed", right: 72, bottom: 34, background: "#161616", color: "#fff", borderRadius: 999, padding: "16px 24px", fontSize: 19, fontWeight: 900, boxShadow: "0 12px 34px rgba(0,0,0,.24)" }}>
          Onboarding | {pct}% Complete
        </div>
      </main>
    </div>
  );
}

function LeadDetail({ lead, bucket, onQualify }) {
  if (!lead) return null;
  const stageIndex = Math.max(0, bucket.leadStages.indexOf(lead.status));
  return (
    <aside style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, alignSelf: "start" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: T.textSec }}>{lead.ref}</div>
      <h2 style={{ fontSize: 21, fontWeight: 900, margin: "6px 0 4px", color: T.text }}>{lead.customer}</h2>
      <p style={{ fontSize: 14, color: T.textSec, margin: 0 }}>{lead.title}</p>
      <div style={{ marginTop: 18, fontSize: 12, fontWeight: 900, color: T.textMut, textTransform: "uppercase" }}>Pizza tracker</div>
      <div style={{ marginTop: 10 }}>{bucket.leadStages.map((stage, i) => <TrackerDot key={stage} label={i === stageIndex ? `${stage} - current` : stage} active={i <= stageIndex} />)}</div>
      <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
        <Info label="Next step" value={lead.next} />
        <Info label="Cost per lead" value={`$${lead.cost}`} />
        <Info label="Source" value={lead.source} />
      </div>
      <Footer><Btn onClick={onQualify} IconR={ArrowRight}>Mark qualified</Btn></Footer>
    </aside>
  );
}

function HandoffCard({ type, onClose }) {
  const copy = {
    sales: ["Lead qualified. Inspection scheduled for Thursday 10:00 AM.", "View in Sales Hub"],
    production: ["Contract signed. Production can prep materials and crew.", "View in Production Hub"],
    finance: ["Job completed. Invoice draft is ready for review.", "View in Finance Hub"],
  }[type];
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${T.green}`, borderRadius: 14, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }} className="lh-grid-2">
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: T.text }}>{copy[0]}</div>
        <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>Staying in the Zuper workspace is the default path.</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" onClick={onClose}>Back to pipeline</Btn>
        <Btn onClick={onClose}>{copy[1]}</Btn>
      </div>
    </div>
  );
}

function BehaviorPrompt({ type, onClose }) {
  const copy = {
    technician: ["First job created", "Invite a technician so field updates can flow back into Zuper."],
    completion: ["Job marked complete", "Turn on completion messages to keep customers updated automatically."],
    followup: ["Proposal sent", "Add automated follow-up so warm customers do not go quiet."],
    scheduling: ["Ten jobs created", "Add scheduling rules so crews and dispatch stay aligned."],
  }[type];
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${T.brand}`, borderRadius: 14, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }} className="lh-grid-2">
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: T.text }}>{copy[0]}</div>
        <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>{copy[1]}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" onClick={onClose}>Later</Btn>
        <Btn onClick={onClose}>Turn on</Btn>
      </div>
    </div>
  );
}

function CenteredShell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 20px" }}>
      <div className="su" style={{ width: "100%", maxWidth: 620, textAlign: "center" }}>
        <ZuperLeadMark />
        <h1 style={h1}>{title}</h1>
        <p style={{ ...p, margin: "12px auto 28px" }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function Question({ title, subtitle, onBack, group, children }) {
  return (
    <ShellCard width={520}>
      {onBack && <Back onClick={onBack} />}
      {group && <GroupHeader active={group} />}
      <h1 style={h1}>{title}</h1>
      {subtitle && <p style={p}>{subtitle}</p>}
      <div style={{ marginTop: 24 }}>{children}</div>
    </ShellCard>
  );
}

function GroupHeader({ active }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
      {ONBOARDING_GROUPS.map((group) => {
        const selected = group === active;
        return (
          <span key={group} style={groupPill(selected)}>
            {group}
          </span>
        );
      })}
    </div>
  );
}

function ShellCard({ width = 640, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 20px" }}>
      <div className="su lh-shell" style={{ width: "100%", maxWidth: 1320, minHeight: 760, borderRadius: 20, border: "1px solid #242424", background: "#171717", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(360px, .9fr)", overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,.45)" }}>
        <div style={{ padding: "86px 72px 68px", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", maxWidth: width, flex: 1 }}>{children}</div>
        </div>
        <OnboardingPreview />
      </div>
    </div>
  );
}

function PathCard({ title, body, cta, onClick }) {
  return (
    <button onClick={onClick} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, textAlign: "left", cursor: "pointer" }}>
      <div style={{ fontSize: 17, fontWeight: 900, color: T.text }}>{title}</div>
      <div style={{ fontSize: 14, color: T.textSec, lineHeight: 1.45, marginTop: 8 }}>{body}</div>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: T.brand, marginTop: 18 }}>{cta} {"->"}</div>
    </button>
  );
}

function Footer({ children }) {
  return <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 28, flexWrap: "wrap" }}>{children}</div>;
}

function Back({ onClick }) {
  return <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#a1a1a1", fontSize: 14, cursor: "pointer", marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>;
}

function ExitButton({ onClick }) {
  return <button onClick={onClick} style={{ position: "fixed", top: 18, right: 22, zIndex: 60, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 20, padding: "7px 13px", color: T.textSec, cursor: "pointer", fontSize: 13, fontWeight: 700 }}><X size={14} style={{ verticalAlign: -2 }} /> Exit</button>;
}

function Metric({ label, value }) {
  return <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }}><div style={{ fontSize: 12, fontWeight: 900, color: T.textSec, textTransform: "uppercase" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 900, color: T.text, marginTop: 8 }}>{value}</div></div>;
}

function Warning({ text }) {
  return <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: T.amberBg, border: "1px solid #F3C783", color: T.amber, borderRadius: 12, padding: 12, fontSize: 13.5 }}><AlertTriangle size={17} /> {text}</div>;
}

function Banner({ text }) {
  return <div style={{ background: T.greenBg, color: T.green, border: "1px solid #B9E6C5", borderRadius: 14, padding: "12px 16px", fontSize: 14, fontWeight: 800, marginBottom: 16 }}>{text}</div>;
}

function NavItem({ label, active }) {
  return <div style={{ padding: "10px 12px", borderRadius: 10, background: active ? T.brandBg : "transparent", color: active ? T.brand : T.textSec, fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{label}</div>;
}

function Pill({ children }) {
  return <span style={{ display: "inline-flex", alignItems: "center", width: "fit-content", borderRadius: 20, padding: "3px 8px", background: T.canvas, color: T.textSec, fontSize: 12, fontWeight: 800, marginLeft: 4 }}>{children}</span>;
}

function StatusPill({ children }) {
  return <span style={{ display: "inline-flex", width: "fit-content", borderRadius: 20, padding: "4px 9px", background: T.brandBg, color: T.brand, fontSize: 12, fontWeight: 900 }}>{children}</span>;
}

function Score({ value }) {
  return <span style={{ fontSize: 13, fontWeight: 900, color: value > 85 ? T.green : value > 70 ? T.brand : T.amber }}>{value}</span>;
}

function Info({ label, value }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}><span style={{ color: T.textSec }}>{label}</span><strong style={{ color: T.text }}>{value}</strong></div>;
}

function InfoDark({ label, value }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}><span style={{ color: "#9a9a9a" }}>{label}</span><strong style={{ color: "#f1f1f1", textAlign: "right" }}>{value}</strong></div>;
}

function TrackerDot({ label, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: active ? T.brand : "#fff", border: `2px solid ${active ? T.brand : T.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}</span>
      <span style={{ fontSize: 13.5, color: active ? T.text : T.textSec, fontWeight: active ? 800 : 600 }}>{label}</span>
    </div>
  );
}

function SmallAction({ icon: IconComp, children }) {
  return <button style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #E8B767", background: "#fff", color: T.amber, borderRadius: 8, padding: "7px 9px", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}><IconComp size={14} /> {children}</button>;
}

function DarkField({ label, value, onChange, placeholder, type = "text", maxLength }) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ fontSize: 13, fontWeight: 800, color: "#d8d8d8", marginBottom: 8 }}>{label}</div>}
      <input
        value={value}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={darkInput}
      />
    </label>
  );
}

function DarkSelect({ label, value, options, onChange }) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ fontSize: 13, fontWeight: 800, color: "#d8d8d8", marginBottom: 8 }}>{label}</div>}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={darkInput}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function DarkOption({ selected, onClick, title, desc }) {
  return (
    <button onClick={onClick} style={darkOption(selected)}>
      <span style={radioMark(selected)}>{selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#111" }} />}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 16, fontWeight: 850, color: "#f4f4f4" }}>{title}</span>
        {desc && <span style={{ display: "block", fontSize: 12.5, color: "#9a9a9a", marginTop: 3 }}>{desc}</span>}
      </span>
    </button>
  );
}

function MultiSelectGroup({ label, options, selected, onToggle }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button key={option} onClick={() => onToggle(option)} style={chipButton(active)}>
              <span style={checkBox(active)}>{active && "✓"}</span>{option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FoundItem({ children }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#e7e7e7", fontSize: 13.5 }}><CheckCircle2 size={16} color={T.green} />{children}</div>;
}

function UploadIcon() {
  return <span style={{ width: 30, height: 30, borderRadius: 8, background: "#2a2a2a", color: "#eee", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>+</span>;
}

function PreviewText({ value, width = 140, size = 14, dim = false }) {
  if (!value) return <span style={{ ...skeletonLine(width), height: Math.max(8, size - 2), marginTop: size <= 12 ? 2 : 0 }} />;
  return <span style={{ display: "block", color: dim ? "#777" : "#efefef", fontSize: size, fontWeight: dim ? 700 : 850, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>;
}

function SkeletonCircle({ size = 36, radius = "50%" }) {
  return <span style={{ width: size, height: size, borderRadius: radius, background: "#242424", border: "1px solid #303030", flexShrink: 0 }} />;
}

function OnboardingPreview() {
  const { data, bucket, migration, selectedHub, wizardStep, mode } = useContext(PreviewContext);
  const services = listOf(data.services);
  const materials = listOf(data.materials);
  const manufacturers = listOf(data.manufacturers);
  const integrations = listOf(data.integrations);
  const workflow = listOf(data.workflow);
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const companyName = data.companyName;
  const hub = selectedHub ? HUBS.find((item) => item.id === selectedHub) : null;
  const flow = workflow.length ? workflow : data.workType ? workflowFor(bucket || bucketForWorkType(data.workType), data) : [];
  const products = data.currentSystem && data.currentSystem !== "Starting fresh"
    ? [`From ${data.currentSystem}`, "Products", "Pricing"]
    : [...materials, ...manufacturers].filter(Boolean).slice(0, 4);
  const setupChips = [
    ...services,
    data.insuranceMode,
    businessHoursLabel(data),
    ...products,
    data.cpqFileName ? `Intelligent quoting: ${data.cpqFileName}` : data.cpqSkipped ? "Intelligent quoting later" : "",
    ...integrations,
    data.communicationPlatform,
  ].filter(Boolean).slice(0, 9);
  const proposal = data.proposalPath === "Upload" ? "Uploaded proposal" : data.proposalPath === "Template" ? `${data.proposalTemplate} proposal` : "Proposal not added";
  const workSetupReady = Boolean(services.length && data.insuranceMode);
  const previewPanel = panelForStep(mode, wizardStep, data);
  const previewRows = [
    { label: "Owner", value: fullName, tag: data.role },
    { label: "Work setup", value: services[0] || (data.workType ? bucket?.label : ""), tag: data.insuranceMode || businessHoursLabel(data) },
    { label: "Platforms", value: integrations.join(", ") || data.communicationPlatform || data.sourceName || data.followup, tag: data.costPerLead ? `$${data.costPerLead}/lead` : data.currentSystem },
    { label: "Workflow", value: flow.length ? "Generated defaults" : "", tag: flow.length ? `${flow.length} stages` : "" },
  ];
  return (
    <div className="lh-shell-preview" style={{ position: "relative", minHeight: 760, background: "linear-gradient(90deg, #1e1e1e, #111)", borderLeft: "1px solid #242424", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "22%", top: 170, width: 620, height: 620, borderRadius: 18, background: "#080808", border: "1px solid #1f1f1f", opacity: .86 }}>
        <div style={{ height: 64, borderBottom: "1px solid #1d1d1d", display: "flex", alignItems: "center", gap: 14, padding: "0 24px" }}>
          {companyName || data.logo ? <LogoMark name={companyName} src={data.logo} size={36} radius={10} /> : <SkeletonCircle size={36} radius={10} />}
          <div style={{ minWidth: 0 }}>
            <PreviewText value={companyName} width={190} size={18} />
            <PreviewText value={hub?.label || ""} width={82} size={12} dim />
          </div>
          <span style={{ marginLeft: "auto", color: "#111", background: "#eee", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 900 }}>Live preview</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", height: "calc(100% - 64px)" }}>
          <div style={{ borderRight: "1px solid #1d1d1d", paddingTop: 18, display: "grid", justifyItems: "center", alignContent: "start", gap: 18 }}>
            {[Inbox, FileText, Users, Receipt].map((IconComp, i) => <IconComp key={i} size={20} color={i === 0 ? "#eee" : "#5f5f5f"} />)}
          </div>
          <div>
            <div style={{ padding: 18, borderBottom: "1px solid #1d1d1d" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, background: "#151515", border: "1px solid #222", padding: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: fullName ? "#2b2b2b" : "#202020", color: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{fullName ? fullName[0] : ""}</div>
                <div style={{ minWidth: 0 }}>
                  <PreviewText value={fullName} width={150} size={14} />
                  <PreviewText value={data.role} width={90} size={12} dim />
                </div>
              </div>
            </div>
            {previewRows.map((row, index) => (
              <div key={row.label} style={{ padding: "18px 22px", borderBottom: "1px solid #1d1d1d" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: index === 0 ? T.brand : "#2a2a2a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>{row.label.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <PreviewText value={row.value} width={180 - index * 18} size={14} />
                    <div style={{ color: "#777", fontSize: 12 }}>{row.label}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  {row.tag ? <span style={{ borderRadius: 20, background: index % 2 ? "#ffe7a3" : "#ead4ff", color: "#111", padding: "4px 9px", fontSize: 11, fontWeight: 900 }}>{row.tag}</span> : <span style={{ ...skeletonLine(64), height: 20 }} />}
                </div>
              </div>
            ))}
            <div style={{ padding: "18px 22px" }}>
              {previewPanel === "calendar" ? (
                <CalendarPreview data={data} />
              ) : previewPanel === "work" && workSetupReady ? (
                <DefaultsTreePreview data={data} bucket={bucket} />
              ) : previewPanel === "proposal" ? (
                <ProposalStylePreview data={data} products={products} proposal={proposal} />
              ) : previewPanel === "quoting" ? (
                <IntelligentQuotingPreview data={data} products={products} />
              ) : previewPanel === "catalog" ? (
                <CatalogPreview data={data} products={products} proposal={proposal} />
              ) : previewPanel === "platforms" ? (
                <PlatformsPreview data={data} integrations={integrations} />
              ) : previewPanel === "people" ? (
                <PeoplePreview data={data} />
              ) : (
                <>
                  <div style={{ color: "#777", fontSize: 12, fontWeight: 850, textTransform: "uppercase", marginBottom: 10 }}>Generated setup</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {setupChips.length ? setupChips.map((item) => <span key={item} style={previewChip}>{item}</span>) : <span style={{ ...skeletonLine(92), height: 24 }} />}
                    {data.proposalPath ? <span style={previewChip}>{proposal}</span> : <span style={{ ...skeletonLine(110), height: 24 }} />}
                    {listOf(data.teammates).map((member) => <span key={member.email} style={previewChip}>{member.role}: {member.email}</span>)}
                    {migration?.complete && <span style={previewChip}>Migrated leads</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultsTreePreview({ data, bucket }) {
  const tree = jobDefaultTreeFor(data, bucket);
  const services = listOf(data.services);
  const workflow = listOf(data.workflow);
  const completed = [
    services.length > 0,
    Boolean(data.insuranceMode),
    Boolean(data.businessHours),
    data.followup || workflow.length,
  ].filter(Boolean).length;
  const pct = 40 + completed * 15;
  return (
    <div style={previewTreeCard}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 9 }}>
        <div>
          <div style={{ color: "#1f2937", fontSize: 13, fontWeight: 900 }}>Job categories</div>
          <div style={{ color: "#6b7280", fontSize: 11.5, fontWeight: 750, marginTop: 3 }}>Generated from work setup</div>
        </div>
        <span style={{ color: "#0f172a", background: "#dff7f3", borderRadius: 20, padding: "4px 8px", fontSize: 11, fontWeight: 900 }}>{Math.min(100, pct)}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 20, background: "#edf2f7", overflow: "hidden", marginBottom: 14 }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", borderRadius: 20, background: "linear-gradient(90deg, #35d399, #f97316)" }} />
      </div>
      <div style={{ display: "grid", gap: 2 }}>
        {tree.map((item, index) => (
          <CategoryTreeNode key={item.category} item={item} expanded={index < 4} />
        ))}
      </div>
    </div>
  );
}

function CategoryTreeNode({ item, expanded }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <div style={treeNodeRow}>
        <span style={{ color: "#64748b", width: 12, fontSize: 11 }}>{expanded ? "⌄" : "›"}</span>
        <span style={{ ...treeColor, background: item.color }} />
        <span style={{ color: "#111827", fontSize: 12.5, fontWeight: 850, flex: 1 }}>{item.category}</span>
        <span style={{ color: "#64748b", fontSize: 10.5, fontWeight: 800 }}>{item.duration}</span>
      </div>
      {expanded && (
        <div style={treeChildRail}>
          {item.statuses.slice(0, 5).map((status) => (
            <div key={status} style={treeStatusRow}>
              <span style={{ color: "#94a3b8", fontSize: 11 }}>▢</span>
              <span style={statusChip(status)}>{status}</span>
            </div>
          ))}
          {item.statuses.length > 5 && (
            <div style={treeStatusRow}>
              <span style={{ color: "#94a3b8", fontSize: 11 }}>▢</span>
              <span style={moreStatusChip}>+{item.statuses.length - 5} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarPreview({ data }) {
  const label = businessHoursLabel(data) || "Select business hours";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activeDays = data.businessHours === "24/7 emergency coverage"
    ? days
    : data.businessHours === "Monday-Saturday"
      ? days.slice(0, 6)
      : days.slice(0, 5);
  const hours = data.businessHours === "24/7 emergency coverage"
    ? "Open 24 hours"
    : data.businessHours === "Weekdays, 7 AM-6 PM"
      ? "7 AM - 6 PM"
      : data.businessHours === "Monday-Saturday"
        ? "8 AM - 5 PM"
        : data.businessHours === "Set hours manually"
          ? `${data.businessHoursStart || "8:00 AM"} - ${data.businessHoursEnd || "5:00 PM"}`
          : "8 AM - 5 PM";

  return (
    <div style={previewTreeCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={previewPanelTitle}>Business hours</div>
          <div style={{ color: "#64748b", fontSize: 11.5, fontWeight: 750 }}>{label}</div>
        </div>
        <span style={{ background: "#fee8d7", color: "#c2410c", borderRadius: 20, padding: "4px 8px", fontSize: 10.5, fontWeight: 950 }}>Calendar</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 12 }}>
        {days.map((day) => {
          const active = activeDays.includes(day);
          return (
            <div key={day} style={{ minHeight: 54, borderRadius: 8, border: `1px solid ${active ? "#fed7aa" : "#e5e7eb"}`, background: active ? "#fff7ed" : "#f1f5f9", padding: 6 }}>
              <div style={{ color: active ? "#9a3412" : "#94a3b8", fontSize: 10, fontWeight: 950, marginBottom: 7 }}>{day}</div>
              {active ? <div style={{ height: 24, borderRadius: 5, background: "#fd5000", opacity: .9 }} /> : <div style={{ height: 24, borderRadius: 5, background: "#e2e8f0" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#334155", fontSize: 12, fontWeight: 850 }}><span>Dispatch window</span><span>{hours}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 11.5, fontWeight: 750 }}><span>Emergency coverage</span><span>{data.businessHours === "24/7 emergency coverage" ? "Always available" : "Configure later"}</span></div>
      </div>
    </div>
  );
}

function ProposalStylePreview({ data, products, proposal }) {
  const template = data.proposalTemplate || (data.proposalPath === "Upload" ? "Uploaded" : "Detailed");
  const companyName = data.companyName || "Your company";
  const services = listOf(data.services);
  const rows = (services.length ? services : products.length ? products : ["Roof replacement", "Underlayment", "Cleanup"]).slice(0, 4);
  return (
    <div style={{ ...previewTreeCard, padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={previewPanelTitle}>Preview: {template} proposal</div>
        <span style={{ color: "#475569", background: "#e2e8f0", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 850 }}>Recommended</span>
      </div>
      <div style={proposalPage}>
        <div style={proposalHero}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,.85), rgba(253,80,0,.18))" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark name={companyName} src={data.logo} size={26} radius={7} />
            <div>
              <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 950 }}>{companyName}</div>
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 9.5, fontWeight: 750 }}>{proposal}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "15px 18px" }}>
          <div style={{ color: "#111827", fontSize: 18, lineHeight: 1.05, fontWeight: 950, marginBottom: 8 }}>Project proposal</div>
          <div style={{ color: "#64748b", fontSize: 10.5, lineHeight: 1.35, marginBottom: 12 }}>Customer summary, scope, materials, pricing, and approval details.</div>
          <div style={{ display: "grid", gap: 7 }}>
            {rows.map((row, index) => (
              <div key={row} style={{ display: "grid", gridTemplateColumns: "1fr 42px", gap: 8, alignItems: "center", borderBottom: "1px solid #edf2f7", paddingBottom: 6 }}>
                <div style={{ color: "#334155", fontSize: 10.5, fontWeight: 850 }}>{row}</div>
                <div style={{ height: 7, borderRadius: 20, background: index === 0 ? "#fd5000" : "#cbd5e1" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, borderRadius: 8, border: "1px solid #e2e8f0", padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#111827", fontSize: 11.5, fontWeight: 950 }}><span>Estimated total</span><span>$18,450</span></div>
            <div style={{ height: 24, borderRadius: 6, background: "#111827", marginTop: 9 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function IntelligentQuotingPreview({ data, products }) {
  const rows = (products.length ? products : ["Labor rates", "Material groups", "Proposal sections"]).slice(0, 4);
  return (
    <div style={previewTreeCard}>
      <div style={previewPanelTitle}>Intelligent quoting</div>
      <TreeLeaf label={data.cpqFileName ? `Proposal uploaded: ${data.cpqFileName}` : "Upload an existing proposal"} muted={!data.cpqFileName} />
      <TreeBranch label="Zuper will prepare" open>
        {["Service masters", "Price rows", "Proposal sections", ...rows].slice(0, 6).map((item) => <TreeLeaf key={item} label={item} muted={!data.cpqFileName} />)}
      </TreeBranch>
    </div>
  );
}

function CatalogPreview({ data, products, proposal }) {
  const suppliers = listOf(data.suppliers);
  const manufacturers = listOf(data.manufacturers);
  return (
    <div style={previewTreeCard}>
      <div style={previewPanelTitle}>Inventory and catalog</div>
      <TreeBranch label="Parts catalog" open>
        {(suppliers.length ? suppliers : ["No suppliers connected"]).map((item) => (
          <TreeLeaf key={item} label={item} muted={!suppliers.length} />
        ))}
        {(manufacturers.length ? manufacturers : ["No manufacturers selected"]).map((item) => (
          <TreeLeaf key={item} label={item} muted={!manufacturers.length} />
        ))}
      </TreeBranch>
      <TreeLeaf label={data.proposalPath ? proposal : "Proposal template"} muted={!data.proposalPath} />
      <TreeBranch label="Products and services" open>
        {(products.length ? products : ["Price list"]).map((item) => <TreeLeaf key={item} label={item} />)}
      </TreeBranch>
      <TreeLeaf label={data.cpqFileName ? `Intelligent quoting: ${data.cpqFileName}` : data.cpqSkipped ? "Intelligent quoting skipped" : "Intelligent quoting"} muted={!data.cpqFileName && !data.cpqSkipped} />
    </div>
  );
}

function PlatformsPreview({ data, integrations }) {
  return (
    <div style={previewTreeCard}>
      <div style={previewPanelTitle}>Platforms</div>
      <TreeBranch label="Integrations" open>
        {(integrations.length ? integrations : ["QBO", "HubSpot"]).map((item) => <TreeLeaf key={item} label={item} muted={!integrations.length} />)}
      </TreeBranch>
      <TreeLeaf label={data.communicationPlatform || "Communication platform"} muted={!data.communicationPlatform} />
    </div>
  );
}

function PeoplePreview({ data }) {
  const teammates = listOf(data.teammates);
  return (
    <div style={previewTreeCard}>
      <div style={previewPanelTitle}>People and delivery</div>
      <TreeLeaf
        label={`${[data.firstName, data.lastName].filter(Boolean).join(" ") || "Account owner"} · ${data.role || "Admin"}`}
        muted={!data.firstName}
      />
      <TreeBranch label="Teammates" open>
        {(teammates.length ? teammates : [{ email: "No teammates invited yet", role: "" }]).map((member) => (
          <TreeLeaf key={member.email} label={member.role ? `${member.email} · ${member.role}` : member.email} muted={!teammates.length} />
        ))}
      </TreeBranch>
    </div>
  );
}

function TreeBranch({ label, open, children }) {
  return (
    <div style={{ padding: "5px 0" }}>
      <div style={treeNodeRow}>
        <span style={{ color: "#64748b", width: 12, fontSize: 11 }}>{open ? "⌄" : "›"}</span>
        <span style={{ color: "#334155", fontSize: 12.5, fontWeight: 850 }}>{label}</span>
      </div>
      {open && <div style={treeChildRail}>{children}</div>}
    </div>
  );
}

function TreeLeaf({ label, muted = false }) {
  return (
    <div style={treeStatusRow}>
      <span style={{ color: "#94a3b8", fontSize: 11 }}>▢</span>
      <span style={{ color: muted ? "#94a3b8" : "#334155", fontSize: 11.5, fontWeight: 750 }}>{label}</span>
    </div>
  );
}

function ZuperLeadMark() {
  return <div style={{ width: 48, height: 48, borderRadius: 14, background: T.brand, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 12px 32px rgba(253,80,0,0.28)" }}><Zap size={26} fill="#fff" /></div>;
}

function workflowFor(bucket, data) {
  if (!bucket) return ["Lead", "Inspection", "Proposal", "Approved", "Production", "Completed"];
  if (bucket.id === "insuranceRoofing") return ["Storm lead", "Inspection", "Claim review", "Proposal", "Repair", "Completed"];
  if (bucket.id === "smallCrewCommercial") return ["Inquiry", "Site visit", "Proposal", "Approved", "Crew scheduled", "Completed"];
  if (data.workType === "both") return ["Lead", "Inspection", "Proposal", "Approved", "Production", "Completed"];
  return ["Lead", "Inspection", "Proposal", "Approved", "Production", "Completed"];
}

function jobDefaultTreeFor(data, bucket) {
  const services = listOf(data.services);
  const insurance = data.insuranceMode === "Insurance work" || data.insuranceMode === "Both" || bucket?.id === "insuranceRoofing";
  const categories = [
    { category: "Lead", duration: "15m", color: "#6d4bff", statuses: ["New", "Lead qualification", "Lead qualified", "Lead not qualified"] },
    { category: "Inspection", duration: "2h", color: "#00a96b", statuses: ["New", "Schedule confirmed", "On my way", "Arrived on site"] },
  ];
  if (insurance) {
    categories.push({ category: "Claims", duration: "2h", color: "#e11d48", statuses: ["Claim not filed", "Claim filed", "Schedule adjuster", "Appointment scheduled"] });
  }
  if (services.includes("Roof replacement") || services.includes("Commercial roofing") || data.workType) {
    categories.push({ category: "Production", duration: "1d", color: "#2563eb", statuses: ["New", "Pre production", "Scheduled", "Ready to build"] });
  }
  if (services.includes("Gutters")) {
    categories.push({ category: "Gutter replacement", duration: "1d", color: "#2f63e7", statuses: ["New", "Production intake", "Scheduled", "On my way"] });
  }
  if (services.includes("Roof repair") || services.includes("Skylights")) {
    categories.push({ category: "Repair service", duration: "1d", color: "#22c55e", statuses: ["New", "Scheduled confirmed", "On my way", "Started"] });
  }
  categories.push({ category: "ROM estimate", duration: "15m", color: "#db2777", statuses: ["New", "Assumptions", "Generate proposal", "Proposal sent"] });
  return categories.slice(0, 6);
}

function inferWorkTypeFromSetup(services, insuranceMode) {
  if (insuranceMode === "Insurance work") return "insurance";
  if (listOf(services).includes("Commercial roofing")) return "commercial";
  return "residential";
}

function businessHoursLabel(data) {
  if (data.businessHours !== "Set hours manually") return data.businessHours;
  return `${data.businessHoursStart || "8:00 AM"}-${data.businessHoursEnd || "5:00 PM"}`;
}

function setupActionsFor(data, bucket) {
  const tree = jobDefaultTreeFor(data, bucket);
  const integrations = listOf(data.integrations).filter((item) => item !== "None yet");
  const suppliers = supplierIntegrationsFor(data);
  const communication = data.communicationPlatform && data.communicationPlatform !== "No existing platform" ? [data.communicationPlatform] : [];
  const actions = [
    {
      title: "Review job categories and statuses",
      body: `${tree.length} job categories were created from your services, coverage, and business hours.`,
      state: "Ready",
      cta: "Review",
      initials: "JS",
      accent: "#6d4bff",
      accentBg: "#ede9fe",
    },
    {
      title: "Review checklists",
      body: `Starter checklists were added to each of the ${tree.length} job categories so every crew captures the same steps on site.`,
      state: "Ready",
      cta: "Review",
      initials: "CL",
      accent: "#0891b2",
      accentBg: "#cffafe",
    },
    {
      title: "Review inspections",
      body: "Inspection templates were generated from your services and coverage, ready to run before a proposal goes out.",
      state: "Ready",
      cta: "Review",
      initials: "IN",
      accent: "#c2410c",
      accentBg: "#ffedd5",
    },
    {
      title: "Review tasks",
      body: "Default tasks are attached to each job stage so scheduling, ordering, and follow-up stay on track.",
      state: "Ready",
      cta: "Review",
      initials: "TK",
      accent: "#4f46e5",
      accentBg: "#e0e7ff",
    },
    ...integrations.map((name) => ({
      title: `Connect ${name}`,
      body: `${name} was selected during onboarding. Connect it when you are ready to sync records with Zuper.`,
      state: name === "QBO" ? "Ready" : "To configure",
      cta: "Configure",
      initials: initialsFor(name),
      accent: "#2563eb",
      accentBg: "#dbeafe",
    })),
    ...suppliers.map((name) => ({
      title: `Connect ${name}`,
      body: `${name} matches the roofing materials and manufacturer choices from onboarding.`,
      state: "To configure",
      cta: "Configure",
      initials: initialsFor(name),
      accent: "#059669",
      accentBg: "#d1fae5",
    })),
    ...communication.map((name) => ({
      title: `Connect ${name}`,
      body: "Use this communication platform for notifications, customer messages, and internal updates.",
      state: "To configure",
      cta: "Configure",
      initials: initialsFor(name),
      accent: "#7c3aed",
      accentBg: "#ede9fe",
    })),
    {
      title: data.cpqFileName ? "Review intelligent quoting" : "Upload proposal for intelligent quoting",
      body: data.cpqFileName
        ? `${data.cpqFileName} is ready to be reviewed before quote templates go live.`
        : "Upload an existing proposal later so Zuper can build starter quoting templates.",
      state: data.cpqFileName ? "Ready" : "To configure",
      cta: "Configure",
      initials: "IQ",
      accent: "#fd5000",
      accentBg: "#fff0e8",
    },
  ];
  if (!integrations.length) {
    // Keep the four generated-defaults review cards grouped at the top.
    actions.splice(4, 0, {
      title: "Connect accounting",
      body: "Add QBO or another finance system from Integrations when the accounting team is ready.",
      state: "To configure",
      cta: "Configure",
      initials: "AC",
      accent: "#2563eb",
      accentBg: "#dbeafe",
    });
  }
  return actions;
}

function supplierIntegrationsFor(data) {
  // The inventory step asks directly, so prefer what was picked there.
  const chosen = listOf(data.suppliers);
  if (chosen.length) return chosen;
  const text = [...listOf(data.services), ...listOf(data.materials), ...listOf(data.manufacturers)].join(" ").toLowerCase();
  const suppliers = [];
  if (/roof|shingle|gutter|gaf|certainteed|owens|tamko|atlas/.test(text)) suppliers.push("SRS Distribution");
  if (/roof|shingle|gutter|gaf|certainteed|owens|iko|atlas/.test(text)) suppliers.push("ABC Supply");
  return suppliers;
}

function initialsFor(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "IN";
}

function panelForStep(mode, step, data) {
  if (mode !== "wizard") return "work";
  if (step === 0) return "work";
  if (step === 1) return "catalog";
  if (step === 2) return listOf(data.services).length ? "work" : "summary";
  if (step === 3) return "people";
  if (step === 4) return "proposal";
  if (step === 5) return "platforms";
  if (step === 6) return "catalog";
  return "summary";
}

function inferProfileFromWebsite(rawUrl) {
  const host = normalizeWebsiteHost(rawUrl);
  const name = titleFromHost(host);
  const lower = host.toLowerCase();
  const services = lower.includes("commercial")
    ? ["Commercial roofing", "Roof repair", "Gutters"]
    : lower.includes("storm") || lower.includes("claim")
      ? ["Storm damage", "Roof repair", "Roof replacement"]
      : ["Roof replacement", "Roof repair", "Gutters"];
  const workType = lower.includes("commercial") ? "commercial" : lower.includes("storm") || lower.includes("claim") ? "insurance" : "residential";
  const insuranceMode = lower.includes("storm") || lower.includes("claim") ? "Insurance work" : "Non-insurance work";
  return {
    name,
    services,
    workType,
    insuranceMode,
    logo: host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : null,
  };
}

function normalizeWebsiteHost(rawUrl) {
  const value = rawUrl.trim();
  if (!value) return "";
  try {
    return new URL(value.match(/^https?:\/\//) ? value : `https://${value}`).hostname.replace(/^www\./, "");
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

function titleFromHost(host) {
  const base = host.split(".")[0] || "Roofing Company";
  const spaced = base
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\broofing\b/gi, " Roofing")
    .trim();
  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "Roofing Company";
}

function toggleList(list, value, commit) {
  commit(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
}

function listOf(value) {
  return Array.isArray(value) ? value : [];
}

function textOf(value) {
  return typeof value === "string" ? value : "";
}

function sourceFieldsOk(data) {
  return Boolean(textOf(data.sourceName).trim() && String(data.costPerLead ?? "").trim() && textOf(data.attributionId).trim());
}

function progressFor(mode, step, data) {
  if (mode === "hub") return 38;
  if (mode.startsWith("migration")) return mode === "migration-source" ? 38 : mode === "migration-preview" ? 58 : 78;
  if (mode === "wizard") {
    const total = isMigrating(data) ? MIGRATION_STEP_COUNT : WIZARD_STEP_COUNT;
    return Math.min(96, 14 + Math.round((step * 82) / (total - 1)));
  }
  return 100;
}

function firstNameFromEmail(email) {
  const local = textOf(email).split("@")[0] || "";
  const word = local.split(/[._\-+0-9]+/).filter(Boolean)[0] || "";
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "";
}

const h1 = { fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 900, color: "#f4f4f4", margin: 0 };
const p = { fontSize: 15.5, color: "#9c9c9c", lineHeight: 1.55, marginTop: 10, maxWidth: 660 };
const softNote = { marginTop: 14, background: T.amberBg, border: "1px solid #F3C783", color: T.amber, borderRadius: 12, padding: 12, fontSize: 13.5, lineHeight: 1.45 };
const groupPill = (active) => ({ display: "inline-flex", alignItems: "center", minHeight: 25, borderRadius: 20, border: `1px solid ${active ? "#f4f4f4" : "#333"}`, background: active ? "#f4f4f4" : "#1d1d1d", color: active ? "#111" : "#9a9a9a", padding: "4px 9px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" });
const hubTile = (active) => ({
  minHeight: 142,
  background: active ? "#222" : "#181818",
  border: `1.5px solid ${active ? "#e8e8e8" : "#303030"}`,
  borderRadius: 14,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  cursor: "pointer",
  textAlign: "left",
  boxShadow: active ? "0 12px 30px rgba(253,80,0,0.12)" : "none",
});
const darkInput = {
  width: "100%",
  minHeight: 48,
  borderRadius: 11,
  border: "1px solid #383838",
  background: "#232323",
  color: "#f2f2f2",
  padding: "11px 14px",
  outline: "none",
  fontSize: 15,
};
const uploadButton = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 38, borderRadius: 10, border: "1px solid #3a3a3a", background: "#232323", color: "#f2f2f2", padding: "0 12px", fontSize: 13.5, fontWeight: 850, cursor: "pointer", whiteSpace: "nowrap" };
const previewChip = { display: "inline-flex", width: "fit-content", borderRadius: 20, background: "#242424", color: "#d8d8d8", padding: "5px 9px", fontSize: 11.5, fontWeight: 850 };
const previewTreeCard = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, boxShadow: "0 14px 34px rgba(0,0,0,.18)" };
const previewPanelTitle = { color: "#111827", fontSize: 13, fontWeight: 900, marginBottom: 8 };
const proposalPage = { border: "1px solid #cbd5e1", background: "#fff", borderRadius: 3, overflow: "hidden", minHeight: 328, boxShadow: "0 12px 24px rgba(15,23,42,.12)" };
const proposalHero = { position: "relative", minHeight: 118, padding: 16, background: "repeating-linear-gradient(135deg, #1f2937 0, #1f2937 10px, #111827 10px, #111827 20px)" };
const treeNodeRow = { display: "flex", alignItems: "center", gap: 7, minHeight: 24 };
const treeChildRail = { marginLeft: 19, paddingLeft: 10, borderLeft: "1px solid #e2e8f0", display: "grid", gap: 5, marginTop: 3 };
const treeStatusRow = { display: "flex", alignItems: "center", gap: 7, minHeight: 21 };
const treeRow = { border: "1px solid #272727", background: "#141414", borderRadius: 10, padding: 10 };
const treeColor = { width: 9, height: 9, borderRadius: 2, marginTop: 3 };
const statusBranch = { position: "relative", display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8, paddingLeft: 11, borderLeft: "1px solid #343434" };
const statusChip = (status) => {
  const lower = status.toLowerCase();
  const bg = lower.includes("new") ? "#d7f8ed" : lower.includes("qual") || lower.includes("scheduled") || lower.includes("filed") || lower.includes("proposal") ? "#dff7f3" : lower.includes("not") ? "#f7dddd" : lower.includes("way") || lower.includes("site") ? "#d9efff" : lower.includes("assumption") ? "#f0e4fa" : "#e5e7eb";
  const color = lower.includes("new") ? "#00966d" : lower.includes("not") ? "#b42318" : lower.includes("way") || lower.includes("site") ? "#1473c9" : lower.includes("assumption") ? "#9446b3" : "#334155";
  return { display: "inline-flex", width: "fit-content", maxWidth: 118, borderRadius: 5, background: bg, color, padding: "3px 6px", fontSize: 10, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
};
const moreStatusChip = { display: "inline-flex", width: "fit-content", borderRadius: 5, background: "#e5e7eb", color: "#64748b", padding: "3px 6px", fontSize: 10, fontWeight: 900 };
const skeletonLine = (width) => ({ display: "inline-block", width, borderRadius: 20, background: "#303030" });
const darkPanel = { border: "1px solid #303030", background: "#1d1d1d", borderRadius: 14, padding: 16 };
const cardTitle = { fontSize: 15, fontWeight: 900, color: "#f4f4f4", marginBottom: 10 };
const uploadZone = { border: "1px dashed #4a4a4a", background: "#181818", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12, color: "#dcdcdc", cursor: "pointer" };
const loopRail = { display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" };
const loopPill = { borderRadius: 20, padding: "6px 10px", fontSize: 12, fontWeight: 900 };
const flowBox = { position: "relative", border: "1px solid #3b3b3b", background: "#252525", color: "#f1f1f1", borderRadius: 12, padding: "10px 12px", fontSize: 13.5, fontWeight: 850 };
const miniRemove = { marginLeft: 8, border: "none", background: "#3a3a3a", color: "#ddd", borderRadius: 8, cursor: "pointer" };
const hintRow = { display: "flex", alignItems: "flex-start", gap: 8, color: "#9a9a9a", fontSize: 13, lineHeight: 1.45, maxWidth: 520 };
const sectionLabel = { fontSize: 13, fontWeight: 850, color: "#d8d8d8", marginBottom: 10 };
const emailCard = { width: 600, maxWidth: "100%", margin: "0 auto", background: "#ffffff", borderRadius: 12, overflow: "hidden", boxShadow: "0 12px 40px rgba(25,25,25,.08)" };
const emailStepDot = { flex: "0 0 24px", height: 24, borderRadius: 999, background: "#FD5000", color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" };
const emailCta = { display: "inline-block", background: "#FD5000", color: "#fff", border: "none", fontWeight: 700, fontSize: 16, padding: "15px 34px", borderRadius: 8, cursor: "pointer" };
const summaryChip = { display: "inline-flex", alignItems: "center", border: "1px solid #333", background: "#232323", color: "#e2e2e2", borderRadius: 20, padding: "6px 12px", fontSize: 12.5, fontWeight: 800 };
const fetchSpinner = { width: 16, height: 16, borderRadius: "50%", border: "2px solid #333", borderTopColor: "#8f8f8f", animation: "lh-spin .7s linear infinite", flexShrink: 0, display: "inline-block" };
const systemCard = (active) => ({ display: "flex", alignItems: "center", gap: 14, width: "100%", minHeight: 74, borderRadius: 12, border: `1px solid ${active ? "#e5e5e5" : "#303030"}`, background: active ? "#242424" : "#171717", padding: "12px 16px", cursor: "pointer", textAlign: "left" });
const systemLogoTile = { width: 46, height: 46, borderRadius: 10, background: "#fff", border: "1px solid #e5e7eb", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", padding: 6 };
const successPill = { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(26,122,60,.18)", border: "1px solid rgba(52,168,95,.45)", color: "#7ee2a2", borderRadius: 999, padding: "7px 14px", fontSize: 12.5, fontWeight: 900 };
const recapStatCard = { flex: "1 1 118px", border: "1px solid #2a2a2a", background: "#1a1a1a", borderRadius: 12, padding: "14px 15px" };
const recapCard = { display: "grid", gridTemplateColumns: "36px 1fr", gap: 14, alignItems: "start", border: "1px solid #2a2a2a", background: "#1a1a1a", borderRadius: 12, padding: "14px 16px" };
const recapIconTile = { width: 36, height: 36, borderRadius: 10, background: "#242424", border: "1px solid #333", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#e8e8e8", flexShrink: 0 };
const heroPill = { position: "absolute", top: 22, left: 26, display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(17,17,17,.62)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: 999, padding: "8px 16px", fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" };
const darkLink = { border: "none", background: "transparent", color: "#dcdcdc", cursor: "pointer", fontSize: 14, fontWeight: 800 };
const darkMutedLink = { border: "none", background: "transparent", color: "#8a8a8a", cursor: "pointer", fontSize: 14, fontWeight: 800 };
const darkOption = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  minHeight: 56,
  borderRadius: 12,
  border: `1px solid ${active ? "#e5e5e5" : "#303030"}`,
  background: active ? "#242424" : "#171717",
  padding: "12px 16px",
  cursor: "pointer",
  textAlign: "left",
});
const radioMark = (active) => ({ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${active ? "#f4f4f4" : "#444"}`, background: active ? "#f4f4f4" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 });
const chipButton = (active) => ({ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${active ? "#e6e6e6" : "#333"}`, background: active ? "#252525" : "#171717", color: "#f1f1f1", borderRadius: 12, padding: "10px 13px", cursor: "pointer", fontSize: 14, fontWeight: 800 });
const checkBox = (active) => ({ width: 20, height: 20, borderRadius: 6, background: active ? "#f1f1f1" : "transparent", color: "#111", border: `1px solid ${active ? "#f1f1f1" : "#444"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 });
const choiceTile = (active) => ({ border: `1px solid ${active ? "#eee" : "#333"}`, background: active ? "#282828" : "#171717", color: "#f4f4f4", borderRadius: 12, padding: "16px 12px", cursor: "pointer", fontWeight: 900 });
