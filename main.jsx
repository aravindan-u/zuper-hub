import React from "react";
import ReactDOM from "react-dom/client";
import App from "./profitability-v6.jsx";
import { ZuperShell } from "./zuper-shell.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ZuperShell>
    <App />
  </ZuperShell>
);
