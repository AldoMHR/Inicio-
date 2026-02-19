import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo",
  authDomain: "anssad-7f1ad.firebaseapp.com",
  projectId: "anssad-7f1ad",
  storageBucket: "anssad-7f1ad.firebasestorage.app",
  messagingSenderId: "840573262786",
  appId: "1:840573262786:web:15e2c7cb9e79811e5fd45b",
  measurementId: "G-EQV5F6CWV5"
};

const app = initializeApp(firebaseConfig);//definir la inicialización de la app
const db = getFirestore(app);//definir la base de datos

const newsForm = document.getElementById("newsForm");//variable de formulario
const newsContainer = document.getElementById("newsContainer");//variable del contenedor de noticias

let noticiasId = null;//definir el id de las noticias

const noticiasRef = collection(db, "noticias");

document.addEventListener("DOMContentLoaded", cargarNoticias);

//función para agregar o actualizar noticias

newsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const fecha = document.getElementById("fecha").value;
  const descripcion = document.getElementById("descripcion").value;

  if (noticiasId) {
    const noticiaDoc = doc(db, "noticias", noticiasId);
    await updateDoc(noticiaDoc, {
      titulo,
      autor,
      fecha,
      descripcion
    });
    noticiasId = null;
  } else {
    await addDoc(noticiasRef, {
      titulo,
      autor,
      fecha,
      descripcion
    });
  }

  newsForm.reset();
  cargarNoticias();
});

//cargar noticias
async function cargarNoticias() {
  newsContainer.innerHTML = "";

  const snapshot = await getDocs(noticiasRef);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.classList.add("noticia");

    div.innerHTML = `
      <h3>${data.titulo}</h3>
      <small>${data.autor} - ${data.fecha}</small>
      <p>${data.descripcion}</p>
      <div class="actions">
        <button onclick="editarNoticia('${id}', '${data.titulo}', '${data.autor}', '${data.fecha}', \`${data.descripcion}\`)">Editar</button>
        <button onclick="eliminarNoticia('${id}')">Eliminar</button>
      </div>
    `;

    newsContainer.appendChild(div);
  });
}

//funcion de eliminar noticia
window.eliminarNoticia = async (id) => {
  await deleteDoc(doc(db, "noticias", id));
  cargarNoticias();
};

//editar noticia
window.editarNoticia = (id, titulo, autor, fecha, descripcion) => {
  document.getElementById("titulo").value = titulo;
  document.getElementById("autor").value = autor;
  document.getElementById("fecha").value = fecha;
  document.getElementById("descripcion").value = descripcion;

  noticiasId = id;
};
