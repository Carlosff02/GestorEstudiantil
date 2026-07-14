import { Component, computed, HostListener, inject, signal, effect, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  GraduationCap, LayoutDashboard, BookOpen,
  Calendar, Briefcase, TrendingUp,
  User, Clock, RotateCcw, Play, Pause,
  LucideAngularModule, type LucideIconData, TriangleAlert,
  LogOut, Menu, X, Box,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { PerfilAccesibilidad, PreferenciasService } from '../../../core/service/preferencias.service';

type Idioma = 'es' | 'en' | 'pt' | 'fr';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Dashboard',
    misCursos:          'Mis Cursos',
    horario:            'Horario',
    seccionAcademico:   'Académico',
    proyectos:          'Proyectos',
    estadisticas:       'Estadísticas',
    seccionCuenta:      'Cuenta',
    profile:            'Perfil',
    configuracion:      'Configuración',
    pomodoro:           'Contador',
    pomodoroPausado:    'Pausado',
    pomodoroCorriendo:  'Corriendo',
    pomodoroDetenido:   'Detenido',
    pomodoroIniciar:    'Iniciar',
    pomodoroPausar:     'Pausar',
    realidadAumentada:  'Realidad Aumentada',
    cerrarSesionTitulo: '¿Cerrar Sesión?',
    cerrarSesionDesc:   'Tu progreso actual de tiempo de estudio activo se pausará.',
    cerrarSesionBody:   '¿Estás seguro de que deseas salir de tu espacio de trabajo en',
    volverEstudio:      'Volver al estudio',
    confirmarSalida:    'Sí, cerrar sesión',
    cerrarMenu:         'Cerrar menú',
    abrirPerfil:        'Abrir menú de perfil',
    abrirMenu:          'Abrir menú de navegación',
  },
  en: {
    appName:            'StudySync',
    seccionPrincipal:   'Main',
    dashboard:          'Dashboard',
    misCursos:          'My Courses',
    horario:            'Schedule',
    seccionAcademico:   'Academic',
    proyectos:          'Projects',
    estadisticas:       'Statistics',
    seccionCuenta:      'Account',
    profile:            'Profile',
    configuracion:      'Settings',
    pomodoro:           'Timer',
    pomodoroPausado:    'Paused',
    pomodoroCorriendo:  'Running',
    pomodoroDetenido:   'Stopped',
    pomodoroIniciar:    'Start',
    pomodoroPausar:     'Pause',
    realidadAumentada:  'Augmented Reality',
    cerrarSesionTitulo: 'Sign Out?',
    cerrarSesionDesc:   'Your current active study time progress will be paused.',
    cerrarSesionBody:   'Are you sure you want to leave your workspace in',
    volverEstudio:      'Keep studying',
    confirmarSalida:    'Yes, sign out',
    cerrarMenu:         'Close menu',
    abrirPerfil:        'Open profile menu',
    abrirMenu:          'Open navigation menu',
  },
  pt: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Painel',
    misCursos:          'Meus Cursos',
    horario:            'Horário',
    seccionAcademico:   'Acadêmico',
    proyectos:          'Projetos',
    estadisticas:       'Estatísticas',
    seccionCuenta:      'Conta',
    profile:            'Perfil',
    configuracion:      'Configurações',
    pomodoro:           'Cronômetro',
    pomodoroPausado:    'Pausado',
    pomodoroCorriendo:  'Executando',
    pomodoroDetenido:   'Parado',
    pomodoroIniciar:    'Iniciar',
    pomodoroPausar:     'Pausar',
    realidadAumentada:  'Realidade Aumentada',
    cerrarSesionTitulo: 'Sair da Conta?',
    cerrarSesionDesc:   'Seu progresso atual de tempo de estudo será pausado.',
    cerrarSesionBody:   'Tem certeza de que deseja sair do seu espaço de trabalho em',
    volverEstudio:      'Voltar ao estudo',
    confirmarSalida:    'Sim, sair',
    cerrarMenu:         'Fechar menu',
    abrirPerfil:        'Abrir menu de perfil',
    abrirMenu:          'Abrir menu de navegação',
  },
  fr: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Tableau de bord',
    misCursos:          'Mes Cours',
    horario:            'Emploi du temps',
    seccionAcademico:   'Académique',
    proyectos:          'Projets',
    estadisticas:       'Statistiques',
    seccionCuenta:      'Compte',
    profile:            'Profil',
    configuracion:      'Paramètres',
    pomodoro:           'Minuteur',
    pomodoroPausado:    'En pause',
    pomodoroCorriendo:  'En cours',
    pomodoroDetenido:   'Arrêté',
    pomodoroIniciar:    'Démarrer',
    pomodoroPausar:     'Pause',
    realidadAumentada:  'Réalité Augmentée',
    cerrarSesionTitulo: 'Se déconnecter ?',
    cerrarSesionDesc:   'Votre progression de temps d\'étude actif sera mise en pause.',
    cerrarSesionBody:   'Êtes-vous sûr de vouloir quitter votre espace de travail dans',
    volverEstudio:      'Continuer à étudier',
    confirmarSalida:    'Oui, se déconnecter',
    cerrarMenu:         'Fermer le menu',
    abrirPerfil:        'Ouvrir le menu de profil',
    abrirMenu:          'Ouvrir le menu de navigation',
  },
};

const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  '': '',
  protanopia: 'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia: 'a11y-tritanopia',
  baja_vision: 'a11y-baja-vision',
  ceguera: 'a11y-ceguera',
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnDestroy {
  readonly GraduationCapIcon: LucideIconData = GraduationCap;
  readonly LayoutDashboardIcon: LucideIconData = LayoutDashboard;
  readonly BookOpenIcon: LucideIconData = BookOpen;
  readonly CalendarIcon: LucideIconData = Calendar;
  readonly BriefcaseIcon: LucideIconData = Briefcase;
  readonly TrendingUpIcon: LucideIconData = TrendingUp;
  readonly UserIcon: LucideIconData = User;
  readonly ClockIcon: LucideIconData = Clock;
  readonly RotateCcwIcon: LucideIconData = RotateCcw;
  readonly PlayIcon: LucideIconData = Play;
  readonly PauseIcon: LucideIconData = Pause;
  readonly LogOutIcon: LucideIconData = LogOut;
  readonly MenuIcon: LucideIconData = Menu;
  readonly CloseIcon: LucideIconData = X;
  readonly AlertTriangle: LucideIconData = TriangleAlert;
  readonly BoxIcon: LucideIconData = Box;

  protected readonly prefs = inject(PreferenciasService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.userSignal;
  toggleProfileMenu = signal(false);
  sidebarOpen = signal(false);

  // ─── Pomodoro ──────────────────────────────────────────────────────────
  pomodoroTotal = signal(1500);
  pomodoroSeconds = signal(1500);
  pomodoroRunning = signal(false);
  private pomodoroInterval: ReturnType<typeof setInterval> | null = null;

  pomodoroDisplay = computed(() => {
    const total = this.pomodoroSeconds();
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  });

  pomodoroProgress = computed(() => {
    const total = this.pomodoroTotal();
    const remaining = this.pomodoroSeconds();
    return ((total - remaining) / total) * 100;
  });

  pomodoroStatusLabel = computed(() => {
    if (this.pomodoroRunning()) return this.t()['pomodoroCorriendo'];
    if (this.pomodoroSeconds() < this.pomodoroTotal()) return this.t()['pomodoroPausado'];
    return this.t()['pomodoroDetenido'];
  });

  adjustPomodoro(minutes: number) {
    if (this.pomodoroRunning()) return;
    const delta = minutes * 60;
    const newTotal = Math.max(60, Math.min(7200, this.pomodoroTotal() + delta));
    this.pomodoroTotal.set(newTotal);
    this.pomodoroSeconds.set(newTotal);
  }

  togglePomodoro() {
    if (this.pomodoroRunning()) {
      this.pausePomodoro();
    } else {
      this.startPomodoro();
    }
  }

  private startPomodoro() {
    if (this.pomodoroSeconds() <= 0) {
      this.pomodoroSeconds.set(this.pomodoroTotal());
    }
    this.pomodoroRunning.set(true);
    this.pomodoroInterval = setInterval(() => {
      this.pomodoroSeconds.update(s => {
        if (s <= 1) {
          this.pausePomodoro();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  private pausePomodoro() {
    this.pomodoroRunning.set(false);
    if (this.pomodoroInterval) {
      clearInterval(this.pomodoroInterval);
      this.pomodoroInterval = null;
    }
  }

  resetPomodoro() {
    this.pausePomodoro();
    const total = this.pomodoroTotal();
    this.pomodoroSeconds.set(total);
  }

  ngOnDestroy() {
    this.pausePomodoro();
  }

  // ─── i18n ──────────────────────────────────────────────────────────────
  private idioma = computed<Idioma>(() => {
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t = computed(() => I18N[this.idioma()]);
  a11yClass = computed(() => A11Y_CLASSES[this.prefs.perfil()]);
  userInitials = computed(() => {
    const u = this.user();
    return ((u?.nombres || '')[0] ?? '') + ((u?.apellidos || '')[0] ?? '');
  });
  userFullName = computed(() => {
    const u = this.user();
    return ((u?.nombres || '') + ' ' + (u?.apellidos || '')).trim() || 'Estudiante';
  });

  constructor() {
    effect(() => {
      document.body.style.overflow = this.sidebarOpen() ? 'hidden' : '';
    });
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }

  onLogout() { this.authService.logOut(); }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (this.toggleProfileMenu()) {
      switch (event.code) {
        case 'Enter': case 'NumpadEnter':
          event.preventDefault(); this.onLogout(); break;
        case 'Escape':
          event.preventDefault(); this.toggleProfileMenu.set(false); break;
      }
      return;
    }
    if (this.sidebarOpen()) {
      if (event.code === 'Escape') { event.preventDefault(); this.closeSidebar(); }
      return;
    }
    if (!event.shiftKey) return;
    switch (event.code) {
      case 'Digit1': event.preventDefault(); this.router.navigate(['/home/dashboard']); break;
      case 'Digit2': event.preventDefault(); this.router.navigate(['/home/courses']); break;
      case 'Digit3': event.preventDefault(); this.router.navigate(['/home/schedule']); break;
      case 'Digit4': event.preventDefault(); this.router.navigate(['/home/projects']); break;
      case 'Digit5': event.preventDefault(); this.router.navigate(['/home/profile']); break;
      case 'Digit6': event.preventDefault(); this.router.navigate(['/home/ar-viewer']); break;
      case 'Escape': event.preventDefault(); this.toggleProfileMenu.set(true); break;
    }
  }
}
