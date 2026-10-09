'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { browserClient } from '@/app/lib/supabase-browser'

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

  useEffect(() => {
    let mounted = true
    browserClient().auth.getUser().then(({ data, error }) => {
      if (!mounted) return
      if (error || !data.user) router.replace('/login')
      else setChecking(false)
    }).catch(() => { if (mounted) router.replace('/login') })
    return () => { mounted = false }
  }, [router])

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
        <section aria-label="English learning pathways" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 36 }}>
          <div style={{ background: '#fff', color: '#221B12', borderRadius: 16, padding: 22 }}>
            <h2>Vocabulary</h2>
            <p>Existing English vocabulary is being reviewed for coverage and quality.</p>
            <span style={{ color: '#6d5b43' }}>Pathway verification pending</span>
          </div>
          <div style={{ background: '#fff', color: '#221B12', borderRadius: 16, padding: 22 }}>
            <h2>Storybooks</h2>
            <p>Existing English stories are being checked by class and topic.</p>
            <span style={{ color: '#6d5b43' }}>Pathway verification pending</span>
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
