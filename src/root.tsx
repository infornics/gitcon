import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "revine";
import { router } from "revine/routing";
import ReactGA from "react-ga4";
import "./styles/global.css";

const measurementId = (import.meta as any).env.REVINE_PUBLIC_GA_MEASUREMENT_ID;
if (measurementId && measurementId !== "your_ga4_measurement_id_here") {
  ReactGA.initialize(measurementId);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
}

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);