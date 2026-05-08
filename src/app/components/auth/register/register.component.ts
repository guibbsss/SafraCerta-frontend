import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    nome: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.user.nome || !this.user.email || !this.user.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      this.successMessage = '';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas nao coincidem';
      this.successMessage = '';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para login...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => {
        // Fallback para demonstracao sem backend.
        localStorage.setItem('registeredUser', JSON.stringify(this.user));
        this.successMessage = 'Cadastro salvo localmente. Redirecionando para login...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
