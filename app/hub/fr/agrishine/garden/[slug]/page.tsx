'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'
import { lessonForGarden, gardenHasFlashcards, type FlashLesson } from '@/app/lib/flashcard-content'

const T = {
  ink: '#2A2118', ink2: '#5A4A36', muted: '#8A7B63',
  forest: '#0B3D26', forest2: '#072D1C', gold: '#C8912E', goldSoft: '#E8B04B',
}

type Garden = {
  slug: string; name_en: string; name_fr: string; grow_name: string | null
  track: string | null; level: string; min_tier: string; theme_color: string
  tagline_en: string | null; tagline_fr: string | null; tools: string[]
}

const TOOL_META: Record<string, { en: string; fr: string; icon: string; live: boolean }> = {
  flashcards:   { en: 'Flashcards', fr: 'Cartes', icon: '🃏', live: true },
  story:        { en: 'Storybook', fr: 'Histoire', icon: '📖', live: false },
  charts:       { en: 'Classroom charts', fr: 'Affiches', icon: '🖼️', live: false },
  assessment:   { en: 'Quiz', fr: 'Quiz', icon: '✅', live: true },
  games:        { en: 'Games', fr: 'Jeux', icon: '🎮', live: false },
  manual:       { en: 'Garden manual', fr: 'Manuel', icon: '📗', live: false },
  teacher_guide:{ en: 'Teacher guide', fr: 'Guide enseignant', icon: '👩‍🏫', live: false },
  ai_bot:       { en: 'AI helper', fr: 'Assistant IA', icon: '🤖', live: false },
  course:       { en: 'Online course', fr: 'Cours en ligne', icon: '🎓', live: false },
  weather:      { en: 'Weather', fr: 'Météo', icon: '🌦️', live: false },
  competitions: { en: 'Competitions', fr: 'Concours', icon: '🏆', live: false },
  kit:          { en: 'Garden kit', fr: 'Kit de jardin', icon: '🧰', live: false },
  seeds:        { en: 'Seeds', fr: 'Semences', icon: '🌱', live: false },
  install:      { en: 'Install guide', fr: 'Installation', icon: '🔧', live: false },
  training:     { en: 'Training', fr: 'Formation', icon: '📅', live: false },
}

const ORDER = ['flashcards','story','charts','assessment','games','manual','teacher_guide','ai_bot','course','weather','competitions','kit','seeds','install','training']

const UI = {
  en: { back: 'Back to gardens', signout: 'Sign out', tools: 'Tools in this garden', soon: 'Coming soon', open: 'Open',
    tapFlip: 'Tap for English', tapBack: 'Tap for French', card: 'Card', of: 'of', prev: 'Previous', next: 'Next', close: 'Close', lesson: 'Lesson' },
  fr: { back: 'Retour aux jardins', signout: 'Se déconnecter', tools: 'Outils de ce jardin', soon: 'Bientôt', open: 'Ouvrir',
    tapFlip: 'Toucher pour l’anglais', tapBack: 'Toucher pour le français', card: 'Carte', of: 'sur', prev: 'Précédent', next: 'Suivant', close: 'Fermer', lesson: 'Leçon' },
}

export default function GardenPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = String(params.slug || '')
  const klass = searchParams.get('class') || ''
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [checking, setChecking] = useState(true)
  const [garden, setGarden] = useState<Garden | null>(null)
  const [lesson, setLesson] = useState<FlashLesson | null>(null)
  const [showCards, setShowCards] = useState(false)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const t = UI[lang]

  // check once whether the device has any speech voices, and warm it up
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const check = () => setCanSpeak(window.speechSynthesis.getVoices().length > 0)
    check()
    window.speechSynthesis.onvoiceschanged = check
  }, [])

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    if (synth.speaking) synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    u.rate = 0.85
    synth.speak(u)
  }

  // when the flashcards open, warm up the voice engine so the first tap isn't silent
  useEffect(() => {
    if (!showCards || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const warm = new SpeechSynthesisUtterance('')
    window.speechSynthesis.speak(warm)
  }, [showCards])

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      supabase.from('garden_types')
        .select('slug,name_en,name_fr,grow_name,track,level,min_tier,theme_color,tagline_en,tagline_fr,tools')
        .eq('slug', slug).single()
        .then(({ data: g }) => {
          if (g) setGarden(g as Garden)
          setLesson(lessonForGarden(slug, klass))
          setChecking(false)
        })
    })
  }, [router, slug])

  async function signOut() {
    const supabase = browserClient(); await supabase.auth.signOut(); router.replace('/login')
  }
  function openTool(key: string) {
    if (key === 'flashcards' && lesson) { setIdx(0); setFlipped(false); setShowCards(true) }
    if (key === 'assessment' && klass) { router.push('/hub/fr/agrishine/quiz/' + klass) }
  }

  if (checking || !garden) {
    return (<main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,.6)' }}><div>…</div></main>)
  }

  const accent = garden.theme_color
  const gName = lang === 'en' ? garden.name_en : garden.name_fr
  const card = lesson ? lesson.cards[idx] : null

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
      background: `radial-gradient(900px 500px at 80% -5%, rgba(200,145,46,.12), transparent 55%), radial-gradient(800px 600px at 0% 100%, rgba(141,190,104,.10), transparent 55%), linear-gradient(165deg, ${T.forest}, ${T.forest2})` }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 26px', borderBottom: '1px solid rgba(255,255,255,.12)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,45,28,.75)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: '50%', background: '#F2EBDA', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -4px rgba(0,0,0,.4)' }}>
            <Image src="/lifews-logo.png" alt="LIFEWS" width={32} height={32} style={{ objectFit: 'contain' }} />
          </span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 21, fontWeight: 600 }}>
            <span style={{ color: '#fff' }}>Lingo</span><span style={{ color: T.goldSoft }}>Green</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} style={{ border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
          <button onClick={signOut} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>{t.signout}</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 26px 0' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/level/' + garden.level)} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter', padding: 0 }}>← {t.back}</button>
      </div>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '22px 26px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: accent, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, flexShrink: 0 }}>
            {(garden.grow_name || garden.name_en).replace('Grow', 'G').charAt(0)}
          </div>
          <div>
            {garden.grow_name && (<div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, color: T.goldSoft, fontWeight: 600, marginBottom: 3 }}>{garden.grow_name}™{garden.track ? ' · ' + garden.track : ''}</div>)}
            <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(26px,3.4vw,38px)', margin: 0, lineHeight: 1.05 }}>{gName}</h1>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, lineHeight: 1.6, marginTop: 14, maxWidth: 620 }}>{lang === 'en' ? garden.tagline_en : garden.tagline_fr}</p>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 26px 64px' }}>
        <h2 style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 18 }}>{t.tools}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {ORDER.filter((k) => garden.tools.includes(k)).map((key) => {
            const meta = TOOL_META[key]; if (!meta) return null
            const hasQuiz = klass === 'primary-1' || klass === 'primary-2'
            const live = meta.live && (
              key === 'flashcards' ? lesson !== null :
              key === 'assessment' ? hasQuiz :
              true
            )
            const flashSoon = key === 'flashcards' && lesson === null && gardenHasFlashcards(garden.slug)
            return (
              <button key={key} onClick={() => openTool(key)} disabled={!live}
                style={{ textAlign: 'left', background: live ? '#fff' : 'rgba(255,255,255,.07)', border: live ? 'none' : '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: '18px 16px', cursor: live ? 'pointer' : 'default', boxShadow: live ? '0 12px 28px -14px rgba(0,0,0,.5)' : 'none', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{meta.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, color: live ? T.ink : '#fff', lineHeight: 1.15 }}>{lang === 'en' ? meta.en : meta.fr}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase', color: live ? accent : 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: 600 }}>{live ? t.open : t.soon}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {showCards && lesson && card && (
        <div style={{ position: 'absolute', inset: 0, minHeight: '100%', background: 'rgba(7,28,18,.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '70px 18px 40px', zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.1em', color: T.goldSoft }}>{t.lesson}: {lang === 'en' ? lesson.theme_en : lesson.theme_fr}</span>
              <button onClick={() => setShowCards(false)} style={{ border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: 20, padding: '6px 16px', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter' }}>{t.close}</button>
            </div>

            <div onClick={() => { if (card.type === 'vocab') { const goingToFrench = flipped; setFlipped(!flipped); if (goingToFrench) speak(card.fr) } }} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', cursor: card.type === 'vocab' ? 'pointer' : 'default', boxShadow: '0 24px 60px -20px rgba(0,0,0,.6)', borderTop: `6px solid ${accent}` }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '5 / 4', background: '#eee' }}>
                <Image src={lesson.imgBase + card.img} alt="" fill sizes="460px" style={{ objectFit: 'cover' }} priority />
                {canSpeak && (
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(card.type === 'vocab' ? card.fr : (card.ex || card.fr)) }}
                    aria-label="Listen"
                    style={{
                      position: 'absolute', bottom: 12, right: 12,
                      height: 48, borderRadius: 24, border: 'none',
                      background: 'rgba(11,61,38,.92)', color: '#fff', fontSize: 15, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px 0 14px',
                      boxShadow: '0 6px 16px -4px rgba(0,0,0,.5)', fontFamily: 'Inter',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🔊</span> {lang === 'en' ? 'Listen' : 'Écouter'}
                  </button>
                )}
              </div>
              <div style={{ padding: '20px 22px 24px', textAlign: 'center' }}>
                {card.type === 'vocab' ? (
                  !flipped ? (
                    <>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: T.muted, textTransform: 'uppercase', marginBottom: 8 }}>Français</div>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, color: T.ink, lineHeight: 1.1 }}>{card.fr}</div>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, color: '#B9AE97', marginTop: 14 }}>{t.tapFlip}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: T.muted, textTransform: 'uppercase', marginBottom: 8 }}>English</div>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: accent, lineHeight: 1.1, marginBottom: 10 }}>{card.en}</div>
                      <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.5, fontStyle: 'italic' }}>“{card.ex}”</div>
                      {card.ex_en && <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{card.ex_en}</div>}
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, color: '#B9AE97', marginTop: 14 }}>{t.tapBack}</div>
                    </>
                  )
                ) : (
                  <>
                    {(card.title_fr || card.title_en) && (<div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: accent, lineHeight: 1.1, marginBottom: 12 }}>{lang === 'en' ? card.title_en : card.title_fr}</div>)}
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: T.ink, lineHeight: 1.25, marginBottom: 8 }}>{card.fr}</div>
                    <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.5 }}>{card.en}</div>
                    {card.ex && <div style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.5, fontStyle: 'italic', marginTop: 12 }}>“{card.ex}”</div>}
                    {card.ex_en && <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{card.ex_en}</div>}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <button onClick={() => { setFlipped(false); setIdx((idx - 1 + lesson.cards.length) % lesson.cards.length) }} style={{ border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: 12, padding: '10px 16px', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter' }}>← {t.prev}</button>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,.75)' }}>{t.card} {idx + 1} {t.of} {lesson.cards.length}</span>
              <button onClick={() => { setFlipped(false); setIdx((idx + 1) % lesson.cards.length) }} style={{ border: 'none', background: T.gold, color: '#20160a', borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>{t.next} →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
