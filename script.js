// DADOS FICTÍCIOS BRUTOS - 9º Ano
// Guarda a lista de 15 disciplinas em um Array de Objetos
const dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Língua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Nota demonstrativa de frequência: 92% é fictício nesta etapa e será dinâmico no futuro.

// Função para normalizar qualquer formato de nota para a escala 0 a 10
function normalizarNota(valor) {
  // Se for nulo, indefinido ou texto vazio, retorna null (nota não lançada)
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto decimal
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  // Converte para número
  const num = Number(valor);

  // Se não for um número válido, descarta
  if (isNaN(num)) {
    return null;
  }

  // Ajusta notas na escala 0-100 para 0-10
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  // Se já estiver na faixa 0-10, retorna o valor
  if (num >= 0 && num <= 10) {
    return num;
  }

  // Valores fora dessas regras são considerados inválidos
  return null;
}

// Função principal que constrói o boletim na tela
function renderizarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

  let somaMediasGerais = 0;
  let totalMediasValidas = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Percorre cada uma das 15 disciplinas usando forEach
  dadosBoletim.forEach((item) => {
    // Normaliza as notas dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcula a média ignorando notas ausentes (null)
    const notasValidas = [n1, n2, n3].filter((n) => n !== null);

    let mediaFinal = null;
    let textoMedia = "—";
    let situacao = "Nota ainda não disponível";
    let classeBadge = "badge-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      mediaFinal = soma / notasValidas.length;
      textoMedia = mediaFinal.toFixed(1).replace(".", ",");

      somaMediasGerais += mediaFinal;
      totalMediasValidas++;

      // Define situação com base na média 6.0
      if (mediaFinal >= 6.0) {
        situacao = "Bom desempenho";
        classeBadge = "badge-bom";
        qtdBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeBadge = "badge-atencao";
        qtdAtencao++;
      }
    }

    // Soma total de faltas da disciplina
    const somaFaltas = item.faltas.reduce((a, b) => a + b, 0);
    totalFaltasGeral += somaFaltas;

    // Formata o texto das notas na tabela
    const txt1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const txt2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const txt3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";

    // Cria a linha HTML da disciplina na tabela via DOM
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${txt1}</td>
      <td>${txt2}</td>
      <td>${txt3}</td>
      <td><strong>${textoMedia}</strong></td>
      <td>${somaFaltas}</td>
      <td><span class="badge ${classeBadge}">${situacao}</span></td>
    `;

    corpoTabela.appendChild(tr);
  });

  // Atualiza os Cards de Resumo no topo da página
  const mediaGeralCalculada = totalMediasValidas > 0
    ? (somaMediasGerais / totalMediasValidas).toFixed(1).replace(".", ",")
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("disciplinas-bom").textContent = qtdBomDesempenho;
  document.getElementById("disciplinas-atencao").textContent = qtdAtencao;

  // --- Textos de situação dos cards ---

  // Situação textual da média geral (mínimo 6,0)
  const mediaNum = parseFloat(mediaGeralCalculada.replace(",", "."));
  let textoMediaGeral = "—";
  if (!isNaN(mediaNum)) {
    textoMediaGeral = mediaNum >= 6.0 ? "Acima da média mínima" : "Abaixo da média mínima";
  }
  document.getElementById("media-geral-texto").textContent = textoMediaGeral;

  // Situação textual das faltas (referência: 30 faltas no total)
  let textoFaltas = "—";
  if (totalFaltasGeral === 0) {
    textoFaltas = "Nenhuma falta registrada";
  } else if (totalFaltasGeral <= 30) {
    textoFaltas = "Faltas dentro do esperado";
  } else {
    textoFaltas = "Faltas acima do esperado";
  }
  document.getElementById("total-faltas-texto").textContent = textoFaltas;

  // Quantidade relativa de disciplinas
  const totalDisciplinas = dadosBoletim.length;
  document.getElementById("disciplinas-bom-texto").textContent =
    `de ${totalDisciplinas} disciplinas`;
  document.getElementById("disciplinas-atencao-texto").textContent =
    `de ${totalDisciplinas} disciplinas`;
}

// Executa a função quando a página carrega
renderizarBoletim();