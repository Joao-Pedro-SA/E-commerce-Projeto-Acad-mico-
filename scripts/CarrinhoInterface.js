const carrinho = new Carrinho();

const listaCarrinho =
    document.getElementById("lista-carrinho");

const contadorItens =
    document.getElementById("contador-itens");

const subtotalCarrinho =
    document.getElementById("subtotal-carrinho");

const totalCarrinho =
    document.getElementById("total-carrinho");


function atualizarResumo() {

    const quantidade =
        carrinho.calcularQuantidadeTotal();

    const subtotal =
        carrinho.calcularSubtotal();

    const total =
        carrinho.calcularTotal();

    contadorItens.textContent =
        quantidade + (quantidade === 1 ? " item" : " itens");

    subtotalCarrinho.textContent =
        "R$ " + subtotal.toFixed(2).replace(".", ",");

    totalCarrinho.textContent =
        "R$ " + total.toFixed(2).replace(".", ",");

}


function mostrarCarrinho() {

    listaCarrinho.innerHTML = "";

    if (carrinho.itens.length === 0) {

        listaCarrinho.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `;

        atualizarResumo();

        return;
    }

    for (let i = 0; i < carrinho.itens.length; i++) {

        const item = carrinho.itens[i];

        const produto = item.produto;

        const subtotal =
            produto.preco * item.quantidade;

        const artigo =
            document.createElement("article");

        artigo.classList.add("cart-item");

        artigo.innerHTML = `
            <div class="cart-item-image">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>

            <div class="cart-item-content">

                <div class="cart-item-top">

                    <div>

                        <span class="category">
                            ${produto.categoria}
                        </span>

                        <h2>
                            ${produto.nome}
                        </h2>

                        <p>
                            R$ ${produto.preco
                                .toFixed(2)
                                .replace(".", ",")}
                        </p>

                    </div>

                    <button
                        class="remove-item"
                        type="button"
                        data-codigo="${produto.codigo}"
                    >
                        Remover
                    </button>

                </div>

                <div class="cart-item-bottom">

                    <div class="quantity-box">

                        <button
                            type="button"
                            class="btn-diminuir"
                            data-codigo="${produto.codigo}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantidade}
                        </span>

                        <button
                            type="button"
                            class="btn-aumentar"
                            data-codigo="${produto.codigo}"
                        >
                            +
                        </button>

                    </div>

                    <div class="item-price">

                        <span>Subtotal</span>

                        <strong>
                            R$ ${subtotal
                                .toFixed(2)
                                .replace(".", ",")}
                        </strong>

                    </div>

                </div>

            </div>
        `;

        listaCarrinho.appendChild(artigo);

    }

    atualizarResumo();

}


listaCarrinho.addEventListener(
    "click",
    function (evento) {

        const botaoDiminuir =
            evento.target.closest(".btn-diminuir");

        const botaoAumentar =
            evento.target.closest(".btn-aumentar");

        const botaoRemover =
            evento.target.closest(".remove-item");


        if (botaoDiminuir) {

            const codigo =
                Number(botaoDiminuir.dataset.codigo);

            const item =
                carrinho.itens.find(
                    item => item.produto.codigo === codigo
                );

            if (item) {

                carrinho.diminuir(item.produto);

                mostrarCarrinho();
                atualizarResumo();

            }

        }


        if (botaoAumentar) {

            const codigo =
                Number(botaoAumentar.dataset.codigo);

            const item =
                carrinho.itens.find(
                    item => item.produto.codigo === codigo
                );

            if (item) {

                carrinho.adicionar(item.produto);

                mostrarCarrinho();
                atualizarResumo();

            }

        }


        if (botaoRemover) {

            const codigo =
                Number(botaoRemover.dataset.codigo);

            const item =
                carrinho.itens.find(
                    item => item.produto.codigo === codigo
                );

            if (item) {

                carrinho.remover(item.produto);

                mostrarCarrinho();
                atualizarResumo();

            }

        }

    }
);


mostrarCarrinho();
atualizarResumo();