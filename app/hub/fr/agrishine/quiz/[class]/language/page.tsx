'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'
import { P1_LANG } from '@/app/lib/lang-p1'

const T = { ink:'#2A2118', ink2:'#5A4A36', muted:'#8A7B63', forest:'#0B3D26', forest2:'#072D1C', gold:'#C8912E', goldSoft:'#E8B04B' }

type Progress = { best: Record<string, number>; badges: Record<string, boolean> }

export default function LanguageHome() {
  const router = useRouter()
  const params = useParams()
  const klass = String(params.class || 'primary-1')
  const [checking, setChecking] = useState(true)
  const [progress, setProgress] = useState<Progress>({ best: {}, badges: {} })

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      setChecking(false)
      try {
        const { data: rows } = await supabase
          .from('quiz_attempts')
          .select('category, score, badge_earned')
          .eq('user_id', data.user.id)
          .eq('quiz_type', 'language')
          .eq('klass', klass)
        const best: Record<string, number> = {}
        const badges: Record<string, boolean> = {}
        ;(rows || []).forEach((r: { category: string; score: number; badge_earned: boolean }) => {
          if (best[r.category] === undefined || r.score > best[r.category]) best[r.category] = r.score
          if (r.badge_earned) badges[r.category] = true
        })
        setProgress({ best, badges })
      } catch (e) {
        console.error('progress load failed', e)
      }
    })
  }, [router, klass])

  if (checking) return (<main style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:T.forest, fontFamily:'Inter', color:'rgba(255,255,255,.6)' }}><div>…</div></main>)

  return (
    <main style={{ minHeight:'100vh', fontFamily:'Inter, system-ui, sans-serif', color:'#fff',
      background:`radial-gradient(900px 500px at 80% -5%, rgba(200,145,46,.12), transparent 55%), radial-gradient(800px 600px at 0% 100%, rgba(141,190,104,.10), transparent 55%), linear-gradient(165deg, ${T.forest}, ${T.forest2})` }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 26px', borderBottom:'1px solid rgba(255,255,255,.12)', position:'sticky', top:0, zIndex:50, background:'rgba(7,45,28,.75)', backdropFilter:'blur(10px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <span style={{ display:'inline-flex', width:40, height:40, borderRadius:'50%', background:'#F2EBDA', alignItems:'center', justifyContent:'center' }}>
            <Image src="/lifews-logo.png" alt="LIFEWS" width={32} height={32} style={{ objectFit:'contain' }} />
          </span>
          <span style={{ fontFamily:'Fraunces, serif', fontSize:21, fontWeight:600 }}><span>Lingo</span><span style={{ color:T.goldSoft }}>Green</span></span>
        </div>
        <button onClick={() => router.push(`/hub/fr/agrishine/quiz/${klass}`)} style={{ border:'none', background:'transparent', color:'rgba(255,255,255,.7)', fontSize:14, cursor:'pointer', fontFamily:'Inter' }}>← Back</button>
      </nav>

      <section style={{ maxWidth:1080, margin:'0 auto', padding:'44px 26px 8px', textAlign:'center' }}>
        <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:13, letterSpacing:'.16em', color:T.goldSoft, marginBottom:12 }}>🇫🇷 LANGUAGE QUIZ · PRIMARY 1</div>
        <h1 style={{ fontFamily:'Fraunces, serif', fontWeight:500, fontSize:'clamp(30px,4vw,46px)', margin:'0 0 12px', lineHeight:1.08 }}>Apprends le français</h1>
        <p style={{ color:'rgba(255,255,255,.82)', fontSize:17, lineHeight:1.6, maxWidth:560, margin:'0 auto' }}>Six ways to test your French words. Learn • Play • Score.</p>
      </section>

      <section style={{ maxWidth:1080, margin:'0 auto', padding:'32px 26px 64px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
          {P1_LANG.map((cat) => {
            const bestScore = progress.best[cat.slug]
            const hasBadge = progress.badges[cat.slug]
            return (
            <div key={cat.slug} onClick={() => router.push(`/hub/fr/agrishine/quiz/${klass}/language/${cat.slug}`)}
              style={{ background:'#fff', borderRadius:18, padding:'26px 22px 22px', position:'relative', overflow:'hidden', cursor:'pointer', boxShadow:'0 16px 36px -18px rgba(0,0,0,.55)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:cat.color }} />
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:cat.color, display:'grid', placeItems:'center', fontSize:30 }}>{cat.icon}</div>
                <div>
                  <div style={{ fontFamily:'Fraunces, serif', fontSize:22, color:T.ink, lineHeight:1.1 }}>{cat.name}</div>
                  <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:T.muted, marginTop:3 }}>{cat.questions.length} QUESTIONS</div>
                </div>
              </div>

              {/* progress row: best score + badge */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, flexWrap:'wrap' }}>
                <span style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12.5, color: bestScore !== undefined ? T.ink : T.muted, background:'#F4EFE4', borderRadius:20, padding:'5px 12px' }}>
                  {bestScore !== undefined ? `Best: ${bestScore}` : 'Not tried yet'}
                </span>
                {hasBadge && (
                  <span style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12.5, color:'#fff', background:cat.color, borderRadius:20, padding:'5px 12px', display:'inline-flex', alignItems:'center', gap:5 }}>
                    🇫🇷 Earned
                  </span>
                )}
              </div>

              <button onClick={(e)=>{ e.stopPropagation(); router.push(`/hub/fr/agrishine/quiz/${klass}/language/${cat.slug}`) }}
                style={{ width:'100%', border:'none', borderRadius:12, padding:14, fontSize:15.5, fontWeight:600, cursor:'pointer', fontFamily:'Inter', background:T.forest, color:'#fff' }}>
                {bestScore !== undefined ? 'Rejouer' : 'Commencer'}
              </button>
            </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
