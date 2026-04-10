const alumnos = [
    { nombre: "Juan", nota: 7 },
    { nombre: "Ana", nota: 9 },
    { nombre: "Lucía", nota: 8.5 },
    { nombre: "Carlos", nota: 6.7 },
    { nombre: "María", nota: 10 },
    { nombre: "Sofía", nota: 5.4 }
];

window.addEventListener('DOMContentLoaded', () => {
    renderizarAlumnos();
    calcularEstadisticas();
    renderizarGrafico();
});

function calcularEstadisticas() {
    const promedio = alumnos.reduce((total, alumno) => total + alumno.nota, 0) / alumnos.length;
    const mejorAlumno = alumnos.reduce((mejor, alumno) => alumno.nota > mejor.nota ? alumno : mejor, alumnos[0]);
    const peorAlumno = alumnos.reduce((peor, alumno) => alumno.nota < peor.nota ? alumno : peor, alumnos[0]);

    document.getElementById('promedio').textContent = promedio.toFixed(2);
    document.getElementById('mejorAlumno').textContent = `${mejorAlumno.nombre} — ${mejorAlumno.nota.toFixed(2)}`;
    document.getElementById('peorAlumno').textContent = `${peorAlumno.nombre} — ${peorAlumno.nota.toFixed(2)}`;
}

function renderizarAlumnos() {
    const cuerpo = document.getElementById('listaAlumnos');
    cuerpo.innerHTML = '';

    alumnos.forEach(alumno => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.nota.toFixed(2)}</td>
        `;
        cuerpo.appendChild(fila);
    });
}

function renderizarGrafico() {
    const grafico = document.getElementById('graficoNotas');
    grafico.innerHTML = '<div class="barra-chart"></div>';
    const contenedor = grafico.querySelector('.barra-chart');

    const maxNota = Math.max(...alumnos.map(alumno => alumno.nota));

    alumnos.forEach(alumno => {
        const porcentaje = (alumno.nota / maxNota) * 100;
        const barraContenedor = document.createElement('div');
        barraContenedor.className = 'barra-wrap';

        const barra = document.createElement('div');
        barra.className = 'barra';
        barra.style.height = `${porcentaje}%`;
        barra.setAttribute('data-value', alumno.nota.toFixed(1));

        const label = document.createElement('div');
        label.className = 'barra-label';
        label.textContent = alumno.nombre;

        barraContenedor.appendChild(barra);
        barraContenedor.appendChild(label);
        contenedor.appendChild(barraContenedor);
    });
}

function imprimirDashboard() {
    window.print();
}
