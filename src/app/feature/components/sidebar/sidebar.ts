import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Layers, X, ChevronsLeft, ChevronsRight, LayoutDashboard, BookOpen,
  Calendar, Briefcase, Play,
  LucideAngularModule, type LucideIconData, TriangleAlert,
  LogOut, User,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type PerfilAccesibilidad = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'baja_vision' | 'ceguera';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    appName: 'StudySync',
    seccionPrincipal: 'Principal',
    dashboard: 'Dashboard',
    misCursos: 'Mis Cursos',
    horario: 'Horario',
    seccionProyectos: 'Proyectos & Trabajo',
    misProyectos: 'Mis Proyectos',
    tiempoEstudio: 'Tiempo Estudio',
    cerrarSesionTitulo: '¿Cerrar Sesión?',
    cerrarSesionDesc: 'Tu progreso actual de tiempo de estudio activo se pausará.',
    cerrarSesionBody: '¿Estás seguro de que deseas salir de tu espacio de trabajo en',
    volverEstudio: 'Volver al estudio',
    confirmarSalida: 'Sí, cerrar sesión',
    cerrarMenu: 'Cerrar menú',
    abrirPerfil: 'Abrir menú de perfil',
    profile: 'Mi Pefil',
    cuenta: 'Cuenta',
  },
  en: {
    appName: 'StudySync',
    seccionPrincipal: 'Main',
    dashboard: 'Dashboard',
    misCursos: 'My Courses',
    horario: 'Schedule',
    seccionProyectos: 'Projects & Work',
    misProyectos: 'My Projects',
    tiempoEstudio: 'Study Time',
    cerrarSesionTitulo: 'Sign Out?',
    cerrarSesionDesc: 'Your current active study time progress will be paused.',
    cerrarSesionBody: 'Are you sure you want to leave your workspace in',
    volverEstudio: 'Keep studying',
    confirmarSalida: 'Yes, sign out',
    cerrarMenu: 'Close menu',
    abrirPerfil: 'Open profile menu',
    profile: 'My Profile',
    cuenta: 'Account',
  },
  pt: {
    appName: 'StudySync',
    seccionPrincipal: 'Principal',
    dashboard: 'Painel',
    misCursos: 'Meus Cursos',
    horario: 'Horário',
    seccionProyectos: 'Projetos & Trabalho',
    misProyectos: 'Meus Projetos',
    tiempoEstudio: 'Tempo de Estudo',
    cerrarSesionTitulo: 'Sair da Conta?',
    cerrarSesionDesc: 'Seu progresso atual de tempo de estudo será pausado.',
    cerrarSesionBody: 'Tem certeza de que deseja sair do seu espaço de trabalho em',
    volverEstudio: 'Voltar ao estudo',
    confirmarSalida: 'Sim, sair',
    cerrarMenu: 'Fechar menu',
    abrirPerfil: 'Abrir menu de perfil',
    profile: 'Meu Perfil',
    cuenta: 'Conta',
  },
  fr: {
    appName: 'StudySync',
    seccionPrincipal: 'Principal',
    dashboard: 'Tableau de bord',
    misCursos: 'Mes Cours',
    horario: 'Emploi du temps',
    seccionProyectos: 'Projets & Travail',
    misProyectos: 'Mes Projets',
    tiempoEstudio: "Temps d'Étude",
    cerrarSesionTitulo: 'Se déconnecter ?',
    cerrarSesionDesc: "Votre progression de temps d'étude actif sera mise en pause.",
    cerrarSesionBody: 'Êtes-vous sûr de vouloir quitter votre espace de travail dans',
    volverEstudio: 'Continuer à étudier',
    confirmarSalida: 'Oui, se déconnecter',
    cerrarMenu: 'Fermer le menu',
    abrirPerfil: 'Ouvrir le menu de profil',
    profile: 'Mon Profil',
    cuenta: 'Compte',
  },
};

const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  normal: '',
  protanopia: 'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia: 'a11y-tritanopia',
  baja_vision: 'a11y-baja-vision',
  ceguera: 'a11y-ceguera',
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, LucideAngularModule, CommonModule, TitleCasePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly LayersIcon: LucideIconData = Layers;
  readonly XIcon: LucideIconData = X;
  readonly ChevronsLeftIcon: LucideIconData = ChevronsLeft;
  readonly ChevronsRightIcon: LucideIconData = ChevronsRight;
  readonly LayoutDashboardIcon: LucideIconData = LayoutDashboard;
  readonly BookOpenIcon: LucideIconData = BookOpen;
  readonly CalendarIcon: LucideIconData = Calendar;
  readonly BriefcaseIcon: LucideIconData = Briefcase;
  readonly PlayIcon: LucideIconData = Play;
  readonly AlertTriangle = TriangleAlert;
  readonly LogOut = LogOut;
  readonly User = User;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.userSignal;
  toggleProfileMenu = signal(false);

  // Estado real para el drawer móvil (sale/entra con botón X / overlay)
  readonly sidebarOpen = signal(false);
  // Estado colapsado en escritorio (mini sidebar con solo íconos)
  readonly collapsed = signal(false);
  private readonly isMobile = signal(this.detectMobile());

  // En móvil siempre mostrar el drawer completo, sin modo mini
  readonly showCollapsed = computed(() => this.collapsed() && !this.isMobile());

  private detectMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(this.detectMobile());
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  // Cierra el drawer móvil al hacer click en un link de navegación
  onNavClick(): void {
    this.sidebarOpen.set(false);
  }

  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
  }

  private idioma = computed<Idioma>(() => {
    const raw = this.user()?.idioma as Idioma;
    return raw && raw in I18N ? raw : 'es';
  });

  private perfil = computed<PerfilAccesibilidad>(() => {
    const raw = this.user()?.perfilAccesibilidad as PerfilAccesibilidad;
    return raw && raw in A11Y_CLASSES ? raw : 'normal';
  });

  t = computed(() => I18N[this.idioma()]);
  a11yClass = computed(() => A11Y_CLASSES[this.perfil()]);

  onLogout() {
    this.authService.logOut();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
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

    if (!event.shiftKey) return;

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