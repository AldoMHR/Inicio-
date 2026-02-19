    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    // Configuración de tu proyecto ANSSAD
    const firebaseConfig = {
    apiKey: "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo",
    authDomain: "anssad-7f1ad.firebaseapp.com",
    projectId: "anssad-7f1ad",
    storageBucket: "anssad-7f1ad.firebasestorage.app",
    messagingSenderId: "840573262786",
    appId: "1:840573262786:web:15e2c7cb9e79811e5fd45b",
    measurementId: "G-EQV5F6CWV5"
    };


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);


   // --- FUNCIÓN DE REGISTRO ---
window.handleRegistro = async () => {
    const username = document.getElementById('regUser').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regPassConfirm').value;

    if (pass !== confirm) { alert("Las contraseñas no coinciden"); return; }
    if (!email || !pass) { alert("El correo y la contraseña son obligatorios"); return; }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const uid = userCredential.user.uid;

        // Guardar en Firestore con 'correo' en minúscula
        await setDoc(doc(db, "usuarios", uid), {
            Nombre: username,    
            correo: email,      // Como lo pediste: 'correo' en minúsculas
            Telefono: phone,    
            Contraseña: pass    
        });

        alert("¡Cuenta creada con éxito!");
        if (window.showPage) { window.showPage('login'); }
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
};

    // --- FUNCIÓN DE INICIO DE SESIÓN ---
    window.handleLogin = async () => {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            if (window.showPage) {
                window.showPage('noticias');
            }
        } catch (error) {
            alert("Error de acceso: Revisa tus datos");
        }
    };