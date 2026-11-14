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
              >
                <defs>
                  <linearGradient id="ftr-solid-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5EEAD4" />
                    <stop offset="60%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0F766E" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#ftr-solid-g)"
                  fillRule="evenodd"
                  d="M 12 2.5 C 17.247 2.5 21.5 6.753 21.5 12 C 21.5 12.8 21.4 13.5 21.2 14.2 L 17.2 14.2 C 17.4 13.5 17.5 12.8 17.5 12 C 17.5 8.962 15.038 6.5 12 6.5 C 8.962 6.5 6.5 8.962 6.5 12 C 6.5 15.038 8.962 17.5 12 17.5 C 13.8 17.5 15.3 16.7 16.3 15.4 L 12 15.4 L 12 11.4 L 20.8 11.4 C 20.9 11.6 21 11.8 21 12 C 21 16.971 16.971 21.5 12 21.5 C 6.753 21.5 2.5 17.247 2.5 12 C 2.5 6.753 6.753 2.5 12 2.5 Z"
                />
                <circle cx="12" cy="12" r="1.8" fill="#FFFFFF" />
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
