'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TEACH_CONTENT, type TeachLang } from '@/app/lib/teacher-teach-data'

const T = { ink: '#2A2118', ink2: '#5A4A36', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E' }

const CLASSES = [
  'primary-1', 'primary-2', 'primary-3', 'primary-4', 'primary-5', 'primary-6',
  'jss-1', 'jss-2', 'jss-3', 'sss-1', 'sss-2', 'sss-3',
]
const GARDENS = [
  { key: 'gmeal', en: 'GrowMeal', label: 'Food & Nutrition' },
  { key: 'gflow', en: 'GrowFlow', label: 'Water & Irrigation' },
  { key: 'gfloat', en: 'GrowFloat', label: 'Soilless & Floating' },
  { key: 'gaqua', en: 'GrowAqua', label: 'Fish & Water Life' },
  { key: 'gfarm', en: 'GrowFarm', label: 'Livestock & Farm' },
  { key: 'gpower', en: 'GrowPower', label: 'Energy & Smart' },
]

const UI: Record<TeachLang, { eyebrow: string; title: string; sub: string; pickClass: string; pickGarden: string; back: string; choose: string }> = {
  en: { eyebrow: 'TEACHER · TEACH', title: 'Teach', sub: 'Select a class and a garden to read the teaching material.', pickClass: 'Class', pickGarden: 'Garden', back: '← Back to workspace', choose: 'Choose a class and garden above to load the teaching content.' },
  fr: { eyebrow: 'ENSEIGNANT · ENSEIGNER', title: 'Enseigner', sub: 'Choisissez une classe et un jardin pour lire le contenu pédagogique.', pickClass: 'Classe', pickGarden: 'Jardin', back: '← Retour à l’espace', choose: 'Choisissez une classe et un jardin ci-dessus pour charger le contenu.' },
  ha: { eyebrow: 'MALAMI · KOYARWA', title: 'Koyarwa', sub: 'Zaɓi aji da lambu domin karanta abun koyarwa.', pickClass: 'Aji', pickGarden: 'Lambu', back: '← Koma sashen', choose: 'Zaɓi aji da lambu a sama domin ɗora abun koyarwa.' },
}

const CLASS_LABEL: Record<string, string> = {
  'primary-1': 'Primary 1', 'primary-2': 'Primary 2', 'primary-3': 'Primary 3',
  'primary-4': 'Primary 4', 'primary-5': 'Primary 5', 'primary-6': 'Primary 6',
  'jss-1': 'JSS 1', 'jss-2': 'JSS 2', 'jss-3': 'JSS 3',
  'sss-1': 'SSS 1', 'sss-2': 'SSS 2', 'sss-3': 'SSS 3',
}

export default function TeachView() {
  const router = useRouter()
  const search = useSearchParams()
  const lang = (search.get('lang') as TeachLang) || 'en'
  const t = UI[lang] || UI.en
  const [klass, setKlass] = useState<string>('')
  const [gkey, setGkey] = useState<string>('')

  const content = useMemo(() => {
    if (!klass || !gkey) return ''
    return TEACH_CONTENT[lang]?.[`${klass}|${gkey}`] || ''
  }, [lang, klass, gkey])

  function chip(active: boolean) {
    return {
      padding: '7px 13px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer',
      fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.03em',
      border: '1px solid ' + (active ? T.gold : 'rgba(255,255,255,.2)'),
      background: active ? T.gold : 'transparent', color: active ? '#1a1206' : '#fff',
      fontWeight: active ? 700 : 400,
    } as const
  }

  return (
    <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 22px 60px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/teacher')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 18 }}>
          {t.back}
        </button>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(26px,4vw,38px)', margin: '0 0 6px' }}>{t.title}</h1>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 22px' }}>{t.sub}</p>

        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 8, textTransform: 'uppercase' }}>{t.pickClass}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {CLASSES.map((c) => (
            <button key={c} onClick={() => setKlass(c)} style={chip(klass === c)}>{CLASS_LABEL[c]}</button>
          ))}
        </div>

        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 8, textTransform: 'uppercase' }}>{t.pickGarden}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
          {GARDENS.map((g) => (
            <button key={g.key} onClick={() => setGkey(g.key)} style={chip(gkey === g.key)}>{g.en}</button>
          ))}
        </div>

        {!content && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 24, color: 'rgba(255,255,255,.7)' }}>
            {t.choose}
          </div>
        )}
        {content && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 30px', color: T.ink, boxShadow: '0 16px 36px -18px rgba(0,0,0,.55)' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: T.gold, marginBottom: 14, fontWeight: 600 }}>
              {CLASS_LABEL[klass]} · {GARDENS.find((x) => x.key === gkey)?.en}
            </div>
            {content.split('\n').filter((ln) => ln.trim()).map((ln, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.7, color: T.ink2, margin: '0 0 14px' }}>{ln.replace(/\\/g, '')}</p>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
