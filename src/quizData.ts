export type AnswerId = 'A' | 'B' | 'C' | 'D'

export type AnswerOption = {
  id: AnswerId
  text: string
}

export type QuizQuestion = {
  id: number
  question: string
  image: string
  imageAlt: string
  answers: AnswerOption[]
  correctAnswer: AnswerId
}

const imagePath = (fileName: string) => `${import.meta.env.BASE_URL}question-images/${fileName}`

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Was wurde Steffan auf mysteriöse Weise in Hannover aus seiner Wohnung geklaut?',
    image: imagePath('q01.png'),
    imageAlt:
      'Steffan schaut fragend in einer dunklen Apartment-Ermittlungsszene mit Dusche, Laptop, Medizinflasche und Energydosen.',
    answers: [
      { id: 'A', text: 'Sein Laptop mit den CustomCup-Designs' },
      { id: 'B', text: 'Sein Ritalin-Vorrat' },
      { id: 'C', text: 'Seine Dusche' },
      { id: 'D', text: 'Eine Palette Gönnergy' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 2,
    question:
      'Mit welcher genialen Taktik hat Steffan eine 1,0 in der Uni kassiert und sogar ein Jobangebot vom Professor bekommen?',
    image: imagePath('q02.png'),
    imageAlt:
      'Steffan sitzt fragend in einem chaotischen Uni-Büro zwischen Büchern, Serverrack, Quizbogen und Laptop.',
    answers: [
      { id: 'A', text: 'Er hat 200 Stunden am Stück durchgelernt.' },
      {
        id: 'B',
        text: 'Er hat sich die Antworten im Quiz einfach so gut ausgedacht, dass der Prof es einreichen wollte.',
      },
      { id: 'C', text: 'Er hat den Server der Uni gehackt.' },
      { id: 'D', text: 'Er hat seine Arbeit von einem Inder für 2$ schreiben lassen.' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    question: 'Wie nennt Steffan den Honig von Krüger?',
    image: imagePath('q03.png'),
    imageAlt:
      'Steffan prüft fragend Honig, Dessert, goldene Gläser und eine neonfarbene Laborflasche.',
    answers: [
      { id: 'A', text: 'Götterspeise' },
      { id: 'B', text: 'Bienen-Gold' },
      { id: 'C', text: 'Gottesnahrung' },
      { id: 'D', text: 'Liquid Ritalin' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 4,
    question: 'Warum hat Steffan angeblich "Hausverbot in allen Lidls in Deutschland"?',
    image: imagePath('q04.png'),
    imageAlt:
      'Steffan steht ratlos in einem Supermarkt zwischen Pfandautomat, Brezelberg, Papierbechern und Kaffeemaschine.',
    answers: [
      { id: 'A', text: 'Er hat den Pfandautomaten gehackt.' },
      {
        id: 'B',
        text: 'Er hat sich im Laden 16 Brezeln für 8€ gegönnt und wurde erwischt.',
      },
      { id: 'C', text: 'Er hat versucht, Lidl-Dönerpapier als Stanley Cups zu verkaufen.' },
      { id: 'D', text: 'Er hat die Kaffeemaschine mit WLAN gekapert.' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 5,
    question: 'Wie sieht Steffans absolute High-Performer-Strategie im Home-Office aus?',
    image: imagePath('q05.png'),
    imageAlt:
      'Steffan sitzt im Home-Office mit Laptop, Wecker, Roboter, Mausapparat und Router-Setup.',
    answers: [
      { id: 'A', text: 'Pünktlich um 7 Uhr einloggen und 15 Stunden durcharbeiten.' },
      { id: 'B', text: 'Den Code von Claude generieren lassen und sofort schlafen gehen.' },
      {
        id: 'C',
        text: '4 Stunden lang alle 5 Minuten die Maus bewegen, damit Teams online bleibt.',
      },
      { id: 'D', text: 'Den Router vom Nachbarn nutzen.' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    question: 'Auf welches absolut wilde Ereignis hat Steffan auf Polymarket 65€ gesetzt?',
    image: imagePath('q06.png'),
    imageAlt:
      'Steffan hält einen Wettschein vor mehreren Monitoren mit Kalender, Cyberkarte, Eisinsel und Boxkampf.',
    answers: [
      { id: 'A', text: 'Dass Gta 6 verschoben wird.' },
      { id: 'B', text: 'Major Cyberattack on Iran.' },
      { id: 'C', text: 'Dass Trump Grönland kauft.' },
      { id: 'D', text: 'Dass Mike Tyson gegen Jake Paul in Runde 1 K.O. geht.' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 7,
    question: 'Unter welchem glorreichen Alias liefen die ganzen China-Bestellungen an Omas Adresse?',
    image: imagePath('q07.png'),
    imageAlt:
      'Steffan steht fragend zwischen Paketen an Omas Tür mit mehreren abstrakten Alias-Requisiten.',
    answers: [
      { id: 'A', text: 'Rudi Krieger' },
      { id: 'B', text: 'Christian Wolf' },
      { id: 'C', text: 'Slava Amann' },
      { id: 'D', text: 'Eduard Zielke' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 8,
    question: 'Welches bahnbrechende KI-Projekt hat Steffan ganz bescheiden nach sich selbst benannt?',
    image: imagePath('q08.png'),
    imageAlt:
      'Steffan steht in einem KI-Labor zwischen Streamingwand, Chatbot, Firmenhologramm und Cup-Prototyp.',
    answers: [
      { id: 'A', text: 'Stefflix.de' },
      { id: 'B', text: 'SteffanGPT.de' },
      { id: 'C', text: 'WolterAI.com' },
      { id: 'D', text: 'CustomSteffan.ai' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    question: 'Was hat Steffans DNA-Test Erschütterndes ergeben?',
    image: imagePath('q09.png'),
    imageAlt:
      'Steffan reagiert schockiert in einem DNA-Labor mit Hologrammen, Kartenmotiven und Proben.',
    answers: [
      { id: 'A', text: 'Er ist zu 10% Afrikaner.' },
      { id: 'B', text: 'Er hat nur 5% russische DNA (von seinem Vater).' },
      { id: 'C', text: 'Er ist zu 50% Amerikaner.' },
      { id: 'D', text: 'Er hat 0% polnische Gene.' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    question:
      'Wie lautet der ultimative Trick 17 von Steffan, um bei Supplement-Shops kostenloses Zeug abzugreifen?',
    image: imagePath('q10.png'),
    imageAlt:
      'Steffan steht in einem Supplement-Support-Setup zwischen beschädigten Paketen, alten Dosen, Kurier und verschütteter Cola.',
    answers: [
      { id: 'A', text: 'Die "Wasserschaden"-Methode anwenden.' },
      {
        id: 'B',
        text: 'Ein Foto von alten Dosen schicken und sagen, dass die falschen Sorten ankamen.',
      },
      {
        id: 'C',
        text: 'Den Postboten abfangen und das Paket als "nicht geliefert" markieren.',
      },
      { id: 'D', text: 'Das Paket mit Cola übergießen und "ausgelaufen" reklamieren.' },
    ],
    correctAnswer: 'B',
  },
]
