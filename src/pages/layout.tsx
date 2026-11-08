import { useEffect } from "react";
import { Footer, Header } from "@/components/common";
import { type LayoutProps, useLocation } from "revine";
import ReactGA from "react-ga4";

export default function MainLayout({ children }: LayoutProps) {
  const location = useLocation();
  const isReadmeStudio = location.pathname === "/readme";

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
    <div className={`page-shell-wrapper ${isReadmeStudio ? "h-screen overflow-hidden flex flex-col" : ""}`}>
      <div className={`page-shell ${isReadmeStudio ? "h-full flex flex-col overflow-hidden" : ""}`}>
        <Header />
        {isReadmeStudio ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden pb-4">
            {children}
          </div>
        ) : (
          <>
            {children}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
