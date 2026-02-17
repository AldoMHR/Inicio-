//codificacion para mandar llamar a firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, query, where, getDocs, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//configuracion de firebase de anssad
const firebaseConfig = {
  apiKey: "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo",
  authDomain: "anssad-7f1ad.firebaseapp.com",
  projectId: "anssad-7f1ad",
  storageBucket: "anssad-7f1ad.firebasestorage.app",
  messagingSenderId: "840573262786",
  appId: "1:840573262786:web:15e2c7cb9e79811e5fd45b",
  measurementId: "G-EQV5F6CWV5"
};

//variable que contiene el id del usuario que se buscara
let usuarioActualId = null;

//variables que inicializan la firestore y la app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



document.addEventListener('DOMContentLoaded', function() {


    
    // Referencias a elementos
    const searchUsuarioBtn = document.getElementById('searchUsuario');
    const updateInfoForm = document.getElementById('updateInfoForm');
    
    
    // Event listeners
    if (searchUsuarioBtn) {
        searchUsuarioBtn.addEventListener('click', searchPostByName);
    }
    
    if (updateInfoForm) {
        updateInfoForm.addEventListener('submit', updateInfo);
    }
});

//funcion para buscar el nombre
async function searchPostByName() {
    const nombreInput = document.getElementById("nombreUsuario").value.trim();
    const postResult = document.getElementById("newPostResult");

    if (!nombreInput) {
        showError(postResult, "Ingresa un nombre de usuario");
        return;
    }
    //si no hay un nombre muestra un error

    showLoading(postResult);

    try {
        const usuariosRef = collection(db, "usuarios"); //se crea una variable que almacene la colección que necesitamos
        const q = query(usuariosRef, where("Nombre", "==", nombreInput)); //se crea una constante con la solicitud que necesitamos para obtener solo el nombre
        const querySnapshot = await getDocs(q); //se toman los documentos/usuarios que cumplan con el query

        if (querySnapshot.empty) {
            showError(postResult, "Usuario no encontrado");
            return;
        }//si no se encuentra se muestra un error

        
        const docSnap = querySnapshot.docs[0]; //se toma el primer usuario que cumpla con el requisito
        const data = docSnap.data();//se toma la informacion de dicho usuario

        usuarioActualId = docSnap.id;//almacenamos el id del usuario 

        
        document.getElementById("userName").value = data.Nombre || "";
        document.getElementById("userPassword").value = data.Contraseña || "";
        document.getElementById("userEmail").value = data.Email || "";
        document.getElementById("userPhone").value = data.Telefono || "";
        //colocamos la informacion del usuario dentro del forms

        postResult.innerHTML = "<div class='success'>Usuario cargado</div>";//mensaje de exito

    } catch (error) {
        showError(postResult, error.message);
    }
    
}


async function updateInfo(event) {
    event.preventDefault();//no recargamos la pagina

    if (!usuarioActualId) {
        alert("Primero busca un usuario");
        return;
    }//mensaje de error

    const updatedData = {
        Nombre: document.getElementById("userName").value,
        Contraseña: document.getElementById("userPassword").value,
        Email: document.getElementById("userEmail").value,
        Telefono: document.getElementById("userPhone").value
    };//se crea un arreglo con los datos a actualizar

    try {//conecta al usuario con los datos a actualizar
        const userRef = doc(db, "usuarios", usuarioActualId);
        await updateDoc(userRef, updatedData);//subir datos

        alert("Datos actualizados correctamente");

    } catch (error) {
        alert("Error al actualizar: " + error.message);
    }
}

//funciones auxiliares


function showLoading(container) {
    if (container) {
        container.innerHTML = '<div class="loading"> Cargando...</div>';
    }
}

function showError(container, message) {
    if (container) {
        container.innerHTML = `<div class="error"> ${message}</div>`;
    }
}

function handleResponseError(response) {
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
}