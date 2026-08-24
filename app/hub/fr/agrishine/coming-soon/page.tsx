'use client'
import { useRouter, useSearchParams } from 'next/navigation'
const T = { forest: '#0B3D26', gold: '#C8912E' }
const MSG: Record<string, { en: string; sub: string }> = {
  teacher: {
    en: 'Teacher workspace is coming soon',
    sub: 'Lesson plans, printable activity books, assignments and student progress tracking are being built. In the meantime you can explore the student learning tools to see the content your class will use.',
  },
  school_admin: {
    en: 'School dashboard is coming soon',
    sub: 'Programs, people management, garden monitoring and school-wide reports are being built. In the meantime you can explore the student learning tools to see what your school will offer.',
  },
}
export default function ComingSoonPage() {
  const router = useRouter()
  const search = useSearchParams()
  const role = search.get('role') || 'teacher'
  const m = MSG[role] || MSG.teacher
  return (
    <main style={{ minHeight: '100vh', background: T.forest, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🛠️</div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 'clamp(26px,4vw,38px)', margin: '0 0 14px' }}>{m.en}</h1>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, margin: '0 0 28px' }}>{m.sub}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/hub/fr/agrishine/level/primary')}
            style={{ background: T.gold, color: '#1a1206', border: 'none', borderRadius: 24, padding: '12px 22px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' }}>
            Explore student tools
          </button>
          <button onClick={() => router.push('/hub/fr/agrishine')}
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.3)', borderRadius: 24, padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
            ← Back
          </button>
        </div>
      </div>
    </main>
  )
}
