'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'en' | 'fr' | 'ha'
const T = { ink: '#2A2118', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E' }

const UI: Record<Lang, {
  eyebrow: string; title: string; sub: string; open: string; soon: string;
  back: string; menus: Record<string, { name: string; desc: string }>
}> = {
  en: {
    eyebrow: 'AGRISHINE · TEACHER WORKSPACE',
    title: 'Teacher Workspace',
    sub: 'Choose a menu. Teach is ready now — pick a class and garden to read the teaching material.',
    open: 'OPEN', soon: 'COMING SOON', back: '← Back',
    menus: {
      teach:  { name: 'Teach',  desc: 'Lesson content and teaching guidance for every class and garden.' },
      assign: { name: 'Assign', desc: 'Assign flashcards, quizzes and activities to your classes.' },
      assess: { name: 'Assess', desc: 'Quizzes, question banks, rubrics and learner submissions.' },
      track:  { name: 'Track',  desc: 'Class progress, scores and learners needing support.' },
    },
  },
  fr: {
    eyebrow: 'AGRISHINE · ESPACE ENSEIGNANT',
    title: 'Espace Enseignant',
    sub: 'Choisissez un menu. Enseigner est prêt — choisissez une classe et un jardin pour lire le contenu pédagogique.',
    open: 'OUVERT', soon: 'BIENTÔT', back: '← Retour',
    menus: {
      teach:  { name: 'Enseigner', desc: 'Contenu et conseils pédagogiques pour chaque classe et jardin.' },
      assign: { name: 'Attribuer', desc: 'Attribuez cartes, quiz et activités à vos classes.' },
      assess: { name: 'Évaluer',   desc: 'Quiz, banques de questions, grilles et travaux des élèves.' },
      track:  { name: 'Suivre',    desc: 'Progrès de la classe, scores et élèves à accompagner.' },
    },
  },
  ha: {
    eyebrow: 'AGRISHINE · SASHEN MALAMI',
    title: 'Sashen Malami',
    sub: 'Zaɓi menu. Koyarwa ta shirya — zaɓi aji da lambu domin karanta abun koyarwa.',
    open: 'A BUɗE', soon: 'NAN GABA', back: '← Koma',
    menus: {
      teach:  { name: 'Koyarwa',    desc: 'Abun koyarwa da jagora ga kowane aji da lambu.' },
      assign: { name: 'Bayarwa',    desc: 'Ba ɗalibai katunan koyo, jarrabawa da ayyuka.' },
      assess: { name: 'Tantancewa', desc: 'Jarrabawa, tambayoyi, ma’auni da aikin ɗalibai.' },
      track:  { name: 'Bibiyar',    desc: 'Ci gaban aji, maki da ɗalibai masu buƙatar taimako.' },
    },
  },
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('en')
  const t = UI[lang]
  const tiles: { key: string; live: boolean }[] = [
    { key: 'teach', live: true },
    { key: 'assign', live: false },
    { key: 'assess', live: false },
    { key: 'track', live: false },
  ]
  const nextLang: Record<Lang, Lang> = { en: 'fr', fr: 'ha', ha: 'en' }
  return (
    <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 22px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={() => router.push('/hub/fr/agrishine')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0 }}>
            {t.back}
          </button>
          <button onClick={() => setLang(nextLang[lang])}
            style={{ border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace' }}>
            {lang.toUpperCase()} · {nextLang[lang].toUpperCase()}
          </button>
        </div>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 6px' }}>{t.title}</h1>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 26px', maxWidth: 620 }}>{t.sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {tiles.map(({ key, live }) => {
            const m = t.menus[key]
            return (
              <button key={key} disabled={!live}
                onClick={() => live && router.push('/hub/fr/agrishine/teacher/teach?lang=' + lang)}
                style={{ textAlign: 'left', background: live ? '#fff' : 'rgba(255,255,255,.07)', border: live ? 'none' : '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: '20px 18px', cursor: live ? 'pointer' : 'default', boxShadow: live ? '0 12px 28px -14px rgba(0,0,0,.5)' : 'none', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 21, color: live ? T.ink : '#fff', marginBottom: 8 }}>{m.name}</div>
                <div style={{ fontSize: 13, lineHeight: 1.45, color: live ? T.muted : 'rgba(255,255,255,.6)', flex: 1 }}>{m.desc}</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '.06em', color: live ? '#2f7d62' : 'rgba(255,255,255,.5)', marginTop: 12, fontWeight: 600 }}>{live ? t.open : t.soon}</div>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
