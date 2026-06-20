const mesSelecionado =
    document.getElementById("mesSelecionado");

const hoje = new Date();

mesSelecionado.value =
    `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}`;

mesSelecionado.addEventListener("change", () => {

    atualizarResumo();
    atualizarGastos();
    atualizarSaldo();

    exibirReceitas();
    exibirGastos();
    atualizarHistorico();
    atualizarLancamentos();    
    atualizarGrafico();
});

atualizarLancamentos();//

function atualizarLancamentos() {

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

    const total =
        receitas.length + gastos.length;

    document.getElementById(
        "totalLancamentos"
    ).textContent = total;
}