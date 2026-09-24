class Produto {

    constructor(codigo, nome, categoria, preco, estoque, imagem) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.estoqueInicial = estoque;
        this.estoque = Estoque.consultar({ codigo, estoque });
        this.imagem = imagem;
    }

    validar() {
        return (
            this.codigo !== undefined &&
            this.nome &&
            this.categoria &&
            this.preco !== undefined &&
            this.estoque !== undefined &&
            this.imagem
        );
    }
}

const produto1 = new Produto(
    1,
    "Camiseta Oversized",
    "Camisetas",
    129.90,
    10,
    "./images/camisa oversized.webp"
);

const produto2 = new Produto(
    2,
    "Relógio Smartwatch",
    "Relógios",
    189.90,
    8,
    "./images/relogio smart.jpg"
);

const produto3 = new Produto(
    3,
    "Teclado Red Dragon - Branco",
    "Teclados",
    379.90,
    3,
    "./images/teclado red dragon.webp"
);

const produto4 = new Produto(
    4,
    "iPhone 17",
    "Celulares",
    12700.00,
    5,
    "./images/iphone 17.jpg"
);

const produto5 = new Produto(
    5,
    "Fone Bluetooth",
    "Fones",
    1200.00,
    12,
    "./images/fone bluetooth.jpg"
);

const produto6 = new Produto(
    6,
    "Fone Bluetooth Sem Fio",
    "Fones",
    700.00,
    0,
    "./images/fone sem fio.jpg"
);

const produtos = [
    produto1,
    produto2,
    produto3,
    produto4,
    produto5,
    produto6
];

const listaProdutos =
    document.getElementById("lista-produtos");

const campoBusca =
    document.getElementById("busca-produto");

const filtroCategoria =
    document.getElementById("filtro-categoria");

const mensagemProdutos =
    document.getElementById("mensagem-produtos");

const contadorCarrinho =
    document.getElementById("contador-carrinho");

    const carrinho = new Carrinho();


    function adicionarAoCarrinho(produto) {

    if (Estoque.consultar(produto) <= 0) {

        alert("Produto sem estoque.");

        return;
    }

    if (!carrinho.adicionar(produto)) {
        alert("Quantidade máxima disponível em estoque.");
        return;
    }

    atualizarContadorCarrinho();

    alert(
        produto.nome + " foi adicionado ao carrinho!"
    );

}

function atualizarContadorCarrinho() {

    let total = 0;

    for (let i = 0; i < carrinho.itens.length; i++) {

        total += carrinho.itens[i].quantidade;

    }

    contadorCarrinho.textContent = total;

}

function criarCategorias() {

    const categorias = [];


    for (let i = 0; i < produtos.length; i++) {

        const categoria = produtos[i].categoria.trim();


        if (!categorias.includes(categoria)) {
            categorias.push(categoria);
        }

    }


    for (let i = 0; i < categorias.length; i++) {

        const option = document.createElement("option");

        option.value = categorias[i];

        option.textContent = categorias[i];

        filtroCategoria.appendChild(option);

    }

}
function mostrarProdutos(lista) {

    listaProdutos.innerHTML = "";

    mensagemProdutos.textContent = "";

    if (lista.length === 0) {

        mensagemProdutos.textContent =
            "Nenhum produto encontrado.";

        return;

    }


    for (let i = 0; i < lista.length; i++) {

        const produto = lista[i];

        const card =
            document.createElement("article");

        card.classList.add("product-card");

        const imagemContainer =
            document.createElement("div");

        imagemContainer.classList.add(
            "product-image"
        );


        const imagem =
            document.createElement("img");

        imagem.src = produto.imagem;

        imagem.alt = produto.nome;

        imagem.classList.add("cardImg");


        imagemContainer.appendChild(imagem);

        const corpoCard =
            document.createElement("div");

        corpoCard.classList.add(
            "product-body"
        );

        const categoria =
            document.createElement("span");

        categoria.classList.add("category");

        categoria.textContent =
            produto.categoria;

        const nome =
            document.createElement("h3");

        nome.textContent =
            produto.nome;

        const disponibilidade =
            document.createElement("div");

        disponibilidade.classList.add(
            "availability"
        );


        if (produto.estoque === 0) {

            disponibilidade.textContent =
                "Produto indisponível";

            disponibilidade.classList.add(
                "out-stock"
            );

        }

        else if (produto.estoque <= 3) {

            disponibilidade.textContent =
                produto.estoque + (produto.estoque === 1 ? " unidade disponível" : " unidades disponíveis");

            disponibilidade.classList.add(
                "low-stock"
            );

        }

        else {

            disponibilidade.textContent =
                produto.estoque + " unidades em estoque";

            disponibilidade.classList.add(
                "in-stock"
            );

        }

        const precoContainer =
            document.createElement("div");

        precoContainer.classList.add(
            "price-row"
        );


        const preco =
            document.createElement("strong");


        preco.textContent =
            produto.preco.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );


        precoContainer.appendChild(preco);

        const botao =
            document.createElement("button");


        botao.classList.add(
            "add-cart"
        );


        if (produto.estoque === 0) {

            botao.textContent =
                "Produto indisponível";

            botao.disabled = true;

        }

        else {

            botao.textContent =
                "Adicionar ao carrinho";


            botao.addEventListener(
                "click",
                function () {

                    adicionarAoCarrinho(
                        produto
                    );

                }
            );

        }

        corpoCard.appendChild(categoria);

        corpoCard.appendChild(nome);

        corpoCard.appendChild(
            disponibilidade
        );

        corpoCard.appendChild(
            precoContainer
        );

        corpoCard.appendChild(botao);


        card.appendChild(
            imagemContainer
        );

        card.appendChild(
            corpoCard
        );


        listaProdutos.appendChild(card);

    }

}

function filtrarProdutos() {

    const textoBusca = campoBusca.value
        .toLowerCase()
        .trim();

    const categoriaSelecionada = filtroCategoria.value
        .toLowerCase()
        .trim();

    const produtosFiltrados = [];


    for (let i = 0; i < produtos.length; i++) {

        const produto = produtos[i];

        const nomeProduto = produto.nome
            .toLowerCase()
            .trim();

        const categoriaProduto = produto.categoria
            .toLowerCase()
            .trim();


        const correspondeBusca =
            nomeProduto.includes(textoBusca);


        const correspondeCategoria =
            categoriaSelecionada === "todos" ||
            categoriaProduto === categoriaSelecionada;


        if (correspondeBusca && correspondeCategoria) {
            produtosFiltrados.push(produto);
        }

    }


    mostrarProdutos(produtosFiltrados);
}

campoBusca.addEventListener(
    "input",
    filtrarProdutos
);

filtroCategoria.addEventListener(
    "change",
    filtrarProdutos
);

criarCategorias();

mostrarProdutos(produtos);

atualizarContadorCarrinho();

if (typeof window !== "undefined") {
    window.addEventListener("pageshow", function (evento) {
        if (!evento.persisted) return;
        carrinho.itens = new Carrinho().itens;
        for (const produto of produtos) {
            produto.estoque = Estoque.consultar({ codigo: produto.codigo, estoque: produto.estoqueInicial });
        }
        filtrarProdutos();
        atualizarContadorCarrinho();
    });
}
