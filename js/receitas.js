import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const formReceita = document.getElementById("formReceita");
formReceita.addEventListener("submit", async function(event) {
    event.preventDefault();

    const receita = {
    id: Date.now(),

    data: document.getElementById("dataReceita").value,
    origem: document.getElementById("origemReceita").value,
    valor: Number(document.getElementById("valorReceita").value)
};
    const user = auth.currentUser;

if (!user) {
    alert("Faça login primeiro.");
    return;
}

await addDoc(
    collection(db, "usuarios", user.uid, "receitas"),
    receita
);

    alert("Receita salva com sucesso!");
    await testarLeituraReceitas();

    formReceita.reset();

    atualizarResumo();
    exibirReceitas();

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }
});
async function atualizarResumo() {

    const user = auth.currentUser;

    if (!user) return;

    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );

    let totalReceitas = 0;

    snapshot.forEach((doc) => {
        totalReceitas += doc.data().valor;
    });

    console.log("TOTAL DASHBOARD:", totalReceitas);

    document.getElementById("totalReceitas").textContent =
        totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}


 async function exibirReceitas() {

    const listaReceitas =
        document.getElementById("listaReceitas");

        const user = auth.currentUser;

if (!user) return;
        
    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );

    const receitas = [];

  snapshot.forEach((doc) => {
    receitas.push({
        firestoreId: doc.id,
        ...doc.data()
    });
});

    const mesAtual =
    document.getElementById("mesSelecionado").value;

const receitasFiltradas = receitas.filter(receita =>
    receita.data.startsWith(mesAtual)
);

listaReceitas.innerHTML = "";

   receitasFiltradas.forEach((receita, index) => {

        listaReceitas.innerHTML += `
            <div class="item-receita">
                <p><strong>Data:</strong>
                ${new Date(receita.data)
                    .toLocaleDateString('pt-BR')}</p>

                <p><strong>Origem:</strong>
                ${receita.origem}</p>

                <p><strong>Valor:</strong>
                ${receita.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</p>

                <button
                    class="btn-excluir"
                  onclick="excluirReceita('${receita.firestoreId}')">
                    Excluir
                </button>
            </div>
        `;
    });
}
async function excluirReceita(id) {

    if (!confirm("Deseja realmente excluir esta receita?")) {
        return;
    }

    const user = auth.currentUser;

    if (!user) return;

    try {

        await deleteDoc(
            doc(
                db,
                "usuarios",
                user.uid,
                "receitas",
                id
            )
        );

        await atualizarResumo();
        await exibirReceitas();

        if (typeof atualizarHistorico === "function") {
            atualizarHistorico();
        }

        if (typeof atualizarGrafico === "function") {
            atualizarGrafico();
        }

        if (typeof atualizarLancamentos === "function") {
            atualizarLancamentos();
        }

        alert("Receita excluída com sucesso!");

    } catch (erro) {

        console.error("Erro ao excluir receita:", erro);
        alert("Erro ao excluir receita.");

    }
}
async function testarLeituraReceitas() {

    const user = auth.currentUser;

    if (!user) return;

    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );

    let total = 0;
const receitas = [];

snapshot.forEach((doc) => {
    const receita = doc.data();

    receitas.push(receita);

    total += receita.valor;
});

document.getElementById("totalReceitas").textContent =
    total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

window.receitasFirestore = receitas;

}
async function carregarReceitas() {

    const user = auth.currentUser;

    if (!user) return [];

    const snapshot = await getDocs(
        collection(db, "usuarios", user.uid, "receitas")
    );

    return snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
    }));
}

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await atualizarResumo();
    await exibirReceitas();
    await testarLeituraReceitas();

});
window.excluirReceita = excluirReceita;