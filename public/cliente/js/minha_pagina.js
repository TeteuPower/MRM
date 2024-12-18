temaSalvo();

// back tot top

let backToTopBtn = document.querySelector('.back-to-top')

/*window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex'
    } else {
        backToTopBtn.style.display = 'none'
    }
}*/

// top nav menu

let menuItems = document.getElementsByClassName('menu-item')

Array.from(menuItems).forEach((item, index) => {
    item.onclick = (e) => {
        let currMenu = document.querySelector('.menu-item.active')
        currMenu.classList.remove('active')
        item.classList.add('active')
    }
})

/* food category

let foodMenuList = document.querySelector('.food-item-wrap')

let foodCategory = document.querySelector('.food-category')

let categories = foodCategory.querySelectorAll('button')

Array.from(categories).forEach((item, index) => {
    item.onclick = (e) => {
        let currCat = foodCategory.querySelector('button.active')
        currCat.classList.remove('active')
        e.target.classList.add('active')
        foodMenuList.classList ='food-item-wrap '+ e.target.getAttribute('data-food-type')
    }
})
*/
// on scroll animation

let scroll = window.requestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60)}

let elToShow = document.querySelectorAll('.play-on-scroll')

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect()

    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    )
}

// Adapte sua função loop para funcionar com o MutationObserver
function loop() {
    //Esta função agora só é executada para os elementos estáticos da página
    const staticElements = document.querySelectorAll('.play-on-scroll:not(.food-item)'); // Seleciona apenas elementos que não são produtos
    staticElements.forEach((item) => {
        if (isElInViewPort(item)) {
            item.classList.add('start');
        } else {
            item.classList.remove('start');
        }
    });
    scroll(loop);
}

loop()


// mobile nav

let bottomNavItems = document.querySelectorAll('.mb-nav-item')

let bottomMove = document.querySelector('.mb-move-item')

bottomNavItems.forEach((item, index) => {
    item.onclick = (e) => {
        //console.log('object')
        let crrItem = document.querySelector('.mb-nav-item.active')
        crrItem.classList.remove('active')
        item.classList.add('active')
        bottomMove.style.left = index * 25 + '%'
    }
})

window.addEventListener('scroll', () => {
    const mbNav = document.querySelector('.mb-nav');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const MARGEM_ERRO = 100; // Adiciona uma margem de erro de 100 pixels
  
    if (scrollPosition + windowHeight + MARGEM_ERRO >= documentHeight) {
      mbNav.classList.add('hidden');
      mbNav.setAttribute('data-aos', 'fade-down'); // Animação para ocultar
    } else {
      mbNav.classList.remove('hidden');
      mbNav.setAttribute('data-aos', 'fade-up'); // Animação para mostrar
    }
});

/*const productList = document.getElementById('product-list');
// Configura o MutationObserver
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Novos elementos foram adicionados ao productList
            mutation.addedNodes.forEach(node => {
                if (node.classList.contains('food-item')) {
                   if (isElInViewPort(node)) {
                        node.classList.add('start');
                    }
                }
            });
        }
    });
});

// Inicia a observação
observer.observe(productList, { childList: true });*/


//Lógica tema dark e light e botão up
(function($) { "use strict";

	//Switch dark/light
	
	$(".switch").on('click', function () {
		if ($("body").hasClass("light")) {
			$("body").removeClass("light");
			$(".switch").removeClass("switched");
            localStorage.setItem('tema', 'light');
		}
		else {
			$("body").addClass("light");
			$(".switch").addClass("switched");
            localStorage.setItem('tema', 'dark');
		}
	});
		
	$(document).ready(function(){"use strict";
	
		//Scroll back to top
		
		var progressPath = document.querySelector('.progress-wrap path');
		var pathLength = progressPath.getTotalLength();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
		progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		progressPath.style.strokeDashoffset = pathLength;
		progressPath.getBoundingClientRect();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
		var updateProgress = function () {
			var scroll = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var progress = pathLength - (scroll * pathLength / height);
			progressPath.style.strokeDashoffset = progress;
		}
        // Função para controlar a visibilidade dos elementos baseada na proximidade do final da página
        var scrollBottom = 0;
		var hideOnScrollBottom = function () {
            scrollBottom = $(document).height() - $(window).scrollTop() - $(window).height(); // Distância até o final
            if (scrollBottom < 50) {
                jQuery('.progress-wrap').removeClass('active-progress');
                jQuery('.switch').removeClass('active-progress');
            }
            //console.log(scrollBottom);
        }
		updateProgress();
        hideOnScrollBottom();
		$(window).scroll(updateProgress);	
        $(window).scroll(hideOnScrollBottom);
		var offset = 50;
		var duration = 550;
		jQuery(window).on('scroll', function() {
			if (jQuery(this).scrollTop() > offset && scrollBottom > 100) {
                //console.log(progress);
				jQuery('.progress-wrap').addClass('active-progress');
                jQuery('.switch').addClass('active-progress');
			} else {
				jQuery('.progress-wrap').removeClass('active-progress');
                jQuery('.switch').removeClass('active-progress');
			}
            if (scrollBottom < 100) {
                jQuery('.progress-wrap').removeClass('active-progress');
                jQuery('.switch').removeClass('active-progress');
            }
		});				
		jQuery('.progress-wrap').on('click', function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
		})
		
		
	});
	
})(jQuery); 

function temaSalvo() {
    let tema = localStorage.getItem('tema');
    if (tema == 'dark') {
        $("body").addClass("light");
        $(".switch").addClass("switched");
        //console.log('tema dark definido');
    }
    if (tema == 'light') {
        $("body").removeClass("light");
        $(".switch").removeClass("switched");
        //console.log('tema light definido');
    }
};

// Função para formatar valores para o padrão brasileiro
function formatarValor(valor) {
    valor = parseFloat(valor).toFixed(2); // Garante duas casas decimais
    const partes = valor.split('.');
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona ponto a cada três dígitos
    const decimal = partes[1];
    return inteiro + ',' + decimal; // Junta as partes com vírgula
  }

  function verificarAutenticacao() {
    const token = localStorage.getItem('tokenUser');

    if (!token) {
        // Redireciona para a página de login se não houver token
        alert('Você deve fazer o Login primeiro');
        window.location.href = '/adm';
        return Promise.reject(false); // Retorna uma promessa rejeitada para evitar erros nas páginas protegidas
    }

    // Função para verificar a validade do token
    function verificarToken() {
        fetch('/api/verificar-token-user', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (!response.ok) {
                alert('Token de segurança vencido, faça o login novamente');
                localStorage.removeItem('token');
                localStorage.removeItem('tokenUser');
                window.location.href = '/adm';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar o token:', error);
        });
    }

    // Verifica a validade do token imediatamente
    verificarToken();

    // Verifica a validade do token a cada 100 segundos (100000 milissegundos)
    setInterval(verificarToken, 100000);
}

/*Resgata botão sobre nós e direciona para a página de login
const botaoSobre = document.getElementById('btn-sobre-nos');
botaoSobre.addEventListener('click', () => {
  window.location.href = '/adm';
});*/

function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;
  if (strCPF == "12345678909") return false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

verificarAutenticacao();
popularMenu();
//carregarProdutos();
popularEnderecos();

//Inicia depois no dom
window.addEventListener('DOMContentLoaded', () => {
    saudacao();
});

function saudacao() {
    //resgata o nome de usuário do local storage
    const nomeUsuario = localStorage.getItem('Usuario');

    //exibe o nome de usuário no menu
    document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;
}



//Cria função de Logout
document.getElementById('logout-btn').addEventListener('click', () => { logout(); });
function logout() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('tokenUser');
    window.location.href = '/';
    alert('Você foi deslogado com sucesso!');
}

//document.getElementById('btn-abrir-modal').addEventListener('click', abrirCarrinho);

//Modifica a página se o usuário já tem um carrinho ativo
function popularMenu() {

        //Adicionando função ao botão de confirmar dados
        document.getElementById('btn-confirmar-dados').addEventListener('click', confirmarDados);
        popularInputs ();

        const cpfInput = document.getElementById('cpf');

        cpfInput.addEventListener('input', () => {
        let cpf = cpfInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = cpf;
        });

        const telefoneInput = document.getElementById('telefone');

        telefoneInput.addEventListener('input', () => {
        let telefone = telefoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Adiciona o nono dígito se necessário
            if (telefone.length > 4 && telefone[2] != 9) {
                telefone = telefone.slice(0, 2) + '9' + telefone.slice(2)
            }

        let formattedTelefone = '';

            if(telefone.length > 0) {
                formattedTelefone = "(" + telefone.substring(0, 2) + ") ";
            }

            if(telefone.length > 2) {
                formattedTelefone += telefone.substring(2,3) + " ";
            }

            if(telefone.length > 3) {
                formattedTelefone += telefone.substring(3, 7) + "-";
            }
            if(telefone.length > 7) {
                formattedTelefone += telefone.substring(7, 11);
            }


        telefoneInput.value = formattedTelefone;
        });
}





//Limpar carrinho
function limparCarrinho() {
    //document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);
    // Remover todos os itens do carrinho do localStorage e atualizar o modal
    if (confirm('Deseja realmente limpar o carrinho?')) {
        localStorage.removeItem('cart');
        popularMenu();
    } else {
        return; // Interrompe a função se o usuário cancelar
    }
}

$(document).ready(function() {
    $('#toggle-endereco').click(function() {
        $('#endereco-container').toggleClass('mostrar');
    });
});

$(document).ready(function() {
    $('#toggle-endereco-salvo').click(function() {
        $('#enderecos-salvos').toggleClass('mostrar');
    });
});

$(document).ready(function() {
    $('#toggle-contato').click(function() {
        $('#contato-container').toggleClass('mostrar');
    });
});

//Disparar função confereCep() e confereCpfBlur() quando o cep e o cpf estiver preenchido
document.getElementById('cep').addEventListener('blur', confereCep);
document.getElementById('cpf').addEventListener('blur', confereCpfBlur);

// Função para buscar produtos via API
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos'); // Rota da sua API
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const products = await response.json();
        exibirProdutos(products);
        loop();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

function popularInputs () {
    const email = document.getElementById('email');
    const nome = document.getElementById('nome');
    const sobrenome = document.getElementById('sobrenome');
    const telefone = document.getElementById('telefone');
    const cpf = document.getElementById('cpf');

    //Faz uma consulta a api api/usuarios/me enviando o token do localStorage
    fetch('/api/usuarios/me', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('tokenUser')
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        email.value = data.email;
        nome.value = data.nome;
        sobrenome.value = data.sobrenome;
        telefone.value = data.telefone;
        cpf.value = data.cpf;
        //Criar lógica para quando existir o dado, adicionar um disabled ao input junto
        if (email.value !== '') {
            email.disabled = true;
        }
        if (nome.value!== '') {
            nome.disabled = true;
        }
        if (sobrenome.value !== '') {
            sobrenome.disabled = true;
        }
        if (telefone.value !== '') {
            telefone.disabled = true;
        }
        if (cpf.value !== '') {
            cpf.disabled = true;
        }
    })

}

function popularEnderecos() {
    const enderecosSection = document.getElementById('enderecos-salvos-conteudo');
    enderecosSection.innerHTML = ''; // Limpa o container

    fetch('/api/usuarios/enderecos', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('tokenUser')
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        data.forEach(endereco => {
            const enderecoItem = document.createElement('div');
            //enderecoItem.classList.add('input-group-enderecos left-to-right play-on-scroll');
            enderecoItem.innerHTML = `
            <div class="input-group-enderecos left-to-right play-on-scroll" data-id="${endereco.id}">
                <div class="conteudo-endereco-salvo" >
                    <h3>${endereco.apelido}</h3>
                    <p><strong style="color: black;">Endereço:</strong> ${endereco.endereco}</p>
                    <p><strong style="color: black;">N°:</strong> ${endereco.numero}</p>
                    <p><strong style="color: black;">Bairro:</strong> ${endereco.bairro}</p>
                    <p><strong style="color: black;">Cidade:</strong> ${endereco.cidade}</p>
                    <p><strong style="color: black;">Estado:</strong> ${endereco.estado}</p>
                    <p><strong style="color: black;">Complemento:</strong> ${endereco.complemento}</p>
                    <button class="botao-excluir" data-id="${endereco.id}"><i class='bx bx-trash'></i></button>
                    <input type="hidden" id="cep-${endereco.id}" value="${endereco.cep}">
                </div>
            </div>
            `;
            enderecosSection.appendChild(enderecoItem);
        })

        enderecosSection.addEventListener('click', (event) => {
            if (event.target.classList.contains('bx-trash')) { // Clica no ícone
                 const botaoExcluir = event.target.parentNode;
                const enderecoId = botaoExcluir.dataset.id;
                excluirEndereco(enderecoId);
            } /*else if (event.target.classList.contains("botao-excluir")) { // Clica no botão
                const enderecoId = event.target.dataset.id;
                excluirEndereco(enderecoId);
            }*/
        });

        // Seleciona endereço quando clicado
        enderecosSection.addEventListener('click', (event) => {
            const conteudoClicado = event.target.closest('.input-group-enderecos');

            if (conteudoClicado) {
                    const enderecoId = conteudoClicado.dataset.id;
                    sessionStorage.setItem('enderecoId', enderecoId);
                    //atualizarFrete(enderecoId);
                    // Adicione class "selecionado" ao endereço clicado
                    const enderecos = document.querySelectorAll('.input-group-enderecos');
                    enderecos.forEach(endereco => {
                        //console.log(endereco);
                        endereco.classList.remove('selecionado');
                        if (endereco.dataset.id === enderecoId) { // Adiciona somente ao clicado
                            endereco.classList.add('selecionado');
                        }
                    });
            }
        })
    });

}

async function excluirEndereco(enderecoId) {
    if (confirm('Tem certeza de que deseja excluir este endereço?')) { //confirmação antes de excluir.
        try {
            const response = await fetch(`/api/usuarios/enderecos/${enderecoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('tokenUser')
                }
            });

            if (response.ok) {
                // Remove o endereço do DOM
                const enderecoDiv = document.querySelector(`.botao-excluir[data-id="${enderecoId}"]`).closest('.input-group-enderecos');
                enderecoDiv.remove();
                alert('Endereço excluído com sucesso!');
            } else {
                const errorData = await response.json();
                alert('Erro ao excluir endereço: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao excluir endereço:', error);
            alert('Erro ao excluir endereço.');
        }
    }
}

function confirmarDados() {
    const nomeInput = document.getElementById('nome');
    const nome = nomeInput.value;
    const sobrenomeInput = document.getElementById('sobrenome');
    const sobrenome = sobrenomeInput.value;
    const telefoneComSimbolos = document.getElementById('telefone');
    const telefone = telefoneComSimbolos.value.replace(/\D/g, '');
    const cpfComSimbolos = document.getElementById('cpf');
    const cpf = cpfComSimbolos.value.replace(/\D/g, '');
    const nomeEnderecoInput = document.getElementById('nome-endereco');
    const nomeEndereco = nomeEnderecoInput.value;
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    const enderecoInput = document.getElementById('endereco');
    const endereco = enderecoInput.value;
    const numeroInput = document.getElementById('numero');
    const numero = numeroInput.value;
    const bairroInput = document.getElementById('bairro');
    const bairro = bairroInput.value;
    const cidadeInput = document.getElementById('cidade');
    const cidade = cidadeInput.value;
    const estadoInput = document.getElementById('estado');
    const estado = estadoInput.value;
    const complementoInput = document.getElementById('complemento');
    const complemento = complementoInput.value;
    const telefoneInput = document.getElementById('telefone');
    const cpfInput = document.getElementById('cpf');

    //Usar função de validação de CPF
    if (!TestaCPF(cpf)) {
        alert('Por favor, insira um CPF válido.');
        return;
    }

    //Valida os dados do endereço
    if (telefone.length < 11) {
        alert('Por favor, insira um telefone com DDD.');
        return;
    }
    if (sobrenome === '') {
        alert('Por favor, preencha o sobrenome.');
        return;
    }
    if (telefone === '') {
        alert('Por favor, preencha seu telefone.');
        return;
    }
    if (cep === '') {
        alert('Por favor, preencha o CEP.');
        return;
    }
    if (endereco === '') {
        alert('Por favor, preencha o endereço.');
        return;
    }
    if (numero === '') {
        alert('Por favor, preencha o número.');
        return;
    }
    if (bairro === '') {
        alert('Por favor, preencha o bairro.');
        return;
    }
    if (cidade === '') {
        alert('Por favor, preencha a cidade.');
        return;
    }
    //Atualiza dados do cliente
    fetch('/api/usuarios/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('tokenUser')
        },
        body: JSON.stringify({ nome, telefone, sobrenome, cpf })
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        //alert('Dados atualizados com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados.');
    });

    //console.log(cep);
    //Atualiza dados do endereço
    //console.log('Nome endereço:', nomeEndereco, ';', 'CEP:', cep, ';', 'Endereço:', endereco, ';', 'Número:', numero, ';', 'Bairro:', bairro, ';', 'Cidade:', cidade, ';', 'Estado:', estado, ';', 'Complemento:', complemento);
    fetch('api/usuarios/enderecos' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('tokenUser')
        },
        body: JSON.stringify({ nomeEndereco, cep, endereco, numero, bairro, cidade, estado, complemento })
    })
    .then(response => response.json())
    .then(data => {
        //Remove a classe "mostrar" do endereco-container
        const enderecoContainer = document.getElementById('endereco-container');
        enderecoContainer.classList.remove('mostrar');
        //console.log('Id do endereço: ',data.id);
        //alert('Novo endereço adicionado com sucesso!');
        //bloqueia todos os campos de dados
        nomeEnderecoInput.disabled = true;
        sobrenomeInput.disabled = true;
        telefoneInput.disabled = true;
        cpfInput.disabled = true;
        enderecoInput.disabled = true;
        numeroInput.disabled = true;
        cepInput.disabled = true;
        bairroInput.disabled = true;
        cidadeInput.disabled = true;
        estadoInput.disabled = true;
        complementoInput.disabled = true;
        //Um atraso de meio segundo para iniciar a função de popular enderecos
        setTimeout(() => {
            popularEnderecos();

            //Movendo a tela para a div botoes-expandir
            const botoesExpandir = document.getElementById('telefone');
            botoesExpandir.scrollIntoView({ behavior: 'smooth' });
            

            setTimeout(() => {
                //Abrindo endereços salvos
                const enderecoContainerSalvos = document.getElementById('enderecos-salvos');
                enderecoContainerSalvos.classList.add('mostrar');
                setTimeout(() => {
                    //Clicando no endereço com data.id
                    const enderecoDiv = document.querySelector(`.input-group-enderecos[data-id="${data.id}"]`);
                    enderecoDiv.click();
                }, 200);
            }, 1000);
            
        }, 100);

    })
    .catch(error => {
        console.error('Erro ao atualizar endereço:', error);
        alert('Erro ao atualizar endereço.');
    });

}

function confereCep() { //evento blur dispara quando input perde o foco
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    if ($('#cep').is(':visible')) {
        fetch(`/busca-cep/${cep}`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP inválido.');
                cepInput.value = '';
                endereco.value = '';
                bairro.value = '';
                cidade.value = '';
                estado.value = '';
                endereco.disabled = false;
                bairro.disabled = false;
                cidade.disabled = false;
                estado.disabled = false;
                return;
            }
            //console.log(data);
            endereco.value = data.logradouro;
            bairro.value = data.bairro;
            cidade.value = data.localidade;
            estado.value = data.uf;
            if (endereco.value !== '') {
                endereco.disabled = true;
            }
            if (bairro.value !== '') {
                bairro.disabled = true;
            }
            if (cidade.value !== '') {
                cidade.disabled = true;
            }
            if (estado.value !== '') {
                estado.disabled = true;
            }
        })
        .catch(error => {
            //console.error('Erro ao buscar o CEP:', error);
            //alert('Erro ao buscar o CEP.');
        });
    }
};

function confereCpfBlur() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.replace(/\D/g, '');
    if (!TestaCPF(cpf)) {
        alert('Por favor, insira um CPF válido.');
        cpfInput.value = '';
    }
}

function atualizarFrete(enderecoId) {
    const freteInput = document.getElementById('frete');
    //Resgata o cep
    const cepValue = document.getElementById(`cep-${enderecoId}`).value.replace(/\D/g, '');
    //console.log(cepValue);
    freteInput.innerText = 'Frete: GRÁTIS';
}

function codigoPromocional() {
    const cupom = document.getElementById('promoCode').value;
    
    fetch(`/api/usuarios/cupons/${cupom}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('tokenUser'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        //Verifica se o booleano data.ativo é verdadeiro
        if (data.ativo === 1) {
            const desconto = parseFloat(data.desconto);
            //console.log('Desconto:',desconto);
            const descontoInput = document.getElementById('desconto');
            const totalInput = document.getElementById('total');
            const total = parseFloat(totalInput.getAttribute('value'));
            //console.log('Total:',total);
            const novoTotal = total - (total * desconto / 100); // Calcula o novo total com o desconto
            descontoInput.innerText = `Desconto: R$ ${formatarValor((novoTotal - total).toFixed(2))}`; // Atualiza o valor do desconto na tela
            totalInput.innerText = `Total: R$ ${formatarValor(novoTotal.toFixed(2))}`;
            //Insere o cupom no localStorage
            sessionStorage.setItem('cupom', cupom);
            alert('Cupom aplicado com sucesso!');
        } else {
            alert('Cupom expirado.');
        }
    })
    .catch(error => {
        console.error('Código promocional não encontrado:', error);
        alert('Código promocional não encontrado.');
    });
    if (codigoPromocional === '') {
        alert('Por favor, insira um cupom.');
    }
}

//Função que finaliza o pedido

function finalizarPedido() {
    const cupom = sessionStorage.getItem('cupom');
    const produtos = JSON.parse(localStorage.getItem('cart'));
    const enderecoId = sessionStorage.getItem('enderecoId');
    //const tokenUsuario = localStorage.getItem('tokenUser');
    if (produtos.length === 0) {
        alert('Seu carrinho esta vazio.');
        return;
    }
    //console.log(produtos);
    if (enderecoId === null) {
        alert('Selecione um endereço para finalizar o pedido.');
        return;
    }
    //console.log(enderecoId);
    //console.log(tokenUsuario);
    //console.log(cupom);
    //Envia dados da compra para api do mercadopago
    fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('tokenUser'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            produtos: produtos,
            endereco_id: enderecoId,
            cupom: cupom
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.init_point) {
            localStorage.removeItem('cart');
            sessionStorage.removeItem('cupom');
            sessionStorage.removeItem('enderecoId');
            //Redireciona o cliente para o checkout do mercadopago
            window.location.href = data.init_point;
        }
    })
    .catch(error => {
        console.error('Erro ao realizar o pedido:', error);
        alert('Erro ao realizar o pedido.');
    });
}