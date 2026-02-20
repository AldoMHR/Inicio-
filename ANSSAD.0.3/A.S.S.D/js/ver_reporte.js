const API_KEY = "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

const URL =
"https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/noticias/reportes?key=" + API_KEY;


async function cargarReportes(){

    const response = await fetch(URL);

    const data = await response.json();

    const contenedor =
    document.getElementById("contenedorReportes");

    contenedor.innerHTML = "";

    data.documents.forEach(doc => {

        const id =
        doc.name.split("/").pop();

        const reporte =
        doc.fields;

        contenedor.innerHTML += `

        <div class="bg-white p-4 rounded shadow">

        <h2 class="font-bold text-lg">
        ${reporte.nombre.stringValue}
        </h2>

        <p>Contrato:
        ${reporte.contrato.stringValue}</p>

        <p>Folio:
        ${reporte.folio.stringValue}</p>

        <p>Calle:
        ${reporte.calle.stringValue}</p>

        <p>Colonia:
        ${reporte.colonia.stringValue}</p>

        <p>CP:
        ${reporte.cp.stringValue}</p>

        <p>No:
        ${reporte.numero.stringValue}</p>

        <div class="mt-4">

        <button onclick="editar('${id}')"
        class="bg-yellow-500 text-white px-3 py-1 rounded">

        Editar

        </button>

        <button onclick="eliminar('${id}')"
        class="bg-red-500 text-white px-3 py-1 rounded ml-2">

        Eliminar

        </button>

        </div>

        </div>
        `;
    });
}


async function eliminar(id){

    const confirmar =
    confirm("¿Eliminar reporte?");

    if(!confirmar) return;

    await fetch(
    `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/noticias/reportes/${id}?key=${API_KEY}`,
    {
        method: "DELETE"
    });

    cargarReportes();
}


async function editar(id){

    const nuevoNombre =
    prompt("Nuevo nombre:");

    if(!nuevoNombre) return;

    const data = {

        fields: {

            nombre: {
                stringValue: nuevoNombre
            }

        }

    };

    await fetch(
    `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/noticias/reportes/${id}?key=${API_KEY}`,
    {

        method: "PATCH",

        headers: {
            "Content-Type":
            "application/json"
        },

        body: JSON.stringify(data)

    });

    cargarReportes();
}


cargarReportes();
