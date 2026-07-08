import { Injectable, signal, computed } from '@angular/core';

/**
 * Tipos para idioma y perfil de accesibilidad
 */
export type IdiomaUI = 'es' | 'en' | 'pt' | 'fr';

export type PerfilAccesibilidad =
  | ''
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'baja_vision'
  | 'ceguera';

/** Clave para localStorage */
const PREFERENCIAS_KEY = 'preferencias-ui';

/** Interfaz de preferencias de visualización */
export interface PreferenciasUI {
  idioma: IdiomaUI;
  perfilAccesibilidad: PerfilAccesibilidad;
}

/**
 * Interfaz unificada de traducciones.
 * Incluye todo lo necesario para el login Y para el sidebar de accesibilidad.
 */
export interface UiStrings {
  // ── Login ────────────────────────────────────────────────────────
  brand: string;
  tagline: string;
  tabLogin: string;
  tabRegister: string;
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  loginPasswordLabel: string;
  loginPasswordPlaceholder: string;
  loginSubmit: string;
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

  // ── Perfiles de accesibilidad (compartidos) ──────────────────────
  a11yNone: string;
  a11yProtanopia: string;
  a11yDeuteranopia: string;
  a11yTritanopia: string;
  a11yBajaVision: string;
  a11yCeguera: string;

  // ── Sidebar de accesibilidad ──────────────────────────────────────
  btnA11y: string;
  btnCerrar: string;
  sidebarTitulo: string;
  sidebarSubtitulo: string;
  idiomaLabel: string;
  perfilLabel: string;
  perfilNinguno: string;
  perfilProtanopia: string;
  perfilDeuteranopia: string;
  perfilTritanopia: string;
  perfilBajaVision: string;
  perfilCeguera: string;
  restablecerBtn: string;
  idiomaEs: string;
  idiomaEn: string;
  idiomaPt: string;
  idiomaFr: string;

  // ── Anuncios para lectores de pantalla ──────────────────────────
  announceIdioma: string;
  announcePerfil: string;
  announceSidebarAbierto: string;
  announceSidebarCerrado: string;
}

export const UI_TRANSLATIONS: Record<IdiomaUI, UiStrings> = {
  es: {
    // Login
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

    // Perfiles
    a11yNone: 'Ninguno',
    a11yProtanopia: 'Daltonismo (Protanopia)',
    a11yDeuteranopia: 'Daltonismo (Deuteranopia)',
    a11yTritanopia: 'Daltonismo (Tritanopia)',
    a11yBajaVision: 'Baja visión',
    a11yCeguera: 'Ceguera',

    // Sidebar
    btnA11y: 'Accesibilidad',
    btnCerrar: 'Cerrar',
    sidebarTitulo: 'Accesibilidad',
    sidebarSubtitulo: 'Personaliza tu experiencia',
    idiomaLabel: 'Idioma de la interfaz',
    perfilLabel: 'Perfil de accesibilidad',
    perfilNinguno: 'Ninguno',
    perfilProtanopia: 'Protanopia (daltonismo rojo-verde)',
    perfilDeuteranopia: 'Deuteranopia (daltonismo rojo-verde)',
    perfilTritanopia: 'Tritanopia (daltonismo azul-amarillo)',
    perfilBajaVision: 'Baja visión',
    perfilCeguera: 'Ceguera',
    restablecerBtn: 'Restablecer',
    idiomaEs: 'Español',
    idiomaEn: 'English',
    idiomaPt: 'Português',
    idiomaFr: 'Français',

    // Anuncios
    announceIdioma: 'Idioma cambiado a',
    announcePerfil: 'Perfil de accesibilidad cambiado a',
    announceSidebarAbierto: 'Panel de accesibilidad abierto',
    announceSidebarCerrado: 'Panel de accesibilidad cerrado',
  },
  en: {
    // Login
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

    // Perfiles
    a11yNone: 'None',
    a11yProtanopia: 'Color blindness (Protanopia)',
    a11yDeuteranopia: 'Color blindness (Deuteranopia)',
    a11yTritanopia: 'Color blindness (Tritanopia)',
    a11yBajaVision: 'Low vision',
    a11yCeguera: 'Blindness',

    // Sidebar
    btnA11y: 'Accessibility',
    btnCerrar: 'Close',
    sidebarTitulo: 'Accessibility',
    sidebarSubtitulo: 'Customize your experience',
    idiomaLabel: 'Interface language',
    perfilLabel: 'Accessibility profile',
    perfilNinguno: 'None',
    perfilProtanopia: 'Protanopia (red-green color blindness)',
    perfilDeuteranopia: 'Deuteranopia (red-green color blindness)',
    perfilTritanopia: 'Tritanopia (blue-yellow color blindness)',
    perfilBajaVision: 'Low vision',
    perfilCeguera: 'Blindness',
    restablecerBtn: 'Reset',
    idiomaEs: 'Español',
    idiomaEn: 'English',
    idiomaPt: 'Português',
    idiomaFr: 'Français',

    // Anuncios
    announceIdioma: 'Language changed to',
    announcePerfil: 'Accessibility profile changed to',
    announceSidebarAbierto: 'Accessibility panel opened',
    announceSidebarCerrado: 'Accessibility panel closed',
  },
  pt: {
    // Login
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

    // Perfiles
    a11yNone: 'Nenhum',
    a11yProtanopia: 'Daltonismo (Protanopia)',
    a11yDeuteranopia: 'Daltonismo (Deuteranopia)',
    a11yTritanopia: 'Daltonismo (Tritanopia)',
    a11yBajaVision: 'Baixa visão',
    a11yCeguera: 'Cegueira',

    // Sidebar
    btnA11y: 'Acessibilidade',
    btnCerrar: 'Fechar',
    sidebarTitulo: 'Acessibilidade',
    sidebarSubtitulo: 'Personalize sua experiência',
    idiomaLabel: 'Idioma da interface',
    perfilLabel: 'Perfil de acessibilidade',
    perfilNinguno: 'Nenhum',
    perfilProtanopia: 'Protanopia (daltonismo vermelho-verde)',
    perfilDeuteranopia: 'Deuteranopia (daltonismo vermelho-verde)',
    perfilTritanopia: 'Tritanopia (daltonismo azul-amarelo)',
    perfilBajaVision: 'Baixa visão',
    perfilCeguera: 'Cegueira',
    restablecerBtn: 'Restabelecer',
    idiomaEs: 'Español',
    idiomaEn: 'English',
    idiomaPt: 'Português',
    idiomaFr: 'Français',

    // Anuncios
    announceIdioma: 'Idioma alterado para',
    announcePerfil: 'Perfil de acessibilidade alterado para',
    announceSidebarAbierto: 'Painel de acessibilidade aberto',
    announceSidebarCerrado: 'Painel de acessibilidade fechado',
  },
  fr: {
    // Login
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

    // Perfiles
    a11yNone: 'Aucun',
    a11yProtanopia: 'Daltonisme (Protanopie)',
    a11yDeuteranopia: 'Daltonisme (Deutéranopie)',
    a11yTritanopia: 'Daltonisme (Tritanopie)',
    a11yBajaVision: 'Basse vision',
    a11yCeguera: 'Cécité',

    // Sidebar
    btnA11y: 'Accessibilité',
    btnCerrar: 'Fermer',
    sidebarTitulo: 'Accessibilité',
    sidebarSubtitulo: 'Personnalisez votre expérience',
    idiomaLabel: "Langue de l'interface",
    perfilLabel: "Profil d'accessibilité",
    perfilNinguno: 'Aucun',
    perfilProtanopia: 'Protanopie (daltonisme rouge-vert)',
    perfilDeuteranopia: 'Deutéranopie (daltonisme rouge-vert)',
    perfilTritanopia: 'Tritanopie (daltonisme bleu-jaune)',
    perfilBajaVision: 'Basse vision',
    perfilCeguera: 'Cécité',
    restablecerBtn: "Réinitialiser",
    idiomaEs: 'Español',
    idiomaEn: 'English',
    idiomaPt: 'Português',
    idiomaFr: 'Français',

    // Anuncios
    announceIdioma: 'Langue changée en',
    announcePerfil: 'Profil accessibilité changé en',
    announceSidebarAbierto: 'Panneau accessibilité ouvert',
    announceSidebarCerrado: 'Panneau accessibilité fermé',
  },
};

/** Mapeo de perfil → clase CSS */
export const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  '':            '',
  protanopia:    'a11y-protanopia',
  deuteranopia:  'a11y-deuteranopia',
  tritanopia:    'a11y-tritanopia',
  baja_vision:   'a11y-baja-vision',
  ceguera:       'a11y-ceguera',
};

/**
 * Servicio global de preferencias de visualización.
 *
 * A diferencia de las preferencias de la CUENTA (que se guardan con el usuario),
 * estas preferencias son de VISUALIZACIÓN y aplican a TODA la app, incluso
 * antes de hacer login.
 *
 * Se persisten en localStorage para que sobrevivan recargas.
 */
@Injectable({
  providedIn: 'root',
})
export class PreferenciasService {
  /** Preferencias actuales */
  private _idioma = signal<IdiomaUI>(this.loadFromStorage().idioma);
  private _perfil = signal<PerfilAccesibilidad>(this.loadFromStorage().perfilAccesibilidad);

  /** Sidebar abierto/cerrado */
  sidebarAbierto = signal(false);

  /** Señales públicas de solo lectura */
  readonly idioma = this._idioma.asReadonly();
  readonly perfil = this._perfil.asReadonly();

  /** Texto de la interfaz según idioma actual */
  readonly t = computed(() => UI_TRANSLATIONS[this._idioma()]);

  /** Clase CSS según perfil actual */
  readonly a11yClass = computed(() => A11Y_CLASSES[this._perfil()]);

  /** Mensaje para aria-live */
  readonly announce = signal('');

  /** Nombres de idiomas para anuncios */
  private readonly idiomaNombres: Record<IdiomaUI, string> = {
    es: 'Español', en: 'English', pt: 'Português', fr: 'Français',
  };

  constructor() {
    // Cargar preferencias guardadas al iniciar
    const saved = this.loadFromStorage();
    this._idioma.set(saved.idioma);
    this._perfil.set(saved.perfilAccesibilidad);
  }

  /** Cambia el idioma de la interfaz */
  cambiarIdioma(idioma: IdiomaUI): void {
    this._idioma.set(idioma);
    this.announce.set(`${this.t().announceIdioma} ${this.idiomaNombres[idioma]}`);
    this.guardarEnStorage();
  }

  /** Cambia el perfil de accesibilidad */
  cambiarPerfil(perfil: PerfilAccesibilidad): void {
    this._perfil.set(perfil);
    const t = this.t();
    const perfilNombres: Record<PerfilAccesibilidad, string> = {
      '':            t.a11yNone,
      protanopia:    t.a11yProtanopia,
      deuteranopia:  t.a11yDeuteranopia,
      tritanopia:    t.a11yTritanopia,
      baja_vision:   t.a11yBajaVision,
      ceguera:       t.a11yCeguera,
    };
    this.announce.set(`${t.announcePerfil} ${perfilNombres[perfil]}`);
    this.guardarEnStorage();
  }

  /** Abre el sidebar de accesibilidad */
  abrirSidebar(): void {
    this.sidebarAbierto.set(true);
    this.announce.set(this.t().announceSidebarAbierto);
  }

  /** Cierra el sidebar de accesibilidad */
  cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
    this.announce.set(this.t().announceSidebarCerrado);
  }

  /** Alterna el sidebar */
  toggleSidebar(): void {
    if (this.sidebarAbierto()) {
      this.cerrarSidebar();
    } else {
      this.abrirSidebar();
    }
  }

  /** Restablece las preferencias a valores por defecto */
  restablecer(): void {
    this._idioma.set('es');
    this._perfil.set('');
    this.guardarEnStorage();
    this.announce.set('Preferencias restablecidas');
  }

  /** Carga preferencias desde localStorage */
  private loadFromStorage(): PreferenciasUI {
    try {
      const raw = localStorage.getItem(PREFERENCIAS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PreferenciasUI>;
        return {
          idioma: (parsed.idioma && this.isIdiomaValido(parsed.idioma))
            ? parsed.idioma
            : 'es',
          perfilAccesibilidad: (parsed.perfilAccesibilidad && this.isPerfilValido(parsed.perfilAccesibilidad))
            ? parsed.perfilAccesibilidad
            : '',
        };
      }
    } catch {
      // Si falla el parseo, usar defaults
    }
    return { idioma: 'es', perfilAccesibilidad: '' };
  }

  /** Guarda preferencias en localStorage */
  private guardarEnStorage(): void {
    localStorage.setItem(PREFERENCIAS_KEY, JSON.stringify({
      idioma: this._idioma(),
      perfilAccesibilidad: this._perfil(),
    }));
  }

  private isIdiomaValido(val: unknown): val is IdiomaUI {
    return typeof val === 'string' && ['es', 'en', 'pt', 'fr'].includes(val);
  }

  private isPerfilValido(val: unknown): val is PerfilAccesibilidad {
    return typeof val === 'string' && ['', 'protanopia', 'deuteranopia', 'tritanopia', 'baja_vision', 'ceguera'].includes(val);
  }
}
