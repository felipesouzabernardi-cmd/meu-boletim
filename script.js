// DADOS FICTÍCIOS BRUTOS - 9º Ano
// Guarda a lista de 15 disciplinas em um Array de Objetos
// (passou a ser "let" para permitir carregar do localStorage)
let dadosBoletim = [
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

  // Aplica edição inline na tabela
  aplicarEdicaoInline();

  // Atualiza os gráficos após a tela já ter sido montada
  atualizarGraficos();
}

// ===== ÁREA DOS GRÁFICOS (camada somente leitura) =====

// Instâncias dos gráficos
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Referência interna de risco (NUNCA exibir na interface)
const REFERENCIA_FALTAS_RISCO = 350;

// Calcula a média de uma disciplina usando normalizarNota (null ignorado)
function calcularMediaDisciplina(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);
  const validas = [n1, n2, n3].filter((n) => n !== null);
  if (validas.length === 0) return null;
  return validas.reduce((a, b) => a + b, 0) / validas.length;
}

// Gráfico 1 — Média por disciplina (barras horizontais)
function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas) return;

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  const disciplinas = dadosBoletim.map((item) => item.disciplina);
  const medias = dadosBoletim.map((item) => {
    const m = calcularMediaDisciplina(item);
    return m === null ? null : Number(m.toFixed(1));
  });

  graficoMedias = new Chart(canvas, {
    type: "bar",
    data: {
      labels: disciplinas,
      datasets: [{
        label: "Média",
        data: medias,
        backgroundColor: "#7c3aed",
        borderRadius: 6,
        barThickness: 14
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: "#4c1d95" },
          grid: { color: "#f3e8ff" }
        },
        y: {
          ticks: { color: "#333333", font: { size: 10 } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null || ctx.raw === undefined) {
                return "Sem nota";
              }
              return "Média: " + ctx.raw.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

// Gráfico 2 — Evolução da média geral por trimestre (linha)
function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas) return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  function mediaTrimestre(campo) {
    const notas = dadosBoletim
      .map((item) => normalizarNota(item[campo]))
      .filter((n) => n !== null);
    if (notas.length === 0) return null;
    return notas.reduce((a, b) => a + b, 0) / notas.length;
  }

  const valores = [
    mediaTrimestre("tri1"),
    mediaTrimestre("tri2"),
    mediaTrimestre("tri3")
  ].map((v) => (v === null ? null : Number(v.toFixed(1))));

  graficoEvolucao = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média geral",
        data: valores,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        pointBackgroundColor: "#4c1d95",
        pointRadius: 6,
        tension: 0.3,
        fill: true,
        spanGaps: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: "#4c1d95" },
          grid: { color: "#f3e8ff" }
        },
        x: {
          ticks: { color: "#333333" },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              if (ctx.raw === null || ctx.raw === undefined) {
                return "Sem nota";
              }
              return "Média: " + ctx.raw.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

// Gráfico 3 — Faltas por trimestre (3 barras) + Perigo
function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  const estado = document.getElementById("estadoFaltas");
  const card = canvas ? canvas.closest(".grafico-card") : null;
  if (!canvas) return;

  if (graficoFaltas) {
    graficoFaltas.destroy();
  }

  let f1 = 0;
  let f2 = 0;
  let f3 = 0;
  dadosBoletim.forEach((item) => {
    if (Array.isArray(item.faltas) && item.faltas.length >= 3) {
      f1 += Number(item.faltas[0]) || 0;
      f2 += Number(item.faltas[1]) || 0;
      f3 += Number(item.faltas[2]) || 0;
    }
  });

  const totalFaltas = f1 + f2 + f3;

  // Perigo somente quando atingir a referência interna (350)
  if (estado) {
    if (totalFaltas >= REFERENCIA_FALTAS_RISCO) {
      estado.innerHTML = '<span class="badge-perigo">Perigo</span>';
      if (card) card.classList.add("perigo");
    } else {
      estado.innerHTML = "";
      if (card) card.classList.remove("perigo");
    }
  }

  graficoFaltas = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [f1, f2, f3],
        backgroundColor: ["#a78bfa", "#7c3aed", "#4c1d95"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#4c1d95", precision: 0 },
          grid: { color: "#f3e8ff" }
        },
        x: {
          ticks: { color: "#333333" },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.label + ": " + ctx.raw + " faltas";
            }
          }
        }
      }
    }
  });
}

// Atualiza os três gráficos
function atualizarGraficos() {
  if (typeof Chart === "undefined") {
    // Chart.js ainda não carregou — tenta novamente em breve
    setTimeout(atualizarGraficos, 100);
    return;
  }
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}

// ===== ÁREA DE EDIÇÃO INLINE + LOCALSTORAGE =====

const CHAVE_STORAGE = "boletim_9b_14";

// Carrega dados salvos do localStorage (se existirem e forem válidos)
function carregarDoStorage() {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    if (!salvo) return;
    const dados = JSON.parse(salvo);
    if (Array.isArray(dados) && dados.length === dadosBoletim.length) {
      // Mantém as disciplinas originais e aplica notas/faltas salvas
      dadosBoletim = dadosBoletim.map((original, i) => ({
        disciplina: original.disciplina,
        tri1: dados[i].tri1,
        tri2: dados[i].tri2,
        tri3: dados[i].tri3,
        faltas: Array.isArray(dados[i].faltas) ? dados[i].faltas.slice(0, 3) : [0, 0, 0]
      }));
    }
  } catch (e) {
    console.warn("Não foi possível carregar dados salvos:", e);
  }
}

// Salva os dados atuais no localStorage
function salvarNoStorage() {
  try {
    const copia = dadosBoletim.map((item) => ({
      disciplina: item.disciplina,
      tri1: item.tri1,
      tri2: item.tri2,
      tri3: item.tri3,
      faltas: item.faltas.slice(0, 3)
    }));
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(copia));
  } catch (e) {
    console.warn("Não foi possível salvar:", e);
  }
}

// Aplica edição inline: transforma células de notas e faltas em editáveis
function aplicarEdicaoInline() {
  const linhas = document.querySelectorAll("#corpo-tabela tr");

  linhas.forEach((tr, indiceDisciplina) => {
    const celulas = tr.querySelectorAll("td");
    // Colunas: 0=Disciplina, 1=Tri1, 2=Tri2, 3=Tri3, 4=Média, 5=Faltas, 6=Situação

    // Notas (1, 2, 3) — editáveis
    [1, 2, 3].forEach((coluna) => {
      prepararCelulaEditavel(celulas[coluna], indiceDisciplina, ["tri1", "tri2", "tri3"][coluna - 1], "nota");
    });

    // Faltas (5) — editáveis
    prepararCelulaEditavel(celulas[5], indiceDisciplina, "faltas", "falta");
  });
}

// Configura uma célula para ser editável
function prepararCelulaEditavel(celula, indiceDisciplina, campo, tipo) {
  if (!celula) return;
  celula.classList.add("editavel");
  celula.dataset.disciplina = indiceDisciplina;
  celula.dataset.campo = campo;
  celula.dataset.tipo = tipo;

  celula.addEventListener("click", () => {
    if (celula.classList.contains("editando")) return;
    iniciarEdicao(celula);
  });
}

// Entra em modo de edição na célula
function iniciarEdicao(celula) {
  const indiceDisciplina = parseInt(celula.dataset.disciplina, 10);
  const campo = celula.dataset.campo;
  const tipo = celula.dataset.tipo;
  const item = dadosBoletim[indiceDisciplina];

  // Valor atual para preencher o input
  let valorAtual;
  if (tipo === "nota") {
    const normalizado = normalizarNota(item[campo]);
    valorAtual = normalizado !== null ? normalizado.toString().replace(".", ",") : "";
  } else {
    // falta: soma dos 3 trimestres (edição do total vai para o 1º tri e zera os demais)
    valorAtual = item.faltas.reduce((a, b) => a + b, 0);
  }

  const valorOriginalHTML = celula.innerHTML;
  celula.classList.add("editando");
  celula.innerHTML = `<input type="text" class="campo-inline" value="${valorAtual}" inputmode="${tipo === "nota" ? "decimal" : "numeric"}" />`;

  const input = celula.querySelector("input");
  input.focus();
  input.select();

  let finalizado = false;

  function finalizar(salvar) {
    if (finalizado) return;
    finalizado = true;
    celula.classList.remove("editando");
    celula.classList.remove("erro");

    if (!salvar) {
      celula.innerHTML = valorOriginalHTML;
      return;
    }

    const texto = input.value.trim();

    if (tipo === "nota") {
      // Vazio = sem nota
      if (texto === "") {
        item[campo] = null;
        salvarNoStorage();
        renderizarBoletim();
        return;
      }
      const num = Number(texto.replace(",", "."));
      if (isNaN(num) || num < 0 || num > 10) {
        // Inválido — restaura sem alterar
        celula.classList.add("erro");
        setTimeout(() => {
          celula.classList.remove("erro");
          celula.innerHTML = valorOriginalHTML;
        }, 600);
        return;
      }
      item[campo] = num;
      salvarNoStorage();
      renderizarBoletim();
      return;
    }

    // falta
    if (texto === "") {
      celula.classList.add("erro");
      setTimeout(() => {
        celula.classList.remove("erro");
        celula.innerHTML = valorOriginalHTML;
      }, 600);
      return;
    }
    const num = Number(texto);
    if (!Number.isInteger(num) || num < 0) {
      celula.classList.add("erro");
      setTimeout(() => {
        celula.classList.remove("erro");
        celula.innerHTML = valorOriginalHTML;
      }, 600);
      return;
    }
    // O total digitado vai para o 1º trimestre; 2º e 3º ficam zerados
    item.faltas = [num, 0, 0];
    salvarNoStorage();
    renderizarBoletim();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finalizar(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      finalizar(false);
    }
  });

  input.addEventListener("blur", () => {
    // Ao sair do campo, salva o valor digitado
    finalizar(true);
  });
}

// Botão "Alterar dados" — limpa edições e volta aos dados originais
function configurarBotaoAlterar() {
  const botao = document.getElementById("btn-alterar");
  if (!botao) return;
  botao.addEventListener("click", () => {
    const confirmar = confirm(
      "Isso vai apagar todas as alterações salvas e voltar aos dados originais. Continuar?"
    );
    if (!confirmar) return;
    localStorage.removeItem(CHAVE_STORAGE);
    // Recarrega a página para restaurar o estado inicial
    location.reload();
  });
}

// ===== INICIALIZAÇÃO =====

// Carrega dados do localStorage (se houver) antes de renderizar
carregarDoStorage();

// Executa a renderização quando a página carrega
renderizarBoletim();

// Configura o botão de alterar
configurarBotaoAlterar();