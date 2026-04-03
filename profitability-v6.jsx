import React, { useState, useMemo, forwardRef, useRef, useEffect, Fragment } from "react";

const Table = forwardRef(({ style, ...props }, ref) => (
  <table ref={ref} style={{ captionSide: "bottom", fontSize: 14, ...style }} {...props} />
));
const TableHeader = forwardRef((props, ref) => (
  <thead ref={ref} {...props} />
));
const TableBody = forwardRef((props, ref) => (
  <tbody ref={ref} {...props} />
));
const TableRow = forwardRef(({ style, hoverBg = true, ...props }, ref) => {
  const [hovered, setHovered] = useState(false);
  return (
    <tr ref={ref}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: "1px solid #e8e7e2", transition: "background 0.15s", background: hoverBg && hovered ? "rgba(249,249,247,0.5)" : undefined, ...style }}
      {...props} />
  );
});
const TableHead = forwardRef(({ style, ...props }, ref) => (
  <th ref={ref} style={{ height: 36, textAlign: "left", verticalAlign: "middle", fontWeight: 500, color: "#8c8b86", ...style }} {...props} />
));
const TableCell = forwardRef(({ style, ...props }, ref) => (
  <td ref={ref} style={{ verticalAlign: "middle", ...style }} {...props} />
));

const ALL_PARTS = [
  { id: "TO-001", name: "Tear-off — existing 2-layer roof", type: "SVC", group: "Tear-off & disposal", qty: 28, unit: "sq", unitCost: 45, unitPrice: 210, billable: true, notes: "Entire existing roof to be removed down to decking. Two layers confirmed during inspection.", thumb: "tearoff", description: "Complete removal of existing 2-layer asphalt roof down to deck sheathing", sku: "SVC-TEAR-2L" },
  { id: "TO-002", name: "Dumpster rental — 30 yd", type: "EQ", group: "Tear-off & disposal", qty: 2, unit: "ea", unitCost: 425, unitPrice: 1050, billable: true, notes: null, thumb: "dumpster", description: "30-yard roll-off dumpster for roofing debris", sku: "EQ-DUMP-30" },
  { id: "TO-003", name: "Dump fees & haul-away", type: "SVC", group: "Tear-off & disposal", qty: 1, unit: "lot", unitCost: 680, unitPrice: 1680, billable: true, notes: null, thumb: "truck", description: "Disposal and transport fees for roofing waste", sku: "SVC-HAUL-01" },
  { id: "RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", group: "Roofing materials", qty: 31, unit: "sq", unitCost: 112, unitPrice: 385, billable: true, notes: "3 squares overage for waste/cuts.", thumb: "shingle", pricelist: "Preferred Contractor Rates", financing: "6-month installment", description: "Architectural laminate shingle, Charcoal colorway, lifetime warranty", sku: "GAF-HDZ-CHAR" },
  { id: "RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", group: "Roofing materials", qty: 10, unit: "roll", unitCost: 64, unitPrice: 195, billable: true, notes: null, thumb: "roll", pricelist: "Preferred Contractor Rates", description: "High-traction synthetic roof underlayment, 10 sq per roll", sku: "UND-FB-10SQ" },
  { id: "RF-103", name: "Ice & water shield — 36 in", type: "MAT", group: "Roofing materials", qty: 6, unit: "roll", unitCost: 95, unitPrice: 305, billable: true, notes: "Valleys, eaves, and around all penetrations.", thumb: "roll", pricelist: "Preferred Contractor Rates", description: "Self-adhering waterproofing membrane, 36\" wide", sku: "IWS-36-SA" },
  { id: "RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", group: "Roofing materials", qty: 4, unit: "box", unitCost: 42, unitPrice: 115, billable: true, notes: null, thumb: "nails", description: "Hot-dipped galvanized coil nails for pneumatic nailer", sku: "NL-COIL-125G" },
  { id: "RF-105", name: "Starter strip shingles", type: "MAT", group: "Roofing materials", qty: 8, unit: "bdl", unitCost: 28, unitPrice: 88, billable: true, notes: null, thumb: "shingle", description: "Pre-cut starter strip for eave and rake edges", sku: "SH-START-01" },
  { id: "FL-201", name: "Drip edge — aluminum, white", type: "MAT", group: "Flashing & trim", qty: 24, unit: "pc", unitCost: 8.5, unitPrice: 30, billable: true, notes: null, thumb: "drip", description: "Type D aluminum drip edge, white finish, 10 ft", sku: "FL-DRIP-WH" },
  { id: "FL-202", name: "Step flashing — 4×4 galv", type: "MAT", group: "Flashing & trim", qty: 50, unit: "pc", unitCost: 1.75, unitPrice: 7.5, billable: true, notes: null, thumb: "flash", description: "Pre-bent galvanized step flashing, 4×4 in", sku: "FL-STEP-4G" },
  { id: "FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", group: "Flashing & trim", qty: 3, unit: "ea", unitCost: 12, unitPrice: 52, billable: true, notes: null, thumb: "boot", financing: "6-month installment", description: "Neoprene pipe boot flashing for 2\" vent pipe", sku: "FL-BOOT-2N" },
  { id: "FL-204", name: "Chimney flashing kit — lead/alum", type: "MAT", group: "Flashing & trim", qty: 1, unit: "kit", unitCost: 185, unitPrice: 775, billable: true, notes: "Two-piece counter-flashing. Cricket to be rebuilt.", thumb: "chimney", description: "Two-piece lead/aluminum chimney flashing kit with cricket", sku: "FL-CHIM-KIT" },
  { id: "VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", group: "Ventilation", qty: 10, unit: "pc", unitCost: 18, unitPrice: 65, billable: true, notes: null, thumb: "vent", description: "Low-profile shingle-over ridge vent, 4 ft section", sku: "VN-RIDGE-4" },
  { id: "VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", group: "Ventilation", qty: 6, unit: "ea", unitCost: 14, unitPrice: 56, billable: true, notes: "Verify 1:150 NFA ratio.", thumb: "vent", description: "Under-eave aluminum soffit vent, 8×16 in", sku: "VN-SOFF-816" },
  { id: "MS-401", name: "Permit & final inspection", type: "SVC", group: "Misc & inspection", qty: 1, unit: "ea", unitCost: 350, unitPrice: 0, billable: false, notes: null, thumb: "permit", description: "Building permit and municipal final inspection fee", sku: null },
  { id: "MS-402", name: "Tarps & exterior protection", type: "MAT", group: "Misc & inspection", qty: 1, unit: "lot", unitCost: 120, unitPrice: 0, billable: false, notes: "Home exterior and driveway protection during tear-off.", thumb: "tarp", description: "Protective tarps for landscaping, driveway, and siding", sku: null },
];
const ALL_LABOR = [
  { id: "LAB-01", name: "Crew labor — tear-off (4 crew)", hours: 14, rate: 48, total: 2688 },
  { id: "LAB-02", name: "Crew labor — install (4 crew)", hours: 20, rate: 48, total: 3840 },
  { id: "LAB-03", name: "Foreman", hours: 8, rate: 65, total: 520 },
];
const ALL_EXPENSES = [
  { id: "EXP-01", name: "Dumpster overage charge", category: "Disposal", date: "Oct 18, 2024", amount: 275, receipt: true, notes: "Extra haul for second dumpster load" },
  { id: "EXP-02", name: "Emergency tarp — storm delay", category: "Weather protection", date: "Oct 15, 2024", amount: 185, receipt: true, notes: null },
  { id: "EXP-03", name: "Chimney cricket lumber", category: "Materials", date: "Oct 17, 2024", amount: 142, receipt: true, notes: "2×4 and plywood for cricket rebuild" },
  { id: "EXP-04", name: "Crew fuel reimbursement", category: "Travel", date: "Oct 14, 2024", amount: 96, receipt: false, notes: null },
  { id: "EXP-05", name: "Permit expedite fee", category: "Permits", date: "Oct 10, 2024", amount: 75, receipt: true, notes: "Rush processing for city inspection" },
];
const ALL_COMMISSIONS = [
  { id: "COM-01", name: "Jake Morrison — sales", role: "Sales rep", rate: 8, basis: "revenue", amount: 2364.08 },
  { id: "COM-02", name: "Maria Chen — referral", role: "Referral partner", rate: 3, basis: "revenue", amount: 886.53 },
  { id: "COM-03", name: "Tom Bradley — project lead", role: "PM bonus", rate: 5, basis: "profit", amount: 669.63 },
];
const CATALOG_ITEMS = [
  // Tear-off & disposal
  { catalogId: "C-TO-001", name: "Tear-off — single layer", type: "SVC", group: "Tear-off & disposal", defaultUnit: "sq", defaultUnitCost: 38, defaultUnitPrice: 175, thumb: "tearoff", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-TO-002", name: "Tear-off — 2-layer roof", type: "SVC", group: "Tear-off & disposal", defaultUnit: "sq", defaultUnitCost: 45, defaultUnitPrice: 210, thumb: "tearoff", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-TO-003", name: "Dumpster rental — 20 yd", type: "EQ", group: "Tear-off & disposal", defaultUnit: "ea", defaultUnitCost: 325, defaultUnitPrice: 800, thumb: "dumpster", location: "Vendor", availability: "On request" },
  { catalogId: "C-TO-004", name: "Dumpster rental — 30 yd", type: "EQ", group: "Tear-off & disposal", defaultUnit: "ea", defaultUnitCost: 425, defaultUnitPrice: 1050, thumb: "dumpster", location: "Vendor", availability: "On request" },
  { catalogId: "C-TO-005", name: "Dump fees & haul-away", type: "SVC", group: "Tear-off & disposal", defaultUnit: "lot", defaultUnitCost: 680, defaultUnitPrice: 1680, thumb: "truck", location: "Vendor", availability: "In stock" },
  // Roofing materials
  { catalogId: "C-RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", group: "Roofing materials", defaultUnit: "sq", defaultUnitCost: 112, defaultUnitPrice: 385, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", group: "Roofing materials", defaultUnit: "roll", defaultUnitCost: 64, defaultUnitPrice: 195, thumb: "roll", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-103", name: "Ice & water shield — 36 in", type: "MAT", group: "Roofing materials", defaultUnit: "roll", defaultUnitCost: 95, defaultUnitPrice: 305, thumb: "roll", location: "Warehouse", availability: "Low stock" },
  { catalogId: "C-RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", group: "Roofing materials", defaultUnit: "box", defaultUnitCost: 42, defaultUnitPrice: 115, thumb: "nails", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-105", name: "Starter strip shingles", type: "MAT", group: "Roofing materials", defaultUnit: "bdl", defaultUnitCost: 28, defaultUnitPrice: 88, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-106", name: "Hip & ridge cap shingles", type: "MAT", group: "Roofing materials", defaultUnit: "bdl", defaultUnitCost: 34, defaultUnitPrice: 105, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-107", name: "Roofing cement — 10 oz tube", type: "MAT", group: "Roofing materials", defaultUnit: "ea", defaultUnitCost: 6, defaultUnitPrice: 18, thumb: "nails", location: "Job site", availability: "In stock" },
  // Flashing & trim
  { catalogId: "C-FL-201", name: "Drip edge — aluminum, white", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 8.5, defaultUnitPrice: 30, thumb: "drip", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-FL-202", name: "Step flashing — 4×4 galv", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 1.75, defaultUnitPrice: 7.5, thumb: "flash", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", group: "Flashing & trim", defaultUnit: "ea", defaultUnitCost: 12, defaultUnitPrice: 52, thumb: "boot", location: "Warehouse", availability: "Low stock" },
  { catalogId: "C-FL-204", name: "Chimney flashing kit — lead/alum", type: "MAT", group: "Flashing & trim", defaultUnit: "kit", defaultUnitCost: 185, defaultUnitPrice: 775, thumb: "chimney", location: "Vendor", availability: "On request" },
  { catalogId: "C-FL-205", name: "Valley flashing — W-style", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 14, defaultUnitPrice: 48, thumb: "flash", location: "Warehouse", availability: "In stock" },
  // Ventilation
  { catalogId: "C-VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", group: "Ventilation", defaultUnit: "pc", defaultUnitCost: 18, defaultUnitPrice: 65, thumb: "vent", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 14, defaultUnitPrice: 56, thumb: "vent", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-VN-303", name: "Turbine vent — 12 in", type: "MAT", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 35, defaultUnitPrice: 120, thumb: "vent", location: "Job site", availability: "In stock" },
  { catalogId: "C-VN-304", name: "Power attic fan — solar", type: "EQ", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 280, defaultUnitPrice: 650, thumb: "vent", location: "Vendor", availability: "On request" },
  // Gutters & drainage
  { catalogId: "C-GT-401", name: "Seamless gutter — 5 in aluminum", type: "MAT", group: "Gutters & drainage", defaultUnit: "ft", defaultUnitCost: 6, defaultUnitPrice: 18, thumb: "drip", location: "Vendor", availability: "In stock" },
  { catalogId: "C-GT-402", name: "Downspout — 2×3 aluminum", type: "MAT", group: "Gutters & drainage", defaultUnit: "pc", defaultUnitCost: 12, defaultUnitPrice: 38, thumb: "drip", location: "Vendor", availability: "In stock" },
  { catalogId: "C-GT-403", name: "Gutter guard — mesh, 4 ft", type: "MAT", group: "Gutters & drainage", defaultUnit: "pc", defaultUnitCost: 8, defaultUnitPrice: 24, thumb: "drip", location: "Warehouse", availability: "Low stock" },
  // Misc & inspection
  { catalogId: "C-MS-501", name: "Permit & final inspection", type: "SVC", group: "Misc & inspection", defaultUnit: "ea", defaultUnitCost: 350, defaultUnitPrice: 0, thumb: "permit", location: "Job site", availability: "In stock" },
  { catalogId: "C-MS-502", name: "Tarps & exterior protection", type: "MAT", group: "Misc & inspection", defaultUnit: "lot", defaultUnitCost: 120, defaultUnitPrice: 0, thumb: "tarp", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-MS-503", name: "Drone roof inspection", type: "SVC", group: "Misc & inspection", defaultUnit: "ea", defaultUnitCost: 150, defaultUnitPrice: 395, thumb: "permit", location: "Job site", availability: "On request" },
];
const CATALOG_GROUPS = [...new Set(CATALOG_ITEMS.map(i => i.group))];
const UNIT_LABELS = { sq: "sqft", ea: "item", roll: "roll", box: "box", bdl: "bundle", pc: "piece", kit: "kit", lot: "lot", ft: "ft" };

const CATALOG_BUNDLES = [
  {
    bundleId: "BDL-001",
    name: "Complete tear-off & replace",
    description: "Full roof tear-off with disposal, new shingles, underlayment, and fasteners",
    thumb: "tearoff",
    defaultUnitPrice: 8200,
    defaultUnitCost: 3480,
    items: [
      { catalogId: "C-TO-002", name: "Tear-off — 2-layer roof", type: "SVC", qty: 28, unit: "sq", unitCost: 45, unitPrice: 210 },
      { catalogId: "C-TO-004", name: "Dumpster rental — 30 yd", type: "EQ", qty: 1, unit: "ea", unitCost: 425, unitPrice: 1050 },
      { catalogId: "C-TO-005", name: "Dump fees & haul-away", type: "SVC", qty: 1, unit: "lot", unitCost: 680, unitPrice: 1680 },
      { catalogId: "C-RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", qty: 31, unit: "sq", unitCost: 112, unitPrice: 385 },
      { catalogId: "C-RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", qty: 10, unit: "roll", unitCost: 64, unitPrice: 195 },
      { catalogId: "C-RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", qty: 4, unit: "box", unitCost: 42, unitPrice: 115 },
    ],
  },
  {
    bundleId: "BDL-002",
    name: "Flashing & ventilation package",
    description: "Drip edge, step flashing, pipe boots, ridge vent, and soffit vents for a standard residential roof",
    thumb: "flash",
    defaultUnitPrice: 2840,
    defaultUnitCost: 695,
    items: [
      { catalogId: "C-FL-201", name: "Drip edge — aluminum, white", type: "MAT", qty: 24, unit: "pc", unitCost: 8.5, unitPrice: 30 },
      { catalogId: "C-FL-202", name: "Step flashing — 4×4 galv", type: "MAT", qty: 50, unit: "pc", unitCost: 1.75, unitPrice: 7.5 },
      { catalogId: "C-FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", qty: 3, unit: "ea", unitCost: 12, unitPrice: 52 },
      { catalogId: "C-VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", qty: 10, unit: "pc", unitCost: 18, unitPrice: 65 },
      { catalogId: "C-VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", qty: 6, unit: "ea", unitCost: 14, unitPrice: 56 },
    ],
  },
  {
    bundleId: "BDL-003",
    name: "Gutters & downspout kit",
    description: "Complete seamless gutter system with downspouts, hangers, and end caps for standard residential home",
    thumb: "drip",
    defaultUnitPrice: 3150,
    defaultUnitCost: 1240,
    items: [
      { catalogId: "C-GT-001", name: "Seamless gutter — 5 in aluminum", type: "MAT", qty: 140, unit: "ft", unitCost: 4.5, unitPrice: 12 },
      { catalogId: "C-GT-002", name: "Downspout — 2×3 in aluminum", type: "MAT", qty: 6, unit: "ea", unitCost: 28, unitPrice: 75 },
      { catalogId: "C-GT-003", name: "Gutter hanger — hidden", type: "MAT", qty: 45, unit: "ea", unitCost: 3.5, unitPrice: 9 },
      { catalogId: "C-GT-004", name: "End cap & outlet", type: "MAT", qty: 8, unit: "ea", unitCost: 6, unitPrice: 18 },
    ],
  },
];

const QUOTES = [
  { id: "Q-1041", name: "Original estimate", date: "Sep 14, 2024", status: "Approved", revenue: 28500, cogs: 16000, profit: 12500, materials: 8800, labor: 7200 },
  { id: "Q-1041-R1", name: "Rev 1 — chimney reflash", date: "Sep 22, 2024", status: "Approved", revenue: 30200, cogs: 16800, profit: 13400, materials: 9400, labor: 7400 },
  { id: "Q-1041-R2", name: "Rev 2 — HDZ upgrade", date: "Oct 3, 2024", status: "Sent", revenue: 31500, cogs: 17400, profit: 14100, materials: 10000, labor: 7400 },
];
const PRICELISTS = [
  { id: "default", name: "Standard pricing" },
  { id: "preferred", name: "Preferred customer" },
  { id: "insurance", name: "Insurance rate schedule" },
];
const FINANCING_OPTIONS = [
  { id: "none", name: "No financing" },
  { id: "net30", name: "Net 30" },
  { id: "net60", name: "Net 60" },
  { id: "installment3", name: "3-month installment" },
  { id: "installment6", name: "6-month installment" },
  { id: "installment12", name: "12-month installment" },
];

const $ = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (v) => (v * 100).toFixed(1) + "%";
const tn = { fontFeatureSettings: "'tnum'" };
const hexToRgb = (hex) => { const h = hex.replace("#", ""); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(","); };

function Thumb({ type }) {
  const s = 34;
  const sh = { width: s, height: s, flexShrink: 0, borderRadius: 6, overflow: "hidden", display: "block" };
  const c = { tearoff: ["#fde8e8","#c53030"], dumpster: ["#e8eef4","#4a6785"], truck: ["#e8eef4","#4a6785"], shingle: ["#f0ebe4","#8b6914"], roll: ["#eef0e8","#5a7040"], nails: ["#eae8ee","#5a5070"], drip: ["#e8eef4","#4a6785"], flash: ["#e8eef4","#4a6785"], boot: ["#f0ebe4","#6b5a40"], chimney: ["#f0ebe4","#8b5e3c"], vent: ["#e8f0ee","#3a6b5a"], permit: ["#f5f0e8","#8b7a50"], tarp: ["#eef0e8","#5a7040"] }[type] || ["#f0eeea","#8c8b86"];
  return (
    <svg style={sh} viewBox="0 0 34 34">
      <rect width="34" height="34" fill={c[0]} rx="6" />
      <circle cx="17" cy="17" r="7" fill={c[1]} opacity="0.2" />
      <circle cx="17" cy="17" r="3" fill={c[1]} opacity="0.35" />
    </svg>
  );
}

function Pill({ val, invert, delay = 0 }) {
  if (val === 0) return null;
  const good = invert ? val < 0 : val > 0;
  return (
    <span className="pill-enter" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: good ? "#dcfce7" : "#fee2e2", color: good ? "#166534" : "#991b1b", ...tn, animationDelay: `${delay}ms` }}>
      <span style={{ fontSize: 9 }}>{val > 0 ? "▲" : "▼"}</span>{$(val)}
    </span>
  );
}

// Strong ease-out curve matching cubic-bezier(0.23, 1, 0.32, 1)
function easeOutStrong(t) {
  return 1 - Math.pow(1 - t, 4);
}

function AnimatedValue({ value, duration = 600, delay = 0, prefix = "$", decimals = 2, style }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutStrong(progress);
        setDisplay(value * eased);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };
      rafId.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration, delay]);

  const formatted = prefix + Math.abs(display).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span style={style}>{formatted}</span>;
}

function AnimatedPct({ value, duration = 500, delay = 0, style }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutStrong(progress);
        setDisplay(value * eased);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };
      rafId.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration, delay]);

  return <span style={style}>{(display * 100).toFixed(1)}%</span>;
}

function PieChart({ data, size = 160, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  const cx = size / 2, cy = size / 2, outerR = size / 2 - 2, innerR = size / 2 - 30;
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const sa = cumAngle;
    cumAngle += angle;
    const ea = cumAngle;
    const large = angle > Math.PI ? 1 : 0;
    const outerStart = `${cx + outerR * Math.cos(sa)} ${cy + outerR * Math.sin(sa)}`;
    const outerEnd = `${cx + outerR * Math.cos(ea)} ${cy + outerR * Math.sin(ea)}`;
    const innerStart = `${cx + innerR * Math.cos(ea)} ${cy + innerR * Math.sin(ea)}`;
    const innerEnd = `${cx + innerR * Math.cos(sa)} ${cy + innerR * Math.sin(sa)}`;
    const path = `M ${outerStart} A ${outerR} ${outerR} 0 ${large} 1 ${outerEnd} L ${innerStart} A ${innerR} ${innerR} 0 ${large} 0 ${innerEnd} Z`;
    return { ...d, path, pct: ((d.value / total) * 100).toFixed(1), midAngle: sa + angle / 2 };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {slices.map((s, i) => (
              <linearGradient key={i} id={`pg-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={s.color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>
          <circle cx={cx} cy={cy} r={innerR - 1} fill="#fafaf8" />
          <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="central" fill="#1a1a18" fontSize="16" fontWeight="700" fontFamily="inherit" style={tn}>{$(total)}</text>
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={`url(#pg-${uid}-${i})`} stroke="#fff" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, padding: "6px 10px", borderRadius: 8, background: i % 2 === 0 ? "#fafaf8" : "transparent" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#6b6a65", fontWeight: 500, minWidth: 70 }}>{s.label}</span>
            <span style={{ fontWeight: 700, ...tn, color: "#1a1a18", minWidth: 60 }}>{$(s.value)}</span>
            <span style={{ fontSize: 10, color: "#8c8b86", fontWeight: 600 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverBar({ x, y, w, h, rx, fill, value, fontSize }) {
  const [hovered, setHovered] = useState(false);
  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "default" }}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />
      {/* Invisible wider hit area */}
      <rect x={x - 4} y={Math.min(y, y - 20)} width={w + 8} height={h + 24} fill="transparent" />
      <text
        x={x + w / 2} y={y - 6}
        textAnchor="middle" fill="#1a1a18" fontSize={fontSize} fontWeight="700" fontFamily="inherit" style={{ ...tn, opacity: hovered ? 1 : 0, transition: "opacity 120ms ease-out" }}
      >{$(value)}</text>
    </g>
  );
}

function BarChart({ bars, maxVal, height = 200, grouped = false, groupLabels }) {
  const barW = grouped ? 32 : 48;
  const groupGap = grouped ? 3 : 0;
  const gap = grouped ? 40 : 20;
  const groupSize = grouped ? 2 : 1;
  const numGroups = Math.ceil(bars.length / groupSize);
  const groupW = groupSize * barW + (groupSize - 1) * groupGap;
  const axisX = 48;
  const chartW = axisX + 16 + numGroups * (groupW + gap) - gap + 16;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width="100%" height={height + 44} viewBox={`0 0 ${chartW} ${height + 44}`} style={{ maxWidth: chartW }}>
      <defs>
        {bars.map((b, i) => (
          <linearGradient key={i} id={`bg-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={b.colorEnd || b.color} />
            <stop offset="40%" stopColor={b.colorEnd || b.color} />
            <stop offset="100%" stopColor={b.color} />
          </linearGradient>
        ))}
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = height - height * f;
        return (
          <g key={i}>
            <line x1={axisX} y1={y} x2={chartW - 8} y2={y} stroke={f === 0 ? "#dddcd7" : "#f0efea"} strokeWidth="1" />
            <text x={axisX - 8} y={y + 4} textAnchor="end" fill="#b0afa9" fontSize="9" fontFamily="inherit" style={tn}>{$(maxVal * f).replace(/\.00$/, "")}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = maxVal > 0 ? (Math.max(0, b.value) / maxVal) * height : 0;
        const groupIdx = Math.floor(i / groupSize);
        const withinIdx = i % groupSize;
        const x = axisX + 8 + groupIdx * (groupW + gap) + withinIdx * (barW + groupGap);
        const valFontSize = grouped ? 9 : 11;
        return grouped ? (
          <HoverBar key={i} x={x} y={height - bh} w={barW} h={bh} rx={4} fill={`url(#bg-${uid}-${i})`} value={b.value} fontSize={valFontSize} />
        ) : (
          <g key={i}>
            <rect x={x} y={height - bh} width={barW} height={bh} rx={5} fill={`url(#bg-${uid}-${i})`} />
            <text x={x + barW / 2} y={height - bh - 6} textAnchor="middle" fill="#1a1a18" fontSize={valFontSize} fontWeight="700" fontFamily="inherit" style={tn}>{$(b.value)}</text>
            <text x={x + barW / 2} y={height + 16} textAnchor="middle" fill="#8c8b86" fontSize="9" fontWeight="600" fontFamily="inherit">{b.label}</text>
          </g>
        );
      })}
      {grouped && groupLabels && groupLabels.map((label, gi) => {
        const x = axisX + 8 + gi * (groupW + gap);
        return (
          <text key={gi} x={x + groupW / 2} y={height + 16} textAnchor="middle" fill="#6b6a65" fontSize="10" fontWeight="600" fontFamily="inherit">{label}</text>
        );
      })}
    </svg>
  );
}

function AnalyticsView({ rev, cogs, profit, margin, partsCost, laborCost, nbCost, groups, bl, blMargin, onBack, quotes }) {
  const groupData = [...groups.entries()].map(([name, items]) => ({
    name,
    cost: items.reduce((s, p) => s + p.unitCost * p.qty, 0),
    rev: items.filter(p => p.billable).reduce((s, p) => s + p.unitPrice * p.qty, 0),
    profit: items.filter(p => p.billable).reduce((s, p) => s + (p.unitPrice - p.unitCost) * p.qty, 0),
  }));
  const catColors = ["#3b82f6", "#d4a853", "#16a34a", "#c06b84", "#7b6eb8", "#e08540"];
  const catEnds   = ["#60a5fa", "#c9943a", "#4ade80", "#a85a72", "#a78bfa", "#f0a060"];

  const cardStyle = {
    borderRadius: 12,
    background: "#fff",
    border: "1px solid #e8e7e2",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 0 0 0 transparent",
    overflow: "hidden",
  };
  const cardBody = { padding: "20px 24px" };
  const titleBar = (accent) => ({
    padding: "10px 20px",
    background: `linear-gradient(135deg, rgba(${hexToRgb(accent)}, 0.04) 0%, rgba(${hexToRgb(accent)}, 0.08) 100%)`,
    borderBottom: `1px solid rgba(${hexToRgb(accent)}, 0.15)`,
    display: "flex", alignItems: "center", gap: 8,
  });
  const titleText = { fontSize: 12, fontWeight: 700, color: "#4a4a46", letterSpacing: "0.01em" };

  return (
    <div className="page-enter" style={{ marginTop: 8 }}>
      <div className="page-enter" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", letterSpacing: "-0.02em" }}>Profitability Analytics</div>
      </div>

      {/* Hero card — Revenue / COGS / Profit */}
      <div className="analytics-card" style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={titleBar("#3b82f6")}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />
          <span style={titleText}>Revenue · COGS · Profit</span>
        </div>
        <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
          <BarChart
            bars={[
              { label: "Revenue", value: rev, color: "#3b82f6", colorEnd: "#60a5fa" },
              { label: "COGS", value: cogs, color: "#e08540", colorEnd: "#f0a060" },
              { label: "Profit", value: profit, color: profit >= 0 ? "#16a34a" : "#dc2626", colorEnd: profit >= 0 ? "#4ade80" : "#f87171" },
            ]}
            maxVal={Math.max(rev, cogs, Math.max(0, profit)) * 1.15}
            height={180}
          />
        </div>
      </div>

      {/* Quote Comparison — horizontal stacked bars */}
      {quotes && quotes.length > 0 && (() => {
        const allItems = [...quotes, { id: "__actuals", name: "Actuals", revenue: rev, cogs, profit, isActual: true }];
        const maxRev = Math.max(...allItems.map(q => q.revenue));
        return (
          <div className="analytics-card" style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={titleBar("#7b6eb8")}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7b6eb8" }} />
              <span style={titleText}>Quote Comparison</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: "#3b82f6", flexShrink: 0 }} /> Revenue
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: "#e08540", flexShrink: 0 }} /> COGS
                </span>
              </div>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {allItems.map((q, qi) => {
                const qMargin = q.revenue > 0 ? q.profit / q.revenue : 0;
                const revPct = maxRev > 0 ? (q.revenue / maxRev) * 100 : 0;
                const cogsPct = q.revenue > 0 ? (q.cogs / q.revenue) * 100 : 0;
                const isActual = q.isActual;
                return (
                  <Fragment key={q.id}>
                    {isActual && <div style={{ height: 1, background: "#e8e7e2", margin: "2px 0" }} />}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: isActual ? 700 : 600, color: isActual ? "#1a1a18" : "#4a4a46", lineHeight: 1.3 }}>{q.name}</div>
                        {!isActual && q.status && <div style={{ fontSize: 9, fontWeight: 600, color: q.status === "Approved" ? "#16a34a" : "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{q.status}</div>}
                      </div>
                      <div style={{ flex: 1, position: "relative", height: 24, borderRadius: 6, background: "#f5f4f0", overflow: "hidden" }}>
                        <div className="cost-split-bar" style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${revPct}%`,
                          borderRadius: 6,
                          background: isActual
                            ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                            : "linear-gradient(90deg, #93c5fd, #60a5fa)",
                          transition: "width 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                        }} />
                        <div className="cost-split-bar" style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${Math.min(cogsPct, 100) * (revPct / 100)}%`,
                          borderRadius: "6px 0 0 6px",
                          background: isActual
                            ? "linear-gradient(90deg, #c97030, #e08540)"
                            : "linear-gradient(90deg, #fbbf6a, #fde2a8)",
                          opacity: 0.85,
                          transition: "width 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                          animationDelay: "100ms",
                        }} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexShrink: 0, minWidth: 220 }}>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rev</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: "#1a1a18" }}>{$(q.revenue)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>COGS</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: "#1a1a18" }}>{$(q.cogs)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profit</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: q.profit >= 0 ? "#166534" : "#991b1b" }}>{$(q.profit)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 34 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Margin</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: qMargin >= 0.3 ? "#166534" : qMargin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(qMargin)}</div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Two-column: breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#e08540")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#e08540" }} />
            <span style={titleText}>COGS Breakdown</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <PieChart data={[
              { label: "Materials", value: partsCost, color: "#d4a853" },
              { label: "Labor", value: laborCost, color: "#3b82f6" },
              ...(nbCost > 0 ? [{ label: "Non-billable", value: nbCost, color: "#dc2626" }] : []),
            ]} />
          </div>
        </div>

        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#16a34a")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a" }} />
            <span style={titleText}>Revenue by Category</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <PieChart data={groupData.filter(g => g.rev > 0).map((g, i) => ({
              label: g.name, value: g.rev, color: catColors[i % catColors.length],
            }))} />
          </div>
        </div>
      </div>

      {/* Two-column: category profit + actual vs estimated */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#7b6eb8")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7b6eb8" }} />
            <span style={titleText}>Profit by Category</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <BarChart
              bars={groupData.map((g, i) => ({
                label: g.name.length > 10 ? g.name.split(" ")[0] : g.name,
                value: g.profit,
                color: catColors[i % catColors.length],
                colorEnd: catEnds[i % catEnds.length],
              }))}
              maxVal={Math.max(...groupData.map(g => g.profit), 1) * 1.15}
              height={180}
            />
          </div>
        </div>

        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#3b82f6")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={titleText}>Actual vs Estimated</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(180deg, #bfdbfe, #93c5fd)", flexShrink: 0 }} /> Est.
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(180deg, #60a5fa, #3b82f6)", flexShrink: 0 }} /> Actual
              </span>
            </div>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <BarChart
              grouped
              groupLabels={["Revenue", "COGS", "Profit"]}
              bars={[
                { value: bl.revenue, color: "#93c5fd", colorEnd: "#bfdbfe" },
                { value: rev, color: "#3b82f6", colorEnd: "#60a5fa" },
                { value: bl.cogs, color: "#fbbf6a", colorEnd: "#fde2a8" },
                { value: cogs, color: "#e08540", colorEnd: "#f0a060" },
                { value: bl.profit, color: "#86efac", colorEnd: "#bbf7d0" },
                { value: profit, color: "#16a34a", colorEnd: "#4ade80" },
              ]}
              maxVal={Math.max(rev, bl.revenue, cogs, bl.cogs) * 1.15}
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [demoEmpty, setDemoEmpty] = useState(false);
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState({ col: null, dir: "desc" });
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [activeQuotes, setActiveQuotes] = useState(new Set([QUOTES[0].id]));
  const [pricelistId, setPricelistId] = useState("default");
  const [showMenu, setShowMenu] = useState(false);
  const [showPricelist, setShowPricelist] = useState(false);
  const [showPricelistMenu, setShowPricelistMenu] = useState(false);
  const [pricelistSearch, setPricelistSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [requestItems, setRequestItems] = useState([]);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [page, setPage] = useState("table"); // "table" | "analytics"
  const metricsRef = useRef(null);
  const theadRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showQuotesPanel, setShowQuotesPanel] = useState(false);
  const [breakdownTab, setBreakdownTab] = useState("revenue");
  const tooltipTimeout = useRef(null);

  const showTooltip = (key) => {
    clearTimeout(tooltipTimeout.current);
    setHoveredMetric(key);
  };
  const hideTooltip = () => {
    tooltipTimeout.current = setTimeout(() => setHoveredMetric(null), 200);
  };

  const toggleQuote = (id) => setActiveQuotes((prev) => {
    const next = new Set(prev);
    if (next.has(id)) { if (next.size > 1) next.delete(id); } else next.add(id);
    return next;
  });

  const selectedQuotes = QUOTES.filter((q) => activeQuotes.has(q.id));
  const primaryQuote = selectedQuotes[0] || QUOTES[0];
  const bl = {
    revenue: selectedQuotes.reduce((s, q) => s + q.revenue, 0) / (selectedQuotes.length || 1),
    cogs: selectedQuotes.reduce((s, q) => s + q.cogs, 0) / (selectedQuotes.length || 1),
    profit: selectedQuotes.reduce((s, q) => s + q.profit, 0) / (selectedQuotes.length || 1),
    materials: selectedQuotes.reduce((s, q) => s + q.materials, 0) / (selectedQuotes.length || 1),
    labor: selectedQuotes.reduce((s, q) => s + q.labor, 0) / (selectedQuotes.length || 1),
  };
  const blMargin = bl.revenue > 0 ? bl.profit / bl.revenue : 0;

  const PARTS = demoEmpty ? [] : ALL_PARTS;
  const LABOR = demoEmpty ? [] : ALL_LABOR;
  const hasData = PARTS.length > 0 || LABOR.some((l) => l.total > 0);

  useEffect(() => {
    let ticking = false;
    let lastSticky = false;
    const check = () => {
      const thead = theadRef.current;
      if (!thead) { ticking = false; return; }
      // The thead is position:sticky top:0 (or top:44 when strip visible).
      // When stuck, theadTop ≈ 0. When in natural flow at page top, theadTop is large.
      // Use metricsRef bottom to know when KPI cards have scrolled past viewport top.
      const metrics = metricsRef.current;
      const metricsBottom = metrics ? metrics.getBoundingClientRect().bottom : Infinity;
      // Strip appears when KPI cards' bottom edge passes the viewport top
      const shouldStick = metricsBottom <= 0;
      const shouldUnstick = metricsBottom > 44;
      if (shouldStick && !lastSticky) { lastSticky = true; setIsSticky(true); setHoveredMetric(null); clearTimeout(tooltipTimeout.current); }
      else if (shouldUnstick && lastSticky) { lastSticky = false; setIsSticky(false); }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    const scrollEl = document.body;
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [hasData]);

  const billable = PARTS.filter((p) => p.billable);
  const partsRev = billable.reduce((s, p) => s + p.unitPrice * p.qty, 0);
  const partsCost = PARTS.reduce((s, p) => s + p.unitCost * p.qty, 0);
  const laborCost = LABOR.reduce((s, l) => s + l.total, 0);
  const rev = partsRev;
  const cogs = partsCost + laborCost;
  const profit = rev - cogs;
  const margin = rev > 0 ? profit / rev : 0;
  const nbCost = PARTS.filter((p) => !p.billable).reduce((s, p) => s + p.unitCost * p.qty, 0);
  const maxProfit = useMemo(() => Math.max(...(billable.length ? billable.map((p) => (p.unitPrice - p.unitCost) * p.qty) : [1]), 1), [billable]);

  const groups = useMemo(() => {
    const map = new Map();
    const items = sort.col ? [...PARTS].sort((a, b) => {
      const g = (p) => sort.col === "cost" ? p.unitCost * p.qty : sort.col === "revenue" ? p.unitPrice * p.qty : sort.col === "profit" ? (p.unitPrice - p.unitCost) * p.qty : sort.col === "margin" ? (p.unitPrice > 0 ? (p.unitPrice - p.unitCost) / p.unitPrice : -1) : 0;
      return sort.dir === "asc" ? g(a) - g(b) : g(b) - g(a);
    }) : PARTS;
    items.forEach((p) => { if (!map.has(p.group)) map.set(p.group, []); map.get(p.group).push(p); });
    return map;
  }, [PARTS, sort]);

  const doSort = (c) => setSort((s) => s.col === c ? { col: c, dir: s.dir === "asc" ? "desc" : "asc" } : { col: c, dir: "desc" });
  const S = (c) => sort.col === c ? (sort.dir === "asc" ? " ↑" : " ↓") : "";
  const tabs = [
    { name: "Parts & services", n: PARTS.length, add: "Add part / service" },
    { name: "Labor", n: LABOR.length, add: "Add labor" },
    { name: "Expenses", n: ALL_EXPENSES.length, add: "Add expense" },
    { name: "Commissions", n: ALL_COMMISSIONS.length, add: "Add commission" },
  ];

  return (
    <div style={{ color: "#1a1a18", maxWidth: 960, margin: "0 auto", padding: "28px 24px 40px", background: "#fff", minHeight: "100vh", position: "relative", borderLeft: "1px solid #eae9e4", borderRight: "1px solid #eae9e4", boxShadow: "0 0 40px rgba(0,0,0,0.04)" }}>

      {/* Demo toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", borderRadius: 8, border: "1px solid #e0dfda", overflow: "hidden", fontSize: 12, fontWeight: 600 }}>
          <button onClick={() => { setDemoEmpty(true); setTab(0); setSelected(new Set()); }} style={{ padding: "7px 18px", background: demoEmpty ? "#1a1a18" : "#fff", color: demoEmpty ? "#fff" : "#6b6a65", border: "none", cursor: "pointer" }}>Empty state</button>
          <button onClick={() => { setDemoEmpty(false); setTab(0); setSelected(new Set()); }} style={{ padding: "7px 18px", background: !demoEmpty ? "#1a1a18" : "#fff", color: !demoEmpty ? "#fff" : "#6b6a65", border: "none", cursor: "pointer", borderLeft: "1px solid #e0dfda" }}>With data</button>
        </div>
      </div>

      {/* Header */}
      <div className="header-enter" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Line Items
        </span>
        <span className="margin-hero" style={{ fontSize: 16, ...tn }}>
          <span style={{ fontWeight: 500, color: "#6b6a65" }}>{hasData ? "Profit margin " : "Projected margin "}</span>
          <span style={{ fontWeight: 700, color: hasData ? (margin >= 0.3 ? "#16a34a" : margin >= 0.1 ? "#d97706" : "#dc2626") : "#8c8b86" }}>{hasData ? pct(margin) : pct(blMargin)}</span>
        </span>
      </div>


      {/* KPI cards — stay in normal flow, scroll away naturally */}
      {hasData ? (
        <>
          <div ref={metricsRef} style={{ marginBottom: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", borderRadius: 12, background: "#fafaf8", border: "1px solid #e8e7e2" }}>
            <div style={{ display: "flex", alignItems: "stretch", position: "relative", zIndex: 2, borderRadius: 10, background: "#fff", boxShadow: "0 1px 0 #e8e7e2, 0 3px 8px rgba(0,0,0,0.05)" }}>
              {[
                { label: "Revenue", val: rev, key: "revenue", inv: false },
                { label: "COGS", val: cogs, key: "cogs", inv: true },
                { label: "Profit", val: profit, key: "profit", inv: false },
              ].map((m, i, arr) => {
                const proj = bl[m.key];
                const diff = m.val - proj;
                const countDelay = 80 + i * 80;
                return (
                  <div key={i} className="kpi-card" style={{ flex: 1, padding: "20px 22px", borderRight: i < arr.length - 1 ? "1px solid #e8e7e2" : "none", position: "relative" }}>
                    {i > 0 && <div className={`kpi-operator op-${i}`} style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: 99, background: "#fff", border: "1px solid #e8e7e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#8c8b86", fontWeight: 700, zIndex: 1 }}>{i === 1 ? "−" : "="}</div>}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{m.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", ...tn, lineHeight: 1.1, color: i === 2 ? (profit >= 0 ? "#166534" : "#991b1b") : "#1a1a18" }}><AnimatedValue value={m.val} duration={650} delay={countDelay} /></div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap", position: "relative", padding: "3px 6px", margin: "-3px -6px", cursor: "default" }}
                      onMouseEnter={() => showTooltip(m.key)} onMouseLeave={hideTooltip}>
                      {diff !== 0 ? <Pill val={diff} invert={m.inv} delay={countDelay + 500} /> : <span className="pill-enter" style={{ fontSize: 11, color: "#b0afa9", ...tn, animationDelay: `${countDelay + 500}ms` }}>On target</span>}
                      <span className="pill-enter" style={{ fontSize: 10, color: "#b0afa9", ...tn, animationDelay: `${countDelay + 520}ms` }}>vs {$(proj)} est.</span>
                      <div className="kpi-tooltip" data-visible={hoveredMetric === m.key || undefined}
                        onMouseEnter={() => showTooltip(m.key)} onMouseLeave={hideTooltip}>
                          {[
                            { label: "Materials", est: bl.materials, actual: partsCost, color: "#d4a853" },
                            { label: "Labor", est: bl.labor, actual: laborCost, color: "#5b9bd5" },
                          ].map((r, ri) => {
                            const pd = r.est > 0 ? ((r.actual - r.est) / r.est) * 100 : 0;
                            return (
                              <div key={ri} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#4a4a46", padding: "3px 0", marginBottom: ri === 0 ? 4 : 0 }}>
                                <span style={{ width: 5, height: 5, borderRadius: 2, background: r.color, flexShrink: 0, marginTop: 5 }} />
                                <span style={{ fontWeight: 500, width: 62, marginTop: 1 }}>{r.label}</span>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontWeight: 600, ...tn }}>{$(r.actual)}</span>
                                    <span style={{ fontWeight: 600, fontSize: 11, ...tn, color: pd > 0 ? "#991b1b" : pd < 0 ? "#166534" : "#8c8b86" }}>{pd > 0 ? "+" : ""}{pd.toFixed(1)}%</span>
                                  </div>
                                  <div style={{ fontSize: 10, color: "#b0afa9", marginTop: 1, ...tn }}>est. {$(r.est)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="cost-split-item" style={{ fontSize: 10, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cost split</span>
              <div className="cost-split-bar" style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", flex: "0 0 80px" }}>
                {cogs > 0 && <><div style={{ flex: partsCost / cogs, background: "#d4a853" }} /><div style={{ flex: laborCost / cogs, background: "#5b9bd5" }} /></>}
              </div>
              {[{ l: "Materials", v: partsCost, c: "#d4a853" }, { l: "Labor", v: laborCost, c: "#5b9bd5" }].map((s, i) => (
                <div key={i} className="cost-split-item" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, animationDelay: `${400 + i * 60}ms` }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: s.c }} />
                  <span style={{ color: "#8c8b86" }}>{s.l}</span>
                  <span style={{ fontWeight: 700, ...tn }}>{$(s.v)}</span>
                </div>
              ))}
              <span style={{ flex: 1 }} />
              <button
                onClick={() => { setShowQuotesPanel(v => !v); if (!showQuotesPanel) setBreakdownTab("revenue"); }}
                className="cost-split-item"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6,
                  border: "1px solid #e0dfda", background: showQuotesPanel ? "#f0efeb" : "#fff",
                  color: "#4a4a46", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "background 150ms ease, border-color 150ms ease",
                  animationDelay: "480ms",
                }}>
                Breakdown
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: showQuotesPanel ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
                  <path d="M2.5 4L5 6.5L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => setPage(page === "table" ? "analytics" : "table")} className={`view-more-btn cost-split-item${page === "analytics" ? " back" : ""}`} style={{ animationDelay: "520ms" }}>{page === "analytics" ? <><span className="arrow">←</span> Back to Table</> : <>View More <span className="arrow">→</span></>}</button>
            </div>
            {/* Breakdown expand panel */}
            <div className="scope-notes-wrap" {...(showQuotesPanel ? { "data-open": "" } : {})}>
              <div>
                <div style={{ padding: "12px 22px", background: "#fff", borderTop: "1px solid #e8e7e2" }}>
                  {/* Revenue / COGS pills */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {["revenue", "cogs"].map((t) => {
                      const on = breakdownTab === t;
                      return (
                        <button key={t} onClick={() => setBreakdownTab(t)} style={{ fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 99, border: on ? "1px solid #1a1a18" : "1px solid #e0dfda", cursor: "pointer", background: on ? "#1a1a18" : "#fff", color: on ? "#fff" : "#6b6a65", transition: "all 150ms ease" }}>
                          {t === "revenue" ? "Revenue" : "COGS"}
                        </button>
                      );
                    })}
                  </div>
                  {breakdownTab === "revenue" ? (
                  <table style={{ width: "100%", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2" }}>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quote</th>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>COGS</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Profit</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUOTES.map((q) => {
                        const qm = q.revenue > 0 ? q.profit / q.revenue : 0;
                        return (
                          <tr key={q.id} style={{ borderBottom: "1px solid #eeede8" }}>
                            <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>{q.name}</td>
                            <td style={{ padding: "7px 0" }}>
                              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: q.status === "Approved" ? "#f0fdf4" : "#f5f4f0", color: q.status === "Approved" ? "#16a34a" : "#8c8b86", textTransform: "uppercase", letterSpacing: "0.04em" }}>{q.status}</span>
                            </td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(q.revenue)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(q.cogs)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: q.profit >= 0 ? "#166534" : "#991b1b" }}>{$(q.profit)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: qm >= 0.3 ? "#166534" : qm >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(qm)}</td>
                          </tr>
                        );
                      })}
                      <tr style={{ borderTop: "2px solid #e8e7e2" }}>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: "#1a1a18" }}>Actuals</td>
                        <td style={{ padding: "7px 0" }}>
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#eef2ff", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.04em" }}>Current</span>
                        </td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(rev)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(cogs)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: profit >= 0 ? "#166534" : "#991b1b" }}>{$(profit)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: margin >= 0.3 ? "#166534" : margin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(margin)}</td>
                      </tr>
                    </tbody>
                  </table>
                  ) : (
                  <table style={{ width: "100%", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2" }}>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Items</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cost</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>% of COGS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const groups = {};
                        PARTS.forEach((p) => {
                          if (!groups[p.group]) groups[p.group] = { count: 0, cost: 0 };
                          groups[p.group].count += 1;
                          groups[p.group].cost += p.unitCost * p.qty;
                        });
                        const rows = Object.entries(groups).sort((a, b) => b[1].cost - a[1].cost);
                        return rows.map(([group, data]) => (
                          <tr key={group} style={{ borderBottom: "1px solid #eeede8" }}>
                            <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>{group}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", ...tn, color: "#6b6a65" }}>{data.count}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(data.cost)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 600, ...tn, color: "#8c8b86" }}>{cogs > 0 ? pct(data.cost / cogs) : "—"}</td>
                          </tr>
                        ));
                      })()}
                      <tr style={{ borderBottom: "1px solid #eeede8" }}>
                        <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>Labor</td>
                        <td style={{ padding: "7px 0", textAlign: "right", ...tn, color: "#6b6a65" }}>{LABOR.length}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(laborCost)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 600, ...tn, color: "#8c8b86" }}>{cogs > 0 ? pct(laborCost / cogs) : "—"}</td>
                      </tr>
                      <tr style={{ borderTop: "2px solid #e8e7e2" }}>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: "#1a1a18" }}>Total COGS</td>
                        <td style={{ padding: "7px 0" }} />
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(cogs)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: "#1a1a18" }}>100%</td>
                      </tr>
                    </tbody>
                  </table>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Compact strip — fixed to viewport top */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0,
            zIndex: 50,
            pointerEvents: isSticky ? "auto" : "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              padding: "0 max(24px, calc((100vw - 912px) / 2))",
              height: 44,
              background: "#fff", borderBottom: "1px solid #e8e7e2",
              boxShadow: isSticky ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
              transform: isSticky ? "translateY(0)" : "translateY(-100%)",
              opacity: isSticky ? 1 : 0,
              transition: "transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms ease-out, box-shadow 280ms ease",
              willChange: "transform, opacity",
            }}>
              {[
                { label: "Revenue", val: rev, key: "revenue", inv: false },
                { label: "COGS", val: cogs, key: "cogs", inv: true },
                { label: "Profit", val: profit, key: "profit", inv: false },
              ].map((m, i) => {
                const diff = m.val - bl[m.key];
                const good = m.inv ? diff < 0 : diff > 0;
                return (
                  <Fragment key={i}>
                    {i > 0 && <span style={{ color: "#b0afa9", fontSize: 13, fontWeight: 600, margin: "0 10px", flexShrink: 0 }}>{i === 1 ? "−" : "="}</span>}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, ...tn, color: i === 2 ? (profit >= 0 ? "#166534" : "#991b1b") : "#1a1a18" }}>{$(m.val)}</span>
                      {diff !== 0 && <span style={{ fontSize: 10, fontWeight: 600, ...tn, color: good ? "#166534" : "#991b1b" }}>{diff > 0 ? "+" : ""}{$(diff)}</span>}
                    </div>
                  </Fragment>
                );
              })}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 10, paddingLeft: 10, borderLeft: "1px solid #e8e7e2" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Margin</span>
                <span style={{ fontSize: 14, fontWeight: 700, ...tn, color: margin >= 0.3 ? "#166534" : margin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(margin)}</span>
              </div>
              <span style={{ flex: 1 }} />
              <button onClick={() => document.body.scrollTo({ top: 0, behavior: "smooth" })} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "#8c8b86", transition: "background 150ms ease, border-color 150ms ease" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f4f0"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/><line x1="5" y1="3" x2="19" y2="3"/></svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", marginBottom: 24, border: "1px solid #e8e7e2", borderRadius: 10, overflow: "hidden", background: "#fafaf8" }}>
          {[{ label: "Est. revenue", val: primaryQuote.revenue }, { label: "Est. COGS", val: primaryQuote.cogs }, { label: "Est. profit", val: primaryQuote.profit }].map((m, i, arr) => (
            <div key={i} style={{ flex: 1, padding: "20px 22px", borderRight: i < arr.length - 1 ? "1px solid #e8e7e2" : "none", position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: 99, background: "#fafaf8", border: "1px solid #e8e7e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#8c8b86", fontWeight: 700, zIndex: 1 }}>{i === 1 ? "−" : "="}</div>}
              <div style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", ...tn, lineHeight: 1.1, color: "#8c8b86" }}>{$(m.val)}</div>
              <div style={{ marginTop: 8 }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "#eae9e4", color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.04em" }}>From quote</span></div>
            </div>
          ))}
        </div>
      )}

      {page === "analytics" ? (
        <AnalyticsView
          rev={rev} cogs={cogs} profit={profit} margin={margin}
          partsCost={partsCost} laborCost={laborCost} nbCost={nbCost}
          groups={groups} bl={bl} blMargin={blMargin}
          onBack={() => setPage("table")}
          quotes={QUOTES}
        />
      ) : (
      <div className="page-enter">
      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e8e7e2" }}>
        {tabs.map((t, i) => {
          const on = tab === i;
          return (
            <button key={i} onClick={() => setTab(i)} style={{ padding: "10px 16px 10px 12px", fontSize: 13, fontWeight: on ? 700 : 400, color: on ? "#1a1a18" : "#8c8b86", background: "none", border: "none", borderBottom: on ? "2px solid #1a1a18" : "2px solid transparent", cursor: "pointer", marginBottom: -1, display: "flex", alignItems: "center", gap: 5 }}>
              {t.name}
              {t.n > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 4, minWidth: 18, textAlign: "center", background: on ? "#1a1a18" : "#eae9e4", color: on ? "#fff" : "#8c8b86" }}>{t.n}</span>}
            </button>
          );
        })}
        <span style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: -1 }}>
          <button style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>+ {tabs[tab].add}</button>
          <div style={{ position: "relative" }}>
            <button onClick={() => { setShowMenu(!showMenu); setShowPricelistMenu(false); setPricelistSearch(""); }} style={{ width: 28, height: 28, padding: 0, borderRadius: 6, border: "1px solid #e0dfda", background: showMenu ? "#f5f4f0" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6a65", fontSize: 18, lineHeight: 1 }}>⋯</button>
            {showMenu && (
              <div className="dropdown-menu" style={{ position: "absolute", right: 0, top: 34, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20 }}>
                <button onClick={() => { setShowPricelistMenu(v => !v); setPricelistSearch(""); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showPricelistMenu ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="19" cy="17" r="3"/><path d="M17.5 18.5L16 20"/></svg>
                  Change pricelist
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                {showPricelistMenu && (
                  <div style={{ position: "absolute", right: "calc(100% + 4px)", top: 0, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 21 }}>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <input
                        autoFocus
                        value={pricelistSearch}
                        onChange={(e) => setPricelistSearch(e.target.value)}
                        placeholder="Search pricelists…"
                        style={{ width: "100%", fontSize: 12, padding: "6px 10px", borderRadius: 5, border: "1px solid #e0dfda", outline: "none", background: "#fafaf8", color: "#1a1a18" }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {PRICELISTS.filter(pl => pl.name.toLowerCase().includes(pricelistSearch.toLowerCase())).map((pl) => (
                      <button
                        key={pl.id}
                        onClick={() => { setPricelistId(pl.id); setShowPricelist(true); }}
                        className="dropdown-item"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: pl.id === pricelistId ? "#1a1a18" : "#4a4a46", fontWeight: pl.id === pricelistId ? 600 : 400, textAlign: "left" }}
                      >
                        {pl.name}
                        {pl.id === pricelistId && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    ))}
                    {PRICELISTS.filter(pl => pl.name.toLowerCase().includes(pricelistSearch.toLowerCase())).length === 0 && (
                      <div style={{ padding: "12px 14px", fontSize: 12, color: "#a3a29c", textAlign: "center" }}>No results</div>
                    )}
                  </div>
                )}
                <button className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export line items
                </button>
                <div style={{ height: 1, background: "#e8e7e2", margin: "4px 0" }} />
                <button onClick={() => { setDialog("po"); setRequestItems([]); setShowMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
                  Create purchase order
                </button>
                <button onClick={() => { setDialog("mr"); setRequestItems([]); setShowMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  Create material request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {tab === 0 && PARTS.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: "0 0 10px 10px" }}>
          {showPricelist && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderBottom: "1px solid #f0eeea", background: "#fefdfb" }}>
              <span style={{ fontSize: 11, color: "#8c8b86" }}>Pricelist</span>
              <select value={pricelistId} onChange={(e) => setPricelistId(e.target.value)} style={{ fontSize: 12, fontWeight: 600, padding: "3px 22px 3px 8px", borderRadius: 5, border: "1px solid #e8e7e2", background: "#fff", color: "#1a1a18", cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23a3a29c' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}>
                {PRICELISTS.map((pl) => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
              </select>
              <span style={{ fontSize: 11, color: "#b0afa9" }}>applied to all items</span>
              <span style={{ flex: 1 }} />
              <button onClick={() => setShowPricelist(false)} style={{ fontSize: 11, color: "#a3a29c", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>✕</button>
            </div>
          )}

          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: 30 }} />
              <col />
              <col style={{ width: "7%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "4%" }} />
            </colgroup>
            <TableHeader>
              <TableRow ref={theadRef} style={{ position: "sticky", top: isSticky ? 44 : 0, zIndex: 10, background: selected.size > 0 ? "#eef2ff" : "#fff", transition: "background 0.15s, top 250ms cubic-bezier(0.23, 1, 0.32, 1)", boxShadow: "0 1px 0 #e8e7e2" }}>
                <TableHead style={{ padding: "6px 12px", textAlign: "center" }}>
                  <input type="checkbox" checked={selected.size === PARTS.length && PARTS.length > 0} ref={(el) => { if (el) el.indeterminate = selected.size > 0 && selected.size < PARTS.length; }} onChange={(e) => setSelected(e.target.checked ? new Set(PARTS.map((p) => p.id)) : new Set())} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1d4ed8", margin: 0 }} />
                </TableHead>
                {selected.size > 0 ? (
                  <TableHead colSpan={7} style={{ padding: "5px 14px", textAlign: "left" }}>
                    <div className="selection-bar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", whiteSpace: "nowrap" }}>{selected.size} selected</span>
                      <span style={{ width: 1, height: 16, background: "#c7d7f0" }} />
                      {["Mark non-billable", "Change pricing", "Remove"].map((a) => (
                        <button key={a} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: a === "Remove" ? "#991b1b" : "#1d4ed8", whiteSpace: "nowrap" }}>{a}</button>
                      ))}
                      <span style={{ width: 1, height: 16, background: "#c7d7f0" }} />
                      <button onClick={() => { setDialog("po"); setRequestItems([...selected].map(id => PARTS.find(p => p.id === id)).filter(Boolean)); }} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: "#1d4ed8", whiteSpace: "nowrap" }}>PO from selected</button>
                      <button onClick={() => { setDialog("mr"); setRequestItems([...selected].map(id => PARTS.find(p => p.id === id)).filter(Boolean)); }} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: "#1d4ed8", whiteSpace: "nowrap" }}>MR from selected</button>
                      <span style={{ flex: 1 }} />
                      <button onClick={() => setSelected(new Set())} style={{ fontSize: 10, fontWeight: 600, color: "#6b6a65", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                    </div>
                  </TableHead>
                ) : (
                  [
                    { label: "Item", align: "left", col: null },
                    { label: "Qty", align: "right", col: null },
                    { label: "Unit cost", align: "right", col: "cost" },
                    { label: "Revenue", align: "right", col: "revenue" },
                    { label: "Profit", align: "right", col: "profit" },
                    { label: "Margin", align: "right", col: "margin" },
                    { label: "", align: "center", col: null },
                  ].map((h, i) => (
                    <TableHead key={i} onClick={() => h.col && doSort(h.col)} style={{ padding: "9px 14px", textAlign: h.align, cursor: h.col ? "pointer" : "default", userSelect: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {h.label}{h.col ? S(h.col) : ""}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...groups.entries()].map(([gName, items], gi) => {
                const gCost = items.reduce((s, p) => s + p.unitCost * p.qty, 0);
                const gRev = items.filter(p => p.billable).reduce((s, p) => s + p.unitPrice * p.qty, 0);
                return [
                  <TableRow key={"g-" + gi} hoverBg={false} style={{ position: "sticky", top: isSticky ? 80 : 36, zIndex: 5, boxShadow: "0 1px 0 #e8e7e2" }}>
                    <TableCell colSpan={8} className="group-header" style={{ padding: "8px 14px 6px", background: "#fafaf8", animationDelay: `${gi * 40}ms` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#4a4a46" }}>{gName}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#b0afa9" }}>{items.length} items</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#8c8b86", ...tn }}>
                          <span>Cost {$(gCost)}</span>
                          {gRev > 0 && <span>Rev {$(gRev)}</span>}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>,
                  ...items.map((p) => {
                    const r = p.unitPrice * p.qty;
                    const pr = r - p.unitCost * p.qty;
                    const mg = r > 0 ? pr / r : 0;
                    const nb = !p.billable;
                    const ex = open === p.id;
                    return [
                      <TableRow key={p.id} style={{ cursor: p.notes ? "pointer" : "default", background: selected.has(p.id) ? "rgba(239,246,255,0.4)" : undefined }}>
                        <TableCell style={{ padding: "0 12px", textAlign: "center", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selected.has(p.id)} onChange={(e) => { const n = new Set(selected); e.target.checked ? n.add(p.id) : n.delete(p.id); setSelected(n); }} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18", margin: 0 }} />
                        </TableCell>
                        <TableCell style={{ padding: "12px 14px" }} onClick={() => p.notes && setOpen(ex ? null : p.id)}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Thumb type={p.thumb} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1, display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={tn}>{p.id}</span>
                                <span style={{ color: "#d0cfca" }}>·</span>
                                <span>{p.type}</span>
                                {nb && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#fef3c7", color: "#92400e" }}>NON-BILLABLE</span>}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, ...tn, color: "#6b6a65" }}>{p.qty} <span style={{ fontSize: 11, color: "#b0afa9" }}>{p.unit}</span></TableCell>
                        <TableCell style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{$(p.unitCost)}</TableCell>
                        <TableCell style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{nb ? "—" : $(r)}</TableCell>
                        <TableCell style={{ padding: "12px 14px", textAlign: "right" }}>
                          {nb ? <span style={{ color: "#a3a29c" }}>—</span> : <span style={{ fontSize: 13, fontWeight: 700, ...tn, color: pr > 0 ? "#166534" : pr < 0 ? "#991b1b" : "#a3a29c" }}>{$(pr)}</span>}
                        </TableCell>
                        <TableCell style={{ padding: "12px 14px", textAlign: "right" }}>
                          {nb ? <span style={{ color: "#a3a29c" }}>—</span> : <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 5, ...tn, background: mg >= 0.4 ? "#dcfce7" : mg >= 0.15 ? "#fef9c3" : "#fee2e2", color: mg >= 0.4 ? "#166534" : mg >= 0.15 ? "#854d0e" : "#991b1b" }}>{pct(mg)}</span>}
                        </TableCell>
                        <TableCell style={{ padding: "12px 8px", textAlign: "center" }}><span style={{ color: "#c5c4bf", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>⋯</span></TableCell>
                      </TableRow>,
                      p.notes && (
                        <tr key={p.id + "-n"} className="notes-row" data-open={ex || undefined}>
                          <td colSpan={8} style={{ padding: 0, verticalAlign: "top" }}>
                            <div className="scope-notes-wrap" data-open={ex || undefined}>
                              <div>
                                <div style={{ padding: "0 14px 12px 60px" }}>
                                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "#6b6a65", background: "#fafaf8", border: "1px solid #f0eeea", borderRadius: 6, padding: "10px 14px", borderLeft: "3px solid #d4d3ce" }}>
                                    <span style={{ fontWeight: 700, color: "#8c8b86", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Scope notes</span>
                                    {p.notes}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ),
                    ];
                  }),
                ];
              })}
            </TableBody>
          </Table>

          <div style={{ borderTop: "1px solid #e8e7e2", padding: "18px 20px", background: "#fafaf8", borderRadius: "0 0 10px 10px" }}>
            <div style={{ maxWidth: 320, marginLeft: "auto", fontSize: 13 }}>
              {nbCost > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#a3a29c", marginBottom: 5 }}><span>Non-billable costs</span><span style={tn}>{$(nbCost)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ color: "#6b6a65" }}>Billable subtotal</span><span style={{ fontWeight: 600, ...tn }}>{$(partsRev)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "2px solid #1a1a18", fontWeight: 800, fontSize: 14 }}><span>Net revenue</span><span style={tn}>{$(rev)}</span></div>
            </div>
          </div>
        </div>
      ) : tab === 0 ? (
        <div style={{ border: "1px solid #e8e7e2", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f5f4f0", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8M8 12h8" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", marginBottom: 4 }}>No parts or services added</div>
          <div style={{ fontSize: 13, color: "#8c8b86", maxWidth: 340, margin: "0 auto 20px", lineHeight: 1.5 }}>Add line items to start tracking actuals against the estimated budget shown above.</div>
          <button style={{ fontSize: 13, fontWeight: 700, padding: "9px 24px", borderRadius: 8, border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer" }}>+ Add part / service</button>
        </div>
      ) : tab === 1 && LABOR.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: "0 0 10px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Hours</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Rate</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {LABOR.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{l.name}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{l.hours}h</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{$(l.rate)}/hr</td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(l.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: "0 0 10px 10px" }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total labor</span><span style={tn}>{$(laborCost)}</span></div>
            </div>
          </div>
        </div>
      ) : tab === 2 && ALL_EXPENSES.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: "0 0 10px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Category</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Date</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "8%" }}>Receipt</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ALL_EXPENSES.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{e.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>{e.category}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65", ...tn }}>{e.date}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {e.receipt ? <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f0fdf4", color: "#16a34a", textTransform: "uppercase" }}>Yes</span> : <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f5f4f0", color: "#8c8b86", textTransform: "uppercase" }}>No</span>}
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: "0 0 10px 10px" }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total expenses</span><span style={tn}>{$(ALL_EXPENSES.reduce((s, e) => s + e.amount, 0))}</span></div>
            </div>
          </div>
        </div>
      ) : tab === 3 && ALL_COMMISSIONS.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: "0 0 10px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Role</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "10%" }}>Rate</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Basis</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ALL_COMMISSIONS.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>{c.role}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{c.rate}%</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: c.basis === "revenue" ? "#eef2ff" : "#f0fdf4", color: c.basis === "revenue" ? "#3b82f6" : "#16a34a", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.basis}</span>
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: "0 0 10px 10px" }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total commissions</span><span style={tn}>{$(ALL_COMMISSIONS.reduce((s, c) => s + c.amount, 0))}</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ border: "1px solid #e8e7e2", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "64px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4a4a46", marginBottom: 4 }}>No {tabs[tab].name.toLowerCase()} yet</div>
          <div style={{ fontSize: 13, color: "#a3a29c", maxWidth: 280, margin: "0 auto 16px", lineHeight: 1.5 }}>
            {tab === 1 ? "Labor tracked against this job will appear here." : tab === 2 ? "Receipts and job-related expenses will show here." : "Commissions will appear once configured."}
          </div>
          <button style={{ fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>+ {tabs[tab].add}</button>
        </div>
      )}

      {hasData && (
        <div style={{ marginTop: 14, fontSize: 11, color: "#c5c4bf", display: "flex", justifyContent: "space-between", ...tn }}>
          <span>{$(rev)} revenue − {$(cogs)} COGS = {$(profit)} profit</span>
          <span>All figures trace to line items above</span>
        </div>
      )}
      </div>
      )}

      {/* Dialog */}
      {dialog && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80, zIndex: 50 }} onClick={(e) => { if (e.target === e.currentTarget) setDialog(null); }}>
          <div style={{ width: 520, background: "#fff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: "1px solid #e8e7e2" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{dialog === "po" ? "Create purchase order" : "Create material request"}</div>
              <button onClick={() => setDialog(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#8c8b86" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{dialog === "po" ? "Vendor" : "Source warehouse"}</label>
                  <select style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }}>
                    {dialog === "po" ? <><option>Select vendor...</option><option>ABC Roofing Supply</option><option>SRS Distribution</option></> : <><option>Main warehouse</option><option>Satellite — North</option></>}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{dialog === "po" ? "Expected delivery" : "Urgency"}</label>
                  {dialog === "po" ? <input type="date" style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }} /> : <select style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }}><option>Standard (3-5 days)</option><option>Rush (1-2 days)</option></select>}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Notes</label>
                <textarea placeholder="Delivery instructions, special requirements..." style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", resize: "vertical", minHeight: 60, fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 24px 18px", borderTop: "1px solid #e8e7e2", background: "#fafaf8" }}>
              <button onClick={() => setDialog(null)} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>Cancel</button>
              <button style={{ fontSize: 13, fontWeight: 700, padding: "8px 20px", borderRadius: 7, border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer" }}>{dialog === "po" ? "Create PO" : "Submit request"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
