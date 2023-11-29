import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // URL del backend

  constructor(private http: HttpClient) {}

  verificarMatricula(matricula: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-matricula/${matricula}`);
  }


  // Método para obtener materias por el id de carrera
  obtenerMateriasPorCarrera(idCarrera: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/materias-carrera/${idCarrera}`);
  }

  asignarDatos(datosAlumno: any) {
    return this.http.post(`${this.baseUrl}/asignar-datos`, datosAlumno);
  }

  asignarMateria(asignacionMateria: any) {
    return this.http.post(`${this.baseUrl}/asignar-materia`, asignacionMateria);
  }

 buscarAlumnoPorMatricula(matricula: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/buscar-datos/${matricula}`);
}

actualizarDatosAlumno(datosAlumno: any): Observable<any> {
  // Asume que tienes una variable de entorno o una constante para tu URL base
  const url = `${this.baseUrl}/actualizar-datos`;
  return this.http.post(url, datosAlumno);
}

actualizarEstatusMateria(matricula: string, claveMateria: string, estatus: string): Observable<any> {
  const url = `${this.baseUrl}/actualizar-estatus`;
  const body = { matricula, claveMateria, estatus };
  return this.http.post(url, body);
}
eliminarAsignacionMateria(matricula: string, claveMateria: string): Observable<any> {
  const url = `${this.baseUrl}/eliminar-asignacion`;
  const body = { matricula, claveMateria };
  return this.http.post(url, body);
}


}