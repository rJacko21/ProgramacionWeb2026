const eventoForm = document.getElementById("evento-form");
const tituloInput = document.getElementById("titulo");
const fechaInput = document.getElementById("fecha");
const descripcionInput = document.getElementById("descripcion");
const eventoIdInput = document.getElementById("evento-id");
const listaEventos = document.getElementById("lista-eventos");
const conteoEventos = document.getElementById("eventos-count");
const filtroDesde = document.getElementById("filtro-desde");
const filtroHasta = document.getElementById("filtro-hasta");
const botonFiltrar = document.getElementById("boton-filtrar");
const botonLimpiar = document.getElementById("boton-limpiar");
const botonExportar = document.getElementById("boton-exportar");
const botonCancelar = document.getElementById("cancelar-edicion");

let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
let filtroActivo = false;

function guardarEventos() {
    localStorage.setItem("eventos", JSON.stringify(eventos));
}

function limpiarFormulario() {
    eventoForm.reset();
    eventoIdInput.value = "";
    botonCancelar.classList.add("hidden");
}

function validarFormulario() {
    const titulo = tituloInput.value.trim();
    const fecha = fechaInput.value;
    const descripcion = descripcionInput.value.trim();

    if (!titulo) {
        alert("El título es obligatorio.");
        tituloInput.focus();
        return false;
    }

    if (!fecha) {
        alert("La fecha es obligatoria.");
        fechaInput.focus();
        return false;
    }

    if (!descripcion) {
        alert("La descripción es obligatoria.");
        descripcionInput.focus();
        return false;
    }

    return true;
}

function crearEvento(evento) {
    eventos.push(evento);
    guardarEventos();
    mostrarEventos();
}

function actualizarEvento(id, datosActualizados) {
    eventos = eventos.map(evento => evento.id === id ? { ...evento, ...datosActualizados } : evento);
    guardarEventos();
    mostrarEventos();
}

function eliminarEvento(id) {
    if (!confirm("¿Eliminar este evento?")) return;
    eventos = eventos.filter(evento => evento.id !== id);
    guardarEventos();
    mostrarEventos();
}

function cargarEventoEnFormulario(evento) {
    eventoIdInput.value = evento.id;
    tituloInput.value = evento.titulo;
    fechaInput.value = evento.fecha;
    descripcionInput.value = evento.descripcion;
    botonCancelar.classList.remove("hidden");
}

function obtenerEventosFiltrados() {
    const desde = filtroDesde.value;
    const hasta = filtroHasta.value;

    if (!desde && !hasta) {
        return eventos;
    }

    return eventos.filter(evento => {
        const fechaEvento = evento.fecha;
        const despuesDesde = desde ? fechaEvento >= desde : true;
        const antesHasta = hasta ? fechaEvento <= hasta : true;
        return despuesDesde && antesHasta;
    });
}

function mostrarEventos() {
    const eventosParaMostrar = obtenerEventosFiltrados();
    listaEventos.innerHTML = "";

    if (eventosParaMostrar.length === 0) {
        listaEventos.innerHTML = "<p>No hay eventos registrados con los filtros actuales.</p>";
    } else {
        eventosParaMostrar.sort((a, b) => a.fecha.localeCompare(b.fecha)).forEach(evento => {
            const card = document.createElement("article");
            card.className = "evento-card";

            const fechaFormateada = new Date(evento.fecha).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            card.innerHTML = `
                <h3>${evento.titulo}</h3>
                <div class="evento-meta">
                    <span>${fechaFormateada}</span>
                    <span>ID: ${evento.id}</span>
                </div>
                <p>${evento.descripcion}</p>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="editarEvento('${evento.id}')">Editar</button>
                    <button class="btn-export" onclick="eliminarEvento('${evento.id}')">Eliminar</button>
                </div>
            `;

            listaEventos.appendChild(card);
        });
    }

    conteoEventos.textContent = `${eventosParaMostrar.length} evento${eventosParaMostrar.length !== 1 ? "s" : ""}`;
}

function aplicarFiltro() {
    filtroActivo = true;
    mostrarEventos();
}

function limpiarFiltro() {
    filtroDesde.value = "";
    filtroHasta.value = "";
    filtroActivo = false;
    mostrarEventos();
}

function exportarDia() {
    const hoy = new Date().toISOString().slice(0, 10);
    const eventosDelDia = eventos.filter(evento => evento.fecha === hoy);
    const ventana = window.open("", "EXPORTAR_AGENDA", "width=800,height=600");

    const estiloImpresion = `
        <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #2f3d33; }
            h1 { font-size: 1.8rem; margin-bottom: 8px; }
            h2 { font-size: 1.2rem; margin-top: 24px; }
            .evento { border-bottom: 1px solid #ccc; padding: 12px 0; }
            .evento:last-child { border-bottom: none; }
            .meta { color: #5c5a52; font-size: 0.95rem; margin-bottom: 6px; }
        </style>
    `;

    ventana.document.write(`
        <html>
            <head>
                <title>Agenda diaria - ${hoy}</title>
                ${estiloImpresion}
            </head>
            <body>
                <h1>Agenda diaria</h1>
                <p>Fecha: ${new Date(hoy).toLocaleDateString("es-ES")}</p>
                ${eventosDelDia.length === 0 ? "<p>No hay eventos para esta fecha.</p>" : eventosDelDia.map(evento => `
                    <div class="evento">
                        <h2>${evento.titulo}</h2>
                        <div class="meta">${evento.fecha}</div>
                        <p>${evento.descripcion}</p>
                    </div>
                `).join("")}
            </body>
        </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
}

function editarEvento(id) {
    const evento = eventos.find(item => item.id === id);
    if (!evento) return;
    cargarEventoEnFormulario(evento);
}

eventoForm.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!validarFormulario()) return;

    const titulo = tituloInput.value.trim();
    const fecha = fechaInput.value;
    const descripcion = descripcionInput.value.trim();
    const idActual = eventoIdInput.value;

    if (idActual) {
        actualizarEvento(idActual, { titulo, fecha, descripcion });
    } else {
        const nuevoEvento = {
            id: `evt-${Date.now()}`,
            titulo,
            fecha,
            descripcion
        };
        crearEvento(nuevoEvento);
    }

    limpiarFormulario();
});

botonFiltrar.addEventListener("click", () => {
    if (filtroDesde.value && filtroHasta.value && filtroDesde.value > filtroHasta.value) {
        alert("La fecha desde no puede ser mayor que la fecha hasta.");
        return;
    }
    aplicarFiltro();
});

botonLimpiar.addEventListener("click", limpiarFiltro);
botonExportar.addEventListener("click", exportarDia);
botonCancelar.addEventListener("click", limpiarFormulario);

mostrarEventos();
