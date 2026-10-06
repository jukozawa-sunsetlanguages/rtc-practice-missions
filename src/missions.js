// Edit weekly content here. Keep exactly one current mission.
// Bump missionVersion when questions change. Optional target phrase audioUrl supports recordings.
export const missions = [
{
  "id": "mission-6-shopping-buying",
  "week": "Mission 6",
  "title": "Shopping & Buying Things",
  "shortTitle": "Shopping",
  "status": "current",
  "missionVersion": "v1",
  "studentName": "Mateus",
  "keyPhrase": "Find. Choose. Pay.",
  "goal": "You are traveling in the United States.\n\nYou are in a store.\nYou want to buy something.\n\nMaybe a t-shirt.\nMaybe a gift.\nMaybe a souvenir.\n\nYour mission is to find what you need, choose the item, and pay.",
  "todayYouPractice": [
    "looking for an item",
    "choosing size and color",
    "asking the price",
    "trying clothes on",
    "buying the item",
    "paying by card",
    "asking for a receipt",
    "asking for a bag",
    "using recovery phrases"
  ],
  "fullAudioUrl": "",
  "targetPhrases": [
    {
      "english": "I’m looking for a t-shirt.",
      "portuguese": "Estou procurando uma camiseta."
    },
    {
      "english": "I’m looking for a gift.",
      "portuguese": "Estou procurando um presente."
    },
    {
      "english": "I’m looking for a souvenir.",
      "portuguese": "Estou procurando uma lembrancinha/souvenir."
    },
    {
      "english": "I want a blue t-shirt.",
      "portuguese": "Eu quero uma camiseta azul."
    },
    {
      "english": "Do you have this in medium?",
      "portuguese": "Você tem este no tamanho médio?"
    },
    {
      "english": "Do you have this in blue?",
      "portuguese": "Você tem este no azul?"
    },
    {
      "english": "How much is it?",
      "portuguese": "Quanto custa?"
    },
    {
      "english": "Can I try it on?",
      "portuguese": "Posso provar?"
    },
    {
      "english": "Can I try this on?",
      "portuguese": "Posso provar isto?"
    },
    {
      "english": "I’ll take this one.",
      "portuguese": "Vou levar este aqui."
    },
    {
      "english": "I’ll take it.",
      "portuguese": "Vou levar."
    },
    {
      "english": "Can I pay by card?",
      "portuguese": "Posso pagar com cartão?"
    },
    {
      "english": "Can I have a receipt, please?",
      "portuguese": "Posso pegar um recibo, por favor?"
    },
    {
      "english": "Can I have a bag, please?",
      "portuguese": "Posso pegar uma sacola, por favor?"
    },
    {
      "english": "That’s all, thank you.",
      "portuguese": "É só isso, obrigado."
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
  "recognitionPhrases": [
    {
      "english": "Can I help you?",
      "portuguese": "Posso ajudar?"
    },
    {
      "english": "What are you looking for?",
      "portuguese": "O que você está procurando?"
    },
    {
      "english": "What size?",
      "portuguese": "Qual tamanho?"
    },
    {
      "english": "What color?",
      "portuguese": "Qual cor?"
    },
    {
      "english": "Do you want to try it on?",
      "portuguese": "Você quer provar?"
    },
    {
      "english": "Would you like to try it on?",
      "portuguese": "Você gostaria de provar?"
    },
    {
      "english": "Does it fit you well?",
      "portuguese": "Serviu bem em você?"
    },
    {
      "english": "Cash or card?",
      "portuguese": "Dinheiro ou cartão?"
    },
    {
      "english": "Do you want a receipt?",
      "portuguese": "Você quer um recibo?"
    },
    {
      "english": "Do you need a bag?",
      "portuguese": "Você precisa de uma sacola?"
    },
    {
      "english": "Anything else?",
      "portuguese": "Mais alguma coisa?"
    },
    {
      "english": "Have a nice day.",
      "portuguese": "Tenha um bom dia."
    }
  ],
  "vocabulary": [
    {
      "english": "store",
      "portuguese": "loja"
    },
    {
      "english": "mall",
      "portuguese": "shopping center"
    },
    {
      "english": "shopping",
      "portuguese": "compras"
    },
    {
      "english": "t-shirt",
      "portuguese": "camiseta"
    },
    {
      "english": "gift",
      "portuguese": "presente"
    },
    {
      "english": "souvenir",
      "portuguese": "lembrancinha"
    },
    {
      "english": "size",
      "portuguese": "tamanho"
    },
    {
      "english": "color",
      "portuguese": "cor"
    },
    {
      "english": "medium",
      "portuguese": "médio"
    },
    {
      "english": "large",
      "portuguese": "grande"
    },
    {
      "english": "extra large",
      "portuguese": "extra grande"
    },
    {
      "english": "blue",
      "portuguese": "azul"
    },
    {
      "english": "price",
      "portuguese": "preço"
    },
    {
      "english": "card",
      "portuguese": "cartão"
    },
    {
      "english": "cash",
      "portuguese": "dinheiro"
    },
    {
      "english": "receipt",
      "portuguese": "recibo"
    },
    {
      "english": "bag",
      "portuguese": "sacola"
    },
    {
      "english": "fitting room",
      "portuguese": "provador"
    },
    {
      "english": "changing room",
      "portuguese": "provador"
    },
    {
      "english": "keychain",
      "portuguese": "chaveiro"
    },
    {
      "english": "magnet",
      "portuguese": "ímã"
    },
    {
      "english": "plain",
      "portuguese": "liso"
    },
    {
      "english": "stamped",
      "portuguese": "estampado"
    },
    {
      "english": "checked",
      "portuguese": "xadrez"
    },
    {
      "english": "striped",
      "portuguese": "listrado"
    }
  ],
  "chooseMeaningQuestions": [
    {
      "prompt": "I’m looking for a t-shirt.",
      "options": [
        "Estou procurando uma camiseta.",
        "Estou pagando uma camiseta.",
        "Estou provando uma camiseta."
      ],
      "answer": 0
    },
    {
      "prompt": "Do you have this in medium?",
      "options": [
        "Você tem este no tamanho médio?",
        "Você tem isto no azul?",
        "Você tem isto em dinheiro?"
      ],
      "answer": 0
    },
    {
      "prompt": "How much is it?",
      "options": [
        "Quanto custa?",
        "Onde fica?",
        "Qual é o tamanho?"
      ],
      "answer": 0
    },
    {
      "prompt": "Can I try it on?",
      "options": [
        "Posso provar?",
        "Posso pagar?",
        "Posso repetir?"
      ],
      "answer": 0
    },
    {
      "prompt": "I’ll take this one.",
      "options": [
        "Vou levar este aqui.",
        "Vou devolver este aqui.",
        "Vou procurar este aqui."
      ],
      "answer": 0
    },
    {
      "prompt": "Can I pay by card?",
      "options": [
        "Posso pagar com cartão?",
        "Posso pagar em dinheiro?",
        "Posso pedir uma sacola?"
      ],
      "answer": 0
    },
    {
      "prompt": "Can I have a receipt, please?",
      "options": [
        "Posso pegar um recibo, por favor?",
        "Posso pegar uma sacola, por favor?",
        "Posso pegar uma camiseta, por favor?"
      ],
      "answer": 0
    },
    {
      "prompt": "That’s all, thank you.",
      "options": [
        "É só isso, obrigado.",
        "É muito caro, obrigado.",
        "Está errado, obrigado."
      ],
      "answer": 0
    },
    {
      "prompt": "It doesn’t fit.",
      "options": [
        "Não serviu / não coube.",
        "Não funciona.",
        "Não custa."
      ],
      "answer": 0
    },
    {
      "prompt": "I’m just browsing.",
      "options": [
        "Estou só dando uma olhada.",
        "Estou só pagando.",
        "Estou só perdido."
      ],
      "answer": 0
    }
  ],
  "completePhraseQuestions": [
    {
      "prompt": "I’m looking for a ______.",
      "answers": [
        "t-shirt",
        "gift",
        "souvenir"
      ],
      "fullPhrase": "I’m looking for a t-shirt."
    },
    {
      "prompt": "I want a blue ______.",
      "answers": [
        "t-shirt"
      ],
      "fullPhrase": "I want a blue t-shirt."
    },
    {
      "prompt": "Do you have this in ______?",
      "answers": [
        "medium",
        "blue",
        "large",
        "extra large"
      ],
      "fullPhrase": "Do you have this in medium?"
    },
    {
      "prompt": "How much ______ it?",
      "answers": [
        "is"
      ],
      "fullPhrase": "How much is it?"
    },
    {
      "prompt": "Can I try it ______?",
      "answers": [
        "on"
      ],
      "fullPhrase": "Can I try it on?"
    },
    {
      "prompt": "I’ll take this ______.",
      "answers": [
        "one"
      ],
      "fullPhrase": "I’ll take this one."
    },
    {
      "prompt": "Can I pay by ______?",
      "answers": [
        "card"
      ],
      "fullPhrase": "Can I pay by card?"
    },
    {
      "prompt": "Can I have a ______, please?",
      "answers": [
        "receipt",
        "bag"
      ],
      "fullPhrase": "Can I have a receipt, please?"
    },
    {
      "prompt": "That’s ______, thank you.",
      "answers": [
        "all"
      ],
      "fullPhrase": "That’s all, thank you."
    },
    {
      "prompt": "Can you ______, please?",
      "answers": [
        "repeat",
        "help"
      ],
      "fullPhrase": "Can you repeat, please?"
    },
    {
      "prompt": "Can you speak ______, please?",
      "answers": [
        "slowly"
      ],
      "fullPhrase": "Can you speak slowly, please?"
    },
    {
      "prompt": "It doesn’t ______.",
      "answers": [
        "fit"
      ],
      "fullPhrase": "It doesn’t fit."
    }
  ],
  "typeSentenceQuestions": [
    {
      "prompt": "Estou procurando uma camiseta.",
      "answers": [
        "I’m looking for a t-shirt.",
        "I'm looking for a t-shirt.",
        "I am looking for a t-shirt.",
        "I’m looking for a shirt."
      ]
    },
    {
      "prompt": "Estou procurando um presente.",
      "answers": [
        "I’m looking for a gift.",
        "I'm looking for a gift.",
        "I am looking for a gift."
      ]
    },
    {
      "prompt": "Estou procurando uma lembrancinha/souvenir.",
      "answers": [
        "I’m looking for a souvenir.",
        "I'm looking for a souvenir.",
        "I am looking for a souvenir."
      ]
    },
    {
      "prompt": "Eu quero uma camiseta azul.",
      "answers": [
        "I want a blue t-shirt.",
        "I want a blue shirt."
      ]
    },
    {
      "prompt": "Você tem este no tamanho médio?",
      "answers": [
        "Do you have this in medium?",
        "Do you have this one in medium?",
        "Do you have this t-shirt in medium?"
      ]
    },
    {
      "prompt": "Você tem este no azul?",
      "answers": [
        "Do you have this in blue?",
        "Do you have this one in blue?",
        "Do you have this t-shirt in blue?"
      ]
    },
    {
      "prompt": "Quanto custa?",
      "answers": [
        "How much is it?",
        "How much?"
      ]
    },
    {
      "prompt": "Posso provar?",
      "answers": [
        "Can I try it on?",
        "Can I try this on?",
        "Can I try it?"
      ]
    },
    {
      "prompt": "Vou levar este aqui.",
      "answers": [
        "I’ll take this one.",
        "I'll take this one.",
        "I will take this one.",
        "I’ll take it.",
        "I'll take it."
      ]
    },
    {
      "prompt": "Posso pagar com cartão?",
      "answers": [
        "Can I pay by card?",
        "Can I pay with card?",
        "Can I pay by credit card?"
      ]
    },
    {
      "prompt": "Posso pegar um recibo, por favor?",
      "answers": [
        "Can I have a receipt, please?",
        "Can I have the receipt, please?",
        "Receipt, please."
      ]
    },
    {
      "prompt": "Posso pegar uma sacola, por favor?",
      "answers": [
        "Can I have a bag, please?",
        "Can I get a bag, please?",
        "Bag, please."
      ]
    },
    {
      "prompt": "É só isso, obrigado.",
      "answers": [
        "That’s all, thank you.",
        "That's all, thank you.",
        "That is all, thank you.",
        "No, thank you."
      ]
    },
    {
      "prompt": "Você pode repetir, por favor?",
      "answers": [
        "Can you repeat, please?",
        "Can you repeat please?",
        "Repeat, please."
      ]
    },
    {
      "prompt": "Você pode falar devagar, por favor?",
      "answers": [
        "Can you speak slowly, please?",
        "Can you speak slowly please?",
        "Speak slowly, please."
      ]
    }
  ],
  "finalMissionScenario": "You are traveling in the United States.\n\nYou are at the mall.\nYou want to buy a t-shirt and a souvenir.\n\nUse English to ask for help, choose the item, ask the price, pay, and recover if needed.",
  "finalMissionQuestions": [
    {
      "prompt": "You are in a store. You want a t-shirt.",
      "answers": [
        "I’m looking for a t-shirt.",
        "I'm looking for a t-shirt.",
        "I want a t-shirt.",
        "I want a blue t-shirt."
      ]
    },
    {
      "prompt": "You want a blue t-shirt.",
      "answers": [
        "I want a blue t-shirt.",
        "I’m looking for a blue t-shirt.",
        "I'm looking for a blue t-shirt."
      ]
    },
    {
      "prompt": "You want medium size.",
      "answers": [
        "Do you have this in medium?",
        "Do you have this t-shirt in medium?",
        "Do you have this one in medium?"
      ]
    },
    {
      "prompt": "You want to know the price.",
      "answers": [
        "How much is it?",
        "How much?"
      ]
    },
    {
      "prompt": "You want to try the t-shirt.",
      "answers": [
        "Can I try it on?",
        "Can I try this on?"
      ]
    },
    {
      "prompt": "You like it and want to buy it.",
      "answers": [
        "I’ll take this one.",
        "I'll take this one.",
        "I’ll take it.",
        "I'll take it."
      ]
    },
    {
      "prompt": "You want to pay by card.",
      "answers": [
        "Can I pay by card?",
        "Card, please.",
        "By card.",
        "Can I pay with card?"
      ]
    },
    {
      "prompt": "You want a receipt.",
      "answers": [
        "Can I have a receipt, please?",
        "Receipt, please.",
        "Can I have the receipt, please?"
      ]
    },
    {
      "prompt": "You want a bag.",
      "answers": [
        "Can I have a bag, please?",
        "Bag, please.",
        "Can I get a bag, please?"
      ]
    },
    {
      "prompt": "You are in a souvenir store. You want a souvenir.",
      "answers": [
        "I’m looking for a souvenir.",
        "I'm looking for a souvenir.",
        "I’m looking for a gift.",
        "I'm looking for a gift."
      ]
    },
    {
      "prompt": "The shop assistant offers more things. You don’t want anything else.",
      "answers": [
        "That’s all, thank you.",
        "That's all, thank you.",
        "No, thank you.",
        "That is all, thank you."
      ]
    },
    {
      "prompt": "The person speaks fast.",
      "answers": [
        "Can you speak slowly, please?",
        "Can you speak slowly please?",
        "Speak slowly, please."
      ]
    },
    {
      "prompt": "You don’t understand.",
      "answers": [
        "Can you repeat, please?",
        "Can you repeat please?",
        "Repeat, please.",
        "I don’t understand.",
        "I don't understand."
      ]
    },
    {
      "prompt": "The t-shirt doesn’t fit.",
      "answers": [
        "It doesn’t fit.",
        "It doesn't fit.",
        "Do you have a different size?",
        "Do you have this in large?"
      ]
    }
  ],
  "missionCompleteMessage": "Good job.\n\nYou practiced shopping and buying things.\n\nRemember:\n\nFind what you need.\nChoose size and color.\nAsk the price.\nPay.\nAsk for receipt or bag.\nRecover when confused.",
  "mainPhrases": [
    "I’m looking for a t-shirt.",
    "I’m looking for a gift.",
    "I’m looking for a souvenir.",
    "Do you have this in medium?",
    "Do you have this in blue?",
    "How much is it?",
    "Can I try it on?",
    "I’ll take this one.",
    "Can I pay by card?",
    "Can I have a receipt, please?",
    "Can I have a bag, please?",
    "That’s all, thank you.",
    "Can you repeat, please?",
    "Can you speak slowly, please?"
  ],
  "fallbackAudioScript": "Hi, Mateus.\n\nThis is your Shopping Day training.\n\nRepeat out loud.\nDon’t just listen.\nSpeak.\n\nPart 1 — Shopping words.\n\nStore.\nMall.\nT-shirt.\nGift.\nSouvenir.\nSize.\nColor.\nPrice.\nReceipt.\nBag.\nCard.\nCash.\n\nGood.\n\nPart 2 — Looking for something.\n\nRepeat.\n\nI’m looking for a t-shirt.\n\n[pause]\n\nI’m looking for a gift.\n\n[pause]\n\nI’m looking for a souvenir.\n\n[pause]\n\nI want a blue t-shirt.\n\n[pause]\n\nGood.\n\nPart 3 — Size and color.\n\nRepeat.\n\nDo you have this in medium?\n\n[pause]\n\nDo you have this in blue?\n\n[pause]\n\nDo you have this one in medium?\n\n[pause]\n\nDo you have this one in blue?\n\n[pause]\n\nGood.\n\nPart 4 — Try and buy.\n\nRepeat.\n\nHow much is it?\n\n[pause]\n\nCan I try it on?\n\n[pause]\n\nCan I try this on?\n\n[pause]\n\nI’ll take this one.\n\n[pause]\n\nI’ll take it.\n\n[pause]\n\nGood.\n\nPart 5 — Pay and finish.\n\nRepeat.\n\nCan I pay by card?\n\n[pause]\n\nCan I have a receipt, please?\n\n[pause]\n\nCan I have a bag, please?\n\n[pause]\n\nThat’s all, thank you.\n\n[pause]\n\nGood.\n\nPart 6 — Recovery.\n\nRepeat.\n\nCan you repeat, please?\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]\n\nI don’t understand.\n\n[pause]\n\nLet me think.\n\n[pause]\n\nGood.\n\nFinal round.\n\nAnswer fast.\n\nYou want a t-shirt.\n\n[pause]\n\nI’m looking for a t-shirt.\n\n[pause]\n\nYou want a gift.\n\n[pause]\n\nI’m looking for a gift.\n\n[pause]\n\nYou want medium.\n\n[pause]\n\nDo you have this in medium?\n\n[pause]\n\nYou want blue.\n\n[pause]\n\nDo you have this in blue?\n\n[pause]\n\nYou want to know the price.\n\n[pause]\n\nHow much is it?\n\n[pause]\n\nYou want to try it.\n\n[pause]\n\nCan I try it on?\n\n[pause]\n\nYou choose this item.\n\n[pause]\n\nI’ll take this one.\n\n[pause]\n\nYou want to pay by card.\n\n[pause]\n\nCan I pay by card?\n\n[pause]\n\nYou want a receipt.\n\n[pause]\n\nCan I have a receipt, please?\n\n[pause]\n\nYou want a bag.\n\n[pause]\n\nCan I have a bag, please?\n\n[pause]\n\nYou don’t want anything else.\n\n[pause]\n\nThat’s all, thank you.\n\n[pause]\n\nYou don’t understand.\n\n[pause]\n\nCan you repeat, please?\n\n[pause]\n\nThe person speaks fast.\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]\n\nGood job.\n\nRemember:\n\nFind.\nChoose.\nPay.\nRecover when confused."
},
{
  "id": "mission-7-problems-help",
  "week": "Mission 7",
  "title": "Problems & Help",
  "shortTitle": "Problems & Help",
  "status": "draft",
  "isNext": true,
  "missionVersion": "v1",
  "studentName": "Mateus",
  "keyPhrase": "Something is wrong. Ask for help.",
  "goal": "You are traveling in the United States.\n\nSometimes something is wrong.\n\nThe Wi-Fi doesn’t work.\nThe t-shirt doesn’t fit.\nYour order is wrong.\nYou are lost.\n\nYour mission is to explain the problem and ask for help.",
  "todayYouPractice": [
    "saying you have a problem",
    "asking for help",
    "saying something doesn’t work",
    "saying something doesn’t fit",
    "saying you are lost",
    "asking for a different size",
    "using recovery phrases"
  ],
  "fullAudioUrl": "",
  "fallbackAudioScript": "This is your Problems and Help training.\nListen. Repeat out loud.\nDon’t just read.\nSpeak.\n\nI have a problem.\n\n[pause]\n\nI need help.\n\n[pause]\n\nSomething is wrong.\n\n[pause]\n\nThis is wrong.\n\n[pause]\n\nIt doesn’t work.\n\n[pause]\n\nThis doesn’t work.\n\n[pause]\n\nThe Wi-Fi doesn’t work.\n\n[pause]\n\nThe shower doesn’t work.\n\n[pause]\n\nThe card key doesn’t work.\n\n[pause]\n\nIt doesn’t fit.\n\n[pause]\n\nIt’s too small.\n\n[pause]\n\nIt’s too big.\n\n[pause]\n\nDo you have a different size?\n\n[pause]\n\nI’m lost.\n\n[pause]\n\nI need help with the address.\n\n[pause]\n\nMy order is wrong.\n\n[pause]\n\nI didn’t order this.\n\n[pause]\n\nCan you help me, please?\n\n[pause]\n\nCan you repeat, please?\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]",
  "targetPhrases": [
    {
      "english": "I have a problem.",
      "portuguese": "Eu tenho um problema."
    },
    {
      "english": "I need help.",
      "portuguese": "Eu preciso de ajuda."
    },
    {
      "english": "Something is wrong.",
      "portuguese": "Algo está errado."
    },
    {
      "english": "This is wrong.",
      "portuguese": "Isso está errado."
    },
    {
      "english": "It doesn’t work.",
      "portuguese": "Não funciona."
    },
    {
      "english": "This doesn’t work.",
      "portuguese": "Isso não funciona."
    },
    {
      "english": "The Wi-Fi doesn’t work.",
      "portuguese": "O Wi-Fi não funciona."
    },
    {
      "english": "The shower doesn’t work.",
      "portuguese": "O chuveiro não funciona."
    },
    {
      "english": "The card key doesn’t work.",
      "portuguese": "O cartão-chave não funciona."
    },
    {
      "english": "It doesn’t fit.",
      "portuguese": "Não serviu / não cabe."
    },
    {
      "english": "It’s too small.",
      "portuguese": "Está muito pequeno."
    },
    {
      "english": "It’s too big.",
      "portuguese": "Está muito grande."
    },
    {
      "english": "Do you have a different size?",
      "portuguese": "Você tem outro tamanho?"
    },
    {
      "english": "I’m lost.",
      "portuguese": "Estou perdido."
    },
    {
      "english": "I need help with the address.",
      "portuguese": "Preciso de ajuda com o endereço."
    },
    {
      "english": "My order is wrong.",
      "portuguese": "Meu pedido está errado."
    },
    {
      "english": "I didn’t order this.",
      "portuguese": "Eu não pedi isso."
    },
    {
      "english": "Can you help me, please?",
      "portuguese": "Você pode me ajudar, por favor?"
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
      "english": "problem",
      "portuguese": "problema"
    },
    {
      "english": "help",
      "portuguese": "ajuda"
    },
    {
      "english": "size",
      "portuguese": "tamanho"
    },
    {
      "english": "lost",
      "portuguese": "perdido"
    },
    {
      "english": "order",
      "portuguese": "pedido"
    },
    {
      "english": "card key",
      "portuguese": "cartão-chave"
    }
  ],
  "chooseMeaningQuestions": [
    {
      "prompt": "I have a problem.",
      "options": [
        "Eu tenho um problema.",
        "Eu tenho uma reserva.",
        "Eu tenho uma sacola."
      ],
      "answer": 0
    },
    {
      "prompt": "Something is wrong.",
      "options": [
        "Algo está errado.",
        "Algo está barato.",
        "Algo está perto."
      ],
      "answer": 0
    },
    {
      "prompt": "It doesn’t work.",
      "options": [
        "Não funciona.",
        "Não cabe.",
        "Não custa."
      ],
      "answer": 0
    },
    {
      "prompt": "It doesn’t fit.",
      "options": [
        "Não serviu / não cabe.",
        "Não funciona.",
        "Não está aberto."
      ],
      "answer": 0
    },
    {
      "prompt": "I’m lost.",
      "options": [
        "Estou perdido.",
        "Estou com fome.",
        "Estou pagando."
      ],
      "answer": 0
    },
    {
      "prompt": "Do you have a different size?",
      "options": [
        "Você tem outro tamanho?",
        "Você tem outra sacola?",
        "Você tem outro recibo?"
      ],
      "answer": 0
    },
    {
      "prompt": "My order is wrong.",
      "options": [
        "Meu pedido está errado.",
        "Meu quarto está errado.",
        "Meu portão está errado."
      ],
      "answer": 0
    },
    {
      "prompt": "I didn’t order this.",
      "options": [
        "Eu não pedi isso.",
        "Eu não comprei isso.",
        "Eu não provei isso."
      ],
      "answer": 0
    }
  ],
  "completePhraseQuestions": [
    {
      "prompt": "I have a ______.",
      "answers": [
        "problem"
      ],
      "fullPhrase": "I have a problem."
    },
    {
      "prompt": "I need ______.",
      "answers": [
        "help"
      ],
      "fullPhrase": "I need help."
    },
    {
      "prompt": "Something is ______.",
      "answers": [
        "wrong"
      ],
      "fullPhrase": "Something is wrong."
    },
    {
      "prompt": "It doesn’t ______.",
      "answers": [
        "work"
      ],
      "fullPhrase": "It doesn’t work.",
      "hint": "Não funciona."
    },
    {
      "prompt": "The Wi-Fi doesn’t ______.",
      "answers": [
        "work"
      ],
      "fullPhrase": "The Wi-Fi doesn’t work."
    },
    {
      "prompt": "It doesn’t ______.",
      "answers": [
        "fit"
      ],
      "fullPhrase": "It doesn’t fit.",
      "hint": "Não serviu / não cabe."
    },
    {
      "prompt": "It’s too ______.",
      "answers": [
        "small",
        "big"
      ],
      "fullPhrase": "It’s too small."
    },
    {
      "prompt": "Do you have a different ______?",
      "answers": [
        "size"
      ],
      "fullPhrase": "Do you have a different size?"
    },
    {
      "prompt": "I’m ______.",
      "answers": [
        "lost"
      ],
      "fullPhrase": "I’m lost."
    },
    {
      "prompt": "My order is ______.",
      "answers": [
        "wrong"
      ],
      "fullPhrase": "My order is wrong."
    },
    {
      "prompt": "I didn’t ______ this.",
      "answers": [
        "order"
      ],
      "fullPhrase": "I didn’t order this."
    },
    {
      "prompt": "Can you ______ me, please?",
      "answers": [
        "help"
      ],
      "fullPhrase": "Can you help me, please?"
    }
  ],
  "typeSentenceQuestions": [
    {
      "prompt": "Eu tenho um problema.",
      "answers": [
        "I have a problem.",
        "I have problem."
      ]
    },
    {
      "prompt": "Eu preciso de ajuda.",
      "answers": [
        "I need help."
      ]
    },
    {
      "prompt": "Algo está errado.",
      "answers": [
        "Something is wrong.",
        "This is wrong."
      ]
    },
    {
      "prompt": "Não funciona.",
      "answers": [
        "It doesn’t work.",
        "It doesn't work.",
        "This doesn’t work.",
        "This doesn't work."
      ]
    },
    {
      "prompt": "O Wi-Fi não funciona.",
      "answers": [
        "The Wi-Fi doesn’t work.",
        "The wifi doesn't work.",
        "Wi-Fi doesn’t work.",
        "Wifi doesn’t work.",
        "The WiFi doesn’t work.",
        "The WiFi doesn't work."
      ]
    },
    {
      "prompt": "O chuveiro não funciona.",
      "answers": [
        "The shower doesn’t work.",
        "The shower doesn't work.",
        "Shower doesn’t work.",
        "Shower doesn't work."
      ]
    },
    {
      "prompt": "Não serviu / não cabe.",
      "answers": [
        "It doesn’t fit.",
        "It doesn't fit.",
        "This doesn’t fit.",
        "This doesn't fit."
      ]
    },
    {
      "prompt": "Está muito pequeno.",
      "answers": [
        "It’s too small.",
        "It's too small.",
        "Too small."
      ]
    },
    {
      "prompt": "Você tem outro tamanho?",
      "answers": [
        "Do you have a different size?",
        "Do you have another size?",
        "Different size, please."
      ]
    },
    {
      "prompt": "Estou perdido.",
      "answers": [
        "I’m lost.",
        "I'm lost.",
        "I am lost."
      ]
    },
    {
      "prompt": "Meu pedido está errado.",
      "answers": [
        "My order is wrong.",
        "The order is wrong.",
        "This is wrong."
      ]
    },
    {
      "prompt": "Eu não pedi isso.",
      "answers": [
        "I didn’t order this.",
        "I didn't order this.",
        "I did not order this."
      ]
    },
    {
      "prompt": "Você pode me ajudar, por favor?",
      "answers": [
        "Can you help me, please?",
        "Can you help me please?",
        "Can you help me?"
      ]
    },
    {
      "prompt": "Você pode repetir, por favor?",
      "answers": [
        "Can you repeat, please?",
        "Can you repeat please?",
        "Repeat, please."
      ]
    }
  ],
  "finalMissionScenario": "You are traveling in the United States.\n\nDifferent things go wrong.\n\nUse English to explain the problem.\nAsk for help.\nRecover if needed.",
  "finalMissionQuestions": [
    {
      "prompt": "You are at the hotel. The Wi-Fi doesn’t work.",
      "answers": [
        "I have a problem. The Wi-Fi doesn’t work.",
        "The Wi-Fi doesn’t work.",
        "I need help. The Wi-Fi doesn’t work.",
        "The wifi doesn't work.",
        "The WiFi doesn't work."
      ]
    },
    {
      "prompt": "You are at the hotel. The shower doesn’t work.",
      "answers": [
        "The shower doesn’t work.",
        "I have a problem. The shower doesn’t work.",
        "The shower doesn't work.",
        "Shower doesn't work."
      ]
    },
    {
      "prompt": "You are in a store. The t-shirt is too small.",
      "answers": [
        "It’s too small.",
        "It's too small.",
        "It doesn’t fit.",
        "It doesn't fit.",
        "Do you have a different size?"
      ]
    },
    {
      "prompt": "You need a different size.",
      "answers": [
        "Do you have a different size?",
        "Do you have another size?",
        "Different size, please."
      ]
    },
    {
      "prompt": "You are lost.",
      "answers": [
        "I’m lost. Can you help me, please?",
        "I’m lost.",
        "I'm lost.",
        "I am lost.",
        "Can you help me, please?"
      ]
    },
    {
      "prompt": "You need help with the address.",
      "answers": [
        "I need help with the address.",
        "Can you help me with the address?"
      ]
    },
    {
      "prompt": "You are at a restaurant. Your order is wrong.",
      "answers": [
        "My order is wrong.",
        "This is wrong.",
        "The order is wrong.",
        "I didn’t order this."
      ]
    },
    {
      "prompt": "You did not order this food.",
      "answers": [
        "I didn’t order this.",
        "I didn't order this.",
        "I did not order this."
      ]
    },
    {
      "prompt": "The person speaks fast.",
      "answers": [
        "Can you speak slowly, please?",
        "Can you speak slowly please?",
        "Speak slowly, please."
      ]
    },
    {
      "prompt": "You don’t understand.",
      "answers": [
        "Can you repeat, please?",
        "I don’t understand.",
        "I don't understand.",
        "Can you repeat please?",
        "Repeat, please."
      ]
    }
  ],
  "missionCompleteMessage": "Good job.\n\nYou practiced problems and help.\n\nRemember:\n\nSay the problem.\nAsk for help.\nRecover when confused.",
  "mainPhrases": [
    "I have a problem.",
    "I need help.",
    "Something is wrong.",
    "It doesn’t work.",
    "It doesn’t fit.",
    "I’m lost.",
    "My order is wrong.",
    "Can you help me, please?",
    "Can you repeat, please?",
    "Can you speak slowly, please?"
  ]
},
  {
    "id": "week-05-transportation",
    "week": "Week 5",
    "title": "Transportation & Directions",
    "shortTitle": "Transportation",
    "status": "previous",
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
    "audioRateMultiplier": 0.9,
    "audioChapters": [{ "title": "Core Training", "startsAt": "This is your Transportation Day training." }, { "title": "Extra Directions Review", "startsAt": "Part 4 — Useful recognition." }],
    "fallbackAudioScript": `This is your Transportation Day training.

Repeat out loud.

Don’t just listen.

Speak.

Part 1 — Transportation words.

Repeat.

Uber.

[pause]

Taxi.

[pause]

Subway.

[pause]

Bus.

[pause]

Station.

[pause]

Bus stop.

[pause]

Address.

[pause]

Driver.

[pause]

Ticket.

[pause]

Entrance.

[pause]

Exit.

[pause]

Map.

[pause]

Good.

Part 2 — Transportation phrases.

Repeat.

I need an Uber.

[pause]

Again.

I need an Uber.

[pause]

I need a taxi.

[pause]

Where is the subway station?

[pause]

Where is the bus stop?

[pause]

Here is the address.

[pause]

Can you take me to this address?

[pause]

How much is it?

[pause]

How long does it take?

[pause]

Good.

Part 3 — Core directions.

Repeat.

Go straight.

[pause]

Turn left.

[pause]

Turn right.

[pause]

It’s over there.

[pause]

It’s on the left.

[pause]

It’s on the right.

[pause]

It’s next to the store.

[pause]

It’s near the bathroom.

[pause]

Is this the right way?

[pause]

This is the right way.

[pause]

Good.

Part 4 — Useful recognition.

Listen and repeat.

Keep going.

[pause]

Go past the store.

[pause]

Cross the street.

[pause]

Go across the street.

[pause]

At the corner.

[pause]

At the traffic light.

[pause]

At the end of the hall.

[pause]

Take the elevator.

[pause]

Take the stairs.

[pause]

Go upstairs.

[pause]

Go downstairs.

[pause]

Follow the signs.

[pause]

It’s around the corner.

[pause]

It’s in front of you.

[pause]

It’s behind you.

[pause]

Good.

Part 5 — Travel survival questions.

Repeat.

Can you show me on the map?

[pause]

Can you point, please?

[pause]

Is it far?

[pause]

Is it close?

[pause]

Can I walk there?

[pause]

Do I need an Uber?

[pause]

Do I need a ticket?

[pause]

Which way?

[pause]

This way?

[pause]

That way?

[pause]

Good.

Part 6 — Recovery.

Repeat.

Can you repeat, please?

[pause]

Can you speak slowly, please?

[pause]

I don’t understand.

[pause]

Let me think.

[pause]

Good.

Final round.

Answer fast.

You need an Uber.

[pause]

I need an Uber.

[pause]

You need a taxi.

[pause]

I need a taxi.

[pause]

You need the subway station.

[pause]

Where is the subway station?

[pause]

You need the bus stop.

[pause]

Where is the bus stop?

[pause]

The person says: Go straight.

[pause]

Okay.

[pause]

The person says: Turn right.

[pause]

Okay.

[pause]

The place is there.

[pause]

It’s over there.

[pause]

The place is on the left.

[pause]

It’s on the left.

[pause]

The place is on the right.

[pause]

It’s on the right.

[pause]

You want to confirm.

[pause]

Is this the right way?

[pause]

The driver asks for the address.

[pause]

Here is the address.

[pause]

You want to see the map.

[pause]

Can you show me on the map?

[pause]

You want the person to point.

[pause]

Can you point, please?

[pause]

You want to know if it is far.

[pause]

Is it far?

[pause]

You want to know if you can walk.

[pause]

Can I walk there?

[pause]

You don’t understand.

[pause]

Can you repeat, please?

[pause]

The person speaks fast.

[pause]

Can you speak slowly, please?

[pause]

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
          "Vire à direita"
        ],
        "answer": 0,
        "id": "chooseMeaning-01"
      },
      {
        "prompt": "“Turn right” means:",
        "practicePhrase": "Turn right",
        "options": [
          "Vire à direita",
          "Vire à esquerda",
          "Atravesse a rua"
        ],
        "answer": 0,
        "id": "chooseMeaning-02"
      },
      {
        "prompt": "“Subway station” means:",
        "practicePhrase": "Subway station",
        "options": [
          "Estação de metrô",
          "Ponto de ônibus",
          "Aeroporto"
        ],
        "answer": 0,
        "id": "chooseMeaning-03"
      },
      {
        "prompt": "“Bus stop” means:",
        "practicePhrase": "Bus stop",
        "options": [
          "Ponto de ônibus",
          "Estação de metrô",
          "Ponto de táxi"
        ],
        "answer": 0,
        "id": "chooseMeaning-04"
      },
      {
        "prompt": "“Address” means:",
        "practicePhrase": "Address",
        "options": [
          "Endereço",
          "Saída",
          "Mapa"
        ],
        "answer": 0,
        "id": "chooseMeaning-05"
      },
      {
        "prompt": "“It’s over there” means:",
        "practicePhrase": "It’s over there",
        "options": [
          "É logo ali",
          "É muito longe",
          "É aqui perto"
        ],
        "answer": 0,
        "id": "chooseMeaning-06"
      },
      {
        "prompt": "“Can you point, please?” means:",
        "practicePhrase": "Can you point, please?",
        "options": [
          "Você pode apontar, por favor?",
          "Você pode pagar, por favor?",
          "Você pode esperar, por favor?"
        ],
        "answer": 0,
        "id": "chooseMeaning-07"
      },
      {
        "prompt": "“Can you speak slowly, please?” means:",
        "practicePhrase": "Can you speak slowly, please?",
        "options": [
          "Você pode falar devagar, por favor?",
          "Você pode falar mais alto, por favor?",
          "Você pode falar mais rápido, por favor?"
        ],
        "answer": 0,
        "id": "chooseMeaning-08"
      }
    ],
    "completePhraseQuestions": [
      {
        "prompt": "I need an ______.",
        "answers": [
          "Uber"
        ],
        "fullPhrase": "I need an Uber.",
        "id": "completePhrase-01",
        "wordBank": [
          "Uber",
          "taxi",
          "bus",
          "subway"
        ],
        "hint": "Eu preciso de um Uber."
      },
      {
        "prompt": "I need a ______.",
        "answers": [
          "taxi"
        ],
        "fullPhrase": "I need a taxi.",
        "id": "completePhrase-02",
        "wordBank": [
          "taxi",
          "map",
          "ticket",
          "station"
        ],
        "hint": "Eu preciso de um táxi."
      },
      {
        "prompt": "Where is the subway ______?",
        "answers": [
          "station"
        ],
        "fullPhrase": "Where is the subway station?",
        "id": "completePhrase-03",
        "wordBank": [
          "station",
          "stop",
          "address",
          "driver"
        ],
        "hint": "Onde fica a estação de metrô?"
      },
      {
        "prompt": "Where is the bus ______?",
        "answers": [
          "stop"
        ],
        "fullPhrase": "Where is the bus stop?",
        "id": "completePhrase-04",
        "wordBank": [
          "stop",
          "station",
          "ticket",
          "driver"
        ],
        "hint": "Onde fica o ponto de ônibus?"
      },
      {
        "prompt": "Go ______.",
        "answers": [
          "straight"
        ],
        "fullPhrase": "Go straight.",
        "id": "completePhrase-05",
        "wordBank": [
          "straight",
          "left",
          "right",
          "there"
        ],
        "hint": "Vá reto."
      },
      {
        "prompt": "Turn ______.",
        "answers": [
          "right"
        ],
        "fullPhrase": "Turn right.",
        "hint": "Vire à direita.",
        "id": "completePhrase-06",
        "wordBank": [
          "right",
          "left",
          "straight",
          "there"
        ]
      },
      {
        "prompt": "Turn ______.",
        "answers": [
          "left"
        ],
        "fullPhrase": "Turn left.",
        "hint": "Vire à esquerda.",
        "id": "completePhrase-07",
        "wordBank": [
          "left",
          "right",
          "straight",
          "there"
        ]
      },
      {
        "prompt": "It’s over ______.",
        "answers": [
          "there"
        ],
        "fullPhrase": "It’s over there.",
        "id": "completePhrase-08",
        "wordBank": [
          "there",
          "here",
          "left",
          "right"
        ],
        "hint": "É logo ali."
      },
      {
        "prompt": "Here is the ______.",
        "answers": [
          "address"
        ],
        "fullPhrase": "Here is the address.",
        "id": "completePhrase-09",
        "wordBank": [
          "address",
          "ticket",
          "map",
          "entrance"
        ],
        "hint": "Aqui está o endereço."
      },
      {
        "prompt": "Is this the right ______?",
        "answers": [
          "way"
        ],
        "fullPhrase": "Is this the right way?",
        "id": "completePhrase-10",
        "wordBank": [
          "way",
          "address",
          "map",
          "ticket"
        ],
        "hint": "Esse é o caminho certo?"
      },
      {
        "prompt": "Can you show me on the ______?",
        "answers": [
          "map"
        ],
        "fullPhrase": "Can you show me on the map?",
        "id": "completePhrase-11",
        "wordBank": [
          "map",
          "ticket",
          "address",
          "driver"
        ],
        "hint": "Você pode me mostrar no mapa?"
      },
      {
        "prompt": "Can you speak ______, please?",
        "answers": [
          "slowly"
        ],
        "fullPhrase": "Can you speak slowly, please?",
        "id": "completePhrase-12",
        "wordBank": [
          "slowly",
          "quickly",
          "loudly",
          "quietly"
        ],
        "hint": "Você pode falar devagar, por favor?"
      }
    ],
    "typeSentenceQuestions": [
      {
        "prompt": "Eu preciso de um Uber.",
        "answers": [
          "I need an Uber."
        ],
        "id": "typeSentence-01"
      },
      {
        "prompt": "Eu preciso de um táxi.",
        "answers": [
          "I need a taxi."
        ],
        "id": "typeSentence-02"
      },
      {
        "prompt": "Onde fica a estação de metrô?",
        "answers": [
          "Where is the subway station?"
        ],
        "id": "typeSentence-03"
      },
      {
        "prompt": "Onde fica o ponto de ônibus?",
        "answers": [
          "Where is the bus stop?"
        ],
        "id": "typeSentence-04"
      },
      {
        "prompt": "Vá reto.",
        "answers": [
          "Go straight."
        ],
        "id": "typeSentence-05"
      },
      {
        "prompt": "Vire à direita.",
        "answers": [
          "Turn right."
        ],
        "id": "typeSentence-06"
      },
      {
        "prompt": "Vire à esquerda.",
        "answers": [
          "Turn left."
        ],
        "id": "typeSentence-07"
      },
      {
        "prompt": "É logo ali.",
        "answers": [
          "It’s over there.",
          "It is over there."
        ],
        "id": "typeSentence-08"
      },
      {
        "prompt": "Aqui está o endereço.",
        "answers": [
          "Here is the address."
        ],
        "id": "typeSentence-09"
      },
      {
        "prompt": "Esse é o caminho certo?",
        "answers": [
          "Is this the right way?"
        ],
        "id": "typeSentence-10"
      },
      {
        "prompt": "Você pode me mostrar no mapa?",
        "answers": [
          "Can you show me on the map?"
        ],
        "id": "typeSentence-11"
      },
      {
        "prompt": "Você pode apontar, por favor?",
        "answers": [
          "Can you point, please?"
        ],
        "id": "typeSentence-12"
      },
      {
        "prompt": "Você pode repetir, por favor?",
        "answers": [
          "Can you repeat, please?"
        ],
        "id": "typeSentence-13"
      },
      {
        "prompt": "Você pode falar devagar, por favor?",
        "answers": [
          "Can you speak slowly, please?"
        ],
        "id": "typeSentence-14"
      }
    ],
    "finalMissionQuestions": [
      {
        "prompt": "You need an Uber.",
        "answers": [
          "I need an Uber."
        ],
        "id": "finalMission-01"
      },
      {
        "prompt": "You need the subway station.",
        "answers": [
          "Where is the subway station?"
        ],
        "id": "finalMission-02"
      },
      {
        "prompt": "The person says the place is there.",
        "answers": [
          "It’s over there.",
          "It is over there."
        ],
        "id": "finalMission-03"
      },
      {
        "prompt": "You want to confirm the way.",
        "answers": [
          "Is this the right way?"
        ],
        "id": "finalMission-04"
      },
      {
        "prompt": "The driver asks for the address.",
        "answers": [
          "Here is the address."
        ],
        "id": "finalMission-05"
      },
      {
        "prompt": "You want to see the map.",
        "answers": [
          "Can you show me on the map?"
        ],
        "id": "finalMission-06"
      },
      {
        "prompt": "You want the person to point.",
        "answers": [
          "Can you point, please?"
        ],
        "id": "finalMission-07"
      },
      {
        "prompt": "You don’t understand.",
        "answers": [
          "Can you repeat, please?"
        ],
        "id": "finalMission-08",
        "acceptedAnswers": [
          "I don't understand.",
          "I don’t understand."
        ]
      },
      {
        "prompt": "The person speaks fast.",
        "answers": [
          "Can you speak slowly, please?"
        ],
        "id": "finalMission-09"
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
    "fallbackAudioScript": `This is your Travel Core Review.

Repeat out loud.

Don’t just listen.

Speak.

Part 1 — Weekend review.

Repeat.

I slept a lot.

[pause]

Again.

I slept a lot.

[pause]

I didn’t play games.

[pause]

Again.

I didn’t play games.

[pause]

I went to the supermarket.

[pause]

Again.

I went to the supermarket.

[pause]

I bought t-shirts.

[pause]

Again.

I bought t-shirts.

[pause]

I ate pasta.

[pause]

Again.

I ate pasta.

[pause]

Good.

Part 2 — There.

Repeat.

There.

[pause]

Over there.

[pause]

It’s over there.

[pause]

Again.

It’s over there.

[pause]

What did you do there?

[pause]

I ate pasta there.

[pause]

Good.

Part 3 — Choose and choice.

Repeat.

Choose.

[pause]

Choice.

[pause]

I choose Coke.

[pause]

This is my choice.

[pause]

I choose chicken.

[pause]

This is my choice.

[pause]

I choose a burger.

[pause]

This is my choice.

[pause]

Good.

Part 4 — Restaurant and travel phrases.

Repeat.

Can I have a burger, please?

[pause]

Can I have Coke Zero Sugar, please?

[pause]

That’s all, thank you.

[pause]

To go, please.

[pause]

Can I pay by card?

[pause]

Can I have the bill, please?

[pause]

Can you repeat, please?

[pause]

Can you speak slowly, please?

[pause]

Good.

Part 5 — Right away.

Listen and repeat.

Right away.

[pause]

Again.

Right away.

[pause]

The waiter will come right away.

[pause]

I’ll be back right away.

[pause]

Good.

Final round.

Answer fast.

Did you sleep a lot?

[pause]

I slept a lot.

[pause]

Did you play games?

[pause]

I didn’t play games.

[pause]

What did you buy?

[pause]

I bought t-shirts.

[pause]

Where is the elevator?

[pause]

It’s over there.

[pause]

What do you choose?

[pause]

I choose Coke.

[pause]

You don’t understand.

[pause]

Can you repeat, please?

[pause]

The person speaks fast.

[pause]

Can you speak slowly, please?

[pause]

Good job.

Remember:

Use full sentences.

Ask for help.

Keep going.`,
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
  },
{
  "id": "mission-1-travel-survival",
  "week": "Mission 1",
  "title": "Travel Survival",
  "shortTitle": "Travel Survival",
  "status": "previous",
  "missionVersion": "v1",
  "studentName": "Mateus",
  "category": "Travel Review Pack",
  "keyPhrase": "Don’t freeze. Ask for help.",
  "goal": "You are traveling in the United States.\nSometimes you don’t understand.\nSometimes people speak fast.\nYour mission is to ask for help, ask people to repeat, and keep going.",
  "todayYouPractice": [
    "asking for help",
    "saying you don’t understand",
    "asking people to repeat",
    "asking people to speak slowly",
    "asking for water",
    "asking for the bathroom",
    "using “Let me think.”"
  ],
  "fullAudioUrl": "",
  "fallbackAudioScript": "This is your Travel Survival review. Repeat out loud.\n\nCan you help me?\n\n[pause]\n\nI need help.\n\n[pause]\n\nI don’t understand.\n\n[pause]\n\nCan you repeat, please?\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]\n\nLet me think.\n\n[pause]\n\nWhere is the bathroom?\n\n[pause]\n\nCan I have water, please?\n\n[pause]\n\nSorry, I don’t know.\n\n[pause]\n\nThank you.\n\n[pause]",
  "targetPhrases": [
    {
      "english": "Can you help me?",
      "portuguese": "Você pode me ajudar?"
    },
    {
      "english": "I need help.",
      "portuguese": "Eu preciso de ajuda."
    },
    {
      "english": "I don’t understand.",
      "portuguese": "Eu não entendo."
    },
    {
      "english": "Can you repeat, please?",
      "portuguese": "Você pode repetir, por favor?"
    },
    {
      "english": "Can you speak slowly, please?",
      "portuguese": "Você pode falar devagar, por favor?"
    },
    {
      "english": "Let me think.",
      "portuguese": "Me deixe pensar."
    },
    {
      "english": "Where is the bathroom?",
      "portuguese": "Onde é o banheiro?"
    },
    {
      "english": "Can I have water, please?",
      "portuguese": "Posso pegar água, por favor?"
    },
    {
      "english": "Sorry, I don’t know.",
      "portuguese": "Desculpe, eu não sei."
    },
    {
      "english": "Thank you.",
      "portuguese": "Obrigado."
    }
  ],
  "vocabulary": [
    {
      "english": "Can you help me?",
      "portuguese": "Você pode me ajudar?"
    },
    {
      "english": "I need help.",
      "portuguese": "Eu preciso de ajuda."
    },
    {
      "english": "I don’t understand.",
      "portuguese": "Eu não entendo."
    }
  ],
  "recognitionPhrases": [],
  "chooseMeaningQuestions": [
    {
      "prompt": "Can you help me?",
      "options": [
        "Você pode me ajudar?",
        "Você pode pagar para mim?",
        "Você pode esperar aqui?"
      ],
      "answer": 0
    },
    {
      "prompt": "I don’t understand.",
      "options": [
        "Eu não sei.",
        "Eu não entendo.",
        "Eu não quero."
      ],
      "answer": 1
    },
    {
      "prompt": "Can you repeat, please?",
      "options": [
        "Você pode repetir, por favor?",
        "Você pode falar comigo?",
        "Você pode me levar?"
      ],
      "answer": 0
    },
    {
      "prompt": "Can you speak slowly, please?",
      "options": [
        "Você pode escrever, por favor?",
        "Você pode falar devagar, por favor?",
        "Você pode ajudar minha mãe?"
      ],
      "answer": 1
    },
    {
      "prompt": "Let me think.",
      "options": [
        "Me deixe tentar.",
        "Me deixe pensar.",
        "Me deixe comprar."
      ],
      "answer": 1
    },
    {
      "prompt": "Where is the bathroom?",
      "options": [
        "Onde é o banheiro?",
        "Onde é o hotel?",
        "Onde é o portão?"
      ],
      "answer": 0
    }
  ],
  "completePhraseQuestions": [
    {
      "prompt": "Can you ______ me?",
      "answers": [
        "help"
      ],
      "fullPhrase": "Can you help me?"
    },
    {
      "prompt": "I need ______.",
      "answers": [
        "help"
      ],
      "fullPhrase": "I need help."
    },
    {
      "prompt": "I don’t ______.",
      "answers": [
        "understand"
      ],
      "fullPhrase": "I don’t understand."
    },
    {
      "prompt": "Can you ______, please?",
      "answers": [
        "repeat"
      ],
      "fullPhrase": "Can you repeat, please?"
    },
    {
      "prompt": "Can you speak ______, please?",
      "answers": [
        "slowly"
      ],
      "fullPhrase": "Can you speak slowly, please?"
    },
    {
      "prompt": "Let me ______.",
      "answers": [
        "think"
      ],
      "fullPhrase": "Let me think."
    },
    {
      "prompt": "Where is the ______?",
      "answers": [
        "bathroom"
      ],
      "fullPhrase": "Where is the bathroom?"
    },
    {
      "prompt": "Can I have ______, please?",
      "answers": [
        "water"
      ],
      "fullPhrase": "Can I have water, please?"
    }
  ],
  "typeSentenceQuestions": [
    {
      "prompt": "Você pode me ajudar?",
      "answers": [
        "Can you help me?",
        "Can you help me please?",
        "Can you help me, please?"
      ]
    },
    {
      "prompt": "Eu preciso de ajuda.",
      "answers": [
        "I need help."
      ]
    },
    {
      "prompt": "Eu não entendo.",
      "answers": [
        "I don’t understand.",
        "I don't understand.",
        "Sorry, I don't understand."
      ]
    },
    {
      "prompt": "Você pode repetir, por favor?",
      "answers": [
        "Can you repeat, please?",
        "Repeat, please.",
        "Can repeat, please?"
      ]
    },
    {
      "prompt": "Você pode falar devagar, por favor?",
      "answers": [
        "Can you speak slowly, please?"
      ]
    },
    {
      "prompt": "Me deixa pensar.",
      "answers": [
        "Let me think."
      ]
    },
    {
      "prompt": "Onde é o banheiro?",
      "answers": [
        "Where is the bathroom?"
      ]
    },
    {
      "prompt": "Posso pegar água, por favor?",
      "answers": [
        "Can I have water, please?",
        "Can I have a water, please?",
        "Water, please."
      ]
    }
  ],
  "finalMissionScenario": "You are in the United States.\nSomeone speaks fast.\nYou don’t understand.\nYou need help and water.",
  "finalMissionQuestions": [
    {
      "prompt": "You need help.",
      "answers": [
        "Can you help me?"
      ]
    },
    {
      "prompt": "You don’t understand.",
      "answers": [
        "I don’t understand."
      ]
    },
    {
      "prompt": "The person speaks fast.",
      "answers": [
        "Can you speak slowly, please?"
      ]
    },
    {
      "prompt": "You need the person to say it again.",
      "answers": [
        "Can you repeat, please?"
      ]
    },
    {
      "prompt": "You need time to think.",
      "answers": [
        "Let me think."
      ]
    },
    {
      "prompt": "You need the bathroom.",
      "answers": [
        "Where is the bathroom?"
      ]
    },
    {
      "prompt": "You want water.",
      "answers": [
        "Can I have water, please?"
      ]
    }
  ],
  "missionCompleteMessage": "Good job.\nYou practiced survival phrases.\n\nRemember:\nDon’t freeze.\nAsk for help.\nAsk people to repeat.\nKeep going.",
  "mainPhrases": [
    "Can you help me?",
    "I don’t understand.",
    "Can you repeat, please?",
    "Can you speak slowly, please?",
    "Let me think."
  ]
},
{
  "id": "mission-2-airport-day",
  "week": "Mission 2",
  "title": "Airport Day",
  "shortTitle": "Airport Day",
  "status": "previous",
  "missionVersion": "v1",
  "studentName": "Mateus",
  "category": "Travel Review Pack",
  "keyPhrase": "Find the gate. Ask for help.",
  "goal": "You are at the airport.\nYou need to check in, show your passport, find your gate, understand boarding time, and ask for help with luggage.",
  "todayYouPractice": [
    "saying where you are going",
    "saying who you are traveling with",
    "showing passport and ticket",
    "asking where the gate is",
    "asking boarding time",
    "asking for help with luggage",
    "understanding basic airport words"
  ],
  "fullAudioUrl": "",
  "fallbackAudioScript": "This is your Airport Day review. Repeat out loud.\n\nI’m going to Orlando.\n\n[pause]\n\nI’m traveling with my parents.\n\n[pause]\n\nThis is my passport.\n\n[pause]\n\nHere is my passport.\n\n[pause]\n\nI have my ticket.\n\n[pause]\n\nI have my boarding pass.\n\n[pause]\n\nI have one bag.\n\n[pause]\n\nI have a carry-on.\n\n[pause]\n\nI don’t have checked luggage.\n\n[pause]\n\nWhere is gate 12?\n\n[pause]\n\nWhat time is boarding?\n\n[pause]\n\nIs this the right gate?\n\n[pause]\n\nI need help with my luggage.\n\n[pause]\n\nMy bag is heavy.\n\n[pause]\n\nCan you help me, please?\n\n[pause]\n\nCan you repeat, please?\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]\n\nI don’t understand.\n\n[pause]\n\nLet me think.\n\n[pause]",
  "targetPhrases": [
    {
      "english": "I’m going to Orlando.",
      "portuguese": "Eu estou indo para Orlando."
    },
    {
      "english": "I’m traveling with my parents.",
      "portuguese": "Estou viajando com meus pais."
    },
    {
      "english": "This is my passport.",
      "portuguese": "Aqui está meu passaporte."
    },
    {
      "english": "Here is my passport.",
      "portuguese": "Aqui está meu passaporte."
    },
    {
      "english": "I have my ticket.",
      "portuguese": "Eu tenho minha passagem."
    },
    {
      "english": "I have my boarding pass.",
      "portuguese": "Eu tenho meu cartão de embarque."
    },
    {
      "english": "I have one bag.",
      "portuguese": "Eu tenho uma mala."
    },
    {
      "english": "I have a carry-on.",
      "portuguese": "Eu tenho uma mala de mão."
    },
    {
      "english": "I don’t have checked luggage.",
      "portuguese": "Eu não tenho bagagem despachada."
    },
    {
      "english": "Where is gate 12?",
      "portuguese": "Onde é o portão 12?"
    },
    {
      "english": "What time is boarding?",
      "portuguese": "Que horas é o embarque?"
    },
    {
      "english": "Is this the right gate?",
      "portuguese": "Este é o portão certo?"
    },
    {
      "english": "I need help with my luggage.",
      "portuguese": "Eu preciso de ajuda com minha bagagem."
    },
    {
      "english": "My bag is heavy.",
      "portuguese": "Minha mala está pesada."
    },
    {
      "english": "Can you help me, please?",
      "portuguese": "Você pode me ajudar?"
    },
    {
      "english": "Can you repeat, please?",
      "portuguese": "Você pode repetir, por favor?"
    },
    {
      "english": "Can you speak slowly, please?",
      "portuguese": "Você pode falar devagar, por favor?"
    },
    {
      "english": "I don’t understand.",
      "portuguese": "Eu não entendo."
    },
    {
      "english": "Let me think.",
      "portuguese": "Me deixe pensar."
    }
  ],
  "vocabulary": [
    {
      "english": "passport",
      "portuguese": "passaporte"
    },
    {
      "english": "ticket",
      "portuguese": "passagem"
    },
    {
      "english": "boarding pass",
      "portuguese": "cartão de embarque"
    },
    {
      "english": "gate",
      "portuguese": "portão"
    },
    {
      "english": "luggage",
      "portuguese": "bagagem"
    },
    {
      "english": "bag",
      "portuguese": "mala / bolsa"
    },
    {
      "english": "suitcase",
      "portuguese": "mala"
    },
    {
      "english": "carry-on",
      "portuguese": "mala de mão"
    },
    {
      "english": "flight",
      "portuguese": "voo"
    },
    {
      "english": "help",
      "portuguese": "ajuda"
    },
    {
      "english": "parents",
      "portuguese": "pais"
    }
  ],
  "recognitionPhrases": [
    {
      "english": "check-in counter",
      "portuguese": "balcão de check-in"
    },
    {
      "english": "security",
      "portuguese": "segurança"
    },
    {
      "english": "boarding",
      "portuguese": "embarque"
    },
    {
      "english": "departure",
      "portuguese": "partida"
    },
    {
      "english": "arrival",
      "portuguese": "chegada"
    },
    {
      "english": "seat",
      "portuguese": "assento"
    },
    {
      "english": "row",
      "portuguese": "fileira"
    },
    {
      "english": "aisle",
      "portuguese": "corredor"
    },
    {
      "english": "window seat",
      "portuguese": "assento na janela"
    },
    {
      "english": "boarding time",
      "portuguese": "horário do embarque"
    },
    {
      "english": "flight number",
      "portuguese": "número do voo"
    },
    {
      "english": "destination",
      "portuguese": "destino"
    },
    {
      "english": "checked bag",
      "portuguese": "mala despachada"
    },
    {
      "english": "overhead bin",
      "portuguese": "compartimento superior"
    },
    {
      "english": "line",
      "portuguese": "fila"
    },
    {
      "english": "ID",
      "portuguese": "documento de identificação"
    }
  ],
  "chooseMeaningQuestions": [
    {
      "prompt": "Passport",
      "options": [
        "Passaporte",
        "Mala",
        "Portão"
      ],
      "answer": 0
    },
    {
      "prompt": "Boarding pass",
      "options": [
        "Cartão de embarque",
        "Número do hotel",
        "Conta do restaurante"
      ],
      "answer": 0
    },
    {
      "prompt": "Gate",
      "options": [
        "Portão",
        "Assento",
        "Mala"
      ],
      "answer": 0
    },
    {
      "prompt": "Luggage",
      "options": [
        "Bagagem",
        "Passaporte",
        "Bebida"
      ],
      "answer": 0
    },
    {
      "prompt": "Carry-on",
      "options": [
        "Mala de mão",
        "Mala despachada",
        "Banheiro"
      ],
      "answer": 0
    },
    {
      "prompt": "Checked bag",
      "options": [
        "Mala despachada",
        "Mala de mão",
        "Sacola de loja"
      ],
      "answer": 0
    },
    {
      "prompt": "Where is gate 12?",
      "options": [
        "Onde é o portão 12?",
        "Onde é o assento 12?",
        "Onde é o hotel 12?"
      ],
      "answer": 0
    },
    {
      "prompt": "What time is boarding?",
      "options": [
        "Que horas é o embarque?",
        "Que horas é o café?",
        "Que horas é o check-out?"
      ],
      "answer": 0
    }
  ],
  "completePhraseQuestions": [
    {
      "prompt": "I’m going to ______.",
      "answers": [
        "Orlando"
      ],
      "fullPhrase": "I’m going to Orlando."
    },
    {
      "prompt": "I’m traveling with my ______.",
      "answers": [
        "parents"
      ],
      "fullPhrase": "I’m traveling with my parents."
    },
    {
      "prompt": "Here is my ______.",
      "answers": [
        "passport"
      ],
      "fullPhrase": "Here is my passport."
    },
    {
      "prompt": "I have my boarding ______.",
      "answers": [
        "pass"
      ],
      "fullPhrase": "I have my boarding pass."
    },
    {
      "prompt": "I have one ______.",
      "answers": [
        "bag"
      ],
      "fullPhrase": "I have one bag."
    },
    {
      "prompt": "I have a ______.",
      "answers": [
        "carry-on"
      ],
      "fullPhrase": "I have a carry-on."
    },
    {
      "prompt": "Where is ______ 12?",
      "answers": [
        "gate"
      ],
      "fullPhrase": "Where is gate 12?"
    },
    {
      "prompt": "What time is ______?",
      "answers": [
        "boarding"
      ],
      "fullPhrase": "What time is boarding?"
    },
    {
      "prompt": "Is this the right ______?",
      "answers": [
        "gate"
      ],
      "fullPhrase": "Is this the right gate?"
    },
    {
      "prompt": "I need help with my ______.",
      "answers": [
        "luggage"
      ],
      "fullPhrase": "I need help with my luggage."
    }
  ],
  "typeSentenceQuestions": [
    {
      "prompt": "Eu estou indo para Orlando.",
      "answers": [
        "I’m going to Orlando.",
        "I am going to Orlando."
      ]
    },
    {
      "prompt": "Estou viajando com meus pais.",
      "answers": [
        "I’m traveling with my parents.",
        "I am traveling with my parents."
      ]
    },
    {
      "prompt": "Aqui está meu passaporte.",
      "answers": [
        "Here is my passport.",
        "This is my passport."
      ]
    },
    {
      "prompt": "Eu tenho meu cartão de embarque.",
      "answers": [
        "I have my boarding pass."
      ]
    },
    {
      "prompt": "Eu tenho uma mala de mão.",
      "answers": [
        "I have a carry-on.",
        "I have a carry-on bag."
      ]
    },
    {
      "prompt": "Onde é o portão 12?",
      "answers": [
        "Where is gate 12?",
        "Where is the gate 12?"
      ]
    },
    {
      "prompt": "Que horas é o embarque?",
      "answers": [
        "What time is boarding?"
      ]
    },
    {
      "prompt": "Este é o portão certo?",
      "answers": [
        "Is this the right gate?"
      ]
    },
    {
      "prompt": "Eu preciso de ajuda com minha bagagem.",
      "answers": [
        "I need help with my luggage."
      ]
    },
    {
      "prompt": "Minha mala está pesada.",
      "answers": [
        "My bag is heavy."
      ]
    }
  ],
  "finalMissionScenario": "You are at the airport.\nYou need to check in and find your gate.\nAnswer the airport worker.",
  "finalMissionQuestions": [
    {
      "prompt": "Where are you going today?",
      "answers": [
        "I’m going to Orlando."
      ]
    },
    {
      "prompt": "Who are you traveling with?",
      "answers": [
        "I’m traveling with my parents."
      ]
    },
    {
      "prompt": "Can I see your passport?",
      "answers": [
        "Here is my passport."
      ]
    },
    {
      "prompt": "Do you have your boarding pass?",
      "answers": [
        "Yes. I have my boarding pass.",
        "I have my boarding pass."
      ]
    },
    {
      "prompt": "Do you have checked luggage?",
      "answers": [
        "I don’t have checked luggage.",
        "No, I don’t."
      ]
    },
    {
      "prompt": "You need gate 12.",
      "answers": [
        "Where is gate 12?"
      ]
    },
    {
      "prompt": "You want to know boarding time.",
      "answers": [
        "What time is boarding?"
      ]
    },
    {
      "prompt": "You want to confirm the gate.",
      "answers": [
        "Is this the right gate?"
      ]
    },
    {
      "prompt": "Your bag is heavy.",
      "answers": [
        "I need help with my luggage.",
        "Can you help me with my luggage?"
      ]
    },
    {
      "prompt": "The person speaks fast.",
      "answers": [
        "Can you speak slowly, please?"
      ]
    }
  ],
  "missionCompleteMessage": "Good job.\nYou practiced airport survival.\n\nRemember:\nShow your passport.\nFind the gate.\nAsk for boarding time.\nAsk for help.\nRecover when confused.",
  "mainPhrases": [
    "I’m going to Orlando.",
    "Here is my passport.",
    "Where is gate 12?",
    "What time is boarding?",
    "Is this the right gate?",
    "I need help with my luggage."
  ]
},
{
  "id": "mission-3-hotel-day",
  "week": "Mission 3",
  "title": "Hotel Day",
  "shortTitle": "Hotel Day",
  "status": "previous",
  "missionVersion": "v1",
  "studentName": "Mateus",
  "category": "Travel Review Pack",
  "keyPhrase": "Check in. Ask for what you need.",
  "goal": "You are at the hotel.\nYou need to check in, show your passport, ask for your room number, ask about Wi-Fi, ask for water or a towel, and explain simple problems.",
  "todayYouPractice": [
    "checking in",
    "saying you have a reservation",
    "showing passport",
    "asking for room number",
    "asking for elevator and Wi-Fi",
    "asking for water and towel",
    "saying something doesn’t work",
    "asking for help"
  ],
  "fullAudioUrl": "",
  "fallbackAudioScript": "This is your Hotel Day review. Repeat out loud.\n\nI have a reservation.\n\n[pause]\n\nMy name is Mateus.\n\n[pause]\n\nHere is my passport.\n\n[pause]\n\nWhat is my room number?\n\n[pause]\n\nWhere is the elevator?\n\n[pause]\n\nWhat is the Wi-Fi password?\n\n[pause]\n\nCan I have water, please?\n\n[pause]\n\nCan I have a towel, please?\n\n[pause]\n\nI need help.\n\n[pause]\n\nI have a problem.\n\n[pause]\n\nThe Wi-Fi doesn’t work.\n\n[pause]\n\nThe shower doesn’t work.\n\n[pause]\n\nCan you help me, please?\n\n[pause]\n\nCan you repeat, please?\n\n[pause]\n\nCan you speak slowly, please?\n\n[pause]\n\nSorry, I don’t know.\n\n[pause]\n\nI don’t understand.\n\n[pause]\n\nLet me think.\n\n[pause]",
  "targetPhrases": [
    {
      "english": "I have a reservation.",
      "portuguese": "Eu tenho uma reserva."
    },
    {
      "english": "My name is Mateus.",
      "portuguese": "Meu nome é Mateus."
    },
    {
      "english": "Here is my passport.",
      "portuguese": "Aqui está meu passaporte."
    },
    {
      "english": "What is my room number?",
      "portuguese": "Qual é o número do meu quarto?"
    },
    {
      "english": "Where is the elevator?",
      "portuguese": "Onde é o elevador?"
    },
    {
      "english": "What is the Wi-Fi password?",
      "portuguese": "Qual é a senha do Wi-Fi?"
    },
    {
      "english": "Can I have water, please?",
      "portuguese": "Posso pegar água, por favor?"
    },
    {
      "english": "Can I have a towel, please?",
      "portuguese": "Posso pegar uma toalha, por favor?"
    },
    {
      "english": "I need help.",
      "portuguese": "Eu preciso de ajuda."
    },
    {
      "english": "I have a problem.",
      "portuguese": "Eu tenho um problema."
    },
    {
      "english": "The Wi-Fi doesn’t work.",
      "portuguese": "O Wi-Fi não funciona."
    },
    {
      "english": "The shower doesn’t work.",
      "portuguese": "O chuveiro não funciona."
    },
    {
      "english": "Can you help me, please?",
      "portuguese": "Você pode me ajudar, por favor?"
    },
    {
      "english": "Can you repeat, please?",
      "portuguese": "Você pode repetir, por favor?"
    },
    {
      "english": "Can you speak slowly, please?",
      "portuguese": "Você pode falar devagar, por favor?"
    },
    {
      "english": "Sorry, I don’t know.",
      "portuguese": "Desculpe, eu não sei."
    },
    {
      "english": "I don’t understand.",
      "portuguese": "Eu não entendo."
    },
    {
      "english": "Let me think.",
      "portuguese": "Me deixe pensar."
    }
  ],
  "vocabulary": [
    {
      "english": "hotel",
      "portuguese": "hotel"
    },
    {
      "english": "reservation",
      "portuguese": "reserva"
    },
    {
      "english": "room",
      "portuguese": "quarto"
    },
    {
      "english": "room number",
      "portuguese": "número do quarto"
    },
    {
      "english": "key",
      "portuguese": "chave"
    },
    {
      "english": "passport",
      "portuguese": "passaporte"
    },
    {
      "english": "Wi-Fi",
      "portuguese": "Wi-Fi"
    },
    {
      "english": "water",
      "portuguese": "água"
    },
    {
      "english": "towel",
      "portuguese": "toalha"
    },
    {
      "english": "bathroom",
      "portuguese": "banheiro"
    },
    {
      "english": "problem",
      "portuguese": "problema"
    },
    {
      "english": "help",
      "portuguese": "ajuda"
    },
    {
      "english": "elevator",
      "portuguese": "elevador"
    },
    {
      "english": "breakfast",
      "portuguese": "café da manhã"
    }
  ],
  "recognitionPhrases": [
    {
      "english": "front desk",
      "portuguese": "recepção"
    },
    {
      "english": "check-in",
      "portuguese": "entrada / check-in"
    },
    {
      "english": "check-out",
      "portuguese": "saída / check-out"
    },
    {
      "english": "floor",
      "portuguese": "andar"
    },
    {
      "english": "lobby",
      "portuguese": "saguão"
    },
    {
      "english": "card key",
      "portuguese": "cartão-chave"
    },
    {
      "english": "shower",
      "portuguese": "chuveiro"
    },
    {
      "english": "air conditioning",
      "portuguese": "ar-condicionado"
    },
    {
      "english": "remote control",
      "portuguese": "controle remoto"
    },
    {
      "english": "second floor",
      "portuguese": "segundo andar"
    },
    {
      "english": "breakfast time",
      "portuguese": "horário do café da manhã"
    }
  ],
  "chooseMeaningQuestions": [
    {
      "prompt": "I have a reservation.",
      "options": [
        "Eu tenho uma reserva.",
        "Eu tenho uma mala.",
        "Eu tenho uma conta."
      ],
      "answer": 0
    },
    {
      "prompt": "Room number",
      "options": [
        "Número do quarto",
        "Número do portão",
        "Número do voo"
      ],
      "answer": 0
    },
    {
      "prompt": "Where is the elevator?",
      "options": [
        "Onde é o elevador?",
        "Onde é o banheiro?",
        "Onde é o restaurante?"
      ],
      "answer": 0
    },
    {
      "prompt": "Wi-Fi password",
      "options": [
        "Senha do Wi-Fi",
        "Chave do quarto",
        "Conta do restaurante"
      ],
      "answer": 0
    },
    {
      "prompt": "Can I have a towel, please?",
      "options": [
        "Posso pegar uma toalha, por favor?",
        "Posso pegar uma passagem, por favor?",
        "Posso pegar uma sobremesa, por favor?"
      ],
      "answer": 0
    },
    {
      "prompt": "The shower doesn’t work.",
      "options": [
        "O chuveiro não funciona.",
        "O elevador não funciona.",
        "O cartão não funciona."
      ],
      "answer": 0
    },
    {
      "prompt": "Breakfast",
      "options": [
        "Café da manhã",
        "Almoço",
        "Jantar"
      ],
      "answer": 0
    },
    {
      "prompt": "Check-out is at 11.",
      "options": [
        "O check-out é às 11.",
        "O café é às 11.",
        "O embarque é às 11."
      ],
      "answer": 0
    }
  ],
  "completePhraseQuestions": [
    {
      "prompt": "I have a ______.",
      "answers": [
        "reservation"
      ],
      "fullPhrase": "I have a reservation."
    },
    {
      "prompt": "My name is ______.",
      "answers": [
        "Mateus"
      ],
      "fullPhrase": "My name is Mateus."
    },
    {
      "prompt": "Here is my ______.",
      "answers": [
        "passport"
      ],
      "fullPhrase": "Here is my passport."
    },
    {
      "prompt": "What is my room ______?",
      "answers": [
        "number"
      ],
      "fullPhrase": "What is my room number?"
    },
    {
      "prompt": "Where is the ______?",
      "answers": [
        "elevator"
      ],
      "fullPhrase": "Where is the elevator?"
    },
    {
      "prompt": "What is the Wi-Fi ______?",
      "answers": [
        "password"
      ],
      "fullPhrase": "What is the Wi-Fi password?"
    },
    {
      "prompt": "Can I have a ______, please?",
      "answers": [
        "towel"
      ],
      "fullPhrase": "Can I have a towel, please?"
    },
    {
      "prompt": "I have a ______.",
      "answers": [
        "problem"
      ],
      "fullPhrase": "I have a problem."
    },
    {
      "prompt": "The Wi-Fi doesn’t ______.",
      "answers": [
        "work"
      ],
      "fullPhrase": "The Wi-Fi doesn’t work."
    },
    {
      "prompt": "The shower doesn’t ______.",
      "answers": [
        "work"
      ],
      "fullPhrase": "The shower doesn’t work."
    }
  ],
  "typeSentenceQuestions": [
    {
      "prompt": "Eu tenho uma reserva.",
      "answers": [
        "I have a reservation."
      ]
    },
    {
      "prompt": "Meu nome é Mateus.",
      "answers": [
        "My name is Mateus."
      ]
    },
    {
      "prompt": "Aqui está meu passaporte.",
      "answers": [
        "Here is my passport."
      ]
    },
    {
      "prompt": "Qual é o número do meu quarto?",
      "answers": [
        "What is my room number?",
        "What’s my room number?"
      ]
    },
    {
      "prompt": "Onde é o elevador?",
      "answers": [
        "Where is the elevator?"
      ]
    },
    {
      "prompt": "Qual é a senha do Wi-Fi?",
      "answers": [
        "What is the Wi-Fi password?",
        "What’s the Wi-Fi password?"
      ]
    },
    {
      "prompt": "Posso pegar uma toalha, por favor?",
      "answers": [
        "Can I have a towel, please?"
      ]
    },
    {
      "prompt": "Eu tenho um problema.",
      "answers": [
        "I have a problem."
      ]
    },
    {
      "prompt": "O Wi-Fi não funciona.",
      "answers": [
        "The Wi-Fi doesn’t work."
      ]
    },
    {
      "prompt": "O chuveiro não funciona.",
      "answers": [
        "The shower doesn’t work."
      ]
    },
    {
      "prompt": "Você pode me ajudar, por favor?",
      "answers": [
        "Can you help me, please?"
      ]
    }
  ],
  "finalMissionScenario": "You are at the hotel front desk.\nYou need to check in, ask for information, and explain one problem.",
  "finalMissionQuestions": [
    {
      "prompt": "Hello. Do you have a reservation?",
      "answers": [
        "Yes. I have a reservation."
      ]
    },
    {
      "prompt": "What is your name?",
      "answers": [
        "My name is Mateus."
      ]
    },
    {
      "prompt": "Can I see your passport?",
      "answers": [
        "Here is my passport."
      ]
    },
    {
      "prompt": "You need your room number.",
      "answers": [
        "What is my room number?"
      ]
    },
    {
      "prompt": "You need the elevator.",
      "answers": [
        "Where is the elevator?"
      ]
    },
    {
      "prompt": "You need Wi-Fi.",
      "answers": [
        "What is the Wi-Fi password?"
      ]
    },
    {
      "prompt": "You need a towel.",
      "answers": [
        "Can I have a towel, please?"
      ]
    },
    {
      "prompt": "The Wi-Fi has a problem.",
      "answers": [
        "The Wi-Fi doesn’t work."
      ]
    },
    {
      "prompt": "The shower has a problem.",
      "answers": [
        "The shower doesn’t work."
      ]
    },
    {
      "prompt": "You need help.",
      "answers": [
        "Can you help me, please?"
      ]
    },
    {
      "prompt": "The person speaks fast.",
      "answers": [
        "Can you speak slowly, please?"
      ]
    },
    {
      "prompt": "You don’t understand.",
      "answers": [
        "I don’t understand.",
        "Sorry, I don’t understand."
      ]
    }
  ],
  "missionCompleteMessage": "Good job.\nYou practiced hotel survival.\n\nRemember:\nCheck in.\nAsk for your room number.\nAsk for Wi-Fi.\nAsk for what you need.\nExplain simple problems.\nRecover when confused.",
  "mainPhrases": [
    "I have a reservation.",
    "Here is my passport.",
    "What is my room number?",
    "Where is the elevator?",
    "What is the Wi-Fi password?",
    "Can I have a towel, please?",
    "The Wi-Fi doesn’t work.",
    "The shower doesn’t work."
  ]
}
];
