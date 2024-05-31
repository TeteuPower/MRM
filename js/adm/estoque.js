// Verifica a autenticação administrativa ao carregar a página
verificarAutenticacaoAdmin();

// Função para exibir um modal
function exibirModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// Função para fechar um modal
function fecharModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Adiciona um evento para fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
  const modais = document.querySelectorAll(".modal"); // Seleciona todos os modais
  modais.forEach(modal => { // Itera sobre cada modal
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Função para atualizar a exibição do estoque
function atualizarEstoque() {
  // --- Produtos Disponíveis ---
  document.getElementById("rapeDisponivel").textContent = `Rapé disponível: ${calcularTotalRape()}Kg (${calcularPacotesRape()} Pacotes)`;
  document.getElementById("couripesDisponiveis").textContent = `Couripes disponíveis: ${couripes} Un.`;
  document.getElementById("sanangaDisponivel").textContent = `Sananga disponível: ${sananga}Kg (${sananga * 2} Pacotes)`;
  document.getElementById("artesanatosDisponiveis").textContent = `Artesanatos disponíveis: ${artesanatos} Un.`;

  // --- Matérias-Primas ---
  document.getElementById("tabacoDisponivel").textContent = `Tabaco: ${tabaco}Kg`;
  document.getElementById("cinzasDisponiveis").textContent = `Cinzas: ${calcularTotalCinzas()}Kg`;
  document.getElementById("pacotesDisponiveis").textContent = `Pacotes: ${pacotes} Un.`;
  document.getElementById("adesivosDisponiveis").textContent = `Adesivos grandes: ${adesivosGrandes} Un.`;
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