/* Autores: Mariana Gómez Munist - Nro de estudiante: 207978
            Mauricio Cabrera - Nro de estudiante: 264956 */

class Sistema {
  constructor() {
    this.carreras = [];
    this.corredores = [];
    this.patrocinadores = [];
    this.inscripciones = [];
  }

  agregarCarrera(carrera) {
    let existente = this.buscarCarrera(carrera.nombre);
    if (!existente) {
      this.carreras.push(carrera);
    }
  }

  agregarCorredor(corredor) {
    let existente = this.buscarCorredor(corredor.cedula);
    if (!existente) {
      this.corredores.push(corredor);
    }
  }

  agregarOActualizarPatrocinador(patrocinadorNuevo) {
    // Si ya existía un patrocinador para esa carrera, lo eliminamos
    this.patrocinadores = this.patrocinadores.filter(
      p => p.carrera !== patrocinadorNuevo.carrera
    );

    // Si ya existía con el mismo nombre, lo eliminamos para actualizar datos
    this.patrocinadores = this.patrocinadores.filter(
      p => p.nombre !== patrocinadorNuevo.nombre
    );

    this.patrocinadores.push(patrocinadorNuevo);
  }

  buscarCarrera(nombre) {
    return this.carreras.find(c => c.nombre === nombre) || null;
  }

  buscarCorredor(cedula) {
    return this.corredores.find(c => c.cedula === cedula) || null;
  }

  estaInscripto(cedula, nombreCarrera) {
    let carrera = this.buscarCarrera(nombreCarrera);
    if (!carrera) return false;

    return carrera.inscripciones.some(insc => insc.corredor.cedula === cedula);
  }

  inscribirCorredor(cedula, nombreCarrera) {
    let corredor = this.buscarCorredor(cedula);
    let carrera = this.buscarCarrera(nombreCarrera);

    if (!corredor || !carrera) {
      return { exito: false, mensaje: "Corredor o carrera no existen." };
    }

    if (this.estaInscripto(cedula, nombreCarrera)) {
      return {
        exito: false,
        mensaje: "El corredor ya está inscripto en esta carrera."
      };
    }

    if (!corredor.fichaVigente(carrera.fecha)) {
      return {
        exito: false,
        mensaje: "La ficha médica no está vigente para la fecha de la carrera."
      };
    }

    if (!carrera.tieneCupo()) {
      return {
        exito: false,
        mensaje: "La carrera no tiene más cupos disponibles."
      };
    }

    let numero = carrera.cantidadInscriptos() + 1;
    let inscripcion = new Inscripcion(corredor, carrera, numero);
    carrera.agregarInscripcion(inscripcion);
    this.inscripciones.push(inscripcion);

    return {
      exito: true,
      mensaje: `Inscripción exitosa. Número asignado: ${numero}`,
      inscripcion: inscripcion
    };
  }

  promedioInscriptosPorCarrera() {
    if (this.carreras.length === 0) return 0;

    let total = this.carreras.reduce(
      (acc, c) => acc + c.cantidadInscriptos(),
      0
    );

    let promedio = total / this.carreras.length;
    return parseFloat(promedio.toFixed(2));
  }

  carrerasConMasInscriptos() {
    if (this.carreras.length === 0) return [];

    let max = Math.max(...this.carreras.map(c => c.cantidadInscriptos()));

    return this.carreras.filter(c => c.cantidadInscriptos() === max);
  }

  carrerasSinInscriptos() {
    let sinInscriptos = this.carreras.filter(c => c.cantidadInscriptos() === 0);
    return sinInscriptos.sort((a, b) => a.fecha - b.fecha);
  }

  porcentajeElite() {
    if (this.corredores.length === 0) return 0;

    let elite = this.corredores.filter(c => c.tipo === "elite").length;
    let porcentaje = (elite / this.corredores.length) * 100;
    return parseFloat(porcentaje.toFixed(2));
  }
}

class Carrera {
  constructor(nombre, departamento, fecha, cupo = 30) {
    this.nombre = nombre;
    this.departamento = departamento;
    this.fecha = new Date(fecha);
    this.cupo = Math.max(1, Math.min(cupo, 1000));
    this.inscripciones = [];
  }

  tieneCupo() {
    return this.inscripciones.length < this.cupo;
  }

  agregarInscripcion(inscripcion) {
    if (this.tieneCupo()) {
      this.inscripciones.push(inscripcion);
    }
  }

  cantidadInscriptos() {
    return this.inscripciones.length;
  }
}

class Corredor {
  constructor(nombre, edad, cedula, fichaMedica, tipo = "comun") {
    this.nombre = nombre;
    this.edad = edad;
    this.cedula = cedula;
    this.fichaMedica = new Date(fichaMedica);
    this.tipo = tipo;
  }

  fichaVigente(fechaCarrera) {
    return this.fichaMedica >= new Date(fechaCarrera);
  }
}

class Inscripcion {
  constructor(corredor, carrera, numero) {
    this.corredor = corredor;
    this.carrera = carrera;
    this.numero = numero;
  }
}

class Patrocinador {
  constructor(nombre, rubro, carrera) {
    this.nombre = nombre;
    this.rubro = rubro;
    this.carrera = carrera;
  }

  actualizarDatos(nuevoRubro, nuevaCarrera) {
    this.rubro = nuevoRubro;
    this.carrera = nuevaCarrera;
  }
}