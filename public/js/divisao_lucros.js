// divisao_lucros.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                exibirRepassesPendentesProducao();
                exibirRepassesPendentesAdministradores();
                exibirUltimosRepassesFeitos();
                popularSelectVendedoresRepasse();

                document.getElementById('btn-registrar-repasse').addEventListener('click', registrarRepasse);
            }
        });
});

function exibirRepassesPendentesProducao() {
    const listaRepasses = document.getElementById('lista-repasses-producao');
    listaRepasses.innerHTML = ''; // Limpa a lista

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
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${repasse.pedido_id} - Produtor: ${repasse.produtor_nome} - Valor: ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${parseInt(repasse.valor_venda).toFixed(2)}`;
            listaRepasses.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar repasses pendentes para produção.');
        console.error(error);
    });
}

function exibirRepassesPendentesAdministradores() {
    const listaRepasses = document.getElementById('lista-repasses-administradores');
    listaRepasses.innerHTML = ''; // Limpa a lista

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
            console.log(repasse)
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${repasse.pedido_id} - Administrador: ${repasse.administrador_nome} - Valor: ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${parseInt(repasse.valor_venda).toFixed(2)}`;
            listaRepasses.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar repasses pendentes entre administradores.');
        console.error(error);
    });
}

function exibirUltimosRepassesFeitos() {
    const listaRepasses = document.getElementById('lista-repasses-feitos');
    listaRepasses.innerHTML = ''; // Limpa a lista

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
            listItem.textContent = `Repasse nº ${repasse.repasse_id} - Pedido nº ${repasse.pedido_id} - Destinatário: ${repasse.destinatario_nome} - Valor: ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${repasse.valor.toFixed(2)} - Vendedor: ${repasse.vendedor_nome} - Data: ${formatarData(repasse.data)}`;
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

    fetch('/api/funcionarios', {
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

function registrarRepasse(event) {
    event.preventDefault();

    const pedidoId = parseInt(document.getElementById('repasse-para').value);
    const destinatarioId = parseInt(document.getElementById('repasse-para').value);
    const vendedorId = document.getElementById('vendedor-repasse').value;
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

// ... (seu código existente) ...