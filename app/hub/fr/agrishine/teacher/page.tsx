'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TeachLang } from '@/app/lib/teacher-teach-data'

const T = { ink: '#2A2118', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E' }

const LANGS: { key: TeachLang; label: string }[] = [
  { key: 'en', label: 'EN' }, { key: 'fr', label: 'FR' }, { key: 'ha', label: 'HA' },
  { key: 'es', label: 'ES' }, { key: 'ar', label: 'AR' }, { key: 'de', label: 'DE' },
  { key: 'yo', label: 'YO' }, { key: 'ig', label: 'IG' },
]

const UI: Record<TeachLang, {
  eyebrow: string; title: string; sub: string; open: string; soon: string; back: string;
  menus: Record<string, { name: string; desc: string }>
}> = {
  en: { eyebrow: 'AGRISHINE · TEACHER WORKSPACE', title: 'Teacher Workspace', sub: 'Choose a menu. Teach is ready — pick a class and garden to read the teaching material.', open: 'OPEN', soon: 'COMING SOON', back: '← Back',
    menus: { teach: { name: 'Teach', desc: 'Lesson content and teaching guidance for every class and garden.' }, assign: { name: 'Assign', desc: 'Assign flashcards, quizzes and activities to your classes.' }, assess: { name: 'Assess', desc: 'Quizzes, question banks, rubrics and learner submissions.' }, track: { name: 'Track', desc: 'Class progress, scores and learners needing support.' } } },
  fr: { eyebrow: 'AGRISHINE · ESPACE ENSEIGNANT', title: 'Espace Enseignant', sub: 'Choisissez un menu. Enseigner est prêt — choisissez une classe et un jardin.', open: 'OUVERT', soon: 'BIENTÔT', back: '← Retour',
    menus: { teach: { name: 'Enseigner', desc: 'Contenu et conseils pédagogiques pour chaque classe et jardin.' }, assign: { name: 'Attribuer', desc: 'Attribuez cartes, quiz et activités à vos classes.' }, assess: { name: 'Évaluer', desc: 'Quiz, banques de questions, grilles et travaux des élèves.' }, track: { name: 'Suivre', desc: 'Progrès de la classe, scores et élèves à accompagner.' } } },
  ha: { eyebrow: 'AGRISHINE · SASHEN MALAMI', title: 'Sashen Malami', sub: 'Zaɓi menu. Koyarwa ta shirya — zaɓi aji da lambu.', open: 'A BUɗE', soon: 'NAN GABA', back: '← Koma',
    menus: { teach: { name: 'Koyarwa', desc: 'Abun koyarwa da jagora ga kowane aji da lambu.' }, assign: { name: 'Bayarwa', desc: 'Ba ɗalibai katunan koyo, jarrabawa da ayyuka.' }, assess: { name: 'Tantancewa', desc: 'Jarrabawa, tambayoyi, ma’auni da aikin ɗalibai.' }, track: { name: 'Bibiyar', desc: 'Ci gaban aji, maki da ɗalibai masu buƙatar taimako.' } } },
  es: { eyebrow: 'AGRISHINE · ESPACIO DEL DOCENTE', title: 'Espacio del Docente', sub: 'Elige un menú. Enseñar está listo — elige una clase y un jardín.', open: 'ABIERTO', soon: 'PRÓXIMAMENTE', back: '← Volver',
    menus: { teach: { name: 'Enseñar', desc: 'Contenido y orientación didáctica para cada clase y jardín.' }, assign: { name: 'Asignar', desc: 'Asigna tarjetas, cuestionarios y actividades a tus clases.' }, assess: { name: 'Evaluar', desc: 'Cuestionarios, bancos de preguntas, rúbricas y trabajos.' }, track: { name: 'Seguir', desc: 'Progreso de la clase, puntuaciones y apoyo a estudiantes.' } } },
  ar: { eyebrow: 'AGRISHINE · مساحة المعلم', title: 'مساحة المعلم', sub: 'اختر قائمة. التدريس جاهز — اختر صفًا وحديقة.', open: 'مفتوح', soon: 'قريباً', back: '← رجوع',
    menus: { teach: { name: 'التدريس', desc: 'محتوى وإرشادات التدريس لكل صف وحديقة.' }, assign: { name: 'إسناد', desc: 'أسند البطاقات والاختبارات والأنشطة لصفوفك.' }, assess: { name: 'التقييم', desc: 'اختبارات وبنوك أسئلة ومعايير وأعمال المتعلمين.' }, track: { name: 'متابعة', desc: 'تقدم الصف والدرجات والمتعلمون المحتاجون للدعم.' } } },
  de: { eyebrow: 'AGRISHINE · LEHRKRAFT-BEREICH', title: 'Lehrkraft-Bereich', sub: 'Wähle ein Menü. Unterrichten ist bereit — wähle Klasse und Garten.', open: 'OFFEN', soon: 'BALD', back: '← Zurück',
    menus: { teach: { name: 'Unterrichten', desc: 'Unterrichtsinhalte und Anleitung für jede Klasse und jeden Garten.' }, assign: { name: 'Zuweisen', desc: 'Weise Karten, Quizze und Aktivitäten deinen Klassen zu.' }, assess: { name: 'Bewerten', desc: 'Quizze, Fragenpools, Rubriken und Lernerarbeiten.' }, track: { name: 'Fortschritt', desc: 'Klassenfortschritt, Punkte und Lernende mit Förderbedarf.' } } },
  yo: { eyebrow: 'AGRISHINE · AGBÀLÉ OLÙKỌ́', title: 'Agbàlé Olùkọ́', sub: 'Yan àkójọ. Kíkọ́ni ti ṣetán — yan ipele àti ọgbà.', open: 'ṢÍṢÍ', soon: 'Ó ń BỌ̀', back: '← Padà',
    menus: { teach: { name: 'Kọ́ni', desc: 'Àkóónú àti ìtọ́sọ́nà ìkọ́ni fún gbogbo ipele àti ọgbà.' }, assign: { name: 'Fúnni', desc: 'Fún àwọn kíláàsì ní káàdì, ìdánwò àti iṣẹ́.' }, assess: { name: 'Ṣàyẹ̀wò', desc: 'Ìdánwò, àpò ìbéèrè, àwọn òṣùwọ̀n àti iṣẹ́ akẹ́kọ̀ọ́.' }, track: { name: 'Tọ̀pinpin', desc: 'Ìtẹ̀síwájú kíláàsì, àmì àti akẹ́kọ̀ọ́ tó nílò ìrànlọ́wọ́.' } } },
  ig: { eyebrow: 'AGRISHINE · EBE NKUZI', title: 'Ebe Onye Nkuzi', sub: 'Họrọ menu. Nkuzi adịla njikere — họrọ klaasị na ubi.', open: 'MEPERE', soon: 'NA-ABỊA', back: '← Laghachi',
    menus: { teach: { name: 'Kụzie', desc: 'Ọdịnaya na ntụziaka nkuzi maka klaasị na ubi ọ bụla.' }, assign: { name: 'Nye', desc: 'Nye klaasị gị kaadị, ule na ọrụ.' }, assess: { name: 'Nyochaa', desc: 'Ule, ebe ajụjụ, ụkpụrụ na ọrụ ụmụ akwụkwọ.' }, track: { name: 'Soro', desc: 'Ọganihu klaasị, akara na ụmụ akwụkwọ chọrọ enyemaka.' } } },
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [lang, setLang] = useState<TeachLang>('en')
  const t = UI[lang]
  const rtl = lang === 'ar'
  const tiles: { key: string; live: boolean }[] = [
    { key: 'teach', live: true }, { key: 'assign', live: false }, { key: 'assess', live: false }, { key: 'track', live: false },
  ]
  return (
    <main dir={rtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 22px 60px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 16 }}>{t.back}</button>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {LANGS.map((l) => (
            <button key={l.key} onClick={() => setLang(l.key)}
              style={{ border: '1px solid ' + (lang === l.key ? T.gold : 'rgba(255,255,255,.25)'), background: lang === l.key ? T.gold : 'rgba(255,255,255,.08)', color: lang === l.key ? '#1a1206' : '#fff', borderRadius: 20, padding: '5px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace' }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '.12em', color: T.gold }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 6px' }}>{t.title}</h1>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, margin: '0 0 26px', maxWidth: 640 }}>{t.sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {tiles.map(({ key, live }) => {
            const m = t.menus[key]
            return (
              <button key={key} disabled={!live}
                onClick={() => live && router.push('/hub/fr/agrishine/teacher/teach?lang=' + lang)}
                style={{ textAlign: rtl ? 'right' : 'left', background: live ? '#fff' : 'rgba(255,255,255,.07)', border: live ? 'none' : '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: '20px 18px', cursor: live ? 'pointer' : 'default', boxShadow: live ? '0 12px 28px -14px rgba(0,0,0,.5)' : 'none', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
