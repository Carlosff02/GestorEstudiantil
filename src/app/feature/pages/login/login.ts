import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
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
  Globe,
  Eye,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { LoginRequest, RegisterRequest } from '../../types/login-request.type';
import { Router } from '@angular/router';
/**
 * Preferencias de VISUALIZACIÓN del portal de autenticación:
 * idioma de la interfaz y perfil de accesibilidad visual.
 *
 * Estas preferencias son independientes de los campos `idioma` y
 * `perfilAccesibilidad` del formulario de registro:
 *
 * - Los campos del formulario de registro guardan la preferencia
 *   de la CUENTA, que se aplicará una vez el usuario inicie sesión.
 * - Las preferencias de este archivo controlan cómo se ve ESTA
 *   PÁGINA (login / registro) ahora mismo, para que cualquier
 *   visitante -incluso antes de tener cuenta- pueda usarla cómodamente.
 */

export type IdiomaUI = 'es' | 'en' | 'pt' | 'fr';

export type PerfilAccesibilidad =
  | ''
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'baja_vision'
  | 'ceguera';

/** Clase CSS aplicada a .auth-portal según el perfil elegido */
export const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  '':           '',
  protanopia:   'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia:   'a11y-tritanopia',
  baja_vision:  'a11y-baja-vision',
  ceguera:      'a11y-ceguera',
};

export interface UiStrings {
  // Encabezado
  brand: string;
  tagline: string;

  // Pestañas
  tabLogin: string;
  tabRegister: string;

  // Formulario de inicio de sesión
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  loginPasswordLabel: string;
  loginPasswordPlaceholder: string;
  loginSubmit: string;

  // Formulario de registro
  regNombresLabel: string;
  regNombresPlaceholder: string;
  regApellidosLabel: string;
  regApellidosPlaceholder: string;
  regEmailLabel: string;
  regEmailPlaceholder: string;
  regPasswordLabel: string;
  regPasswordPlaceholder: string;
  regIdiomaLabel: string;
  regA11yLabel: string;
  regA11yHelp: string;
  regSubmit: string;

  // Opciones del perfil de accesibilidad (compartidas)
  a11yNone: string;
  a11yProtanopia: string;
  a11yDeuteranopia: string;
  a11yTritanopia: string;
  a11yBajaVision: string;
  a11yCeguera: string;

  // Panel de preferencias de visualización de la página
  toolbarTitle: string;
  toolbarIdiomaLabel: string;
  toolbarA11yLabel: string;
  toolbarHint: string;
  skipLink: string;

  // Anuncios para lectores de pantalla
  liveIdioma: string;
  liveA11y: string;
}

export const UI_TRANSLATIONS: Record<IdiomaUI, UiStrings> = {
  es: {
    brand: 'StudySync',
    tagline: 'Plataforma de Gestión Estudiantil Integral',

    tabLogin: 'Iniciar Sesión',
    tabRegister: 'Crear Cuenta',

    loginEmailLabel: 'Correo Electrónico',
    loginEmailPlaceholder: 'correo@ejemplo.com',
    loginPasswordLabel: 'Contraseña',
    loginPasswordPlaceholder: '••••••••',
    loginSubmit: 'Iniciar Sesión',

    regNombresLabel: 'Nombres',
    regNombresPlaceholder: 'Alex',
    regApellidosLabel: 'Apellidos',
    regApellidosPlaceholder: 'Estudiante',
    regEmailLabel: 'Correo Electrónico',
    regEmailPlaceholder: 'correo@estudiante.com',
    regPasswordLabel: 'Contraseña',
    regPasswordPlaceholder: 'Mínimo 6 caracteres',
    regIdiomaLabel: 'Idioma preferido de la cuenta',
    regA11yLabel: 'Perfil de accesibilidad de la cuenta',
    regA11yHelp: 'Nos ayuda a adaptar los colores y la visualización de la plataforma cuando inicies sesión.',
    regSubmit: 'Registrar Cuenta',

    a11yNone: 'Ninguno',
    a11yProtanopia: 'Daltonismo (Protanopia)',
    a11yDeuteranopia: 'Daltonismo (Deuteranopia)',
    a11yTritanopia: 'Daltonismo (Tritanopia)',
    a11yBajaVision: 'Baja visión',
    a11yCeguera: 'Ceguera',

    toolbarTitle: 'Preferencias de visualización',
    toolbarIdiomaLabel: 'Idioma de la interfaz',
    toolbarA11yLabel: 'Perfil de accesibilidad visual',
    toolbarHint: 'Pulsa Tab para llegar a estos campos, usa las flechas ↑ y ↓ para cambiar la opción, y Enter o Espacio para confirmarla.',
    skipLink: 'Ir a preferencias de idioma y accesibilidad',

    liveIdioma: 'Idioma de la interfaz cambiado a',
    liveA11y: 'Perfil de accesibilidad cambiado a',
  },
  en: {
    brand: 'StudySync',
    tagline: 'Comprehensive Student Management Platform',

    tabLogin: 'Log In',
    tabRegister: 'Create Account',

    loginEmailLabel: 'Email Address',
    loginEmailPlaceholder: 'email@example.com',
    loginPasswordLabel: 'Password',
    loginPasswordPlaceholder: '••••••••',
    loginSubmit: 'Log In',

    regNombresLabel: 'First Name',
    regNombresPlaceholder: 'Alex',
    regApellidosLabel: 'Last Name',
    regApellidosPlaceholder: 'Student',
    regEmailLabel: 'Email Address',
    regEmailPlaceholder: 'email@student.com',
    regPasswordLabel: 'Password',
    regPasswordPlaceholder: 'At least 6 characters',
    regIdiomaLabel: 'Account preferred language',
    regA11yLabel: 'Account accessibility profile',
    regA11yHelp: 'Helps us adapt colors and display once you sign in.',
    regSubmit: 'Create Account',

    a11yNone: 'None',
    a11yProtanopia: 'Color blindness (Protanopia)',
    a11yDeuteranopia: 'Color blindness (Deuteranopia)',
    a11yTritanopia: 'Color blindness (Tritanopia)',
    a11yBajaVision: 'Low vision',
    a11yCeguera: 'Blindness',

    toolbarTitle: 'Display preferences',
    toolbarIdiomaLabel: 'Interface language',
    toolbarA11yLabel: 'Visual accessibility profile',
    toolbarHint: 'Press Tab to reach these fields, use the ↑ and ↓ arrow keys to change the option, and Enter or Space to confirm it.',
    skipLink: 'Go to language and accessibility preferences',

    liveIdioma: 'Interface language changed to',
    liveA11y: 'Accessibility profile changed to',
  },
  pt: {
    brand: 'StudySync',
    tagline: 'Plataforma Integral de Gestão Estudantil',

    tabLogin: 'Entrar',
    tabRegister: 'Criar Conta',

    loginEmailLabel: 'E-mail',
    loginEmailPlaceholder: 'email@exemplo.com',
    loginPasswordLabel: 'Senha',
    loginPasswordPlaceholder: '••••••••',
    loginSubmit: 'Entrar',

    regNombresLabel: 'Nome',
    regNombresPlaceholder: 'Alex',
    regApellidosLabel: 'Sobrenome',
    regApellidosPlaceholder: 'Estudante',
    regEmailLabel: 'E-mail',
    regEmailPlaceholder: 'email@estudante.com',
    regPasswordLabel: 'Senha',
    regPasswordPlaceholder: 'Mínimo de 6 caracteres',
    regIdiomaLabel: 'Idioma preferido da conta',
    regA11yLabel: 'Perfil de acessibilidade da conta',
    regA11yHelp: 'Ajuda a adaptar as cores e a exibição da plataforma após o login.',
    regSubmit: 'Criar Conta',

    a11yNone: 'Nenhum',
    a11yProtanopia: 'Daltonismo (Protanopia)',
    a11yDeuteranopia: 'Daltonismo (Deuteranopia)',
    a11yTritanopia: 'Daltonismo (Tritanopia)',
    a11yBajaVision: 'Baixa visão',
    a11yCeguera: 'Cegueira',

    toolbarTitle: 'Preferências de exibição',
    toolbarIdiomaLabel: 'Idioma da interface',
    toolbarA11yLabel: 'Perfil de acessibilidade visual',
    toolbarHint: 'Pressione Tab para chegar a estes campos, use as setas ↑ e ↓ para mudar a opção, e Enter ou Espaço para confirmá-la.',
    skipLink: 'Ir para preferências de idioma e acessibilidade',

    liveIdioma: 'Idioma da interface alterado para',
    liveA11y: 'Perfil de acessibilidade alterado para',
  },
  fr: {
    brand: 'StudySync',
    tagline: 'Plateforme Intégrale de Gestion Étudiante',

    tabLogin: 'Se connecter',
    tabRegister: 'Créer un compte',

    loginEmailLabel: 'Adresse e-mail',
    loginEmailPlaceholder: 'email@exemple.com',
    loginPasswordLabel: 'Mot de passe',
    loginPasswordPlaceholder: '••••••••',
    loginSubmit: 'Se connecter',

    regNombresLabel: 'Prénom',
    regNombresPlaceholder: 'Alex',
    regApellidosLabel: 'Nom',
    regApellidosPlaceholder: 'Étudiant',
    regEmailLabel: 'Adresse e-mail',
    regEmailPlaceholder: 'email@etudiant.com',
    regPasswordLabel: 'Mot de passe',
    regPasswordPlaceholder: '6 caractères minimum',
    regIdiomaLabel: 'Langue préférée du compte',
    regA11yLabel: "Profil d'accessibilité du compte",
    regA11yHelp: "Nous aide à adapter les couleurs et l'affichage une fois connecté.",
    regSubmit: 'Créer le compte',

    a11yNone: 'Aucun',
    a11yProtanopia: 'Daltonisme (Protanopie)',
    a11yDeuteranopia: 'Daltonisme (Deutéranopie)',
    a11yTritanopia: 'Daltonisme (Tritanopie)',
    a11yBajaVision: 'Basse vision',
    a11yCeguera: 'Cécité',

    toolbarTitle: "Préférences d'affichage",
    toolbarIdiomaLabel: "Langue de l'interface",
    toolbarA11yLabel: "Profil d'accessibilité visuelle",
    toolbarHint: "Appuyez sur Tab pour atteindre ces champs, utilisez les flèches ↑ et ↓ pour changer l'option, et Entrée ou Espace pour la valider.",
    skipLink: "Aller aux préférences de langue et d'accessibilité",

    liveIdioma: "Langue de l'interface changée en",
    liveA11y: "Profil d'accessibilité changé en",
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

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
  readonly globeIcon      = Globe;
  readonly eyeIcon        = Eye;

  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  /** Referencia al primer selector del panel de preferencias, para el "skip link" */
  @ViewChild('uiIdiomaSelect') uiIdiomaSelect?: ElementRef<HTMLSelectElement>;

  activeTab = signal<'login' | 'register'>('login');

  // ── Preferencias de VISUALIZACIÓN de esta página (independientes de la cuenta) ──
  // Estas NO se guardan en el formulario de registro: solo cambian cómo se ve
  // este portal de acceso para la persona que lo está usando ahora mismo.
  uiIdioma = signal<IdiomaUI>('es');
  uiPerfilAccesibilidad = signal<PerfilAccesibilidad>('');

  /** Mensaje para la región "aria-live" que anuncia los cambios a lectores de pantalla */
  liveMessage = signal('');

  loginForm: LoginRequest = { correo: '', password: '' };
  registerForm: RegisterRequest = {
    nombres: '', apellidos: '', correo: '', password: '',
    idioma: 'es', perfilAccesibilidad: '',
  };

  /** Diccionario de textos según el idioma elegido para la INTERFAZ de esta página */
  t = computed(() => UI_TRANSLATIONS[this.uiIdioma()]);

  /** Clase CSS reactiva según el perfil de accesibilidad elegido para esta PÁGINA */
  a11yClass = computed(() =>
    A11Y_CLASSES[this.uiPerfilAccesibilidad()] ?? ''
  );

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
  }

  /** Cambia el idioma visual del portal de acceso (no el idioma guardado en la cuenta) */
  onIdiomaChange(idioma: IdiomaUI): void {
    this.uiIdioma.set(idioma);

    const nombres: Record<IdiomaUI, string> = {
      es: 'Español', en: 'English', pt: 'Português', fr: 'Français',
    };
    this.liveMessage.set(`${UI_TRANSLATIONS[idioma].liveIdioma} ${nombres[idioma]}`);
  }

  /** Cambia el perfil de accesibilidad visual del portal (no el guardado en la cuenta) */
  onA11yChange(perfil: PerfilAccesibilidad): void {
    this.uiPerfilAccesibilidad.set(perfil);

    const t = this.t();
    const nombres: Record<PerfilAccesibilidad, string> = {
      '':            t.a11yNone,
      protanopia:    t.a11yProtanopia,
      deuteranopia:  t.a11yDeuteranopia,
      tritanopia:    t.a11yTritanopia,
      baja_vision:   t.a11yBajaVision,
      ceguera:       t.a11yCeguera,
    };
    this.liveMessage.set(`${t.liveA11y} ${nombres[perfil]}`);
  }

  /**
   * Lleva el foco al panel de preferencias de idioma/accesibilidad.
   * Se usa desde el "skip link" para que cualquier persona que navegue
   * con teclado pueda llegar a estos controles en un solo paso (Tab + Enter).
   */
  focusToolbar(event: Event): void {
    event.preventDefault();
    this.uiIdiomaSelect?.nativeElement.focus();
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
