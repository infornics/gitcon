import { useEffect } from "react";
import { Footer, Header } from "@/components/common";
import { type LayoutProps, useLocation } from "revine";
import ReactGA from "react-ga4";

export default function MainLayout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    const measurementId = (import.meta as any).env.REVINE_PUBLIC_GA_MEASUREMENT_ID;
    if (measurementId && measurementId !== "your_ga4_measurement_id_here") {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
        title: document.title,
      });
    }
  }, [location]);

  return (
    <div className="page-shell-wrapper">
      <div className="page-shell">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
