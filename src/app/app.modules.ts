import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsService } from './services/notifications.service';
import { AuthService } from './services/auth.service';
import {KeycloakService} from 'keycloak-angular';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [NotificationsService, AuthService, KeycloakService],
})
export class AppModule {}
