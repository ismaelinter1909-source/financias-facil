function mostrarSecao(secaoId) {

    const secoes = document.querySelectorAll("main section");

    secoes.forEach(secao => {
        secao.style.display = "none";
    });

    document.getElementById(secaoId).style.display = "block";
}

mostrarSecao("dashboard");
window.mostrarSecao = mostrarSecao;
window.formatarData = formatarData;