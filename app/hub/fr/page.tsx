'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'

/* ---------- brand tokens ---------- */
const T = {
  ink: '#2A2118',
  ink2: '#5A4A36',
  muted: '#8A7B63',
  forest: '#0B3D26',
  forest2: '#072D1C',
  goldSoft: '#E8B04B',
}

/* ---------- the four pillars ---------- */
type Pillar = {
  slug: string
  name: string
  who: string
  whoFr: string
  accent: string
  card: string
  active: boolean
  tagEn: string
  tagFr: string
  rolesEn: string
}

const PILLARS: Pillar[] = [
  {
    slug: 'agrishine', name: 'Agrishine', who: 'Schools', whoFr: 'Écoles',
    accent: '#C8912E', card: '#F7ECD6', active: true,
    tagEn: 'For students, teachers, and learning at home with your child.',
    tagFr: 'Pour élèves, enseignants et apprentissage à la maison.',
    rolesEn: 'Students · Teachers · Parents at home',
  },
  {
    slug: 'agriable', name: 'Agriable', who: 'Women', whoFr: 'Femmes',
    accent: '#B0568C', card: '#F5E4EE', active: false,
    tagEn: 'For women in enterprise, nutrition, and the home garden.',
    tagFr: 'Pour les femmes : entreprise, nutrition et jardin familial.',
    rolesEn: 'Entrepreneurs · Small businesses · Cooperatives',
  },
  {
    slug: 'agrinext', name: 'Agrinext', who: 'Youth', whoFr: 'Jeunes',
    accent: '#3E7CA6', card: '#E4F0F7', active: false,
    tagEn: 'For youth building green careers, skills, and enterprises.',
    tagFr: 'Pour les jeunes : métiers verts, compétences et entreprises.',
    rolesEn: 'Job seekers · Entrepreneurs · Researchers',
  },
  {
    slug: 'agriroots', name: 'Agriroots', who: 'Men', whoFr: 'Hommes',
    accent: '#3E9B7C', card: '#E0F1EA', active: false,
    tagEn: 'For farmers, tradesmen, and community leaders in the field.',
    tagFr: 'Pour agriculteurs, artisans et leaders communautaires.',
    rolesEn: 'Farmers · Leaders · Cooperatives',
  },
]

/* ---------- bilingual UI strings ---------- */
const UI = {
  en: {
    back: 'Back to hubs',
    eyebrow: 'FRENCH HUB · CHOOSE YOUR COMMUNITY',
    title: 'Which community are you in?',
    lead: 'Everyone learns French through the garden — but each community enters through its own door.',
    open: 'Enter',
    soon: 'Coming soon',
    signout: 'Sign out',
    rolesLabel: 'For',
  },
  fr: {
    back: 'Retour aux pôles',
    eyebrow: 'PÔLE FRANÇAIS · CHOISIS TA COMMUNAUTÉ',
    title: 'Quelle est ta communauté ?',
    lead: 'Chacun apprend le français par le jardin — mais chaque communauté entre par sa propre porte.',
    open: 'Entrer',
    soon: 'Bientôt',
    signout: 'Se déconnecter',
    rolesLabel: 'Pour',
  },
}

export default function FrenchHubPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [checking, setChecking] = useState(true)

  const t = UI[lang]

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login')
        return
      }
      setChecking(false)
    })
  }, [router])

  async function signOut() {
    const supabase = browserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  function openPillar(p: Pillar) {
    if (!p.active) return
    router.push('/hub/fr/' + p.slug)
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
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#fff',
      background: `radial-gradient(900px 500px at 80% -5%, rgba(200,145,46,.12), transparent 55%), radial-gradient(800px 600px at 0% 100%, rgba(141,190,104,.10), transparent 55%), linear-gradient(165deg, ${T.forest}, ${T.forest2})`,
    }}>
      {/* nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 26px', borderBottom: '1px solid rgba(255,255,255,.12)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,45,28,.75)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: '50%', background: '#F2EBDA', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -4px rgba(0,0,0,.4)' }}>
            <Image src="/lifews-logo.png" alt="LIFEWS" width={32} height={32} style={{ objectFit: 'contain' }} />
          </span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#fff' }}>Lingo</span><span style={{ color: T.goldSoft }}>Green</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            style={{ border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
          <button
            onClick={signOut}
            style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}
          >
            {t.signout}
          </button>
        </div>
      </nav>

      {/* back link */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 26px 0' }}>
        <button
          onClick={() => router.push('/')}
          style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter', padding: 0 }}
        >
          ← {t.back}
        </button>
      </div>

      {/* header */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 26px 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, letterSpacing: '.18em', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
          {t.eyebrow}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(34px,4.2vw,52px)', margin: '0 0 16px', color: '#fff', lineHeight: 1.08 }}>
          {t.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 17.5, lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
          {t.lead}
        </p>
      </section>

      {/* pillar grid */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '34px 26px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
          {PILLARS.map((p) => {
            const active = p.active
            return (
              <div
                key={p.slug}
                onClick={() => openPillar(p)}
                style={{
                  background: p.card,
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 18,
                  padding: '28px 26px 26px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: active ? 'pointer' : 'default',
                  boxShadow: '0 16px 36px -18px rgba(0,0,0,.55)',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: p.accent }} />
                {!active && (
                  <span style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: p.accent, fontWeight: 500 }}>
                    {t.soon}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: p.accent, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600 }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 27, color: T.ink, lineHeight: 1.05 }}>
                      {p.name}
                    </div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.08em', textTransform: 'uppercase', color: p.accent, marginTop: 3, fontWeight: 500 }}>
                      {lang === 'en' ? p.who : p.whoFr}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 15.5, color: T.ink2, lineHeight: 1.55, marginBottom: 14 }}>
                  {lang === 'en' ? p.tagEn : p.tagFr}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: T.muted, marginBottom: 18, lineHeight: 1.5 }}>
                  {t.rolesLabel}: {p.rolesEn}
                </div>
                <button
                  disabled={!active}
                  onClick={(e) => { e.stopPropagation(); openPillar(p) }}
                  style={{
                    width: '100%',
                    border: active ? 'none' : `1px solid ${p.accent}`,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15.5,
                    fontWeight: 600,
                    cursor: active ? 'pointer' : 'default',
                    fontFamily: 'Inter',
                    background: active ? T.forest : 'transparent',
                    color: active ? '#fff' : p.accent,
                  }}
                >
                  {active ? t.open : t.soon}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <footer style={{ padding: '24px 26px 40px', textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 12.5 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.06em' }}>
          LINGOGREEN · Lichipu — let&rsquo;s do it together
        </span>
      </footer>
    </main>
  )
}
