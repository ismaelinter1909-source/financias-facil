import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
async function atualizarContasPagar() {

    const user = auth.currentUser;

    if (!user) return;

    const lista =
        document.getElementById("listaContasPagar");

    if (!lista) return;

    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    lista.innerHTML = "";

    let total = 0;

    const hoje = new Date();

    snapshot.forEach((doc) => {

        const gasto = doc.data();

        // Mostrar apenas parcelamentos
        if (!gasto.totalParcelas || gasto.totalParcelas <= 1)
            return;

        const dataParcela = new Date(gasto.data);

        // Mostrar apenas parcelas futuras
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        if (dataParcela < hoje)
            return;

        total += gasto.valor;

        lista.innerHTML += `
            <div class="item-gasto">

                <p>
                    <strong>
                        ${gasto.descricao || gasto.categoria}
                    </strong>
                </p>

                <p>
                    Data:
                    ${dataParcela.toLocaleDateString("pt-BR")}
                </p>

                <p>
                    Parcela:
                    ${gasto.parcelaAtual}/${gasto.totalParcelas}
                </p>

                <p>
                    Valor:
                    ${gasto.valor.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )}
                </p>

            </div>
        `;

    });

    lista.innerHTML += `
        <hr>

        <h3>
            Total Previsto:
            ${total.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            )}
        </h3>
    `;

  

await atualizarDashboardPrevisao();
}

window.atualizarContasPagar =
    atualizarContasPagar;
    import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await atualizarContasPagar();

});

async function atualizarDashboardPrevisao() {
    

    const user = auth.currentUser;

    if (!user) return;

    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    let totalPagar = 0;

    snapshot.forEach((doc) => {

        const gasto = doc.data();

        if (
            gasto.totalParcelas &&
            gasto.parcelaAtual &&
            gasto.parcelaAtual > 1
        ) {
            totalPagar += Number(gasto.valor || 0);
        }

    });

    document.getElementById("totalContasPagar").textContent =
        totalPagar.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    const saldoTexto =
    document.getElementById("saldoAtual")
        .textContent
        .trim();

const saldoNumero = Number(
    saldoTexto
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/\s/g, "")
);
console.log("Saldo texto:", saldoTexto);
console.log("Saldo numero:", saldoNumero);
console.log("Total pagar:", totalPagar);
    const saldoProjetado =
        saldoNumero - totalPagar;

    document.getElementById("saldoProjetado").textContent =
        saldoProjetado.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
         await atualizarDashboardPrevisao();
         

}
window.atualizarContasPagar =
    atualizarContasPagar;

window.atualizarDashboardPrevisao =
    atualizarDashboardPrevisao;
