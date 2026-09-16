// Weekly editing starts here. Exactly one mission should be "current".
// Question answer arrays accept alternative correct versions. IDs must stay unique.
const phrases = rows => rows.map(([english, portuguese]) => ({ english, portuguese }));
const transportation = phrases([
  ['I need an Uber.', 'Eu preciso de um Uber.'],
  ['I need a taxi.', 'Eu preciso de um táxi.'],
  ['Where is the subway station?', 'Onde fica a estação de metrô?'],
  ['Where is the bus stop?', 'Onde fica o ponto de ônibus?'],
  ['Go straight.', 'Vá reto.'], ['Turn left.', 'Vire à esquerda.'], ['Turn right.', 'Vire à direita.'],
  ['It’s over there.', 'É logo ali.'], ['It’s on the left.', 'Fica à esquerda.'], ['It’s on the right.', 'Fica à direita.'],
  ['Here is the address.', 'Aqui está o endereço.'], ['Is this the right way?', 'Esse é o caminho certo?'],
  ['Can you show me on the map?', 'Você pode me mostrar no mapa?'],
  ['Can you point, please?', 'Você pode apontar, por favor?'],
  ['Can you repeat, please?', 'Você pode repetir, por favor?'],
  ['Can you speak slowly, please?', 'Você pode falar devagar, por favor?']
]);
const food = phrases([
  ['I slept a lot.', 'Eu dormi bastante.'], ['I didn’t play games.', 'Eu não joguei.'],
  ['I bought t-shirts.', 'Eu comprei camisetas.'], ['It’s over there.', 'É logo ali.'],
  ['What did you do there?', 'O que você fez lá?'], ['I choose Coke.', 'Eu escolho Coca-Cola.'],
  ['This is my choice.', 'Esta é a minha escolha.'], ['The waiter will come right away.', 'O garçom virá em seguida.'],
  ['Can I have a burger, please?', 'Pode me trazer um hambúrguer, por favor?'],
  ['Can I have Coke Zero Sugar, please?', 'Pode me trazer Coca-Cola Zero Açúcar, por favor?'],
  ['That’s all, thank you.', 'É só isso, obrigado.'], ['To go, please.', 'Para viagem, por favor.'],
  ['Can I pay by card?', 'Posso pagar com cartão?'], ['Can I have the bill, please?', 'Pode trazer a conta, por favor?'],
  ['Can you repeat, please?', 'Você pode repetir, por favor?'], ['Can you speak slowly, please?', 'Você pode falar devagar, por favor?']
]);

export const missions = [
  {
    id: 'week-05-transportation', week: 'Week 5', title: 'Transportation & Directions', shortTitle: 'Transportation',
    status: 'current', missionVersion: 'v1', studentName: 'Mateus', keyPhrase: 'Ask. Move. Confirm.',
    goal: 'Practice transportation phrases, directions, and recovery phrases.',
    todayYouPractice: ['Ask for transportation', 'Understand simple directions', 'Recover when you don’t understand'],
    fullAudioUrl: '',
    fallbackAudioScript: 'Transportation and directions. Listen, then repeat. ' + transportation.map(p => p.english + ' ... ' + p.english).join(' ... '),
    targetPhrases: transportation,
    vocabulary: phrases([
      ['Keep going.', 'Continue indo.'], ['Cross the street.', 'Atravesse a rua.'], ['At the corner.', 'Na esquina.'],
      ['At the traffic light.', 'No semáforo / farol.'], ['At the end of the hall.', 'No final do corredor.'],
      ['Take the elevator.', 'Pegue o elevador.'], ['Take the stairs.', 'Pegue a escada.'],
      ['Go upstairs.', 'Suba / vá para cima.'], ['Go downstairs.', 'Desça / vá para baixo.'], ['Follow the signs.', 'Siga as placas.']
    ]),
    chooseMeaningQuestions: [
      { prompt: 'Where is the bus stop?', options: ['Onde fica o ponto de ônibus?', 'Onde fica o aeroporto?', 'Posso pagar com cartão?'], answer: 0 },
      { prompt: 'Turn left.', options: ['Vá reto.', 'Vire à esquerda.', 'Vire à direita.'], answer: 1 },
      { prompt: 'Can you point, please?', options: ['Você pode esperar?', 'Você pode dirigir?', 'Você pode apontar, por favor?'], answer: 2 },
      { prompt: 'Is this the right way?', options: ['Esse é o caminho certo?', 'Fica à direita.', 'Aqui está o endereço.'], answer: 0 }
    ],
    completePhraseQuestions: [
      { prompt: 'I need a ___.', answers: ['taxi'], fullPhrase: 'I need a taxi.' },
      { prompt: 'Go ___.', answers: ['straight'], fullPhrase: 'Go straight.' },
      { prompt: 'Here is the ___.', answers: ['address'], fullPhrase: 'Here is the address.' },
      { prompt: 'Can you ___, please?', answers: ['repeat'], fullPhrase: 'Can you repeat, please?' }
    ],
    typeSentenceQuestions: [
      { prompt: 'Onde fica a estação de metrô?', answers: ['Where is the subway station?', 'Where’s the subway station?'] },
      { prompt: 'Você pode me mostrar no mapa?', answers: ['Can you show me on the map?'] },
      { prompt: 'Fica à direita.', answers: ['It’s on the right.', 'It is on the right.'] }
    ],
    finalMissionQuestions: [
      { prompt: 'You are at your hotel. Ask for an Uber.', answers: ['I need an Uber.', 'Can I have an Uber, please?', 'I need an Uber, please.'] },
      { prompt: 'Someone gives you directions too fast. Ask them to speak slowly.', answers: ['Can you speak slowly, please?', 'Can you speak slowly?', 'Could you speak slowly, please?'] }
    ]
  },
  {
    id: 'week-04-food-ordering', week: 'Week 4', title: 'Restaurant, Fast Food & Food Truck', shortTitle: 'Food Ordering',
    status: 'previous', missionVersion: 'v1', studentName: 'Mateus', keyPhrase: 'Order. Choose. Pay.',
    goal: 'Review food ordering, restaurant phrases, payment and recovery phrases.',
    todayYouPractice: ['Order food and drinks', 'Ask for the bill and pay', 'Use recovery phrases'],
    fullAudioUrl: '', fallbackAudioScript: 'Food ordering. Listen, then repeat. ' + food.map(p => p.english + ' ... ' + p.english).join(' ... '),
    targetPhrases: food,
    vocabulary: phrases([['Menu', 'Cardápio'], ['Receipt', 'Recibo'], ['For here', 'Para comer aqui'], ['Takeout', 'Para viagem']]),
    chooseMeaningQuestions: [
      { prompt: 'To go, please.', options: ['Para viagem, por favor.', 'A conta, por favor.', 'É só isso.'], answer: 0 },
      { prompt: 'I bought t-shirts.', options: ['Eu dormi bastante.', 'Eu comprei camisetas.', 'Eu não joguei.'], answer: 1 },
      { prompt: 'The waiter will come right away.', options: ['O garçom saiu.', 'A conta está errada.', 'O garçom virá em seguida.'], answer: 2 }
    ],
    completePhraseQuestions: [
      { prompt: 'Can I pay by ___?', answers: ['card'], fullPhrase: 'Can I pay by card?' },
      { prompt: 'That’s all, ___ you.', answers: ['thank'], fullPhrase: 'That’s all, thank you.' },
      { prompt: 'This is my ___.', answers: ['choice'], fullPhrase: 'This is my choice.' }
    ],
    typeSentenceQuestions: [
      { prompt: 'Pode me trazer um hambúrguer, por favor?', answers: ['Can I have a burger, please?'] },
      { prompt: 'O que você fez lá?', answers: ['What did you do there?'] },
      { prompt: 'Eu não joguei.', answers: ['I didn’t play games.', 'I did not play games.'] }
    ],
    finalMissionQuestions: [
      { prompt: 'You finished eating at a restaurant. Ask for the bill.', answers: ['Can I have the bill, please?', 'Could I have the bill, please?'] },
      { prompt: 'Order a Coke Zero Sugar politely.', answers: ['Can I have Coke Zero Sugar, please?', 'Can I have a Coke Zero Sugar, please?'] }
    ]
  }
];
