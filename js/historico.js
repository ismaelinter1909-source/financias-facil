function atualizarHistorico() {

    const listaHistorico =
        document.getElementById("listaHistorico");

    if (!listaHistorico) return;

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const receitas = (
        JSON.parse(localStorage.getItem("receitas")) || []
    )
    .filter(receita =>
        receita.data.startsWith(mesAtual)
    )
    .map(receita => ({
        tipo: "receita",
        data: receita.data,
        descricao: receita.origem,
        valor: receita.valor
    }));

    const gastos = (
        JSON.parse(localStorage.getItem("gastos")) || []
    )
    .filter(gasto =>
        gasto.data.startsWith(mesAtual)
    )
    .map(gasto => ({
        tipo: "gasto",
        data: gasto.data,
        descricao: gasto.categoria,
        valor: gasto.valor
    }));

    const movimentos = [
        ...receitas,
        ...gastos
    ];

    movimentos.sort((a, b) =>
        new Date(b.data) - new Date(a.data)
    );

    listaHistorico.innerHTML = "";

    if (movimentos.length === 0) {

        listaHistorico.innerHTML = `
            <p>Nenhum lançamento encontrado para este mês.</p>
        `;

        return;
    }

    movimentos.forEach(item => {

        const classe =
            item.tipo === "receita"
                ? "historico-receita"
                : "historico-gasto";

        const sinal =
            item.tipo === "receita"
                ? "+"
                : "-";

        listaHistorico.innerHTML += `
            <div class="item-historico ${classe}">

                <p>
                    <strong>
                        ${new Date(item.data)
                            .toLocaleDateString("pt-BR")}
                    </strong>
                </p>

                <p>
                    ${sinal} ${item.descricao}
                </p>

                <p>
                    ${item.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </p>

            </div>
        `;
    });

}

atualizarHistorico();
window.atualizarHistorico = atualizarHistorico;