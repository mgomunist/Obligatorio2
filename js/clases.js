/* Autores: Mariana Gómez Munist - Nro de estudiante: 207978
            Mauricio Cabrera - Nro de estudiante: 264956 */

class Sistema {
    constructor() {
        this.carreras = [];
        this.corredores = [];
        this.patrocinadores = [];
        this.inscripciones = [];
    }
}

/* Metodos para agregar:  

Agregar carrera

Agregar corredor
        
Agregar patrocinador

Buscar la carrera por el nombre

Buscar al corredor por la cedula

Verificar si esta inscripto por cedula y nombre

Inscribir al corredor a una carrera

De estadisticas:
Promedio de inscriptos por carrera
Carreras con mas inscriptos
Carreras sin inscriptos       
Porcentaje de elite
*/

class Carrera {
    constructor(nombre, departamento, fecha, cupo = 30) {
        this.nombre = nombre; 
        this.departamento = departamento; // número entre 1 y 19
        this.fecha = new Date(fecha); 
        this.cupo = Math.max(1, Math.min(cupo, 1000));
        this.inscripciones = []; 
    }
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

class Corredor {
    constructor(nombre, edad, cedula, fichaMedica, tipo = "comun") {
        this.nombre = nombre;
        this.edad = edad;
        this.cedula = cedula; 
        this.fichaMedica = new Date(fichaMedica); 
        this.tipo = tipo; 
    }
}

// Verifica que la ficha médica esté vigente para la fecha de la carrera
    fichaVigente(fechaCarrera) {
        return this.fichaMedica >= new Date(fechaCarrera);
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
}

// Si el patrocinador ya esta registrado, se actualizan sus datos y las carreras que apoya
    actualizarDatos(nuevoRubro, nuevasCarreras) {
        this.rubro = nuevoRubro;
        this.carreras = nuevasCarreras;
    }