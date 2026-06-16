import { Component, computed, inject } from '@angular/core';
import { CoursesService } from '../../service/courses.service';
import { RouterLink } from '@angular/router';
import {
  Check,
  FileText,
  Library,
  Clock,
  CalendarDays,
  History,
  LucideAngularModule,
  type LucideIconData,
  InfoIcon,
  ListIcon,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type PerfilAccesibilidad = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'baja_vision' | 'ceguera';

// ─── Diccionario i18n ─────────────────────────────────────────────────────────

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    saludo:              'Hola de nuevo',
    subtitulo:           'Hoy tienes clases programadas y apuntes listos para redactar o repasar.',
    cicloActivo:         'Ciclo Activo 2026',
    apuntesSesiones:     'Apuntes de Sesiones',
    organizadoPorClase:  'Organizado por clase',
    cursosRegistrados:   'Cursos Registrados',
    conHorarios:         'Con horarios asignados',
    tiempoEstudio:       'Tiempo de Estudio',
    medidoCronometro:    'Medido con cronómetro',
    clasesDelDia:        'Clases del Día (Hoy)',
    verHorario:          'Ver horario completo',
    sinSesiones:         'No tienes sesiones programadas para hoy.',
    aulaPorAsignar:      'Aula por asignar',
    verEnCursos:         'Ver en mis Cursos',
    verTodosCursos:      'Ver todos mis cursos',
    meses: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
    sinFecha:            'Sin fecha',
    dias:                'DOM,LUN,MAR,MIE,JUE,VIE,SAB',
  },
  en: {
    saludo:              'Welcome back',
    subtitulo:           'You have classes scheduled today and notes ready to write or review.',
    cicloActivo:         'Active Term 2026',
    apuntesSesiones:     'Session Notes',
    organizadoPorClase:  'Organized by class',
    cursosRegistrados:   'Registered Courses',
    conHorarios:         'With assigned schedules',
    tiempoEstudio:       'Study Time',
    medidoCronometro:    'Measured with stopwatch',
    clasesDelDia:        'Today\'s Classes',
    verHorario:          'View full schedule',
    sinSesiones:         'No sessions scheduled for today.',
    aulaPorAsignar:      'Room to be assigned',
    verEnCursos:         'Go to My Courses',
    verTodosCursos:      'View all my courses',
    meses: 'January,February,March,April,May,June,July,August,September,October,November,December',
    sinFecha:            'No date',
    dias:                'SUN,MON,TUE,WED,THU,FRI,SAT',
  },
  pt: {
    saludo:              'Bem-vindo de volta',
    subtitulo:           'Você tem aulas programadas hoje e anotações prontas para redigir ou revisar.',
    cicloActivo:         'Período Ativo 2026',
    apuntesSesiones:     'Anotações de Sessões',
    organizadoPorClase:  'Organizado por aula',
    cursosRegistrados:   'Cursos Registrados',
    conHorarios:         'Com horários atribuídos',
    tiempoEstudio:       'Tempo de Estudo',
    medidoCronometro:    'Medido com cronômetro',
    clasesDelDia:        'Aulas de Hoje',
    verHorario:          'Ver horário completo',
    sinSesiones:         'Nenhuma sessão programada para hoje.',
    aulaPorAsignar:      'Sala a ser atribuída',
    verEnCursos:         'Ver em Meus Cursos',
    verTodosCursos:      'Ver todos os meus cursos',
    meses: 'Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro',
    sinFecha:            'Sem data',
    dias:                'DOM,SEG,TER,QUA,QUI,SEX,SAB',
  },
  fr: {
    saludo:              'Bon retour',
    subtitulo:           'Vous avez des cours prévus aujourd\'hui et des notes prêtes à rédiger ou à revoir.',
    cicloActivo:         'Semestre Actif 2026',
    apuntesSesiones:     'Notes de Session',
    organizadoPorClase:  'Organisé par cours',
    cursosRegistrados:   'Cours Enregistrés',
    conHorarios:         'Avec horaires assignés',
    tiempoEstudio:       'Temps d\'Étude',
    medidoCronometro:    'Mesuré avec chronomètre',
    clasesDelDia:        'Cours du Jour',
    verHorario:          'Voir l\'emploi du temps',
    sinSesiones:         'Aucune session prévue pour aujourd\'hui.',
    aulaPorAsignar:      'Salle à attribuer',
    verEnCursos:         'Voir dans mes Cours',
    verTodosCursos:      'Voir tous mes cours',
    meses: 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
    sinFecha:            'Sans date',
    dias:                'DIM,LUN,MAR,MER,JEU,VEN,SAM',
  },
};

const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  normal:       '',
  protanopia:   'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia:   'a11y-tritanopia',
  baja_vision:  'a11y-baja-vision',
  ceguera:      'a11y-ceguera',
};

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly CheckIcon: LucideIconData        = Check;
  readonly FileTextIcon: LucideIconData     = FileText;
  readonly LibraryIcon: LucideIconData      = Library;
  readonly ClockIcon: LucideIconData        = Clock;
  readonly CalendarDaysIcon: LucideIconData = CalendarDays;
  readonly HistoryIcon: LucideIconData      = History;
  readonly InfoIcon                         = InfoIcon;
  readonly ListIcon                         = ListIcon;

  private readonly courseService = inject(CoursesService);
  private readonly authService   = inject(AuthService);

  user = this.authService.userSignal;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  courses = this.courseService.obtenerCursosPorUsuario(this.userIdComputed);

  // ─── i18n / a11y ───────────────────────────────────────────────────────────

  private idioma = computed<Idioma>(() => {
    const raw = this.user()?.idioma as Idioma;
    return raw && raw in I18N ? raw : 'es';
  });

  private perfil = computed<PerfilAccesibilidad>(() => {
    const raw = this.user()?.perfilAccesibilidad as PerfilAccesibilidad;
    return raw && raw in A11Y_CLASSES ? raw : 'normal';
  });

  t         = computed(() => I18N[this.idioma()]);
  a11yClass = computed(() => A11Y_CLASSES[this.perfil()]);

  // ─── Nombre del usuario ────────────────────────────────────────────────────

  greeting = computed(() => `${this.t()['saludo']}, ${this.user()?.nombres?.split(' ')[0] ?? ''}! 👋`);

  // ─── Lógica de sesiones ────────────────────────────────────────────────────

  getTodaySessions() {
    const today      = new Date();
    const todayYear  = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay   = today.getDate();

    return this.courses?.value()?.flatMap(course =>
      course.sesiones
        .filter(sesion => {
          if (!sesion.horaInicio) return false;
          const d = new Date(sesion.horaInicio);
          return d.getFullYear() === todayYear &&
                 d.getMonth()    === todayMonth &&
                 d.getDate()     === todayDay;
        })
        .map(sesion => ({ course, sesion }))
    );
  }

  // ─── Helpers de fecha localizados ─────────────────────────────────────────

  formatDate(dateString: string): string {
    if (!dateString) return this.t()['sinFecha'];
    const date   = new Date(dateString);
    const months = this.t()['meses'].split(',');
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  getDayShort(dateString: string): string {
    if (!dateString) return '';
    const days = this.t()['dias'].split(',');
    return days[new Date(dateString).getDay()];
  }
}
