import { useState, useEffect } from 'react'

export default function HUDOverlay() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 text-[10px] md:text-xs"
      style={{ fontFamily: "'JetBrains Mono Local', 'SF Pro Text', monospace", color: 'rgba(255,255,255,0.6)' }}
    >
      {/* Top left — logo */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <img src="/suhi_logo.svg" alt="SUHI Logo" className="w-8 h-8 opacity-70" />
        <span className="text-xs uppercase tracking-[0.4em] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
          SUHI
        </span>
      </div>

      {/* Top right — time */}
      <div className="absolute top-6 right-6">
        <span className="tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {time}
        </span>
      </div>

      {/* LEFT SIDE TELEMETRY */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-12 max-w-[200px]">
        {/* TEMTRICS */}
        <div>
          <div className="uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>TEMTRICS:::</div>
          <div className="font-mono space-y-1 text-white/70">
            <div>84.72 / 215.04 / 91.56</div>
            <div>0.47 ΔΔ / Risk: <span style={{ color: '#ff6b2b' }}>7.42</span></div>
            <div>Activity: <span style={{ color: '#ff6b2b' }}>88.5%</span> / Velocity: 5.73</div>
            <div>Signal: 147, 182 / 204</div>
          </div>
        </div>

        {/* AFFINITY */}
        <div>
          <div className="font-mono space-y-1 text-white/70">
            <div className="uppercase">AFFINITY: <span className="text-white">72.85</span></div>
            <div className="uppercase">BONDS: <span className="text-[#ff6b2b]">22 - 754A</span> / 982F7</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-1 bg-[#ff6b2b]" />
              <div className="text-[9px]">0x1022C88A0093F7761</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-white/30" />
              <div className="text-[9px]">0x010198E4B65A6077DA</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE TELEMETRY */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-12 text-right">
        {/* SCORES */}
        <div>
          <div className="uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>SCORES:::</div>
          <div className="font-mono space-y-1.5 text-white/70">
            <div>SCOREMAX: <span className="text-white">82.3</span></div>
            <div>EMPLOYMAX: <span className="text-white">75.9</span></div>
            <div>INFLUENCE: <span style={{ color: '#ff6b2b' }}>88.1</span></div>
            <div>RELIABLE: <span className="text-white">0.92</span></div>
            <div>VOLATILITY: <span style={{ color: '#ff6b2b' }}>+0.14</span></div>
            <div>DECAY: <span className="text-white/40">-0.63</span></div>
          </div>
        </div>

        {/* INTERACTIONS */}
        <div>
          <div className="uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>INTERACTIONS:</div>
          <div className="font-mono space-y-1.5 text-[9px] text-white/60">
            <div className="flex items-center justify-end gap-2">
              <div>0x10286DA774FF012990</div>
              <div className="w-3 h-1 bg-[#ff6b2b]" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <div>0x0103AEE78B62141067</div>
              <div className="w-3 h-1 bg-[#ff6b2b]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom left — status */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#ff6b2b]" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          EARTH2 ACTIVE
        </span>
      </div>

      {/* Bottom right — protocol */}
      <div className="absolute bottom-6 right-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
          PROTOCOL v1.0
        </span>
      </div>
    </div>
  )
}
