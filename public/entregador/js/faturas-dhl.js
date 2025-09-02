// js/faturas-dhl.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const form = document.getElementById('form-nova-fatura');
    const enviosContainer = document.getElementById('envios-pendentes-container');
    const loadingEnviosSpinner = document.getElementById('loadingEnvios');
    const semEnviosMensagem = document.getElementById('sem-envios-mensagem');
    const submitButton = form.querySelector('.btn-criar-fatura');
    const criacaoLoadingSpinner = document.getElementById('criacao-loading-spinner');
    const criacaoErrorMessage = document.getElementById('criacao-error-message');
    const valoresBrlSecao = document.getElementById('valores-brl-secao');
    const valoresBrlContainer = document.getElementById('valores-brl-container');
    const somaValorFatura = document.getElementById('soma-valor-fatura');
    const somaValorItens = document.getElementById('soma-valor-itens');
    const somaStatus = document.getElementById('soma-status');
    const valorTotalInput = document.getElementById('valor_total');

    // --- Endpoints da API ---
    // Atenção: O caminho base '/api/dhl-faturas' já está no seu app.js, então aqui usamos os sub-caminhos.
    const API_PENDENTES = '/api/dhl-faturas/pendentes';
    const API_CRIAR = '/api/dhl-faturas/criar-fatura';

    // --- FUNÇÕES ---

    /**
     * Cria o HTML para um item de envio selecionável (checkbox).
     * @param {object} envio - O objeto do envio com envio_id e wb.
     * @returns {HTMLElement} - O elemento div do item.
     */
    const criarElementoEnvio = (envio) => {
        const div = document.createElement('div');
        div.classList.add('envio-item-selecao');

        div.innerHTML = `
            <input type="checkbox" id="envio-${envio.envio_id}" name="envios_selecionados" value="${envio.envio_id}">
            <label for="envio-${envio.envio_id}">${envio.wb}</label>
        `;
        return div;
    };

    /**
     * Carrega os envios pendentes de fatura da API e os exibe na tela.
     */
    const carregarEnviosPendentes = async () => {
        loadingEnviosSpinner.style.display = 'block';
        semEnviosMensagem.style.display = 'none';
        enviosContainer.innerHTML = ''; // Limpa a lista antes de carregar

        try {
            const response = await fetch(API_PENDENTES, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar envios pendentes.`);
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
            console.error("Erro ao carregar envios pendentes:", error);
            semEnviosMensagem.textContent = `Erro ao carregar: ${error.message}`;
            semEnviosMensagem.style.color = 'red';
            semEnviosMensagem.style.display = 'block';
        } finally {
            loadingEnviosSpinner.style.display = 'none';
        }
    };

    /**
     * Renderiza os inputs para os valores em BRL baseados nos checkboxes selecionados.
     */
    const renderizarInputsBRL = () => {
        const checkboxesSelecionados = enviosContainer.querySelectorAll('input[type="checkbox"]:checked');
        
        if (checkboxesSelecionados.length > 0) {
            valoresBrlSecao.style.display = 'block';
            let htmlInputs = '';
            checkboxesSelecionados.forEach(checkbox => {
                const envioId = checkbox.value;
                const wbLabel = checkbox.nextElementSibling.textContent; // Pega o texto da WB
                htmlInputs += `
                    <div class="input-group-brl">
                        <label for="brl-envio-${envioId}">${wbLabel}:</label>
                        <input type="number" step="0.01" id="brl-envio-${envioId}" class="valor-brl-input" data-envio-id="${envioId}" placeholder="0.00" required>
                    </div>
                `;
            });
            valoresBrlContainer.innerHTML = htmlInputs;
        } else {
            valoresBrlSecao.style.display = 'none';
            valoresBrlContainer.innerHTML = '';
        }
        atualizarSoma(); // Atualiza a soma sempre que a lista de inputs muda
    };

    /**
     * Calcula a soma dos valores BRL, compara com o total da fatura e atualiza a UI.
     */
    const atualizarSoma = () => {
        const totalFatura = parseFloat(valorTotalInput.value) || 0;
        let somaItens = 0;
        const inputsBrl = valoresBrlContainer.querySelectorAll('.valor-brl-input');

        inputsBrl.forEach(input => {
            somaItens += parseFloat(input.value) || 0;
        });

        // Formata para exibição
        const formatoMoeda = { style: 'currency', currency: 'BRL' };
        somaValorFatura.textContent = totalFatura.toLocaleString('pt-BR', formatoMoeda);
        somaValorItens.textContent = somaItens.toLocaleString('pt-BR', formatoMoeda);

        // Validação e feedback visual
        somaStatus.classList.remove('valido', 'invalido');
        if (somaItens === 0 && totalFatura === 0) {
            somaStatus.textContent = 'Aguardando valores...';
        } else if (Math.abs(totalFatura - somaItens) < 0.01) { // Tolerância para floats
            somaStatus.textContent = '✅ Soma correta!';
            somaStatus.classList.add('valido');
        } else {
            somaStatus.textContent = '❌ A soma não bate com o total da fatura!';
            somaStatus.classList.add('invalido');
        }
    };

    /**
     * Lida com o envio do formulário de criação de fatura.
     * @param {Event} event - O evento de submit do formulário.
     */
    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Feedback visual inicial
        submitButton.disabled = true;
        submitButton.textContent = 'Criando...';
        criacaoLoadingSpinner.style.display = 'block';
        criacaoErrorMessage.style.display = 'none';

        // Coleta dos dados do formulário
        const formData = new FormData(form);
        const codigo_fatura = formData.get('codigo_fatura');
        const valor_total = formData.get('valor_total');
        const data_vencimento = formData.get('data_vencimento');
        const envios_selecionados = formData.getAll('envios_selecionados'); // Pega todos os checkboxes marcados

        // --- Validação Front-end ---
        if (!codigo_fatura || !valor_total || !data_vencimento) {
            criacaoErrorMessage.textContent = 'Por favor, preencha todos os dados da fatura.';
            criacaoErrorMessage.style.display = 'block';
            // Reverte o feedback visual
            submitButton.disabled = false;
            submitButton.textContent = 'Criar Fatura';
            criacaoLoadingSpinner.style.display = 'none';
            return;
        }
        if (envios_selecionados.length === 0) {
            criacaoErrorMessage.textContent = 'Você deve selecionar pelo menos um envio (WB) para a fatura.';
            criacaoErrorMessage.style.display = 'block';
            // Reverte o feedback visual
            submitButton.disabled = false;
            submitButton.textContent = 'Criar Fatura';
            criacaoLoadingSpinner.style.display = 'none';
            return;
        }

        // --- NOVA VALIDAÇÃO DA SOMA ---
        if (somaStatus.classList.contains('invalido') || valoresBrlContainer.querySelectorAll('input').length > 0 && somaStatus.textContent === 'Aguardando valores...') {
            criacaoErrorMessage.textContent = 'A soma dos valores em Reais não corresponde ao total da fatura.';
            criacaoErrorMessage.style.display = 'block';
            // Reverte o feedback visual
            submitButton.disabled = false;
            submitButton.textContent = 'Criar Fatura';
            criacaoLoadingSpinner.style.display = 'none';
            return;
        }

        // --- NOVA COLETA DE DADOS BRL ---
        const valores_brl = [];
        valoresBrlContainer.querySelectorAll('.valor-brl-input').forEach(input => {
            valores_brl.push({
                envio_id: input.dataset.envioId,
                valor_brl: parseFloat(input.value)
            });
        });

        // Monta o corpo da requisição
        const dadosFatura = {
            codigo_fatura,
            valor_total,
            data_vencimento,
            envios_selecionados, // Já é um array de IDs
            valores_brl
        };

        try {
            const response = await fetch(API_CRIAR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('tokenEntregador')
                },
                body: JSON.stringify(dadosFatura)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Erro ${response.status}: Falha ao criar a fatura.`);
            }

            // Sucesso!
            alert('Fatura criada com sucesso!');
            form.reset(); // Limpa o formulário
            carregarEnviosPendentes(); // Recarrega a lista de envios pendentes

        } catch (error) {
            console.error("Erro ao criar fatura:", error);
            criacaoErrorMessage.textContent = `Erro: ${error.message}`;
            criacaoErrorMessage.style.display = 'block';
        } finally {
            // Reverte o feedback visual em qualquer caso (sucesso ou erro)
            submitButton.disabled = false;
            submitButton.textContent = 'Criar Fatura';
            criacaoLoadingSpinner.style.display = 'none';
        }
    };

    // --- EVENT LISTENERS ---

    // Listener para o envio do formulário
    form.addEventListener('submit', handleFormSubmit);

    // Listener para o efeito visual de seleção dos itens
    enviosContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const itemContainer = event.target.closest('.envio-item-selecao');
        if (itemContainer) {
            itemContainer.classList.toggle('selecionado', event.target.checked);
        }
        renderizarInputsBRL(); // Chama a nova função para atualizar a seção de valores
    }
    });

    // Listener para o input do valor total da fatura
    valorTotalInput.addEventListener('input', atualizarSoma);

    // Listener para os inputs de BRL (usando delegação de eventos)
    valoresBrlContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('valor-brl-input')) {
            atualizarSoma();
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarHeaderEntregador(); // Função do seu 'estrutura_paginas.js'
    carregarEnviosPendentes(); // Carrega a lista inicial de envios

});