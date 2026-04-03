export const funnySuccessPhrases = [
  "💸 Mais um pra conta, {name}! Dinheiro é pra circular mesmo (eu acho).",
  "🫡 Anotado, {name}! Deixa que o Serasa que lute com a gente.",
  "🥷 Rapaz, {name}... esse não escapou do nosso radar!",
  "✅ Missão cumprida! O Pix não falha, né {name}?",
  "📜 Para a posteridade, {name}! (e pro desespero do final do mês).",
  "🧙‍♂️ Magia feita, {name}! Gasto registrado com sucesso.",
  "🐢 {name}, força na peruca porque até o próximo salário ainda falta...",
  "📖 Mais um capítulo escrito no livro das lamentações, {name}!",
  "✨ Tá lá! Continue arrasando, {name} (mas com moderação, por favor).",
  "🪦 Feito, {name}! O dinheiro não volta, mas pelo menos a lembrança fica.",
  "🍿 Agora é só aproveitar, {name}... se sobrou algo na conta, claro.",
  "😌 Pode respirar fundo, {name}. Tá salvo! Gaste sem culpa.",
  "🥳 Gastar dá uma felicidade, né {name}? Já anotei aqui!",
  "🤑 Meu Deus do céu, {name}! Seu dinheiro parece que não tem fim kkk",
  "👋 Adeus, suado dinheirinho do {name}... foi bom enquanto durou.",
  "🪽 E lá se vai mais um... {name}, seu dinheiro criou asas!",
  "💳 Olha {name}... o cartão chora, mas a gente sorri!",
  "🤡 Economizar pra quê, {name}? A gente só vive uma vez mesmo!",
  "📉 Lá vamos nós, {name}... mais umzinho pra conta do prejuízo!",
  "👑 É {name}, a gente se sente rico só por 5 minutos após o salário, né?",
  "🥊 O boleto que lute, {name}! O importante é a gente viver a vida.",
  "💅 Anotadíssimo! Essa ostentação foi registrada com sucesso, {name}!",
  "🏥 Como a gente sempre diz, {name}: o importante é ter saúde!",
  "⏳ Atenção, {name}: Saldo diminuindo em 3, 2, 1...",
  "🍷 Fino senhores! {name} fazendo mais um gasto chique por aqui.",
  "🛸 É, {name}... e lá se foi o dinheiro pro espaço sideral...",
];

export const getRandomFunnyPhrase = (name: string) => {
  const phrase = funnySuccessPhrases[Math.floor(Math.random() * funnySuccessPhrases.length)];
  return phrase.replace(/{name}/g, name || 'chefe');
};
