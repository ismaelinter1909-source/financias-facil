const formGasto =
    document.getElementById("formGasto");

formGasto.addEventListener("submit", function(event) {

    event.preventDefault();

    const gasto = {
    id: Date.now(),

    data: document.getElementById("dataGasto").value,
    categoria: document.getElementById("categoriaGasto").value,
    pagamento: document.getElementById("pagamentoGasto").value,
    valor: Number(document.getElementById("valorGasto").value)
};

    let gastos =
        JSON.parse(localStorage.getItem("gastos")) || [];

    gastos.push(gasto);

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    alert("Gasto salvo com sucesso!");

    formGasto.reset();

    atualizarGastos();
    exibirGastos();

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }
});

function atualizarGastos() {

    const gastosTodos =
        JSON.parse(localStorage.getItem("gastos")) || [];

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const gastos =
        gastosTodos.filter(gasto =>
            gasto.data.startsWith(mesAtual)
        );

    const totalGastos = gastos.reduce(
        (total, gasto) => total + gasto.valor,
        0
    );

    document.getElementById("totalGastos").textContent =
        totalGastos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    atualizarSaldo();
}

function atualizarSaldo() {

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const receitas = (
        JSON.parse(localStorage.getItem("receitas")) || []
    ).filter(receita =>
        receita.data.startsWith(mesAtual)
    );

    const gastos = (
        JSON.parse(localStorage.getItem("gastos")) || []
    ).filter(gasto =>
        gasto.data.startsWith(mesAtual)
    );

    const totalReceitas = receitas.reduce(
        (total, receita) => total + receita.valor,
        0
    );

    const totalGastos = gastos.reduce(
        (total, gasto) => total + gasto.valor,
        0
    );

    const saldo = totalReceitas - totalGastos;

    const elementoSaldo =
        document.getElementById("saldoAtual");

    const cardSaldo =
        document.querySelector(".saldo");

    elementoSaldo.textContent =
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    if (saldo < 0) {
        cardSaldo.style.background = "#c0392b";
    } else {
        cardSaldo.style.background = "#f39c12";
    }
}

function exibirGastos() {

    const listaGastos =
        document.getElementById("listaGastos");

    const gastosTodos =
        JSON.parse(localStorage.getItem("gastos")) || [];

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const gastos =
        gastosTodos.filter(gasto =>
            gasto.data.startsWith(mesAtual)
        );

    listaGastos.innerHTML = "";

    gastos.forEach((gasto, index) => {

        listaGastos.innerHTML += `
            <div class="item-gasto">

                <p><strong>Data:</strong>
                ${new Date(gasto.data)
                    .toLocaleDateString('pt-BR')}</p>

                <p><strong>Categoria:</strong>
                ${gasto.categoria}</p>

                <p><strong>Pagamento:</strong>
                ${gasto.pagamento}</p>

                <p><strong>Valor:</strong>
                ${gasto.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</p>

                <button
                    class="btn-excluir"
                    onclick="excluirGasto(${index})">
                    Excluir
                </button>

            </div>
        `;
    });
}

function excluirGasto(index) {

    let gastos =
        JSON.parse(localStorage.getItem("gastos")) || [];

    gastos.splice(index, 1);

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

    atualizarGastos();
    exibirGastos();

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }
    if (typeof atualizarGrafico === "function") {
    atualizarGrafico();
}
}

atualizarGastos();
atualizarSaldo();
exibirGastos();