'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TEACH_CONTENT, type TeachLang } from '@/app/lib/teacher-teach-data'

const T = { ink: '#2A2118', ink2: '#5A4A36', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E' }

const CLASSES = ['primary-1','primary-2','primary-3','primary-4','primary-5','primary-6','jss-1','jss-2','jss-3','sss-1','sss-2','sss-3']
const GARDENS = [
  { key: 'gmeal', en: 'GrowMeal' }, { key: 'gflow', en: 'GrowFlow' }, { key: 'gfloat', en: 'GrowFloat' },
  { key: 'gaqua', en: 'GrowAqua' }, { key: 'gfarm', en: 'GrowFarm' }, { key: 'gpower', en: 'GrowPower' },
]
const CLASS_LABEL: Record<string, string> = {
  'primary-1':'Primary 1','primary-2':'Primary 2','primary-3':'Primary 3','primary-4':'Primary 4','primary-5':'Primary 5','primary-6':'Primary 6',
  'jss-1':'JSS 1','jss-2':'JSS 2','jss-3':'JSS 3','sss-1':'SSS 1','sss-2':'SSS 2','sss-3':'SSS 3',
}
const UI: Record<TeachLang, { eyebrow: string; title: string; pickClass: string; pickGarden: string; back: string; choose: string }> = {
  en: { eyebrow: 'TEACHER · TEACH', title: 'Teach', pickClass: 'Class', pickGarden: 'Garden', back: '← Back to workspace', choose: 'Choose a class and garden above to load the teaching content.' },
  fr: { eyebrow: 'ENSEIGNANT · ENSEIGNER', title: 'Enseigner', pickClass: 'Classe', pickGarden: 'Jardin', back: '← Retour à l’espace', choose: 'Choisissez une classe et un jardin ci-dessus.' },
  ha: { eyebrow: 'MALAMI · KOYARWA', title: 'Koyarwa', pickClass: 'Aji', pickGarden: 'Lambu', back: '← Koma sashen', choose: 'Zaɓi aji da lambu a sama.' },
  es: { eyebrow: 'DOCENTE · ENSEÑAR', title: 'Enseñar', pickClass: 'Clase', pickGarden: 'Jardín', back: '← Volver al espacio', choose: 'Elige una clase y un jardín arriba.' },
  ar: { eyebrow: 'المعلم · التدريس', title: 'التدريس', pickClass: 'الصف', pickGarden: 'الحديقة', back: '← رجوع إلى المساحة', choose: 'اختر صفًا وحديقة أعلاه.' },
  de: { eyebrow: 'LEHRKRAFT · UNTERRICHTEN', title: 'Unterrichten', pickClass: 'Klasse', pickGarden: 'Garten', back: '← Zurück zum Bereich', choose: 'Wähle oben Klasse und Garten.' },
  yo: { eyebrow: 'OLÙKỌ́ · KỌ́NI', title: 'Kọ́ni', pickClass: 'Ipele', pickGarden: 'Ọgbà', back: '← Padà sí agbàlé', choose: 'Yan ipele àti ọgbà lókè.' },
  ig: { eyebrow: 'ONYE NKUZI · KỤZIE', title: 'Kụzie', pickClass: 'Klaasị', pickGarden: 'Ubi', back: '← Laghachi na ebe', choose: 'Họrọ klaasị na ubi n’elu.' },
}

export default function TeachView() {
  const router = useRouter()
  const search = useSearchParams()
  const lang = (search.get('lang') as TeachLang) || 'en'
  const t = UI[lang] || UI.en
  const rtl = lang === 'ar'
  const [klass, setKlass] = useState<string>('')
  const [gkey, setGkey] = useState<string>('')
  const content = useMemo(() => {
    if (!klass || !gkey) return ''
    return TEACH_CONTENT[lang]?.[`${klass}|${gkey}`] || ''
  }, [lang, klass, gkey])

  function chip(active: boolean) {
    return { padding: '7px 13px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.03em', border: '1px solid ' + (active ? T.gold : 'rgba(255,255,255,.2)'), background: active ? T.gold : 'transparent', color: active ? '#1a1206' : '#fff', fontWeight: active ? 700 : 400 } as const
  }

  return (
    <main dir={rtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 22px 60px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/teacher')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 18 }}>{t.back}</button>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(26px,4vw,38px)', margin: '0 0 20px' }}>{t.title}</h1>

        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 8, textTransform: 'uppercase' }}>{t.pickClass}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {CLASSES.map((c) => (<button key={c} onClick={() => setKlass(c)} style={chip(klass === c)}>{CLASS_LABEL[c]}</button>))}
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 8, textTransform: 'uppercase' }}>{t.pickGarden}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
          {GARDENS.map((g) => (<button key={g.key} onClick={() => setGkey(g.key)} style={chip(gkey === g.key)}>{g.en}</button>))}
        </div>

        {!content && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 24, color: 'rgba(255,255,255,.7)' }}>{t.choose}</div>
        )}
        {content && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 30px', color: T.ink, boxShadow: '0 16px 36px -18px rgba(0,0,0,.55)' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: T.gold, marginBottom: 14, fontWeight: 600 }}>{CLASS_LABEL[klass]} · {GARDENS.find((x) => x.key === gkey)?.en}</div>
            {content.split('\n').filter((ln) => ln.trim()).map((ln, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.7, color: T.ink2, margin: '0 0 14px' }}>{ln.replace(/\\/g, '')}</p>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
