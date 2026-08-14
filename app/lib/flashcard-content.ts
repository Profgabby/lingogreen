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
const P2_GARDEN: FlashLesson = {
  id: 'p2-garden',
  theme_en: 'Vegetables from the garden',
  theme_fr: 'Les légumes du jardin',
  imgBase: '/lessons/p2-garden/',
  cards: [
    { type: 'intro', img: 'p2-garden-01.jpg', title_fr: 'Le jardin', title_en: 'Garden',
      fr: 'Qu’est-ce que c’est ?', en: 'What is this?',
      ex: 'C’est notre jardin.', ex_en: 'It is our garden.' },
    { type: 'vocab', img: 'p2-garden-02.jpg', title_fr: 'La tomate', title_en: 'Tomato',
      fr: 'Qu’est-ce que c’est ?', en: 'What is this?',
      ex: 'C’est une tomate.', ex_en: 'It is a tomato.' },
    { type: 'vocab', img: 'p2-garden-03.jpg', title_fr: 'L’oignon', title_en: 'Onion',
      fr: 'Tu vois les oignons ?', en: 'Do you see the onions?',
      ex: 'Oui, je vois les oignons.', ex_en: 'Yes, I see the onions.' },
    { type: 'vocab', img: 'p2-garden-04.jpg', title_fr: 'La carotte', title_en: 'Carrot',
      fr: 'Qu’est-ce que tu prends ?', en: 'What are you taking?',
      ex: 'Je prends une carotte.', ex_en: 'I am taking a carrot.' },
    { type: 'vocab', img: 'p2-garden-05.jpg', title_fr: 'La laitue', title_en: 'Lettuce',
      fr: 'Tu aimes la laitue ?', en: 'Do you like lettuce?',
      ex: 'Oui, j’aime la laitue.', ex_en: 'Yes, I like lettuce.' },
    { type: 'vocab', img: 'p2-garden-06.jpg', title_fr: 'Le concombre', title_en: 'Cucumber',
      fr: 'Qu’est-ce qui pousse ici ?', en: 'What is growing here?',
      ex: 'Un concombre pousse ici.', ex_en: 'A cucumber is growing here.' },
    { type: 'vocab', img: 'p2-garden-07.jpg', title_fr: 'Le poivron', title_en: 'Pepper',
      fr: 'De quelle couleur est le poivron ?', en: 'What colour is the pepper?',
      ex: 'Il est rouge.', ex_en: 'It is red.' },
    { type: 'vocab', img: 'p2-garden-08.jpg', title_fr: 'La citrouille', title_en: 'Pumpkin',
      fr: 'Regarde la citrouille !', en: 'Look at the pumpkin!',
      ex: 'Elle est très grosse !', ex_en: 'It is very big!' },
    { type: 'vocab', img: 'p2-garden-09.jpg', title_fr: 'Les épinards', title_en: 'Spinach',
      fr: 'Qu’est-ce que tu touches ?', en: 'What are you touching?',
      ex: 'Je touche les épinards.', ex_en: 'I am touching the spinach.' },
    { type: 'vocab', img: 'p2-garden-10.jpg', title_fr: 'Le gombo', title_en: 'Okra',
      fr: 'Tu connais le gombo ?', en: 'Do you know okra?',
      ex: 'Oui, voici le gombo.', ex_en: 'Yes, here is the okra.' },
    { type: 'practice', img: 'p2-garden-11.jpg', title_fr: 'La récolte', title_en: 'Harvest',
      fr: 'Que faisons-nous ?', en: 'What are we doing?',
      ex: 'Nous récoltons les légumes.', ex_en: 'We are harvesting the vegetables.' },
    { type: 'recap', img: 'p2-garden-12.jpg', title_fr: 'Récapitulatif', title_en: 'Review',
      fr: 'Qu’est-ce que tu as appris ?', en: 'What did you learn?',
      ex: 'J’ai appris les légumes du jardin !', ex_en: 'I learned about garden vegetables!' },
  ],
}
const P3_GARDEN: FlashLesson = {
  id: 'p3-garden',
  theme_en: 'Working in the garden',
  theme_fr: 'Travailler au jardin',
  imgBase: '/lessons/p3-garden/',
  cards: [
    { type: 'intro', img: 'p3-garden-01.jpg', title_fr: '🌱 Découvrir le jardin', title_en: '🌱 Découvrir le jardin',
      fr: 'A : Où sommes-nous ? B : Nous sommes dans le jardin de l’école.', en: 'A: Where are we? B: We are in the school garden.',
      ex: 'A : Qu’allons-nous apprendre ? B : Nous allons apprendre à jardiner !', ex_en: 'A: What are we going to learn? B: We are going to learn how to garden!' },
    { type: 'vocab', img: 'p3-garden-02.jpg', title_fr: '🪏 Creuser la terre', title_en: '🪏 Creuser la terre',
      fr: 'A : Que fais-tu ? B : Je creuse la terre.', en: 'A: What are you doing? B: I am digging the soil.',
      ex: 'A : Pourquoi ? B : Pour préparer le jardin.', ex_en: 'A: Why? B: To prepare the garden.' },
    { type: 'vocab', img: 'p3-garden-03.jpg', title_fr: '🌿 Préparer le sol', title_en: '🌿 Préparer le sol',
      fr: 'A : Que fais-tu avec la houe ? B : Je prépare le sol.', en: 'A: What are you doing with the hoe? B: I am preparing the soil.',
      ex: 'A : Le sol est-il prêt ? B : Oui, il est prêt !', ex_en: 'A: Is the soil ready? B: Yes, it is ready!' },
    { type: 'vocab', img: 'p3-garden-04.jpg', title_fr: '💧 Arroser les plantes', title_en: '💧 Arroser les plantes',
      fr: 'A : Que fais-tu ? B : J’arrose les plantes.', en: 'A: What are you doing? B: I am watering the plants.',
      ex: 'A : Pourquoi faut-il de l’eau ? B : Pour aider les plantes à pousser.', ex_en: 'A: Why do they need water? B: To help the plants grow.' },
    { type: 'vocab', img: 'p3-garden-05.jpg', title_fr: '🍂 Ramasser les feuilles', title_en: '🍂 Ramasser les feuilles',
      fr: 'A : Que ramasses-tu ? B : Je ramasse les feuilles sèches.', en: 'A: What are you collecting? B: I am collecting the dry leaves.',
      ex: 'A : Le jardin est propre maintenant ? B : Oui, il est propre !', ex_en: 'A: Is the garden clean now? B: Yes, it is clean!' },
    { type: 'vocab', img: 'p3-garden-06.jpg', title_fr: '🥕 Transporter les légumes', title_en: '🥕 Transporter les légumes',
      fr: 'A : Qu’y a-t-il dans la brouette ? B : Il y a des légumes.', en: 'A: What is in the wheelbarrow? B: There are vegetables.',
      ex: 'A : Où les emportes-tu ? B : Je les emporte à l’école.', ex_en: 'A: Where are you taking them? B: I am taking them to the school.' },
    { type: 'vocab', img: 'p3-garden-07.jpg', title_fr: '🌱 Planter', title_en: '🌱 Planter',
      fr: 'A : Que plantes-tu ? B : Je plante un jeune plant.', en: 'A: What are you planting? B: I am planting a young plant.',
      ex: 'A : Que fais-tu après ? B : Je mets de la terre autour.', ex_en: 'A: What do you do next? B: I put soil around it.' },
    { type: 'vocab', img: 'p3-garden-08.jpg', title_fr: '🥬 Récolter les légumes', title_en: '🥬 Récolter les légumes',
      fr: 'A : Qu’avez-vous récolté ? B : Nous avons récolté des légumes !', en: 'A: What have you harvested? B: We have harvested vegetables!',
      ex: 'A : Sont-ils frais ? B : Oui, ils sont très frais !', ex_en: 'A: Are they fresh? B: Yes, they are very fresh!' },
    { type: 'vocab', img: 'p3-garden-09.jpg', title_fr: '🌰 Semer les graines', title_en: '🌰 Semer les graines',
      fr: 'A : Que mets-tu dans la terre ? B : Je mets des graines.', en: 'A: What are you putting in the soil? B: I am putting seeds in it.',
      ex: 'A : Que vont-elles devenir ? B : Elles vont devenir des plantes.', ex_en: 'A: What will they become? B: They will become plants.' },
    { type: 'vocab', img: 'p3-garden-10.jpg', title_fr: '🌾 Ameublir le sol', title_en: '🌾 Ameublir le sol',
      fr: 'A : Pourquoi travailles-tu la terre ? B : Pour rendre le sol meuble.', en: 'A: Why are you working the soil? B: To make the soil loose.',
      ex: 'A : Est-ce bon pour les plantes ? B : Oui, très bon !', ex_en: 'A: Is that good for plants? B: Yes, very good!' },
    { type: 'practice', img: 'p3-garden-11.jpg', title_fr: '👩🏾‍🌾 Travailler ensemble', title_en: '👩🏾‍🌾 Travailler ensemble',
      fr: 'A : Que faisons-nous aujourd’hui ? B : Nous travaillons dans le jardin.', en: 'A: What are we doing today? B: We are working in the garden.',
      ex: 'A : Qui s’occupe du jardin ? B : Nous tous !', ex_en: 'A: Who takes care of the garden? B: All of us!' },
    { type: 'recap', img: 'p3-garden-12.jpg', title_fr: '🎉 Notre jardin', title_en: '🎉 Notre jardin',
      fr: 'A : Qu’avons-nous appris ? B : À planter, arroser et récolter.', en: 'A: What have we learned? B: To plant, water and harvest.',
      ex: 'A : Aimes-tu notre jardin ? B : Oui, j’adore notre jardin !', ex_en: 'A: Do you like our garden? B: Yes, I love our garden!' },
  ],
}

const P4_GARDEN: FlashLesson = {
  id: 'p4-garden',
  theme_en: 'Parts of the plant',
  theme_fr: 'Les parties de la plante',
  imgBase: '/lessons/p4-garden/',
  cards: [
    { type: 'intro', img: 'p4-garden-01.jpg', title_fr: 'aliment – sain – jardin (food – healthy – garden)', title_en: 'aliment – sain – jardin (food – healthy – garden)',
      fr: 'Les aliments du jardin sont sains.', en: 'Food from the garden is healthy.',
      ex: 'A : Quels aliments vois-tu ? B : Je vois des fruits et des légumes.', ex_en: 'A: What foods do you see? B: I see fruits and vegetables.' },
    { type: 'vocab', img: 'p4-garden-02.jpg', title_fr: 'fruit – arbre – cueillir (fruit – tree – pick)', title_en: 'fruit – arbre – cueillir (fruit – tree – pick)',
      fr: 'Nous cueillons des fruits dans le jardin.', en: 'We pick fruits in the garden.',
      ex: 'A : Que cueillez-vous ? B : Nous cueillons des fruits.', ex_en: 'A: What are you picking? B: We are picking fruits.' },
    { type: 'vocab', img: 'p4-garden-03.jpg', title_fr: 'fleur – tige – pousser (flower – stem – grow)', title_en: 'fleur – tige – pousser (flower – stem – grow)',
      fr: 'Les fleurs poussent sur la tige.', en: 'The flowers grow on the stem.',
      ex: 'A : Où poussent les fleurs ? B : Elles poussent sur la tige.', ex_en: 'A: Where do the flowers grow? B: They grow on the stem.' },
    { type: 'vocab', img: 'p4-garden-04.jpg', title_fr: 'feuille – verte – lumière (leaf – green – light)', title_en: 'feuille – verte – lumière (leaf – green – light)',
      fr: 'Les grandes feuilles vertes reçoivent la lumière.', en: 'The large green leaves receive light.',
      ex: 'A : De quelle couleur sont les feuilles ? B : Les feuilles sont vertes.', ex_en: 'A: What colour are the leaves? B: The leaves are green.' },
    { type: 'vocab', img: 'p4-garden-05.jpg', title_fr: 'papillon – nectar – visiter (butterfly – nectar – visit)', title_en: 'papillon – nectar – visiter (butterfly – nectar – visit)',
      fr: 'Le papillon visite la fleur pour le nectar.', en: 'The butterfly visits the flower for nectar.',
      ex: 'A : Que visite le papillon ? B : Il visite une fleur.', ex_en: 'A: What does the butterfly visit? B: It visits a flower.' },
    { type: 'vocab', img: 'p4-garden-06.jpg', title_fr: 'tomate – mûre – récolter (tomato – ripe – harvest)', title_en: 'tomate – mûre – récolter (tomato – ripe – harvest)',
      fr: 'Nous récoltons les tomates mûres.', en: 'We harvest the ripe tomatoes.',
      ex: 'A : Les tomates sont-elles mûres ? B : Oui, elles sont rouges et mûres.', ex_en: 'A: Are the tomatoes ripe? B: Yes, they are red and ripe.' },
    { type: 'vocab', img: 'p4-garden-07.jpg', title_fr: 'graine – germer – plantule (seed – germinate – seedling)', title_en: 'graine – germer – plantule (seed – germinate – seedling)',
      fr: 'La graine germe et devient une plantule.', en: 'The seed germinates and becomes a seedling.',
      ex: 'A : Que devient la graine ? B : Elle devient une plantule.', ex_en: 'A: What does the seed become? B: It becomes a seedling.' },
    { type: 'vocab', img: 'p4-garden-08.jpg', title_fr: 'arbre – branche – fruit (tree – branch – fruit)', title_en: 'arbre – branche – fruit (tree – branch – fruit)',
      fr: 'Les fruits poussent sur les branches de l’arbre.', en: 'The fruits grow on the branches of the tree.',
      ex: 'A : Que vois-tu sur l’arbre ? B : Je vois des branches, des feuilles et des fruits.', ex_en: 'A: What do you see on the tree? B: I see branches, leaves and fruits.' },
    { type: 'vocab', img: 'p4-garden-09.jpg', title_fr: 'tronc – écorce – rugueux (trunk – bark – rough)', title_en: 'tronc – écorce – rugueux (trunk – bark – rough)',
      fr: 'L’écorce protège le tronc de l’arbre.', en: 'The bark protects the trunk of the tree.',
      ex: 'A : Comment est l’écorce ? B : Elle est dure et rugueuse.', ex_en: 'A: What is the bark like? B: It is hard and rough.' },
    { type: 'vocab', img: 'p4-garden-10.jpg', title_fr: 'sol – racine – absorber (soil – root – absorb)', title_en: 'sol – racine – absorber (soil – root – absorb)',
      fr: 'Les racines absorbent l’eau du sol.', en: 'The roots absorb water from the soil.',
      ex: 'A : Où sont les racines ? B : Les racines sont dans le sol.', ex_en: 'A: Where are the roots? B: The roots are in the soil.' },
    { type: 'practice', img: 'p4-garden-11.jpg', title_fr: 'observer – plante – partie (observe – plant – part)', title_en: 'observer – plante – partie (observe – plant – part)',
      fr: 'Nous observons les différentes parties de la plante.', en: 'We observe the different parts of the plant.',
      ex: 'A : Quelles parties vois-tu ? B : Je vois les racines, la tige, les feuilles et les fruits.', ex_en: 'A: Which parts do you see? B: I see the roots, stem, leaves and fruits.' },
    { type: 'recap', img: 'p4-garden-12.jpg', title_fr: 'racine – tige – feuille – fleur – fruit (root – stem – leaf – flower – fruit)', title_en: 'racine – tige – feuille – fleur – fruit (root – stem – leaf – flower – fruit)',
      fr: 'La plante a des racines, une tige, des feuilles, des fleurs et des fruits.', en: 'The plant has roots, a stem, leaves, flowers and fruits.',
      ex: 'A : Peux-tu nommer les parties de la plante ? B : Oui : les racines, la tige, les feuilles, les fleurs et les fruits.', ex_en: 'A: Can you name the parts of the plant? B: Yes: the roots, stem, leaves, flowers and fruits.' },
  ],
}
// Which garden + class shows which flashcard lesson.
// The fruits lesson is Primary 1 content specifically.
// Key format: "<gardenSlug>|<classKey>". Falls back to garden-only if no class.
const LESSON_BY_GARDEN_CLASS: Record<string, FlashLesson> = {
  'primary-nutrition|primary-1': P1_FRUITS,
  'primary-nutrition|primary-2': P2_GARDEN,
  'primary-nutrition|primary-3': P3_GARDEN,
  'primary-nutrition|primary-4': P4_GARDEN,
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
