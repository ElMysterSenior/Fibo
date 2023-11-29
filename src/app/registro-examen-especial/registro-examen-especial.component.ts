import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { EstadoService } from '../estado.service'; // Asumiendo que tienes este servicio para manejar el estado
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-examen-especial',
  templateUrl: './registro-examen-especial.component.html',
  styleUrls: ['./registro-examen-especial.component.css']
})
export class RegistroExamenEspecialComponent implements OnInit {
  formulario: FormGroup;

  materias: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private estadoService: EstadoService, // Servicio para obtener la matrícula almacenada
    private router: Router
  ) {
    this.formulario = this.fb.group({
      matricula: [{value: '', disabled: true}],
      nombre: [{value: '', disabled: true}],
      carrera: [{value: '', disabled: true}],
      materiaSeleccionada: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      grado: ['', Validators.required], // Si no necesitas validación para grado
      estatus: ['', Validators.required], // Si no necesitas validación para estatus
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
    
  }

  cargarMaterias() {
    const datosEstudiante = this.estadoService.obtenerDatosEstudiante();
    if (datosEstudiante && datosEstudiante.id_carrera) {
      this.apiService.obtenerMateriasPorCarrera(datosEstudiante.id_carrera).subscribe({
        next: (materias) => {
          this.materias = materias; // Almacena las materias directamente
        },
        error: (error) => {
          console.error('Error al obtener las materias:', error);
          // Opcionalmente, manejar errores en la UI aquí.
        }
      });
    } else {
      // Opcionalmente, manejar el caso donde no hay datos de estudiante o id_carrera aquí.
    }
  }

  campoEsInvalido(nombreCampo: string): boolean {
    const campo = this.formulario.get(nombreCampo);
    return campo?.invalid && (campo?.dirty || campo?.touched) || false;
  }

  obtenerMensajeError(nombreCampo: string): string | null {
    const campo = this.formulario.get(nombreCampo);
    if (campo?.errors) {
      if (campo.errors['required']) {
        return 'Este campo es obligatorio.';
      } else if (campo.errors['pattern']) {
 if (nombreCampo === 'telefono') {
          return 'El teléfono debe tener 10 dígitos.';
        } else if (nombreCampo === 'nombre') {
          return 'El nombre debe contener solo letras y espacios.';
        }
      } else if (campo.errors['email'] && nombreCampo === 'correo') {
        return 'El formato del correo no es válido.';
      }
    }
    return null;
  }

  
  ngOnInit() {
    this.cargarMaterias();
    const datosEstudiante = this.estadoService.obtenerDatosEstudiante();
    if (datosEstudiante) {
      this.formulario.patchValue({
        matricula: datosEstudiante.matricula,
        nombre: datosEstudiante.alumno,
        carrera: datosEstudiante.carrera
      });
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      const datosEstudiante = this.estadoService.obtenerDatosEstudiante();
      const datosFormulario = this.formulario.value;

      // Preparar los datos para enviar al backend
      const datosAlumno = {
        matricula: datosEstudiante.matricula,
        correo: datosFormulario.correo,
        telefono: datosFormulario.telefono,
        grado: datosFormulario.grado
      };

      const asignacionMateria = {
        matricula_alumno: datosEstudiante.matricula,
        id_carrera: datosEstudiante.id_carrera,
        clave_materia: datosFormulario.materiaSeleccionada,
        estatus: datosFormulario.estatus
      };

      // Llamar al servicio para asignar los datos del alumno
      this.apiService.asignarDatos(datosAlumno).subscribe({
        next: (respuestaDatos) => {
          console.log('Datos del alumno asignados', respuestaDatos);

          // Si los datos del alumno se asignaron con éxito, asignar la materia
          this.apiService.asignarMateria(asignacionMateria).subscribe({
            next: (respuestaMateria) => {
              alert('Materia asignada');
              console.log('Materia asignada', respuestaMateria);
              
              // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            },
            error: (error) => {
              alert('El alumno ya tiene 2 materias asignadas');
              this.router.navigate(['/inicio']);
            }
          });
        },
        error: (error) => {
          console.error('Error al asignar los datos del alumno:', error);
          // Manejar el error de asignación de datos del alumno aquí
        }
      });
    } else {
      alert('Por favor, rellena todos los campos requeridos.');
    }
  }
}
