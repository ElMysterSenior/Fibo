import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { EstadoService } from '../estado.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  matricula: string = '';
  captchaResponse: string = '';
  
  constructor(private httpClient: HttpClient,private apiService: ApiService, private router: Router,private estadoService: EstadoService) {}

  verificarYRedirigir() {
    this.apiService.verificarMatricula(this.matricula).subscribe({
      next: (response) => {
        if (response.exists) {
          // Guardar todos los datos del estudiante
          this.estadoService.guardarDatosEstudiante(response.student);
          // Redirigir al usuario al otro formulario
          this.router.navigate(['/registro-examen-especial']);
        } else {
          alert('Matrícula no encontrada. Por favor, verifica tus datos.');
        }
      },
      error: (error) => {
        console.error('Hubo un error al verificar la matrícula', error);
        alert('Error al verificar la matrícula. Intenta de nuevo más tarde.');
      }
    });
  }

}
