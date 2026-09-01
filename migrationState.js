// Shared onboarding + data-migration state, persisted in localStorage so the
// migration a user kicks off on the onboarding success screen can keep being
// tracked on the dashboard after we route them to the homepage.

const KEY = "zuperOnboardingState";
export const MIGRATION_DURATION_MS = 120000; // 2 minutes

export function readOnboardingState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy-mode errors — this is a prototype */
  }
}

// Called when the user chooses "Start data migration" (success screen or the
// dashboard line item).
export function startMigration({ source, profile } = {}) {
  const prev = readOnboardingState();
  write({
    completed: true,
    phase: (prev && prev.phase) || 1,
    profile: profile || (prev && prev.profile) || null,
    migration: { status: "running", source: source || (prev && prev.migration && prev.migration.source) || "", startedAt: Date.now(), durationMs: MIGRATION_DURATION_MS },
  });
}

// Called when the user dismisses migration and heads straight to the homepage.
// Migration becomes a pending line item on the dashboard they can start later.
export function completeOnboardingNoMigration({ source, profile } = {}) {
  const prev = readOnboardingState();
  write({ completed: true, phase: (prev && prev.phase) || 1, profile: profile || (prev && prev.profile) || null, migration: { status: "skipped", source: source || "" } });
}

// The captured user/company profile (first name, company, logo), used to
// personalize the post-onboarding homepage.
export function readProfile() {
  const s = readOnboardingState();
  return (s && s.profile) || null;
}

// Card-on-file status for the Getting Started journey: "none" | "added" | "skipped".
export function readCardStatus() {
  const s = readOnboardingState();
  return (s && s.card) || "none";
}

export function setCardStatus(status) {
  const s = readOnboardingState() || { completed: true };
  write({ ...s, card: status });
}

// Which setup phase the dashboard journey is on (1–4). Persisted so "Next phase"
// survives reloads.
export function readPhase() {
  const s = readOnboardingState();
  return (s && s.phase) || 1;
}

export function setPhase(phase) {
  const s = readOnboardingState() || { completed: true };
  write({ ...s, phase });
}

// Derive live progress from stored state. `nowMs` is injectable so a component
// can pass a ticking clock value to force re-renders while migrating.
export function migrationProgress(state, nowMs = Date.now()) {
  const m = state && state.migration;
  if (!m || m.status === "skipped") {
    return { active: false, done: false, pct: 0, skipped: true, source: (m && m.source) || "" };
  }
  const duration = m.durationMs || MIGRATION_DURATION_MS;
  const pct = Math.max(0, Math.min(1, (nowMs - m.startedAt) / duration));
  return { active: pct < 1, done: pct >= 1, pct, skipped: false, source: m.source || "" };
}
