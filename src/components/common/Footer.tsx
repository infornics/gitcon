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
            <h4>Platform</h4>
            <Link href="/">Dashboard</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </div>
          <div className="footer-group">
            <h4>Resources</h4>
            <a
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub API
            </a>
            <a
              href="https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribution Rules
            </a>
          </div>
          <div className="footer-group">
            <h4>Connect</h4>
            <a
              href="https://github.com/infornics"
              target="_blank"
              rel="noopener noreferrer"
            >
              Infornics
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © {currentYear} Gitcon. All rights reserved.
        </div>
        <div className="made-with">
          Built in <span className="text-primary">✦</span> India
        </div>
      </div>
    </footer>
  );
}
