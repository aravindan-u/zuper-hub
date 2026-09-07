import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./profitability-v6.jsx";
import { ZuperShell } from "./zuper-shell.jsx";
import OnboardingApp from "./onboarding/OnboardingApp.jsx";
import LeadHubOnboardingApp from "./onboarding/LeadHubOnboardingApp.jsx";
import LoginFirstOnboardingApp from "./onboarding/LoginFirstOnboardingApp.jsx";
import HomeAfterOnboarding from "./home-after-onboarding.jsx";
import SenseHome from "./sense-home.jsx";

// Simple hash router. Opening the link lands on the product home page; the
// setup flow lives at #/setup, and the other onboarding options keep their routes.
function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  // After onboarding, land on the new sidebar-less homepage (#/home) rather than
  // the full product shell.
  const toHome = () => { window.location.hash = "#/home"; };

  if (hash === "#/setup") {
    return <LoginFirstOnboardingApp onExit={toHome} />;
  }
  if (hash === "#/home") {
    return <SenseHome />;
  }
  if (hash === "#/home-onboarding") {
    return <HomeAfterOnboarding />;
  }
  if (hash === "#/onboarding") {
    return <OnboardingApp onExit={toHome} />;
  }
  if (hash === "#/lead-hub-onboarding") {
    return <LeadHubOnboardingApp onExit={toHome} />;
  }
  return (
    <ZuperShell>
      <App />
    </ZuperShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
