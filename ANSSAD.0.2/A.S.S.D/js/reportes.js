const API_KEY = "AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo"; //

// La URL debe incluir "/documents/" para que la API REST de Firestore funcione correctamente
const URL = `https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/reportes?key=${API_KEY}`;

document.getElementById("formReporte").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Obtenemos los valores de los inputs
    const nombre = document.getElementById("nombre").value;
    const contrato = document.getElementById("contrato").value;
    const folio = document.getElementById("folio").value;
    const calle = document.getElementById("calle").value;
    const colonia = document.getElementById("colonia").value;
    const cp = document.getElementById("cp").value;
    const numero = document.getElementById("numero").value;

    // Estructura de datos requerida por la API de Firestore
    const data = {
        fields: {
            nombre: { stringValue: nombre },
            contrato: { stringValue: contrato },
            folio: { stringValue: folio },
            calle: { stringValue: calle },
            colonia: { stringValue: colonia },
            cp: { stringValue: cp },
            numero: { stringValue: numero },
            fecha: { stringValue: new Date().toISOString() }
        }
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("✅ Reporte enviado correctamente a Firebase");
            document.getElementById("formReporte").reset();
        } else {
            const errorData = await response.json();
            console.error("Error de Firebase:", errorData);
            alert("❌ Error al enviar reporte. Revisa la consola.");
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("❌ Error de conexión.");
    }
});
