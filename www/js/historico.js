import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
async function atualizarHistorico() {


    const listaHistorico =
        document.getElementById("listaHistorico");

    if (!listaHistorico) {
        
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        
        return;
    }

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const snapshotReceitas = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );
    
    const snapshotGastos = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    const receitas = [];

    snapshotReceitas.forEach((doc) => {

        const receita = doc.data();

        if (receita.data.startsWith(mesAtual)) {

            receitas.push({
                tipo: "receita",
                data: receita.data,
                descricao: receita.origem,
                valor: receita.valor
            });

        }

    });

    const gastos = [];

    snapshotGastos.forEach((doc) => {

        const gasto = doc.data();

        if (gasto.data.startsWith(mesAtual)) {

            gastos.push({
                tipo: "gasto",
                data: gasto.data,
                descricao: gasto.categoria,
                valor: gasto.valor
            });

        }

    });

    const movimentos = [
        ...receitas,
        ...gastos
    ];

    movimentos.sort((a, b) =>
        new Date(b.data) - new Date(a.data)
    );

    listaHistorico.innerHTML = "";
   
    if (movimentos.length === 0) {

        listaHistorico.innerHTML =
            "<p>Nenhum lançamento encontrado para este mês.</p>";

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
                        ${formatarData(item.data)}
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


window.atualizarHistorico = atualizarHistorico;

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await atualizarHistorico();

});