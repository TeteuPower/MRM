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