'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { browserClient } from '@/app/lib/supabase-browser'
import { loadVocab, type VocabEntry } from '@/app/lib/vocab-types'

const T = { ink: '#2A2118', ink2: '#5A4A36', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E' }

export default function VocabularyPage() {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const slug = String(params.slug || '')
  const klass = search.get('class') || undefined

  const [growName, setGrowName] = useState<string | null>(null)
  const [gardenName, setGardenName] = useState<string>('')
  const [accent, setAccent] = useState<string>('#3E9B7C')
  const [entries, setEntries] = useState<VocabEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      supabase.from('garden_types').select('name_en,grow_name,theme_color').eq('slug', slug).single()
        .then(async ({ data: g }) => {
          const gn = g?.grow_name ?? null
          setGrowName(gn); setGardenName(g?.name_en ?? ''); setAccent(g?.theme_color ?? '#3E9B7C')
          const v = await loadVocab(gn, klass)
          setEntries(v); setLoading(false)
        })
    })
  }, [router, slug, klass])

  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [entries])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return entries.filter((e) => {
      if (cat !== 'all' && e.category !== cat) return false
      if (!needle) return true
      return e.term.toLowerCase().includes(needle) || e.def.toLowerCase().includes(needle) || e.category.toLowerCase().includes(needle)
    })
  }, [entries, q, cat])

  function speak(text: string) {
    try { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; window.speechSynthesis.speak(u) } catch {}
  }

  return (
    <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 22px 60px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/garden/' + slug + (klass ? '?class=' + klass : ''))}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 18 }}>
          ← Back to garden
        </button>

        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold, textTransform: 'uppercase' }}>
          Vocabulary · {gardenName}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 6px' }}>Garden Dictionary</h1>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 22px' }}>
          {loading ? 'Loading…' : entries.length + ' words · look up any word, its meaning and an example.'}
        </p>

        {!loading && entries.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 24, color: 'rgba(255,255,255,.75)' }}>
            No vocabulary is available for this garden and class yet.
          </div>
        )}

        {!loading && entries.length > 0 && (
          <>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a word, meaning or category…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 15, marginBottom: 14, outline: 'none' }} />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.03em',
                    border: '1px solid ' + (cat === c ? accent : 'rgba(255,255,255,.2)'),
                    background: cat === c ? accent : 'transparent', color: '#fff', fontWeight: cat === c ? 600 : 400 }}>
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginBottom: 12, fontFamily: 'IBM Plex Mono, monospace' }}>
              {filtered.length} {filtered.length === 1 ? 'word' : 'words'}
            </div>

            <div className="vocab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {filtered.map((e) => {
                return (
                  <div key={e.id}
                    style={{ background: '#fff', color: T.ink, borderRadius: 14, padding: '16px 18px', borderLeft: '4px solid ' + accent }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600 }}>{e.term}</div>
                      <button onClick={(ev) => { ev.stopPropagation(); speak(e.term) }} aria-label="Listen"
                        style={{ border: 'none', background: 'rgba(11,61,38,.08)', borderRadius: 16, width: 34, height: 34, cursor: 'pointer', fontSize: 15 }}>🔊</button>
                    </div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '.05em', color: T.muted, textTransform: 'uppercase', marginTop: 3 }}>{e.category}</div>
                    <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.5, marginTop: 8 }}>{e.def}</div>
                    {e.example && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #eee' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.05em', color: accent, fontWeight: 600, marginBottom: 4 }}>EXAMPLE</div>
                        <div style={{ fontSize: 14, color: T.ink, fontStyle: 'italic' }}>{e.example}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      <style>{`
        .vocab-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 640px) { .vocab-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  )
}
