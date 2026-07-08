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
import { ToastService } from '../../../shared/toast/toast.service';

/**
 * Componente de Login/Registro.
 *
 * Usa PreferenciasService para las traducciones de la interfaz y
 * el perfil de accesibilidad visual.
 *
 * Las preferencias de ACCESO (idioma/perfil de la cuenta) se guardan
 * con el registro y se aplican la próxima vez que el usuario inicie sesión.
 *
 * Mejoras: mensajes toast de error/confirmación y diseño responsive.
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
  private readonly toast       = inject(ToastService);
  readonly prefs = inject(PreferenciasService);

  activeTab = signal<'login' | 'register'>('login');
  loading   = signal(false);

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
    // Validación básica client-side
    if (!this.loginForm.correo || !this.loginForm.password) {
      this.toast.warning('Campos requeridos', 'Por favor completa todos los campos para iniciar sesión.');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const msg = err?.error?.mensaje || err?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.toast.error('Error de inicio de sesión', msg);
        this.loading.set(false);
      },
    });
  }

  handleRegister(): void {
    // Validación básica
    if (!this.registerForm.nombres || !this.registerForm.apellidos ||
        !this.registerForm.correo || !this.registerForm.password) {
      this.toast.warning('Campos requeridos', 'Por favor completa todos los campos para registrarte.');
      return;
    }
    if (this.registerForm.password.length < 6) {
      this.toast.warning('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.loading.set(true);
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.toast.success('¡Cuenta creada!', 'Tu cuenta se ha registrado exitosamente. Bienvenido a StudySync.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const msg = err?.error?.mensaje || err?.message || 'Error al registrarte. Intenta de nuevo.';
        this.toast.error('Error de registro', msg);
        this.loading.set(false);
      },
    });
  }
}
