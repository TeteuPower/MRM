temaSalvo();
let menuInferior = false;

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
    if (menuInferior === true) {
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
    } else {
        const mbNav = document.querySelector('.mb-nav');
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const MARGEM_ERRO = 100; // Adiciona uma margem de erro de 100 pixels
    
        /*if (scrollPosition + windowHeight + MARGEM_ERRO >= documentHeight) {
        mbNav.classList.add('hidden');
        mbNav.setAttribute('data-aos', 'fade-down'); // Animação para ocultar
        } else {
        mbNav.classList.remove('hidden');
        mbNav.setAttribute('data-aos', 'fade-up'); // Animação para mostrar
        }*/
    }
});

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

function logout() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('tokenEntregador');
    localStorage.removeItem('entregador');
    localStorage.removeItem('entregadorNome');
    window.location.href = '/';
    alert('Você foi deslogado com sucesso!');
}

// Função para carregar o header
async function carregarHeaderEntregador() {
    try {
        const response = await fetch('/html/header-entregador.html'); // Caminho para o header.html
        const headerHTML = await response.text();
        document.getElementById('header-container').innerHTML = headerHTML; // Adiciona o HTML ao container
        //console.log('Header carregado com sucesso!');

        // Lógica para adicionar a classe "active"
        const currentPage = window.location.pathname.split('/').pop(); // Obtém o nome da página atual
        //console.log(currentPage);
        const menuItem = document.querySelector(`.menu-item[data-page="${currentPage}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }

        // Adicione aqui os ouvintes de evento para o logout, etc. (se necessário)
        document.getElementById('logout-btn').addEventListener('click', () => { logout(); });


    } catch (error) {
        console.error('Erro ao carregar header:', error);
    }
}