'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { browserClient } from '@/app/lib/supabase-browser'
import { loadStories, type Story } from '@/app/lib/story-types'

const T = { ink: '#221B12', ink2: '#4A3D2C', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E', cream: '#FBF9F4', green: '#2f7d62' }

export default function StorybooksPage() {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const slug = String(params.slug || '')
  const klass = search.get('class') || undefined

  const [gardenName, setGardenName] = useState('')
  const [accent, setAccent] = useState('#3E9B7C')
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  const [openId, setOpenId] = useState<string | null>(null)
  const [chapter, setChapter] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({}) // key `${storyId}|${chIdx}|${qN}` -> letter
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      supabase.from('garden_types').select('name_en,grow_name,theme_color').eq('slug', slug).single()
        .then(async ({ data: g }) => {
          setGardenName(g?.name_en ?? ''); setAccent(g?.theme_color ?? '#3E9B7C')
          const s = await loadStories(g?.grow_name ?? null, klass)
          setStories(s); setLoading(false)
        })
    })
  }, [router, slug, klass])

  const story = stories.find((s) => s.id === openId) || null

  function openStory(id: string) {
    setOpenId(id); setChapter(0); setShowResults(false)
    window.scrollTo(0, 0)
  }
  function closeStory() {
    setOpenId(null); setShowResults(false); window.scrollTo(0, 0)
  }
  function pick(chIdx: number, qn: number, letter: string) {
    if (!story) return
    setAnswers((a) => ({ ...a, [`${story.id}|${chIdx}|${qn}`]: letter }))
  }
  function speak(text: string) {
    try { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; window.speechSynthesis.speak(u) } catch {}
  }

  // ---------------- RESULTS SCREEN ----------------
  if (story && showResults) {
    let correct = 0, total = 0
    story.chapters.forEach((ch, ci) => ch.questions.forEach((q) => {
      total++
      if (answers[`${story.id}|${ci}|${q.n}`] === q.answer) correct++
    }))
    return (
      <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px 22px 70px' }}>
          <button onClick={() => { setShowResults(false); setChapter(story.chapters.length - 1) }} style={backBtn}>← Back to story</button>
          <div style={{ background: T.cream, borderRadius: 20, padding: '30px 32px 36px', color: T.ink, boxShadow: '0 20px 44px -20px rgba(0,0,0,.6)' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, color: T.gold, fontWeight: 600, marginBottom: 6 }}>{story.id} · RESULTS</div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, margin: '0 0 4px' }}>{story.title}</h1>
            <div style={{ fontSize: 18, color: T.green, fontWeight: 700, margin: '10px 0 22px' }}>You got {correct} of {total} correct</div>
            {story.chapters.map((ch, ci) => (
              <div key={ci} style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: T.muted, marginBottom: 8, textTransform: 'uppercase' }}>{ch.title}</div>
                {ch.questions.map((q) => {
                  const chosen = answers[`${story.id}|${ci}|${q.n}`]
                  const right = chosen === q.answer
                  return (
                    <div key={q.n} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{q.n}. {q.q}</div>
                      <div style={{ fontSize: 14.5, color: right ? T.green : '#B23B3B' }}>
                        Your answer: {chosen ? `${chosen}. ${q.options[chosen]}` : '— (not answered)'} {right ? '✓' : '✗'}
                      </div>
                      {!right && q.answer && (
                        <div style={{ fontSize: 14.5, color: T.green }}>Correct: {q.answer}. {q.options[q.answer]}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            <button onClick={closeStory} style={{ ...solidBtn(accent), marginTop: 8 }}>← Back to all stories</button>
          </div>
        </div>
      </main>
    )
  }

  // ---------------- READER ----------------
  if (story) {
    const ch = story.chapters[chapter]
    const isLast = chapter === story.chapters.length - 1
    return (
      <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px 22px 70px' }}>
          <button onClick={closeStory} style={backBtn}>← All stories</button>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: T.gold, marginBottom: 4 }}>{story.id} · {gardenName}</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(24px,4vw,34px)', margin: '0 0 4px' }}>{story.title}</h1>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 18 }}>
            Chapter {chapter + 1} of {story.chapters.length}
          </div>

          <div style={{ background: T.cream, borderRadius: 20, padding: '28px 32px 34px', color: T.ink, boxShadow: '0 20px 44px -20px rgba(0,0,0,.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, color: T.forest, margin: 0 }}>{ch.title}</h2>
              <button onClick={() => speak(ch.prose)} title="Listen" style={{ background: 'rgba(11,61,38,.08)', border: 'none', borderRadius: 20, width: 40, height: 40, cursor: 'pointer', fontSize: 18 }}>🔊</button>
            </div>
            {ch.prose.split('\n').filter((l) => l.trim()).map((p, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.8, color: T.ink2, margin: '0 0 14px' }}>{p}</p>
            ))}
            {ch.notice.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0 6px' }}>
                {ch.notice.map((w, i) => (
                  <span key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, background: 'rgba(200,145,46,.16)', color: '#7a5410', borderRadius: 8, padding: '5px 10px' }}>{w}</span>
                ))}
              </div>
            )}

            {ch.questions.length > 0 && (
              <div style={{ marginTop: 22, borderTop: '1px solid rgba(11,61,38,.12)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, color: T.muted, letterSpacing: '.08em', marginBottom: 14, textTransform: 'uppercase' }}>Questions</div>
                {ch.questions.map((q) => {
                  const chosen = answers[`${story.id}|${chapter}|${q.n}`]
                  return (
                    <div key={q.n} style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{q.n}. {q.q}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {Object.entries(q.options).map(([letter, text]) => {
                          const sel = chosen === letter
                          return (
                            <button key={letter} onClick={() => pick(chapter, q.n, letter)}
                              style={{ textAlign: 'left', padding: '10px 13px', borderRadius: 10, cursor: 'pointer', fontSize: 15,
                                border: '1.5px solid ' + (sel ? accent : 'rgba(11,61,38,.18)'),
                                background: sel ? accent : '#fff', color: sel ? '#fff' : T.ink2, fontWeight: sel ? 600 : 400 }}>
                              {letter}. {text}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {/* NOTE: no answers revealed here — held until results */}
              </div>
            )}
          </div>

          {/* NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20 }}>
            <button onClick={() => { setChapter((c) => Math.max(0, c - 1)); window.scrollTo(0, 0) }} disabled={chapter === 0}
              style={{ ...navBtn, opacity: chapter === 0 ? 0.4 : 1, cursor: chapter === 0 ? 'default' : 'pointer' }}>← Back</button>
            {isLast ? (
              <button onClick={() => { setShowResults(true); window.scrollTo(0, 0) }} style={solidBtn(T.gold)}>Finish & see answers →</button>
            ) : (
              <button onClick={() => { setChapter((c) => c + 1); window.scrollTo(0, 0) }} style={solidBtn(accent)}>Next →</button>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ---------------- STORY LIST ----------------
  return (
    <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 22px 60px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/garden/' + slug + (klass ? '?class=' + klass : ''))} style={backBtn}>← Back to garden</button>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold, textTransform: 'uppercase' }}>Storybooks · {gardenName}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 6px' }}>Story Library</h1>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 22px' }}>
          {loading ? 'Loading…' : stories.length + ' stories · read chapter by chapter, then check your answers.'}
        </p>

        {!loading && stories.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 24, color: 'rgba(255,255,255,.75)' }}>
            No stories are available for this garden and class yet.
          </div>
        )}

        {!loading && stories.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {stories.map((s, i) => (
              <button key={s.id} onClick={() => openStory(s.id)}
                style={{ textAlign: 'left', background: '#fff', border: 'none', borderRadius: 16, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 12px 28px -16px rgba(0,0,0,.5)', minHeight: 130, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: accent, fontWeight: 600, marginBottom: 6 }}>Story {i + 1} · {s.chapters.length} chapters</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: T.ink, lineHeight: 1.2, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, flex: 1 }}>{s.vocabulary.slice(0, 6).join(' · ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

const backBtn = { background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 18 } as const
const navBtn = { background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', borderRadius: 24, padding: '12px 22px', fontSize: 15, fontWeight: 600, fontFamily: 'Inter' } as const
function solidBtn(bg: string) { return { background: bg, color: '#fff', border: 'none', borderRadius: 24, padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' } as const }
