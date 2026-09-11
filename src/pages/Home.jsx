import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { ItemCard } from '../components/ui/Card';
import { LOST_ITEMS, FOUND_ITEMS } from '../data/staticData';
import './Home.css';

const QUICK_LINKS = [
  {
    to: '/report-lost',
    icon: '🔍',
    label: 'Report Lost Item',
    desc: "Let the community know what you've lost.",
    color: 'ql--lost',
  },
  {
    to: '/report-found',
    icon: '🤝',
    label: 'Report Found Item',
    desc: 'Hand in something you found on campus.',
    color: 'ql--found',
  },
  {
    to: '/browse',
    icon: '📋',
    label: 'Browse All Items',
    desc: 'Search through lost and found listings.',
    color: 'ql--browse',
  },
  {
    to: '/claims',
    icon: '📝',
    label: 'My Claims',
    desc: 'Track the status of your submitted claims.',
    color: 'ql--claims',
  },
];

const STATS = [
  { value: '42', label: 'Items Lost' },
  { value: '38', label: 'Items Found' },
  { value: '17', label: 'Matched' },
  { value: '9',  label: 'Pending Claims' },
];

export default function Home() {
  const recentLost  = LOST_ITEMS.slice(0, 3);
  const recentFound = FOUND_ITEMS.slice(0, 3);

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow">Campus Lost &amp; Found</span>
            <h1 className="hero__heading">
              Lost something?<br />
              We'll help you find it.
            </h1>
            <p className="hero__sub">
              Report lost or found items, browse listings, and get matched — all in one place for our campus community.
            </p>
            <div className="hero__cta">
              <Link to="/report-lost"  className="btn btn--primary">Report Lost Item</Link>
              <Link to="/report-found" className="btn btn--outline">Report Found Item</Link>
            </div>
          </div>
          <div className="hero__emoji" aria-hidden="true">🎒</div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="container stats-bar__inner">
          {STATS.map(s => (
            <div key={s.label} className="stats-bar__item">
              <span className="stats-bar__value">{s.value}</span>
              <span className="stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────────── */}
      <Section title="What would you like to do?" subtitle="Get started with one of the options below.">
        <div className="quick-links">
          {QUICK_LINKS.map(ql => (
            <Link key={ql.to} to={ql.to} className={`quick-link ${ql.color}`}>
              <span className="quick-link__icon" aria-hidden="true">{ql.icon}</span>
              <div>
                <p className="quick-link__label">{ql.label}</p>
                <p className="quick-link__desc">{ql.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── Recent Lost ───────────────────────────────────────── */}
      <Section
        title="Recently Lost"
        subtitle="Latest items reported lost on campus."
        action={<Link to="/browse" className="btn btn--outline btn--sm">View all →</Link>}
      >
        <div className="home__grid">
          {recentLost.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </Section>

      {/* ── Recent Found ──────────────────────────────────────── */}
      <Section
        title="Recently Found"
        subtitle="Items that have been turned in recently."
        action={<Link to="/browse" className="btn btn--outline btn--sm">View all →</Link>}
      >
        <div className="home__grid">
          {recentFound.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </Section>

      {/* ── How it works ──────────────────────────────────────── */}
      <Section title="How It Works" subtitle="Three simple steps to recover your belongings.">
        <div className="how-it-works">
          {[
            { step: '1', icon: '📝', title: 'Report', desc: 'Submit a lost or found report with a description and location.' },
            { step: '2', icon: '🔎', title: 'Match',  desc: 'Our system compares reports to find potential matches.' },
            { step: '3', icon: '🎉', title: 'Claim',  desc: 'Claim your matched item and collect it from the designated office.' },
          ].map(s => (
            <div key={s.step} className="how-step">
              <span className="how-step__num">{s.step}</span>
              <span className="how-step__icon" aria-hidden="true">{s.icon}</span>
              <h3 className="how-step__title">{s.title}</h3>
              <p  className="how-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
