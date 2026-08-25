// ─────────────────────────────────────────────────────────────────────────────
// Bucket / config system for the Zuper self-serve onboarding prototype.
//
// A "bucket" is the single source of truth for everything that changes based on
// the customer's trade: workflow stages, the sample records pre-seeded into the
// dashboard, and the line items used to pre-fill the first estimate/proposal.
//
// The work-type chosen on Screen 5 maps to exactly one bucket (see
// `bucketForWorkType`). Every downstream screen (12 dashboard, 13 first action)
// reads from that one object — so adding a 4th trade means adding ONE entry to
// BUCKETS and one line to bucketForWorkType. Nothing else in the flow changes.
// ─────────────────────────────────────────────────────────────────────────────

// Screen 5 — kind of work (drives the bucket + the Screen 6 follow-up)
export const WORK_TYPES = [
  { id: "residential", label: "Residential roofing", icon: "Home" },
  { id: "commercial",  label: "Commercial roofing",  icon: "Building2" },
  { id: "both",        label: "Both",                 icon: "Layers" },
  { id: "insurance",   label: "Insurance roofing",    icon: "ShieldCheck" },
  { id: "other",       label: "Other",                icon: "CircleDashed" },
];

// Screen 7 — what should work first (drives the guided first action on Screen 13)
export const PRIORITIES = [
  { id: "leads",     label: "Capture leads",   icon: "Inbox",    desc: "Never lose an inbound job" },
  { id: "estimates", label: "Create estimates",icon: "FileText", desc: "Send a branded quote today" },
  { id: "schedule",  label: "Schedule jobs",   icon: "Calendar", desc: "Put crews on the calendar" },
  { id: "crews",     label: "Manage crews",    icon: "Users",    desc: "See who's working what" },
  { id: "invoice",   label: "Invoice",         icon: "Receipt",  desc: "Get paid faster" },
];

// Screen 8 — company size (the number drives the live schedule-preview density)
export const COMPANY_SIZES = [
  { id: "solo", label: "Owner-operator", crews: 1 },
  { id: "2-5",  label: "2–5",            crews: 3 },
  { id: "6-10", label: "6–10",           crews: 5 },
  { id: "11+",  label: "11+",            crews: 8 },
];

// ─── The three buckets ───────────────────────────────────────────────────────
export const BUCKETS = {
  ownerOperatorResidential: {
    id: "ownerOperatorResidential",
    label: "Owner-operator residential",
    accent: "#FD5000",
    recordNoun: "job",
    recordNounPlural: "Jobs",
    // workflow stages shown as the pipeline / kanban columns
    stages: ["New Lead", "Estimate Sent", "Scheduled", "In Progress", "Invoiced"],
    leadStages: ["New", "Contacted", "Qualified", "Inspection Scheduled", "Nurture"],
    leadSourceCategories: ["Website", "Referral", "Door knocking", "Phone"],
    sampleLeads: [
      { ref: "LEAD-3108", title: "John Carter roof replacement", customer: "John Carter", score: 92, source: "Website", status: "Contacted", next: "Qualify", address: "128 Oak St", cost: 84 },
      { ref: "LEAD-3107", title: "Maple Ave leak repair", customer: "Dana Miller", score: 77, source: "Referral", status: "New", next: "Call back", address: "44 Maple Ave", cost: 35 },
      { ref: "LEAD-3104", title: "Garage roof patch", customer: "Marcus Lee", score: 61, source: "Phone", status: "Nurture", next: "Send drip", address: "301 Birch Rd", cost: 18 },
      { ref: "LEAD-3101", title: "Whitfield re-shingle", customer: "Ellen Whitfield", score: 85, source: "Door knocking", status: "Qualified", next: "Schedule inspection", address: "9 Pine Ct", cost: 52 },
    ],
    // 3–5 sample records pre-seeded so the dashboard is never empty
    sampleData: [
      { ref: "JOB-1042", title: "John's Roof Replacement", customer: "John Carter",   value: 8450, stage: "Scheduled",     address: "128 Oak St, Springfield",  date: "18 Aug 2026" },
      { ref: "JOB-1041", title: "Maple Ave Leak Repair",   customer: "Dana Miller",   value: 1320, stage: "In Progress",   address: "44 Maple Ave, Springfield", date: "16 Aug 2026" },
      { ref: "JOB-1039", title: "Whitfield Re-Shingle",    customer: "Ellen Whitfield",value: 6900, stage: "Estimate Sent", address: "9 Pine Ct, Riverton",      date: "22 Aug 2026" },
      { ref: "JOB-1038", title: "Garage Roof Patch",       customer: "Marcus Lee",    value: 780,  stage: "New Lead",       address: "301 Birch Rd, Riverton",   date: "—" },
    ],
    // line items used to pre-fill the first estimate (Screen 13)
    estimateTitle: "Residential Roof Replacement",
    lineItems: [
      { name: "Tear-off & haul-away (existing shingles)", qty: 1,  unit: "job",    price: 1200 },
      { name: "Architectural shingles",                   qty: 30, unit: "sq",     price: 145  },
      { name: "Synthetic underlayment & ice/water shield",qty: 30, unit: "sq",     price: 38   },
      { name: "Drip edge, flashing & boots",              qty: 1,  unit: "job",    price: 420  },
      { name: "Labor & installation",                     qty: 32, unit: "hr",     price: 65   },
    ],
  },

  smallCrewCommercial: {
    id: "smallCrewCommercial",
    label: "Small crew commercial",
    accent: "#1A6E9E",
    recordNoun: "project",
    recordNounPlural: "Projects",
    stages: ["Site Survey", "Proposal Sent", "Permitting", "Install", "Invoiced"],
    leadStages: ["Inquiry", "Site Fit", "Estimator Review", "Qualified", "Dormant"],
    leadSourceCategories: ["Property manager", "Bid board", "Referral", "Inbound call"],
    sampleLeads: [
      { ref: "LEAD-4204", title: "Riverside Plaza TPO inquiry", customer: "Riverside Plaza LLC", score: 88, source: "Property manager", status: "Estimator Review", next: "Qualify", address: "1200 Commerce Blvd", cost: 140 },
      { ref: "LEAD-4203", title: "Unit 4 warehouse membrane", customer: "Delta Logistics", score: 73, source: "Bid board", status: "Site Fit", next: "Request roof age", address: "8 Industrial Way", cost: 210 },
      { ref: "LEAD-4201", title: "Medical center flat roof", customer: "Northside Medical", score: 94, source: "Referral", status: "Qualified", next: "Schedule survey", address: "55 Health Pkwy", cost: 65 },
      { ref: "LEAD-4198", title: "Retail strip coating", customer: "Oakwood Retail", score: 69, source: "Inbound call", status: "Inquiry", next: "Call back", address: "410 Market St", cost: 44 },
    ],
    sampleData: [
      { ref: "PRJ-204", title: "Riverside Plaza — TPO Re-Roof", customer: "Riverside Plaza LLC", value: 84200, stage: "Proposal Sent", address: "1200 Commerce Blvd", date: "27 Aug 2026" },
      { ref: "PRJ-203", title: "Unit 4 Warehouse Membrane",     customer: "Delta Logistics",     value: 52600, stage: "Permitting",    address: "8 Industrial Way",   date: "02 Sep 2026" },
      { ref: "PRJ-201", title: "Medical Center Flat Roof",      customer: "Northside Medical",   value: 138900,stage: "Site Survey",   address: "55 Health Pkwy",     date: "—" },
      { ref: "PRJ-198", title: "Retail Strip Coating",          customer: "Oakwood Retail",      value: 21400, stage: "Install",       address: "410 Market St",      date: "14 Aug 2026" },
    ],
    estimateTitle: "Commercial TPO Roof Proposal",
    lineItems: [
      { name: "Mobilization & site protection",       qty: 1,    unit: "job",   price: 3800  },
      { name: "60-mil TPO membrane (mechanically attached)", qty: 180, unit: "sq", price: 285 },
      { name: "Polyiso insulation (R-30)",            qty: 180,  unit: "sq",    price: 210   },
      { name: "Edge metal, flashing & detailing",     qty: 1,    unit: "job",   price: 6400  },
      { name: "Crew labor",                           qty: 240,  unit: "hr",    price: 72    },
    ],
  },

  insuranceRoofing: {
    id: "insuranceRoofing",
    label: "Insurance roofing",
    accent: "#6B1AAA",
    recordNoun: "claim",
    recordNounPlural: "Claims",
    stages: ["Inspection", "Claim Filed", "Adjuster Approved", "Repair Scheduled", "Invoiced"],
    leadStages: ["Storm Lead", "Inspection Booked", "Claim Review", "Qualified", "Drip"],
    leadSourceCategories: ["Storm campaign", "Carrier referral", "Door knocking", "Phone"],
    sampleLeads: [
      { ref: "LEAD-5521", title: "Ramirez hail damage", customer: "Sofia Ramirez", score: 91, source: "Storm campaign", status: "Claim Review", next: "Qualify", address: "77 Cedar Ln", cost: 96 },
      { ref: "LEAD-5519", title: "Thompson wind loss", customer: "Ray Thompson", score: 82, source: "Carrier referral", status: "Inspection Booked", next: "Upload photos", address: "212 Elm St", cost: 42 },
      { ref: "LEAD-5514", title: "Okafor storm damage", customer: "Ada Okafor", score: 75, source: "Door knocking", status: "Storm Lead", next: "Schedule inspection", address: "5 Willow Way", cost: 58 },
      { ref: "LEAD-5510", title: "Patel hail damage", customer: "Nima Patel", score: 87, source: "Phone", status: "Qualified", next: "Send scope", address: "88 Aspen Dr", cost: 31 },
    ],
    sampleData: [
      { ref: "CLM-5521", title: "Hail Damage — Ramirez",  customer: "Sofia Ramirez", carrier: "State Farm",  value: 14300, stage: "Adjuster Approved", address: "77 Cedar Ln",   date: "19 Aug 2026" },
      { ref: "CLM-5519", title: "Wind Loss — Thompson",   customer: "Ray Thompson",  carrier: "Allstate",    value: 9800,  stage: "Claim Filed",       address: "212 Elm St",    date: "—" },
      { ref: "CLM-5514", title: "Storm Damage — Okafor",  customer: "Ada Okafor",    carrier: "Liberty Mutual",value: 22150,stage: "Inspection",        address: "5 Willow Way",  date: "—" },
      { ref: "CLM-5510", title: "Hail Damage — Patel",    customer: "Nima Patel",    carrier: "Farmers",     value: 11600, stage: "Repair Scheduled",  address: "88 Aspen Dr",   date: "23 Aug 2026" },
    ],
    estimateTitle: "Insurance Repair Scope (Xactimate-style)",
    lineItems: [
      { name: "Remove & replace shingles (RCV)",      qty: 28, unit: "sq",  price: 168 },
      { name: "Ridge cap & starter",                  qty: 1,  unit: "job", price: 640 },
      { name: "Drip edge & flashing",                 qty: 1,  unit: "job", price: 380 },
      { name: "Gutter apron / detach & reset",        qty: 1,  unit: "job", price: 510 },
      { name: "Steep & high charge",                  qty: 12, unit: "sq",  price: 22  },
    ],
  },
};

// Map the Screen 5 work-type to a bucket. Residential / Both / Other all fall
// into the owner-operator residential default; Commercial and Insurance branch.
export function bucketForWorkType(workType) {
  if (workType === "commercial") return BUCKETS.smallCrewCommercial;
  if (workType === "insurance")  return BUCKETS.insuranceRoofing;
  return BUCKETS.ownerOperatorResidential; // residential | both | other | undefined
}

export const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
