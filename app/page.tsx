'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'

/* ---------- brand tokens ---------- */
const T = {
  paper: '#F2EBDA',
  paper2: '#E8DFC8',
  cream: '#FFFFFF',
  ink: '#2A2118',
  ink2: '#5A4A36',
  muted: '#8A7B63',
  forest: '#0B3D26',
  forest2: '#072D1C',
  leaf: '#3E6B27',
  gold: '#C8912E',
  goldSoft: '#E8B04B',
  line: '#E4DAC4',
}

/* ---------- the six language hubs ---------- */
type Hub = {
  slug: string
  fr: string
  en: string
  accent: string   // bright signature color (stripe + letter circle)
  card: string     // light card background
  active: boolean
  tagEn: string
  tagFr: string
}

const HUBS: Hub[] = [
  { slug: 'fr', fr: 'Français', en: 'French', accent: '#5C9E3A', card: '#FFFFFF', active: true,
    tagEn: 'The flagship hub — gardens, climate, agribusiness.',
    tagFr: 'Le pôle phare — jardins, climat, agrobusiness.' },
  { slug: 'en', fr: 'Anglais', en: 'English', accent: '#3E7CA6', card: '#E4F0F7', active: false,
    tagEn: 'The bridge language to the world.',
    tagFr: 'La langue-passerelle vers le monde.' },
  { slug: 'ha', fr: 'Haoussa', en: 'Hausa', accent: '#C8912E', card: '#F7ECD6', active: false,
    tagEn: 'The great language of the Sahel.',
    tagFr: 'La grande langue du Sahel.' },
  { slug: 'yo', fr: 'Yoruba', en: 'Yoruba', accent: '#B0568C', card: '#F5E4EE', active: false,
    tagEn: 'Rhythm, proverb and marketplace.',
    tagFr: 'Rythme, proverbe et marché.' },
  { slug: 'ig', fr: 'Igbo', en: 'Igbo', accent: '#3E9B7C', card: '#E0F1EA', active: false,
    tagEn: 'Enterprise, roots and community.',
    tagFr: 'Entreprise, racine et communauté.' },
  { slug: 'de', fr: 'Allemand', en: 'German', accent: '#7A7488', card: '#ECEAF0', active: false,
    tagEn: 'Green energy and the professional path.',
    tagFr: 'Énergie verte et voie professionnelle.' },
]

/* ---------- bilingual UI strings ---------- */
const UI = {
  en: {
    eyebrow: 'SIX LANGUAGES · ONE GARDEN',
    title: 'Choose your language hub',
    lead: 'Each hub teaches a language through the garden. The French hub is open now — the others are on the way.',
    open: 'Enter hub',
    soon: 'Coming soon',
    signout: 'Sign out',
    greeting: 'Welcome back',
  },
  fr: {
    eyebrow: 'SIX LANGUES · UN JARDIN',
    title: 'Choisis ton pôle linguistique',
    lead: 'Chaque pôle enseigne une langue à travers le jardin. Le pôle français est ouvert — les autres arrivent.',
    open: 'Entrer',
    soon: 'Bientôt',
    signout: 'Se déconnecter',
    greeting: 'Bon retour',
  },
}

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [name, setName] = useState<string>('')
  const [checking, setChecking] = useState(true)

  const t = UI[lang]

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login')
        return
      }
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()
        .then(({ data: p }) => {
          setName(p?.full_name || data.user!.email || '')
          setChecking(false)
        })
    })
  }, [router])

  async function signOut() {
    const supabase = browserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  function openHub(hub: Hub) {
    if (!hub.active) return
    router.push('/hub/' + hub.slug)
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
          <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: '50%', background: T.paper, alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -4px rgba(0,0,0,.4)' }}>
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

      {/* header */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '52px 26px 12px', textAlign: 'center' }}>
        {name && (
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, letterSpacing: '.12em', textTransform: 'uppercase', color: T.goldSoft, marginBottom: 14 }}>
            {t.greeting}, {name.split(' ')[0]}
          </div>
        )}
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, letterSpacing: '.2em', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
          {t.eyebrow}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(34px,4.2vw,52px)', margin: '0 0 16px', color: '#fff', lineHeight: 1.08 }}>
          {t.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 17.5, lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
          {t.lead}
        </p>
      </section>

      {/* hub grid */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 26px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {HUBS.map((hub) => {
            const active = hub.active
            return (
              <div
                key={hub.slug}
                onClick={() => openHub(hub)}
                style={{
                  background: hub.card,
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 18,
                  padding: '26px 24px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: active ? 'pointer' : 'default',
                  boxShadow: '0 16px 36px -18px rgba(0,0,0,.55)',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: hub.accent }} />
                {!active && (
                  <span style={{ position: 'absolute', top: 18, right: 18, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: hub.accent, fontWeight: 500 }}>
                    {t.soon}
                  </span>
                )}
                <div style={{ width: 58, height: 58, borderRadius: '50%', background: hub.accent, display: 'grid', placeItems: 'center', marginBottom: 16, color: '#fff', fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600 }}>
                  {(lang === 'en' ? hub.en : hub.fr).charAt(0)}
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: T.ink, lineHeight: 1.1 }}>
                  {lang === 'en' ? hub.en : hub.fr}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.08em', textTransform: 'uppercase', color: hub.accent, margin: '4px 0 12px', fontWeight: 500 }}>
                  {lang === 'en' ? hub.fr : hub.en}
                </div>
                <div style={{ fontSize: 15.5, color: T.ink2, lineHeight: 1.55, minHeight: 46, marginBottom: 18 }}>
                  {lang === 'en' ? hub.tagEn : hub.tagFr}
                </div>
                <button
                  disabled={!active}
                  onClick={(e) => { e.stopPropagation(); openHub(hub) }}
                  style={{
                    width: '100%',
                    border: active ? 'none' : `1px solid ${hub.accent}`,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15.5,
                    fontWeight: 600,
                    cursor: active ? 'pointer' : 'default',
                    fontFamily: 'Inter',
                    background: active ? T.forest : 'transparent',
                    color: active ? '#fff' : hub.accent,
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


