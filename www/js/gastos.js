
import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let gastoEditando = null;

const formGasto =
    document.getElementById("formGasto");

formGasto.addEventListener("submit", async function(event) {
    
    event.preventDefault();

    const gasto = {

    id: Date.now(),

    data: document.getElementById("dataGasto").value,
    categoria: document.getElementById("categoriaGasto").value,
    descricao: document.getElementById("descricaoGasto").value,

    pagamento: document.getElementById("pagamentoGasto").value,

    valor: Number(
        document.getElementById("valorGasto").value
    ),

    parcelas: Number(
        document.getElementById("quantidadeParcelas")?.value || 1
    )

};

    const user = auth.currentUser;

if (!user) {
    alert("Usuário não logado.");
    return;
}
const compraId = Date.now().toString();

for (let i = 0; i < gasto.parcelas; i++) {

    const dataParcela = new Date(gasto.data);

    dataParcela.setMonth(
        dataParcela.getMonth() + i
    );

    await addDoc(
        collection(db, "usuarios", user.uid, "gastos"),
        {
            ...gasto,


            compraId: compraId,

            data: dataParcela
                .toISOString()
                .split("T")[0],

            parcelaAtual: i + 1,

            totalParcelas: gasto.parcelas
        }
    );
}

alert("Gasto salvo com sucesso!");
    formGasto.reset();

    await atualizarGastos();
    await atualizarSaldo();
    await exibirGastos();

if (typeof atualizarLancamentos === "function") {
    await atualizarLancamentos();
}

    if (typeof atualizarHistorico === "function") {
        atualizarHistorico();
    }
});

async function atualizarGastos() {

    const user = auth.currentUser;
    if (!user) return;

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const snapshotGastos = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    let totalGastos = 0;
    let quantidade = 0;

    snapshotGastos.forEach((doc) => {

        const gasto = doc.data();

        if (gasto.data.startsWith(mesAtual)) {
            totalGastos += gasto.valor;
            quantidade++;
        }
    });

    document.getElementById("totalGastos").textContent =
        totalGastos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });


    atualizarSaldo();
}
async function atualizarSaldo() {

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

    snapshotReceitas.forEach((doc) => {
        const receita = doc.data();

        if (receita.data.startsWith(mesAtual)) {
            totalReceitas += receita.valor;
        }
    });

    let totalGastos = 0;

    snapshotGastos.forEach((doc) => {
        const gasto = doc.data();

        if (gasto.data.startsWith(mesAtual)) {
            totalGastos += gasto.valor;
        }
    });

    const saldo = totalReceitas - totalGastos;

    document.getElementById("saldoAtual").textContent =
        saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    }
    async function exibirGastos() {

    const user = auth.currentUser;
    if (!user) return;

    const listaGastos =
        document.getElementById("listaGastos");

    const mesAtual =
        document.getElementById("mesSelecionado").value;

    const snapshotGastos = await getDocs(
        collection(db, "usuarios", user.uid, "gastos")
    );

    listaGastos.innerHTML = "";

    snapshotGastos.forEach((doc) => {

        const gasto =  {
        firestoreId: doc.id,
        ...doc.data()
    };
        if (!gasto.data.startsWith(mesAtual))
            return;

        listaGastos.innerHTML += `
            <div class="item-gasto">

                <p><strong>Data:</strong>
                ${new Date(gasto.data)
                    .toLocaleDateString('pt-BR')}</p>

                <p><strong>Categoria:</strong>
                ${gasto.categoria}</p>

                <p><strong>Descrição:</strong>
                ${gasto.descricao || 'N/A'}</p>

                <p><strong>Pagamento:</strong>
                ${gasto.pagamento}</p>
                <p><strong>Parcela:</strong>
            ${gasto.parcelaAtual || 1}/${gasto.totalParcelas || gasto.parcelas || 1}</p>
               
                <p><strong>Valor:</strong>
                ${gasto.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</p>

                 <button
                        class="btn-excluir"
                        onclick="excluirGasto('${gasto.firestoreId}','${gasto.compraId || ""}')"
                        title="Excluir">
                          🗑️
                </button>
                <button
                    class="btn-editar"
                    onclick="editarGasto('${gasto.firestoreId}')">
                    Editar
                 </button>

            </div>
            
        `;
    });
}
async function excluirGasto(id, compraId) {
    console.log("ID:", id);
console.log("CompraID:", compraId);

    if (!confirm("Deseja realmente excluir este gasto?")) {
        return;
    }

    const user = auth.currentUser;

    if (!user) return;

    try {

       if (compraId) {

    const q = query(
        collection(db, "usuarios", user.uid, "gastos"),
        where("compraId", "==", compraId)
    );

    const snapshot = await getDocs(q);

    for (const documento of snapshot.docs) {

        await deleteDoc(
            doc(
                db,
                "usuarios",
                user.uid,
                "gastos",
                documento.id
            )
        );
    }

} else {

    await deleteDoc(
        doc(
            db,
            "usuarios",
            user.uid,
            "gastos",
            id
        )
    );

}

        await atualizarGastos();
        await atualizarSaldo();
        await exibirGastos();

        if (typeof atualizarHistorico === "function") {
            atualizarHistorico();
        }

        if (typeof atualizarGrafico === "function") {
            atualizarGrafico();
        }

        if (typeof atualizarLancamentos === "function") {
            atualizarLancamentos();
        }

        alert("Gasto excluído com sucesso!");

    } catch (erro) {

        console.error("Erro ao excluir gasto:", erro);
        alert("Erro ao excluir gasto.");

    }
}
async function editarGasto(id) {

    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(
        db,
        "usuarios",
        user.uid,
        "gastos",
        id
    );

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        alert("Gasto não encontrado.");
        return;
    }

    const gasto = docSnap.data();

    document.getElementById("dataGasto").value =
        gasto.data || "";

    document.getElementById("categoriaGasto").value =
        gasto.categoria || "";

    document.getElementById("descricaoGasto").value =
        gasto.descricao || "";

    document.getElementById("pagamentoGasto").value =
        gasto.pagamento || "";

    document.getElementById("valorGasto").value =
        gasto.valor || "";

    if (gasto.parcelas) {
        document.getElementById("quantidadeParcelas").value =
            gasto.parcelas;
    }

    gastoEditando = id;

    document.querySelector(
        "#formGasto button[type='submit']"
    ).textContent = "Atualizar Gasto";

}

window.excluirGasto = excluirGasto;
window.editarGasto = editarGasto;
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;



    await atualizarGastos();
    await atualizarSaldo();
    await exibirGastos();

});
window.atualizarGastos = atualizarGastos;
window.atualizarSaldo = atualizarSaldo;
window.exibirGastos = exibirGastos;

const pagamento =
    document.getElementById("pagamentoGasto");

const parcelamentoContainer =
    document.getElementById("parcelamentoContainer");

pagamento.addEventListener("change", () => {

    if (
        pagamento.value === "Crédito" ||
        pagamento.value === "Crediário"
    ) {

        parcelamentoContainer.style.display =
            "block";

    } else {

        parcelamentoContainer.style.display =
            "none";

    }

});