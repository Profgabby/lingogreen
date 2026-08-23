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
  gold: '#C8912E',
  goldSoft: '#E8B04B',
  line: '#E4DAC4',
}

/* ---------- roles (from the real roles table, garden_slug = school) ---------- */
type Role = {
  key: string          // role_key in DB
  en: string
  fr: string           // label_fr in DB
  descEn: string
  descFr: string
  accent: string
  needsLevel: boolean  // students & the at-home child path pick a level
}

const ROLES: Role[] = [
  { key: 'learner', en: 'Student', fr: 'Élève', accent: '#5C9E3A', needsLevel: true,
    descEn: 'Learn French through the garden — vocabulary, stories, quizzes, badges.',
    descFr: 'Apprends le français par le jardin — vocabulaire, histoires, quiz, badges.' },
  { key: 'teacher', en: 'Teacher', fr: 'Enseignant', accent: '#3E7CA6', needsLevel: false,
    descEn: 'Classroom charts, printable activity books, and review your students’ work.',
    descFr: 'Affiches, cahiers d’activités imprimables et suivi du travail des élèves.' },
  { key: 'school_admin', en: 'School', fr: 'Direction', accent: '#C8912E', needsLevel: false,
    descEn: 'Oversee classes, teachers, and progress across your school.',
    descFr: 'Supervise les classes, les enseignants et les progrès de l’école.' },
]

/* ---------- age / level bands ---------- */
const LEVELS = [
  { key: 'nursery', en: 'Nursery', fr: 'Maternelle', hint: 'Ages 3–5' },
  { key: 'primary', en: 'Primary', fr: 'Primaire', hint: 'Ages 6–11' },
  { key: 'jss', en: 'JSS', fr: 'Collège', hint: 'Ages 12–14' },
  { key: 'sss', en: 'SSS', fr: 'Lycée', hint: 'Ages 15–17' },
]

/* ---------- classes within each level (full Nigerian structure) ---------- */
const READY_CLASSES = new Set(['primary-1','primary-2','primary-3','primary-4','primary-5','primary-6','jss-1','jss-2','jss-3','sss-1','sss-2','sss-3'])

const CLASSES: Record<string, { key: string; label: string }[]> = {
  nursery: [
    { key: 'nursery-1', label: 'Nursery 1' },
    { key: 'nursery-2', label: 'Nursery 2' },
    { key: 'nursery-3', label: 'Nursery 3' },
  ],
  primary: [
    { key: 'primary-1', label: 'Primary 1' },
    { key: 'primary-2', label: 'Primary 2' },
    { key: 'primary-3', label: 'Primary 3' },
    { key: 'primary-4', label: 'Primary 4' },
    { key: 'primary-5', label: 'Primary 5' },
    { key: 'primary-6', label: 'Primary 6' },
  ],
  jss: [
    { key: 'jss-1', label: 'JSS 1' },
    { key: 'jss-2', label: 'JSS 2' },
    { key: 'jss-3', label: 'JSS 3' },
  ],
  sss: [
    { key: 'sss-1', label: 'SSS 1' },
    { key: 'sss-2', label: 'SSS 2' },
    { key: 'sss-3', label: 'SSS 3' },
  ],
}

/* ---------- bilingual UI ---------- */
const UI = {
  en: {
    back: 'Back to communities',
    eyebrow: 'AGRISHINE · SCHOOLS',
    q1: 'Who are you?',
    q1sub: 'This sets up the right experience for you.',
    q2: 'What is your level?',
    q2sub: 'We’ll show content made for this age group.',
    q2b: 'Which class?',
    q2bsub: 'Pick your exact class.',
    q3: 'Where would you like to start?',
    q3sub: 'You can explore other gardens later. School Garden is a great start.',
    continue: 'Continue',
    saving: 'Setting up…',
    signout: 'Sign out',
    err: 'Something went wrong. Please try again.',
    soon: 'Coming soon',
  },
  fr: {
    back: 'Retour aux communautés',
    eyebrow: 'AGRISHINE · ÉCOLES',
    q1: 'Qui es-tu ?',
    q1sub: 'Cela prépare la bonne expérience pour toi.',
    q2: 'Quel est ton niveau ?',
    q2sub: 'Nous montrerons du contenu adapté à cet âge.',
    q2b: 'Quelle classe ?',
    q2bsub: 'Choisis ta classe exacte.',
    q3: 'Par où veux-tu commencer ?',
    q3sub: 'Tu pourras explorer d’autres jardins plus tard. Le Jardin Scolaire est un bon début.',
    continue: 'Continuer',
    saving: 'Préparation…',
    signout: 'Se déconnecter',
    err: 'Une erreur est survenue. Réessaie.',
    soon: 'Bientôt',
  },
}

type Garden = { slug: string; name_en: string; name_fr: string }

export default function AgrishineGate() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const [checking, setChecking] = useState(true)
  const [userId, setUserId] = useState<string>('')

  const [role, setRole] = useState<Role | null>(null)
  const [level, setLevel] = useState<string>('')
  const [klass, setKlass] = useState<string>('')
  const [garden, setGarden] = useState<string>('school') // School pre-selected
  const [gardens, setGardens] = useState<Garden[]>([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const t = UI[lang]

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      setUserId(data.user.id)
      // load gardens live from the gardens table
      supabase
        .from('gardens')
        .select('slug,name_en,name_fr')
        .eq('active', true)
        .order('sort_order')
        .then(({ data: g }) => {
          if (g) setGardens(g as Garden[])
          setChecking(false)
        })
    })
  }, [router])

  async function signOut() {
    const supabase = browserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const ready = role !== null && (!role.needsLevel || (level !== '' && klass !== '')) && garden !== ''

  async function saveAndContinue() {
    if (!role || !ready) return
    setError('')
    setSaving(true)
    const supabase = browserClient()

    const context: Record<string, string> = { pillar: 'agrishine' }
    if (role.needsLevel && level) context.level = level
    if (role.needsLevel && klass) context.klass = klass

    const { error: insErr } = await supabase.from('enrolments').insert({
      user_id: userId,
      garden_slug: garden,
      role_key: role.key,
      context,
      status: 'active',
    })

    setSaving(false)
    if (insErr) {
      setError(t.err + ' (' + insErr.message + ')')
      return
    }
    // into the level's garden list (students see their gardens for their level)
    const lvl = role.needsLevel && level ? level : 'primary'
    const kq = role.needsLevel && klass ? ('?class=' + klass) : ''
    router.push('/hub/fr/agrishine/level/' + lvl + kq)
  }

  if (checking) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,.6)' }}>
        <div>…</div>
      </main>
    )
  }

  const card = (selected: boolean, accent: string): React.CSSProperties => ({
    textAlign: 'left',
    background: selected ? '#fff' : 'rgba(255,255,255,.07)',
    border: selected ? `2px solid ${accent}` : '1px solid rgba(255,255,255,.16)',
    borderRadius: 16,
    padding: '18px 20px',
    cursor: 'pointer',
    color: selected ? T.ink : '#fff',
    width: '100%',
    transition: 'all .12s',
  })

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
          <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} style={{ border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
          <button onClick={signOut} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>
            {t.signout}
          </button>
        </div>
      </nav>

      {/* back */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 26px 0' }}>
        <button onClick={() => router.push('/hub/fr')} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter', padding: 0 }}>
          ← {t.back}
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '18px 26px 70px' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, letterSpacing: '.18em', color: T.goldSoft, marginBottom: 24 }}>
          {t.eyebrow}
        </div>

        {/* Q1 — who are you */}
        <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px' }}>{t.q1}</h2>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 16px' }}>{t.q1sub}</p>
        <div style={{ display: 'grid', gap: 12, marginBottom: 34 }}>
          {ROLES.map((r) => {
            const sel = role?.key === r.key
            return (
              <button key={r.key} onClick={() => { setRole(r); setError('') }} style={card(sel, r.accent)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: r.accent, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
                    {(lang === 'en' ? r.en : r.fr).charAt(0)}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, lineHeight: 1.1 }}>
                      {lang === 'en' ? r.en : r.fr}
                    </div>
                    <div style={{ fontSize: 14, color: sel ? T.ink2 : 'rgba(255,255,255,.72)', marginTop: 3, lineHeight: 1.4 }}>
                      {lang === 'en' ? r.descEn : r.descFr}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Q2 — level (only if role needs it) */}
        {role?.needsLevel && (
          <>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px' }}>{t.q2}</h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 16px' }}>{t.q2sub}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 34 }}>
              {LEVELS.map((lv) => {
                const sel = level === lv.key
                return (
                  <button key={lv.key} onClick={() => { setLevel(lv.key); setKlass('') }} style={card(sel, T.gold)}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19 }}>{lang === 'en' ? lv.en : lv.fr}</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: sel ? T.muted : 'rgba(255,255,255,.6)', marginTop: 2 }}>{lv.hint}</div>
                  </button>
                )
              })}
            </div>

            {/* Q2b — class (appears once a level is chosen) */}
            {level && CLASSES[level] && (
              <>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px' }}>{t.q2b}</h2>
                <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 16px' }}>{t.q2bsub}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 34 }}>
                  {CLASSES[level].map((c) => {
                    const sel = klass === c.key
                    const ready = READY_CLASSES.has(c.key)
                    return (
                      <button key={c.key} disabled={!ready} onClick={() => ready && setKlass(c.key)}
                        style={{ ...card(sel, T.gold), opacity: ready ? 1 : 0.45, cursor: ready ? 'pointer' : 'default' }}>
                        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, textAlign: 'center' }}>{c.label}</div>
                        {!ready && (
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.06em', textAlign: 'center', marginTop: 3, color: 'rgba(255,255,255,.55)' }}>{t.soon}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
        {role && (
          <>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px' }}>{t.q3}</h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 16px' }}>{t.q3sub}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 34 }}>
              {gardens.map((g) => {
                const sel = garden === g.slug
                return (
                  <button key={g.slug} onClick={() => setGarden(g.slug)} style={card(sel, '#5C9E3A')}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{lang === 'en' ? g.name_en : g.name_fr}</div>
                    {g.slug === 'school' && (
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: sel ? T.gold : T.goldSoft, marginTop: 2 }}>
                        {lang === 'en' ? 'RECOMMENDED' : 'RECOMMANDÉ'}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {error && (
          <div style={{ background: 'rgba(180,60,60,.2)', border: '1px solid rgba(220,120,120,.5)', color: '#ffd9d9', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <button
          onClick={saveAndContinue}
          disabled={!ready || saving}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 14,
            padding: 16,
            fontSize: 16.5,
            fontWeight: 600,
            fontFamily: 'Inter',
            cursor: ready && !saving ? 'pointer' : 'default',
            background: ready && !saving ? T.gold : 'rgba(255,255,255,.15)',
            color: ready && !saving ? '#20160a' : 'rgba(255,255,255,.55)',
          }}
        >
          {saving ? t.saving : t.continue}
        </button>
      </div>
    </main>
  )
}
