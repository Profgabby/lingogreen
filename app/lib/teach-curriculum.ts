// LingoGreen Teacher · Teach curriculum architecture.
// Structure is FIXED and derivable: every class×garden has 3 terms × 12 weeks.
// Weeks 1–11 = instruction, Week 12 = celebration.
// Real lesson notes are inserted into LESSONS later, keyed "class|garden|term|week".
// Do NOT fabricate lesson content — empty lookups render a "coming soon" placeholder.

export const CURRICULUM = {
  terms: 3,
  weeksPerTerm: 12,
  instructionWeeks: 11, // weeks 1–11
  celebrationWeek: 12,
} as const

export type WeekType = 'instruction' | 'celebration'

// Concise lesson-note shape (from handoff §21). All optional — filled when supplied.
export type Lesson = {
  title?: string
  duration?: string
  objectives?: string[]
  flashcards?: { label: string; usage?: string }[]
  vocabulary?: string[]
  materials?: string[]
  preparation?: string[]
  starter?: string
  teach?: string[]
  guidedActivity?: string
  gardenActivity?: string
  check?: string[]
  assessment?: string[]
  safety?: string[]
  // celebration-week fields
  celebration?: {
    lookBack?: string
    showcase?: string
    teamActivity?: string
    reflection?: string
    recognition?: string
  }
}

// Real content lands here later, keyed `${classKey}|${gardenKey}|${term}|${week}`.
// Starts empty on purpose. Example future entry:
//   'primary-4|gmeal|1|3': { title: 'Parts of a Plant', duration: '40–60 min', objectives: [...] }
export const LESSONS: Record<string, Lesson> = {}

export function weekType(week: number): WeekType {
  return week === CURRICULUM.celebrationWeek ? 'celebration' : 'instruction'
}

export function lessonKey(classKey: string, gardenKey: string, term: number, week: number): string {
  return `${classKey}|${gardenKey}|${term}|${week}`
}

export function getLesson(classKey: string, gardenKey: string, term: number, week: number): Lesson | null {
  return LESSONS[lessonKey(classKey, gardenKey, term, week)] || null
}
