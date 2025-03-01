document.addEventListener("DOMContentLoaded", function () {
    verificarAutenticacao();
    carregarCupons();
});

function carregarCupons() {
    fetch('/api/cupons', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('tabela-vendas-vendedor-simples');
        //tbody.innerHTML = ''; // Limpa a tabela antes de adicionar os cupons

        data.cupons.forEach(cupon => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cupon.ativo === 1 ? 'Ativo' : 'Inativo'}</td>
                <td>${cupon.codigo}</td>
                <td>${parseFloat(cupon.desconto)}%</td>
                <td>ID:${cupon.revendedor_id}</td>
                <td>
                    <button class="btn btn-primary" onclick="editarCupon(${cupon.id})">Editar</button>
                    <button class="btn btn-danger" onclick="excluirCupon(${cupon.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar os cupons:', error);
    });
}

function editarCupon(id) {
    const modal = document.getElementById("modal-editar-cupom");
    modal.style.display = "block";
    return;

    const codigo = document.getElementById("codigo-cupom").value;
    const desconto = document.getElementById("desconto-cupom").value;
    const status = document.getElementById("status-cupom").value;

    fetch(`/api/cupons/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codigo: codigo,
            desconto: desconto,
            ativo: status
        })
    })
   .then(response => response.json())
}