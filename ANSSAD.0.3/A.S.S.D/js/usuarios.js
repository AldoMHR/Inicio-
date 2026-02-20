/* CONFIG FIREBASE */
const API_URL = "https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

/* VARIABLE GLOBAL PARA FILTRADO */
let listaUsuarios = [];

/* 1. CARGAR USUARIOS */
async function cargarUsuarios() {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Si no hay documentos, limpiar tabla y salir
        if (!data.documents) {
            tabla.innerHTML = "<tr><td colspan='4' class='p-3 text-center'>No hay usuarios registrados</td></tr>";
            return;
        }

        // Guardamos en la variable global para poder buscar/filtrar sin recargar
        listaUsuarios = data.documents;
        mostrarUsuarios(listaUsuarios);
    } catch (e) {
        console.error("Error al cargar desde Firebase:", e);
    }
}

/* 2. MOSTRAR USUARIOS (Renderiza la tabla) */
function mostrarUsuarios(usuarios) {
    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";

    usuarios.forEach(doc => {
        // Extraemos el ID único de Firebase y los campos
        const id = doc.name.split('/').pop();
        const nombre = doc.fields.nombre?.stringValue || "N/A";
        const correo = doc.fields.correo?.stringValue || "N/A";
        const telefono = doc.fields.telefono?.stringValue || "N/A";

        const fila = `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3">${nombre}</td>
                <td class="p-3">${correo}</td>
                <td class="p-3">${telefono}</td>
                <td class="p-3 space-x-2">
                    <button onclick="editarUsuario('${id}','${nombre}','${correo}','${telefono}')" 
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="eliminarUsuario('${id}')" 
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

/* 3. BUSCAR (Filtra sobre la lista cargada) */
function buscarUsuarios() {
    const texto = document.getElementById("buscarUsuario").value.toLowerCase();
    const filtrados = listaUsuarios.filter(doc => {
        const nombre = (doc.fields.nombre?.stringValue || "").toLowerCase();
        const correo = (doc.fields.correo?.stringValue || "").toLowerCase();
        return nombre.includes(texto) || correo.includes(texto);
    });
    mostrarUsuarios(filtrados);
}

/* 4. CREAR (POST a Firebase) */
async function guardarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const password = document.getElementById("password").value;

    if (!nombre || !correo || !telefono || !password) {
        alert("Complete todos los campos");
        return;
    }

    const data = {
        fields: {
            nombre: { stringValue: nombre },
            correo: { stringValue: correo },
            telefono: { stringValue: telefono },
            password: { stringValue: password }
        }
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        alert("Usuario creado con éxito");
        cerrarFormulario();
        cargarUsuarios(); // Recargar tabla
    } catch (e) {
        alert("Error al guardar");
    }
}

/* 5. EDITAR (PATCH a Firebase) */
async function editarUsuario(id, nombreActual, correoActual, telefonoActual) {
    const nuevoNombre = prompt("Modificar nombre:", nombreActual) || nombreActual;
    const nuevoCorreo = prompt("Modificar correo:", correoActual) || correoActual;
    const nuevoTelefono = prompt("Modificar teléfono:", telefonoActual) || telefonoActual;
    const nuevoPassword = prompt("Nueva contraseña (requerido para actualizar):");

    if (!nuevoPassword) {
        alert("La contraseña es necesaria para actualizar el perfil.");
        return;
    }

    const URL_DOC = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?updateMask.fieldPaths=nombre&updateMask.fieldPaths=correo&updateMask.fieldPaths=telefono&updateMask.fieldPaths=password&key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;

    const data = {
        fields: {
            nombre: { stringValue: nuevoNombre },
            correo: { stringValue: nuevoCorreo },
            telefono: { stringValue: nuevoTelefono },
            password: { stringValue: nuevoPassword }
        }
    };

    try {
        await fetch(URL_DOC, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        alert("Usuario actualizado");
        cargarUsuarios();
    } catch (e) {
        alert("Error al actualizar");
    }
}

/* 6. ELIMINAR */
async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    const URL_DOC = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;

    try {
        const res = await fetch(URL_DOC, { method: "DELETE" });
        if (res.ok) {
            alert("Usuario eliminado correctamente");
            cargarUsuarios();
        }
    } catch (e) {
        alert("Error al eliminar");
    }
}

/* UI CONTROLS */
function abrirFormulario() { document.getElementById("modalFormulario").classList.remove("hidden"); }
function cerrarFormulario() { document.getElementById("modalFormulario").classList.add("hidden"); }

/* INICIALIZACIÓN */
window.onload = cargarUsuarios; 