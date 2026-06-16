import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBz-ae5JeFByZnAaruqsWTpwSneaHlq0is",
    authDomain: "financias-facil-app.firebaseapp.com",
    projectId: "financias-facil-app",
    storageBucket: "financias-facil-app.firebasestorage.app",
    messagingSenderId: "473014022200",
    appId: "1:473014022200:web:88873e5144af991a33f6cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

const btnLogin = document.getElementById("btnLoginGoogle");
const btnLogout = document.getElementById("btnLogout");
const nomeUsuario = document.getElementById("nomeUsuario");

export async function loginGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (erro) {
        console.error("Erro no login:", erro);
    }
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (erro) {
        console.error("Erro ao sair:", erro);
    }
}

if (btnLogin) {
    btnLogin.addEventListener("click", loginGoogle);
}

if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Usuário logado:", user.displayName);

        if (nomeUsuario) {
            nomeUsuario.textContent = `Olá, ${user.displayName} 👋`;
        }

        if (btnLogin) {
            btnLogin.style.display = "none";
        }

        if (btnLogout) {
            btnLogout.style.display = "inline-block";
        }

    } else {

        if (nomeUsuario) {
            nomeUsuario.textContent = "";
        }

        if (btnLogin) {
            btnLogin.style.display = "inline-block";
        }

        if (btnLogout) {
            btnLogout.style.display = "none";
        }
    }
});

