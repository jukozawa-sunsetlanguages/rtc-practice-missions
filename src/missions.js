// Edit weekly content here. Keep exactly one current mission.
// Bump missionVersion when questions change. Optional target phrase audioUrl supports recordings.
export const missions = [
  {
    "id": "week-05-transportation",
    "week": "Week 5",
    "title": "Transportation & Directions",
    "shortTitle": "Transportation",
    "status": "current",
    "missionVersion": "v2",
    "studentName": "Mateus",
    "keyPhrase": "Ask. Move. Confirm.",
    "goal": "Practice transportation phrases, directions, and recovery phrases.",
    "todayYouPractice": [
      "transportation words",
      "direction phrases",
      "location phrases",
      "recovery phrases"
    ],
    "fullAudioUrl": "",
    "fallbackAudioScript": `Hi, Mateus.

This is your Transportation Day training.

Repeat out loud.
Don’t just listen.
Speak.

Part 1 — Transportation words.

Uber.
Taxi.
Subway.
Bus.
Station.
Bus stop.
Address.
Driver.

Good.

Part 2 — Transportation phrases.

I need an Uber.
I need a taxi.
Where is the subway station?
Where is the bus stop?
Here is the address.

Good.

Part 3 — Directions.

Go straight.
Turn left.
Turn right.
It’s over there.
It’s on the left.
It’s on the right.
Is this the right way?

Good.

Part 4 — Travel survival.

Can you show me on the map?
Can you point, please?
Can you repeat, please?
Can you speak slowly, please?
I don’t understand.
Let me think.

Good.

Final round.

You need an Uber.
I need an Uber.

You need a taxi.
I need a taxi.

You need the subway station.
Where is the subway station?

The person says: Go straight.
Okay.

The person says: Turn right.
Okay.

The place is there.
It’s over there.

You want to confirm.
Is this the right way?

The driver asks for the address.
Here is the address.

You want to see the map.
Can you show me on the map?

You want the person to point.
Can you point, please?

You don’t understand.
Can you repeat, please?

The person speaks fast.
Can you speak slowly, please?

Good job.

Remember:

Ask.
Move.
Confirm.
Recover when confused.`,
    "targetPhrases": [
      {
        "english": "I need an Uber.",
        "portuguese": "Eu preciso de um Uber."
      },
      {
        "english": "I need a taxi.",
        "portuguese": "Eu preciso de um táxi."
      },
      {
        "english": "Where is the subway station?",
        "portuguese": "Onde fica a estação de metrô?"
      },
      {
        "english": "Where is the bus stop?",
        "portuguese": "Onde fica o ponto de ônibus?"
      },
      {
        "english": "Go straight.",
        "portuguese": "Vá reto."
      },
      {
        "english": "Turn left.",
        "portuguese": "Vire à esquerda."
      },
      {
        "english": "Turn right.",
        "portuguese": "Vire à direita."
      },
      {
        "english": "It’s over there.",
        "portuguese": "É logo ali."
      },
      {
        "english": "It’s on the left.",
        "portuguese": "Fica à esquerda."
      },
      {
        "english": "It’s on the right.",
        "portuguese": "Fica à direita."
      },
      {
        "english": "Here is the address.",
        "portuguese": "Aqui está o endereço."
      },
      {
        "english": "Is this the right way?",
        "portuguese": "Esse é o caminho certo?"
      },
      {
        "english": "Can you show me on the map?",
        "portuguese": "Você pode me mostrar no mapa?"
      },
      {
        "english": "Can you point, please?",
        "portuguese": "Você pode apontar, por favor?"
      },
      {
        "english": "Can you repeat, please?",
        "portuguese": "Você pode repetir, por favor?"
      },
      {
        "english": "Can you speak slowly, please?",
        "portuguese": "Você pode falar devagar, por favor?"
      }
    ],
    "vocabulary": [
      {
        "english": "Uber",
        "portuguese": "Uber"
      },
      {
        "english": "taxi",
        "portuguese": "táxi"
      },
      {
        "english": "subway",
        "portuguese": "metrô"
      },
      {
        "english": "bus",
        "portuguese": "ônibus"
      },
      {
        "english": "station",
        "portuguese": "estação"
      },
      {
        "english": "bus stop",
        "portuguese": "ponto de ônibus"
      },
      {
        "english": "address",
        "portuguese": "endereço"
      },
      {
        "english": "driver",
        "portuguese": "motorista"
      },
      {
        "english": "ticket",
        "portuguese": "bilhete/passagem"
      },
      {
        "english": "entrance",
        "portuguese": "entrada"
      },
      {
        "english": "exit",
        "portuguese": "saída"
      },
      {
        "english": "map",
        "portuguese": "mapa"
      }
    ],
    "chooseMeaningQuestions": [
      {
        "prompt": "“Go straight” means:",
        "practicePhrase": "Go straight",
        "options": [
          "Vá reto",
          "Vire à esquerda",
          "Pegue o elevador"
        ],
        "answer": 0
      },
      {
        "prompt": "“Turn right” means:",
        "practicePhrase": "Turn right",
        "options": [
          "Vire à direita",
          "Vire à esquerda",
          "Atravesse a rua"
        ],
        "answer": 0
      },
      {
        "prompt": "“Subway station” means:",
        "practicePhrase": "Subway station",
        "options": [
          "Estação de metrô",
          "Ponto de ônibus",
          "Aeroporto"
        ],
        "answer": 0
      },
      {
        "prompt": "“Bus stop” means:",
        "practicePhrase": "Bus stop",
        "options": [
          "Ponto de ônibus",
          "Motorista",
          "Bilhete"
        ],
        "answer": 0
      },
      {
        "prompt": "“Address” means:",
        "practicePhrase": "Address",
        "options": [
          "Endereço",
          "Saída",
          "Mapa"
        ],
        "answer": 0
      },
      {
        "prompt": "“It’s over there” means:",
        "practicePhrase": "It’s over there",
        "options": [
          "É logo ali",
          "É muito longe",
          "É caro"
        ],
        "answer": 0
      },
      {
        "prompt": "“Can you point, please?” means:",
        "practicePhrase": "Can you point, please?",
        "options": [
          "Você pode apontar, por favor?",
          "Você pode pagar, por favor?",
          "Você pode esperar, por favor?"
        ],
        "answer": 0
      },
      {
        "prompt": "“Can you speak slowly, please?” means:",
        "practicePhrase": "Can you speak slowly, please?",
        "options": [
          "Você pode falar devagar, por favor?",
          "Você pode falar mais alto, por favor?",
          "Você pode repetir amanhã?"
        ],
        "answer": 0
      }
    ],
    "completePhraseQuestions": [
      {
        "prompt": "I need an ______.",
        "answers": [
          "Uber"
        ],
        "fullPhrase": "I need an Uber."
      },
      {
        "prompt": "I need a ______.",
        "answers": [
          "taxi"
        ],
        "fullPhrase": "I need a taxi."
      },
      {
        "prompt": "Where is the subway ______?",
        "answers": [
          "station"
        ],
        "fullPhrase": "Where is the subway station?"
      },
      {
        "prompt": "Where is the bus ______?",
        "answers": [
          "stop"
        ],
        "fullPhrase": "Where is the bus stop?"
      },
      {
        "prompt": "Go ______.",
        "answers": [
          "straight"
        ],
        "fullPhrase": "Go straight."
      },
      {
        "prompt": "Turn ______.",
        "answers": [
          "right"
        ],
        "fullPhrase": "Turn right.",
        "hint": "Vire à direita."
      },
      {
        "prompt": "Turn ______.",
        "answers": [
          "left"
        ],
        "fullPhrase": "Turn left.",
        "hint": "Vire à esquerda."
      },
      {
        "prompt": "It’s over ______.",
        "answers": [
          "there"
        ],
        "fullPhrase": "It’s over there."
      },
      {
        "prompt": "Here is the ______.",
        "answers": [
          "address"
        ],
        "fullPhrase": "Here is the address."
      },
      {
        "prompt": "Is this the right ______?",
        "answers": [
          "way"
        ],
        "fullPhrase": "Is this the right way?"
      },
      {
        "prompt": "Can you show me on the ______?",
        "answers": [
          "map"
        ],
        "fullPhrase": "Can you show me on the map?"
      },
      {
        "prompt": "Can you speak ______, please?",
        "answers": [
          "slowly"
        ],
        "fullPhrase": "Can you speak slowly, please?"
      }
    ],
    "typeSentenceQuestions": [
      {
        "prompt": "Eu preciso de um Uber.",
        "answers": [
          "I need an Uber."
        ]
      },
      {
        "prompt": "Eu preciso de um táxi.",
        "answers": [
          "I need a taxi."
        ]
      },
      {
        "prompt": "Onde fica a estação de metrô?",
        "answers": [
          "Where is the subway station?"
        ]
      },
      {
        "prompt": "Onde fica o ponto de ônibus?",
        "answers": [
          "Where is the bus stop?"
        ]
      },
      {
        "prompt": "Vá reto.",
        "answers": [
          "Go straight."
        ]
      },
      {
        "prompt": "Vire à direita.",
        "answers": [
          "Turn right."
        ]
      },
      {
        "prompt": "Vire à esquerda.",
        "answers": [
          "Turn left."
        ]
      },
      {
        "prompt": "É logo ali.",
        "answers": [
          "It’s over there.",
          "It is over there."
        ]
      },
      {
        "prompt": "Aqui está o endereço.",
        "answers": [
          "Here is the address."
        ]
      },
      {
        "prompt": "Esse é o caminho certo?",
        "answers": [
          "Is this the right way?"
        ]
      },
      {
        "prompt": "Você pode me mostrar no mapa?",
        "answers": [
          "Can you show me on the map?"
        ]
      },
      {
        "prompt": "Você pode apontar, por favor?",
        "answers": [
          "Can you point, please?"
        ]
      },
      {
        "prompt": "Você pode repetir, por favor?",
        "answers": [
          "Can you repeat, please?"
        ]
      },
      {
        "prompt": "Você pode falar devagar, por favor?",
        "answers": [
          "Can you speak slowly, please?"
        ]
      }
    ],
    "finalMissionQuestions": [
      {
        "prompt": "You need an Uber.",
        "answers": [
          "I need an Uber."
        ]
      },
      {
        "prompt": "You need the subway station.",
        "answers": [
          "Where is the subway station?"
        ]
      },
      {
        "prompt": "The person says the place is there.",
        "answers": [
          "It’s over there.",
          "It is over there."
        ]
      },
      {
        "prompt": "You want to confirm the way.",
        "answers": [
          "Is this the right way?"
        ]
      },
      {
        "prompt": "The driver asks for the address.",
        "answers": [
          "Here is the address."
        ]
      },
      {
        "prompt": "You want to see the map.",
        "answers": [
          "Can you show me on the map?"
        ]
      },
      {
        "prompt": "You want the person to point.",
        "answers": [
          "Can you point, please?"
        ]
      },
      {
        "prompt": "You don’t understand.",
        "answers": [
          "Can you repeat, please?"
        ]
      },
      {
        "prompt": "The person speaks fast.",
        "answers": [
          "Can you speak slowly, please?"
        ]
      }
    ],
    "recognitionPhrases": [
      {
        "english": "Keep going.",
        "portuguese": "Continue indo."
      },
      {
        "english": "Cross the street.",
        "portuguese": "Atravesse a rua."
      },
      {
        "english": "At the corner.",
        "portuguese": "Na esquina."
      },
      {
        "english": "At the traffic light.",
        "portuguese": "No semáforo / farol."
      },
      {
        "english": "At the end of the hall.",
        "portuguese": "No final do corredor."
      },
      {
        "english": "Take the elevator.",
        "portuguese": "Pegue o elevador."
      },
      {
        "english": "Take the stairs.",
        "portuguese": "Pegue a escada."
      },
      {
        "english": "Go upstairs.",
        "portuguese": "Suba / vá para cima."
      },
      {
        "english": "Go downstairs.",
        "portuguese": "Desça / vá para baixo."
      },
      {
        "english": "Follow the signs.",
        "portuguese": "Siga as placas."
      }
    ]
  },
  {
    "id": "week-04-food-ordering",
    "week": "Week 4",
    "title": "Restaurant, Fast Food & Food Truck",
    "shortTitle": "Food Ordering",
    "status": "previous",
    "missionVersion": "v1",
    "studentName": "Mateus",
    "keyPhrase": "Order. Choose. Pay.",
    "goal": "Review food ordering, restaurant phrases, payment and recovery phrases.",
    "todayYouPractice": [
      "Order food and drinks",
      "Ask for the bill and pay",
      "Use recovery phrases"
    ],
    "fullAudioUrl": "",
    "fallbackAudioScript": "Food ordering. Listen, then repeat. I slept a lot. ... I slept a lot. ... I didn’t play games. ... I didn’t play games. ... I bought t-shirts. ... I bought t-shirts. ... It’s over there. ... It’s over there. ... What did you do there? ... What did you do there? ... I choose Coke. ... I choose Coke. ... This is my choice. ... This is my choice. ... The waiter will come right away. ... The waiter will come right away. ... Can I have a burger, please? ... Can I have a burger, please? ... Can I have Coke Zero Sugar, please? ... Can I have Coke Zero Sugar, please? ... That’s all, thank you. ... That’s all, thank you. ... To go, please. ... To go, please. ... Can I pay by card? ... Can I pay by card? ... Can I have the bill, please? ... Can I have the bill, please? ... Can you repeat, please? ... Can you repeat, please? ... Can you speak slowly, please? ... Can you speak slowly, please?",
    "targetPhrases": [
      {
        "english": "I slept a lot.",
        "portuguese": "Eu dormi bastante."
      },
      {
        "english": "I didn’t play games.",
        "portuguese": "Eu não joguei."
      },
      {
        "english": "I bought t-shirts.",
        "portuguese": "Eu comprei camisetas."
      },
      {
        "english": "It’s over there.",
        "portuguese": "É logo ali."
      },
      {
        "english": "What did you do there?",
        "portuguese": "O que você fez lá?"
      },
      {
        "english": "I choose Coke.",
        "portuguese": "Eu escolho Coca-Cola."
      },
      {
        "english": "This is my choice.",
        "portuguese": "Esta é a minha escolha."
      },
      {
        "english": "The waiter will come right away.",
        "portuguese": "O garçom virá em seguida."
      },
      {
        "english": "Can I have a burger, please?",
        "portuguese": "Pode me trazer um hambúrguer, por favor?"
      },
      {
        "english": "Can I have Coke Zero Sugar, please?",
        "portuguese": "Pode me trazer Coca-Cola Zero Açúcar, por favor?"
      },
      {
        "english": "That’s all, thank you.",
        "portuguese": "É só isso, obrigado."
      },
      {
        "english": "To go, please.",
        "portuguese": "Para viagem, por favor."
      },
      {
        "english": "Can I pay by card?",
        "portuguese": "Posso pagar com cartão?"
      },
      {
        "english": "Can I have the bill, please?",
        "portuguese": "Pode trazer a conta, por favor?"
      },
      {
        "english": "Can you repeat, please?",
        "portuguese": "Você pode repetir, por favor?"
      },
      {
        "english": "Can you speak slowly, please?",
        "portuguese": "Você pode falar devagar, por favor?"
      }
    ],
    "vocabulary": [
      {
        "english": "Menu",
        "portuguese": "Cardápio"
      },
      {
        "english": "Receipt",
        "portuguese": "Recibo"
      },
      {
        "english": "For here",
        "portuguese": "Para comer aqui"
      },
      {
        "english": "Takeout",
        "portuguese": "Para viagem"
      }
    ],
    "chooseMeaningQuestions": [
      {
        "prompt": "To go, please.",
        "options": [
          "Para viagem, por favor.",
          "A conta, por favor.",
          "É só isso."
        ],
        "answer": 0
      },
      {
        "prompt": "I bought t-shirts.",
        "options": [
          "Eu dormi bastante.",
          "Eu comprei camisetas.",
          "Eu não joguei."
        ],
        "answer": 1
      },
      {
        "prompt": "The waiter will come right away.",
        "options": [
          "O garçom saiu.",
          "A conta está errada.",
          "O garçom virá em seguida."
        ],
        "answer": 2
      }
    ],
    "completePhraseQuestions": [
      {
        "prompt": "Can I pay by ___?",
        "answers": [
          "card"
        ],
        "fullPhrase": "Can I pay by card?"
      },
      {
        "prompt": "That’s all, ___ you.",
        "answers": [
          "thank"
        ],
        "fullPhrase": "That’s all, thank you."
      },
      {
        "prompt": "This is my ___.",
        "answers": [
          "choice"
        ],
        "fullPhrase": "This is my choice."
      }
    ],
    "typeSentenceQuestions": [
      {
        "prompt": "Pode me trazer um hambúrguer, por favor?",
        "answers": [
          "Can I have a burger, please?"
        ]
      },
      {
        "prompt": "O que você fez lá?",
        "answers": [
          "What did you do there?"
        ]
      },
      {
        "prompt": "Eu não joguei.",
        "answers": [
          "I didn’t play games.",
          "I did not play games."
        ]
      }
    ],
    "finalMissionQuestions": [
      {
        "prompt": "You finished eating at a restaurant. Ask for the bill.",
        "answers": [
          "Can I have the bill, please?",
          "Could I have the bill, please?"
        ]
      },
      {
        "prompt": "Order a Coke Zero Sugar politely.",
        "answers": [
          "Can I have Coke Zero Sugar, please?",
          "Can I have a Coke Zero Sugar, please?"
        ]
      }
    ]
  }
];
