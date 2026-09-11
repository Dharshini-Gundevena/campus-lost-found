import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-icon">🎒</span>
          <span className="footer__brand-name">Campus Lost &amp; Found</span>
          <p className="footer__tagline">Helping the campus community reconnect with their belongings.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <p className="footer__nav-heading">Quick Links</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse Items</Link></li>
            <li><Link to="/report-lost">Report Lost</Link></li>
            <li><Link to="/report-found">Report Found</Link></li>
          </ul>
        </nav>

        <nav className="footer__nav" aria-label="Footer account links">
          <p className="footer__nav-heading">Account</p>
          <ul>
            <li><Link to="/claims">My Claims</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            <li><Link to="/admin">Admin Panel</Link></li>
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>&copy; {year} Campus Lost &amp; Found. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
