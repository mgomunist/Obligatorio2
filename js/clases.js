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
    for (let i = 0; i < this.patrocinadores.length; i++) {
      if (this.patrocinadores[i].nombre === patrocinadorNuevo.nombre) {
        // Si ya existe actualiza rubro y carreras
        this.patrocinadores[i].actualizarDatos(
          patrocinadorNuevo.rubro,
          patrocinadorNuevo.carreras
        );
        return;
      }
    }

    // Si no existe lo agrega
    this.patrocinadores.push(patrocinadorNuevo);
  }

  buscarCarrera(nombre) {
    for (let carrera of this.carreras) {
      if (carrera.nombre === nombre) {
        return carrera;
      }
    }
    return null;
  }

  buscarCorredor(cedula) {
    for (let corredor of this.corredores) {
      if (corredor.cedula === cedula) {
        return corredor;
      }
    }
    return null;
  }

  estaInscripto(cedula, nombreCarrera) {
    let carrera = this.buscarCarrera(nombreCarrera);
    if (!carrera) return false;

    for (let inscripcion of carrera.inscripciones) {
      if (inscripcion.corredor.cedula === cedula) {
        return true;
      }
    }
    return false;
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
        mensaje: "El corredor ya está inscripto en esta carrera.",
      };
    }

    if (!corredor.fichaVigente(carrera.fecha)) {
      return {
        exito: false,
        mensaje: "La ficha médica no está vigente para la fecha de la carrera.",
      };
    }

    if (!carrera.tieneCupo()) {
      return {
        exito: false,
        mensaje: "La carrera no tiene más cupos disponibles.",
      };
    }

    let numero = carrera.cantidadInscriptos() + 1;
    let inscripcion = new Inscripcion(corredor, carrera, numero);
    carrera.agregarInscripcion(inscripcion);
    this.inscripciones.push(inscripcion);

    return {
      exito: true,
      mensaje: `Inscripción exitosa. Número asignado: ${numero}`,
      inscripcion: inscripcion,
    };
  }

  //De estadisticas:
  promedioInscriptosPorCarrera() {
    if (this.carreras.length === 0) return 0;

    let totalInscriptos = 0;
    for (let carrera of this.carreras) {
      totalInscriptos += carrera.cantidadInscriptos();
    }

    let promedio = totalInscriptos / this.carreras.length;
    return parseFloat(promedio.toFixed(2));
  }

  carrerasConMasInscriptos() {
    if (this.carreras.length === 0) {
      return [];
    }

    let max = -Infinity;
    for (let i = 0; i < this.carreras.length; i++) {
      let cantidad = this.carreras[i].cantidadInscriptos();
      if (cantidad > max) {
        max = cantidad;
      }
    }

    let resultado = [];
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].cantidadInscriptos() === max) {
        resultado.push(this.carreras[i]);
      }
    }

    return resultado;
  }

  carrerasSinInscriptos() {
    let sinInscriptos = [];

    for (let carrera of this.carreras) {
      if (carrera.cantidadInscriptos() === 0) {
        sinInscriptos.push(carrera);
      }
    }

    // Ordenar por fecha creciente
    sinInscriptos.sort(function (a, b) {
      return a.fecha - b.fecha;
    });

    return sinInscriptos;
  }

  porcentajeElite() {
    if (this.corredores.length === 0) return 0;

    let elite = 0;
    for (let corredor of this.corredores) {
      if (corredor.tipo === "elite") {
        elite++;
      }
    }

    let porcentaje = (elite / this.corredores.length) * 100;
    return parseFloat(porcentaje.toFixed(2));
  }
}

class Carrera {
  constructor(nombre, departamento, fecha, cupo = 30) {
    this.nombre = nombre;
    this.departamento = departamento; // número entre 1 y 19
    this.fecha = new Date(fecha);
    this.cupo = Math.max(1, Math.min(cupo, 1000));
    this.inscripciones = [];
  }

  // Verificar que haya cupo en la carrera
  tieneCupo() {
    return this.inscripciones.length < this.cupo;
  }

  // Da un número consecutivo si se puede inscribir
  agregarInscripcion(inscripcion) {
    if (this.tieneCupo()) {
      this.inscripciones.push(inscripcion);
    }
  }

  // Retorna la cantidad de inscriptos en una carrera
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

  // Verifica que la ficha médica esté vigente para la fecha de la carrera
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
  constructor(nombre, rubro, carreras = []) {
    this.nombre = nombre;
    this.rubro = rubro;
    this.carreras = carreras;
  }

  // Si el patrocinador ya esta registrado, se actualizan sus datos y las carreras que apoya
  actualizarDatos(nuevoRubro, nuevasCarreras) {
    this.rubro = nuevoRubro;
    this.carreras = nuevasCarreras;
  }
}
