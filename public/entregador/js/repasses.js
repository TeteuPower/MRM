// js/repasses.js

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM - Seção Pendentes
    const pendentesContainer = document.getElementById('repasses-pendentes-container');
    const loadingPendentesSpinner = document.getElementById('loadingPendentes');
    const semPendentesMensagemEl = document.getElementById('sem-pendentes-mensagem');
    const totalPendenteContainerEl = document.getElementById('total-pendente-container');
    const valorTotalPendenteEl = document.getElementById('valor-total-pendente');

    // Elementos do DOM - Seção Histórico
    const historicoContainer = document.getElementById('historico-repasses-container');
    const loadingHistoricoSpinner = document.getElementById('loadingHistorico');
    const semHistoricoMensagemEl = document.getElementById('sem-historico-mensagem');

    // URLs da API (A SEREM DEFINIDAS QUANDO CRIARMOS AS ROTAS NO BACKEND)
    const API_REPASSES_PENDENTES = '/api/entregador/repasses/pendentes'; // Exemplo
    const API_HISTORICO_REPASSES = '/api/entregador/repasses/historico'; // Exemplo
    const API_DETALHES_LOTE_REPASSE = '/api/entregador/repasses/lote/'; // Exemplo, concatenar com ID do lote

    // --- FUNÇÕES AUXILIARES ---
    const mostrarLoading = (spinner) => spinner.style.display = 'block';
    const esconderLoading = (spinner) => spinner.style.display = 'none';
    const mostrarMensagem = (elemento, texto) => {
        elemento.textContent = texto;
        elemento.style.display = 'block';
    };
    const esconderMensagem = (elemento) => elemento.style.display = 'none';

    // Formata um número para moeda brasileira (BRL)
    const formatarMoeda = (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Formata um número para moeda em dólar (USD)
    const formatarMoedaUSD = (valor) => {
        return parseFloat(valor).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // Formata data (ex: DD/MM/YYYY)
    const formatarData = (dataISO) => {
        if (!dataISO) return 'Data não informada';
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // UTC para evitar problemas de fuso se a data do DB for UTC
    };


    // --- SEÇÃO DE REPASSES PENDENTES ---

    const criarHtmlItemPendente = (item) => {
    const div = document.createElement('div');
    div.classList.add('repasse-item', 'pendente');

    // Agora 'comissao_pendente_brl' e 'frete_brl' vêm diretamente do backend
    const comissaoEmReais = item.comissao_pendente_brl;
    const freteEmReais = item.frete_brl;
    const freteEmDolar = item.frete_usd; // Se quiser exibir o valor em USD também

    div.innerHTML = `
        <div class="repasse-info">
            <p><strong>Envio ID:</strong> #${item.envio_id}</p>
            <p><strong>Pedido Ref.:</strong> ${item.caixa_modelo || 'N/A'} (ID: ${item.pedido_original_id || 'N/A'})</p>
            <p><strong>Data do Envio:</strong> ${formatarData(item.data_envio)}</p>
        </div>
        <div class="repasse-valores">
            <p><strong>Frete:</strong> ${formatarMoedaUSD(freteEmDolar)} / ${formatarMoeda(freteEmReais)}</p>
            <p class="comissao"><strong>Sua Comissão (15%):</strong> ${formatarMoeda(comissaoEmReais)}</p>
        </div>
    `;
    return div;
};

const carregarRepassesPendentes = async () => {
    mostrarLoading(loadingPendentesSpinner);
    esconderMensagem(semPendentesMensagemEl);
    pendentesContainer.innerHTML = '';
    totalPendenteContainerEl.style.display = 'none';

    try {
        const response = await fetch(API_REPASSES_PENDENTES,
            {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha ao buscar repasses pendentes.`);
        }
        const data = await response.json();

        if (data.pendentes && data.pendentes.length > 0) {
            let totalPendenteEmReais = 0;
            data.pendentes.forEach(item => {
                pendentesContainer.appendChild(criarHtmlItemPendente(item));
                // Soma a comissão que já veio calculada em BRL do backend
                totalPendenteEmReais += parseFloat(item.comissao_pendente_brl);
            });
            valorTotalPendenteEl.textContent = formatarMoeda(totalPendenteEmReais);
            totalPendenteContainerEl.style.display = 'block';
        } else {
            mostrarMensagem(semPendentesMensagemEl, 'Você não possui comissões pendentes no momento. Continue o ótimo trabalho! 🚀');
        }
    } catch (error) {
        console.error("Erro ao carregar repasses pendentes:", error);
        mostrarMensagem(semPendentesMensagemEl, `Erro ao carregar dados: ${error.message}`);
    } finally {
        esconderLoading(loadingPendentesSpinner);
    }
};

    // --- SEÇÃO DE HISTÓRICO DE REPASSES (EXTRATO) ---

    const criarHtmlItemEnvioDoLote = (envio) => {
        // O backend deve calcular valor_comissao_envio no item do lote
        const comissao = envio.valor_comissao_envio || (parseFloat(envio.frete_original_envio) * 0.15);
        return `
            <li>
                Envio ID #${envio.envio_id} (Pedido: ${envio.caixa_modelo || 'N/A'})
                - Frete Original: ${formatarMoeda(envio.frete_original_envio)}
                - Comissão Repassada: ${formatarMoeda(comissao)}
            </li>
        `;
    };

    const criarHtmlLoteRepasse = (lote) => {
        const divLote = document.createElement('div');
        divLote.classList.add('lote-repasse-item');
        divLote.setAttribute('data-lote-id', lote.id_lote); // Para buscar detalhes se necessário

        divLote.innerHTML = `
            <div class="lote-header">
                <h4>Lote de Repasse #${lote.id_lote} <span class="data-lote">(Pago em: ${formatarData(lote.data_lote_repasse)})</span></h4>
                <button class="btn-toggle-detalhes-lote" data-lote-id="${lote.id_lote}">
                    <i class='bx bx-chevron-down'></i> Ver Detalhes
                </button>
            </div>
            <p class="lote-info"><strong>Valor Total do Lote:</strong> ${formatarMoeda(lote.valor_total_lote)}</p>
            ${lote.metodo_pagamento ? `<p class="lote-info"><strong>Método:</strong> ${lote.metodo_pagamento}</p>` : ''}
            ${lote.referencia_pagamento ? `<p class="lote-info"><strong>Referência:</strong> ${lote.referencia_pagamento}</p>` : ''}
            ${lote.observacao_lote ? `<p class="lote-info"><strong>Observação:</strong> ${lote.observacao_lote}</p>` : ''}
            <div class="lote-detalhes-envios" id="detalhes-lote-${lote.id_lote}" style="display: none;">
                <div class="loading-spinner-pequeno" style="display: none;"></div> <!-- Spinner para detalhes -->
                <ul class="lista-envios-lote">
                    <!-- Itens do lote serão carregados aqui -->
                </ul>
                <p class="mensagem-detalhes-lote" style="display:none;"></p>
            </div>
        `;
        return divLote;
    };

    const carregarDetalhesDoLote = async (loteId, detalhesDiv, ulEnvios, btnToggle) => {
        const spinnerDetalhes = detalhesDiv.querySelector('.loading-spinner-pequeno');
        const msgDetalhesEl = detalhesDiv.querySelector('.mensagem-detalhes-lote');
        mostrarLoading(spinnerDetalhes);
        esconderMensagem(msgDetalhesEl);
        ulEnvios.innerHTML = ''; // Limpa

        try {
            const response = await fetch(`${API_DETALHES_LOTE_REPASSE}${loteId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': localStorage.getItem('tokenEntregador')
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar detalhes do lote.`);
            }
            const enviosDoLote = await response.json(); // Espera-se um array de itens do lote

            if (enviosDoLote && enviosDoLote.length > 0) {
                enviosDoLote.forEach(envio => {
                    ulEnvios.innerHTML += criarHtmlItemEnvioDoLote(envio);
                });
            } else {
                mostrarMensagem(msgDetalhesEl, 'Nenhum envio detalhado encontrado para este lote.');
            }
        } catch (error) {
            console.error(`Erro ao carregar detalhes do lote ${loteId}:`, error);
            mostrarMensagem(msgDetalhesEl, `Erro ao carregar detalhes: ${error.message}`);
        } finally {
            esconderLoading(spinnerDetalhes);
            // Adiciona classe ao botão para mudar a seta e texto, se necessário
            btnToggle.classList.add('aberto');
            btnToggle.innerHTML = "<i class='bx bx-chevron-up'></i> Ocultar Detalhes";
        }
    };

    const carregarHistoricoRepasses = async () => {
        mostrarLoading(loadingHistoricoSpinner);
        esconderMensagem(semHistoricoMensagemEl);
        historicoContainer.innerHTML = ''; // Limpa

        try {
            const response = await fetch(API_HISTORICO_REPASSES,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': localStorage.getItem('tokenEntregador')
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar histórico de repasses.`);
            }
            const lotes = await response.json(); // Espera-se um array de lotes

            if (lotes && lotes.length > 0) {
                lotes.forEach(lote => {
                    historicoContainer.appendChild(criarHtmlLoteRepasse(lote));
                });
            } else {
                mostrarMensagem(semHistoricoMensagemEl, 'Ainda não há registros de repasses efetuados para você.');
            }
        } catch (error) {
            console.error("Erro ao carregar histórico de repasses:", error);
            mostrarMensagem(semHistoricoMensagemEl, `Erro ao carregar dados: ${error.message}`);
        } finally {
            esconderLoading(loadingHistoricoSpinner);
        }
    };


    // --- EVENT LISTENERS ---

    // Delegação de eventos para os botões "Ver Detalhes" dos lotes
    historicoContainer.addEventListener('click', (event) => {
        const btnToggle = event.target.closest('.btn-toggle-detalhes-lote');
        if (btnToggle) {
            const loteId = btnToggle.dataset.loteId;
            const detalhesDiv = document.getElementById(`detalhes-lote-${loteId}`);
            const ulEnvios = detalhesDiv.querySelector('.lista-envios-lote');

            if (detalhesDiv) {
                const isAberto = detalhesDiv.style.display === 'block';
                if (isAberto) {
                    detalhesDiv.style.display = 'none';
                    btnToggle.classList.remove('aberto');
                    btnToggle.innerHTML = "<i class='bx bx-chevron-down'></i> Ver Detalhes";
                } else {
                    detalhesDiv.style.display = 'block';
                    // Carrega os detalhes somente se não foram carregados ou se precisar recarregar
                    if (ulEnvios.children.length === 0 || btnToggle.dataset.recarregar === 'true') {
                        carregarDetalhesDoLote(loteId, detalhesDiv, ulEnvios, btnToggle);
                        delete btnToggle.dataset.recarregar; // Remove após carregar
                    } else {
                        // Apenas mostra o que já foi carregado e atualiza o botão
                         btnToggle.classList.add('aberto');
                         btnToggle.innerHTML = "<i class='bx bx-chevron-up'></i> Ocultar Detalhes";
                    }
                }
            }
        }
    });

    // --- INICIALIZAÇÃO ---
    const inicializarPagina = () => {
        if (typeof carregarHeaderEntregador === 'function') { // Verifica se a função do script base existe
            carregarHeaderEntregador();
        }
        carregarRepassesPendentes();
        carregarHistoricoRepasses();
    };

    inicializarPagina();

}); // Fim do DOMContentLoaded