// ======================
// EXPORTAR BACKUP
// ======================

document
    .getElementById("btnExportar")
    .addEventListener(
        "click",
        exportarBackup
    );

function exportarBackup() {

    const dados = {

        receitas:
            JSON.parse(
                localStorage.getItem("receitas")
            ) || [],

        gastos:
            JSON.parse(
                localStorage.getItem("gastos")
            ) || []

    };

    const blob = new Blob(
        [
            JSON.stringify(
                dados,
                null,
                2
            )
        ],
        {
            type: "application/json"
        }
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        `backup-financas-${new Date()
            .toISOString()
            .slice(0,10)}.json`;

    link.click();
}

// ======================
// IMPORTAR BACKUP
// ======================

document
    .getElementById("btnImportar")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "arquivoBackup"
                )
                .click();
        }
    );

document
    .getElementById("arquivoBackup")
    .addEventListener(
        "change",
        importarBackup
    );

function importarBackup(event) {

    const arquivo =
        event.target.files[0];

    if (!arquivo) return;

    const leitor =
        new FileReader();

    leitor.onload =
        function(e) {

        try {

            const dados =
                JSON.parse(
                    e.target.result
                );

            localStorage.setItem(
                "receitas",
                JSON.stringify(
                    dados.receitas || []
                )
            );

            localStorage.setItem(
                "gastos",
                JSON.stringify(
                    dados.gastos || []
                )
            );

            alert(
                "Backup restaurado com sucesso!"
            );

            location.reload();

        } catch {

            alert(
                "Arquivo inválido!"
            );
        }
    };

    leitor.readAsText(
        arquivo
    );
}