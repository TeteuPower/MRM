// js/envios-em-transito.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const enviosContainer = document.getElementById('envios-em-transito-container');
    const loadingSpinner = document.getElementById('loadingEnvios');
    const semEnviosMensagem = document.getElementById('sem-envios-mensagem');

    // --- Endpoint da API ---
    const API_EM_TRANSITO = '/api/envios/em-transito';

    // --- FUNÇÕES AUXILIARES ---

    /**
     * Calcula a diferença de dias entre uma data e hoje.
     * @param {string} dataEnvioString - A data do envio vinda do banco (formato ISO).
     * @returns {number} - O número de dias completos na estrada.
     */
    const calcularDiasNaEstrada = (dataEnvioString) => {
        const dataEnvio = new Date(dataEnvioString);
        const hoje = new Date();
        // Zera as horas para comparar apenas as datas
        dataEnvio.setHours(0, 0, 0, 0);
        hoje.setHours(0, 0, 0, 0);
        
        const diferencaEmMs = hoje.getTime() - dataEnvio.getTime();
        const dias = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));
        return dias >= 0 ? dias : 0; // Garante que não retorne número negativo
    };

    /**
     * Cria o elemento HTML para um card de envio.
     * @param {object} envio - O objeto de envio com todos os dados.
     * @returns {HTMLElement} - O elemento div do card.
     */
    const criarElementoEnvio = (envio) => {
        const div = document.createElement('div');
        div.classList.add('envio-item');

        const diasNaEstrada = calcularDiasNaEstrada(envio.data_envio);
        const dataFormatada = new Date(envio.data_envio).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const wbHtml = envio.wb === 'SEM WB'
        ? `<button class="btn-cadastrar-wb" data-envio-id="${envio.envio_id}">Cadastrar WB</button>`
        : `<span class="wb-valor">${envio.wb}</span>`;

        div.innerHTML = `
            <div class="envio-header">
                <h3>WB: ${wbHtml}</h3>
                <span class="dias-na-estrada">
                    <i class='bx bx-time-five'></i> ${diasNaEstrada} dia${diasNaEstrada !== 1 ? 's' : ''} na estrada
                </span>
            </div>
            <div class="envio-detalhes">
                <p><strong>Nota Fiscal:</strong> ${envio.nota_fiscal || 'N/A'}</p>
                <p><strong>Data do Envio:</strong> ${dataFormatada}</p>
                <p><strong>País de Destino:</strong> ${envio.pais || 'N/A'}</p>
            </div>
            <div class="cliente-contato">
                <h4>Contato do Cliente</h4>
                <p><i class='bx bxs-user'></i> ${envio.nome_cliente || 'Não informado'}</p>
                <p><i class='bx bxs-phone'></i> ${envio.telefone || 'Não informado'}</p>
                <p><i class='bx bxs-envelope'></i> ${envio.email || 'Não informado'}</p>
            </div>
        `;
        return div;
    };

    // --- FUNÇÃO PRINCIPAL ---

    /**
     * Carrega os envios em trânsito da API e os exibe na tela.
     */
    const carregarEnviosEmTransito = async () => {
        loadingSpinner.style.display = 'block';
        semEnviosMensagem.style.display = 'none';
        enviosContainer.innerHTML = ''; // Limpa antes de carregar

        try {
            const response = await fetch(API_EM_TRANSITO, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar os envios.`);
            }

            const envios = await response.json();

            if (envios.length === 0) {
                semEnviosMensagem.style.display = 'block';
            } else {
                envios.forEach(envio => {
                    const elementoEnvio = criarElementoEnvio(envio);
                    enviosContainer.appendChild(elementoEnvio);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar envios em trânsito:", error);
            semEnviosMensagem.textContent = `Erro ao carregar: ${error.message}`;
            semEnviosMensagem.style.color = 'red';
            semEnviosMensagem.style.display = 'block';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    /**
     * Atualiza a WB de um envio via API.
     * @param {number} envioId - O ID do envio a ser atualizado.
     * @param {string} novaWb - O novo código WayBill.
     */
    const atualizarWB = async (envioId, novaWb) => {
        try {
            const response = await fetch(`/api/envios/atualizar-wb`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('tokenEntregador')
                },
                body: JSON.stringify({ envio_id: envioId, nova_wb: novaWb })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Falha ao atualizar.');

            alert('WayBill atualizada com sucesso!');
            carregarEnviosEmTransito(); // Recarrega a lista para mostrar a mudança

        } catch (error) {
            console.error('Erro ao atualizar WB:', error);
            alert(`Erro: ${error.message}`);
        }
    };

    // --- EVENT LISTENERS ---
    // Usamos delegação de eventos no container principal
    enviosContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-cadastrar-wb')) {
            const envioId = event.target.dataset.envioId;
            const novaWb = prompt('Digite o novo código WayBill (exatamente 10 números):');

            if (novaWb && novaWb.trim().length === 10 && /^\d+$/.test(novaWb.trim())) {
                atualizarWB(envioId, novaWb.trim());
            } else if (novaWb !== null) { // Se não clicou em "Cancelar"
                alert('Entrada inválida. Por favor, digite exatamente 10 números.');
            }
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarHeaderEntregador(); // Função do seu 'estrutura_paginas.js'
    carregarEnviosEmTransito(); // Carrega os dados assim que a página abre

});