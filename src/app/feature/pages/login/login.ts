import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Layers,
  Mail,
  Lock,
  User,
  UserPlus,
  ArrowRight,
  Check,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { LoginRequest, RegisterRequest } from '../../types/login-request.type';
import { Router } from '@angular/router';
import { PreferenciasService } from '../../../core/service/preferencias.service';

/**
 * Componente de Login/Registro.
 *
 * Usa PreferenciasService para las traducciones de la interfaz y
 * el perfil de accesibilidad visual.
 *
 * Las preferencias de ACCESO (idioma/perfil de la cuenta) se guardan
 * con el registro y se aplican la próxima vez que el usuario inicie sesión.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  readonly layersIcon     = Layers;
  readonly mailIcon       = Mail;
  readonly lockIcon       = Lock;
  readonly userIcon       = User;
  readonly userPlusIcon   = UserPlus;
  readonly arrowRightIcon = ArrowRight;
  readonly checkIcon      = Check;

  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);
  readonly prefs = inject(PreferenciasService);

  activeTab = signal<'login' | 'register'>('login');

  // ── Preferencias de VISUALIZACIÓN (del servicio global) ──
  uiIdioma = this.prefs.idioma;
  uiPerfilAccesibilidad = this.prefs.perfil;

  loginForm: LoginRequest = { correo: '', password: '' };
  registerForm: RegisterRequest = {
    nombres: '', apellidos: '', correo: '', password: '',
    idioma: 'es', perfilAccesibilidad: '',
  };

  /** Traducciones de la interfaz */
  t = this.prefs.t;

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
  }

  handleLogin(): void {
    this.authService.login(this.loginForm).subscribe({
      next:  () => this.router.navigate(['/home']),
      error: (err) => console.error(err),
    });
  }

  handleRegister(): void {
    this.authService.register(this.registerForm).subscribe({
      next:  () => this.router.navigate(['/home']),
      error: (err) => console.error(err),
    });
  }
}
