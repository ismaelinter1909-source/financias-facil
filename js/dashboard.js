import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const mesSelecionado =
    document.getElementById("mesSelecionado");

const hoje = new Date();

mesSelecionado.value =
    `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}`;

mesSelecionado.addEventListener("change", async () => {
if (typeof atualizarResumo === "function") {
    await atualizarResumo();
}
    await atualizarGastos();
    await atualizarSaldo();

    if (typeof exibirReceitas === "function") {
        await exibirReceitas();
    }

    if (typeof exibirGastos === "function") {
        await exibirGastos();
    }

    if (typeof atualizarHistorico === "function") {
        await atualizarHistorico();
    }

    if (typeof atualizarLancamentos === "function") {
        await atualizarLancamentos();
    }

    if (typeof atualizarGrafico === "function") {
        await atualizarGrafico();
    }

});

async function atualizarLancamentos() {

    const user = auth.currentUser;

    if (!user) return;

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const snapshotReceitas = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );

    const snapshotGastos = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    let totalReceitas = 0;
    let totalGastos = 0;

    snapshotReceitas.forEach((doc) => {

        const receita = doc.data();

        if (receita.data.startsWith(mesAtual)) {
            totalReceitas++;
        }
    });

    snapshotGastos.forEach((doc) => {

        const gasto = doc.data();

        if (gasto.data.startsWith(mesAtual)) {
            totalGastos++;
        }
    });

    document.getElementById(
        "totalLancamentos"
    ).textContent = totalReceitas + totalGastos;
}
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await atualizarLancamentos();

});
