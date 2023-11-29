import { NgModule } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroExamenEspecialComponent } from './registro-examen-especial/registro-examen-especial.component';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaComponent } from './consulta/consulta.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModificarComponent } from './modificar/modificar.component';
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegistroExamenEspecialComponent,
    ConsultaComponent,
    ModificarComponent
  ],
  imports: [
    BrowserModule,
    RecaptchaV3Module,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    BrowserAnimationsModule
    ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LdXmhwpAAAAAMCZ1dCAN51JJaCUOuybU0_1D4P9" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
