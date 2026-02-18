// Obtener usuarios desde localStorage
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const tabla = document.getElementById("tablaUsuarios");

tabla.innerHTML = "";

usuarios.forEach((usuario, index) => {
    const fila = `
        <tr class="border-t">
            <td class="p-3">${usuario.nombre}</td>
            <td class="p-3">${usuario.correo}</td>
            <td class="p-3">
                <button onclick="eliminarUsuario(${index})"
                class="bg-red-500 text-white px-3 py-1 rounded">
                Eliminar
                </button>
            </td>
        </tr>
    `;
    tabla.innerHTML += fila;
});

function eliminarUsuario(index) {
    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    location.reload();
}
