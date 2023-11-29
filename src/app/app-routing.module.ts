import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; 
import { RegistroExamenEspecialComponent } from './registro-examen-especial/registro-examen-especial.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ModificarComponent } from './modificar/modificar.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, 
  { path: 'inicio', component: InicioComponent },
  { path: 'registro-examen-especial', component: RegistroExamenEspecialComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'modificar', component: ModificarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
