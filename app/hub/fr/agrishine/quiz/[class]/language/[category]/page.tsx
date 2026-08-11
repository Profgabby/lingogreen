'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { browserClient } from '@/app/lib/supabase-browser'
import { langCategoryBySlug, type LangQuestion } from '@/app/lib/lang-p1'
import { p2LangCategoryBySlug } from '@/app/lib/lang-p2'

const T = { ink:'#2A2118', ink2:'#5A4A36', muted:'#8A7B63', forest:'#0B3D26', forest2:'#072D1C', gold:'#C8912E', goldSoft:'#E8B04B', green:'#3E9B7C', red:'#D6604A' }
const CORRECT = ['Bravo! 🌟','Très bien! 🎉','Excellent! ⭐','C\u2019est ça! 👏']
const WRONG = ['Bon essai!','Presque!','Continue!']

function shuffled(q: LangQuestion) {
  const idx = q.options.map((_, i) => i)
  for (let i=idx.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]] }
  return { options: idx.map(i=>q.options[i]), correct: idx.indexOf(q.correct) }
}

export default function LangPlayer() {
  const router = useRouter()
  const params = useParams()
  const klass = String(params.class || 'primary-1')
  const catSlug = String(params.category || '')
  const cat = klass === 'primary-2' ? p2LangCategoryBySlug(catSlug) : langCategoryBySlug(catSlug)

  const [checking, setChecking] = useState(true)
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [misses, setMisses] = useState(0)
  const [picked, setPicked] = useState<number|null>(null)
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [ended, setEnded] = useState<null|'terminated'|'complete'>(null)
  const [saved, setSaved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)

  const deck = useMemo(()=> cat ? cat.questions.map(shuffled) : [], [cat])

  useEffect(() => {
    const supabase = browserClient()
    supabase.auth.getUser().then(({ data }) => { if (!data.user) { router.replace('/login'); return } setChecking(false) })
  }, [router])

  useEffect(() => {
    if (checking || ended || locked || !cat) return
    setTimeLeft(30)
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setInterval(() => { setTimeLeft(s => { if (s<=1){ clearInterval(timerRef.current!); handleTimeout(); return 0 } return s-1 }) }, 1000)
    return () => { timerRef.current && clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, checking, ended])

  // ---------- SAVE ATTEMPT (runs once when the quiz ends) ----------
  useEffect(() => {
    if (!ended || saved || !cat) return
    setSaved(true) // guard: only ever write one row per attempt
    const completed = correct + wrong
    const accuracy = completed ? Math.round((correct / completed) * 100) : 0
    const earnedBadge = ended === 'complete' && misses < 3
    ;(async () => {
      try {
        const supabase = browserClient()
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return
        await supabase.from('quiz_attempts').insert({
          user_id: userData.user.id,
          klass,
          quiz_type: 'language',
          category: catSlug,
          score,
          correct,
          completed,
          total: cat.questions.length,
          accuracy,
          badge_earned: earnedBadge,
          ended,
        })
      } catch (e) {
        console.error('quiz_attempts save failed', e)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended])

  if (!cat) return (<main style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:T.forest, color:'#fff', fontFamily:'Inter' }}><div>Quiz not found.</div></main>)
  if (checking) return (<main style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:T.forest, color:'rgba(255,255,255,.6)', fontFamily:'Inter' }}><div>…</div></main>)

  const q = cat.questions[qi]
  const d = deck[qi]

  function advance(nm:number){ setTimeout(()=>{ if(nm>=3){setEnded('terminated');return} if(qi+1>=cat!.questions.length){setEnded('complete');return} setQi(qi+1); setPicked(null); setLocked(false); setFeedback('') },1400) }
  function handleTimeout(){ if(locked)return; setLocked(true); const nm=misses+1; setWrong(w=>w+1); setMisses(nm); setFeedback('Temps écoulé!'); advance(nm) }
  function pick(i:number){ if(locked)return; timerRef.current&&clearInterval(timerRef.current); setLocked(true); setPicked(i)
    if(i===d.correct){ setScore(s=>s+10); setCorrect(c=>c+1); setMisses(0); setFeedback(CORRECT[Math.floor(Math.random()*CORRECT.length)]); advance(0) }
    else { const nm=misses+1; setWrong(w=>w+1); setMisses(nm); setFeedback(WRONG[Math.floor(Math.random()*WRONG.length)]); advance(nm) } }

  if (ended) {
    const completed=correct+wrong, accuracy=completed?Math.round(correct/completed*100):0, earned=ended==='complete'&&misses<3
    return (
      <main style={{ minHeight:'100vh', fontFamily:'Inter, system-ui, sans-serif', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:`linear-gradient(165deg, ${T.forest}, ${T.forest2})` }}>
        <div style={{ background:'#fff', color:T.ink, borderRadius:24, maxWidth:440, width:'100%', padding:'34px 30px', textAlign:'center', boxShadow:'0 24px 60px -20px rgba(0,0,0,.5)', borderTop:`8px solid ${cat.color}` }}>
          <div style={{ fontSize:46, marginBottom:8 }}>{ended==='complete'?'🎉':'🌟'}</div>
          <h1 style={{ fontFamily:'Fraunces, serif', fontWeight:600, fontSize:28, margin:'0 0 6px' }}>{ended==='complete'?'Quiz terminé!':'Bon essai!'}</h1>
          <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:T.muted, marginBottom:14 }}>{cat.icon} {cat.name.toUpperCase()}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, margin:'18px 0' }}>
            <St label="Score" value={`${score}`} /><St label="Correct" value={`${correct} / ${cat.questions.length}`} />
            <St label="Completed" value={`${completed} / ${cat.questions.length}`} /><St label="Accuracy" value={`${accuracy}%`} />
          </div>
          {earned && (<div style={{ background:'rgba(62,124,166,.12)', borderRadius:16, padding:'16px', marginBottom:16 }}>
            <div style={{ fontSize:34 }}>🇫🇷</div><div style={{ fontFamily:'Fraunces, serif', fontSize:19, marginTop:4 }}>You earned the</div>
            <div style={{ fontFamily:'Fraunces, serif', fontSize:22, color:cat.color, fontWeight:600 }}>{cat.name} Badge!</div></div>)}
          <div style={{ display:'grid', gap:10, marginTop:8 }}>
            <button onClick={()=>window.location.reload()} style={btn(cat.color,true)}>Try Again</button>
            <button onClick={()=>router.push(`/hub/fr/agrishine/quiz/${klass}/language`)} style={btn(cat.color,false)}>Back to Language Quizzes</button>
          </div>
        </div>
      </main>
    )
  }

  const pct=Math.round(qi/cat.questions.length*100), urgent=timeLeft<=10

  return (
    <main style={{ minHeight:'100vh', fontFamily:'Inter, system-ui, sans-serif', color:'#fff', background:`linear-gradient(165deg, ${T.forest}, ${T.forest2})`, paddingBottom:40 }}>
      <div style={{ padding:'16px 22px 0', maxWidth:640, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <span style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:13, color:T.goldSoft }}>{cat.icon} {cat.name}</span>
          <button onClick={()=>router.push(`/hub/fr/agrishine/quiz/${klass}/language`)} style={{ border:'1px solid rgba(255,255,255,.3)', background:'rgba(255,255,255,.1)', color:'#fff', borderRadius:16, padding:'4px 12px', fontSize:12, cursor:'pointer', fontFamily:'Inter' }}>Exit</button>
        </div>
        <div style={{ height:8, background:'rgba(255,255,255,.15)', borderRadius:8, overflow:'hidden', marginBottom:8 }}>
          <div style={{ width:`${pct}%`, height:'100%', background:cat.color, transition:'width .3s' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'IBM Plex Mono, monospace', fontSize:12.5, color:'rgba(255,255,255,.8)' }}>
          <span>Question {qi+1} of {cat.questions.length}</span><span>🟢 EASY</span>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:'14px auto 0', padding:'0 22px', display:'flex', gap:10, justifyContent:'space-between' }}>
        <MiniStat label="Score" value={score} /><MiniStat label="Correct" value={correct} />
        <MiniStat label="Misses" value={'●'.repeat(misses)+'○'.repeat(3-misses)} /><MiniStat label="Time" value={`00:${String(timeLeft).padStart(2,'0')}`} urgent={urgent} />
      </div>

      <div style={{ maxWidth:640, margin:'20px auto 0', padding:'0 22px' }}>
        <div style={{ background:'#fff', color:T.ink, borderRadius:20, padding:'26px 24px', boxShadow:'0 16px 40px -18px rgba(0,0,0,.5)', borderTop:`6px solid ${cat.color}` }}>
          {q.avatar && (<div style={{ textAlign:'center', fontSize:88, lineHeight:1, marginBottom:14 }}>{q.avatar}</div>)}
          <div style={{ fontFamily:'Fraunces, serif', fontSize:23, lineHeight:1.3, marginBottom:22, textAlign:'center' }}>{q.q}</div>
          <div style={{ display:'grid', gap:12 }}>
            {d.options.map((opt,i)=>{
              let bg='#F4EFE4', border='2px solid transparent'
              if(locked){ if(i===d.correct){bg='rgba(62,155,124,.18)';border=`2px solid ${T.green}`} else if(i===picked){bg='rgba(214,96,74,.15)';border=`2px solid ${T.red}`} }
              return (
                <button key={i} onClick={()=>pick(i)} disabled={locked}
                  style={{ textAlign:'left', background:bg, border, borderRadius:14, padding:'16px 18px', fontSize:18, fontWeight:500, cursor:locked?'default':'pointer', fontFamily:'Inter', color:T.ink, display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ width:30, height:30, borderRadius:'50%', background:'#fff', display:'grid', placeItems:'center', fontFamily:'Fraunces, serif', fontSize:15, flexShrink:0, color:T.muted, border:'1px solid #E4DAC4' }}>{String.fromCharCode(65+i)}</span>
                  <span>{opt}</span>
                  {locked && i===d.correct && <span style={{ marginLeft:'auto', color:T.green }}>✓</span>}
                  {locked && i===picked && i!==d.correct && <span style={{ marginLeft:'auto', color:T.red }}>✕</span>}
                </button>
              )
            })}
          </div>
          {feedback && (<div style={{ marginTop:18, textAlign:'center', fontFamily:'Fraunces, serif', fontSize:20, color: picked!==null&&picked===d.correct?T.green:(feedback==='Temps écoulé!'?T.red:T.ink2) }}>
            {feedback}{locked && picked!==d.correct && <div style={{ fontSize:14.5, color:T.ink2, marginTop:4, fontFamily:'Inter' }}>Correct: <b>{d.options[d.correct]}</b></div>}</div>)}
        </div>
      </div>
    </main>
  )
}

function MiniStat({ label, value, urgent }: { label:string; value:React.ReactNode; urgent?:boolean }) {
  return (<div style={{ flex:1, background:urgent?'rgba(214,96,74,.25)':'rgba(255,255,255,.08)', borderRadius:12, padding:'8px 6px', textAlign:'center', border:urgent?'1px solid rgba(214,96,74,.6)':'1px solid rgba(255,255,255,.12)' }}>
    <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:9.5, letterSpacing:'.06em', color:'rgba(255,255,255,.6)', textTransform:'uppercase' }}>{label}</div>
    <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:16, fontWeight:600, color:urgent?'#ffd9d2':'#fff', marginTop:2 }}>{value}</div></div>)
}
function St({ label, value }: { label:string; value:string }) {
  return (<div style={{ background:'#F4EFE4', borderRadius:12, padding:'12px 8px' }}>
    <div style={{ fontFamily:'IBM Plex Mono, monospace', fontSize:10, color:'#8A7B63', letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</div>
    <div style={{ fontFamily:'Fraunces, serif', fontSize:20, color:'#2A2118', marginTop:2 }}>{value}</div></div>)
}
function btn(color:string, filled:boolean): React.CSSProperties {
  return { width:'100%', border:filled?'none':`1px solid ${color}`, borderRadius:12, padding:14, fontSize:15.5, fontWeight:600, cursor:'pointer', fontFamily:'Inter', background:filled?color:'transparent', color:filled?'#fff':color }
}
