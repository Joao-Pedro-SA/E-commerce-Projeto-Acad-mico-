const carrinho = new Carrinho();
const listaCarrinho = document.getElementById("lista-carrinho");
const contadorItens = document.getElementById("contador-itens");
const subtotalCarrinho = document.getElementById("subtotal-carrinho");
const descontoCarrinho = document.getElementById("desconto-carrinho");
const entregaCarrinho = document.getElementById("entrega-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const parcelamento = document.getElementById("parcelamento");
const botaoCheckout = document.getElementById("botao-checkout");
const statusCheckout = document.getElementById("status-checkout");

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarResumo() {
    const quantidade = carrinho.calcularQuantidadeTotal();
    const subtotal = carrinho.calcularSubtotal();
    const desconto = carrinho.calcularDesconto();
    const total = carrinho.calcularTotal();

    contadorItens.textContent = quantidade + (quantidade === 1 ? " item" : " itens");
    subtotalCarrinho.textContent = formatarMoeda(subtotal);
    descontoCarrinho.textContent = formatarMoeda(desconto);
    entregaCarrinho.textContent = subtotal >= 299 ? "Grátis" : "A calcular";
    entregaCarrinho.classList.toggle("free-shipping", subtotal >= 299);
    totalCarrinho.textContent = formatarMoeda(total);
    parcelamento.textContent = total > 0
        ? "ou até 6x de " + formatarMoeda(total / 6) + " sem juros"
        : "ou até 6x sem juros";
    botaoCheckout.disabled = quantidade === 0;
}

function mostrarCarrinho() {
    listaCarrinho.replaceChildren();
    if (!carrinho.itens.length) {
        const vazio = document.createElement("div");
        vazio.className = "cart-empty";
        vazio.innerHTML = '<h2>Seu carrinho está vazio</h2><p>Adicione produtos para continuar sua compra.</p><a href="index.html" class="checkout-button">Ver produtos</a>';
        listaCarrinho.appendChild(vazio);
        atualizarResumo();
        return;
    }

    for (const item of carrinho.itens) {
        const produto = item.produto;
        const artigo = document.createElement("article");
        artigo.className = "cart-item";
        const imagem = document.createElement("img");
        imagem.src = produto.imagem;
        imagem.alt = produto.nome;
        const foto = document.createElement("div");
        foto.className = "cart-item-image";
        foto.appendChild(imagem);

        const conteudo = document.createElement("div");
        conteudo.className = "cart-item-content";
        const topo = document.createElement("div");
        topo.className = "cart-item-top";
        const descricao = document.createElement("div");
        const categoria = document.createElement("span");
        categoria.className = "category";
        categoria.textContent = produto.categoria;
        const nome = document.createElement("h2");
        nome.textContent = produto.nome;
        const preco = document.createElement("p");
        preco.className = "item-variation";
        preco.textContent = formatarMoeda(produto.preco) + " por unidade";
        descricao.append(categoria, nome, preco);
        const remover = criarBotao("Remover", "remove", produto.codigo, "remove-item");
        topo.append(descricao, remover);

        const rodape = document.createElement("div");
        rodape.className = "cart-item-bottom";
        const quantidade = document.createElement("div");
        quantidade.className = "quantity-box";
        const menos = criarBotao("−", "decrease", produto.codigo);
        menos.setAttribute("aria-label", "Diminuir quantidade");
        const numero = document.createElement("span");
        numero.textContent = item.quantidade;
        const mais = criarBotao("+", "increase", produto.codigo);
        mais.setAttribute("aria-label", "Aumentar quantidade");
        mais.disabled = item.quantidade >= Estoque.consultar(produto);
        if (mais.disabled) mais.title = "Limite do estoque atingido";
        quantidade.append(menos, numero, mais);
        const totalItem = document.createElement("div");
        totalItem.className = "item-price";
        const legenda = document.createElement("span");
        legenda.textContent = "Total do item";
        const valor = document.createElement("strong");
        valor.textContent = formatarMoeda(produto.preco * item.quantidade);
        totalItem.append(legenda, valor);
        rodape.append(quantidade, totalItem);
        conteudo.append(topo, rodape);
        artigo.append(foto, conteudo);
        listaCarrinho.appendChild(artigo);
    }
    atualizarResumo();
}

function criarBotao(texto, acao, codigo, classe = "") {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.dataset.action = acao;
    botao.dataset.codigo = codigo;
    if (classe) botao.className = classe;
    return botao;
}

listaCarrinho.addEventListener("click", function (evento) {
    const botao = evento.target.closest("button[data-action]");
    if (!botao) return;
    const item = carrinho.itens.find(entrada => String(entrada.produto.codigo) === botao.dataset.codigo);
    if (!item) return;
    if (botao.dataset.action === "remove") carrinho.remover(item.produto);
    if (botao.dataset.action === "decrease") carrinho.diminuir(item.produto);
    if (botao.dataset.action === "increase") carrinho.adicionar(item.produto);
    mostrarCarrinho();
});

botaoCheckout.addEventListener("click", function () {
    if (!carrinho.itens.length) {
        statusCheckout.textContent = "Seu carrinho está vazio. Adicione produtos para finalizar.";
        return;
    }
    if (!Estoque.disponivel(carrinho.itens)) {
        statusCheckout.textContent = "O estoque mudou. Ajuste as quantidades do carrinho antes de finalizar.";
        mostrarCarrinho();
        return;
    }
    var resumoProdutos = "";
    let indice = 0;
    while (indice < carrinho.itens.length) {
        const item = carrinho.itens[indice];
        resumoProdutos += item.produto.nome + " - " + item.quantidade +
            (item.quantidade === 1 ? " unidade" : " unidades") + "\n";
        indice++;
    }
    const resumo = "Confirma a compra simulada?\n\nProdutos:\n" + resumoProdutos +
        "\n\nSubtotal: " + formatarMoeda(carrinho.calcularSubtotal()) +
        "\nDesconto: " + formatarMoeda(carrinho.calcularDesconto()) +
        "\nTotal dos produtos: " + formatarMoeda(carrinho.calcularTotal()) +
        "\nEntrega: " + (carrinho.calcularSubtotal() >= 299 ? "grátis" : "a calcular");
    if (confirm(resumo)) {
        if (!Estoque.baixar(carrinho.itens)) {
            statusCheckout.textContent = "O estoque mudou. Ajuste as quantidades do carrinho antes de finalizar.";
            mostrarCarrinho();
            return;
        }
        carrinho.esvaziar();
        mostrarCarrinho();
        statusCheckout.textContent = "Compra simulada concluída com sucesso!";
        alert("Compra simulada concluída com sucesso!");
    }
});

mostrarCarrinho();
