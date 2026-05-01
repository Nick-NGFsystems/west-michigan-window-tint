'use client'

interface Props {
  selected: Set<string>
  onChange: (windows: Set<string>) => void
}

const WINDOWS = [
  { id: 'windshield',           label: 'Windshield' },
  { id: 'driver-front',         label: 'Driver Front' },
  { id: 'passenger-front',      label: 'Passenger Front' },
  { id: 'driver-rear',          label: 'Driver Rear' },
  { id: 'passenger-rear',       label: 'Passenger Rear' },
  { id: 'driver-quarter',       label: 'Driver Quarter' },
  { id: 'passenger-quarter',    label: 'Passenger Quarter' },
  { id: 'rear-window',          label: 'Rear Window' },
]

function toggle(set: Set<string>, id: string): Set<string> {
  const next = new Set(set)
  next.has(id) ? next.delete(id) : next.add(id)
  return next
}

export default function CarWindowSelector({ selected, onChange }: Props) {
  const all = WINDOWS.map(w => w.id)
  const allSelected = all.every(id => selected.has(id))

  function windowProps(id: string) {
    const active = selected.has(id)
    return {
      onClick: () => onChange(toggle(selected, id)),
      style: {
        fill: active ? 'rgba(200,168,75,0.55)' : 'rgba(255,255,255,0.07)',
        stroke: active ? '#E8C060' : 'rgba(255,255,255,0.18)',
        strokeWidth: active ? 2 : 1,
        cursor: 'pointer',
        transition: 'fill 0.18s, stroke 0.18s',
      } as React.CSSProperties,
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto w-full max-w-[280px]">
        <svg
          viewBox="0 0 220 380"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full drop-shadow-lg"
        >
          {/* Main body */}
          <rect
            x="30" y="45" width="160" height="280" rx="22"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          {/* Door divider line */}
          <line x1="34" y1="178" x2="186" y2="178" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Center roof panel */}
          <rect x="75" y="120" width="70" height="138" rx="2"
            fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Wheel arches */}
          <ellipse cx="44" cy="132" rx="14" ry="16" fill="rgba(0,0,0,0.35)" />
          <ellipse cx="176" cy="132" rx="14" ry="16" fill="rgba(0,0,0,0.35)" />
          <ellipse cx="44" cy="248" rx="14" ry="16" fill="rgba(0,0,0,0.35)" />
          <ellipse cx="176" cy="248" rx="14" ry="16" fill="rgba(0,0,0,0.35)" />

          {/* Windshield */}
          <polygon points="68,62 152,62 162,108 58,108" {...windowProps('windshield')} />

          {/* Driver front */}
          <rect x="34" y="118" width="36" height="52" rx="4" {...windowProps('driver-front')} />

          {/* Passenger front */}
          <rect x="150" y="118" width="36" height="52" rx="4" {...windowProps('passenger-front')} />

          {/* Driver rear */}
          <rect x="34" y="182" width="36" height="50" rx="4" {...windowProps('driver-rear')} />

          {/* Passenger rear */}
          <rect x="150" y="182" width="36" height="50" rx="4" {...windowProps('passenger-rear')} />

          {/* Driver quarter */}
          <rect x="34" y="240" width="36" height="20" rx="4" {...windowProps('driver-quarter')} />

          {/* Passenger quarter */}
          <rect x="150" y="240" width="36" height="20" rx="4" {...windowProps('passenger-quarter')} />

          {/* Rear window */}
          <polygon points="58,268 162,268 152,314 68,314" {...windowProps('rear-window')} />

          {/* Labels */}
          <text x="110" y="90" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>Windshield</text>
          <text x="52" y="148" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>DR</text>
          <text x="168" y="148" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>PS</text>
          <text x="52" y="212" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>DR</text>
          <text x="168" y="212" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>PS</text>
          <text x="110" y="295" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif" pointerEvents="none" style={{userSelect:"none"}}>Rear</text>

          {/* Front/Rear indicators */}
          <text x="110" y="22" textAnchor="middle" fontSize="8" fill="rgba(200,168,75,0.6)" fontFamily="sans-serif" fontWeight="600" letterSpacing="2" pointerEvents="none" style={{userSelect:"none"}}>FRONT</text>
          <text x="110" y="372" textAnchor="middle" fontSize="8" fill="rgba(200,168,75,0.6)" fontFamily="sans-serif" fontWeight="600" letterSpacing="2" pointerEvents="none" style={{userSelect:"none"}}>REAR</text>
        </svg>
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(new Set(allSelected ? [] : all))}
          className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-all"
          style={{
            border: '1px solid rgba(200,168,75,0.4)',
            background: allSelected ? 'rgba(200,168,75,0.15)' : 'transparent',
            color: 'var(--gold-light)',
          }}
        >
          {allSelected ? 'Clear All' : 'Select All'}
        </button>
        {selected.size > 0 && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {selected.size} window{selected.size !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Selected chips */}
      {selected.size > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {WINDOWS.filter(w => selected.has(w.id)).map(w => (
            <span
              key={w.id}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)', color: 'var(--gold-light)' }}
            >
              {w.label}
              <button
                type="button"
                onClick={() => onChange(toggle(selected, w.id))}
                className="ml-0.5 opacity-60 hover:opacity-100"
                aria-label={`Remove ${w.label}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
