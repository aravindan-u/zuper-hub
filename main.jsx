import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./profitability-v6.jsx";
import { ZuperShell } from "./zuper-shell.jsx";
import OnboardingApp from "./onboarding/OnboardingApp.jsx";
import LeadHubOnboardingApp from "./onboarding/LeadHubOnboardingApp.jsx";
import LoginFirstOnboardingApp from "./onboarding/LoginFirstOnboardingApp.jsx";

// Simple hash router: onboarding flows render full-screen, outside the app shell.
function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  if (hash === "#/onboarding") {
    return <OnboardingApp onExit={() => { window.location.hash = ""; }} />;
  }
  if (hash === "#/lead-hub-onboarding") {
    return <LeadHubOnboardingApp onExit={() => { window.location.hash = ""; }} />;
  }
  if (hash === "#/login-first-onboarding") {
    return <LoginFirstOnboardingApp onExit={() => { window.location.hash = ""; }} />;
  }
  return (
    <ZuperShell>
      <App />
    </ZuperShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
