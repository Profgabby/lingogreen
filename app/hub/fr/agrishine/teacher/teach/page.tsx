'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { CURRICULUM, weekType, getLesson, type Lesson } from '@/app/lib/teach-curriculum'
import type { TeachLang } from '@/app/lib/teacher-teach-data'

const T = { ink: '#221B12', ink2: '#4A3D2C', muted: '#8A7B63', forest: '#0B3D26', gold: '#C8912E', cream: '#FBF9F4' }

const CLASSES = ['primary-1','primary-2','primary-3','primary-4','primary-5','primary-6','jss-1','jss-2','jss-3','sss-1','sss-2','sss-3']
const CLASS_LABEL: Record<string, string> = {
  'primary-1':'Primary 1','primary-2':'Primary 2','primary-3':'Primary 3','primary-4':'Primary 4','primary-5':'Primary 5','primary-6':'Primary 6',
  'jss-1':'JSS 1','jss-2':'JSS 2','jss-3':'JSS 3','sss-1':'SSS 1','sss-2':'SSS 2','sss-3':'SSS 3',
}
const GARDENS = [
  { key: 'gmeal', en: 'GrowMeal', img: '/images/gardens/growmeal-school-nutrition.jpg' },
  { key: 'gflow', en: 'GrowFlow', img: '/images/gardens/growflow-water-irrigation.jpg' },
  { key: 'gfloat', en: 'GrowFloat', img: '/images/gardens/growfloat-soilless-growing.jpg' },
  { key: 'gaqua', en: 'GrowAqua', img: '/images/gardens/growaqua-fish-water-life.jpg' },
  { key: 'gfarm', en: 'GrowFarm', img: '/images/gardens/growfarm-livestock-animal.jpg' },
  { key: 'gpower', en: 'GrowPower', img: '/images/gardens/growpower-energy-smart.jpg' },
]

const UI: Record<TeachLang, {
  eyebrow: string; title: string; pickClass: string; pickGarden: string; back: string;
  choose: string; curriculum: string; weeks: string; terms: string; lessons: string; celebrations: string;
  term: string; week: string; celebration: string; lesson: string; soon: string; backTerm: string;
  objectives: string; flashcards: string; keywords: string; materials: string; prep: string;
  starter: string; teach: string; activity: string; garden: string; check: string; assessment: string; safety: string;
  lessonSoon: string; openFlash: string; assign: string; complete: string;
  celeShort: string; celeIntro: string;
}> = {
  en: { eyebrow: 'TEACHER · TEACH', title: 'Teach', pickClass: 'Class', pickGarden: 'Garden', back: '← Back to workspace',
    choose: 'Choose a class and garden to open the teaching curriculum.', curriculum: 'Academic Curriculum', weeks: 'Weeks', terms: 'Terms', lessons: 'Lessons', celebrations: 'Celebration Weeks',
    term: 'Term', week: 'Week', celebration: 'Celebration Week', lesson: 'Lesson', soon: 'Coming soon', backTerm: '← Back to term',
    objectives: 'Learning Objectives', flashcards: 'Flashcards', keywords: 'Key Words', materials: 'Materials', prep: 'Before Class',
    starter: 'Starter', teach: 'Teach', activity: 'Guided Activity', garden: 'Garden Activity', check: 'Check', assessment: 'Assessment', safety: 'Safety',
    lessonSoon: 'Lesson content coming soon. The teaching notes for this week are being developed from the garden flashcards.',
    openFlash: 'Open Flashcards', assign: 'Create Assignment', complete: 'Mark Complete',
    celeShort: 'Celebration', celeIntro: 'Celebrate what learners have discovered, practised and achieved this term.' },
  fr: { eyebrow: 'ENSEIGNANT · ENSEIGNER', title: 'Enseigner', pickClass: 'Classe', pickGarden: 'Jardin', back: '← Retour à l’espace',
    choose: 'Choisissez une classe et un jardin pour ouvrir le programme.', curriculum: 'Programme scolaire', weeks: 'Semaines', terms: 'Trimestres', lessons: 'Leçons', celebrations: 'Semaines de célébration',
    term: 'Trimestre', week: 'Semaine', celebration: 'Semaine de célébration', lesson: 'Leçon', soon: 'Bientôt', backTerm: '← Retour au trimestre',
    objectives: 'Objectifs', flashcards: 'Cartes', keywords: 'Mots-clés', materials: 'Matériel', prep: 'Avant le cours',
    starter: 'Amorce', teach: 'Enseigner', activity: 'Activité guidée', garden: 'Activité au jardin', check: 'Vérifier', assessment: 'Évaluation', safety: 'Sécurité',
    lessonSoon: 'Contenu à venir. Les notes de cette semaine sont en préparation à partir des cartes du jardin.',
    openFlash: 'Ouvrir les cartes', assign: 'Créer un devoir', complete: 'Marquer terminé',
    celeShort: 'Célébration', celeIntro: 'Célébrez ce que les élèves ont découvert et réussi ce trimestre.' },
  ha: { eyebrow: 'MALAMI · KOYARWA', title: 'Koyarwa', pickClass: 'Aji', pickGarden: 'Lambu', back: '← Koma sashen',
    choose: 'Zaɓi aji da lambu don buɗe manhajar koyarwa.', curriculum: 'Manhajar Karatu', weeks: 'Makonni', terms: 'Sharuɗɗa', lessons: 'Darussa', celebrations: 'Makon Bikin',
    term: 'Wa’adi', week: 'Mako', celebration: 'Makon Biki', lesson: 'Darasi', soon: 'Nan gaba', backTerm: '← Koma wa’adi',
    objectives: 'Manufofin Koyo', flashcards: 'Katunan', keywords: 'Kalmomi', materials: 'Kayan aiki', prep: 'Kafin Aji',
    starter: 'Farawa', teach: 'Koyarwa', activity: 'Aiki mai jagora', garden: 'Aikin Lambu', check: 'Duba', assessment: 'Tantancewa', safety: 'Tsaro',
    lessonSoon: 'Abun darasi nan gaba. Ana shirya bayanan wannan makon daga katunan lambu.',
    openFlash: 'Buɗe Katunan', assign: 'Ƙirƙiri Aiki', complete: 'Kammala',
    celeShort: 'Biki', celeIntro: 'Ku yi bikin abin da ɗalibai suka koya a wannan wa’adin.' },
  es: { eyebrow: 'DOCENTE · ENSEÑAR', title: 'Enseñar', pickClass: 'Clase', pickGarden: 'Jardín', back: '← Volver al espacio',
    choose: 'Elige una clase y un jardín para abrir el currículo.', curriculum: 'Currículo Académico', weeks: 'Semanas', terms: 'Trimestres', lessons: 'Lecciones', celebrations: 'Semanas de celebración',
    term: 'Trimestre', week: 'Semana', celebration: 'Semana de Celebración', lesson: 'Lección', soon: 'Próximamente', backTerm: '← Volver al trimestre',
    objectives: 'Objetivos', flashcards: 'Tarjetas', keywords: 'Palabras clave', materials: 'Materiales', prep: 'Antes de clase',
    starter: 'Inicio', teach: 'Enseñar', activity: 'Actividad guiada', garden: 'Actividad en el jardín', check: 'Comprobar', assessment: 'Evaluación', safety: 'Seguridad',
    lessonSoon: 'Contenido próximamente. Las notas de esta semana se desarrollan a partir de las tarjetas del jardín.',
    openFlash: 'Abrir tarjetas', assign: 'Crear tarea', complete: 'Marcar completado',
    celeShort: 'Celebración', celeIntro: 'Celebra lo que los estudiantes han descubierto y logrado este trimestre.' },
  ar: { eyebrow: 'المعلم · التدريس', title: 'التدريس', pickClass: 'الصف', pickGarden: 'الحديقة', back: '← رجوع إلى المساحة',
    choose: 'اختر صفًا وحديقة لفتح المنهج.', curriculum: 'المنهج الدراسي', weeks: 'أسابيع', terms: 'فصول', lessons: 'دروس', celebrations: 'أسابيع الاحتفال',
    term: 'الفصل', week: 'الأسبوع', celebration: 'أسبوع الاحتفال', lesson: 'درس', soon: 'قريباً', backTerm: '← رجوع إلى الفصل',
    objectives: 'الأهداف', flashcards: 'البطاقات', keywords: 'كلمات مفتاحية', materials: 'المواد', prep: 'قبل الحصة',
    starter: 'تمهيد', teach: 'التدريس', activity: 'نشاط موجّه', garden: 'نشاط الحديقة', check: 'تحقق', assessment: 'التقييم', safety: 'السلامة',
    lessonSoon: 'المحتوى قريباً. تُطوَّر ملاحظات هذا الأسبوع من بطاقات الحديقة.',
    openFlash: 'افتح البطاقات', assign: 'إنشاء مهمة', complete: 'وضع علامة مكتمل',
    celeShort: 'احتفال', celeIntro: 'احتفلوا بما اكتشفه المتعلمون وأنجزوه هذا الفصل.' },
  de: { eyebrow: 'LEHRKRAFT · UNTERRICHTEN', title: 'Unterrichten', pickClass: 'Klasse', pickGarden: 'Garten', back: '← Zurück zum Bereich',
    choose: 'Wähle Klasse und Garten, um den Lehrplan zu öffnen.', curriculum: 'Lehrplan', weeks: 'Wochen', terms: 'Trimester', lessons: 'Lektionen', celebrations: 'Feierwochen',
    term: 'Trimester', week: 'Woche', celebration: 'Feierwoche', lesson: 'Lektion', soon: 'Bald', backTerm: '← Zurück zum Trimester',
    objectives: 'Lernziele', flashcards: 'Karten', keywords: 'Schlüsselwörter', materials: 'Material', prep: 'Vor dem Unterricht',
    starter: 'Einstieg', teach: 'Unterrichten', activity: 'Angeleitete Aktivität', garden: 'Gartenaktivität', check: 'Prüfen', assessment: 'Bewertung', safety: 'Sicherheit',
    lessonSoon: 'Inhalt folgt. Die Notizen dieser Woche werden aus den Gartenkarten entwickelt.',
    openFlash: 'Karten öffnen', assign: 'Aufgabe erstellen', complete: 'Als erledigt markieren',
    celeShort: 'Feier', celeIntro: 'Feiert, was die Lernenden dieses Trimester entdeckt und erreicht haben.' },
  yo: { eyebrow: 'OLÙKỌ́ · KỌ́NI', title: 'Kọ́ni', pickClass: 'Ipele', pickGarden: 'Ọgbà', back: '← Padà sí agbàlé',
    choose: 'Yan ipele àti ọgbà láti ṣí ìtòsẹ́kọ́.', curriculum: 'Ìtòsẹ́kọ́ Ẹ̀kọ́', weeks: 'Ọ̀sẹ̀', terms: 'Sáà', lessons: 'Ẹ̀kọ́', celebrations: 'Ọ̀sẹ̀ Ayẹyẹ',
    term: 'Sáà', week: 'Ọ̀sẹ̀', celebration: 'Ọ̀sẹ̀ Ayẹyẹ', lesson: 'Ẹ̀kọ́', soon: 'Ó ń bọ̀', backTerm: '← Padà sí sáà',
    objectives: 'Àfojúsùn', flashcards: 'Káàdì', keywords: 'Ọ̀rọ̀ pàtàkì', materials: 'Ohun èlò', prep: 'Ṣáájú kíláàsì',
    starter: 'Ìbẹ̀rẹ̀', teach: 'Kọ́ni', activity: 'Iṣẹ́ àbójútó', garden: 'Iṣẹ́ ọgbà', check: 'Ṣàyẹ̀wò', assessment: 'Ìdánwò', safety: 'Ààbò',
    lessonSoon: 'Àkóónú ẹ̀kọ́ ń bọ̀. À ń ṣe àkọsílẹ̀ ọ̀sẹ̀ yìí láti inú káàdì ọgbà.',
    openFlash: 'Ṣí Káàdì', assign: 'Ṣe Iṣẹ́ àyànfúnni', complete: 'Sàmì Parí',
    celeShort: 'Ayẹyẹ', celeIntro: 'Ṣe ayẹyẹ ohun tí àwọn akẹ́kọ̀ọ́ ti kọ́ ní sáà yìí.' },
  ig: { eyebrow: 'ONYE NKUZI · KỤZIE', title: 'Kụzie', pickClass: 'Klaasị', pickGarden: 'Ubi', back: '← Laghachi na ebe',
    choose: 'Họrọ klaasị na ubi iji mepee usoro ọmụmụ.', curriculum: 'Usoro Ọmụmụ', weeks: 'Izu', terms: 'Oge', lessons: 'Nkuzi', celebrations: 'Izu Ememme',
    term: 'Oge', week: 'Izu', celebration: 'Izu Ememme', lesson: 'Nkuzi', soon: 'Na-abịa', backTerm: '← Laghachi na oge',
    objectives: 'Ebumnuche', flashcards: 'Kaadị', keywords: 'Okwu ndị dị mkpa', materials: 'Ihe', prep: 'Tupu klaasị',
    starter: 'Mmalite', teach: 'Kụzie', activity: 'Ọrụ eduzi', garden: 'Ọrụ ubi', check: 'Lelee', assessment: 'Nyocha', safety: 'Nchekwa',
    lessonSoon: 'Ọdịnaya nkuzi na-abịa. A na-ewepụta ndetu izu a site na kaadị ubi.',
    openFlash: 'Mepee Kaadị', assign: 'Mepụta Ọrụ', complete: 'Kaa M:zuru',
    celeShort: 'Ememme', celeIntro: 'Mee ememme ihe ụmụ akwụkwọ chọpụtara ma mezuo n’oge a.' },
}

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function TeachCurriculum() {
  const router = useRouter()
  const search = useSearchParams()
  const lang = (search.get('lang') as TeachLang) || 'en'
  const t = UI[lang] || UI.en
  const rtl = lang === 'ar'
  const [klass, setKlass] = useState('')
  const [gkey, setGkey] = useState('')
  const [term, setTerm] = useState(1)
  const [openWeek, setOpenWeek] = useState<number | null>(null)
  const garden = GARDENS.find((g) => g.key === gkey)
  const selected = klass && gkey

  const lesson = useMemo<Lesson | null>(() => {
    if (!selected || openWeek == null) return null
    return getLesson(klass, gkey, term, openWeek)
  }, [selected, klass, gkey, term, openWeek])

  function chip(active: boolean) {
    return { padding: '8px 14px', borderRadius: 22, fontSize: 13.5, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '.02em', border: '1px solid ' + (active ? T.gold : 'rgba(255,255,255,.22)'), background: active ? T.gold : 'transparent', color: active ? '#1a1206' : '#fff', fontWeight: active ? 700 : 400 } as const
  }

  // ---------- LESSON / CELEBRATION VIEW ----------
  if (selected && openWeek != null) {
    const isCele = weekType(openWeek) === 'celebration'
    return (
      <main dir={rtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 22px 70px' }}>
          <button onClick={() => setOpenWeek(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14.5, cursor: 'pointer', padding: 0, marginBottom: 18 }}>{t.backTerm}</button>
          <div style={{ background: T.cream, borderRadius: 20, overflow: 'hidden', color: T.ink, boxShadow: '0 20px 44px -20px rgba(0,0,0,.6)' }}>
            {garden && (
              <div style={{ position: 'relative', width: '100%', height: 170 }}>
                <Image src={garden.img} alt={garden.en} fill sizes="800px" style={{ objectFit: 'cover' }} priority />
                <div style={{ position: 'absolute', inset: 0, background: isCele ? 'linear-gradient(to top, rgba(140,90,20,.9), rgba(11,61,38,.15))' : 'linear-gradient(to top, rgba(11,61,38,.88), rgba(11,61,38,.1))' }} />
                <div style={{ position: 'absolute', bottom: 16, left: rtl ? 'auto' : 24, right: rtl ? 24 : 'auto' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.06em', color: '#FBE3AE', fontWeight: 600 }}>{CLASS_LABEL[klass]} · {garden.en} · {t.term} {term}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, color: '#fff', fontWeight: 700, marginTop: 2 }}>
                    {isCele ? `${t.celebration} 🎉` : `${t.week} ${openWeek}`}
                  </div>
                </div>
              </div>
            )}
            <div style={{ padding: '28px 32px 36px' }}>
              {isCele ? (
                <>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: T.ink2, margin: '0 0 20px' }}>{t.celeIntro}</p>
                  {!lesson && <Placeholder text={t.lessonSoon} />}
                </>
              ) : lesson ? (
                <LessonBody lesson={lesson} t={t} />
              ) : (
                <>
                  {/* Template headers shown even when empty, so teachers see the shape that's coming */}
                  <TemplateSkeleton t={t} />
                  <Placeholder text={t.lessonSoon} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ---------- CURRICULUM BROWSER ----------
  return (
    <main dir={rtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 22px 70px' }}>
        <button onClick={() => router.push('/hub/fr/agrishine/teacher')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14.5, cursor: 'pointer', padding: 0, marginBottom: 18 }}>{t.back}</button>
        <div style={{ marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, letterSpacing: '.12em', color: T.gold }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(30px,5vw,44px)', margin: '0 0 24px' }}>{t.title}</h1>

        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 10, textTransform: 'uppercase' }}>{t.pickClass}</div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 22 }}>
          {CLASSES.map((c) => (<button key={c} onClick={() => { setKlass(c); setOpenWeek(null) }} style={chip(klass === c)}>{CLASS_LABEL[c]}</button>))}
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', marginBottom: 10, textTransform: 'uppercase' }}>{t.pickGarden}</div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 30 }}>
          {GARDENS.map((g) => (<button key={g.key} onClick={() => { setGkey(g.key); setOpenWeek(null) }} style={chip(gkey === g.key)}>{g.en}</button>))}
        </div>

        {!selected && (
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 16, padding: 28, color: 'rgba(255,255,255,.72)', fontSize: 16 }}>{t.choose}</div>
        )}

        {selected && garden && (
          <>
            {/* curriculum header */}
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: T.gold, letterSpacing: '.05em', fontWeight: 600, marginBottom: 4 }}>{CLASS_LABEL[klass]} · {garden.en}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, marginBottom: 12 }}>{t.curriculum}</div>
              <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 13.5, color: 'rgba(255,255,255,.8)', fontFamily: 'IBM Plex Mono, monospace' }}>
                <span>36 {t.weeks}</span><span>3 {t.terms}</span><span>33 {t.lessons}</span><span>3 {t.celebrations}</span>
              </div>
            </div>

            {/* term tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => { setTerm(n); setOpenWeek(null) }}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 12, fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '1px solid ' + (term === n ? T.gold : 'rgba(255,255,255,.2)'), background: term === n ? T.gold : 'transparent', color: term === n ? '#1a1206' : '#fff' }}>
                  {t.term} {n}
                </button>
              ))}
            </div>

            {/* week list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {WEEKS.map((w) => {
                const cele = weekType(w) === 'celebration'
                const has = getLesson(klass, gkey, term, w)
                return (
                  <button key={w} onClick={() => setOpenWeek(w)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: rtl ? 'right' : 'left', padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                      background: cele ? 'rgba(200,145,46,.16)' : '#fff', border: cele ? '1px solid rgba(200,145,46,.5)' : 'none',
                      boxShadow: cele ? 'none' : '0 8px 20px -14px rgba(0,0,0,.5)' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fontWeight: 700, color: cele ? T.gold : T.forest, minWidth: 26 }}>{String(w).padStart(2, '0')}</span>
                    <span style={{ flex: 1, fontFamily: 'Fraunces, serif', fontSize: 16.5, color: cele ? '#7a5410' : T.ink }}>
                      {cele ? `${t.celebration} 🎉` : (has?.title || `${t.week} ${w}`)}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 600, color: cele ? T.gold : (has ? '#2f7d62' : T.muted) }}>
                      {cele ? t.celeShort : (has ? t.lesson : t.soon)}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function Placeholder({ text }: { text: string }) {
  return <div style={{ background: 'rgba(11,61,38,.06)', borderRadius: 12, padding: '16px 18px', color: '#5A4A36', fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>{text}</div>
}

function TemplateSkeleton({ t }: { t: (typeof UI)['en'] }) {
  const heads = [t.objectives, t.flashcards, t.keywords, t.materials, t.starter, t.teach, t.activity, t.garden, t.check, t.assessment, t.safety]
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {heads.map((h) => (
          <span key={h} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.04em', color: '#8A7B63', background: 'rgba(11,61,38,.06)', borderRadius: 8, padding: '5px 9px', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>
    </div>
  )
}

function LessonBody({ lesson, t }: { lesson: Lesson; t: (typeof UI)['en'] }) {
  const Sec = ({ h, children }: { h: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 19, color: '#0B3D26', margin: '0 0 8px' }}>{h}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.7, color: '#4A3D2C' }}>{children}</div>
    </div>
  )
  const List = ({ items }: { items?: string[] }) => items && items.length ? <ul style={{ margin: 0, paddingLeft: 20 }}>{items.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}</ul> : null
  return (
    <>
      {lesson.title && <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: '#221B12', margin: '0 0 4px' }}>{lesson.title}</h1>}
      {lesson.duration && <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, color: '#8A7B63', marginBottom: 18 }}>{lesson.duration}</div>}
      {lesson.objectives?.length ? <Sec h={t.objectives}><List items={lesson.objectives} /></Sec> : null}
      {lesson.vocabulary?.length ? <Sec h={t.keywords}>{lesson.vocabulary.join(' · ')}</Sec> : null}
      {lesson.materials?.length ? <Sec h={t.materials}><List items={lesson.materials} /></Sec> : null}
      {lesson.starter ? <Sec h={t.starter}>{lesson.starter}</Sec> : null}
      {lesson.teach?.length ? <Sec h={t.teach}><List items={lesson.teach} /></Sec> : null}
      {lesson.guidedActivity ? <Sec h={t.activity}>{lesson.guidedActivity}</Sec> : null}
      {lesson.gardenActivity ? <Sec h={t.garden}>{lesson.gardenActivity}</Sec> : null}
      {lesson.check?.length ? <Sec h={t.check}><List items={lesson.check} /></Sec> : null}
      {lesson.assessment?.length ? <Sec h={t.assessment}><List items={lesson.assessment} /></Sec> : null}
      {lesson.safety?.length ? <Sec h={t.safety}><List items={lesson.safety} /></Sec> : null}
    </>
  )
}
