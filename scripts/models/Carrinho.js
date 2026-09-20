class Carrinho {

    constructor() {

        const carrinhoSalvo =
            localStorage.getItem("carrinhoOOP");

        this.itens =
            carrinhoSalvo
                ? JSON.parse(carrinhoSalvo)
                : [];

    }

    salvar() {

        localStorage.setItem(
            "carrinhoOOP",
            JSON.stringify(this.itens)
        );

    }

    adicionar(produto) {

        if (produto.estoque <= 0) {
            return;
        }

        const itemExistente =
            this.itens.find(item => item.produto.codigo === produto.codigo);

        if (itemExistente) {

            if (itemExistente.quantidade < produto.estoque) {
                itemExistente.quantidade++;
            }

        } else {

            this.itens.push({
                produto: produto,
                quantidade: 1
            });

        }

        this.salvar();

    }

    remover(produto) {

        const indice =
            this.itens.findIndex(item => item.produto.codigo === produto.codigo);

        if (indice !== -1) {
            this.itens.splice(indice, 1);
        }

        this.salvar();

    }

    diminuir(produto) {

        const itemExistente =
            this.itens.find(item => item.produto.codigo === produto.codigo);

        if (itemExistente) {

            itemExistente.quantidade--;

            if (itemExistente.quantidade <= 0) {

                this.remover(produto);

            } else {

                this.salvar();

            }

        }

    }

    calcularQuantidadeTotal() {

    let total = 0;

    for (let i = 0; i < this.itens.length; i++) {

        total += this.itens[i].quantidade;

    }

    return total;

}

calcularSubtotal() {

    let subtotal = 0;

    for (let i = 0; i < this.itens.length; i++) {

        const item = this.itens[i];

        subtotal += item.produto.preco * item.quantidade;

    }

    return subtotal;

}

calcularTotal() {

    return this.calcularSubtotal();

    }

}