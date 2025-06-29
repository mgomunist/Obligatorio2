// main.js
// Autores: Mariana Gómez Munist - Nro de estudiante: 207978
//          Mauricio Cabrera - Nro de estudiante: 264956

function agregarCorredorDesdeFormulario() {
    let nombre = document.getElementById("corredor-nombre").value;
    let edad = parseInt(document.getElementById("edad").value);
    let cedula = document.getElementById("cedula").value;
    let ficha = document.getElementById("fecha-medica").value;

    // Obtener el tipo de corredor desde el grupo de radios
    let tipo = document.querySelector('input[name="tipo-corredor"]:checked').value;

    // Crear el corredor
    let corredor = new Corredor(nombre, edad, cedula, ficha, tipo);

    // Agregar al sistema
    sistema.corredores.push(corredor);
}

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

// Al cargar la página, mostrar solo la sección de datos
window.addEventListener("DOMContentLoaded", () => {
    showTab("datos");
});

// Instancia del sistema (asegúrate de tenerla)
const sistema = new Sistema();

