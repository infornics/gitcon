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
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="ftr-g-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5EEAD4" />
                    <stop offset="100%" stopColor="#38A3A5" />
                  </linearGradient>
                </defs>
                <path
                  d="M 18.5 7 A 8.5 8.5 0 1 0 18.5 17 L 18.5 12 L 12 12"
                  stroke="url(#ftr-g-grad)"
                  strokeWidth="2.4"
                />
                <circle cx="18.5" cy="7" r="2.2" fill="#171614" stroke="#5EEAD4" strokeWidth="2" />
                <circle cx="12" cy="12" r="2.2" fill="#5EEAD4" />
                <rect x="13" y="15" width="2.8" height="2.8" rx="0.8" fill="#38A3A5" opacity="0.8" />
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
