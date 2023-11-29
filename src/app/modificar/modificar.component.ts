import { Component, OnInit } from '@angular/core';
import { EstadoService } from '../estado.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnInit {
  estudiante: any;
  formulario!: FormGroup;

  constructor(private dataService: EstadoService, private fb: FormBuilder,private apiService: ApiService) {}

  ngOnInit() {
    // Obtén los datos del estudiante del servicio de estado
    this.estudiante = this.dataService.getEstudianteAModificar();

    // Inicializa el formulario con los datos del estudiante y aplicando las validaciones
    this.formulario = this.fb.group({
      matricula: [this.estudiante.matricula],
      nombre: [this.estudiante.nombre],
      email: [this.estudiante.email, [Validators.required, Validators.email]],
      telefono: [this.estudiante.telefono, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      grado: [this.estudiante.grado, Validators.required],
      carrera: [this.estudiante.carrera],
      clave_materia: [this.estudiante.clave_materia],
      materia: [this.estudiante.materia],
      estatus: [this.estudiante.estatus, Validators.required]
    });
  }

  onSubmit() {
    const valoresFormulario = this.formulario.value;
    console.log('Datos del formulario:', valoresFormulario);
  
    if (!this.sonIguales(valoresFormulario, this.estudiante)) {
      this.actualizarDatos(valoresFormulario);
      this.actualizarEstatusMateria(valoresFormulario);
    }
  }
  
  sonIguales(obj1: any, obj2: any): boolean {
    // Función para verificar si dos objetos son iguales
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  actualizarDatos(valoresFormulario: any) {
    this.apiService.actualizarDatosAlumno(valoresFormulario).subscribe(response => {
      console.log(response);
      if (response.success) {
        alert('Datos del alumno actualizados correctamente.');
      } else {
        alert('Error al actualizar datos del alumno.');
      }
    });
  }

  actualizarEstatusMateria(valoresFormulario: any) {
    const { matricula, clave_materia, estatus } = valoresFormulario;
    if (clave_materia && estatus) {
      this.apiService.actualizarEstatusMateria(matricula, clave_materia, estatus).subscribe(response => {
        console.log(response);
        if (response.success) {
          alert('Estatus de la materia actualizado correctamente.');
        } else {
          alert('Error al actualizar estatus de la materia.');
        }
      });
    }
  }
}