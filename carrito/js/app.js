const productos = [
    { id: 1, nombre: "Mouse", precio: 50000 },
    { id: 2, nombre: "Teclado", precio: 80000 },
    { id: 3, nombre: "Monitor", precio: 300000 },
    { id: 4, nombre: "Audífonos", precio: 120000 },
    { id: 5, nombre: "Disco Duro", precio: 150000 }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarProductos() {
    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <span>${producto.nombre} - $${producto.precio}</span>
            <button onclick="agregarCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        lista.appendChild(div);
    });
}

function agregarCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        guardarCarrito();
        mostrarCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    carrito.forEach((producto, index) => {
        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <span>${producto.nombre} - $${producto.precio}</span>
            <button onclick="removerDelCarrito(${index})">Remover</button>
        `;
        lista.appendChild(div);
    });
    calcularTotal();
}

function removerDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

function calcularTotal() {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    document.getElementById("total").textContent = `Total: $${total}`;
}

function filtrarCarrito() {
    const filtro = document.getElementById("filtro-nombre").value.toLowerCase();
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    carrito.forEach((producto, index) => {
        if (producto.nombre.toLowerCase().includes(filtro)) {
            const div = document.createElement("div");
            div.className = "item-carrito";
            div.innerHTML = `
                <span>${producto.nombre} - $${producto.precio}</span>
                <button onclick="removerDelCarrito(${index})">Remover</button>
            `;
            lista.appendChild(div);
        }
    });
    calcularTotal();
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Comprobante de Compra", 20, 20);
    let y = 40;
    carrito.forEach(producto => {
        doc.text(`${producto.nombre} - $${producto.precio}`, 20, y);
        y += 10;
    });
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    doc.text(`Total: $${total}`, 20, y + 10);
    doc.save("comprobante.pdf");
}

document.getElementById("filtro-nombre").addEventListener("input", filtrarCarrito);
document.getElementById("generar-pdf").addEventListener("click", generarPDF);

mostrarProductos();
mostrarCarrito();