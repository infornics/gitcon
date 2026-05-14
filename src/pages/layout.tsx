import { Footer, Header } from "@/components/common";
import { type LayoutProps } from "revine";

export default function MainLayout({ children }: LayoutProps) {
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
