/* CONFIGURACIÓN FIREBASE */
const API_URL = "https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

/* VARIABLE GLOBAL PARA FILTRADO */
let listaUsuarios = [];

// --- 1. GESTIÓN DE LA TABLA (ADMINISTRACIÓN) ---

/* CARGAR USUARIOS DESDE FIREBASE */
async function cargarUsuarios() {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return; 

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        if (!data.documents) {
            tabla.innerHTML = "<tr><td colspan='4' class='p-3 text-center'>No hay usuarios registrados</td></tr>";
            return;
        }

        listaUsuarios = data.documents;
        mostrarUsuarios(listaUsuarios);
    } catch (e) {
        console.error("Error al cargar usuarios:", e);
    }
}

/* RENDERIZAR FILAS DE LA TABLA */
function mostrarUsuarios(usuarios) {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;
    tabla.innerHTML = "";

    usuarios.forEach(doc => {
        const id = doc.name.split('/').pop();
        
        // Mapeo de firebase
        const nombre = doc.fields.nombre?.stringValue || doc.fields.Nombre?.stringValue || "N/A";
        const correo = doc.fields.correo?.stringValue || doc.fields.Email?.stringValue || "N/A";
        const telefono = doc.fields.telefono?.stringValue || "N/A";
        // Intentamos leer 'Contraseña' primero, si no, 'password' (para compatibilidad)
        const password = doc.fields.Contraseña?.stringValue || doc.fields.password?.stringValue || "";

        tabla.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3">${nombre}</td>
                <td class="p-3">${correo}</td>
                <td class="p-3">${telefono}</td>
                <td class="p-3 space-x-2 text-center">
                    <button onclick="editarUsuario('${id}','${nombre}','${correo}','${telefono}','${password}')" class="text-blue-600 hover:text-blue-800 font-bold">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="eliminarUsuario('${id}')" class="text-red-600 hover:text-red-800 font-bold">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>`;
    });
}

/* BUSCAR USUARIOS EN TIEMPO REAL */
function buscarUsuarios() {
    const texto = document.getElementById("buscarUsuario").value.toLowerCase();
    const filtrados = listaUsuarios.filter(doc => {
        const nombre = (doc.fields.nombre?.stringValue || doc.fields.Nombre?.stringValue || "").toLowerCase();
        const correo = (doc.fields.correo?.stringValue || doc.fields.Email?.stringValue || "").toLowerCase();
        return nombre.includes(texto) || correo.includes(texto);
    });
    mostrarUsuarios(filtrados);
}

// --- 2. FUNCIONES CRUD (CREAR, EDITAR, ELIMINAR) ---

/* CREAR/GUARDAR USUARIO DESDE EL MODAL */
async function guardarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const password = document.getElementById("password").value;

    if (!nombre || !correo || !telefono || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const data = {
        fields: {
            nombre: { stringValue: nombre },
            correo: { stringValue: correo },
            telefono: { stringValue: telefono },
            Contraseña: { stringValue: password } 
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
        cargarUsuarios();
    } catch (e) {
        alert("Error al crear usuario");
    }
}

/* EDITAR */
async function editarUsuario(id,nombreActual,correoActual,telefonoActual){
 const nuevoNombre=prompt("Nuevo nombre:",nombreActual); if(!nuevoNombre)return;
 const nuevoCorreo=prompt("Nuevo correo:",correoActual); if(!nuevoCorreo)return;
 const nuevoTelefono=prompt("Nuevo telefono:",telefonoActual); if(!nuevoTelefono)return;
 const URL=`https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?updateMask.fieldPaths=nombre&updateMask.fieldPaths=correo&updateMask.fieldPaths=telefono&updateMask.fieldPaths=password&key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;
 const data={fields:{
  nombre:{stringValue:nuevoNombre},
  correo:{stringValue:nuevoCorreo},
  telefono:{stringValue:nuevoTelefono},
 }};
 await fetch(URL,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 alert("Usuario actualizado");
 cargarUsuarios();
}

/* ELIMINAR USUARIO (DELETE) */
async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario definitivamente?")) return;
    const URL_DEL = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;
    
    try {
        await fetch(URL_DEL, { method: "DELETE" });
        alert("Usuario eliminado");
        cargarUsuarios();
    } catch (e) {
        alert("Error al eliminar");
    }
}

// --- 3. LOGIN Y REGISTRO ---

async function registrarUsuario() {
    const inputs = document.querySelectorAll("#registro input");
    const data = {
        fields: {
            nombre: { stringValue: inputs[0].value },
            correo: { stringValue: inputs[1].value },
            telefono: { stringValue: inputs[2].value },
            Contraseña: { stringValue: inputs[3].value } 
        }
    };
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Registro exitoso");
    showPage("login");
}

async function loginUsuario() {
    const inputs = document.querySelectorAll("#login input");
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const encontrado = data.documents?.find(user => 
        (user.fields.nombre?.stringValue === inputs[0].value || user.fields.Nombre?.stringValue === inputs[0].value) && 
        (user.fields.Contraseña?.stringValue === inputs[1].value || user.fields.password?.stringValue === inputs[1].value)
    );

    if (encontrado) {
        alert("Bienvenido");
        showPage("noticias");
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// --- 4. UTILIDADES DE INTERFAZ ---

function abrirFormulario() { document.getElementById("modalFormulario").classList.remove("hidden"); }
function cerrarFormulario() { document.getElementById("modalFormulario").classList.add("hidden"); }

// --- 5. GESTIÓN DE REPORTES ---

async function enviarReporte() {
    const nombre = document.getElementById("repNombre").value;
    const contrato = document.getElementById("repContrato").value;
    const folio = document.getElementById("repFolio").value;
    const calle = document.getElementById("repCalle").value;
    const colonia = document.getElementById("repColonia").value;

    if (!nombre || !contrato || !folio) {
        alert("Por favor, llena los campos obligatorios.");
        return;
    }

    const data = {
        fields: {
            nombre: { stringValue: nombre },
            numContrato: { stringValue: contrato },
            numFolio: { stringValue: folio },
            calle: { stringValue: calle },
            colonia: { stringValue: colonia }
        }
    };

    const URL_REPORTES = "https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/reportes?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

    try {
        const res = await fetch(URL_REPORTES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Reporte enviado con éxito");
            location.reload(); 
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo enviar el reporte");
    }
}

/* INICIO AUTOMÁTICO */
window.onload = () => {
    cargarUsuarios();
};