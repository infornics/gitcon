import { Link } from "revine";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label="Gitcon home">
            <div className="brand-mark" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="5" height="16" rx="2"></rect>
                <rect x="10" y="9" width="5" height="11" rx="2"></rect>
                <path d="M17 14a4 4 0 1 1 4 4h-2"></path>
              </svg>
            </div>
            <strong className="text-lg">Gitcon</strong>
          </Link>
          <p className="footer-tagline">
            High-fidelity GitHub analytics for modern developers.
          </p>
        </div>

        <div className="footer-nav">
          <div className="footer-group">
            <h4>Company</h4>
            <Link
              href="https://infornics.com/marketplace"
              target="_blank"
              rel="noopener noreferrer"
            >
              Infornics Marketplace
            </Link>
            <Link
              href="https://infornics.com/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Us
            </Link>
            <Link
              href="https://github.com/infornics/gitcon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gitcon Github
            </Link>
          </div>
          <div className="footer-group">
            <h4>Connect</h4>
            <Link
              href="https://www.linkedin.com/company/infornics"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <Link
              href="https://instagram.com/infornicsofficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
            <Link
              href="https://infornics.com/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © {currentYear} Gitcon. All rights reserved.
        </div>
        <div className="made-with">
          Built by Infornics <span className="text-primary">✦</span> in India
        </div>
      </div>
    </footer>
  );
}
