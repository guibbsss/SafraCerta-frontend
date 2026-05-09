import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nome = '';
  email = '';
  password = '';
  confirmPassword = '';
  codigoAcesso = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (
      !this.nome ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.codigoAcesso
    ) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      this.successMessage = '';
      return;
    }

    if (this.codigoAcesso.trim().length < 10) {
      this.errorMessage = 'O código de acesso da fazenda deve ter pelo menos 10 caracteres';
      this.successMessage = '';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas nao coincidem';
      this.successMessage = '';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .register({
        nome: this.nome.trim(),
        email: this.email.trim(),
        senha: this.password,
        codigoAcesso: this.codigoAcesso.trim()
      })
      .subscribe({
        next: (res) => {
          this.successMessage = res.mensagem + ' Redirecionando para o login...';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err: HttpErrorResponse) => {
          console.error('[cadastro]', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            body: err.error
          });
          this.isLoading = false;
          const body = err.error as { detail?: string; message?: string } | undefined;
          this.errorMessage =
            body?.detail ||
            body?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            'Nao foi possivel concluir o cadastro. Tente novamente.';
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
