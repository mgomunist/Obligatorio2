// Autores: Mariana Gómez Munist - Nro de estudiante: 207978
//          Mauricio Cabrera - Nro de estudiante: 264956

// Instancia del sistema
const sistema = new Sistema();

// FUNCIÓN PARA CAMBIAR DE PESTAÑA
function showTab(tabId) {
    // Oculta todas las secciones
    const sections = document.querySelectorAll(".tab-content");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Muestra la sección seleccionada
    const selectedSection = document.getElementById(tabId);
    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Actualiza los botones
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => {
        const target = button.getAttribute("data-tab");
        button.classList.toggle("active", target === tabId);
    });
}

// Al cargar todo el DOM
window.addEventListener("DOMContentLoaded", () => {
    // Mostrar sección por defecto
    showTab("datos");

    // Vincular botones
    document.getElementById("btn-agregar-carrera").addEventListener("click", agregarCarreraDesdeFormulario);
    document.getElementById("btn-agregar-patrocinador").addEventListener("click", agregarOActualizarPatrocinadorDesdeFormulario);
    document.getElementById("btn-agregar-corredor").addEventListener("click", agregarCorredorDesdeFormulario);
    document.getElementById("btn-inscribir").addEventListener("click", inscribirCorredorDesdeFormulario);

    // Vincular select de carrera-consulta
    document.getElementById("carrera-consulta").addEventListener("change", actualizarTablaInscriptos);

    // Vincular radios de orden
    document.querySelectorAll('input[name="ordenar"]').forEach(radio => {
        radio.addEventListener("change", actualizarTablaInscriptos);
    });
});

// Agregar corredor
function agregarCorredorDesdeFormulario() {
    let nombre = document.getElementById("corredor-nombre").value.trim();
    let edad = parseInt(document.getElementById("edad").value);
    let cedula = document.getElementById("cedula").value.trim();
    let ficha = document.getElementById("fecha-medica").value;
    let tipo = document.querySelector('input[name="tipo-corredor"]:checked').value;

    if (!nombre || !cedula || isNaN(edad) || edad <= 0) {
        alert("Por favor, completá correctamente los datos del corredor.");
        return;
    }

    let corredor = new Corredor(nombre, edad, cedula, ficha, tipo);
    sistema.agregarCorredor(corredor);

    alert(`Corredor "${nombre}" agregado correctamente.`);

    actualizarSelectCorredores();

    document.getElementById("corredor-nombre").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("cedula").value = "";
    document.getElementById("fecha-medica").value = "2024-01-01";
}

// Agregar carrera
function agregarCarreraDesdeFormulario() {
    let nombre = document.getElementById("carrera-nombre").value.trim();
    let departamento = document.getElementById("departamento").value;
    let fecha = document.getElementById("fecha").value;
    let cupos = parseInt(document.getElementById("cupos").value);

    if (!nombre || isNaN(cupos) || cupos < 1 || cupos > 1000) {
        alert("Por favor, completá todos los campos y asegurate de que los cupos estén entre 1 y 1000.");
        return;
    }

    let carrera = new Carrera(nombre, departamento, fecha, cupos);
    sistema.agregarCarrera(carrera);

    alert(`Carrera "${nombre}" agregada correctamente.`);

    actualizarSelectCarreras();

    document.getElementById("carrera-nombre").value = "";
    document.getElementById("cupos").value = "";
}

// Agregar o actualizar patrocinador
function agregarOActualizarPatrocinadorDesdeFormulario() {
    let nombre = document.getElementById("patrocinador-nombre").value.trim();
    let rubro = document.getElementById("rubro").value;
    let carreras = parseInt(document.getElementById("carreras").value);

    if (!nombre || isNaN(carreras) || carreras < 0) {
        alert("Por favor, completá correctamente todos los campos del patrocinador.");
        return;
    }

    let patrocinador = new Patrocinador(nombre, rubro, carreras);
    sistema.agregarOActualizarPatrocinador(patrocinador);

    alert(`Patrocinador "${nombre}" registrado o actualizado con éxito.`);

    document.getElementById("patrocinador-nombre").value = "";
    document.getElementById("carreras").value = "";
}

// Inscribir corredor
function inscribirCorredorDesdeFormulario() {
    let cedula = document.getElementById("corredor-select").value;
    let nombreCarrera = document.getElementById("carrera-select").value;

    if (!cedula || !nombreCarrera) {
        alert("Seleccioná un corredor y una carrera.");
        return;
    }

    let resultado = sistema.inscribirCorredor(cedula, nombreCarrera);

    alert(resultado.mensaje);

    if (resultado.exito) {
        actualizarEstadisticas();
        actualizarTablaInscriptos();
    }
}

// Actualizar selectores de carreras
function actualizarSelectCarreras() {
    const selects = [
        document.getElementById("carrera-select"),
        document.getElementById("carrera-consulta")
    ];
    selects.forEach(select => {
        select.innerHTML = '<option value="">Seleccionar carrera</option>';
        sistema.carreras.forEach(c => {
            let option = document.createElement("option");
            option.value = c.nombre;
            option.textContent = c.nombre;
            select.appendChild(option);
        });
    });
}

// Actualizar selector de corredores
function actualizarSelectCorredores() {
    const select = document.getElementById("corredor-select");
    select.innerHTML = '<option value="">Seleccionar corredor</option>';
    sistema.corredores.forEach(corredor => {
        let option = document.createElement("option");
        option.value = corredor.cedula;
        option.textContent = corredor.nombre;
        select.appendChild(option);
    });
}

// Actualizar tabla de inscriptos
function actualizarTablaInscriptos() {
    const carreraNombre = document.getElementById("carrera-consulta").value;
    const tbody = document.querySelector(".table-container tbody");

    // Limpiar tabla
    tbody.innerHTML = "";

    if (!carreraNombre) {
        return; // No hay carrera seleccionada
    }

    const carrera = sistema.buscarCarrera(carreraNombre);

    if (!carrera || carrera.inscripciones.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No hay inscriptos en esta carrera.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    // Obtener criterio de orden
    const orden = document.querySelector('input[name="ordenar"]:checked').value;

    // Copiar inscripciones y ordenar
    const inscripcionesOrdenadas = [...carrera.inscripciones];
    inscripcionesOrdenadas.sort((a, b) => {
        if (orden === "nombre") {
            return a.corredor.nombre.localeCompare(b.corredor.nombre);
        } else {
            return a.numero - b.numero;
        }
    });

    // Llenar tabla
    inscripcionesOrdenadas.forEach(inscripcion => {
        const corredor = inscripcion.corredor;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${corredor.nombre}</td>
            <td>${corredor.edad}</td>
            <td>${corredor.cedula}</td>
            <td>${corredor.fichaMedica.toLocaleDateString()}</td>
            <td>${inscripcion.numero}</td>
        `;
        tbody.appendChild(row);
    });
}

// Funciones vacías para no dar error
function actualizarEstadisticas() {
    console.log("actualizarEstadisticas() pendiente de implementación.");
}

