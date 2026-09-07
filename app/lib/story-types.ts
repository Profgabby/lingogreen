// Storybook types + lazy loader. English canonical; multilingual-ready.
// GrowMeal only for now; extend LOADERS as more gardens are wired.

export type StoryQuestion = {
  n: number
  q: string
  options: Record<string, string> // { A: '...', B: '...', C: '...', D: '...' }
  answer: string | null           // 'A'|'B'|'C'|'D'
}
export type StoryChapter = {
  title: string
  prose: string
  notice: string[]                // words to notice
  questions: StoryQuestion[]
}
export type Story = {
  id: string                      // e.g. P1-GM-01 — stable, never regenerate
  title: string
  objective: string
  vocabulary: string[]
  chapters: StoryChapter[]
}

// Maps Supabase grow_name -> story garden key (mirrors vocab GROW_TO_KEY).
const GROW_TO_STORYKEY: Record<string, string> = {
  GrowMeal: 'gmeal',
  GrowFlow: 'gflow',
  GrowFloat: 'gfloat',
  GrowAqua: 'gaqua',
  GrowFarm: 'gfarm',
  GrowPower: 'gpower',
  // SSS advanced garden aliases (reuse base-garden stories):
  GrowOptimize: 'gfloat',
  GrowAquaSystem: 'gaqua',
}

const KLASS_OK = new Set([
  'primary-1','primary-2','primary-3','primary-4','primary-5','primary-6',
  'jss-1','jss-2','jss-3','sss-1','sss-2','sss-3',
])

// Explicit lazy import map (Turbopack-safe). GrowMeal × 12 classes.
const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  'gmeal-primary-1': () => import('./story-data/story-gmeal-primary-1'),
  'gmeal-primary-2': () => import('./story-data/story-gmeal-primary-2'),
  'gmeal-primary-3': () => import('./story-data/story-gmeal-primary-3'),
  'gmeal-primary-4': () => import('./story-data/story-gmeal-primary-4'),
  'gmeal-primary-5': () => import('./story-data/story-gmeal-primary-5'),
  'gmeal-primary-6': () => import('./story-data/story-gmeal-primary-6'),
  'gmeal-jss-1': () => import('./story-data/story-gmeal-jss-1'),
  'gmeal-jss-2': () => import('./story-data/story-gmeal-jss-2'),
  'gmeal-jss-3': () => import('./story-data/story-gmeal-jss-3'),
  'gmeal-sss-1': () => import('./story-data/story-gmeal-sss-1'),
  'gmeal-sss-2': () => import('./story-data/story-gmeal-sss-2'),
  'gmeal-sss-3': () => import('./story-data/story-gmeal-sss-3'),
  'gflow-primary-1': () => import('./story-data/story-gflow-primary-1'),
  'gflow-primary-2': () => import('./story-data/story-gflow-primary-2'),
  'gflow-primary-3': () => import('./story-data/story-gflow-primary-3'),
  'gflow-primary-4': () => import('./story-data/story-gflow-primary-4'),
  'gflow-primary-5': () => import('./story-data/story-gflow-primary-5'),
  'gflow-primary-6': () => import('./story-data/story-gflow-primary-6'),
  'gflow-jss-1': () => import('./story-data/story-gflow-jss-1'),
  'gflow-jss-2': () => import('./story-data/story-gflow-jss-2'),
  'gflow-jss-3': () => import('./story-data/story-gflow-jss-3'),
  'gflow-sss-1': () => import('./story-data/story-gflow-sss-1'),
  'gflow-sss-2': () => import('./story-data/story-gflow-sss-2'),
  'gflow-sss-3': () => import('./story-data/story-gflow-sss-3'),
  'gfloat-primary-1': () => import('./story-data/story-gfloat-primary-1'),
  'gfloat-primary-2': () => import('./story-data/story-gfloat-primary-2'),
  'gfloat-primary-3': () => import('./story-data/story-gfloat-primary-3'),
  'gfloat-primary-4': () => import('./story-data/story-gfloat-primary-4'),
  'gfloat-primary-5': () => import('./story-data/story-gfloat-primary-5'),
  'gfloat-primary-6': () => import('./story-data/story-gfloat-primary-6'),
  'gfloat-jss-1': () => import('./story-data/story-gfloat-jss-1'),
  'gfloat-jss-2': () => import('./story-data/story-gfloat-jss-2'),
  'gfloat-jss-3': () => import('./story-data/story-gfloat-jss-3'),
  'gfloat-sss-1': () => import('./story-data/story-gfloat-sss-1'),
  'gfloat-sss-2': () => import('./story-data/story-gfloat-sss-2'),
  'gfloat-sss-3': () => import('./story-data/story-gfloat-sss-3'),
  'gaqua-primary-1': () => import('./story-data/story-gaqua-primary-1'),
  'gaqua-primary-2': () => import('./story-data/story-gaqua-primary-2'),
  'gaqua-primary-3': () => import('./story-data/story-gaqua-primary-3'),
  'gaqua-primary-4': () => import('./story-data/story-gaqua-primary-4'),
  'gaqua-primary-5': () => import('./story-data/story-gaqua-primary-5'),
  'gaqua-primary-6': () => import('./story-data/story-gaqua-primary-6'),
  'gaqua-jss-1': () => import('./story-data/story-gaqua-jss-1'),
  'gaqua-jss-2': () => import('./story-data/story-gaqua-jss-2'),
  'gaqua-jss-3': () => import('./story-data/story-gaqua-jss-3'),
  'gaqua-sss-1': () => import('./story-data/story-gaqua-sss-1'),
  'gaqua-sss-2': () => import('./story-data/story-gaqua-sss-2'),
  'gaqua-sss-3': () => import('./story-data/story-gaqua-sss-3'),
  'gfarm-primary-1': () => import('./story-data/story-gfarm-primary-1'),
  'gfarm-primary-2': () => import('./story-data/story-gfarm-primary-2'),
  'gfarm-primary-3': () => import('./story-data/story-gfarm-primary-3'),
  'gfarm-primary-4': () => import('./story-data/story-gfarm-primary-4'),
  'gfarm-primary-5': () => import('./story-data/story-gfarm-primary-5'),
  'gfarm-primary-6': () => import('./story-data/story-gfarm-primary-6'),
  'gpower-primary-1': () => import('./story-data/story-gpower-primary-1'),
  'gpower-primary-2': () => import('./story-data/story-gpower-primary-2'),
  'gpower-primary-3': () => import('./story-data/story-gpower-primary-3'),
  'gpower-primary-4': () => import('./story-data/story-gpower-primary-4'),
  'gpower-primary-5': () => import('./story-data/story-gpower-primary-5'),
  'gpower-primary-6': () => import('./story-data/story-gpower-primary-6'),
}

export function storyKey(growName: string | null, klass: string | undefined): string | null {
  if (!growName || !klass) return null
  const g = GROW_TO_STORYKEY[growName]
  if (!g || !KLASS_OK.has(klass)) return null
  return `${g}-${klass}`
}

export function hasStory(growName: string | null, klass: string | undefined): boolean {
  const k = storyKey(growName, klass)
  return k !== null && k in LOADERS
}

export async function loadStories(growName: string | null, klass: string | undefined): Promise<Story[]> {
  const key = storyKey(growName, klass)
  if (!key || !(key in LOADERS)) return []
  try {
    const mod = await LOADERS[key]()
    const arr = Object.values(mod).find((v) => Array.isArray(v)) as Story[] | undefined
    return arr ?? []
  } catch {
    return []
  }
}
