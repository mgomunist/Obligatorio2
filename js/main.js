//esto es para agregar al corredor y obtener el valor de tipo (elite o comun) para que funcione porcentajeElite() en clases
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
