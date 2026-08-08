// Flashcard lesson content.
// Each lesson is a 12-card mini-lesson. Images live in /public/lessons/<id>/.
// Map: garden slug -> lesson id. Add more gardens/levels here later.

export type FlashCard = {
  type: 'intro' | 'vocab' | 'practice' | 'recap'
  img: string
  fr: string
  en: string
  ex?: string
  ex_en?: string
  title_fr?: string
  title_en?: string
}

export type FlashLesson = {
  id: string
  theme_en: string
  theme_fr: string
  imgBase: string
  cards: FlashCard[]
}

const P1_FRUITS: FlashLesson = {
  id: 'p1-fruits',
  theme_en: 'Fruits from the garden',
  theme_fr: 'Les fruits du jardin',
  imgBase: '/lessons/p1-fruits/',
  cards: [
    { type: 'intro', img: 'p1-fruits-01.jpg', title_fr: 'Les fruits du jardin', title_en: 'Fruits from the garden',
      fr: 'Aujourd’hui, nous apprenons les fruits du jardin.', en: 'Today we learn the fruits from the garden.',
      ex: 'Les fruits sont bons pour la santé.', ex_en: 'Fruits are good for our health.' },
    { type: 'vocab', img: 'p1-fruits-02.jpg', fr: 'La pomme', en: 'Apple', ex: 'Je mange une pomme.', ex_en: 'I eat an apple.' },
    { type: 'vocab', img: 'p1-fruits-03.jpg', fr: 'La banane', en: 'Banana', ex: 'La banane est jaune.', ex_en: 'The banana is yellow.' },
    { type: 'vocab', img: 'p1-fruits-04.jpg', fr: 'L’orange', en: 'Orange', ex: 'J’aime l’orange.', ex_en: 'I like oranges.' },
    { type: 'vocab', img: 'p1-fruits-05.jpg', fr: 'La fraise', en: 'Strawberry', ex: 'La fraise est rouge.', ex_en: 'The strawberry is red.' },
    { type: 'vocab', img: 'p1-fruits-06.jpg', fr: 'La pastèque', en: 'Watermelon', ex: 'La pastèque est grande.', ex_en: 'The watermelon is big.' },
    { type: 'vocab', img: 'p1-fruits-07.jpg', fr: 'L’ananas', en: 'Pineapple', ex: 'L’ananas est bon.', ex_en: 'The pineapple is good.' },
    { type: 'vocab', img: 'p1-fruits-08.jpg', fr: 'La mangue', en: 'Mango', ex: 'La mangue est sucrée.', ex_en: 'The mango is sweet.' },
    { type: 'vocab', img: 'p1-fruits-09.jpg', fr: 'La poire', en: 'Pear', ex: 'La poire est verte.', ex_en: 'The pear is green.' },
    { type: 'vocab', img: 'p1-fruits-10.jpg', fr: 'Les raisins', en: 'Grapes', ex: 'Les raisins sont violets.', ex_en: 'The grapes are purple.' },
    { type: 'practice', img: 'p1-fruits-11.jpg', title_fr: 'On utilise nos mots', title_en: 'Let’s use our words',
      fr: 'J’aime la pomme, la banane et l’orange.', en: 'I like apples, bananas and oranges.',
      ex: 'Les fruits sont délicieux.', ex_en: 'The fruits are delicious.' },
    { type: 'recap', img: 'p1-fruits-12.jpg', title_fr: 'Bravo !', title_en: 'Great job!',
      fr: 'Très bien ! À bientôt !', en: 'Well done! See you next lesson!',
      ex: 'Aujourd’hui, tu as appris 9 fruits.', ex_en: 'Today you learned 9 fruits.' },
  ],
}

// Which garden + class shows which flashcard lesson.
// The fruits lesson is Primary 1 content specifically.
// Key format: "<gardenSlug>|<classKey>". Falls back to garden-only if no class.
const LESSON_BY_GARDEN_CLASS: Record<string, FlashLesson> = {
  'primary-nutrition|primary-1': P1_FRUITS,
}

// gardens where the free flashcards tool exists at all (any class)
const FREE_FLASH_GARDENS = ['nursery-nutrition', 'primary-nutrition', 'jss-nutrition', 'sss-nutrition']

export function lessonForGarden(slug: string, klass?: string): FlashLesson | null {
  if (klass) {
    const hit = LESSON_BY_GARDEN_CLASS[slug + '|' + klass]
    if (hit) return hit
  }
  return null
}

export function gardenHasFlashcards(slug: string): boolean {
  return FREE_FLASH_GARDENS.includes(slug)
}
