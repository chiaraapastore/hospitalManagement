import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';
  protected showErrorScreen: boolean = false;
  protected showSuccessScreen: boolean = false;
  private errorTimeout: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    document.documentElement.classList.add('register');
    document.body.classList.add('register-background');
  }

  ngOnDestroy() {
    document.documentElement.classList.remove('register');
    document.body.classList.remove('register-background');
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  register(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.showErrorScreen = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showErrorScreen = true;
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        console.log('Registrazione avvenuta con successo.');
        this.showSuccessScreen = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Registrazione fallita:', error);
        this.showErrorScreen = true;

        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        this.errorTimeout = setTimeout(() => {
          this.showErrorScreen = false;
        }, 5000);
      },
    });
  }

  handleErrorOk(): void {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.showErrorScreen = false;
  }
}
