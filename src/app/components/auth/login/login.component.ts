import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        const registeredUserRaw = localStorage.getItem('registeredUser');
        const registeredUser = registeredUserRaw ? JSON.parse(registeredUserRaw) : null;

        // Fallback para demonstracao sem backend: permite entrar com usuario cadastrado localmente.
        if (
          registeredUser &&
          registeredUser.email === this.credentials.email &&
          registeredUser.password === this.credentials.password
        ) {
          localStorage.setItem('currentUser', JSON.stringify(registeredUser));
          localStorage.setItem('token', 'mock-token');
          this.router.navigate(['/home']);
          return;
        }

        // Sem usuario cadastrado, libera acesso mock para demonstracao.
        if (!registeredUser) {
          const mockUser = {
            nome: 'Usuario Demo',
            email: this.credentials.email
          };
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          localStorage.setItem('token', 'mock-token');
          this.router.navigate(['/home']);
          return;
        }

        this.errorMessage = 'Email ou senha inválidos';
        this.isLoading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/cadastro']);
  }
}
