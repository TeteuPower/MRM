// divisao_lucros.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                exibirRepassesPendentesProducao();
                exibirRepassesPendentesAdministradores();
                exibirRepassesPendentesEmpresa();
                //exibirUltimosRepassesFeitos();
                //popularSelectVendedoresRepasse();
                //popularSelectDestinatariosRepasse();
                // Adiciona event listeners aos botões "Fazer Repasses"
                document.getElementById('btn-fazer-repasses-administradores').addEventListener('click', () => {
                    confirmarRepasses('administradores');
                });
                document.getElementById('btn-fazer-repasses-empresa').addEventListener('click', () => {
                    confirmarRepasses('empresa');
                });

                // Atualiza o resumo das distribuições
                atualizarResumoDistribuicoes();
            }
        });

    //document.getElementById('btn-registrar-repasse').addEventListener('click', registrarRepasse);
});

async function exibirRepassesPendentesProducao() {
    const listaRepasses = document.getElementById('lista-repasses-producao');
    listaRepasses.innerHTML = '';

    fetch('/api/divisao-lucros/repasses-producao', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar repasses pendentes para produção.');
        }
        return response.json();
    })
    .then(repasses => {
        repasses.forEach(repasse => {
            //console.log(repasse)
            //const lucroProducao = (parseInt(repasse.lucro_venda).toFixed(2) / 10);
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = repasse.id;
            repasse.lucro_producao = (parseInt(repasse.lucro_venda).toFixed(2) / 10);
            //repasse.lucro_producao_convertido = converterDolarParaReal(repasse.lucro_producao);
            checkbox.addEventListener('change', () => {
                atualizarTotalSelecionado('producao', repasses);
            });
            listItem.appendChild(checkbox);
            
            const label = document.createElement('label');
            label.textContent = `Do ${repasse.vendedor} para o ${repasse.produtor} o valor de ${repasse.lucro_producao} ${repasse.moeda === 'real' ? 'REAIS' : 'DÓLARES'}, referente ao pedido nº ${repasse.id}`;
            listItem.appendChild(label);
            listaRepasses.appendChild(listItem);
        });
            // Adiciona evento ao botão para enviar apenas os repasses selecionados
            document.getElementById('btn-fazer-repasses-producao').addEventListener('click', () => {
            const checkboxes = listaRepasses.querySelectorAll('input[type="checkbox"]:checked');
            const repassesSelecionados = Array.from(checkboxes).map(checkbox => {
                const repasseId = parseInt(checkbox.value);
                return repasses.find(repasse => repasse.id === repasseId);
            });
            confirmarRepasses('producao', repassesSelecionados);
        });
        // Exibe o botão "Fazer Repasses" se houver repasses pendentes
        const btnFazerRepasses = document.getElementById('btn-fazer-repasses-producao');
        const totalSelecionadoConvertido = document.getElementById('total-selecionado-producao-convertido');
        if (repasses.length > 0) {
            btnFazerRepasses.style.display = 'block';
            totalSelecionadoConvertido.style.display = 'block';
        } else {
            btnFazerRepasses.style.display = 'none';
            totalSelecionadoConvertido.style.display = 'none';
        }
    })
    .catch(error => {
        alert('Erro ao buscar repasses pendentes para produção.');
        console.error(error);
    });
}

function exibirRepassesPendentesAdministradores() {
    const listaRepasses = document.getElementById('lista-repasses-administradores');
    listaRepasses.innerHTML = '';

    fetch('/api/divisao-lucros/repasses-administradores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar repasses pendentes entre administradores.');
        }
        return response.json();
    })
    .then(repasses => {
        repasses.forEach(repasse => {
            //console.log(repasse)
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = repasse.id;
            repasse.lucro_vendedor = (parseInt(repasse.lucro_venda).toFixed(2) * 45/100)
            checkbox.addEventListener('change', () => {
                atualizarTotalSelecionado('administradores', repasses);
            });
            listItem.appendChild(checkbox);

            const label = document.createElement('label');
            label.textContent = `Do ${repasse.vendedor} ${repasse.vendedor_id === 2 ? 'Para o Rafael' : 'Para a Maithê'} o valor de ${repasse.lucro_vendedor} ${repasse.moeda === 'real' ? 'REAIS' : 'DÓLARES'}, referente ao pedido nº ${repasse.id}`;
            listItem.appendChild(label);
            listaRepasses.appendChild(listItem);
        });
        // Exibe o botão "Fazer Repasses" se houver repasses pendentes
        const btnFazerRepasses = document.getElementById('btn-fazer-repasses-administradores');
        //const totalSelecionadoReais = document.getElementById('total-selecionado-administradores-real');
        //const totalSelecionadoDolar = document.getElementById('total-selecionado-administradores-dolar');
        const totalSelecionadoConvertido = document.getElementById('total-selecionado-administradores-convertido');
        if (repasses.length > 0) {
            btnFazerRepasses.style.display = 'block';
            //totalSelecionadoReais.style.display = 'block';
            //totalSelecionadoDolar.style.display = 'block';
            totalSelecionadoConvertido.style.display = 'block';
        } else {
            btnFazerRepasses.style.display = 'none';
            //totalSelecionadoReais.style.display = 'none';
            //totalSelecionadoDolar.style.display = 'none';
            totalSelecionadoConvertido.style.display = 'none';
        }
    })
    .catch(error => {
        alert('Erro ao buscar repasses pendentes entre administradores.');
        console.error(error);
    });
}

//Função que exibe os repasses pendentes para a empresa
function exibirRepassesPendentesEmpresa() {
    const listaRepasses = document.getElementById('lista-repasses-empresa');
    listaRepasses.innerHTML = '';

    fetch('/api/divisao-lucros/repasses-empresa', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar repasses pendentes para empresa.');
        }
        return response.json();
    })
    .then(repasses => {
        repasses.forEach(repasse => {
            //console.log(repasse)
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = repasse.id;
            checkbox.addEventListener('change', () => {
                atualizarTotalSelecionado('empresa', repasses);
            });
            listItem.appendChild(checkbox);

            const label = document.createElement('label');
            label.textContent = `Do ${repasse.vendedor} para a empresa o valor de ${parseInt(repasse.valor_insumos) + parseInt(repasse.valor_frete)} ${repasse.moeda === 'real' ? 'REAIS' : 'DÓLARES'}, referente ao pedido nº ${repasse.id}`;
            listItem.appendChild(label);
            listaRepasses.appendChild(listItem);
        });
        // Exibe o botão "Fazer Repasses" se houver repasses pendentes
        const btnFazerRepasses = document.getElementById('btn-fazer-repasses-empresa');
        const totalSelecionadoConvertido = document.getElementById('total-selecionado-empresa-convertido');
        if (repasses.length > 0) {
            btnFazerRepasses.style.display = 'block';
            totalSelecionadoConvertido.style.display = 'block';
        } else {
            btnFazerRepasses.style.display = 'none';
            totalSelecionadoConvertido.style.display = 'none';
        }
    })
    .catch(error => {
        alert('Erro ao buscar repasses pendentes entre administradores.');
        console.error(error);
    });
    
}

function exibirUltimosRepassesFeitos() {
    const listaRepasses = document.getElementById('lista-repasses-feitos');
    listaRepasses.innerHTML = '';

    fetch('/api/divisao-lucros/repasses-feitos', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar últimos repasses feitos.');
        }
        return response.json();
    })
    .then(repasses => {
        repasses.forEach(repasse => {
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${repasse.pedido_id} - Destinatário: ${repasse.destinatario} - Valor: ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${repasse.valor.toFixed(2)} - Vendedor: ${repasse.vendedor}`;
            listaRepasses.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar últimos repasses feitos.');
        console.error(error);
    });
}

function popularSelectVendedoresRepasse() {
    const selectVendedor = document.getElementById('vendedor-repasse');
    selectVendedor.innerHTML = '<option value="">Selecione o Vendedor</option>';

    fetch('/api/divisao-lucros/vendedores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar vendedores.');
        }
        return response.json();
    })
    .then(vendedores => {
        vendedores.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor.id;
            option.textContent = vendedor.nome;
            selectVendedor.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar vendedores.');
        console.error(error);
    });
}

function popularSelectDestinatariosRepasse() {
    const selectDestinatario = document.getElementById('repasse-para');
    selectDestinatario.innerHTML = '<option value="">Selecione o Destinatário</option>';

    // Busca produtores
    fetch('/api/divisao-lucros/produtores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar produtores.');
        }
        return response.json();
    })
    .then(produtores => {
        produtores.forEach(produtor => {
            const option = document.createElement('option');
            option.value = produtor.id;
            option.textContent = `${produtor.nome} (Produtor)`;
            selectDestinatario.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar produtores.');
        console.error(error);
    });

    // Busca administradores
    fetch('/api/divisao-lucros/administradores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar administradores.');
        }
        return response.json();
    })
    .then(administradores => {
        administradores.forEach(administrador => {
            const option = document.createElement('option');
            option.value = administrador.id;
            option.textContent = `${administrador.nome} (Administrador)`;
            selectDestinatario.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar administradores.');
        console.error(error);
    });
}

let totalRepassesProducaoReais = 0;
let totalRepassesProducaoDolar = 0;
let totalRepassesProducaoConvertido = 0;
let totalRepassesVendedoresReais = 0;
let totalRepassesVendedoresDolar = 0;
let totalRepassesVendedoresConvertido = 0;
let totalRepassesEmpresaReais = 0;
let totalRepassesEmpresaDolar = 0;
let totalRepassesEmpresaConvertido = 0;
async function atualizarTotalSelecionado(area, vendas) { // Adiciona vendas como argumento
    const checkboxes = document.querySelectorAll(`#lista-repasses-${area} input[type="checkbox"]:checked`);
    let totalRepassesReais = 0; // Variável local para armazenar o total selecionado
    let totalRepassesDolar = 0;
        if (area === "producao") {
            checkboxes.forEach(checkbox => {
                //console.log(vendas)
                const pedidoId = parseInt(checkbox.value);
                const pedido = vendas.find(v => v.id === pedidoId); // Usa vendas como argumento
                if (pedido.moeda === "dolar") {
                    totalRepassesDolar += parseFloat(pedido.lucro_producao);
                }
                if (pedido.moeda === "real") {
                    totalRepassesReais += parseFloat(pedido.lucro_producao);
                }
            });
            totalRepassesProducaoReais = totalRepassesReais; // Atualiza a variável global com o total calculado
            totalRepassesProducaoDolar = totalRepassesDolar; // Atualiza a variável global com o total calculado
            totalRepassesProducaoConvertido = totalRepassesProducaoReais + await converterDolarParaReal(totalRepassesProducaoDolar);
            //console.log(totalRepassesProducaoConvertido);

            //document.getElementById(`total-selecionado-${area}-real`).textContent = `Total Selecionado: REAIS R$ ${totalRepassesProducaoReais.toFixed(2)}`;
            //document.getElementById(`total-selecionado-${area}-dolar`).textContent = `Total Selecionado: DÓLAR U$ ${totalRepassesProducaoDolar.toFixed(2)}`;
            document.getElementById(`total-selecionado-${area}-convertido`).textContent = `Soma total convertida para REAIS: R$ ${totalRepassesProducaoConvertido.toFixed(2)}`;
        }
        if (area === "administradores") {
            checkboxes.forEach(checkbox => {
                //console.log(vendas)
                const pedidoId = parseInt(checkbox.value);
                const pedido = vendas.find(v => v.id === pedidoId); // Usa vendas como argumento
                if (pedido.moeda === "dolar") {
                    totalRepassesDolar += parseFloat(pedido.lucro_vendedor);
                }
                if (pedido.moeda === "real") {
                    totalRepassesReais += parseFloat(pedido.lucro_vendedor);
                }
            });
            totalRepassesVendedoresReais = totalRepassesReais; // Atualiza a variável global com o total calculado
            totalRepassesVendedoresDolar = totalRepassesDolar; // Atualiza a variável global com o total calculado
            totalRepassesVendedoresConvertido = totalRepassesVendedoresReais + await converterDolarParaReal(totalRepassesVendedoresDolar);

            document.getElementById(`total-selecionado-${area}-convertido`).textContent = `Soma total convertida para REAIS: R$ ${totalRepassesVendedoresConvertido.toFixed(2)}`;
        }
        if (area === "empresa") {
            checkboxes.forEach(checkbox => {
                //console.log(vendas)
                const pedidoId = parseInt(checkbox.value);
                const pedido = vendas.find(v => v.id === pedidoId); // Usa vendas como argumento
                if (pedido.moeda === "dolar") {
                    totalRepassesDolar += parseFloat(parseInt(pedido.valor_insumos) + parseInt(pedido.valor_frete));
                }
                if (pedido.moeda === "real") {
                    totalRepassesReais += parseFloat(parseInt(pedido.valor_insumos) + parseInt(pedido.valor_frete));
                }
            });
            totalRepassesEmpresaReais = totalRepassesReais; // Atualiza a variável global com o total calculado
            totalRepassesEmpresaDolar = totalRepassesDolar; // Atualiza a variável global com o total calculado
            totalRepassesEmpresaConvertido = totalRepassesEmpresaReais + await converterDolarParaReal(totalRepassesEmpresaDolar);

            //document.getElementById(`total-selecionado-${area}-real`).textContent = `Total Selecionado: REAIS R$ ${totalRepassesVendedoresReais.toFixed(2)}`;
            //document.getElementById(`total-selecionado-${area}-dolar`).textContent = `Total Selecionado: DÓLAR U$ ${totalRepassesVendedoresDolar.toFixed(2)}`;
            document.getElementById(`total-selecionado-${area}-convertido`).textContent = `Soma total convertida para REAIS: R$ ${totalRepassesEmpresaConvertido.toFixed(2)}`;
        }
}

async function confirmarRepasses(area, repasses) {
    const checkboxes = document.querySelectorAll(`#lista-repasses-${area} input[type="checkbox"]:checked`);
    
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos um repasse para confirmar.');
        return;
    }
    //const nomeVendedor = vendedorResponsavel
    //const destinatario = area === 'producao' ? 'o Produtor' : 'o Administrador';

    if (confirm(`Confirma que está fazendo um repasse de R$ ${totalRepassesProducaoConvertido.toFixed(2)} REAIS para o MATHEUS?`)) {
        try {
            // Mapeia os repasses para um array de promises
            const promises = repasses.map(async (repasse) => {
                //console.log(repasse);
                let comissaoConvertida = await converterDolarParaReal(repasse.lucro_producao);
                const pedidoId = parseInt(repasse.id);
                const produtorId = parseInt(repasse.produtor_id);
                const vendedorId = parseInt(repasse.vendedor_id);
                //const valor = parseInt(repasse.lucro_producao_convertido);
                const moeda = 'real';
                const administradorId = parseInt(localStorage.getItem('administrador'));
                //console.log(pedidoId, produtorId, vendedorId, comissaoConvertida, administradorId, moeda);
                // Registra o repasse na API
                const response = await fetch('/api/divisao-lucros/repasses-producao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        pedidoId: pedidoId,
                        produtorId: produtorId,
                        vendedorId: vendedorId,
                        valor: comissaoConvertida,
                        administradorId: administradorId,
                        moeda: moeda,
                        finalizaComissao: true
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao registrar repasse.');
                }
                return response.json();
            });

            // Aguarda todas as promises serem resolvidas
            await Promise.all(promises);

            alert('Repasses registrados com sucesso!');
            exibirRepassesPendentesProducao();
            exibirRepassesPendentesAdministradores();
            //exibirUltimosRepassesFeitos();
        } catch (error) {
            alert('Erro ao registrar repasses.');
            console.error(error);
        }
    }
}

function atualizarResumoDistribuicoes() {
    const administradorId = parseInt(localStorage.getItem('administrador'));

    // Busca o resumo das distribuições
    fetch(`/api/financeiro/${administradorId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo financeiro.');
        }
        return response.json();
    })
    .then(resumo => {
        // Atualiza os valores no HTML
        document.getElementById('saldo-total-rafael-matheus').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('vendas-totais-rafael-matheus').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('lucro-real-rafael').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('comissoes-matheus').textContent = `R$ ${parseInt(resumo.repasses_recebidos_reais).toFixed(2)}`;

        document.getElementById('saldo-total-maithe-matheus').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('vendas-totais-maithe-matheus').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('lucro-real-maithe').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('comissoes-matheus').textContent = `R$ ${parseInt(resumo.repasses_recebidos_reais).toFixed(2)}`;

        document.getElementById('saldo-total-rafael-maithe').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
    })
    .catch(error => {
        alert('Erro ao buscar resumo financeiro.');
        console.error(error);
    });
}

function registrarRepasse(event) {
    event.preventDefault();

    const pedidoId = parseInt(document.getElementById('repasse-para').value);
    const destinatarioId = parseInt(document.getElementById('repasse-para').value);
    const vendedorId = parseInt(document.getElementById('vendedor-repasse').value);
    const valor = parseFloat(document.getElementById('valor-repasse').value);
    const moeda = document.getElementById('moeda-repasse').value;

    if (pedidoId === '' || destinatarioId === '' || vendedorId === '' || isNaN(valor) || valor <= 0) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    fetch('/api/divisao-lucros/repasses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ pedidoId, destinatarioId, vendedorId, valor, moeda })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao registrar repasse.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        event.target.reset();
        exibirRepassesPendentesProducao();
        exibirRepassesPendentesAdministradores();
        exibirUltimosRepassesFeitos();
    })
    .catch(error => {
        alert('Erro ao registrar repasse.');
        console.error(error);
    });
}
