// Importa a função verificarAutenticacaoAdmin do arquivo funcoes.js
import { verificarAutenticacaoAdmin } from '../../js/funcoes.js';

// Importa o array de tipos de Rapé e Cinzas do arquivo dados.js
import dados from '../../js/dados.js'; // Correção: caminho relativo correto

// ... (resto do código do arquivo estoque.js - sem alterações) ...

// Função para exibir um modal
function exibirModal(modalId) {
  document.getElementById(modalId).style.display = "block";

  // Carrega as listas de variedades nos modais ao abrir
  if (modalId === 'modalRape') {
    carregarListaVariedadesRape();
  } else if (modalId === 'modalCinzas') {
    carregarListaVariedadesCinzas();
  }
}

// Função para carregar a lista de variedades de Rapé no modal
function carregarListaVariedadesRape() {
  const listaVariedadesRape = document.getElementById('listaVariedadesRape');
  listaVariedadesRape.innerHTML = ''; // Limpa a lista antes de adicionar itens

  // Itera sobre cada tipo de Rapé e adiciona um item de lista
  dados.forEach(tipo => {
    const listItem = document.createElement('li');
    listItem.textContent = tipo;
    listaVariedadesRape.appendChild(listItem);
  });
}

// Função para carregar a lista de variedades de Cinzas no modal
function carregarListaVariedadesCinzas() {
  const listaVariedadesCinzas = document.getElementById('listaVariedadesCinzas');
  listaVariedadesCinzas.innerHTML = ''; 

  tiposCinzas.forEach(tipo => {
    const listItem = document.createElement('li');
    listItem.textContent = tipo;
    listaVariedadesCinzas.appendChild(listItem);
  });
}

// Função para fechar um modal
function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Adiciona um evento para fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
  const modais = document.querySelectorAll(".modal");
  modais.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Função para calcular a quantidade total de Rapé
function calcularTotalRape() {
  let totalRape = 0;

  // Acessando a variável 'produtos' dentro do objeto 'dados':
  for (const tipo in dados.produtos[0].quantidade) {  
    totalRape += dados.produtos[0].quantidade[tipo];
  }
  return totalRape;
}

// Função para calcular o número de pacotes de Rapé
function calcularPacotesRape() {
  return calcularTotalRape() * 2; // Cada kg de rapé equivale a 2 pacotes
}

// Função para calcular a quantidade total de Cinzas
function calcularTotalCinzas() {
  let totalCinzas = 0;
  for (const tipo in dados.materiasPrimas[1].quantidade) {
    totalCinzas += dados.materiasPrimas[1].quantidade[tipo];
  }
  return totalCinzas;
}

// Função para atualizar a exibição do estoque
function atualizarEstoque() {
  // --- Produtos Disponíveis ---
  document.getElementById("rapeDisponivel").textContent = `Rapé disponível: ${calcularTotalRape()}Kg (${calcularPacotesRape()} Pacotes)`;
  
  // Acessando as variáveis dentro do objeto 'dados':
  document.getElementById("couripesDisponiveis").textContent = `Couripes disponíveis: ${dados.produtos[1].quantidade} ${dados.produtos[1].unidade}`;
  document.getElementById("sanangaDisponivel").textContent = `Sananga disponível: ${dados.produtos[2].quantidade} ${dados.produtos[2].unidade} (${dados.produtos[2].quantidade * 2} Pacotes)`;
  document.getElementById("artesanatosDisponiveis").textContent = `Artesanatos disponíveis: ${dados.produtos[3].quantidade} ${dados.produtos[3].unidade}`;

  // --- Matérias-Primas ---
  document.getElementById("tabacoDisponivel").textContent = `Tabaco: ${dados.materiasPrimas[0].quantidade}${dados.materiasPrimas[0].unidade}`;
  document.getElementById("cinzasDisponiveis").textContent = `Cinzas: ${calcularTotalCinzas()}Kg`;
  document.getElementById("pacotesDisponiveis").textContent = `Pacotes: ${dados.materiasPrimas[2].quantidade} ${dados.materiasPrimas[2].unidade}`;
  document.getElementById("adesivosDisponiveis").textContent = `Adesivos grandes: ${dados.materiasPrimas[3].quantidade} ${dados.materiasPrimas[3].unidade}`;
}

// Chamada inicial para carregar o estoque
atualizarEstoque();

// Função para exibir o modal de variedades de Rapé
function exibirModalRape() {
  exibirModal('modalRape');
}

// Função para exibir o modal de variedades de Cinzas
function exibirModalCinzas() {
  exibirModal('modalCinzas');
}

// Botão "Exibir variedades" de Rapé
const botaoExibirModalRape = document.getElementById('botaoExibirModalRape');
botaoExibirModalRape.addEventListener('click', exibirModalRape);

// Botão "Exibir variedades" de Cinzas
const botaoExibirModalCinzas = document.getElementById('botaoExibirModalCinzas');
botaoExibirModalCinzas.addEventListener('click', exibirModalCinzas);

// Botão de fechar do modal de Rapé
const fecharModalRape = document.getElementById('fecharModalRape');
fecharModalRape.addEventListener('click', () => fecharModal('modalRape'));

// Botão de fechar do modal de Cinzas
const fecharModalCinzas = document.getElementById('fecharModalCinzas');
fecharModalCinzas.addEventListener('click', () => fecharModal('modalCinzas'));