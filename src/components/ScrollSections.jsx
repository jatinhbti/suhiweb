import { useState, useCallback } from 'react'
import { generateSUHI, decodeSUHI, getRandomType, TYPE_LABELS, PRIMARY_TYPES, META_TYPES } from '../lib/suhi'
import { useInView } from 'react-intersection-observer'

function Section({ children }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  return (
    <div
      ref={ref}
      className="w-full flex items-center justify-center p-6 relative w-full h-screen"
      style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
    >
      <div
        className={`transition-all duration-1000 ease-out w-full`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0px)' : 'translateY(40px)',
          pointerEvents: inView ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function SUHIBreakdown() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.5 })

  return (
    <div ref={ref} className="flex flex-col items-center gap-8">
      {/* Full SUHI */}
      <div
        className="font-mono text-xl md:text-2xl tracking-[0.2em] transition-all duration-700"
        style={{
          color: '#ff6b2b',
          textShadow: '0 0 20px rgba(255, 107, 43, 0.3)',
          opacity: inView ? 0.4 : 1,
        }}
      >
        0x0101A9F3C27E4B8D91FA32
      </div>

      {/* Breakdown */}
      <div
        className="flex items-center gap-2 md:gap-4 transition-all duration-700 delay-300"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <div className="flex flex-col items-center">
          <span
            className="font-mono text-lg md:text-2xl font-bold px-3 py-1 rounded-lg"
            style={{
              background: 'rgba(255, 107, 43, 0.15)',
              border: '1px solid rgba(255, 107, 43, 0.3)',
              color: '#ff6b2b',
            }}
          >
            0x01
          </span>
          <span className="text-xs uppercase tracking-[0.3em] mt-2 text-gray-500 font-medium">WORLD</span>
        </div>

        <span className="text-gray-600 text-2xl font-light">|</span>

        <div className="flex flex-col items-center">
          <span
            className="font-mono text-lg md:text-2xl font-bold px-3 py-1 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
            }}
          >
            01
          </span>
          <span className="text-xs uppercase tracking-[0.3em] mt-2 text-gray-500 font-medium">TYPE</span>
        </div>

        <span className="text-gray-600 text-2xl font-light">|</span>

        <div className="flex flex-col items-center">
          <span
            className="font-mono text-sm md:text-2xl font-bold px-3 py-1 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            A9F3C27E4B8D91FA32
          </span>
          <span className="text-xs uppercase tracking-[0.3em] mt-2 text-gray-500 font-medium">IDENTITY</span>
        </div>
      </div>
    </div>
  )
}

function EntityTypeGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
      {PRIMARY_TYPES.map((code) => {
        const label = TYPE_LABELS[code]
        return (
          <div
            key={code}
            className="px-4 py-3 rounded-xl text-center transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 107, 43, 0.06)',
              border: '1px solid rgba(255, 107, 43, 0.15)',
            }}
          >
            <div className="font-mono text-xs text-gray-500 mb-1">0x{code}</div>
            <div className="font-mono text-sm font-bold" style={{ color: '#ff6b2b' }}>{label.name}</div>
            <div className="text-[10px] text-gray-600 mt-1">{label.description}</div>
          </div>
        )
      })}
      <div
        className="px-4 py-3 rounded-xl text-center transition-all duration-300 hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="font-mono text-xs text-gray-500 mb-1">0xAA+</div>
        <div className="font-mono text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>METATYPES</div>
        <div className="text-[10px] text-gray-600 mt-1">System entities</div>
      </div>
    </div>
  )
}

export default function ScrollSections({ triggerPulseRef }) {
  const [generatedSUHI, setGeneratedSUHI] = useState(null)
  const [decodeInput, setDecodeInput] = useState('')
  const [decoded, setDecoded] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setGeneratedSUHI(null)

    setTimeout(() => {
      const type = getRandomType()
      const suhi = generateSUHI(type)
      setGeneratedSUHI(suhi)
      setIsGenerating(false)

      if (triggerPulseRef?.current) {
        triggerPulseRef.current()
      }
    }, 800)
  }, [triggerPulseRef])

  const handleDecode = useCallback((value) => {
    setDecodeInput(value)
    if (value.length >= 8) {
      try {
        const result = decodeSUHI(value)
        setDecoded(result)
      } catch {
        setDecoded(null)
      }
    } else {
      setDecoded(null)
    }
  }, [])

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: '#ff6b2b' }}>
              SUHI PROTOCOL
            </div>
            <h1
              className="text-3xl md:text-7xl font-light leading-tight mb-8"
              style={{ 
                fontFamily: "'SF Pro Text', sans-serif", 
                letterSpacing: '-0.02em',
                textShadow: '0 0 30px rgba(0,0,0,0.8)'
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>EARTH2</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Identity Layer</span>
            </h1>
            <p className="text-lg md:text-xl font-light mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              SUHI does not identify records. It identifies existence.
            </p>
            <p className="text-sm font-mono tracking-[0.3em] mt-4" style={{ color: 'rgba(255, 107, 43, 0.5)' }}>
              IMMUTABLE · GLOBAL · COMPUTABLE
            </p>

            <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
              <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,107,43,0.4))' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff6b2b', opacity: 0.5 }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — WHAT SUHI SOLVES
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
              THE PROBLEM & THE SOLUTION
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div>
                <h3 className="text-xl font-light mb-6 pb-4 border-b border-white/10" style={{ color: 'rgba(255,255,255,0.5)' }}>Current Systems</h3>
                <ul className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <li className="flex items-start gap-3"><span className="text-red-500/50">×</span> Identify arbitrary database records</li>
                  <li className="flex items-start gap-3"><span className="text-red-500/50">×</span> Fragment identity across isolated platforms</li>
                  <li className="flex items-start gap-3"><span className="text-red-500/50">×</span> Dangerously encode transient context into persistent identifiers</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-light mb-6 pb-4 border-b border-[#ff6b2b]/30" style={{ color: '#ff6b2b' }}>The SUHI Protocol</h3>
                <ul className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <li className="flex items-start gap-3"><span className="text-[#ff6b2b]">✓</span> Provides a single, persistent entity identity</li>
                  <li className="flex items-start gap-3"><span className="text-[#ff6b2b]">✓</span> Actively removes all context and semantics from identity</li>
                  <li className="flex items-start gap-3"><span className="text-[#ff6b2b]">✓</span> Enables a unified, natively computable world model</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — STRUCTURE
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
              96-BIT HEX STRUCTURE
            </div>
            <SUHIBreakdown />
            
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto border-t border-white/5 pt-8">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-[#ff6b2b] mb-2">8 bits</div>
                <div className="text-sm font-light text-white/70">World ID</div>
                <div className="text-xs text-white/30 mt-1">e.g., Earth2</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">8 bits</div>
                <div className="text-sm font-light text-white/70">Entity Type</div>
                <div className="text-xs text-white/30 mt-1">Person, Place, Meta</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">80 bits</div>
                <div className="text-sm font-light text-white/70">Identity Hash</div>
                <div className="text-xs text-white/30 mt-1">Random, Immutable</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — ENTITY MODEL
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              UNIVERSAL ENTITY MODEL
            </div>
            <h2 className="text-2xl md:text-4xl font-light mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Everything scales across 4 dimensions.
            </h2>
            <EntityTypeGrid />

            {/* MetaTypes collapse */}
            <div className="mt-8 max-w-3xl mx-auto p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] text-left">
              <div className="text-xs font-mono text-white/50 mb-3">0xAA+ META_TYPES</div>
              <div className="flex flex-wrap gap-2">
                {META_TYPES.map((code) => {
                  const label = TYPE_LABELS[code]
                  return (
                    <span
                      key={code}
                      className="px-2.5 py-1.5 rounded bg-black/50 border border-white/10 font-mono text-[10px] text-white/60"
                    >
                      0x{code} {label.name}
                    </span>
                  )
                })}
              </div>
              <div className="text-xs text-white/30 mt-4 leading-relaxed">
                MetaTypes exist in Earth2 but do not represent physical actors. They enable computational systems: Scoring layers, simulations, operational events, and relationship tracking. They never replace core entities.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — RULES & DOCTRINE
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              THE RULES
            </div>
            <h2 className="text-2xl md:text-5xl font-light mb-12 text-[#ff6b2b]">
              Identity must not carry meaning.
            </h2>
            
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-8 rounded-2xl text-left">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#ff6b2b]" />
                  <div>
                    <strong className="block text-white/80 font-medium mb-1">State Independence</strong>
                    <span className="text-sm text-white/40">SUHI never includes place, time, role, metadata, or company. Identity is not derived from attributes.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#ff6b2b]" />
                  <div>
                    <strong className="block text-white/80 font-medium mb-1">Absolute Permanence</strong>
                    <span className="text-sm text-white/40">SUHI never changes after minting. It is entirely immutable.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#ff6b2b]" />
                  <div>
                    <strong className="block text-white/80 font-medium mb-1">Non-Reversible</strong>
                    <span className="text-sm text-white/40">Identity does not encode meaning. Meaning emerges exclusively from external relationships and state.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — STATE VS IDENTITY
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto w-full">
            <div className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
              CORE DOCTRINE
            </div>
            
            <p className="text-3xl md:text-5xl font-light leading-relaxed mb-16 text-white/90">
              Identity is <span className="text-[#ff6b2b]">absolute</span>.<br/> Everything else is <span className="text-white/40">mutable state</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-8 border border-white/10 bg-white/[0.02] rounded-2xl">
                <div className="text-sm uppercase tracking-[0.2em] text-[#ff6b2b] mb-6 font-bold">IDENTITY</div>
                <ul className="space-y-3 text-white/60 font-mono text-sm">
                  <li>Fixed</li>
                  <li>Minimal</li>
                  <li>Permanent</li>
                  <li>Non-semantic</li>
                </ul>
              </div>
              <div className="p-8 border border-white/[0.05] bg-black/50 rounded-2xl">
                <div className="text-sm uppercase tracking-[0.2em] text-white/40 mb-6">STATE</div>
                <ul className="space-y-3 text-white/40 font-mono text-sm opacity-60">
                  <li>Location & Geography</li>
                  <li>Roles & Jobs</li>
                  <li>Relationships</li>
                  <li>Telemetry & Scores</li>
                  <li>Time & Activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — WORLD MODEL
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              THE WORLD MODEL
            </div>
            <h2 className="text-2xl md:text-4xl font-light mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Earth2 is a graph of identities.
            </h2>
            
            <div className="text-left space-y-6 text-sm text-white/50 leading-relaxed bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-2xl border border-white/5">
              <p>
                <strong className="text-white text-base font-normal block mb-2">SUHI is the anchor. SCOREMAX defines the physics.</strong>
                Each node in the system is a singular SUHI instance. Each edge between nodes defines a relationship. These edges carry all mutable state, interaction logs, and scoring telemetry.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[#ff6b2b] font-mono text-xs mb-2">NODES</div>
                  Entity Existence
                </div>
                <div>
                  <div className="text-white/40 font-mono text-xs mb-2">EDGES</div>
                  Interaction, Influence, Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — GENERATE MINT
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              LIVE PROTOCOL
            </div>
            <h2 className="text-2xl md:text-4xl font-light mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Mint Identity
            </h2>

            <button
              id="generate-suhi-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative px-10 py-4 font-mono text-sm uppercase tracking-[0.3em] rounded-xl transition-all duration-500 cursor-pointer"
              style={{
                background: isGenerating ? 'rgba(255, 107, 43, 0.2)' : 'rgba(255, 107, 43, 0.1)',
                border: '1px solid rgba(255, 107, 43, 0.3)',
                color: '#ff6b2b',
                boxShadow: isGenerating ? '0 0 40px rgba(255, 107, 43, 0.3)' : '0 0 20px rgba(255, 107, 43, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 40px rgba(255, 107, 43, 0.2)'
                e.target.style.background = 'rgba(255, 107, 43, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(255, 107, 43, 0.05)'
                e.target.style.background = 'rgba(255, 107, 43, 0.1)'
              }}
            >
              {isGenerating ? (
                <span className="flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Generate SUHI'
              )}
            </button>

            {/* Generated result */}
            {generatedSUHI && (
              <div className="mt-10" style={{ animation: 'fadeInUp 0.7s ease-out' }}>
                <div
                  className="font-mono text-lg md:text-2xl tracking-[0.15em] mb-4 px-6 py-3 rounded-xl inline-block"
                  style={{
                    color: '#ff6b2b',
                    background: 'rgba(255, 107, 43, 0.08)',
                    border: '1px solid rgba(255, 107, 43, 0.2)',
                    textShadow: '0 0 30px rgba(255, 107, 43, 0.4)',
                  }}
                >
                  {generatedSUHI}
                </div>
                <div className="text-xs mt-2 text-white/30 uppercase tracking-[0.2em]">Immutable identity established in Earth2 graph</div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SECTION 9 — DECODE
          ═══════════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-2xl mx-auto w-full">
            <div className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              LIVE PROTOCOL
            </div>
            <h2 className="text-2xl md:text-4xl font-light mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Decode Payload
            </h2>

            <div className="relative max-w-lg mx-auto">
              <input
                id="decode-suhi-input"
                type="text"
                value={decodeInput}
                onChange={(e) => handleDecode(e.target.value)}
                placeholder="Paste SUHI (e.g. 0x0101A9F3C27E4B8D91FA32)"
                className="w-full px-6 py-4 font-mono text-sm rounded-xl outline-none transition-all duration-300 placeholder:text-gray-700 text-center"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ff6b2b',
                  caretColor: '#ff6b2b',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 107, 43, 0.3)'
                  e.target.style.boxShadow = '0 0 30px rgba(255, 107, 43, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Decoded result */}
            {decoded && (
              <div
                className="mt-8 p-6 rounded-2xl max-w-lg mx-auto w-full"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animation: 'fadeInUp 0.5s ease-out',
                }}
              >
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-2">World</div>
                    <div className="font-mono text-base font-bold" style={{ color: '#ff6b2b' }}>{decoded.world}</div>
                    <div className="font-mono text-xs mt-1 text-gray-600">0x{decoded.worldCode}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-2">Type</div>
                    <div className="font-mono text-base font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{decoded.type}</div>
                    <div className="font-mono text-xs mt-1 text-gray-600">0x{decoded.typeCode}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-2">Identity</div>
                    <div className="font-mono text-[10px] font-bold break-all" style={{ color: 'rgba(255,255,255,0.5)' }}>{decoded.identity}</div>
                    <div className="text-[10px] uppercase mt-2 text-[#ff6b2b]/50">verified</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
