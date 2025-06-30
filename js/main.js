// Autores: Mariana Gómez Munist - Nro de estudiante: 207978
//          Mauricio Cabrera - Nro de estudiante: 264956

// Instancia del sistema
const sistema = new Sistema();

// FUNCIÓN PARA CAMBIAR DE PESTAÑA
function showTab(tabId) {
  const sections = document.querySelectorAll(".tab-content");
  sections.forEach(section => section.classList.remove("active"));

  const selectedSection = document.getElementById(tabId);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach(button => {
    const target = button.getAttribute("data-tab");
    button.classList.toggle("active", target === tabId);
  });
  // Si es la pestaña estadísticas, dibujamos el mapa (asegura que se redibuje)
  if (tabId === "estadisticas") {
    dibujarMapa();
  }
}

// Al cargar todo el DOM
window.addEventListener("DOMContentLoaded", () => {
  showTab("datos");

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaHoy = `${yyyy}-${mm}-${dd}`;

  document.getElementById("fecha").value = fechaHoy;
  document.getElementById("fecha-medica").value = fechaHoy;
  document.getElementById("fecha").min = fechaHoy;
  document.getElementById("fecha-medica").min = fechaHoy;

  document.getElementById("btn-agregar-carrera").addEventListener("click", agregarCarreraDesdeFormulario);
  document.getElementById("btn-agregar-patrocinador").addEventListener("click", agregarOActualizarPatrocinadorDesdeFormulario);
  document.getElementById("btn-agregar-corredor").addEventListener("click", agregarCorredorDesdeFormulario);
  document.getElementById("btn-inscribir").addEventListener("click", inscribirCorredorDesdeFormulario);

  document.getElementById("carrera-consulta").addEventListener("change", actualizarTablaInscriptos);
  document.querySelectorAll('input[name="ordenar"]').forEach(radio => {
    radio.addEventListener("change", actualizarTablaInscriptos);
  });

  actualizarSelectCarreras();
});

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
  actualizarEstadisticas();

  document.getElementById("carrera-nombre").value = "";
  document.getElementById("cupos").value = "";
}

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
  actualizarEstadisticas();

  document.getElementById("corredor-nombre").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("cedula").value = "";
  document.getElementById("fecha-medica").value = fechaHoy;
}

// Agregar o actualizar patrocinador
function agregarOActualizarPatrocinadorDesdeFormulario() {
  let nombre = document.getElementById("patrocinador-nombre").value.trim();
  let rubro = document.getElementById("rubro").value;
  let carreraAsociada = document.getElementById("carrera-patrocinada").value;

  if (!nombre || !carreraAsociada) {
    alert("Por favor, completá todos los campos y seleccioná una carrera.");
    return;
  }

  let existiaPatrocinador = sistema.patrocinadores.some(p => p.nombre === nombre);
  let carreraYaPatrocinadaPorOtro = sistema.patrocinadores.find(
    p => p.carrera === carreraAsociada && p.nombre !== nombre
  );

  if (carreraYaPatrocinadaPorOtro) {
    alert(`La carrera "${carreraAsociada}" ya tenía un patrocinador ("${carreraYaPatrocinadaPorOtro.nombre}"). Se reemplazó por "${nombre}".`);
  }

  let patrocinador = new Patrocinador(nombre, rubro, carreraAsociada);
  sistema.agregarOActualizarPatrocinador(patrocinador);

  if (existiaPatrocinador) {
    alert(`Patrocinador "${nombre}" actualizado correctamente.`);
  } else {
    alert(`Patrocinador "${nombre}" creado correctamente.`);
  }

  document.getElementById("patrocinador-nombre").value = "";
  document.getElementById("carrera-patrocinada").value = "";
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

  if (!resultado.exito) {
    alert(resultado.mensaje);
    return;
  }

  const inscripcion = resultado.inscripcion;
  const corredor = inscripcion.corredor;
  const carrera = inscripcion.carrera;

  let patrocinador = sistema.patrocinadores.find(p => p.carrera === carrera.nombre);

  const fechaFicha = corredor.fichaMedica.toLocaleDateString();
  const fechaCarrera = carrera.fecha.toLocaleDateString();

  let mensaje = `Número: ${inscripcion.numero}\n`;
  mensaje += `Nombre: ${corredor.nombre} ${corredor.edad} años, CI: ${corredor.cedula} Ficha Médica ${fechaFicha}\n`;
  mensaje += corredor.tipo === "elite" ? "Deportista de elite\n" : "Común\n";
  mensaje += `Carrera: ${carrera.nombre} en ${carrera.departamento} el ${fechaCarrera} Cupo: ${carrera.cupo}\n`;
  if (patrocinador) {
    mensaje += `${patrocinador.nombre} (${patrocinador.rubro})`;
  }

  alert(mensaje);

  actualizarEstadisticas();
  actualizarTablaInscriptos();
}

// Actualizar selectores de carreras
function actualizarSelectCarreras() {
  const selects = [
    document.getElementById("carrera-select"),
    document.getElementById("carrera-consulta"),
    document.getElementById("carrera-patrocinada")
  ];
  selects.forEach(select => {
    if (!select) return;
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
  tbody.innerHTML = "";

  if (!carreraNombre) return;

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

  const orden = document.querySelector('input[name="ordenar"]:checked').value;
  const inscripcionesOrdenadas = [...carrera.inscripciones];
  inscripcionesOrdenadas.sort((a, b) => {
    if (orden === "nombre") {
      return a.corredor.nombre.localeCompare(b.corredor.nombre);
    } else {
      return a.numero - b.numero;
    }
  });

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

// Actualizar estadísticas dinámicamente
function actualizarEstadisticas() {
  const lista = document.getElementById("estadisticas-lista");
  if (!lista) {
    console.error("No se encontró la lista de estadísticas.");
    return;
  }

  lista.innerHTML = "";

  const promedio = sistema.promedioInscriptosPorCarrera();
  const liPromedio = document.createElement("li");
  liPromedio.textContent = `Promedio de inscriptos por carrera: ${promedio}`;
  lista.appendChild(liPromedio);

  const masInscriptos = sistema.carrerasConMasInscriptos();
  const liMas = document.createElement("li");
  if (masInscriptos.length > 0 && masInscriptos[0].cantidadInscriptos() > 0) {
    const nombres = masInscriptos.map(c => `· ${c.nombre}`).join("<br>&emsp;");
    liMas.innerHTML = `Carreras con más inscriptos:<br>&emsp;${nombres}`;
  } else {
    liMas.textContent = "Carreras con más inscriptos: sin datos";
  }
  lista.appendChild(liMas);

  // Carreras SIN inscriptos
  const carrerasSinInscriptos = sistema.carreras.filter(c => c.cantidadInscriptos() === 0);
  carrerasSinInscriptos.sort((a, b) => a.fecha - b.fecha);
  const liSin = document.createElement("li");
  if (carrerasSinInscriptos.length > 0) {
    const nombres = carrerasSinInscriptos.map(c => `· ${c.nombre}`).join("<br>&emsp;");
    liSin.innerHTML = `Carreras sin inscriptos ordenadas por fecha:<br>&emsp;${nombres}`;
  } else {
    liSin.textContent = "Carreras sin inscriptos ordenadas por fecha: sin datos";
  }
  lista.appendChild(liSin);

  const porcentajeElite = sistema.porcentajeElite();
  const liElite = document.createElement("li");
  liElite.textContent = `Porcentaje de conversiones de élite: ${porcentajeElite}%`;
  lista.appendChild(liElite);
}

// Cargar Google Charts
google.charts.load("current", {
  packages: ["geochart"]
});

google.charts.setOnLoadCallback(() => {
  // Escuchar los radios del mapa
  document.querySelectorAll('input[name="visualizar"]').forEach(radio => {
  radio.addEventListener("change", dibujarMapa);
});

  // Dibujar mapa al cargar
  dibujarMapa();
});

function dibujarMapa() {
  const tipo = document.querySelector('input[name="visualizar"]:checked').value;

  // Conteo por departamento
  const conteo = {};
  sistema.carreras.forEach(carrera => {
    const dep = carrera.departamento;
    if (!conteo[dep]) conteo[dep] = 0;

    if (tipo === "carreras") {
      conteo[dep]++;
    } else {
      conteo[dep] += carrera.inscripciones.length;
    }
  });

  const departamentos = [
    "Montevideo",
    "Artigas",
    "Canelones",
    "Cerro Largo",
    "Colonia",
    "Durazno",
    "Flores",
    "Florida",
    "Lavalleja",
    "Maldonado",
    "Paysandú",
    "Río Negro",
    "Rivera",
    "Rocha",
    "Salto",
    "San José",
    "Soriano",
    "Tacuarembó",
    "Treinta y Tres"
  ];

const datos = [
    ["Departamento", "Cantidad", { role: "tooltip", p: {html: true} }]
  ];

  departamentos.forEach(dep => {
    const cantidad = conteo[dep] || 0;
    datos.push([
      dep,
      cantidad,
      `<div style="padding:5px;"><strong>${dep}</strong><br/>Cantidad: ${cantidad} ${tipo === "carreras" ? "carreras" : "inscripciones"}</div>`
    ]);
  });

const data = google.visualization.arrayToDataTable(datos);


  const options = {
    region: 'UY',               
    displayMode: 'regions',     
    resolution: 'provinces',    
    colorAxis: {
      colors: ['#d0e9f7', '#0077be']  // De celeste claro a azul oscuro
    },
    backgroundColor: '#e0f7fa',
    datalessRegionColor: '#f0f0f0',
    defaultColor: '#d0d0d0',
    tooltip: { isHtml: true, trigger: 'focus' },
    enableRegionInteractivity: true,
  };

  const chart = new google.visualization.GeoChart(document.getElementById('mapa'));
  chart.draw(data, options);
}

// Volver a dibujar el mapa si la ventana cambia de tamaño. Es para hacerlo más responsivo.
window.addEventListener("resize", () => {
  // Solo si la pestaña estadísticas está activa
  const estadisticasActiva = document.getElementById("estadisticas").classList.contains("active");
  if (estadisticasActiva) {
    dibujarMapa();
  }
});