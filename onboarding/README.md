# Zuper self-serve onboarding — prototype

A working, click-through prototype of Zuper's self-serve onboarding for small roofing
businesses: **sign-up → landing in a populated dashboard with a real first action done.**
No backend, no real auth, no password anywhere — just local React state + mock data.

## Run it

It rides on the existing `zuper-hub` Vite app (React 18 + Vite 6 + lucide-react), so no
extra install is needed. From the `zuper-hub/` folder:

```bash
node node_modules/vite/bin/vite.js --port 5180 --host 127.0.0.1
```

Then open **http://127.0.0.1:5180/onboarding.html**
(`pnpm dev` is avoided here — see the repo notes; run Vite's binary directly.)

The app shell also exposes two top-bar launch buttons:

- **Option 1 setup**: `#/onboarding`, the original full setup flow.
- **Option 2 Zuper setup**: `#/lead-hub-onboarding`, the overall Zuper onboarding flow.

## The 14 screens

| # | Screen | Notes |
|---|--------|-------|
| 1 | Welcome | CEO video-style welcome popup + single continue |
| 2 | Sign up | passwordless email only — **no password field** |
| 3 | Verify by code | 6-box code, accepts any 6 chars (dev hint shows `123456`) |
| 4 | Name & phone | continue disabled until all filled |
| 5 | Kind of work | single-select; **Other** reveals a free-text field; drives the bucket |
| 6 | Branching follow-up | question **changes based on screen 5** (insurance vs residential/both vs commercial vs other) |
| 7 | What should work first | drives the guided first action on screen 13 |
| 8 | Company size | live **schedule preview** that adds crew rows as size grows |
| 9 | Company name & branding | live **estimate preview**; auto-generates a logo from initials if none uploaded |
| 10 | Import or connect | "Skip for now" → **confirmation modal** before proceeding |
| 11 | Start trial | "14-day free trial, no credit card" — no plan comparison here |
| 12 | Live dashboard | never empty: pre-seeded bucket sample data + quiet **"Help & first steps 1/6"** sidebar item + dismissible product-tour modal |
| 13 | Guided first action | routes by screen 7 answer, template pre-filled from the bucket; the "first win" |
| 14 | Plan/trial modal | **deferred** — only appears after the first action; dismissible, not a paywall |

Cross-cutting: a **support widget** (Ask Zuper / chat / ticket / book time) sits bottom-right on
every screen; a thin **top progress bar** runs screens 1–11 and switches to the quiet sidebar
checklist once inside the product (12+); everything is responsive (the live-preview column
collapses under ~820px).

The flow can be launched either from `/onboarding.html` directly, from the home-page setup
banner, or from the persistent **Option 1 setup** button in the app top bar.

## Option 2: overall Zuper onboarding

`LeadHubOnboardingApp.jsx` adds a second prototype route for the overall setup strategy:

- email validation as the first step, with a Welcome to Zuper popup
- name, phone, and role capture (`IT Admin`, `CEO`, `Other`)
- grouped onboarding sections based on the self-service MVP map: Work setup, People and delivery, Catalog and pricing, and Platforms
- Work setup collects website-derived logo/name/services, insurance/non-insurance mode as part of the services question, and business hours
- no Hub picker, migration branch, duplicate work-type question, or lead-source attribution step in this setup flow
- after Work setup inputs are filled, the live preview shows default generation progress plus a job-category tree with linked statuses
- Catalog and pricing includes proposal setup, materials/manufacturers, and Intelligent quoting by existing-proposal upload with a skip path for later setup
- Platforms asks for finance/CRM integrations (`QBO`, `HubSpot`) and existing communication platform
- three proposal paths: upload an existing proposal, choose a template, or skip
- late optional teammate invite with business roles
- final recap with generated services, workflow, products, proposal starting point, and teammates
- primary final action: **Open Zuper workspace**
- workspace landing screen with a setup dashboard for reviewing job categories/statuses and configuring integrations
- optional Sales, Production, and Finance hand-off cards triggered by workflow actions

## The bucket / config system  ← read this to add a 4th trade

Everything trade-specific lives in **`buckets.js`**. A *bucket* is one object that owns:

- `stages` — the pipeline/kanban columns
- `sampleData` — the 3–5 records pre-seeded into the dashboard (screen 12)
- `lineItems` + `estimateTitle` — the template used to pre-fill the first estimate (screen 13)
- `recordNoun` / `recordNounPlural`, `accent`, `label`

The work-type chosen on screen 5 maps to exactly one bucket via **`bucketForWorkType(workType)`**.
Three buckets ship today:

| Work type (screen 5) | Bucket |
|----------------------|--------|
| Residential / Both / Other | `ownerOperatorResidential` |
| Commercial | `smallCrewCommercial` |
| Insurance roofing | `insuranceRoofing` |

Every downstream screen reads from the one returned bucket — so the sample data on screen 12
and the template on screen 13 change automatically when the screen-5 answer changes.

### Add a 4th bucket without touching flow logic

1. Add an entry to `BUCKETS` in `buckets.js` (copy an existing one, change the fields).
2. Add a case to `bucketForWorkType` mapping a work-type id to it — **or** add a new
   work-type to `WORK_TYPES` and map it.

That's it. No screen component needs to change: the wizard, dashboard, and first-action
builder all render from whatever the bucket provides.

## Files

```
onboarding.html          entry (served at /onboarding.html)
onboarding/main.jsx      React mount
onboarding/OnboardingApp.jsx   the 14-screen state machine + live product
onboarding/buckets.js    bucket config + work-type / priority / size lists  ← extend here
onboarding/ui.jsx        theme tokens + reusable primitives (Btn, Field, Modal, SupportWidget…)
```

## Acceptance criteria — how this prototype meets them

- ✅ Screen 1 → 14 with no dead ends, mock data only.
- ✅ Changing the screen-5 answer changes the screen-6 question, screen-12 sample data, and screen-13 template (all driven by the bucket).
- ✅ Skipping import (screen 10) always shows the confirmation modal first.
- ✅ No password field anywhere.
- ✅ The dashboard (screen 12) is never empty on first load.
