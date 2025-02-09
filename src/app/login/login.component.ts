import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  showErrorScreen: boolean = false;
  isLogged: boolean = false;
  private errorTimeout: any;

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  ngOnInit() {
    document.documentElement.classList.add('login');
    document.body.classList.add('login-background');
    if (localStorage.getItem('accessToken')) {
      this.isLogged = true;
    }
  }

  ngOnDestroy() {
    document.documentElement.classList.remove('login');
    document.body.classList.remove('login-background');
  }

  async login() {
    try {
      await this.keycloakService.login();
      const token = await this.keycloakService.getToken();
      localStorage.setItem('accessToken', token);
      this.showErrorScreen = false;
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      this.showErrorScreen = true;
    }
  }

  logout() {
    this.keycloakService.logout();
    localStorage.removeItem('accessToken');
    this.isLogged = false;
  }

  handleErrorOk() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.showErrorScreen = false;
  }

  togglePassword() {
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  }
}
