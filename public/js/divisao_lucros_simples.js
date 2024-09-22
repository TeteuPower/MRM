// divisao_lucros_simples.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                exibirResumoRafaelMatheus();
                exibirResumoMaitheMatheus();
                exibirResumoRafaelMaithe();
            }
        });
});

function exibirResumoRafaelMatheus() {
    fetch('/api/divisao-lucros-simples/rafael', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo do Rafael.');
        }
        return response.json();
    })
    .then(resumo => {
        //console.log(resumo.comissoes_matheus);
        document.getElementById('saldo-total-rafael-matheus').textContent = `R$ ${resumo.saldo_total_rafael_matheus / 10}`;
        document.getElementById('vendas-totais-rafael-matheus').textContent = `R$ ${resumo.vendas_totais_rafael_matheus}`;
        document.getElementById('lucro-real-rafael').textContent = `R$ ${resumo.lucro_real_rafael}`;
        document.getElementById('comissoes-matheus-rafael').textContent = `R$ ${parseInt(resumo.comissoes_matheus).toFixed(2)}`;
    })
    .catch(error => {
        alert('Erro ao buscar resumo do Rafael.');
        console.error(error);
    });
}

function exibirResumoMaitheMatheus() {
    fetch('/api/divisao-lucros-simples/maithe', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo da Maithê.');
        }
        return response.json();
    })
    .then(resumo => {
        console.log(resumo);
        document.getElementById('saldo-total-maithe-matheus').textContent = `R$ ${resumo.saldo_total_maithe_matheus / 10}`;
        document.getElementById('vendas-totais-maithe-matheus').textContent = `R$ ${resumo.vendas_totais_maithe_matheus}`;
        document.getElementById('lucro-real-maithe').textContent = `R$ ${resumo.lucro_real_maithe}`;
        document.getElementById('comissoes-matheus-maithe').textContent = `R$ ${resumo.comissoes_matheus}`;
    })
    .catch(error => {
        alert('Erro ao buscar resumo da Maithê.');
        console.error(error);
    });
}

function exibirResumoRafaelMaithe() {
    fetch('/api/divisao-lucros-simples/rafael-maithe', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo do Rafael e Maithê.');
        }
        return response.json();
    })
    .then(resumo => {
        //document.getElementById('saldo-total-rafael-maithe').textContent = `R$ ${resumo.saldo_total_rafael_maithe}`;
    })
    .catch(error => {
        alert('Erro ao buscar resumo do Rafael e Maithê.');
        console.error(error);
    });
}