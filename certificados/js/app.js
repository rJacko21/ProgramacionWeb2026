const inputNombre = document.getElementById('inputNombre');
const inputCurso = document.getElementById('inputCurso');
const inputFecha = document.getElementById('inputFecha');
const nombre = document.getElementById('nombre');
const curso = document.getElementById('curso');
const fecha = document.getElementById('fecha');

window.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.value = hoy;
    fecha.innerText = formatearFecha(hoy);
    nombre.innerText = 'Nombre del Estudiante';
    curso.innerText = 'Nombre del Curso';

    inputNombre.addEventListener('input', () => {
        nombre.innerText = inputNombre.value || 'Nombre del Estudiante';
    });

    inputCurso.addEventListener('input', () => {
        curso.innerText = inputCurso.value || 'Nombre del Curso';
    });

    inputFecha.addEventListener('input', () => {
        fecha.innerText = formatearFecha(inputFecha.value);
    });
});

function formatearFecha(valor) {
    if (!valor) return '--/--/----';
    const fechaObj = new Date(valor + 'T00:00:00');
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function imprimirCertificado() {
    window.print();
}
