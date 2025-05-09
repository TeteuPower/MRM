// js/entregador.js

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Elementos do DOM
    const pedidosContainer = document.getElementById('pedidos-pendentes-container');
    const loadingPedidosSpinner = document.getElementById('loadingPedidos');
    const semPedidosMensagem = document.getElementById('sem-pedidos-mensagem');
    const modalCheckbox = document.getElementById('modal-envio-checkbox');
    const modalContainer = document.getElementById('modalEnvioContainer');
    const modalPedidoIdSpan = document.getElementById('modal-pedido-id');
    const formEnvio = document.getElementById('formEnvio');
    const hiddenPedidoIdInput = document.getElementById('envio-pedido-id');
    const envioLoadingSpinner = document.getElementById('envioLoadingSpinner');
    const envioErrorMessage = document.getElementById('envio-error-message');
    const submitButton = formEnvio.querySelector('.btn-confirmar-envio');

    // Inputs do formulário do modal
    const nomeClienteInput = document.getElementById('nome_cliente');
    const telefoneClienteInput = document.getElementById('telefone_cliente');
    const emailClienteInput = document.getElementById('email_cliente');
    const paisClienteInput = document.getElementById('pais_cliente');
    const enderecoClienteInput = document.getElementById('endereco_cliente');
    const valorFreteInput = document.getElementById('valor_frete');

    // Seções e inputs de arquivo
    const notaFiscalSection = document.getElementById('notaFiscalSection');
    const notaFiscalUploadDiv = document.getElementById('notaFiscalUpload');
    const notaFiscalInput = document.getElementById('notaFiscalInput');
    const notaFiscalDownloadDiv = document.getElementById('notaFiscalDownload');
    const notaFiscalDownloadLink = document.getElementById('notaFiscalDownloadLink');

    const documentoEnvioSection = document.getElementById('documentoEnvioSection');
    const documentoEnvioUploadDiv = document.getElementById('documentoEnvioUpload');
    const documentoEnvioInput = document.getElementById('documentoEnvioInput');
    const documentoEnvioDownloadDiv = document.getElementById('documentoEnvioDownload');
    const documentoEnvioDownloadLink = document.getElementById('documentoEnvioDownloadLink');

    // IDs das APIs
    const API_PENDENTES = '/api/envios/pendentes';
    const API_DETALHES = '/api/envios/detalhes/'; // Concatenar com pedidoId
    const API_CONFIRMAR = '/api/envios/confirmar';

    // Variável para guardar o ID do pedido atual no modal
    let pedidoAtualId = null;

    // --- FUNÇÕES ---

    // Mostra/Esconde Spinners e Mensagens
    const mostrarLoading = (spinner) => spinner.style.display = 'block';
    const esconderLoading = (spinner) => spinner.style.display = 'none';
    const mostrarMensagem = (elemento, texto, tipo = 'info') => {
        elemento.textContent = texto;
        elemento.style.color = tipo === 'erro' ? 'red' : 'var(--grey)';
        elemento.style.display = 'block';
    };
    const esconderMensagem = (elemento) => elemento.style.display = 'none';

    // Cria o HTML para um item de pedido
    const criarElementoPedido = (pedido) => {
        const div = document.createElement('div');
        div.classList.add('pedido-item');
        div.setAttribute('data-pedido-id', pedido.pedido_id); // Guarda o ID aqui

        div.innerHTML = `
            <h2>Pedido #${pedido.pedido_id}</h2>
            <p><strong>Caixa:</strong> ${pedido.caixa_modelo || 'Não especificado'}</p>
            <p><strong>Peso:</strong> ${pedido.peso ? pedido.peso + ' kg' : 'Não especificado'}</p>
            <p><strong>Vendedor:</strong> ${pedido.nome_vendedor || 'Desconhecido'}</p>
            <p><strong>Cliente:</strong> ${pedido.nome_cliente || 'Desconhecido'}</p>
            <!-- Removido o botão, o div todo é clicável -->
        `;
        return div;
    };

    // Carrega os pedidos pendentes da API
    const carregarPedidosPendentes = async () => {
        mostrarLoading(loadingPedidosSpinner);
        esconderMensagem(semPedidosMensagem);
        pedidosContainer.innerHTML = ''; // Limpa container

        try {
            const response = await fetch(API_PENDENTES, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao buscar pedidos.`);
            }
            const pedidos = await response.json();

            if (pedidos.length === 0) {
                mostrarMensagem(semPedidosMensagem, 'Nenhum pedido aguardando envio no momento. Hora do cafezinho? ☕');
            } else {
                pedidos.forEach(pedido => {
                    const elementoPedido = criarElementoPedido(pedido);
                    pedidosContainer.appendChild(elementoPedido);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos pendentes:", error);
            mostrarMensagem(semPedidosMensagem, `Erro ao carregar pedidos: ${error.message}`, 'erro');
        } finally {
            esconderLoading(loadingPedidosSpinner);
        }
    };

    // Popula o modal com os detalhes do pedido
    const popularModal = (detalhes) => {
        pedidoAtualId = detalhes.pedido_id; // Guarda o ID atual
        modalPedidoIdSpan.textContent = detalhes.pedido_id;
        hiddenPedidoIdInput.value = detalhes.pedido_id;

        nomeClienteInput.value = detalhes.nome_cliente || '';
        telefoneClienteInput.value = detalhes.telefone_cliente || '';
        emailClienteInput.value = detalhes.email_cliente || '';
        paisClienteInput.value = detalhes.pais_cliente || '';
        enderecoClienteInput.value = detalhes.endereco_cliente || '';
        valorFreteInput.value = ''; // Limpa o frete, pois deve ser inserido

        // Configura seções de upload/download
        configurarUploadDownload('notaFiscal', detalhes.nota_fiscal);
        configurarUploadDownload('documentoEnvio', detalhes.documentos_envio);

        // Limpa mensagens de erro anteriores e reseta botão
        esconderMensagem(envioErrorMessage);
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar Envio';
    };

    // Configura a visibilidade dos botões de upload/download
    const configurarUploadDownload = (tipo, urlExistente) => {
        const uploadDiv = tipo === 'notaFiscal' ? notaFiscalUploadDiv : documentoEnvioUploadDiv;
        const input = tipo === 'notaFiscal' ? notaFiscalInput : documentoEnvioInput;
        const downloadDiv = tipo === 'notaFiscal' ? notaFiscalDownloadDiv : documentoEnvioDownloadDiv;
        const downloadLink = tipo === 'notaFiscal' ? notaFiscalDownloadLink : documentoEnvioDownloadLink;

        input.value = ''; // Limpa seleção anterior

        if (urlExistente) {
            uploadDiv.style.display = 'none';
            downloadDiv.style.display = 'block';
            downloadLink.href = urlExistente;
            // Guarda a URL existente para o caso do usuário não enviar novo arquivo
            input.setAttribute('data-existing-url', urlExistente);
        } else {
            uploadDiv.style.display = 'block';
            downloadDiv.style.display = 'none';
            downloadLink.href = '#';
             input.removeAttribute('data-existing-url');
        }
    };

    // Abre o modal buscando os detalhes do pedido clicado
    const abrirModalEnvio = async (pedidoId) => {
        // Idealmente, mostrar um spinner DENTRO do modal enquanto carrega
        mostrarLoading(envioLoadingSpinner); // Reutilizando o spinner do form por simplicidade
        formEnvio.reset(); // Limpa o formulário
        esconderMensagem(envioErrorMessage);

        try {
            const response = await fetch(`${API_DETALHES}${pedidoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                }
            });
            if (!response.ok) {
                 if (response.status === 404) {
                     throw new Error(`Pedido ${pedidoId} não encontrado ou já processado.`);
                 }
                throw new Error(`Erro ${response.status}: Falha ao buscar detalhes.`);
            }
            const detalhes = await response.json();

            popularModal(detalhes);
            modalCheckbox.checked = true; // Abre o modal via CSS

        } catch (error) {
            console.error(`Erro ao buscar detalhes do pedido ${pedidoId}:`, error);
            alert(`Não foi possível carregar os detalhes do pedido: ${error.message}`); // Feedback simples
            modalCheckbox.checked = false; // Garante que o modal não abra/permaneça aberto
        } finally {
            esconderLoading(envioLoadingSpinner);
        }
    };

    // Lida com o envio do formulário
    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Impede o envio padrão
        mostrarLoading(envioLoadingSpinner);
        esconderMensagem(envioErrorMessage);
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Validação básica dos campos de texto (HTML5 required ajuda, mas reforçamos)
        if (!formEnvio.checkValidity()) {
            mostrarMensagem(envioErrorMessage, 'Por favor, preencha todos os campos obrigatórios.', 'erro');
            esconderLoading(envioLoadingSpinner);
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Envio';
            formEnvio.reportValidity(); // Mostra pop-ups de validação nativos
            return;
        }

        // Validação dos arquivos
        const notaFiscalFile = notaFiscalInput.files[0];
        const notaFiscalExistente = notaFiscalDownloadDiv.style.display !== 'none';
        if (!notaFiscalFile && !notaFiscalExistente) {
            mostrarMensagem(envioErrorMessage, 'A Nota Fiscal é obrigatória (faça upload ou use a existente).', 'erro');
            esconderLoading(envioLoadingSpinner);
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Envio';
            return;
        }

        const documentoEnvioFile = documentoEnvioInput.files[0];
        const documentoEnvioExistente = documentoEnvioDownloadDiv.style.display !== 'none';
         if (!documentoEnvioFile && !documentoEnvioExistente) {
            mostrarMensagem(envioErrorMessage, 'O Documento de Envio é obrigatório (faça upload ou use o existente).', 'erro');
            esconderLoading(envioLoadingSpinner);
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Envio';
            return;
        }

        // Monta o FormData
        const formData = new FormData(formEnvio); // Pega todos os campos do form, incluindo o hidden pedido_id
        //console.log('FormData inicial:', formEnvio);

        // Adiciona os arquivos APENAS se foram selecionados novos arquivos
        if (notaFiscalFile) {
            //formData.append('nota_fiscal', notaFiscalFile);
        }
        if (documentoEnvioFile) {
             //formData.append('documentos_envio', documentoEnvioFile);
        }
        /*console.log('FormData:', formData);
        // Para inspecionar o FormData
        console.log('--- Inspecionando FormData ---');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value); // value será um File object para arquivos
        }
        console.log('----------------------------');*/
        // O backend (middleware firebase-envio-config) precisa lidar com a lógica
        // de usar a URL existente se o arquivo não estiver no FormData.

        try {
            const response = await fetch(API_CONFIRMAR, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('tokenEntregador')
                },
                body: formData // Não definir Content-Type, o browser faz isso para FormData
            });

            const result = await response.json(); // Tenta ler a resposta JSON

            if (!response.ok) {
                // Usa a mensagem de erro do backend se disponível
                throw new Error(result.error || `Erro ${response.status}: Falha ao confirmar envio.`);
            }

            // Sucesso!
            alert('Envio confirmado e pedido finalizado com sucesso!'); // Feedback
            modalCheckbox.checked = false; // Fecha o modal
            // Remove o item da lista OU recarrega a lista
            const itemRemover = pedidosContainer.querySelector(`.pedido-item[data-pedido-id="${pedidoAtualId}"]`);
            if (itemRemover) {
                itemRemover.remove();
                // Verifica se a lista ficou vazia
                if (pedidosContainer.children.length === 0) {
                     mostrarMensagem(semPedidosMensagem, 'Todos os pedidos foram enviados! Bom trabalho! 🎉');
                }
            } else {
                carregarPedidosPendentes(); // Fallback: recarrega tudo
            }

        } catch (error) {
            console.error("Erro ao confirmar envio:", error);
            mostrarMensagem(envioErrorMessage, `Erro: ${error.message}`, 'erro');
        } finally {
            esconderLoading(envioLoadingSpinner);
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Envio';
        }
    };


    // --- EVENT LISTENERS ---

    // Listener para cliques nos itens de pedido (usando delegação de eventos)
    pedidosContainer.addEventListener('click', (event) => {
        const pedidoItem = event.target.closest('.pedido-item'); // Encontra o .pedido-item clicado ou seu pai
        if (pedidoItem) {
            const pedidoId = pedidoItem.getAttribute('data-pedido-id');
            if (pedidoId) {
                abrirModalEnvio(pedidoId);
            }
        }
    });

    // Listener para o envio do formulário
    formEnvio.addEventListener('submit', handleFormSubmit);

    // --- INICIALIZAÇÃO ---
    carregarHeaderEntregador(); // Chama a função do estrutura_paginas.js (garanta que ele carregue antes)
    carregarPedidosPendentes(); // Carrega a lista inicial de pedidos

}); // Fim do DOMContentLoaded