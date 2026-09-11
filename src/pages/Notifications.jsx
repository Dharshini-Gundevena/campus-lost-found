import { useState } from 'react';
import Section from '../components/ui/Section';
import EmptyState from '../components/ui/EmptyState';
import { NOTIFICATIONS } from '../data/staticData';
import './Notifications.css';

const TYPE_META = {
  match:          { icon: '🔗', label: 'Match Found',     color: 'notif--match' },
  claim_approved: { icon: '✅', label: 'Claim Approved',  color: 'notif--approved' },
  claim_rejected: { icon: '❌', label: 'Claim Rejected',  color: 'notif--rejected' },
  new_found:      { icon: '📦', label: 'New Found Item',  color: 'notif--found' },
  reminder:       { icon: '⏰', label: 'Reminder',        color: 'notif--reminder' },
};

const FILTER_TABS = [
  { key: 'all',    label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read',   label: 'Read' },
];

export default function Notifications() {
  const [items, setItems]     = useState(NOTIFICATIONS);
  const [filter, setFilter]   = useState('all');

  const unreadCount = items.filter(n => !n.read).length;

  const visible = filter === 'all'
    ? items
    : filter === 'unread'
      ? items.filter(n => !n.read)
      : items.filter(n =>  n.read);

  function markRead(id) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  function dismiss(id) {
    setItems(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="notif-page">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="notif__hero">
        <div className="container notif__hero-inner">
          <div>
            <h1 className="notif__hero-title">
              Notifications
              {unreadCount > 0 && (
                <span className="notif__unread-badge" aria-label={`${unreadCount} unread`}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="notif__hero-sub">Stay up to date on your lost &amp; found activity.</p>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn--outline btn--sm" onClick={markAllRead}>
              ✓ Mark all as read
            </button>
          )}
        </div>
      </div>

      <Section noPadTop>
        {/* ── Filter tabs ─────────────────────────────────────── */}
        <div className="notif__tabs" role="tablist">
          {FILTER_TABS.map(t => {
            const count = t.key === 'all'
              ? items.length
              : t.key === 'unread'
                ? items.filter(n => !n.read).length
                : items.filter(n => n.read).length;

            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={filter === t.key}
                className={`notif__tab ${filter === t.key ? 'notif__tab--active' : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
                <span className="notif__tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Notification list ───────────────────────────────── */}
        {visible.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            message={
              filter === 'unread'
                ? "You're all caught up — no unread notifications."
                : "Nothing to show here."
            }
          />
        ) : (
          <ul className="notif__list" aria-label="Notification list">
            {visible.map(notif => {
              const meta = TYPE_META[notif.type] ?? { icon: '🔔', label: 'Notification', color: '' };
              return (
                <li
                  key={notif.id}
                  className={`notif__item ${meta.color} ${notif.read ? 'notif__item--read' : ''}`}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="notif__dot" aria-label="Unread" />
                  )}

                  {/* Icon */}
                  <span className="notif__icon" aria-hidden="true">{meta.icon}</span>

                  {/* Body */}
                  <div className="notif__body">
                    <span className="notif__type-label">{meta.label}</span>
                    <p className="notif__message">{notif.message}</p>
                    <span className="notif__time">{notif.time}</span>
                  </div>

                  {/* Actions */}
                  <div className="notif__actions">
                    {!notif.read && (
                      <button
                        className="notif__action-btn"
                        title="Mark as read"
                        aria-label="Mark as read"
                        onClick={() => markRead(notif.id)}
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="notif__action-btn notif__action-btn--dismiss"
                      title="Dismiss"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(notif.id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* ── Legend ──────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="notif__legend">
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <span key={key} className="notif__legend-item">
                <span aria-hidden="true">{meta.icon}</span> {meta.label}
              </span>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
