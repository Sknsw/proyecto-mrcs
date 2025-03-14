async function cargarPagos() {
    const response = await fetch("/payments/list", {
        headers: {
            "Authorization": "Bearer clave_super_secreta"
        }
    });
    const pagos = await response.json();
    const tabla = document.getElementById("tabla-pagos");
    tabla.innerHTML = "";

    pagos.forEach(pago => {
        const row = `<tr>
            <td>${pago.id}</td>
            <td>${pago.customer}</td>
            <td>${pago.amount / 100} EUR</td>
            <td>${pago.status}</td>
        </tr>`;
        tabla.innerHTML += row;
    });
}

document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona un archivo CSV.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        procesarCSV(content);
    };
    reader.readAsText(file);
});

// Función para procesar el CSV
function procesarCSV(csvData) {
    const rows = csvData.split("\n").slice(1); // Omitimos la cabecera
    const nuevosPagos = [];

    rows.forEach(row => {
        const cols = row.split(",");
        if (cols.length === 3) {
            nuevosPagos.push({
                id: "PAG" + Math.floor(Math.random() * 1000),
                cliente: cols[0].trim(),
                monto: parseFloat(cols[1].trim()),
                estado: cols[2].trim()
            });
        }
    });

    pagos.push(...nuevosPagos);
    cargarPagos();
}

function buscarPagos() {
    const filtro = document.getElementById("search").value.toLowerCase();
    const filas = document.querySelectorAll("tbody tr");

    filas.forEach(fila => {
        const textoFila = fila.innerText.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
}

function actualizarEstadisticas() {
    let totalPagado = 0, totalPendiente = 0, totalFallido = 0;

    pagos.forEach(pago => {
        if (pago.estado === "Pagado") totalPagado += pago.monto;
        if (pago.estado === "Pendiente") totalPendiente += pago.monto;
        if (pago.estado === "Fallido") totalFallido += pago.monto;
    });

    document.getElementById("totalPagado").innerText = totalPagado.toFixed(2);
    document.getElementById("totalPendiente").innerText = totalPendiente.toFixed(2);
    document.getElementById("totalFallido").innerText = totalFallido.toFixed(2);
}

// Llamar a la función cada vez que se actualizan los pagos
function cargarPagos() {
    const tabla = document.getElementById("tabla-pagos");
    tabla.innerHTML = "";

    pagos.forEach((pago) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pago.id}</td>
            <td>${pago.cliente}</td>
            <td>${pago.monto.toFixed(2)} €</td>
            <td class="${getEstadoClase(pago.estado)}">${pago.estado}</td>
        `;
        tabla.appendChild(row);
    });

    actualizarEstadisticas();
}

document.getElementById("pagoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const empresa = document.getElementById("empresa").value;
    const trabajador = document.getElementById("trabajador").value;
    const monto = document.getElementById("monto").value;

    const response = await fetch("https://proyecto-mrcs.onrender.com/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount: monto,
            currency: "eur",
            workerAccountId: "acct_xxxx", // Aquí deberíamos obtener la cuenta real del trabajador
            feePercentage: 10, // Comisión del 10%
        }),
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("estadoPago").innerText = "✅ Pago enviado con éxito.";
    } else {
        document.getElementById("estadoPago").innerText = "❌ Error en el pago: " + data.error;
    }
});

document.getElementById("pagoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const empresa = document.getElementById("empresa").value;
    const trabajador = document.getElementById("trabajador").value;
    const monto = document.getElementById("monto").value;

    const response = await fetch("https://proyecto-mrcs.onrender.com/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount: monto,
            currency: "eur",
            workerAccountId: "acct_xxxx", // Aquí deberíamos obtener la cuenta real del trabajador
            feePercentage: 10, // Comisión del 10%
        }),
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("estadoPago").innerText = "✅ Pago enviado con éxito.";
    } else {
        document.getElementById("estadoPago").innerText = "❌ Error en el pago: " + data.error;
    }
});

