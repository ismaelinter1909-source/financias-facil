import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let grafico;

async function atualizarGrafico() {

    const mesAtual =
        document.getElementById("mesSelecionado").value;
const user = auth.currentUser;

if (!user) return;

const snapshot = await getDocs(
    collection(db, "usuarios", user.uid, "gastos")
);

const gastos = [];

snapshot.forEach((doc) => {

    const gasto = doc.data();

    if (gasto.data.startsWith(mesAtual)) {
        gastos.push(gasto);
    }

});

    const categorias = {};

    gastos.forEach(gasto => {

        if (!categorias[gasto.categoria]) {
            categorias[gasto.categoria] = 0;
        }

        categorias[gasto.categoria] += gasto.valor;
    });

    const dadosOrdenados = Object.entries(categorias)
        .sort((a, b) => b[1] - a[1]);

    const labels =
        dadosOrdenados.map(item => item[0]);

    const valores =
        dadosOrdenados.map(item => item[1]);

    const totalGastos = valores.reduce(
        (total, valor) => total + valor,
        0
    );

    const porcentagens = valores.map(valor =>
        Number(
            ((valor / totalGastos) * 100).toFixed(1)
        )
    );

    const ctx =
        document.getElementById("graficoGastos");

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{
                label: "% dos Gastos",

                data: porcentagens,
                
                barthickness: 40,

                borderSkipped: false,

                backgroundColor: [
                    "#3498db",
                    "#e74c3c",
                    "#2ecc71",
                    "#f1c40f",
                    "#9b59b6",
                    "#1abc9c",
                    "#e67e22",
                    "#34495e"
                ],

                borderRadius: 8,
                borderSkipped: false
            }]
        },

        plugins: [ChartDataLabels],

        options: {

            layout: {
                padding: {
                    right: 40
                }
            },

            indexAxis: "y",

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                datalabels: {

                    anchor: "center",

                    align: "center",

                    color: "#ffffff",

                    font: {
                        weight: "bold",
                        size: 14
                    },

                    formatter: value => value + "%"
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            const categoria =
                                labels[context.dataIndex];

                            const valor =
                                valores[context.dataIndex];

                            return `${categoria}: ${valor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })} (${context.raw}%)`;
                        }
                    }
                }
            },

            scales: {

                x: {

                    beginAtZero: true,

                    suggestedmax: 100,

                    ticks: {

                        callback: value =>
                            value + "%"
                    }
                }
            }
        }
    });
}

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    await atualizarGrafico();

});
window.atualizarGrafico = atualizarGrafico;