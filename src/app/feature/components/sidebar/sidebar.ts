import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Layers, X, ChevronDown, LayoutDashboard, BookOpen,
  Calendar, Briefcase, FolderOpen, Play,
  LucideAngularModule, type LucideIconData, TriangleAlert,
  LogOut,
  User,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { PreferenciasService } from '../../../core/service/preferencias.service';

type Idioma = 'es' | 'en' | 'pt' | 'fr';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Dashboard',
    misCursos:          'Mis Cursos',
    horario:            'Horario',
    seccionProyectos:   'Proyectos & Trabajo',
    misProyectos:       'Mis Proyectos',
    tiempoEstudio:      'Tiempo Estudio',
    cerrarSesionTitulo: '¿Cerrar Sesión?',
    cerrarSesionDesc:   'Tu progreso actual de tiempo de estudio activo se pausará.',
    cerrarSesionBody:   '¿Estás seguro de que deseas salir de tu espacio de trabajo en',
    volverEstudio:      'Volver al estudio',
    confirmarSalida:    'Sí, cerrar sesión',
    cerrarMenu:         'Cerrar menú',
    abrirPerfil:        'Abrir menú de perfil',
    profile: 'Mi Pefil',
    cuenta: 'Cuenta'
  },
  en: {
    appName:            'StudySync',
    seccionPrincipal:   'Main',
    dashboard:          'Dashboard',
    misCursos:          'My Courses',
    horario:            'Schedule',
    seccionProyectos:   'Projects & Work',
    misProyectos:       'My Projects',
    tiempoEstudio:      'Study Time',
    cerrarSesionTitulo: 'Sign Out?',
    cerrarSesionDesc:   'Your current active study time progress will be paused.',
    cerrarSesionBody:   'Are you sure you want to leave your workspace in',
    volverEstudio:      'Keep studying',
    confirmarSalida:    'Yes, sign out',
    cerrarMenu:         'Close menu',
    abrirPerfil:        'Open profile menu',
    profile: 'My Profile',
    cuenta: 'Account'
  },
  pt: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Painel',
    misCursos:          'Meus Cursos',
    horario:            'Horário',
    seccionProyectos:   'Projetos & Trabalho',
    misProyectos:       'Meus Projetos',
    tiempoEstudio:      'Tempo de Estudo',
    cerrarSesionTitulo: 'Sair da Conta?',
    cerrarSesionDesc:   'Seu progresso atual de tempo de estudo será pausado.',
    cerrarSesionBody:   'Tem certeza de que deseja sair do seu espaço de trabalho em',
    volverEstudio:      'Voltar ao estudo',
    confirmarSalida:    'Sim, sair',
    cerrarMenu:         'Fechar menu',
    abrirPerfil:        'Abrir menu de perfil',
    profile: 'Meu Perfil',
    cuenta: 'Conta'
  },
  fr: {
    appName:            'StudySync',
    seccionPrincipal:   'Principal',
    dashboard:          'Tableau de bord',
    misCursos:          'Mes Cours',
    horario:            'Emploi du temps',
    seccionProyectos:   'Projets & Travail',
    misProyectos:       'Mes Projets',
    tiempoEstudio:      'Temps d\'Étude',
    cerrarSesionTitulo: 'Se déconnecter ?',
    cerrarSesionDesc:   'Votre progression de temps d\'étude actif sera mise en pause.',
    cerrarSesionBody:   'Êtes-vous sûr de vouloir quitter votre espace de travail dans',
    volverEstudio:      'Continuer à étudier',
    confirmarSalida:    'Oui, se déconnecter',
    cerrarMenu:         'Fermer le menu',
    abrirPerfil:        'Ouvrir le menu de profil',
    profile: 'Mon Profil',
    cuenta: 'Compte'
  },
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly LayersIcon: LucideIconData          = Layers;
  readonly XIcon: LucideIconData               = X;
  readonly ChevronDownIcon: LucideIconData     = ChevronDown;
  readonly LayoutDashboardIcon: LucideIconData = LayoutDashboard;
  readonly BookOpenIcon: LucideIconData        = BookOpen;
  readonly CalendarIcon: LucideIconData        = Calendar;
  readonly BriefcaseIcon: LucideIconData       = Briefcase;
  readonly FolderOpenIcon: LucideIconData      = FolderOpen;
  readonly PlayIcon: LucideIconData            = Play;
  readonly AlertTriangle                       = TriangleAlert;
  readonly LogOut = LogOut;
  readonly User = User;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly prefs = inject(PreferenciasService);

  user              = this.authService.userSignal;
  toggleProfileMenu = signal(false);

  /** Idioma basado en preferencia de UI (con fallback al de la cuenta) */
  private idioma = computed<Idioma>(() => {
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t         = computed(() => I18N[this.idioma()]);
  a11yClass = this.prefs.a11yClass;

  onLogout() {
    this.authService.logOut();
  }

  @HostListener('window:keydown', ['$event'])
handleKeyboardNavigation(event: KeyboardEvent) {

  // Modal abierto
  if (this.toggleProfileMenu()) {

    switch (event.code) {

      case 'Enter':
      case 'NumpadEnter':
        event.preventDefault();
        this.onLogout();
        break;

      case 'Escape':
        event.preventDefault();
        this.toggleProfileMenu.set(false);
        break;
    }

    return;
  }

  // Atajos normales (requieren Shift)
  if (!event.shiftKey) {
    return;
  }

  switch (event.code) {

    case 'Digit1':
      event.preventDefault();
      this.router.navigate(['/home/dashboard']);
      break;

    case 'Digit2':
      event.preventDefault();
      this.router.navigate(['/home/courses']);
      break;

    case 'Digit3':
      event.preventDefault();
      this.router.navigate(['/home/schedule']);
      break;

    case 'Digit4':
      event.preventDefault();
      this.router.navigate(['/home/projects']);
      break;

    case 'Digit5':
      event.preventDefault();
      this.router.navigate(['/home/profile']);
      break;

    case 'Escape':
      event.preventDefault();
      this.toggleProfileMenu.set(true);
      break;
  }
}
}
