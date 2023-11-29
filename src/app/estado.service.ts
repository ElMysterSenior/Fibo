// estado.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private datosEstudiante: any = null;
  private estudianteAModificar: any = null;

  constructor() { }

  guardarDatosEstudiante(datos: any): void {
    this.datosEstudiante = datos;
  }

  obtenerDatosEstudiante(): any {
    return this.datosEstudiante;
  }
  setEstudianteAModificar(estudiante: any) {
    this.estudianteAModificar = estudiante;
  }

  getEstudianteAModificar(): any {
    return this.estudianteAModificar;
  }
}
