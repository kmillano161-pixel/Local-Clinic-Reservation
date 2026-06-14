import { useEffect, useMemo, useState } from 'react'


const pad2 = (n) => String(n).padStart(2, '0')

function toISODate(d) {
  const year = d.getFullYear()
  const month = pad2(d.getMonth() + 1)
  const day = pad2(d.getDate())
  return `${year}-${month}-${day}`
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

/**
 * Lightweight calendar UI.
 *
 * Props:
 * - initialDate: Date|string (optional)
 * - eventsByDate: { [isoDate]: { title: string, meta?: string } | Array<...> }
 * - onSelectDate: (isoDate) => void
 */
export default function Calendar({
  initialDate = new Date(),
  eventsByDate,
  onSelectDate,
}) {
  const init = useMemo(() => {
    if (initialDate instanceof Date) return initialDate
    if (typeof initialDate === 'string' || typeof initialDate === 'number') {
      const d = new Date(initialDate)
      if (!Number.isNaN(d.getTime())) return d
    }
    return new Date()
  }, [initialDate])

  const [viewDate, setViewDate] = useState(() => startOfMonth(init))
  const [selectedISO, setSelectedISO] = useState(() => toISODate(init))

  // Local notes by ISO date (demo-only)
  const [notes, setNotes] = useState(() => {
    try {
      const raw = window.localStorage.getItem('clinic_calendar_notes')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('clinic_calendar_notes', JSON.stringify(notes))
    } catch {
      // ignore
    }
  }, [notes])


  const monthLabel = useMemo(() => {
    return viewDate.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    })
  }, [viewDate])

  const days = useMemo(() => {
    const first = startOfMonth(viewDate)
    const year = first.getFullYear()
    const month = first.getMonth()

    // Week starts on Monday (1) to Sunday (0)
    const weekday = (first.getDay() + 6) % 7 // convert: Mon=0..Sun=6
    const gridStart = new Date(year, month, 1 - weekday)

    const cells = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      const iso = toISODate(d)
      cells.push({
        date: d,
        iso,
        inMonth: d.getMonth() === month,
      })
    }

    return cells
  }, [viewDate])

  const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const todayISO = useMemo(() => toISODate(new Date()), [])

  const getEventSummary = (iso) => {
    const payload = eventsByDate?.[iso]
    if (!payload) return null
    const asArray = Array.isArray(payload) ? payload : [payload]
    const first = asArray[0]
    if (!first) return null
    return {
      count: asArray.length,
      title: first.title ?? 'Event',
      meta: first.meta,
    }
  }

  return (
    <section className="cal" aria-label="Calendar">
      <div className="cal__top">
        <button
          type="button"
          className="cal__nav"
          aria-label="Previous month"
          onClick={() => setViewDate((d) => addMonths(d, -1))}
        >
          ‹
        </button>
        <div className="cal__month" aria-live="polite">
          {monthLabel}
        </div>
        <button
          type="button"
          className="cal__nav"
          aria-label="Next month"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
        >
          ›
        </button>
      </div>

      <div className="cal__dow" role="row">
        {dow.map((label) => (
          <div key={label} className="cal__dowCell" role="columnheader">
            {label}
          </div>
        ))}
      </div>

      <div className="cal__grid" role="grid">
        {days.map(({ iso, inMonth, date }) => {
          const isSelected = iso === selectedISO
          const isToday = iso === todayISO
          const summary = getEventSummary(iso)

          return (
            <button
              key={iso}
              type="button"
              className={[
                'cal__cell',
                inMonth ? '' : 'cal__cell--muted',
                isToday ? 'cal__cell--today' : '',
                isSelected ? 'cal__cell--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="gridcell"
              aria-selected={isSelected}
              onClick={() => {
                setSelectedISO(iso)
                if (onSelectDate) onSelectDate(iso)
              }}
              title={summary ? `${iso} — ${summary.title}` : iso}
            >
              <span className="cal__day">{date.getDate()}</span>
              {summary ? (
                <span className="cal__dotWrap" aria-hidden="true">
                  <span className="cal__dot" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Notes panel (for the selected day) */}
      <div className="cal__notes" aria-live="polite">
        <div className="cal__notesHeader">
          <span className="cal__notesTitle">Notes for</span>
          <span className="cal__notesDate">{selectedISO}</span>
        </div>

        <div className="cal__notesBody">
          <textarea
            className="cal__textarea"
            rows={3}
            value={notes[selectedISO] ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setNotes((prev) => ({ ...prev, [selectedISO]: v }))
            }}
            placeholder="Add a note for this date..."
          />

          <div className="cal__notesHint">Saved locally for demo purposes.</div>
        </div>
      </div>

      <div className="cal__legend" aria-live="polite">
        <div className="cal__legendLine">
          <span className="cal__pill cal__pill--today">Today</span>
          <span className="cal__pill cal__pill--selected">Selected</span>
        </div>
      </div>


      <style>{`
        .cal {
          width: 100%;
          max-width: 420px;

          border: 1px solid var(--border);
          border-radius: 14px;
          margin-left: 10px;
          margin-bottom: 20px;
          padding: 10px;
          box-sizing: border-box;
          background: rgb(255, 255, 255);
        }

        .cal__top {
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }

        .cal__month {
          font-family: var(--heading);
          font-weight: 600;
          color: var(--text-h);
          text-align: center;
          letter-spacing: -0.2px;
        }

        .cal__nav {
          width: 44px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(127, 127, 127, 0.04);
          color: var(--text-h);
          cursor: pointer;
          transition: box-shadow 0.25s, border-color 0.25s, background 0.25s;
        }

        .cal__nav:hover {
          background: rgba(127, 127, 127, 0.07);
          box-shadow: var(--shadow);
          border-color: var(--accent-border);
        }

        .cal__dow {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          padding: 8px 6px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 8px;
        }

        .cal__dowCell {
          font-size: 12px;
          color: var(--text);
          text-align: center;
          user-select: none;
          font-family: var(--mono);
        }

        .cal__grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .cal__cell {
          height: 48px;
          border-radius: 10px;

          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          color: var(--text-h);
        }

        .cal__cell:hover {
          border-color: var(--border);
          background: rgba(127, 127, 127, 0.05);
          box-shadow: var(--shadow);
        }

        .cal__cell--muted {
          opacity: 0.45;
        }

        .cal__day {
          font-family: var(--mono);
          font-size: 14px;
          line-height: 1;
        }

        .cal__dotWrap {
          height: 6px;
          display: grid;
          place-items: center;
        }

        .cal__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }

        .cal__cell--today {
          border-color: var(--accent-border);
        }

        .cal__cell--selected {
          border-color: var(--accent);
          background: var(--accent-bg);
        }

        .cal__legend {
          margin-top: 12px;
          display: flex;
          justify-content: center;
        }

        .cal__legendLine {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .cal__pill {
          font-family: var(--mono);
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--text);
          background: rgba(127, 127, 127, 0.04);
          user-select: none;
        }

        .cal__pill--today {
          border-color: var(--accent-border);
          color: var(--accent);
        }

        .cal__pill--selected {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-bg);
        }

        @media (max-width: 520px) {
          .cal {
            padding: 10px;
            max-width: 360px;
          }
          .cal__cell {
            height: 42px;
            border-radius: 10px;
          }

          .cal__notes {
            max-width: 360px;
          }
        }

      `}</style>
    </section>
  )
}

