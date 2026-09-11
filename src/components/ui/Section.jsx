import './Section.css';

/**
 * Page section wrapper with optional title, subtitle, and header action.
 * Props:
 *   title      – section heading
 *   subtitle   – muted sub-text beneath the heading
 *   action     – JSX rendered on the right of the heading row (e.g. a button/link)
 *   noPadTop   – removes top padding (useful when stacking sections)
 *   className  – extra classes on the outer element
 *   children
 */
export default function Section({ title, subtitle, action, noPadTop = false, className = '', children }) {
  const cls = ['section', noPadTop ? 'section--no-pad-top' : '', className].filter(Boolean).join(' ');

  return (
    <section className={cls}>
      <div className="container">
        {(title || action) && (
          <div className="section__header">
            <div className="section__heading-group">
              {title    && <h2 className="section__title">{title}</h2>}
              {subtitle && <p  className="section__subtitle">{subtitle}</p>}
            </div>
            {action && <div className="section__action">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
