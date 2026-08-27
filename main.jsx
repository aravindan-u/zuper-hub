import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./profitability-v6.jsx";
import { ZuperShell } from "./zuper-shell.jsx";
import OnboardingApp from "./onboarding/OnboardingApp.jsx";
import LeadHubOnboardingApp from "./onboarding/LeadHubOnboardingApp.jsx";
import LoginFirstOnboardingApp from "./onboarding/LoginFirstOnboardingApp.jsx";

// Simple hash router. Opening the link lands on the onboarding landing page;
// the product shell lives at #/app, and the other onboarding options keep their routes.
function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const toApp = () => { window.location.hash = "#/app"; };

  if (hash === "#/app") {
    return (
      <ZuperShell>
        <App />
      </ZuperShell>
    );
  }
  if (hash === "#/onboarding") {
    return <OnboardingApp onExit={toApp} />;
  }
  if (hash === "#/lead-hub-onboarding") {
    return <LeadHubOnboardingApp onExit={toApp} />;
  }
  return <LoginFirstOnboardingApp onExit={toApp} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
