'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { browserClient } from '@/app/lib/supabase-browser'
import { P1_QUIZ } from '@/app/lib/quiz-p1'
import { P1_LANG } from '@/app/lib/lang-p1'

const T = { ink:'#2A2118', ink2:'#5A4A36', muted:'#8A7B63', forest:'#0B3D26', forest2:'#072D1C', gold:'#C8912E', goldSoft:'#E8B04B', green:'#3E9B7C' }

type Attempt = { quiz_type:string; category:string; score:number; badge_earned:boolean }
type Best = Record<string, number>
type Badges = Record<string, boolean>

export default function Dashboard() {
  const router = useRouter()
  const params = useParams()
  const klass = String(params.class || 'primary-1')
  const [checking, setChecking] = useState(true)
  const [kBest, setKBest] = useState<Best>({})
  const [kBadge, setKBadge] = useState<Badges>({})
  const [lBest, setLBest] = useState<Best>({})
  const [lBadge, setLBadge] = useState<Badges>({})

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      setChecking(false)
      try {
        const { data: rows } = await supabase
          .from('quiz_attempts')
          .select('quiz_type, category, score, badge_earned')
          .eq('user_id', data.user.id)
          .eq('klass', klass)
        const kb: Best = {}, kbd: Badges = {}, lb: Best = {}, lbd: Badges = {}
        ;(rows as Attempt[] | null || []).forEach((r) => {
          if (r.quiz_type === 'knowledge') {
            if (kb[r.category] === undefined || r.score > kb[r.category]) kb[r.category] = r.score
            if (r.badge_earned) kbd[r.category] = true
          } else if (r.quiz_type === 'language') {
            if (lb[r.category] === undefined || r.score > lb[r.category]) lb[r.category] = r.score
            if (r.badge_earned) lbd[r.category] = true
          }
        })
        setKBest(kb); setKBadge(kbd); setLBest(lb); setLBadge(lbd)
      } catch (e) {
        console.error('dashboard load failed', e)
      }
    })
  }, [router, klass])

  if (checking) {
    return (<main style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:T.forest, fontFamily:'Inter, system-ui, sans-serif', color:'rgba(255,255,255,.6)' }}><div>…</div></main>)
  }

  const kTried = P1_QUIZ.filter((c) => kBest[c.slug] !== undefined).length
  const lTried = P1_LANG.filter((c) => lBest[c.slug] !== undefined).length
  const kBadgeCount = Object.values(kBadge).filter(Boolean).length
  const lBadgeCount = Object.values(lBadge).filter(Boolean).length
  const totalBadges = kBadgeCount + lBadgeCount

  // master badge logic
  const knowledgeChampion = kBadgeCount >= P1_QUIZ.length
  const frenchWordMaster = lBadgeCount >= P1_LANG.length
  const primaryChampion = knowledgeChampion && frenchWordMaster

  const masters = [
    { icon:'🏆', title:'Knowledge Champion', done:knowledgeChampion, progress:`${kBadgeCount} / ${P1_QUIZ.length}`, color:'#5C9E3A' },
    { icon:'🇫🇷', title:'French Word Master', done:frenchWordMaster, progress:`${lBadgeCount} / ${P1_LANG.length}`, color:'#3E7CA6' },
    { icon:'👑', title:'Primary 1 Champion', done:primaryChampion, progress: primaryChampion ? 'Complete!' : 'Earn both above', color:T.gold },
  ]

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

      <section style={{ maxWidth:1000, margin:'0 auto', padding:'44px 26px 8px', textAlign:'center' }}>
        <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:13, letterSpacing:'.16em', color:T.goldSoft, marginBottom:12 }}>MY PROGRESS · {klass.replace('primary-','PRIMARY ').replace('jss-','JSS ').toUpperCase()}</div>
        <h1 style={{ fontFamily:'Fraunces, serif', fontWeight:500, fontSize:'clamp(30px,4vw,46px)', margin:'0 0 12px', lineHeight:1.08 }}>How I&rsquo;m doing</h1>
        <p style={{ color:'rgba(255,255,255,.82)', fontSize:17, lineHeight:1.6, maxWidth:560, margin:'0 auto' }}>Every quiz you finish shows up here.</p>
      </section>

      {/* master badges */}
      <section style={{ maxWidth:1000, margin:'0 auto', padding:'28px 26px 8px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
          {masters.map((m) => (
            <div key={m.title} style={{
              background: m.done ? '#fff' : 'rgba(255,255,255,.06)',
              border: m.done ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,.14)',
              borderRadius:18, padding:'22px 20px', textAlign:'center', position:'relative', overflow:'hidden',
              opacity: m.done ? 1 : 0.78 }}>
              <div style={{ fontSize:44, marginBottom:6, filter: m.done ? 'none' : 'grayscale(1)' }}>{m.done ? m.icon : '🔒'}</div>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:20, color: m.done ? T.ink : '#fff', lineHeight:1.15 }}>{m.title}</div>
              <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12.5, marginTop:6,
                color: m.done ? m.color : 'rgba(255,255,255,.7)' }}>
                {m.done ? '★ Earned!' : m.progress}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* summary tiles */}
      <section style={{ maxWidth:1000, margin:'0 auto', padding:'20px 26px 8px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
          <SummaryTile icon="🧠" label="Knowledge tried" value={`${kTried} / ${P1_QUIZ.length}`} />
          <SummaryTile icon="🇫🇷" label="Language tried" value={`${lTried} / ${P1_LANG.length}`} />
          <SummaryTile icon="🏅" label="Badges earned" value={`${totalBadges}`} />
        </div>
      </section>

      {/* knowledge detail */}
      <section style={{ maxWidth:1000, margin:'0 auto', padding:'28px 26px 8px' }}>
        <h2 style={{ fontFamily:'Fraunces, serif', fontWeight:500, fontSize:24, margin:'0 0 14px' }}>🧠 Knowledge</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14 }}>
          {P1_QUIZ.map((c) => (
            <RowCard key={c.slug} color={c.color} icon={c.icon} name={c.name}
              best={kBest[c.slug]} badge={kBadge[c.slug] ? `${c.badgeIcon} ${c.badge}` : null} />
          ))}
        </div>
      </section>

      {/* language detail */}
      <section style={{ maxWidth:1000, margin:'0 auto', padding:'28px 26px 64px' }}>
        <h2 style={{ fontFamily:'Fraunces, serif', fontWeight:500, fontSize:24, margin:'0 0 14px' }}>🇫🇷 Français</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14 }}>
          {P1_LANG.map((c) => (
            <RowCard key={c.slug} color={c.color} icon={c.icon} name={c.name}
              best={lBest[c.slug]} badge={lBadge[c.slug] ? `🇫🇷 ${c.name}` : null} />
          ))}
        </div>
      </section>
    </main>
  )
}

function SummaryTile({ icon, label, value }: { icon:string; label:string; value:string }) {
  return (
    <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', borderRadius:18, padding:'22px 20px', textAlign:'center' }}>
      <div style={{ fontSize:34, marginBottom:6 }}>{icon}</div>
      <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:11, letterSpacing:'.08em', color:'rgba(255,255,255,.7)', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontFamily:'Fraunces, serif', fontSize:30, marginTop:4 }}>{value}</div>
    </div>
  )
}

function RowCard({ color, icon, name, best, badge }: { color:string; icon:string; name:string; best:number|undefined; badge:string|null }) {
  return (
    <div style={{ background:'#fff', color:T.ink, borderRadius:14, padding:'16px 16px', position:'relative', overflow:'hidden', boxShadow:'0 10px 26px -16px rgba(0,0,0,.5)' }}>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:5, background:color }} />
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, paddingLeft:6 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:color, display:'grid', placeItems:'center', fontSize:20 }}>{icon}</div>
        <div style={{ fontFamily:'Fraunces, serif', fontSize:18, lineHeight:1.1 }}>{name}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, paddingLeft:6, flexWrap:'wrap' }}>
        <span style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12.5, color: best !== undefined ? T.ink : T.muted, background:'#F4EFE4', borderRadius:20, padding:'4px 11px' }}>
          {best !== undefined ? `Best: ${best}` : 'Not tried yet'}
        </span>
        {badge && (
          <span style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:'#fff', background:color, borderRadius:20, padding:'4px 11px' }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
