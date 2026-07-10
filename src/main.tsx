import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "../App";
import "./index.css";
import "./styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
);
