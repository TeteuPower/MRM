// gastos.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                popularSelectVendedores();

                document.getElementById('form-gasto-empresa').addEventListener('submit', registrarGasto);
            }
        });
});

function popularSelectVendedores() {
    const selectVendedor = document.getElementById('administrador-gasto');
    selectVendedor.innerHTML = '<option value="">Quem comprou?</option>';

    fetch('/api/pagamentos/vendedores', {
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
    })
    .catch(error => {
        alert('Erro ao registrar gasto.');
        console.error(error);
    });
}
