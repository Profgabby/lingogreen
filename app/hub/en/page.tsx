'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { browserClient } from '@/app/lib/supabase-browser'
import { loadVocab, hasVocab, type VocabEntry } from '@/app/lib/vocab-types'
import { loadStories, hasStory, type Story } from '@/app/lib/story-types'

// Independent English hub, preview-only until learner isolation and quiz persistence pass.
// Do not redirect to the French hub or modify the existing quiz engines.
const LEVELS = [
  { id: 'nursery', label: 'Nursery', classes: ['nursery-1', 'nursery-2', 'nursery-3'] },
  { id: 'primary', label: 'Primary', classes: ['primary-1', 'primary-2', 'primary-3', 'primary-4', 'primary-5', 'primary-6'] },
  { id: 'jss', label: 'Junior Secondary', classes: ['jss-1', 'jss-2', 'jss-3'] },
  { id: 'sss', label: 'Senior Secondary', classes: ['sss-1', 'sss-2', 'sss-3'] },
] as const

export default function EnglishHubPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [level, setLevel] = useState<string>('primary')
  const [klass, setKlass] = useState<string>('primary-1')
  const [gardens, setGardens] = useState<{ slug: string; name_en: string; grow_name: string | null }[]>([])
  const [garden, setGarden] = useState('')
  const [words, setWords] = useState<VocabEntry[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [resourcesLoading, setResourcesLoading] = useState(false)
  const [resourceError, setResourceError] = useState('')

  useEffect(() => {
    let mounted = true
    browserClient().auth.getUser().then(({ data, error }) => {
      if (!mounted) return
      if (error || !data.user) router.replace('/login')
      else {
        setChecking(false)
        browserClient().from('garden_types').select('slug,name_en,grow_name').then(({ data, error: gardenError }) => {
          if (!mounted) return
          if (gardenError) setResourceError('Garden catalogue unavailable. Please try again later.')
          else setGardens((data || []) as { slug: string; name_en: string; grow_name: string | null }[])
        })
      }
    }).catch(() => { if (mounted) router.replace('/login') })
    return () => { mounted = false }
  }, [router])

  useEffect(() => {
    let mounted = true
    const selected = gardens.find(g => g.slug === garden)
    setWords([])
    setStories([])
    setResourceError('')
    if (!selected) return () => { mounted = false }
    setResourcesLoading(true)
    Promise.all([loadVocab(selected.grow_name, klass, 'en'), loadStories(selected.grow_name, klass)])
      .then(([v, st]) => { if (mounted) { setWords(v); setStories(st); setResourcesLoading(false) } })
      .catch(() => { if (mounted) { setResourceError('Unable to load learning resources.'); setResourcesLoading(false) } })
    return () => { mounted = false }
  }, [gardens, garden, klass])

  if (checking) return <main style={{ minHeight: '100vh', background: '#0B3D26', color: 'white', display: 'grid', placeItems: 'center' }}>Checking your session…</main>

  return (
    <main style={{ minHeight: '100vh', background: '#0B3D26', color: '#fff', padding: '36px 22px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <button type="button" onClick={() => router.push('/')} style={{ background: 'transparent', color: '#fff', border: '1px solid #ffffff66', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>← All eight languages</button>
        <p style={{ marginTop: 36, letterSpacing: 2, color: '#FDB515' }}>LINGOGREEN · ENGLISH</p>
        <h1 style={{ fontSize: 'clamp(30px,5vw,48px)', margin: '8px 0' }}>English learning hub</h1>
        <p style={{ lineHeight: 1.7, color: '#e5eee9' }}>Explore English through food, energy, water and garden-based learning. This hub is under preview validation; existing quizzes and learner records are unchanged.</p>
        <div style={{ display: 'grid', gap: 18, marginTop: 30 }}>
          <label htmlFor="en-level">School level</label>
          <select id="en-level" value={level} onChange={e => { const next = LEVELS.find(x => x.id === e.target.value); if (next) { setLevel(next.id); setKlass(next.classes[0]) } }} style={{ padding: 14, borderRadius: 8, fontSize: 16 }}>
            {LEVELS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <label htmlFor="en-class">Class</label>
          <select id="en-class" value={klass} onChange={e => setKlass(e.target.value)} style={{ padding: 14, borderRadius: 8, fontSize: 16 }}>
            {LEVELS.find(x => x.id === level)?.classes.map(x => <option key={x} value={x}>{x.replace('-', ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <label htmlFor="en-garden" style={{ display: 'block', marginTop: 22 }}>Garden learning theme</label>
        <select id="en-garden" value={garden} onChange={e => setGarden(e.target.value)} style={{ padding: 14, borderRadius: 8, fontSize: 16, width: '100%', marginTop: 12 }}>
          <option value="">Choose a garden</option>
          {gardens.filter(g => hasVocab(g.grow_name, klass) || hasStory(g.grow_name, klass)).map(g => <option key={g.slug} value={g.slug}>{g.name_en}</option>)}
        </select>
        {resourceError && <p role="alert">{resourceError}</p>}
        {resourcesLoading && <p role="status">Loading English resources…</p>}
        <section aria-label="English learning pathways" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 36 }}>
          <div style={{ background: '#fff', color: '#221B12', borderRadius: 16, padding: 22 }}>
            <h2>Vocabulary</h2>
            <p>{words.length ? `${words.length} English entries available for this class and garden.` : 'Choose a supported garden to browse existing English vocabulary.'}</p>
            {words.slice(0, 12).map(w => <details key={w.id} style={{ borderTop: '1px solid #ddd', padding: '9px 0' }}><summary style={{ cursor: 'pointer' }}>{w.term}</summary><p>{w.def}</p><p><em>{w.example}</em></p></details>)}
            {words.length > 12 && <p>Showing the first 12 entries.</p>
          </div>
          <div style={{ background: '#fff', color: '#221B12', borderRadius: 16, padding: 22 }}>
            <h2>Storybooks</h2>
            <p>{stories.length ? `${stories.length} English stories available.` : 'Choose a supported garden to see available stories.'}</p>
            {stories.map(st => <details key={st.id} style={{ borderTop: '1px solid #ddd', padding: '9px 0' }}><summary style={{ cursor: 'pointer' }}>{st.title}</summary><p>{st.objective}</p>{st.chapters.map((ch,i) => <details key={i}><summary>{ch.title}</summary><p style={{ whiteSpace: 'pre-line' }}>{ch.prose}</p></details>)}</details>)}
          </div>
          <div style={{ background: '#fff', color: '#221B12', borderRadius: 16, padding: 22 }}>
            <h2>Quizzes and progress</h2>
            <p>Both existing quiz systems remain protected while authentication and result isolation are tested.</p>
            <span style={{ color: '#6d5b43' }}>Activation pending security tests</span>
          </div>
        </section>
        <p style={{ marginTop: 30, color: '#e5eee9' }}>Selected class: {klass.replace('-', ' ')}. Learning activities will be linked after existing content and learner workflows pass validation.</p>
      </div>
    </main>
  )
}
