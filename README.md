# RTC Lab Practice Missions

MVP estático de prática oral entre aulas, WorkSpeak / RTC Lab. Inicialmente para Mateus. HTML, CSS e JavaScript ES Modules, sem dependências de execução, backend próprio, login ou banco de dados. Hospedagem prevista no Netlify.

## Rodar localmente

Instale Node.js 20+ e rode `npm run dev`. Abra **http://localhost:5173**. Não precisa de `npm install`. Não abra `index.html` via `file://`: os módulos precisam de um servidor HTTP. `npm test` executa os testes de conteúdo, pontuação e integração simulada.

## Arquivos

- `index.html`: estrutura da página.
- `src/styles.css`: identidade navy / off-white / amber e layout responsivo.
- `src/main.js`: navegação, áudio, fluxo e armazenamento local.
- `src/missions.js`: **todo o conteúdo editável das missões**.
- `src/scoring.js`: normalização, feedback aproximado e pontuação.
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

Cada resposta correta na primeira tentativa vale 1 ponto. Erros e respostas próximas valem 0, mostram a referência e entram em `wrongAnswers` / `difficultPhrases`. Maiúsculas, espaços extras, pontuação básica e aspas curvas são normalizados. Proximidade usa distância de edição de até 18%, apenas para feedback. Áudio e repetição são autorrelato e não entram na nota. Reiniciar permite uma nova tentativa completa.

O botão **Try again** reabre uma questão errada para prática sem modificar a nota da primeira resposta. O progresso guarda todas as tentativas, inclusive as corretas. `wrongAnswers` preserva cada tentativa com erro, `questionIndex`, `attemptNumber` e `verdict: 'almost' | 'incorrect'`. Os scores registram os acertos da primeira tentativa. Para contar erros iniciais no Sheets, filtre `attemptNumber: 1`; tentativas posteriores não devem ser contadas novamente na nota. A tela final mostra a distribuição inicial entre correct/almost/incorrect.

**Completed items** soma questões respondidas, frases marcadas e as duas confirmações de áudio: Week 5 completa tem 61 itens, dos quais 43 são pontuados. O texto de WhatsApp lista as frases em linhas separadas e orienta o envio à trainer.

Progresso e inputs ficam no `localStorage`, por `id` e `missionVersion`. Ao mudar perguntas ou pontuação, incremente a versão. O último resultado também fica em `rtc:last:<id>`, preservado ao reiniciar. O armazenamento pertence ao navegador/dispositivo, não sincroniza e pode ser apagado. Se estiver bloqueado, a interface avisa. Copy Result usa clipboard em localhost/HTTPS; se indisponível, abre o texto para copiar manualmente.

A Home contém Current Mission, Previous Missions e **My Last Result** (a conclusão mais recente entre as missões visíveis). `#previous` mostra os cards de revisão com status local e última nota. `#result/<id>` abre o último resultado sem substituir o progresso atual. Novos resultados incluem frases e totais por etapa como snapshot; resultados `v1` ainda podem ser vistos e copiados com seus valores originais, sem misturar o denominador antigo com o conteúdo `v2`.

## Conectar Google Sheets (opcional)

1. Crie uma planilha no Google Sheets.
2. Abra **Extensions > Apps Script** (Extensões > Apps Script).
3. Cole o conteúdo de `apps-script/Code.gs`, substituindo o exemplo. Salve. No seletor de funções, escolha **setup** e clique em **Run / Executar** uma vez; autorize o acesso solicitado. Isso salva o ID da planilha nas propriedades do script para o Web App conseguir abri-la.
4. Escolha **Deploy > New deployment > Web app**.
5. Configure **Execute as: Me**.
6. Configure **Who has access: Anyone with Google account**, ou restrinja à organização Workspace desejada. **Mantenha o login obrigatório**. Não selecione acesso anônimo. Use Execute as: Me para gravar na planilha da trainer sem conceder acesso direto à planilha ao aluno.
7. Copie a URL do Web App que termina em `/exec` (não `/dev`).
8. Cole em `SHEETS_WEB_APP_URL` no arquivo `src/sheets.js`. Publique novamente o site.

O script vinculado cria a aba **RTC Lab Practice Logs**, os 23 cabeçalhos solicitados e uma linha por conclusão. Arrays são JSON em células. Gravações concorrentes são serializadas. Duplicatas são evitadas por aluno, missão, versão e horário da conclusão. Novas tentativas geram novos horários. Textos que parecem fórmulas são armazenados literalmente.

Execute `setup()` no editor, não `doPost()` (que exige o corpo de uma requisição HTTP). Em execução como Web App, o script abre a planilha com `openById`; os métodos de planilha ativa não estão disponíveis nesse contexto, conforme a [documentação oficial](https://developers.google.com/apps-script/guides/bound). Se copiar o script para outra planilha, execute `setup()` novamente nessa cópia.

Payload: `studentName`, `missionId`, `missionName`, `week`, `missionVersion`, `statusAtCompletion`, `completedAt`, `totalScore`, `maxScore`, `percentage`, `listenedFullAudio`, `repeatedOutLoud`, `difficultAudioPhrase`, `listenRepeatCompleted` (quantidade de frases marcadas), os quatro scores, `difficultPhrases`, `wrongAnswers`, `copiedResultText` e `userAgent`. `completedAt` é ISO com deslocamento local (por exemplo `2026-09-17T12:00:00.000-03:00`); Timestamp é a data de recebimento. O snapshot inclui também `practicedPhrases`, `completedItems`, `sectionTotals` e `answerSummary`; o Apps Script mantém os 23 cabeçalhos solicitados e grava a classificação dos erros no JSON de Wrong Answers.

### Registro com login Google obrigatório

A prática continua no site estático. O registro é concluído na página hospedada pelo próprio Apps Script, protegida pelo login Google da implantação. O antigo envio anônimo por fetch e a consulta JSONP foram substituídos: eles não conseguiam realizar o login exigido pelo Web App.

1. No final da missão, clique **Register Training**. O aplicativo copia os dados de registro e mostra as instruções.
2. Clique **Open Google Registration**, entre com uma conta autorizada e cole os dados no campo **Registration data**.
3. Confira aluno, missão e nota na prévia e clique **Register Training** nessa página.
4. Aguarde **Training registered ✅**, exibido somente após a resposta positiva da gravação. Retorne ao app quando terminar.

Se a cópia automática for bloqueada, use **Copy registration data** ou selecione o texto manualmente no painel. Esse conteúdo é diferente do resumo **Copy Result**, que continua destinado ao WhatsApp. Os dados não são colocados na URL nem enviados automaticamente antes da confirmação. A página autenticada usa [google.script.run](https://developers.google.com/apps-script/guides/html/communication) para chamar o servidor no contexto do Google, sem depender de cookies de terceiros ou CORS do site estático.

A confirmação aparece na página Google; o app original não afirma que registrou ao apenas abrir o fluxo. Dados locais permanecem disponíveis. Reenviar a mesma conclusão não duplica a linha. Se a sessão expirar, faça login novamente e cole os mesmos dados.

**Atualizar uma implantação existente:** substitua todo o conteúdo de Code.gs pelo arquivo deste repositório, execute setup() se ainda não configurou a planilha e selecione **Deploy > Manage deployments > Edit > New version > Deploy**. Preserve a URL /exec e o acesso com login obrigatório. Não basta atualizar o GitHub: o código no Apps Script precisa ser publicado também. Tudo está no Code.gs; não é necessário criar um arquivo HTML separado.

Se a URL abrir uma mensagem sobre recibo inválido ou função doGet ausente em vez do formulário, a implantação ainda está com a versão antiga. Se a conta não tiver acesso, use a conta permitida pela implantação. Em falhas de gravação, consulte **Executions** no Apps Script. Não remova o login para contornar o erro.

O doPost continua disponível para clientes autenticados, mas o site não tenta enviar por fetch. Os testes automatizados usam mocks e nunca escrevem na planilha real.

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
