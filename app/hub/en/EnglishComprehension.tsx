'use client'

import { useState } from 'react'
import type { StoryQuestion } from '@/app/lib/story-types'

type Props = { storyId: string; chapterIndex: number; questions: StoryQuestion[] }

export default function EnglishComprehension({ storyId, chapterIndex, questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const answerable = questions.filter(q => q.answer != null && Object.prototype.hasOwnProperty.call(q.options, q.answer))
  if (!answerable.length) return <p>No scored comprehension questions available for this chapter.</p>
  const key = (n: number) => `${storyId}-${chapterIndex}-${n}`
  const complete = answerable.every(q => Boolean(answers[key(q.n)]))
  const correct = answerable.filter(q => answers[key(q.n)] === q.answer).length
  return (
    <section aria-label="Chapter comprehension" style={{ borderTop: '1px solid #ddd', marginTop: 16, paddingTop: 12 }}>
      <h4>Check your understanding</h4>
      {answerable.map(q => (
        <fieldset key={key(q.n)} style={{ border: '1px solid #ddd', borderRadius: 8, margin: '12px 0', padding: 12 }}>
          <legend>{q.n}. {q.q}</legend>
          {Object.entries(q.options).map(([letter, label]) => (
            <label key={letter} style={{ display: 'block', padding: '7px 0' }}>
              <input type="radio" name={key(q.n)} value={letter} disabled={submitted}
                checked={answers[key(q.n)] === letter}
                onChange={() => setAnswers(prev => ({ ...prev, [key(q.n)]: letter }))} />
              {' '}{letter}. {label}
            </label>
          ))}
          {submitted && <p role="status">{answers[key(q.n)] === q.answer ? 'Correct' : `Correct answer: ${q.answer}`}</p>}
        </fieldset>
      ))}
      {submitted ? (
        <div role="status">
          <strong>Chapter score: {correct} / {answerable.length}</strong>
          <p>This practice score is local to this page and is not saved to your learner dashboard.</p>
          <button type="button" onClick={() => { setAnswers({}); setSubmitted(false) }}>Try again</button>
        </div>
      ) : <button type="button" disabled={!complete} onClick={() => setSubmitted(true)}>Check answers</button>}
    </section>
  )
}
