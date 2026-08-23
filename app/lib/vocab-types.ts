// Vocabulary entry type + lazy loader. English canonical; multilingual-ready.
export type VocabEntry = {
  id: string        // stable canonical ID, e.g. VOC-GMEAL-P1-001 — never regenerate
  term: string
  category: string
  difficulty: string
  def: string
  example: string
}

const GROW_TO_KEY: Record<string, string> = {
  GrowMeal: 'gmeal', GrowFlow: 'gflow', GrowFloat: 'gfloat',
  GrowAqua: 'gaqua', GrowFarm: 'gfarm', GrowPower: 'gpower',
}
const KLASS_OK = new Set([
  'primary-1','primary-2','primary-3','primary-4','primary-5','primary-6',
  'jss-1','jss-2','jss-3','sss-1','sss-2','sss-3',
])

// explicit lazy import map (Turbopack-safe — no dynamic template literals)
const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  'gaqua-jss-1': () => import('./vocab-data/vocab-gaqua-jss-1'),
  'gaqua-jss-2': () => import('./vocab-data/vocab-gaqua-jss-2'),
  'gaqua-jss-3': () => import('./vocab-data/vocab-gaqua-jss-3'),
  'gaqua-primary-1': () => import('./vocab-data/vocab-gaqua-primary-1'),
  'gaqua-primary-2': () => import('./vocab-data/vocab-gaqua-primary-2'),
  'gaqua-primary-3': () => import('./vocab-data/vocab-gaqua-primary-3'),
  'gaqua-primary-4': () => import('./vocab-data/vocab-gaqua-primary-4'),
  'gaqua-primary-5': () => import('./vocab-data/vocab-gaqua-primary-5'),
  'gaqua-primary-6': () => import('./vocab-data/vocab-gaqua-primary-6'),
  'gaqua-sss-1': () => import('./vocab-data/vocab-gaqua-sss-1'),
  'gaqua-sss-2': () => import('./vocab-data/vocab-gaqua-sss-2'),
  'gaqua-sss-3': () => import('./vocab-data/vocab-gaqua-sss-3'),
  'gfarm-jss-1': () => import('./vocab-data/vocab-gfarm-jss-1'),
  'gfarm-jss-2': () => import('./vocab-data/vocab-gfarm-jss-2'),
  'gfarm-jss-3': () => import('./vocab-data/vocab-gfarm-jss-3'),
  'gfarm-primary-1': () => import('./vocab-data/vocab-gfarm-primary-1'),
  'gfarm-primary-2': () => import('./vocab-data/vocab-gfarm-primary-2'),
  'gfarm-primary-3': () => import('./vocab-data/vocab-gfarm-primary-3'),
  'gfarm-primary-4': () => import('./vocab-data/vocab-gfarm-primary-4'),
  'gfarm-primary-5': () => import('./vocab-data/vocab-gfarm-primary-5'),
  'gfarm-primary-6': () => import('./vocab-data/vocab-gfarm-primary-6'),
  'gfarm-sss-1': () => import('./vocab-data/vocab-gfarm-sss-1'),
  'gfarm-sss-2': () => import('./vocab-data/vocab-gfarm-sss-2'),
  'gfarm-sss-3': () => import('./vocab-data/vocab-gfarm-sss-3'),
  'gfloat-jss-1': () => import('./vocab-data/vocab-gfloat-jss-1'),
  'gfloat-jss-2': () => import('./vocab-data/vocab-gfloat-jss-2'),
  'gfloat-jss-3': () => import('./vocab-data/vocab-gfloat-jss-3'),
  'gfloat-primary-1': () => import('./vocab-data/vocab-gfloat-primary-1'),
  'gfloat-primary-2': () => import('./vocab-data/vocab-gfloat-primary-2'),
  'gfloat-primary-3': () => import('./vocab-data/vocab-gfloat-primary-3'),
  'gfloat-primary-4': () => import('./vocab-data/vocab-gfloat-primary-4'),
  'gfloat-primary-5': () => import('./vocab-data/vocab-gfloat-primary-5'),
  'gfloat-primary-6': () => import('./vocab-data/vocab-gfloat-primary-6'),
  'gfloat-sss-1': () => import('./vocab-data/vocab-gfloat-sss-1'),
  'gfloat-sss-2': () => import('./vocab-data/vocab-gfloat-sss-2'),
  'gfloat-sss-3': () => import('./vocab-data/vocab-gfloat-sss-3'),
  'gflow-jss-1': () => import('./vocab-data/vocab-gflow-jss-1'),
  'gflow-jss-2': () => import('./vocab-data/vocab-gflow-jss-2'),
  'gflow-jss-3': () => import('./vocab-data/vocab-gflow-jss-3'),
  'gflow-primary-1': () => import('./vocab-data/vocab-gflow-primary-1'),
  'gflow-primary-2': () => import('./vocab-data/vocab-gflow-primary-2'),
  'gflow-primary-3': () => import('./vocab-data/vocab-gflow-primary-3'),
  'gflow-primary-4': () => import('./vocab-data/vocab-gflow-primary-4'),
  'gflow-primary-5': () => import('./vocab-data/vocab-gflow-primary-5'),
  'gflow-primary-6': () => import('./vocab-data/vocab-gflow-primary-6'),
  'gflow-sss-1': () => import('./vocab-data/vocab-gflow-sss-1'),
  'gflow-sss-2': () => import('./vocab-data/vocab-gflow-sss-2'),
  'gflow-sss-3': () => import('./vocab-data/vocab-gflow-sss-3'),
  'gmeal-jss-1': () => import('./vocab-data/vocab-gmeal-jss-1'),
  'gmeal-jss-2': () => import('./vocab-data/vocab-gmeal-jss-2'),
  'gmeal-jss-3': () => import('./vocab-data/vocab-gmeal-jss-3'),
  'gmeal-primary-1': () => import('./vocab-data/vocab-gmeal-primary-1'),
  'gmeal-primary-2': () => import('./vocab-data/vocab-gmeal-primary-2'),
  'gmeal-primary-3': () => import('./vocab-data/vocab-gmeal-primary-3'),
  'gmeal-primary-4': () => import('./vocab-data/vocab-gmeal-primary-4'),
  'gmeal-primary-5': () => import('./vocab-data/vocab-gmeal-primary-5'),
  'gmeal-primary-6': () => import('./vocab-data/vocab-gmeal-primary-6'),
  'gmeal-sss-1': () => import('./vocab-data/vocab-gmeal-sss-1'),
  'gmeal-sss-2': () => import('./vocab-data/vocab-gmeal-sss-2'),
  'gmeal-sss-3': () => import('./vocab-data/vocab-gmeal-sss-3'),
  'gpower-jss-1': () => import('./vocab-data/vocab-gpower-jss-1'),
  'gpower-jss-2': () => import('./vocab-data/vocab-gpower-jss-2'),
  'gpower-jss-3': () => import('./vocab-data/vocab-gpower-jss-3'),
  'gpower-primary-1': () => import('./vocab-data/vocab-gpower-primary-1'),
  'gpower-primary-2': () => import('./vocab-data/vocab-gpower-primary-2'),
  'gpower-primary-3': () => import('./vocab-data/vocab-gpower-primary-3'),
  'gpower-primary-4': () => import('./vocab-data/vocab-gpower-primary-4'),
  'gpower-primary-5': () => import('./vocab-data/vocab-gpower-primary-5'),
  'gpower-primary-6': () => import('./vocab-data/vocab-gpower-primary-6'),
  'gpower-sss-1': () => import('./vocab-data/vocab-gpower-sss-1'),
  'gpower-sss-2': () => import('./vocab-data/vocab-gpower-sss-2'),
  'gpower-sss-3': () => import('./vocab-data/vocab-gpower-sss-3'),
}

export function vocabKey(growName: string | null, klass: string | undefined): string | null {
  if (!growName || !klass) return null
  const g = GROW_TO_KEY[growName]
  if (!g || !KLASS_OK.has(klass)) return null
  return `${g}-${klass}`
}

export function hasVocab(growName: string | null, klass: string | undefined): boolean {
  const k = vocabKey(growName, klass)
  return k !== null && k in LOADERS
}

export async function loadVocab(growName: string | null, klass: string | undefined): Promise<VocabEntry[]> {
  const key = vocabKey(growName, klass)
  if (!key || !(key in LOADERS)) return []
  try {
    const mod = await LOADERS[key]()
    const arr = Object.values(mod).find((v) => Array.isArray(v)) as VocabEntry[] | undefined
    return arr ?? []
  } catch {
    return []
  }
}
