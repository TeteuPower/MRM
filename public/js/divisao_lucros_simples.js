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
        // Adiciona event listeners aos botões "Confirmar Repasse"
        document.getElementById('btn-confirmar-repasse-rafael').addEventListener('click', () => {
            confirmarRepasse('rafael');
        });
        document.getElementById('btn-confirmar-repasse-maithe').addEventListener('click', () => {
            confirmarRepasse('maithe');
        });
});

async function exibirResumoRafaelMatheus() {
    try {
        const response = await fetch('/api/divisao-lucros-simples/rafael', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo do Rafael.');
        }
        const resumo = await response.json();
        //console.log(resumo);
        //Saldo Total
        let totalDolar = parseFloat(resumo.saldo_total_rafael_matheus_dolares)/10;
        let totalReal = parseFloat(resumo.saldo_total_rafael_matheus_reais)/10;
        let totalConvertido = parseFloat((await converterDolarParaReal(totalDolar) + totalReal) - parseFloat(resumo.repasses_parciais_rafael_matheus)).toFixed(2);
        //Vendas Totais
        let totalDolarVendasTotais = parseFloat(resumo.vendas_totais_rafael_matheus_dolares);
        let totalRealVendasTotais = parseFloat(resumo.vendas_totais_rafael_matheus_reais);
        let totalConvertidoVendasTotais = parseFloat((await converterDolarParaReal(totalDolarVendasTotais) + totalRealVendasTotais).toFixed(2));
        //Lucro Real
        let totalDolarLucroReal = parseFloat(resumo.lucro_real_rafael_dolares);
        let totalRealLucroReal = parseFloat(resumo.lucro_real_rafael_reais);
        let totalConvertidoLucroReal = parseFloat((await converterDolarParaReal(totalDolarLucroReal) + totalRealLucroReal).toFixed(2));
        //Comissoes
        let totalDolarComissoes = parseFloat(resumo.comissoes_matheus_dolares);
        let totalRealComissoes = parseFloat(resumo.comissoes_matheus_reais);
        let totalConvertidoComissoes = parseFloat((await converterDolarParaReal(totalDolarComissoes) + totalRealComissoes).toFixed(2));
        //Comissoes Parciais
        let totalDolarComissoesParciais = parseFloat(resumo.comissoes_matheus_dolares_parcial);
        let totalRealComissoesParciais = parseFloat(resumo.comissoes_matheus_reais_parcial);
        let totalConvertidoComissoesParciais = parseFloat((await converterDolarParaReal(totalDolarComissoesParciais) + totalRealComissoesParciais).toFixed(2));
        let comissaoTotal = totalConvertidoComissoes + totalConvertidoComissoesParciais;
        //console.log(totalConvertido);
        document.getElementById('saldo-total-rafael-matheus').textContent = `R$ ${formatarValor(totalConvertido)}`;
        document.getElementById('vendas-totais-rafael-matheus').textContent = `R$ ${formatarValor(totalConvertidoVendasTotais)}`;
        document.getElementById('lucro-real-rafael').textContent = `R$ ${formatarValor(totalConvertidoLucroReal)}`;
        document.getElementById('comissoes-matheus-rafael').textContent = `R$ ${formatarValor(parseFloat(resumo.repasses_parciais_rafael_matheus))}`;
    } catch (error) {
        console.error(error); 
        alert('Erro ao buscar resumo do Rafael.');
      }
}

async function exibirResumoMaitheMatheus() {
    try {
        const response = await fetch('/api/divisao-lucros-simples/maithe', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo da Maithê.');
        }
        const resumo = await response.json();
        //console.log(resumo.repasses_parciais_maithe_matheus);
        //Saldo Total
        let totalDolar = parseFloat(resumo.saldo_total_maithe_matheus_dolares)/10;
        let totalReal = parseFloat(resumo.saldo_total_maithe_matheus_reais)/10;
        let totalConvertido = parseFloat((await converterDolarParaReal(totalDolar) + totalReal) - parseFloat(resumo.repasses_parciais_maithe_matheus)).toFixed(2)
        //console.log(totalConvertido, totalDolar, totalReal);
        //Vendas Totais
        let totalDolarVendasTotais = parseFloat(resumo.vendas_totais_maithe_matheus_dolares);
        let totalRealVendasTotais = parseFloat(resumo.vendas_totais_maithe_matheus_reais);
        let totalConvertidoVendasTotais = parseFloat((await converterDolarParaReal(totalDolarVendasTotais) + totalRealVendasTotais).toFixed(2));
        //Lucro Real
        let totalDolarLucroReal = parseFloat(resumo.lucro_real_maithe_dolares);
        let totalRealLucroReal = parseFloat(resumo.lucro_real_maithe_reais);
        let totalConvertidoLucroReal = parseFloat((await converterDolarParaReal(totalDolarLucroReal) + totalRealLucroReal).toFixed(2));
        //Comissoes
        let totalDolarComissoes = parseFloat(resumo.comissoes_matheus_dolares);
        let totalRealComissoes = parseFloat(resumo.comissoes_matheus_reais);
        let totalConvertidoComissoes = parseFloat((await converterDolarParaReal(totalDolarComissoes) + totalRealComissoes).toFixed(2));
        //Comissoes Parciais
        let totalDolarComissoesParciais = parseFloat(resumo.comissoes_matheus_dolares_parcial);
        let totalRealComissoesParciais = parseFloat(resumo.comissoes_matheus_reais_parcial);
        let totalConvertidoComissoesParciais = parseFloat((await converterDolarParaReal(totalDolarComissoesParciais) + totalRealComissoesParciais).toFixed(2));
        let comissaoTotal = totalConvertidoComissoes + totalConvertidoComissoesParciais;
        
        document.getElementById('saldo-total-maithe-matheus').textContent = 
        `R$ ${formatarValor(totalConvertido)}`;
      
      document.getElementById('vendas-totais-maithe-matheus').textContent = 
        `R$ ${formatarValor(totalConvertidoVendasTotais)}`;
      
      document.getElementById('lucro-real-maithe').textContent = 
        `R$ ${formatarValor(totalConvertidoLucroReal)}`;
      
      document.getElementById('comissoes-matheus-maithe').textContent = 
        `R$ ${formatarValor(parseFloat(resumo.repasses_parciais_maithe_matheus))}`;
    } catch (error) {
        console.error(error); 
        alert('Erro ao buscar resumo da Maithe.');
      }
}

/*function exibirResumoMaitheMatheus() {
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
        //console.log(resumo);
        document.getElementById('saldo-total-maithe-matheus').textContent = `R$ ${resumo.saldo_total_maithe_matheus / 10}`;
        document.getElementById('vendas-totais-maithe-matheus').textContent = `R$ ${resumo.vendas_totais_maithe_matheus}`;
        document.getElementById('lucro-real-maithe').textContent = `R$ ${resumo.lucro_real_maithe}`;
        document.getElementById('comissoes-matheus-maithe').textContent = `R$ ${resumo.comissoes_matheus}`;
    })
    .catch(error => {
        alert('Erro ao buscar resumo da Maithê.');
        console.error(error);
    });
}*/

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

function confirmarRepasse(vendedor) {
    const valorRepasse = parseFloat(document.getElementById(`valor-repasse-${vendedor}`).value);
    const vendedorId = vendedor === 'rafael' ? 3 : 2; // Obtém o ID do vendedor
    const produtorId = 1; // ID do produtor (Matheus)

    if (isNaN(valorRepasse) || valorRepasse <= 0) {
        alert('Por favor, insira um valor válido para o repasse.');
        return;
    }

    if (confirm(`Confirma o repasse de R$ ${valorRepasse.toFixed(2)} do ${vendedor} para o produtor Matheus?`)) {
        // Faz uma requisição POST para a API para registrar o repasse
        fetch('/api/divisao-lucros-simples/repasses-producao-parcial/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                vendedorId: vendedorId,
                produtorId: produtorId,
                valor: valorRepasse,
                moeda: 'real', // Assumindo que o repasse é em reais
                administradorId: parseInt(localStorage.getItem('administrador')),
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao registrar repasse.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            exibirRepassesPendentesProducao();
            document.getElementById(`valor-repasse-${vendedor}`).value = ''; // Limpa o campo de input
        })
        .catch(error => {
            alert('Erro ao registrar repasse.');
            console.error(error);
        });
    }
}

function exibirRepassesPendentesProducao() {
    exibirResumoRafaelMatheus();
    exibirResumoMaitheMatheus();
}