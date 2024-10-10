// gastos.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                popularSelectAdministradores();
                exibirSaldoEmpresa();
                document.getElementById('form-gasto-empresa').addEventListener('submit', registrarGasto);
            }
        });
});

function exibirSaldoEmpresa() {
    const textoSaldoEmpresa = document.getElementById('saldo-empresa');

    fetch('/api/gastos/saldo-empresa', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar saldo da empresa.');
        }
        return response.json();
    })
    .then(async saldo => {
        const saldoTotal = (parseFloat(saldo.saldo_empresa_reais).toFixed(2) + await converterDolarParaReal(parseFloat(saldo.saldo_empresa_dolares).toFixed(2)));
        textoSaldoEmpresa.textContent = `Saldo no caixa da empresa: R$ ${formatarValor(parseFloat(saldoTotal).toFixed(2))}`;
    })
    .catch(error => {
        alert('Erro ao buscar saldo da empresa.');
        console.error(error);
    });
}

function popularSelectAdministradores() {
    const selectVendedor = document.getElementById('administrador-gasto');
    selectVendedor.innerHTML = '<option value="">Quem comprou?</option>';

    fetch('/api/pagamentos/administradores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os administradores.');
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
        alert('Erro ao buscar os administradores.');
        console.error(error);
    });
}

function registrarGasto(event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao-gasto').value;
    const valor = parseFloat(document.getElementById('valor-gasto').value);
    const moeda = document.getElementById('moeda-gasto').value;
    const administradorId = parseFloat(document.getElementById('administrador-gasto').value);
    //console.log(descricao,valor,moeda,administradorId)

    if (descricao === '' || isNaN(valor) || valor <= 0 || administradorId === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    fetch('/api/gastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ descricao, valor, moeda, administradorId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao registrar gasto.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        event.target.reset();
        location.reload();
    })
    .catch(error => {
        alert('Erro ao registrar gasto.');
        console.error(error);
    });
}
