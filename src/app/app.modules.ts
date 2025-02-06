import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WarehouseModule } from './warehouse/warehouse.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NotificationsService } from './services/notifications.service';
import {authInterceptor} from './interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WarehouseModule,
    KeycloakAngularModule
  ],
  providers: [KeycloakService, NotificationsService, provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule {}
