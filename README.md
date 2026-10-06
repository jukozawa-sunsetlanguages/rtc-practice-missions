# RTC Lab Practice Missions

MVP estático de prática oral entre aulas, WorkSpeak / RTC Lab. Inicialmente para Mateus. HTML, CSS e JavaScript ES Modules, sem dependências de execução, backend próprio, login ou banco de dados. Hospedagem prevista no Netlify.

## Rodar localmente

Instale Node.js 20+ e rode `npm run dev`. Abra **http://localhost:5173**. Não precisa de `npm install`. Não abra `index.html` via `file://`: os módulos precisam de um servidor HTTP. `npm test` executa os testes de conteúdo, pontuação e integração simulada.

## Arquivos

- `index.html`: estrutura da página.
- `src/styles.css`: identidade navy / off-white / amber e layout responsivo.
- `src/main.js`: navegação, áudio, fluxo e armazenamento local.
- `src/missions.js`: **todo o conteúdo editável das missões**.
- `src/scoring.js`: normalização centralizada, alternativas aceitas, pontuação e itens de revisão.
- `src/practice.js`: cinco fases visuais, embaralhamento e recompensas locais independentes do score.
- `src/results.js`: snapshot de conclusão, horário local ISO e resumo para WhatsApp.
- `src/sheets.js`: URL opcional e envio ao Apps Script.
- `apps-script/Code.gs`: receptor do Google Sheets.
- `server.js`: servidor local sem dependências; não é usado no deploy.
- `netlify.toml`: publicação estática da raiz.

## Atualizar a missão semanal

1. Abra `src/missions.js`.
2. Mude a missão atual de `status: 'current'` para `'previous'`.
3. Copie um objeto de missão e personalize seus campos. Use um `id` único e estável, como `week-06-hotel`.
4. Marque apenas a nova missão como `'current'`. Use `'draft'` para preparar material invisível ao aluno.
5. Atualize `week`, `title`, `shortTitle`, `missionVersion`, `studentName`, `keyPhrase`, `goal` e `todayYouPractice`.
6. Atualize `targetPhrases`, `vocabulary`, `recognitionPhrases` (opcional), `fallbackAudioScript` e os quatro arrays de perguntas. Cada frase tem `{ english, portuguese }` e pode incluir `audioUrl` para uma gravação individual.
7. Rode `npm test` e confira o fluxo no navegador antes de publicar.

Somente a primeira missão `current` aparece se houver erro de edição com mais de uma; os testes avisam. Todas as `previous` permanecem disponíveis. `draft` não aparece nem pode ser aberta pela navegação, mas o código de um site estático é público: não armazene informações confidenciais nele.

### Formatos das perguntas

```js
chooseMeaningQuestions: [
  { prompt: 'Turn left.', options: ['Vá reto.', 'Vire à esquerda.'], answer: 1 }
],
completePhraseQuestions: [
  { prompt: 'Go ___.', answers: ['straight'], fullPhrase: 'Go straight.' }
],
typeSentenceQuestions: [
  { prompt: 'Fica à esquerda.', answers: ['It’s on the left.', 'It is on the left.'] }
],
finalMissionQuestions: [
  { prompt: 'Ask someone to repeat.', answers: ['Can you repeat, please?', 'Could you repeat, please?'] }
]
```

`answer` é o índice correto, começando em zero. `answers` contém as versões aceitas. A primeira é a referência exibida no feedback. Mantenha pelo menos uma pergunta em cada etapa. A correção é local e determinística, sem IA: respostas válidas não previstas precisam ser adicionadas a `answers` pela trainer.

Nas lacunas ambíguas, inclua `hint`, por exemplo `{ prompt: 'Turn ______.', hint: 'Vire à direita.', answers: ['right'], fullPhrase: 'Turn right.' }`. O esquema interno usa `english`/`portuguese`, `prompt`/`answers` e índice `answer`; esses campos têm o mesmo papel dos nomes ilustrativos usados no briefing original.

### Conteúdo inicial completo

Week 5 está em `v2`: 16 frases principais, 12 palavras, 10 expressões de reconhecimento, roteiro integral em quatro partes e rodada final, 8 questões de significado, 12 lacunas, 14 traduções e 9 situações finais (43 pontos). A versão foi incrementada para não reutilizar respostas do treino reduzido `v1`. Week 4 continua disponível para revisão com suas 16 frases.

### Áudio

Defina `fullAudioUrl` com uma URL HTTPS de MP3 acessível publicamente ou um caminho como `/audio/week-06.mp3`. Vazio, usa Web Speech API para ler `fallbackAudioScript` em inglês. Voz e roteiro escrito também ficam disponíveis com MP3. Para gravar uma frase individual, adicione `audioUrl` ao item em `targetPhrases`; se ausente ou se o arquivo falhar, o botão usa a voz do navegador. Stop audio e a troca de etapa interrompem a reprodução. Vozes e suporte variam por navegador e sistema; a reprodução exige um toque. O roteiro permanece disponível se a voz falhar. Revise a pronúncia nos aparelhos usados pelo aluno.

### Progresso e score

Fluxo: Briefing → Full Audio → Listen & Repeat → Meaning → Complete → Type → Final → Complete → registro opcional. Para avançar, confirme escuta e repetição, marque todas as frases e responda às perguntas da etapa.

Cada resposta correta na primeira tentativa vale 1 ponto. Erros e respostas próximas valem 0 e mostram a referência. `wrongAnswers` mantém os erros de todas as tentativas; `difficultPhrases` usa somente erros da primeira tentativa, deduplicados com normalização. Maiúsculas, espaços extras, pontuação básica e aspas curvas são normalizados. Proximidade usa distância de edição de até 18%, apenas para feedback. Áudio e repetição são autorrelato e não entram na nota. Reiniciar permite uma nova tentativa completa.

O botão **Practice Again** reabre uma questão errada para prática sem modificar a nota da primeira resposta. O progresso guarda todas as tentativas, inclusive as corretas. `wrongAnswers` preserva cada tentativa com erro, `questionIndex`, `attemptNumber` e `verdict: 'almost' | 'incorrect'`. Os scores registram os acertos da primeira tentativa. Para contar erros iniciais no Sheets, filtre `attemptNumber: 1`; tentativas posteriores não devem ser contadas novamente na nota. A tela final mostra a distribuição inicial entre correct/almost/incorrect.

**Completed items** soma questões respondidas, frases marcadas e as duas confirmações de áudio: Week 5 completa tem 61 itens, dos quais 43 são pontuados. O texto de WhatsApp lista as frases em linhas separadas e orienta o envio à trainer.

Progresso e inputs ficam no `localStorage`, por `id` e `missionVersion`. Ao mudar perguntas ou pontuação, incremente a versão. O último resultado também fica em `rtc:last:<id>`, preservado ao reiniciar. O armazenamento pertence ao navegador/dispositivo, não sincroniza e pode ser apagado. Se estiver bloqueado, a interface avisa. Copy Result usa clipboard em localhost/HTTPS; se indisponível, abre o texto para copiar manualmente.

A Home contém Current Mission, Previous Missions e **My Last Result** (a conclusão mais recente entre as missões visíveis). `#previous` mostra os cards de revisão com status local e última nota. `#result/<id>` abre o último resultado sem substituir o progresso atual. Novos resultados incluem frases e totais por etapa como snapshot; resultados `v1` ainda podem ser vistos e copiados com seus valores originais, sem misturar o denominador antigo com o conteúdo `v2`.

## Conectar Google Sheets (opcional)

1. Crie uma planilha no Google Sheets.
2. Abra **Extensions > Apps Script** (Extensões > Apps Script).
3. Cole o conteúdo de `apps-script/Code.gs`, substituindo o exemplo. Salve. No seletor de funções, escolha **setup** e clique em **Run / Executar** uma vez; autorize o acesso solicitado. Isso salva o ID da planilha nas propriedades do script para o Web App conseguir abri-la.
4. Escolha **Deploy > New deployment > Web app**.
5. Configure **Execute as: Me**.
6. Configure **Who has access: Anyone (Anyone with the link)**, sem login obrigatório, e **Execute as: Me**. A planilha permanece privada; o endpoint aceita registros sem autenticação.
7. Copie a URL do Web App que termina em `/exec` (não `/dev`).
8. Cole em `SHEETS_WEB_APP_URL` no arquivo `src/sheets.js`. Publique novamente o site.

O script vinculado cria a aba **RTC Lab Practice Logs**, os 23 cabeçalhos solicitados e uma linha por conclusão. Arrays são JSON em células. Gravações concorrentes são serializadas. Duplicatas são evitadas por aluno, missão, versão e horário da conclusão. Novas tentativas geram novos horários. Textos que parecem fórmulas são armazenados literalmente.

Execute `setup()` no editor, não `doPost()` (que exige o corpo de uma requisição HTTP). Em execução como Web App, o script abre a planilha com `openById`; os métodos de planilha ativa não estão disponíveis nesse contexto, conforme a [documentação oficial](https://developers.google.com/apps-script/guides/bound). Se copiar o script para outra planilha, execute `setup()` novamente nessa cópia.

Payload: `studentName`, `missionId`, `missionName`, `week`, `missionVersion`, `statusAtCompletion`, `completedAt`, `totalScore`, `maxScore`, `percentage`, `listenedFullAudio`, `repeatedOutLoud`, `difficultAudioPhrase`, `listenRepeatCompleted` (quantidade de frases marcadas), os quatro scores, `difficultPhrases`, `wrongAnswers`, `copiedResultText` e `userAgent`. `completedAt` é ISO com deslocamento local (por exemplo `2026-09-17T12:00:00.000-03:00`); Timestamp é a data de recebimento. O snapshot inclui também `practicedPhrases`, `completedItems`, `sectionTotals` e `answerSummary`; o Apps Script mantém os 23 cabeçalhos solicitados e grava a classificação dos erros no JSON de Wrong Answers.

### Google Sheets direct registration

Register Training envia o resultado diretamente por fetch POST, com JSON no corpo e Content-Type text/plain;charset=utf-8. A URL fica em src/sheets.js. O app só confirma sucesso quando recebe JSON com success: true; HTML de login, falha de rede, timeout e erro do servidor oferecem Copy Result e registro manual como alternativa.

Configure a implantação como Web App: Execute as: Me; Who has access: Anyone (Anyone with the link), sem exigir login Google. Use a URL /exec, nunca /dev. Isso permite envio anônimo ao endpoint; a planilha não precisa ser compartilhada publicamente. A configuração anterior com conta Google obrigatória impede o fluxo direto e deve ser alterada para habilitá-lo.

Para atualizar: Deploy > Manage deployments > Edit > New version > Deploy. O doPost já interpreta JSON.parse(e.postData.contents), independentemente do Content-Type. Se falhar no celular, use Copy Result e envie à professora. O link Open manual registration só aparece como alternativa após falha. Repetir o envio da mesma conclusão não duplica a linha.


## Deploy no Netlify

1. Envie os arquivos ao repositório `jukozawa-sunsetlanguages/rtc-practice-missions`.
2. No Netlify, importe esse repositório como um novo projeto.
3. Deixe **Build command** vazio e **Publish directory** como `.` (já configurado no `netlify.toml`).
4. Publique. A navegação usa hash, sem redirects de SPA.
5. Abra a URL HTTPS no celular e teste uma missão e Copy Result.

Fontes Google são opcionais; o layout usa fontes do sistema caso estejam indisponíveis.

## Verificação manual

- Teste em 375 px e desktop: sem rolagem horizontal, botões e campos acessíveis.
- Abra Week 5, avance, digite uma resposta e recarregue: progresso e rascunho retornam.
- Teste áudio completo, individual, Stop audio e roteiro escrito.
- Responda certo, errado e com pequenos erros; confira score e difficult phrases.
- Conclua ambas as missões; copie o resultado; reinicie e volte à Home.
- Sem URL: Register Training mostra a mensagem sem quebrar.
- Com URL real: registre e confira a linha e os 23 campos no Sheets. Esse teste exige uma implantação autorizada e não é substituído pelo teste simulado local.

### Ritmo e voz do treino

Weeks 4 e 5 oferecem Lento (0,75x), Normal (1x) e Rápido (1,2x) no áudio completo e Listen & Repeat. A preferência fica salva neste navegador. Ao alterar o ritmo, toque em Play para reiniciar a voz gerada. Gravações usam o mesmo ritmo.

A voz gerada prioriza vozes masculinas en-US conhecidas disponíveis no dispositivo. A Web Speech API não informa gênero; se nenhuma dessas vozes estiver instalada, usa outra voz americana ou inglesa disponível. Arquivos de áudio mantêm a voz da gravação. Os scripts continuam em fallbackAudioScript, em src/missions.js.

Os roteiros das Weeks 4 e 5 usam [pause] para 3 segundos de silêncio. Week 5 aplica audioRateMultiplier: 0.9 aos três ritmos. audioChapters define os dois marcadores: Core Training (partes 1–3) e Extra Directions Review (parte 4 até o fim). Os timestamps são estimados a 150 palavras/minuto, ajustados pelo ritmo, com as pausas; a voz do dispositivo pode ter duração diferente. Os botões iniciam cada parte separadamente; Play with text-to-speech reproduz tudo.

Diagnóstico de registro: o console mostra clique, payload enviado, status HTTP, resposta e JSON interpretado. Resultados antigos com listas serializadas em JSON são normalizados antes do POST. Invalid practice details indica difficultPhrases/wrongAnswers fora do formato de lista; não existe campo practiceDetails obrigatório. Não considerar HTML de login ou resposta opaca como sucesso.

Verificação de produção: /build-info.json informa commit (COMMIT_REF), contexto e horário do build Netlify. Compare commit com git rev-parse HEAD; o marcador tem Cache-Control: no-store.

### Registro automático
Mission Complete envia uma vez por resultado. registrationStatus:{submissionId} guarda pending/submitted/failed; a identidade usa aluno, missão, versão e completedAt, como a deduplicação já existente no Apps Script. Resultados submetidos não são reenviados. Falhas ou envios interrompidos por recarga exigem Try registering again. A deduplicação no servidor evita nova linha quando o primeiro envio chegou mas a confirmação se perdeu. Copy Result permanece disponível; registro manual só aparece após falha ou Need manual registration?. O POST continua lendo confirmação JSON (não usa resposta opaca no-cors como sucesso).

### Travel Review Pack
Três missões de revisão em Previous Missions: Mission 1 — Travel Survival, Mission 2 — Airport Day e Mission 3 — Hotel Day. Conteúdo editável em src/missions.js, status previous, categoria Travel Review Pack. Incluem roteiro de repetição com pausas, traduções, exercícios, cenários finais e mensagens de conclusão. A missão atual e os IDs antigos foram preservados. O campo interno week e as colunas do Sheets permanecem compatíveis; a interface e o resumo para WhatsApp usam Mission. O fluxo de registro automático não foi alterado.

Após concluir, a tentativa fica em My Last Result e a missão fica pronta para começar novamente no briefing. A tela Mission Complete e o envio automático continuam ativos. Treinos ainda não concluídos continuam de onde pararam.

Mission 7 — Problems & Help é a missão atual: 20 frases e 44 questões (8 significado, 12 lacunas, 14 traduções, 10 situações). Mission 5 passou a previous, mantendo ID, versão e conteúdo. A Mission 6 não estava no repositório sincronizado; seu conteúdo não foi criado neste pedido. Registro automático permanece inalterado.

Mission 6 — Shopping & Buying Things é a missão atual (17 frases, 51 questões). Mission 7 está em Next Mission: status draft com isNext: true, exibida como prévia na Home, ainda sem iniciar treino. Para ativá-la futuramente, altere status para current e mova a atual para previous. Registro automático, IDs e conteúdo das missões anteriores foram preservados.


## Refinamento do treino — outubro de 2026

### Auditoria da Mission 5

Antes da mudança visual, as respostas exatas `Uber` (Complete), `I need an Uber.` (Type) e `I need an Uber.` (Final) já eram reconhecidas corretamente pelo avaliador existente. A suíte inicial de 19 testes passou. Não há nesta auditoria as respostas da tentativa histórica com 7/8 e os demais scores zerados: não é possível concluir se eram preenchimentos inválidos ou um problema naquela versão do navegador.

A correção encontrada foi na revisão: antes, incluía erros de qualquer tentativa e deduplicava texto literalmente, permitindo `Turn right` e `Turn right.`. Agora usa a primeira tentativa e normalização. O cálculo de acertos continua usando exclusivamente a primeira resposta. Respostas próximas nunca recebem ponto; o veredito `almost` antigo continua disponível para evidência, sem aceitar sinônimos por aproximação.

### Experiência implementada

- Sete etapas internas (`step` 0–6) preservadas, agrupadas em Briefing, Hear & Repeat (A/B), Recognize, Build (A/B) e Final Mission. Conclusão continua em `step: 7`.
- Uma frase/pergunta por tela; uma confirmação basta para praticar uma frase. Tradução fica recolhida. Prática silenciosa é válida.
- Opções explícitas embaralhadas uma vez por item/tentativa; a ordem é salva durante a missão. A identidade da alternativa correta não muda.
- Bancos de palavras da Mission 5 possuem pistas em português para evitar ambiguidades. Hard mode usa o mesmo avaliador e a mesma nota. Sem banco, a missão mantém digitação.
- Type the Sentence e Final continuam com produção digitada, uma pergunta por vez, feedback imediato e Practice Again. Não aceitam envio acidental de uma letra. Inputs desativam autocorreção/capitalização; lacunas limitadas a 60 caracteres, frases a 240.
- Ações móveis usam uma área sticky. Ao focar um campo, ela volta ao fluxo normal da página, sem sobrepor o teclado. Ainda é necessário validar o teclado físico do aparelho do aluno.
- Train What I Missed oferece os itens errados iniciais, deduplicados por frase, preservando seu tipo. A revisão fica isolada na sessão, não grava outro resultado, não altera score e não reenvia o treinamento. Ao recarregar, a revisão reinicia; o resultado original continua salvo. Resultados de outra versão permanecem visíveis/copiáveis, mas não iniciam revisão com perguntas de uma versão diferente.
- Resultado exibe feedback proporcional, 1–3 estrelas e até seis frases prioritárias; a revisão cobre todas as frases únicas. A evidência completa permanece em Wrong Answers. A dificuldade de áudio autorrelatada fica em campo separado.
- XP local: 10 por etapa interna concluída + 5 por acerto inicial + 20 pela conclusão. O total é creditado ao concluir a missão, uma única vez por identidade de resultado; reabrir/recarregar não duplica XP. Não se credita retroativamente ao abrir resultados antigos. Estrelas: 85% = 3, 60% = 2, abaixo = 1. Sem streak diário.
- Home compacta mantém saudação, missão atual, próxima missão, revisão e último resultado. O tempo estimado inclui o roteiro integral de áudio, sem prometer 5 minutos para um treino mais longo.
- MP3 mantém controles nativos; voz do navegador tem Play/Restart, Pause/Resume e Stop. A disponibilidade e a qualidade da voz/pausa dependem do navegador.

### Campos opcionais e compatibilidade

```js
{ id: 'directions-right', prompt: 'Turn ___.',
  expectedAnswer: 'right', // ou answers: ['right'], como antes
  acceptedAnswers: [],
  hint: 'Vire à direita.',
  fullPhrase: 'Turn right.',
  wordBank: ['right', 'left', 'straight', 'there'] }
```

`acceptedAnswers` se soma a `answers` e/ou `expectedAnswer`. A mesma função `acceptedAnswers()` + `evaluate()` é usada por lacunas, frases e desafios finais. Lowercase, espaços, pontuação básica e apóstrofos/aspas curvas são normalizados. Não há correção semântica por IA.

`audioSections` é um alias opcional de `audioChapters`, no formato `{title, startsAt}`: `startsAt` deve ser um trecho literal do roteiro e a lista deve estar na ordem do roteiro. Missões sem seções reproduzem o áudio completo. Campos como `difficulty` e `xp` não são obrigatórios e não mudam a nota.

As chaves `rtc:progress:<id>:<version>` e `rtc:last:<id>` foram mantidas. O progresso pode incluir `cursors`, `phraseCursor`, `orders` e `hardModes`, todos opcionais. Recompensas ficam apenas em `rtc:rewards:v1`. Os itens errados agora incluem `itemId` dentro do JSON já existente de Wrong Answers; os campos e cabeçalhos do Sheets não mudaram.

### Limites deliberados

Bônus por repetições/hard mode/revisão, badges e analytics adicionais foram adiados. A digitação permanece disponível em Hard mode e na Final Mission. Não há botões fictícios ou recursos TODO. Nenhuma dependência foi adicionada.

`src/sheets.js`, `src/registration.js`, `apps-script/Code.gs` e a URL de produção permanecem inalterados. A única proteção visual nova evita que uma resposta assíncrona de registro interrompa uma revisão já aberta; o envio e a persistência do status continuam iguais. Copy Result e fallback de cópia manual estão preservados.

### Validação e teste no telefone

Execute `npm test`, `node --check src/main.js` e `node scripts/build-info.js` (comando usado pelo Netlify). Não existe script npm build nem instalação necessária. Testes usam armazenamento e transporte isolados, sem inserir tentativas artificiais na planilha da trainer.

No Chrome do Mateus: abra Mission 5, teste a lacuna com `UBER!`, uma frase com espaços/apóstrofos e a resposta final `I need an Uber.`; erre uma resposta e acerte no Practice Again, verificando que a nota inicial não muda. Feche/reabra durante a prática. Confira teclado, Check/Next, voz, Pause/Resume, ritmo, revisão e cópia para WhatsApp. Na conclusão real, confirme Training submitted e a linha na planilha; reabra o resultado e confirme ausência de nova linha e de XP duplicado. Teste também uma missão sem wordBank.


### Build e voz (outubro de 2026)

- Mission 5 e Mission 6 usam bancos explícitos de alternativas em Complete the Phrase. Missões sem `wordBank` continuam com digitação.
- Build the Sentence mostra chunks embaralhados, derivados de grupos contíguos da resposta esperada. O campo opcional `chunks: ["I’m looking", "for a", "t-shirt."]` permite escolher os grupos manualmente. Chunks inválidos voltam à digitação. Hard mode mantém o teclado disponível; a primeira resposta continua determinando a nota.
- Seleções parciais, alternativas embaralhadas e modo escolhido ficam no progresso salvo. Respostas digitadas anteriormente continuam visíveis.
- “I listened to the full audio” agora é um checkbox com persistência, independente da confirmação de repetição.
- A voz do navegador prioriza vozes americanas naturais/enhanced e permite seleção manual. Isso não garante a mesma qualidade em todo aparelho.
- Para voz ElevenLabs consistente, exporte o roteiro para MP3 e configure `fullAudioUrl` (ou `targetPhrases[].audioUrl` por frase). Nenhuma chave deve entrar no JavaScript público. O player usa a gravação como padrão, com voz do navegador como alternativa. Os três ritmos continuam disponíveis.
- O fluxo e a URL do Google Sheets não foram alterados.


### Home, sessões e motivação

A Home diferencia número do tópico de conclusões registradas neste navegador. A trilha ordena M1–M7 e mantém todas as missões anteriores acessíveis. M7 passa a abrir quando existe uma conclusão local de M6 (qualquer nota); as demais drafts continuam ocultas. Limpar dados locais também remove esse desbloqueio.

“~8-minute sessions” é um convite para dividir o treino: não promete que o conteúdo integral leva oito minutos, não pula etapas nem envia resultado parcial. O tempo integral permanece em “Time & rewards”. “Save & finish this session” volta à Home e mantém o progresso; o registro só ocorre na conclusão integral original.

O XP durante a missão deriva de passos concluídos e primeiras respostas corretas, sem creditar retries. O total e o nível (350 XP por nível) usam o ledger de conclusões existente. Meta diária: cinco itens distintos praticados (frases ou questões, mesmo incorretas). `rtc:activity:v1` armazena IDs por data local, com deduplicação e sequência de dias; não reconstrói práticas anteriores à atualização. Não há perda de XP ao interromper a sequência.

`practice-reminder.ics` oferece importação opcional de lembrete diário às 19h no fuso local do calendário, editável pelo aluno. Não envia notificações pelo site nem exige permissões. Reimportar pode duplicar eventos dependendo do calendário; importe apenas uma vez.

Estrelas preservam os limiares existentes: 85% e 60%. Payload, URL, envio automático, notas e Copy Result permanecem inalterados.
