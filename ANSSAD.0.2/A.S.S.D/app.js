const API_URL = "https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

// 1. CARGAR USUARIOS EN LA TABLA
async function cargarUsuarios() {
    const tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return; 

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        if (!data.documents) {
            tabla.innerHTML = "<tr><td colspan='3' class='p-3 text-center'>No hay usuarios registrados</td></tr>";
            return;
        }

        tabla.innerHTML = ""; 
        data.documents.forEach(doc => {
            // Extraemos el ID único del documento (la última parte de la ruta 'name')
            const docId = doc.name.split('/').pop();
            const nombre = doc.fields.nombre?.stringValue || "N/A";
            const correo = doc.fields.correo?.stringValue || "N/A";

            const fila = `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3">${nombre}</td>
                    <td class="p-3">${correo}</td>
                    <td class="p-3 space-x-2">
                        <button onclick="editarUsuario('${docId}', '${nombre}', '${correo}')" class="text-blue-500 font-bold hover:underline">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="eliminarUsuario('${docId}')" class="text-red-500 font-bold hover:underline">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

// 2. FUNCIÓN PARA EDITAR (PATCH)
async function editarUsuario(id, nombreActual, correoActual) {
    const nuevoNombre = prompt("Modificar nombre:", nombreActual);
    const nuevoCorreo = prompt("Modificar correo:", correoActual);

    if (!nuevoNombre || !nuevoCorreo) return;

    // URL específica del documento para la actualización parcial
    const DOC_URL = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?updateMask.fieldPaths=nombre&updateMask.fieldPaths=correo&key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;

    const data = {
        fields: {
            nombre: { stringValue: nuevoNombre },
            correo: { stringValue: nuevoCorreo }
        }
    };

    try {
        const res = await fetch(DOC_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Usuario actualizado con éxito");
            cargarUsuarios(); 
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

// 3. FUNCIÓN PARA ELIMINAR (DELETE)
async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    const DOC_URL = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;

    try {
        const res = await fetch(DOC_URL, { method: "DELETE" });
        if (res.ok) {
            alert("Usuario eliminado");
            cargarUsuarios();
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}

// --- TUS FUNCIONES ORIGINALES DE REGISTRO Y LOGIN ---
async function registrarUsuario() {
    const inputs = document.querySelectorAll("#registro input");
    const data = {
        fields: {
            nombre: { stringValue: inputs[0].value },
            correo: { stringValue: inputs[1].value },
            telefono: { stringValue: inputs[2].value },
            password: { stringValue: inputs[3].value }
        }
    };
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Usuario registrado");
    showPage("login");
}

async function loginUsuario() {
    const inputs = document.querySelectorAll("#login input");
    const res = await fetch(API_URL);
    const data = await res.json();
    const encontrado = data.documents?.find(user => 
        user.fields.nombre.stringValue === inputs[0].value && 
        user.fields.password.stringValue === inputs[1].value
    );
    if (encontrado) {
        alert("Bienvenido");
        showPage("noticias");
    } else {
        alert("Datos incorrectos");
    }
}

// Inicialización al cargar la ventana
window.onload = cargarUsuarios;