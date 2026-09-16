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
6. Atualize `targetPhrases`, `vocabulary`, `fallbackAudioScript` e os quatro arrays de perguntas. Cada frase tem `{ english, portuguese }`.
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

### Áudio

Defina `fullAudioUrl` com uma URL HTTPS de MP3 acessível publicamente ou um caminho como `/audio/week-06.mp3`. Vazio, usa Web Speech API para ler `fallbackAudioScript` em inglês. Voz e roteiro escrito também ficam disponíveis com MP3. As frases individuais usam a voz do navegador. Vozes e suporte variam por navegador e sistema; a reprodução exige um toque. O roteiro permanece disponível se a voz falhar. Revise a pronúncia nos aparelhos usados pelo aluno.

### Progresso e score

Fluxo: Briefing → Full Audio → Listen & Repeat → Meaning → Complete → Type → Final → Complete → registro opcional. Para avançar, confirme escuta e repetição, marque todas as frases e responda às perguntas da etapa.

Cada resposta correta na primeira tentativa vale 1 ponto. Erros e respostas próximas valem 0, mostram a referência e entram em `wrongAnswers` / `difficultPhrases`. Maiúsculas, espaços extras, pontuação básica e aspas curvas são normalizados. Proximidade usa distância de edição de até 18%, apenas para feedback. Áudio e repetição são autorrelato e não entram na nota. Reiniciar permite uma nova tentativa completa.

Progresso e inputs ficam no `localStorage`, por `id` e `missionVersion`. Ao mudar perguntas ou pontuação, incremente a versão. O último resultado também fica em `rtc:last:<id>`, preservado ao reiniciar. O armazenamento pertence ao navegador/dispositivo, não sincroniza e pode ser apagado. Se estiver bloqueado, a interface avisa. Copy Result usa clipboard em localhost/HTTPS; se indisponível, abre o texto para copiar manualmente.

## Conectar Google Sheets (opcional)

1. Crie uma planilha no Google Sheets.
2. Abra **Extensions > Apps Script** (Extensões > Apps Script).
3. Cole o conteúdo de `apps-script/Code.gs`, substituindo o exemplo. Salve.
4. Escolha **Deploy > New deployment > Web app**.
5. Configure **Execute as: Me**.
6. Configure **Who has access: Anyone with the link** — a opção pode aparecer como **Anyone**. O acesso deve permitir chamadas sem login. Autorize a implantação com sua conta. Contas institucionais podem restringir acesso público.
7. Copie a URL do Web App que termina em `/exec` (não `/dev`).
8. Cole em `SHEETS_WEB_APP_URL` no arquivo `src/sheets.js`. Publique novamente o site.

O script vinculado cria a aba **RTC Lab Practice Logs**, os 23 cabeçalhos solicitados e uma linha por conclusão. Arrays são JSON em células. Gravações concorrentes são serializadas. Duplicatas são evitadas por aluno, missão, versão e horário da conclusão. Novas tentativas geram novos horários. Textos que parecem fórmulas são armazenados literalmente.

Payload: `studentName`, `missionId`, `missionName`, `week`, `missionVersion`, `statusAtCompletion`, `completedAt`, `totalScore`, `maxScore`, `percentage`, `listenedFullAudio`, `repeatedOutLoud`, `difficultAudioPhrase`, `listenRepeatCompleted` (quantidade de frases marcadas), os quatro scores, `difficultPhrases`, `wrongAnswers`, `copiedResultText` e `userAgent`. `completedAt` é ISO UTC; Timestamp é a data de recebimento.

### CORS e confirmação

Apps Script não oferece handler OPTIONS para preflight. O cliente envia **POST com corpo JSON e Content-Type `text/plain;charset=utf-8`**, em modo `no-cors`. O script interpreta JSON e retorna `{ "success": true }`. A resposta no navegador é opaca: a interface informa **Training sent**, sem afirmar confirmação da planilha. A trainer deve conferir a linha no Sheets. Não troque para `application/json` sem uma solução de CORS.

Após envio, o botão fica desabilitado para aquela conclusão. Em falha de rede, permite tentar novamente; o script evita duplicar o mesmo resultado. Sem URL, mostra: “Registration not connected yet. Copy your result and send it to your teacher.” O aluno precisa clicar em Register Training: nada é enviado automaticamente. A URL pública não autentica remetentes; mantenha a própria planilha privada.

Ao atualizar o script: **Deploy > Manage deployments > Edit > New version > Deploy**. Mantenha a mesma URL. Para diagnosticar falhas, confira **Executions** no Apps Script e as permissões do Web App.

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
