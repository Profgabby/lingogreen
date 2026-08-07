'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'

const T = {
  ink: '#2A2118', ink2: '#5A4A36', muted: '#8A7B63',
  forest: '#0B3D26', forest2: '#072D1C', gold: '#C8912E', goldSoft: '#E8B04B',
}

type Garden = {
  slug: string
  name_en: string
  name_fr: string
  grow_name: string | null
  track: string | null
  level: string
  min_tier: string
  theme_color: string
  tagline_en: string | null
  tagline_fr: string | null
}

const LEVEL_LABEL: Record<string, { en: string; fr: string }> = {
  nursery: { en: 'Nursery', fr: 'Maternelle' },
  primary: { en: 'Primary', fr: 'Primaire' },
  jss: { en: 'JSS', fr: 'Collège' },
  sss: { en: 'SSS', fr: 'Lycée' },
}

const TRACK_LABEL: Record<string, { en: string; fr: string }> = {
  Nutrition: { en: 'Nutrition', fr: 'Nutrition' },
  Systems: { en: 'Systems', fr: 'Systèmes' },
  Resilience: { en: 'Resilience', fr: 'Résilience' },
  Innovation: { en: 'Innovation', fr: 'Innovation' },
  Foundational: { en: 'Foundations', fr: 'Fondations' },
}

const UI = {
  en: {
    back: 'Back', eyebrow: 'AGRISHINE · SCHOOL GARDENS',
    title: 'gardens', lead: 'Nutrition is free for everyone. Unlock the rest with a plan.',
    open: 'Open garden', locked: 'Locked', free: 'FREE', signout: 'Sign out',
    tierPro: 'Plan required', tierSchool: 'School plan', empty: 'No gardens found for this level yet.',
  },
  fr: {
    back: 'Retour', eyebrow: 'AGRISHINE · JARDINS SCOLAIRES',
    title: 'jardins', lead: 'La nutrition est gratuite pour tous. Débloque le reste avec un forfait.',
    open: 'Ouvrir', locked: 'Verrouillé', free: 'GRATUIT', signout: 'Se déconnecter',
    tierPro: 'Forfait requis', tierSchool: 'Forfait école', empty: 'Aucun jardin pour ce niveau pour l’instant.',
  },
}

export default function LevelGardensPage() {
  const router = useRouter()
  const params = useParams()
  const level = String(params.level || 'primary')
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [checking, setChecking] = useState(true)
  const [gardens, setGardens] = useState<Garden[]>([])

  const t = UI[lang]
  const levelName = LEVEL_LABEL[level] ? (lang === 'en' ? LEVEL_LABEL[level].en : LEVEL_LABEL[level].fr) : level

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      supabase
        .from('garden_types')
        .select('slug,name_en,name_fr,grow_name,track,level,min_tier,theme_color,tagline_en,tagline_fr')
        .eq('level', level)
        .eq('active', true)
        .order('sort_order')
        .then(({ data: g }) => {
          if (g) setGardens(g as Garden[])
          setChecking(false)
        })
    })
  }, [router, level])

  async function signOut() {
    const supabase = browserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  function openGarden(g: Garden) {
    if (g.min_tier !== 'free') return
    router.push('/hub/fr/agrishine/garden/' + g.slug)
  }

  if (checking) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,.6)' }}>
        <div>…</div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
      background: `radial-gradient(900px 500px at 80% -5%, rgba(200,145,46,.12), transparent 55%), radial-gradient(800px 600px at 0% 100%, rgba(141,190,104,.10), transparent 55%), linear-gradient(165deg, ${T.forest}, ${T.forest2})`,
    }}>
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
          <button onClick={signOut} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>
            {t.signout}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 26px 0' }}>
        <button onClick={() => router.push('/hub/fr/agrishine')} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter', padding: 0 }}>
          ← {t.back}
        </button>
      </div>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 26px 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, letterSpacing: '.18em', color: T.goldSoft, marginBottom: 14 }}>
          {t.eyebrow}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(30px,4vw,46px)', margin: '0 0 14px', color: '#fff', lineHeight: 1.08 }}>
          {levelName} {t.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 16.5, lineHeight: 1.6, maxWidth: 620, margin: '0 auto' }}>
          {t.lead}
        </p>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '30px 26px 64px' }}>
        {gardens.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.7)' }}>{t.empty}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {gardens.map((g) => {
              const free = g.min_tier === 'free'
              const trackLabel = g.track && TRACK_LABEL[g.track] ? (lang === 'en' ? TRACK_LABEL[g.track].en : TRACK_LABEL[g.track].fr) : g.track
              return (
                <div
                  key={g.slug}
                  onClick={() => openGarden(g)}
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '24px 22px 22px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: free ? 'pointer' : 'default',
                    boxShadow: '0 16px 36px -18px rgba(0,0,0,.55)',
                    opacity: free ? 1 : 0.94,
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: g.theme_color }} />

                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '.08em',
                    fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                    background: free ? 'rgba(62,155,124,.15)' : 'rgba(138,123,99,.14)',
                    color: free ? '#2f7d62' : T.muted,
                  }}>
                    {free ? t.free : (g.min_tier === 'school' ? '🔒 ' + t.tierSchool : '🔒 ' + t.tierPro)}
                  </span>

                  <div style={{ width: 54, height: 54, borderRadius: 14, background: g.theme_color, display: 'grid', placeItems: 'center', marginBottom: 14, color: '#fff', fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600 }}>
                    {(g.grow_name || g.name_en).replace('Grow', 'G').charAt(0)}
                  </div>

                  {g.grow_name && (
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: g.theme_color, fontWeight: 600, marginBottom: 2 }}>
                      {g.grow_name}™{trackLabel ? ' · ' + trackLabel : ''}
                    </div>
                  )}
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 23, color: T.ink, lineHeight: 1.12 }}>
                    {lang === 'en' ? g.name_en : g.name_fr}
                  </div>
                  <div style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.5, minHeight: 42, margin: '8px 0 16px' }}>
                    {lang === 'en' ? g.tagline_en : g.tagline_fr}
                  </div>

                  <button
                    disabled={!free}
                    onClick={(e) => { e.stopPropagation(); openGarden(g) }}
                    style={{
                      width: '100%', border: free ? 'none' : `1px solid ${g.theme_color}`,
                      borderRadius: 12, padding: 13, fontSize: 15, fontWeight: 600,
                      cursor: free ? 'pointer' : 'default', fontFamily: 'Inter',
                      background: free ? T.forest : 'transparent',
                      color: free ? '#fff' : g.theme_color,
                    }}
                  >
                    {free ? t.open : '🔒 ' + t.locked}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <footer style={{ padding: '24px 26px 40px', textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 12.5 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.06em' }}>
          LINGOGREEN · Lichipu — let&rsquo;s do it together
        </span>
      </footer>
    </main>
  )
}
