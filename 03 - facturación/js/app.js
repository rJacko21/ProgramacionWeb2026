// Establecer la fecha actual en el campo de fecha
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fechaFactura');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
    
    // Agregar la primera fila vacía
    agregarFila();
});

/**
 * FUNCIÓN PRINCIPAL: Agregar una fila nuevas al formulario
 * Contiene inputs para: descripción, cantidad, precio
 */
function agregarFila() {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    
    // Crear fila
    const fila = document.createElement('tr');
    fila.className = 'fila-producto';
    
    fila.innerHTML = `
        <td>
            <input type="text" class="descripcion" placeholder="Ej: Consultoría en Software">
        </td>
        <td>
            <input type="number" class="cantidad" placeholder="0" min="0" step="1" value="0">
        </td>
        <td>
            <input type="number" class="precio" placeholder="0.00" min="0" step="0.01" value="0">
        </td>
        <td>
            <span class="subtotal-celda">$0.00</span>
        </td>
        <td>
            <button class="btn btn-eliminar" onclick="eliminarFila(this)">Eliminar</button>
        </td>
    `;
    
    cuerpoTabla.appendChild(fila);
    
    // Agregar eventos a los inputs de esta fila para calcular subtotal
    const cantidadInput = fila.querySelector('.cantidad');
    const precioInput = fila.querySelector('.precio');
    
    cantidadInput.addEventListener('input', function() {
        calcularSubtotalFila(this);
        calcularTotales();
    });
    
    precioInput.addEventListener('input', function() {
        calcularSubtotalFila(this);
        calcularTotales();
    });
}

/**
 * Calcular el subtotal de una fila específica (cantidad * precio)
 */
function calcularSubtotalFila(input) {
    const fila = input.closest('.fila-producto');
    const cantidad = parseFloat(fila.querySelector('.cantidad').value) || 0;
    const precio = parseFloat(fila.querySelector('.precio').value) || 0;
    
    const subtotal = cantidad * precio;
    
    const celdaSubtotal = fila.querySelector('.subtotal-celda');
    celdaSubtotal.textContent = '$' + subtotal.toFixed(2);
}

/**
 * Eliminar una fila del formulario
 */
function eliminarFila(boton) {
    const fila = boton.closest('.fila-producto');
    fila.remove();
    calcularTotales();
}

/**
 * Calcular los totales: subtotal general, IVA (10%) y total final
 */
function calcularTotales() {
    const filas = document.querySelectorAll('.fila-producto');
    let subtotalGeneral = 0;
    
    // Recorrer cada fila y sumar los subtotales
    filas.forEach(function(fila) {
        const cantidad = parseFloat(fila.querySelector('.cantidad').value) || 0;
        const precio = parseFloat(fila.querySelector('.precio').value) || 0;
        
        const subtotal = cantidad * precio;
        subtotalGeneral += subtotal;
    });
    
    // Calcular IVA (10%)
    const iva = subtotalGeneral * 0.10;
    
    // Calcular total final
    const totalFinal = subtotalGeneral + iva;
    
    // Actualizar display en el formulario
    document.getElementById('subtotal').textContent = '$' + subtotalGeneral.toFixed(2);
    document.getElementById('iva').textContent = '$' + iva.toFixed(2);
    document.getElementById('totalFinal').textContent = '$' + totalFinal.toFixed(2);
    
    // Actualizar display en la factura de impresión
    document.getElementById('subtotalImp').textContent = '$' + subtotalGeneral.toFixed(2);
    document.getElementById('ivaImp').textContent = '$' + iva.toFixed(2);
    document.getElementById('totalFinalImp').textContent = '$' + totalFinal.toFixed(2);
}

/**
 * Limpiar el formulario
 */
function limpiarFormulario() {
    // Limpiar inputs de cliente
    document.getElementById('nombreCliente').value = '';
    document.getElementById('rucCliente').value = '';
    
    // Establecer fecha actual
    const fechaInput = document.getElementById('fechaFactura');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
    
    // Eliminar todas las filas y crear una nueva vacía
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.innerHTML = '';
    
    agregarFila();
    calcularTotales();
}

/**
 * Generar la factura para impresión (PDF)
 */
function imprimirFactura() {
    // Obtener datos del formulario
    const nombreCliente = document.getElementById('nombreCliente').value || 'Sin especificar';
    const rucCliente = document.getElementById('rucCliente').value || 'Sin especificar';
    const fechaFactura = document.getElementById('fechaFactura').value || 'Sin especificar';
    
    // Actualizar datos en la factura de impresión
    document.getElementById('nombreClienteImp').textContent = nombreCliente;
    document.getElementById('rucClienteImp').textContent = rucCliente;
    document.getElementById('fechaFacturaImp').textContent = formatearFecha(fechaFactura);
    
    // Generar número de factura (basado en la hora actual)
    const numeroFactura = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    document.getElementById('numeroFactura').textContent = numeroFactura;
    
    // Copiar datos de la tabla al área de impresión
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const cuerpoTablaImp = document.getElementById('cuerpoTablaImp');
    
    cuerpoTablaImp.innerHTML = '';
    
    const filas = cuerpoTabla.querySelectorAll('.fila-producto');
    
    let tieneProductos = false;
    
    filas.forEach(function(fila) {
        const descripcion = fila.querySelector('.descripcion').value;
        const cantidad = fila.querySelector('.cantidad').value;
        const precio = fila.querySelector('.precio').value;
        
        // Solo agregar filas que tengan datos
        if (descripcion || cantidad || precio) {
            tieneProductos = true;
            
            const cantidad_num = parseFloat(cantidad) || 0;
            const precio_num = parseFloat(precio) || 0;
            const subtotal = cantidad_num * precio_num;
            
            const filaCopia = document.createElement('tr');
            filaCopia.innerHTML = `
                <td>${descripcion}</td>
                <td>${cantidad_num}</td>
                <td>$${precio_num.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            `;
            
            cuerpoTablaImp.appendChild(filaCopia);
        }
    });
    
    if (!tieneProductos) {
        alert('Por favor, agregue al menos un producto a la factura antes de exportar.');
        return;
    }
    
    // Validar que haya cliente
    if (!nombreCliente || nombreCliente === 'Sin especificar') {
        alert('Por favor, ingrese el nombre del cliente.');
        return;
    }
    
    // Mostrar la factura (ocultando el resto del contenido)
    const factura = document.getElementById('factura');
    const container = document.querySelector('.container');
    
    factura.style.display = 'block';
    container.style.display = 'none';
    
    // Imprimir
    window.print();
    
    // Restaurar la vista normal después de imprimir
    setTimeout(function() {
        factura.style.display = 'none';
        container.style.display = 'block';
    }, 500);
}

/**
 * Función auxiliar para formatear la fecha
 */
function formatearFecha(fechaString) {
    if (!fechaString) return '--/--/----';
    
    const fecha = new Date(fechaString + 'T00:00:00');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    
    return `${dia}/${mes}/${año}`;
}
