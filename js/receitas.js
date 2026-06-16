import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc
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

    formReceita.reset();

    atualizarResumo();
    exibirReceitas();

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }
});
function atualizarResumo() {

    const receitasTodas =
        JSON.parse(localStorage.getItem("receitas")) || [];

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const receitas =
        receitasTodas.filter(receita =>
            receita.data.startsWith(mesAtual)
        );

    const totalReceitas = receitas.reduce(
        (total, receita) => total + receita.valor,
        0
    );

    document.getElementById("totalReceitas").textContent =
        totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    if (typeof atualizarSaldo === "function") {
        atualizarSaldo();
    }
}

function exibirReceitas() {


    const listaReceitas =
        document.getElementById("listaReceitas");

    const receitasTodas =
        JSON.parse(localStorage.getItem("receitas")) || [];

    const mesAtual =
        document.getElementById("mesSelecionado").value;
       

    const receitas =
        receitasTodas.filter(receita =>
            receita.data.startsWith(mesAtual)
        );

    listaReceitas.innerHTML = "";

    receitas.forEach((receita, index) => {

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
                   onclick="excluirReceita(${receita.id})">
                    Excluir
                </button>
            </div>
        `;
    });
}
function excluirReceita(id) {

    if (!confirm("Deseja realmente excluir esta receita?")) {
        return;
    }

    let receitas =
        JSON.parse(localStorage.getItem("receitas")) || [];

    receitas = receitas.filter(
        receita => receita.id !== id
    );

    localStorage.setItem(
        "receitas",
        JSON.stringify(receitas)
    );

    atualizarResumo();
    atualizarSaldo();
    exibirReceitas();

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }

    if (typeof atualizarGrafico === "function") {
        atualizarGrafico();
    }

    if (typeof atualizarLancamentos === "function") {
        atualizarLancamentos();
    }
}

atualizarResumo();
exibirReceitas();