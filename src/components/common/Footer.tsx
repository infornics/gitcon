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
                  <linearGradient id="ftr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5EEAD4" />
                    <stop offset="100%" stopColor="#38A3A5" />
                  </linearGradient>
                </defs>
                <line x1="7.5" y1="6" x2="7.5" y2="18" stroke="url(#ftr-grad)" strokeWidth="2.2" />
                <path d="M7.5 13.5 C 7.5 8.5, 16.5 10.5, 16.5 6" fill="none" stroke="url(#ftr-grad)" strokeWidth="2.2" />
                <circle cx="7.5" cy="6" r="2.5" fill="#171614" stroke="#5EEAD4" strokeWidth="2" />
                <circle cx="7.5" cy="18" r="2.5" fill="#171614" stroke="#38A3A5" strokeWidth="2" />
                <circle cx="16.5" cy="6" r="2.5" fill="#5EEAD4" />
                <rect x="13" y="13" width="3" height="3" rx="1" fill="#38A3A5" opacity="0.4" />
                <rect x="17.5" y="13" width="3" height="3" rx="1" fill="#38A3A5" opacity="0.7" />
                <rect x="13" y="17.5" width="3" height="3" rx="1" fill="#38A3A5" opacity="0.6" />
                <rect x="17.5" y="17.5" width="3" height="3" rx="1" fill="#5EEAD4" />
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
