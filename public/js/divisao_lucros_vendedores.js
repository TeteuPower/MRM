// saldo_repasses.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                calcularSaldoVendedores();
            }
        });
});

async function calcularSaldoVendedores() {
    fetch('/api/divisao-lucros-simples/rafael-maithe', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar saldo do Rafael.');
        }
        return response.json();
    })
    .then(async (resumo) => {
        const saldoReaisRafael = parseFloat(resumo.saldo_total_rafael_maithe_reais);
        const saldoDolaresRafael = parseFloat(resumo.saldo_total_rafael_maithe_dolar);
        const saldoReaisMaithe = parseFloat(resumo.saldo_total_maithe_rafael_reais);
        const saldoDolaresMaithe = parseFloat(resumo.saldo_total_maithe_rafael_dolar);

        let saldoTotalRafael = (saldoReaisRafael + await converterDolarParaReal(saldoDolaresRafael)) * 0.45;
        let saldoTotalMaithe = (saldoReaisMaithe + await converterDolarParaReal(saldoDolaresMaithe)) * 0.45;

        //console.log('Rafael:', saldoReaisRafael, saldoDolaresRafael, saldoTotalRafael);
        //console.log('Maithê:', saldoReaisMaithe, saldoDolaresMaithe, saldoTotalMaithe);

        if (saldoTotalRafael > saldoTotalMaithe) {
            const saldo = (saldoTotalRafael - saldoTotalMaithe);
            atualizarBarras('rafael', saldo);
        };
        if (saldoTotalMaithe > saldoTotalRafael) {
            const saldo = (saldoTotalMaithe - saldoTotalRafael);
            atualizarBarras('maithe', saldo);
        };
        if (saldoTotalRafael === saldoTotalMaithe) {
            atualizarBarras('igual', 0);
        };
        //atualizarBarraRepasse('rafael', saldoReais, saldoDolares);
    })
    .catch(error => {
        alert('Erro ao buscar saldo do Rafael.');
        console.error(error);
    });
}

function atualizarBarras(vendedorMaiorSaldo, saldo) {
    const barra1 = document.querySelector('.barra1');
    const barra2 = document.querySelector('.barra2');
    const valorBarra1 = document.querySelector('.valor-barra1'); // Seleciona o elemento de texto da barra 1
    const valorBarra2 = document.querySelector('.valor-barra2'); // Seleciona o elemento de texto da barra 2
    const textoResumo = document.getElementById('resumo');
    //console.log(saldo, vendedorMaiorSaldo);
  
    // Valor máximo da barra (100%)
    const valorMaximo = 20000;
  
    // Calcula a porcentagem proporcional ao saldo
    const porcentagem = parseInt((saldo / valorMaximo) * 100);
  
    // Define a largura e o sentido da barra de acordo com o vendedor
    if (vendedorMaiorSaldo === 'rafael') {
      barra1.style.width = `${(50 + (porcentagem / 2))}%`;
      barra2.style.width = `${(50 - (porcentagem / 2))}%`;
      valorBarra1.textContent = `Saldo: R$${formatarValor(saldo)}`; // Atualiza o texto da barra 1
      valorBarra2.textContent = ''; // Limpa o texto da barra 2
      textoResumo.textContent = `Para igualar o saldo, o Rafael deve fazer um repasse de R$ ${formatarValor(saldo)} para a Maithê`;
    }
    if (vendedorMaiorSaldo === 'maithe') {
        barra1.style.width = `${(50 - (porcentagem / 2))}%`;
        barra2.style.width = `${(50 + (porcentagem / 2))}%`;
        valorBarra1.textContent = ''; // Limpa o texto da barra 1
        valorBarra2.textContent = `Saldo: R$${formatarValor(saldo)}`; // Atualiza o texto da barra 2
        textoResumo.textContent = `Para igualar o saldo, a Maithê deve fazer um repasse de R$ ${formatarValor(saldo)} para o Rafael`;
    }


    return;
    
    
    
    
    
    
    
    
    
    
    // Define a cor da barra com base no saldo
    if (saldoTotal > 0) {
        barraRepasse.style.backgroundColor = '#5cb85c'; // Verde
    } else if (saldoTotal < 0) {
        barraRepasse.style.backgroundColor = '#d9534f'; // Vermelho
    } else {
        barraRepasse.style.backgroundColor = '#222'; // Cinza
    }
}
  // Exemplo de uso:
  //atualizarBarras(50, 50); // Define 30% para barra1 e 70% para barra2