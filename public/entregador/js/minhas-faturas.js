// js/minhas-faturas.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const faturasContainer = document.getElementById('faturas-container');
    const loadingSpinner = document.getElementById('loadingFaturas');
    const semFaturasMensagem = document.getElementById('sem-faturas-mensagem');
    const paginacaoContainer = document.getElementById('paginacao-container');

    // --- Endpoint da API ---
    const API_LISTAR = '/api/dhl-faturas/listar';

    /**
     * Cria o elemento HTML para um card de fatura.
     * @param {object} fatura - O objeto da fatura com todos os dados.
     * @returns {HTMLElement} - O elemento div do card.
     */
    const criarElementoFatura = (fatura) => {
        const div = document.createElement('div');
        div.classList.add('fatura-item');

        const statusClass = fatura.paga ? 'status-paga' : 'status-pendente';
        const statusText = fatura.paga ? 'Paga' : 'Pendente';

        const dataVencimento = new Date(fatura.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const valorFormatado = parseFloat(fatura.valor_total).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Transforma a string de WBs em tags HTML
        const wbsHtml = (fatura.waybills || '')
            .split(', ')
            .map(wb => `<span class="wb-tag">${wb}</span>`)
            .join('');

        div.innerHTML = `
            <div class="fatura-header">
                <h3>Fatura: <span class="codigo-fatura">${fatura.codigo_fatura}</span></h3>
                <span class="status-tag ${statusClass}">${statusText}</span>
            </div>
            <div class="fatura-detalhes">
                <p><strong>Valor Total:</strong> ${valorFormatado}</p>
                <p><strong>Vencimento:</strong> ${dataVencimento}</p>
            </div>
            <div class="fatura-wbs">
                <h4>WayBills Incluídas:</h4>
                <div class="wb-lista">
                    ${wbsHtml}
                </div>
            </div>
        `;
        return div;
    };

    /**
     * Cria os botões de controle da paginação.
     * @param {number} totalPages - O número total de páginas.
     * @param {number} currentPage - A página atual.
     */
    const criarPaginacao = (totalPages, currentPage) => {
        paginacaoContainer.innerHTML = ''; // Limpa controles antigos
        if (totalPages <= 1) return; // Não mostra paginação se só tiver 1 página

        // Botão "Anterior"
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo; Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.dataset.page = currentPage - 1;
        paginacaoContainer.appendChild(prevButton);

        // Botões de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.dataset.page = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            paginacaoContainer.appendChild(pageButton);
        }

        // Botão "Próximo"
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Próximo &raquo;';
        nextButton.disabled = currentPage === totalPages;
        nextButton.dataset.page = currentPage + 1;
        paginacaoContainer.appendChild(nextButton);
    };

    /**
     * Carrega as faturas de uma página específica da API.
     * @param {number} page - O número da página a ser carregada.
     */
    const carregarFaturas = async (page = 1) => {
        loadingSpinner.style.display = 'block';
        semFaturasMensagem.style.display = 'none';
        faturasContainer.innerHTML = ''; // Limpa a lista
        paginacaoContainer.innerHTML = ''; // Limpa a paginação

        try {
            const response = await fetch(`${API_LISTAR}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            });

            if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao buscar faturas.`);

            const data = await response.json();

            if (data.faturas.length === 0) {
                semFaturasMensagem.style.display = 'block';
            } else {
                data.faturas.forEach(fatura => {
                    const elementoFatura = criarElementoFatura(fatura);
                    faturasContainer.appendChild(elementoFatura);
                });
                criarPaginacao(data.totalPages, data.currentPage);
            }
        } catch (error) {
            console.error("Erro ao carregar faturas:", error);
            semFaturasMensagem.textContent = `Erro ao carregar: ${error.message}`;
            semFaturasMensagem.style.color = 'red';
            semFaturasMensagem.style.display = 'block';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    // --- EVENT LISTENER para a Paginação ---
    paginacaoContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON' && !target.disabled) {
            const page = parseInt(target.dataset.page);
            carregarFaturas(page);
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarHeaderEntregador();
    carregarFaturas(1); // Carrega a primeira página ao iniciar

});