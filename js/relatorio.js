const btnRelatorio =
    document.getElementById("btnRelatorio");

btnRelatorio.addEventListener("click", gerarPDF);

function gerarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // ==========================
    // CABEÇALHO
    // ==========================

    doc.setFillColor(41, 128, 185);

    doc.rect(
        0,
        0,
        210,
        25,
        "F"
    );

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(20);

    doc.text(
        "Controle Financeiro",
        105,
        15,
        {
            align: "center"
        }
    );

    doc.setTextColor(0, 0, 0);

    // ==========================
    // DADOS
    // ==========================

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

    const saldo =
        totalReceitas - totalGastos;

    // ==========================
    // MÊS
    // ==========================

    doc.setFontSize(12);

    doc.text(
        `Mês de Referência: ${mesAtual}`,
        15,
        32
    );

    // ==========================
    // CARDS
    // ==========================

    // RECEITAS

    doc.setFillColor(46, 204, 113);

    doc.roundedRect(
        15,
        40,
        55,
        25,
        3,
        3,
        "F"
    );

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(12);

    doc.text(
        "RECEITAS",
        42,
        50,
        {
            align: "center"
        }
    );

    doc.setFontSize(14);

    doc.text(
        totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }),
        42,
        60,
        {
            align: "center"
        }
    );

    // GASTOS

    doc.setFillColor(231, 76, 60);

    doc.roundedRect(
        78,
        40,
        55,
        25,
        3,
        3,
        "F"
    );

    doc.text(
        "GASTOS",
        105,
        50,
        {
            align: "center"
        }
    );

    doc.text(
        totalGastos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }),
        105,
        60,
        {
            align: "center"
        }
    );

    // SALDO

    if (saldo >= 0) {

        doc.setFillColor(241, 196, 15);

    } else {

        doc.setFillColor(192, 57, 43);
    }

    doc.roundedRect(
        141,
        40,
        55,
        25,
        3,
        3,
        "F"
    );

    doc.text(
        "SALDO",
        168,
        50,
        {
            align: "center"
        }
    );

    doc.text(
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }),
        168,
        60,
        {
            align: "center"
        }
    );

    doc.setTextColor(0, 0, 0);

    // ==========================
    // GRÁFICO
    // ==========================

    const canvas =
        document.getElementById("graficoGastos");

    if (canvas) {

        const imagemGrafico =
            canvas.toDataURL("image/png");

        doc.addImage(
            imagemGrafico,
            "PNG",
            15,
            75,
            180,
            60
        );
    }

    // ==========================
    // RECEITAS
    // ==========================

    let y = 150;

    doc.setFontSize(14);

    doc.text(
        "RECEITAS",
        15,
        y
    );

    y += 8;

    doc.setFontSize(10);

    receitas.forEach(receita => {

        doc.text(
            `${receita.data} | ${receita.origem} | ${receita.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`,
            15,
            y
        );

        y += 6;
    });

    // ==========================
    // GASTOS
    // ==========================

    y += 10;

    doc.setFontSize(14);

    doc.text(
        "GASTOS",
        15,
        y
    );

    y += 8;

    doc.setFontSize(10);

    gastos.forEach(gasto => {

        doc.text(
            `${gasto.data} | ${gasto.categoria} | ${gasto.pagamento} | ${gasto.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`,
            15,
            y
        );

        y += 6;
    });

    // ==========================
    // RESUMO FINAL
    // ==========================

    y += 10;

    doc.setFontSize(14);

    doc.text(
        "RESUMO FINAL",
        15,
        y
    );

    y += 10;

    doc.setFontSize(12);

    doc.text(
        `Total Receitas: ${totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`,
        15,
        y
    );

    y += 8;

    doc.text(
        `Total Gastos: ${totalGastos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`,
        15,
        y
    );

    y += 8;

    doc.text(
        `Saldo Final: ${saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`,
        15,
        y
    );

    // ==========================
    // RODAPÉ
    // ==========================

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(
        `Gerado em ${new Date().toLocaleString("pt-BR")}`,
        105,
        290,
        {
            align: "center"
        }
    );

    // ==========================
    // SALVAR
    // ==========================

    doc.save(
        `relatorio-${mesAtual}.pdf`
    );
}