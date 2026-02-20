import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, verifyBeforeUpdateEmail, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo",
    authDomain: "anssad-7f1ad.firebaseapp.com",
    projectId: "anssad-7f1ad",
    storageBucket: "anssad-7f1ad.firebasestorage.app",
    messagingSenderId: "840573262786",
    appId: "1:840573262786:web:15e2c7cb9e79811e5fd45b",
    measurementId: "G-EQV5F6CWV5"
};

let usuarioActualId = null;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const searchUsuarioBtn = document.getElementById('searchUsuario');
    const updateInfoForm = document.getElementById('updateInfoForm');
    const btnEliminar = document.getElementById('btnEliminarCuenta');
    
    if (searchUsuarioBtn) searchUsuarioBtn.addEventListener('click', searchPostByName);
    if (updateInfoForm) updateInfoForm.addEventListener('submit', updateInfo);
    if (btnEliminar) btnEliminar.addEventListener('click', eliminarCuenta);
});

// --- FUNCIÓN DE BÚSQUEDA ---
async function searchPostByName() {
    const nombreInput = document.getElementById("nombreUsuario").value.trim();
    const postResult = document.getElementById("newPostResult");

    if (!nombreInput) {
        showError(postResult, "Ingresa un nombre de usuario");
        return;
    }

    showLoading(postResult);

    try {
        const usuariosRef = collection(db, "usuarios");
        let q = query(usuariosRef, where("nombre", "==", nombreInput));
        let querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            q = query(usuariosRef, where("Nombre", "==", nombreInput));
            querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty) {
            showError(postResult, "Usuario no encontrado");
            return;
        }

        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        usuarioActualId = docSnap.id;

        // LLENADO DE CAMPOS
        if(document.getElementById("userName")) document.getElementById("userName").value = data.nombre || data.Nombre || "";
        if(document.getElementById("userPassword")) document.getElementById("userPassword").value = data.Contraseña || "";
        if(document.getElementById("userPhone")) document.getElementById("userPhone").value = data.Telefono || "";
        if(document.getElementById("userEmail")) document.getElementById("userEmail").value = data.correo || data.email || ""; 

        postResult.innerHTML = "<div class='success' style='color: green; font-weight: bold;'>Usuario encontrado</div>";

    } catch (error) {
        showError(postResult, "Error: " + error.message);
    }
}

// --- FUNCIÓN DE ACTUALIZACIÓN ---
async function updateInfo(event) {
    event.preventDefault();
    if (!usuarioActualId) { alert("Primero busca un usuario"); return; }

    const updatedData = {
        nombre: document.getElementById("userName").value,
        Contraseña: document.getElementById("userPassword").value,
        correo: document.getElementById("userEmail").value,
        Telefono: document.getElementById("userPhone").value
    };

    try {
        const userRef = doc(db, "usuarios", usuarioActualId);
        await updateDoc(userRef, updatedData);
        alert("Datos actualizados correctamente.");
    } catch (error) {
        alert("Error al actualizar: " + error.message);
    }
}

// --- FUNCIÓN PARA ELIMINAR CUENTA ---
async function eliminarCuenta() {
    if (!usuarioActualId) {
        alert("Primero busca el usuario que deseas eliminar.");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que quieres eliminar esta cuenta? Esta acción es permanente.");
    
    if (confirmar) {
        try {
            const userRef = doc(db, "usuarios", usuarioActualId);
            await deleteDoc(userRef);
            
            alert("Cuenta eliminada con éxito.");
            
            // Limpiar todo después de borrar
            usuarioActualId = null;
            document.getElementById("updateInfoForm").reset();
            document.getElementById("nombreUsuario").value = "";
            document.getElementById("newPostResult").innerHTML = "<span style='color: orange;'>Usuario eliminado</span>";
            
        } catch (error) {
            alert("Error al eliminar la cuenta: " + error.message);
        }
    }
}

// --- FUNCIONES AUXILIARES ---
function showLoading(container) { if (container) container.innerHTML = 'Cargando...'; }
function showError(container, message) { if (container) container.innerHTML = `<div style='color: red;'> ${message}</div>`; }