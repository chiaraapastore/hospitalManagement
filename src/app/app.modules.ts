import {NgModule, APP_INITIALIZER, PLATFORM_ID, inject} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminComponent } from './admin/admin.component';
import {PazientiComponent} from './patients/patients.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {HomeComponent} from './home/home.component';

export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak
        .init({
          config: {
            url: 'http://localhost:8080',
            realm: 'hospital-realm',
            clientId: 'hospital-app',
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            redirectUri: window.location.origin
          },
        })
        .then(() => {
          console.log('Keycloak inizializzato con successo');
        })
        .catch((err) => {
          console.error('Errore inizializzazione Keycloak:', err);
        })
      : Promise.resolve();
}




@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    PazientiComponent,
    ErrorComponent,
    AdminComponent,
    NotFoundComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
