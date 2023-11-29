import { Component } from '@angular/core';
import { ColumnMode , TableColumn} from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { EstadoService } from '../estado.service';
import { finalize } from 'rxjs/operators';  // Importa la función finalize

interface ApiResponse {
  success: boolean;
  alumnos: Array<{
    matricula: number;
    nombre: string;
    carrera: string;
    grado: string;
    email: string;
    telefono: string;
    clave_materia: number;
    materia: string;
  }>;
}

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})

export class ConsultaComponent {
  isLoading: boolean = false;
  matricula: string = ''; 
  rows: any[] = [];
  exportButtonDisabled: boolean = true
  columns: TableColumn[] = [

    { prop: 'matricula', name: 'Matrícula', resizeable: true, minWidth: 100  },
    { prop: 'nombre', name: 'Nombre', resizeable: true, minWidth: 500  },
    { prop: 'carrera', name: 'Carrera', resizeable: true, minWidth: 100  },
    { prop: 'grado', name: 'Grado', resizeable: true, minWidth: 100  },
    { prop: 'estatus', name: 'Estatus', resizeable: true, minWidth: 100  },
    { prop: 'email', name: 'Email', resizeable: true, minWidth: 100  },
    { prop: 'telefono', name: 'Telefono', resizeable: true, minWidth: 100  },
    { prop: 'clave_materia', name: 'Cve. Materia', resizeable: true, minWidth: 100  },
    { prop: 'materia', name: 'Materia', resizeable: true, minWidth: 100  },
  ];
  ColumnMode = ColumnMode;
  
constructor(private apiService: ApiService,private cdr: ChangeDetectorRef,private router: Router,private estadoService: EstadoService,) {}

 buscarAlumno() {
    if (!this.matricula) {
      alert('Por favor, introduce una matrícula.');
      return;
    }

    // Establecer la propiedad de carga a verdadero
    this.isLoading = true;

    this.apiService.buscarAlumnoPorMatricula(this.matricula).subscribe({
      next: (response: ApiResponse) => {
        this.isLoading = false; // Establecer la carga a falso cuando los datos se han cargado

        if (response.success && response.alumnos) {
          // Verificar si el alumno tiene materias asignadas
          const tieneMaterias = response.alumnos.some(alumno => alumno.clave_materia !== null);

          if (tieneMaterias) {
            // Llenar el DataTable con los datos de los alumnos
            this.rows = response.alumnos;
            this.exportButtonDisabled = false; // Habilitar el botón de exportar
          } else {
            // Manejar el caso en el que el alumno no tiene materias asignadas
            this.rows = [];
            this.exportButtonDisabled = true; // Deshabilitar el botón de exportar
            alert('El alumno no tiene materias asignadas.');
          }
        } else {
          // Manejar el caso en el que no se encontraron alumnos
          this.rows = [];
          this.exportButtonDisabled = true; // Deshabilitar el botón de exportar
          alert('No se encontraron alumnos para la matrícula proporcionada.');
        }
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (error) => {
        this.isLoading = false; // Establecer la carga a falso si hay un error
        console.error('Error al buscar el alumno', error);
        alert('Error al buscar el alumno. Intenta de nuevo más tarde.');
        this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    });
  }

  exportarExcel(): void {
    if (this.rows.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // Crear un nuevo libro de trabajo y una hoja de cálculo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rows);

    // Añadir la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');

    // Escribir el libro de trabajo y guardar el archivo
    const wbout: Blob = new Blob([XLSX.write(wb, {bookType: 'xlsx', type: 'array'})], { type: 'application/octet-stream' });
    saveAs(wbout, 'Alumnos.xlsx');
  }


modificar(row: any) {
  this.estadoService.setEstudianteAModificar(row);
  console.log('Modificar', row);
  this.router.navigate(['/modificar']);
}

eliminar(row: any) {
  const confirmarEliminacion = confirm('¿Estás seguro de que deseas eliminar la asignación de materia?');
  if (!confirmarEliminacion) {
    return;
  }

  if (!row.clave_materia) {
    alert('El alumno no tiene asignada ninguna materia para eliminar.');
    return;
  }

  this.isLoading = true;

  this.apiService.eliminarAsignacionMateria(row.matricula.toString(), row.clave_materia.toString())
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      (response) => {
        if (response.success) {
          alert('Asignación de materia eliminada correctamente.');
          // Actualizar la lista después de eliminar
          this.buscarAlumno();
        } else {
          alert('Error al eliminar la asignación de materia.');
        }

        // Verificar si ya no existen registros de materias
        if (this.rows.every(alumno => !alumno.clave_materia)) {
          alert('No hay más registros de materias asignadas.');
          this.rows = [];
        }

        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      (error) => {
        console.error('Error al eliminar la asignación de materia:', error);
        alert('Error al eliminar la asignación de materia. Intenta de nuevo más tarde.');
        this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    );
}

}

