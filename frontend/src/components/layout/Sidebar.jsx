import { useMemo } from 'react'

/**
 * Simple app sidebar.
 *
 * Props:
 * - items: [{ label, href, icon }]
 * - onNavigate: (href) => void
 */
export default function Sidebar({
  items = [
    { label: 'Home', href: '#', icon: '🏠' },
    { label: 'Appointments', href: '#', icon: '🗓️' },
    { label: 'Patients', href: '#', icon: '🧑‍⚕️' },
    { label: 'Reports', href: '#', icon: '📊' },
    { label: 'Settings', href: '#', icon: '⚙️' },
  ],
  onNavigate,
}) {
  const normalizedItems = useMemo(() => items?.filter(Boolean) ?? [], [items])

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brandMark" aria-hidden="true">
            ◼
          </span>
          <span className="sidebar__brandName">Clinic</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        <ul className="sidebar__list">
          {normalizedItems.map((item) => {
            const href = item.href ?? '#'
            return (
              <li key={item.label} className="sidebar__item">
                <a
                  className="sidebar__link"
                  href={href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault()
                      onNavigate(href)
                    }
                  }}
                >
                  {item.icon ? (
                    <span className="sidebar__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="sidebar__label">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar__footer" aria-hidden="true">
        <span className="sidebar__hint">Care, simplified.</span>
      </div>

      <style>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 240px;
          max-width: 80vw;
          padding: 16px;
          border-right: 1px solid var(--border);
          box-sizing: border-box;
        }

        .sidebar__header {
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }

        .sidebar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          user-select: none;
        }

        .sidebar__brandMark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: var(--accent-bg);
          color: var(--accent);
          border: 1px solid var(--accent-border);
          font-size: 16px;
        }

        .sidebar__brandName {
          font-family: var(--heading);
          font-weight: 600;
          color: var(--text-h);
          letter-spacing: -0.2px;
        }

        .sidebar__nav {
          flex: 1;
          min-height: 0;
        }

        .sidebar__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar__link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-h);
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: box-shadow 0.25s, border-color 0.25s, background 0.25s;
        }

        .sidebar__link:hover {
          background: rgba(127, 127, 127, 0.06);
          border-color: var(--border);
          box-shadow: var(--shadow);
        }

        .sidebar__icon {
          width: 22px;
          display: inline-flex;
          justify-content: center;
          opacity: 0.95;
        }

        .sidebar__label {
          font-size: 16px;
          white-space: nowrap;
        }

        .sidebar__footer {
          padding-top: 8px;
          border-top: 1px solid var(--border);
        }

        .sidebar__hint {
          font-size: 13px;
          color: var(--text);
          opacity: 0.9;
          display: block;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
    </aside>
  )
}

