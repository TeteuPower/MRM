// js/gestao-repasses.js

document.addEventListener('DOMContentLoaded', () => {

    // --- CONSTANTES E VARIÁVEIS DE ESTADO ---
    const API_BASE = '/api/admin/repasses'; // Assumindo um caminho base para as rotas admin
    const API_PRONTOS = `${API_BASE}/prontos`;
    const API_ESTIMADOS = `${API_BASE}/estimados`;
    const API_CRIAR_LOTE = `${API_BASE}/criar-lote`;

    let itensSelecionados = []; // Array para guardar os itens selecionados para o lote

    // --- ELEMENTOS DO DOM ---
    // Seção de Repasses Prontos
    const prontosContainer = document.getElementById('repasses-prontos-container');
    const loadingProntos = document.getElementById('loading-prontos');
    const semRepassesProntosMsg = document.getElementById('sem-repasses-prontos');
    const acoesLoteContainer = document.getElementById('acoes-lote-container');
    const valorTotalSelecionadoEl = document.getElementById('valor-total-selecionado');
    const btnCriarLote = document.getElementById('btn-criar-lote');

    // Seção de Repasses Estimados
    const estimadosContainer = document.getElementById('repasses-estimados-container');
    const loadingEstimados = document.getElementById('loading-estimados');
    const semRepassesEstimadosMsg = document.getElementById('sem-repasses-estimados');
    const valorTotalEstimadoEl = document.getElementById('valor-total-estimado');

    // Modal
    const modal = document.getElementById('modal-criar-lote');
    const closeModalBtn = document.getElementById('close-lote-modal');
    const formLote = document.getElementById('form-lote-repasse');
    const resumoLoteEl = document.getElementById('resumo-lote');
    const referenciaPagamentoInput = document.getElementById('referencia_pagamento');
    const loteLoadingSpinner = document.getElementById('lote-loading-spinner');
    const loteErrorMessage = document.getElementById('lote-error-message');
    const btnConfirmarLote = formLote.querySelector('.btn-confirmar-lote');

    // --- FUNÇÕES AUXILIARES ---
    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const mostrarLoading = (el) => el.style.display = 'block';
    const esconderLoading = (el) => el.style.display = 'none';
    const mostrarMensagem = (el, msg) => { el.textContent = msg; el.style.display = 'block'; };
    const esconderMensagem = (el) => el.style.display = 'none';

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const criarHtmlItemPronto = (item) => {
        const div = document.createElement('div');
        div.classList.add('repasse-item-admin');
        div.innerHTML = `
            <div class="col-check">
                <input type="checkbox" class="repasse-checkbox" 
                       data-envio-id="${item.envio_id}" 
                       data-pedido-id="${item.pedido_id}" 
                       data-comissao="${item.valor_comissao}">
            </div>
            <div class="col-wb">${item.wb}</div>
            <div class="col-cliente">${item.nome_cliente}</div>
            <div class="col-comissao">${formatarMoeda(item.valor_comissao)}</div>
        `;
        return div;
    };

    const criarHtmlItemEstimado = (item) => {
        const div = document.createElement('div');
        div.classList.add('repasse-item-admin');
        div.innerHTML = `
            <div class="col-check"></div> <!-- Coluna vazia para manter o alinhamento -->
            <div class="col-wb">${item.wb}</div>
            <div class="col-cliente">${item.nome_cliente}</div>
            <div class="col-comissao">${formatarMoeda(item.comissao_estimada_brl)}</div>
        `;
        return div;
    };

    // --- FUNÇÕES DE LÓGICA PRINCIPAL ---
    const carregarRepassesProntos = async () => {
        mostrarLoading(loadingProntos);
        esconderMensagem(semRepassesProntosMsg);
        prontosContainer.querySelectorAll('.repasse-item-admin:not(.header)').forEach(el => el.remove());

        try {
            const response = await fetch(API_PRONTOS, { headers: { 'Authorization': localStorage.getItem('token') } });
            if (!response.ok) throw new Error('Falha ao buscar dados.');
            const data = await response.json();

            if (data.length > 0) {
                data.forEach(item => prontosContainer.appendChild(criarHtmlItemPronto(item)));
            } else {
                mostrarMensagem(semRepassesProntosMsg, 'Nenhuma comissão pronta para pagamento no momento.');
            }
        } catch (error) {
            mostrarMensagem(semRepassesProntosMsg, `Erro: ${error.message}`);
        } finally {
            esconderLoading(loadingProntos);
        }
    };

    const carregarRepassesEstimados = async () => {
        mostrarLoading(loadingEstimados);
        esconderMensagem(semRepassesEstimadosMsg);
        estimadosContainer.querySelectorAll('.repasse-item-admin:not(.header)').forEach(el => el.remove());

        try {
            const response = await fetch(API_ESTIMADOS, { headers: { 'Authorization': localStorage.getItem('token') } });
            if (!response.ok) throw new Error('Falha ao buscar dados.');
            const data = await response.json();

            if (data.length > 0) {
                let totalEstimado = 0;
                data.forEach(item => {
                    estimadosContainer.appendChild(criarHtmlItemEstimado(item));
                    totalEstimado += item.comissao_estimada_brl;
                });
                valorTotalEstimadoEl.textContent = formatarMoeda(totalEstimado);
            } else {
                mostrarMensagem(semRepassesEstimadosMsg, 'Nenhum envio aguardando faturamento.');
                valorTotalEstimadoEl.textContent = formatarMoeda(0);
            }
        } catch (error) {
            mostrarMensagem(semRepassesEstimadosMsg, `Erro: ${error.message}`);
        } finally {
            esconderLoading(loadingEstimados);
        }
    };

    const atualizarAcoesLote = () => {
        itensSelecionados = [];
        const todosCheckboxes = prontosContainer.querySelectorAll('.repasse-checkbox');
        
        // Primeiro, vamos cuidar da parte visual (adicionar/remover a cor de fundo)
        todosCheckboxes.forEach(cb => {
            const parentRow = cb.closest('.repasse-item-admin');
            if (cb.checked) {
                parentRow.classList.add('selecionado');
                itensSelecionados.push({
                    envio_id: cb.dataset.envioId,
                    pedido_id: cb.dataset.pedidoId,
                    valor_comissao: parseFloat(cb.dataset.comissao)
                });
            } else {
                parentRow.classList.remove('selecionado');
            }
        });

        // Agora, a mesma lógica de antes para calcular o total e mostrar o botão
        if (itensSelecionados.length > 0) {
            const total = itensSelecionados.reduce((acc, item) => acc + item.valor_comissao, 0);
            valorTotalSelecionadoEl.textContent = formatarMoeda(total);
            btnCriarLote.disabled = false;
            acoesLoteContainer.style.display = 'flex';
        } else {
            btnCriarLote.disabled = true;
            acoesLoteContainer.style.display = 'none';
        }
    };

    const abrirModal = () => {
        const total = itensSelecionados.reduce((acc, item) => acc + item.valor_comissao, 0);
        const count = itensSelecionados.length;
        resumoLoteEl.innerHTML = `Você está pagando <strong>${count} comissão(ões)</strong>, totalizando <strong>${formatarMoeda(total)}</strong>.`;
        
        // Gera a referência de pagamento automaticamente
        const pedidosIds = itensSelecionados.map(item => item.pedido_id).join(',');
        referenciaPagamentoInput.value = `pedidos: ${pedidosIds}`;
        
        modal.style.display = 'flex';
    };

    const fecharModal = () => {
        formLote.reset();
        esconderMensagem(loteErrorMessage);
        modal.style.display = 'none';
    };

    const handleCriarLoteSubmit = async (e) => {
        e.preventDefault();
        mostrarLoading(loteLoadingSpinner);
        esconderMensagem(loteErrorMessage);
        btnConfirmarLote.disabled = true;

        const formData = new FormData(formLote);
        const dadosLote = {
            metodo_pagamento: formData.get('metodo_pagamento'),
            observacao_lote: formData.get('observacao_lote'),
            referencia_pagamento: formData.get('referencia_pagamento'),
            valor_total_lote: itensSelecionados.reduce((acc, item) => acc + item.valor_comissao, 0),
            itens_lote: itensSelecionados.map(({ envio_id, valor_comissao }) => ({ envio_id, valor_comissao }))
        };

        try {
            const response = await fetch(API_CRIAR_LOTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(dadosLote)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Erro desconhecido.');

            alert(result.message);
            fecharModal();
            // Recarrega tudo para atualizar a tela
            carregarRepassesProntos();
            carregarRepassesEstimados();
            atualizarAcoesLote();

        } catch (error) {
            mostrarMensagem(loteErrorMessage, `Erro: ${error.message}`);
        } finally {
            esconderLoading(loteLoadingSpinner);
            btnConfirmarLote.disabled = false;
        }
    };

    // --- EVENT LISTENERS ---
    prontosContainer.addEventListener('click', (e) => {
    // Encontra a linha que foi clicada, ignorando o cabeçalho
        const itemClicado = e.target.closest('.repasse-item-admin:not(.header)');
        
        if (itemClicado) {
            const checkbox = itemClicado.querySelector('.repasse-checkbox');
            
            // Se o clique não foi diretamente no checkbox, a gente inverte o estado dele
            if (e.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked;
            }
            
            // Agora, chamamos nossa função atualizada pra fazer todo o resto!
            atualizarAcoesLote();
        }
    });

    btnCriarLote.addEventListener('click', abrirModal);
    closeModalBtn.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal(); // Fecha se clicar fora do conteúdo
    });
    formLote.addEventListener('submit', handleCriarLoteSubmit);

    // --- INICIALIZAÇÃO ---
    // carregarHeaderAdmin(); // Chame a função que carrega seu header de admin
    carregarRepassesProntos();
    carregarRepassesEstimados();
});