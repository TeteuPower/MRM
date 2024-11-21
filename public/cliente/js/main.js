// back tot top

let backToTopBtn = document.querySelector('.back-to-top')

window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex'
    } else {
        backToTopBtn.style.display = 'none'
    }
}

// top nav menu

let menuItems = document.getElementsByClassName('menu-item')

Array.from(menuItems).forEach((item, index) => {
    item.onclick = (e) => {
        let currMenu = document.querySelector('.menu-item.active')
        currMenu.classList.remove('active')
        item.classList.add('active')
    }
})

// food category

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
        console.log('object')
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
  
    if (scrollPosition + windowHeight >= documentHeight) {
      mbNav.classList.add('hidden');
      mbNav.setAttribute('data-aos', 'fade-down'); // Animação para ocultar
    } else {
      mbNav.classList.remove('hidden');
      mbNav.setAttribute('data-aos', 'fade-up'); // Animação para mostrar
    }
  });

const productList = document.getElementById('product-list');
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
observer.observe(productList, { childList: true });


/* Função para buscar produtos via API
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

// Função para exibir os produtos na página
function exibirProdutos(products) {
    //productList.innerHTML = ''; // Limpa o container
    //console.log(products.produtos);

    products.produtos.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('food-item', `${product.categoria}-type`); // Adiciona classes dinamicamente

        // Construção do HTML do produto (adapte conforme necessário)
        productItem.innerHTML = `
            <div class="item-wrap bottom-up play-on-scroll">
                <div class="item-img">
                    <div class="img-holder bg-img" style="background-image: url(${product.imagem || 'img/logo2.png'});"></div> </div>
                <div class="item-info">
                    <div>
                        <h3>${product.nome}</h3>
                        <span>${product.preco}</span>
                    </div>
                    <div class="cart-btn" data-product-id="${product.id}">
                        <i class='bx bx-cart-alt'></i>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });

    // Adicione aqui a lógica do carrinho de compras (passo 4)
}

// Chama a função para buscar os produtos ao carregar a página
carregarProdutos();*/