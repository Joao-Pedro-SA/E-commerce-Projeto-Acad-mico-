class Estoque {
    static ler() {
        try {
            const salvo = JSON.parse(localStorage.getItem("estoqueProdutos") || "{}");
            return salvo && typeof salvo === "object" && !Array.isArray(salvo) ? salvo : {};
        } catch {
            return {};
        }
    }

    static consultar(produto) {
        const salvo = this.ler()[produto.codigo];
        return Number.isInteger(salvo) && salvo >= 0 ? salvo : Number(produto.estoque);
    }

    static disponivel(itens) {
        return itens.every(item => item.quantidade <= this.consultar(item.produto));
    }

    static baixar(itens) {
        if (!this.disponivel(itens)) return false;
        const quantidades = this.ler();
        for (const item of itens) {
            quantidades[item.produto.codigo] = this.consultar(item.produto) - item.quantidade;
        }
        localStorage.setItem("estoqueProdutos", JSON.stringify(quantidades));
        return true;
    }
}

class Carrinho {

    constructor() {

        const carrinhoSalvo =
            localStorage.getItem("carrinhoOOP");

        try {
            this.itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
            if (!Array.isArray(this.itens)) this.itens = [];
        } catch {
            this.itens = [];
        }

        try {
            const anteriores = JSON.parse(localStorage.getItem("carrinho") || "[]");
            if (Array.isArray(anteriores)) {
                for (const produto of anteriores) {
                    if (produto && produto.codigo !== undefined && Number.isFinite(Number(produto.preco))) {
                        this.adicionar(produto);
                    }
                }
                if (anteriores.length) localStorage.removeItem("carrinho");
            }
        } catch {
        }

    }

    salvar() {

        localStorage.setItem(
            "carrinhoOOP",
            JSON.stringify(this.itens)
        );

    }

    adicionar(produto) {

        const disponivel = Estoque.consultar(produto);
        if (disponivel <= 0) return false;

        const itemExistente =
            this.itens.find(item => item.produto.codigo === produto.codigo);

        if (itemExistente) {

            if (itemExistente.quantidade >= disponivel) return false;
            itemExistente.quantidade++;

        } else {

            this.itens.push({
                produto: produto,
                quantidade: 1
            });

        }

        this.salvar();

        return true;

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

    return this.calcularSubtotal() - this.calcularDesconto();

    }

    esvaziar() {
        this.itens = [];
        this.salvar();
    }

calcularDesconto() {
    const subtotal = this.calcularSubtotal();
    if (subtotal >= 300) {
        return subtotal * 0.10;
    } else {
        return 0;
    }
}

}
