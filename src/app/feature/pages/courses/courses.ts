import { Component, computed, inject, signal } from '@angular/core';
import {  Curso, GuardarCursoRequest, Sesion } from '../../types/course.type';
import { form, FormField, required } from '@angular/forms/signals';
import { CoursesService } from '../../service/courses.service';
import {
  PlusCircle,
  Settings,
  User,
  FileText,
  ChevronRight,
  ArrowLeft,
  List,
  Plus,
  Trash2,
  Info,
  Copy,
  Download,
  Save,
  X,
  LucideAngularModule,
  type LucideIconData,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { SessionsService } from '../../service/sessions.service';
import { PreferenciasService } from '../../../core/service/preferencias.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';

// ─── Diccionario i18n ─────────────────────────────────────────────────────────

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    // Lista de cursos
    misCursos:            'Mis Cursos y Materias',
    misCursosDesc:        'Configura tus cursos, gestiona sus horarios semanales y redacta apuntes por cada sesión de clase.',
    nuevoCurso:           'Nuevo Curso',
    configurarCurso:      'Configurar Curso',
    sinAsignar:           'Sin asignar',
    sesionesProgramadas:  'Sesiones Programadas:',
    sinSesiones:          'Sin sesiones programadas en calendario',
    sesiones:             'Sesiones',
    verApuntes:           'Ver apuntes',
    // Detalle de curso
    volverCursos:         'Volver a cursos',
    sesionesDelCurso:     'Sesiones del Curso',
    nuevaSesion:          'Nueva Sesión',
    eliminarSesion:       'Eliminar sesión',
    sinFecha:             'Sin fecha',
    autoguardado:         'Los apuntes se autoguardan automáticamente',
    copiar:               'Copiar',
    descargar:            'Descargar (.txt)',
    nombreSesion:         'Nombre / Tema de la Sesión',
    placeholderSesion:    'Ej: Sesión 1: Conceptos Básicos',
    errorNombreOblig:     'El nombre de la sesión es obligatorio',
    errorNombreDesc:      'Los cambios no se guardarán hasta completar este campo.',
    fechaInicio:          'Fecha de Inicio',
    fechaFin:             'Fecha de Fin',
    aulaSala:             'Aula / Sala',
    placeholderAula:      'Ej: Lab 402',
    contenidoApuntes:     'Contenido de tus Apuntes de Clase',
    placeholderApuntes:   'Comienza a redactar los puntos clave de tu clase aquí... (Fórmulas, conceptos, ideas clave)',
    // Modal curso
    agregarCurso:         'Agregar Curso',
    nombreCurso:          'Nombre del Curso',
    placeholderCurso:     'Ej: Bases de Datos II',
    profesorDocente:      'Profesor / Docente',
    placeholderProfesor:  'Ej: Dr. Roberto Carlos',
    colorCurso:           'Color del Curso',
    eliminarCurso:        'Eliminar Curso',
    cancelar:             'Cancelar',
    guardarCurso:         'Guardar Curso',
    ciclo:               'Ciclo',
placeholderCiclo:    'Ej: 2026-I',

creditos:            'Créditos',
placeholderCreditos: 'Ej: 4',
    // Confirmaciones
    confirmElimCurso:     '¿Está seguro que desea eliminar el curso?',
    confirmElimSesion:    '¿Está seguro que desea eliminar la sesión?',
    // Helpers fecha
    meses:  'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
    dias:   'DOM,LUN,MAR,MIE,JUE,VIE,SAB',
    de:     'de',
  },
  en: {
    misCursos:            'My Courses',
    misCursosDesc:        'Set up your courses, manage weekly schedules and write notes for each class session.',
    nuevoCurso:           'New Course',
    configurarCurso:      'Configure Course',
    sinAsignar:           'Not assigned',
    sesionesProgramadas:  'Scheduled Sessions:',
    sinSesiones:          'No sessions scheduled in calendar',
    sesiones:             'Sessions',
    verApuntes:           'View notes',
    volverCursos:         'Back to courses',
    sesionesDelCurso:     'Course Sessions',
    nuevaSesion:          'New Session',
    eliminarSesion:       'Delete session',
    sinFecha:             'No date',
    autoguardado:         'Notes are saved automatically',
    copiar:               'Copy',
    descargar:            'Download (.txt)',
    nombreSesion:         'Session Name / Topic',
    placeholderSesion:    'E.g.: Session 1: Basic Concepts',
    errorNombreOblig:     'Session name is required',
    errorNombreDesc:      'Changes will not be saved until this field is filled.',
    fechaInicio:          'Start Date',
    fechaFin:             'End Date',
    aulaSala:             'Room / Hall',
    placeholderAula:      'E.g.: Lab 402',
    contenidoApuntes:     'Your Class Notes',
    placeholderApuntes:   'Start writing the key points of your class here... (Formulas, concepts, key ideas)',
    agregarCurso:         'Add Course',
    nombreCurso:          'Course Name',
    placeholderCurso:     'E.g.: Databases II',
    profesorDocente:      'Teacher / Professor',
    placeholderProfesor:  'E.g.: Dr. Roberto Carlos',
    colorCurso:           'Course Color',
    eliminarCurso:        'Delete Course',
    cancelar:             'Cancel',
    guardarCurso:         'Save Course',
    confirmElimCurso:     'Are you sure you want to delete this course?',
    confirmElimSesion:    'Are you sure you want to delete this session?',
    ciclo:               'Term',
placeholderCiclo:    'E.g.: 2026-I',

creditos:            'Credits',
placeholderCreditos: 'E.g.: 4',
    meses:  'January,February,March,April,May,June,July,August,September,October,November,December',
    dias:   'SUN,MON,TUE,WED,THU,FRI,SAT',
    de:     'of',
  },
  pt: {
    misCursos:            'Meus Cursos e Matérias',
    misCursosDesc:        'Configure seus cursos, gerencie horários semanais e escreva anotações por cada sessão de aula.',
    nuevoCurso:           'Novo Curso',
    configurarCurso:      'Configurar Curso',
    sinAsignar:           'Sem atribuição',
    sesionesProgramadas:  'Sessões Programadas:',
    sinSesiones:          'Sem sessões programadas no calendário',
    sesiones:             'Sessões',
    verApuntes:           'Ver anotações',
    volverCursos:         'Voltar aos cursos',
    sesionesDelCurso:     'Sessões do Curso',
    ciclo:               'Período',
placeholderCiclo:    'Ex: 2026-I',

creditos:            'Créditos',
placeholderCreditos: 'Ex: 4',
    nuevaSesion:          'Nova Sessão',
    eliminarSesion:       'Excluir sessão',
    sinFecha:             'Sem data',
    autoguardado:         'As anotações são salvas automaticamente',
    copiar:               'Copiar',
    descargar:            'Baixar (.txt)',
    nombreSesion:         'Nome / Tema da Sessão',
    placeholderSesion:    'Ex: Sessão 1: Conceitos Básicos',
    errorNombreOblig:     'O nome da sessão é obrigatório',
    errorNombreDesc:      'As alterações não serão salvas até preencher este campo.',
    fechaInicio:          'Data de Início',
    fechaFin:             'Data de Término',
    aulaSala:             'Sala / Laboratório',
    placeholderAula:      'Ex: Lab 402',
    contenidoApuntes:     'Conteúdo das suas Anotações de Aula',
    placeholderApuntes:   'Comece a redigir os pontos-chave da sua aula aqui... (Fórmulas, conceitos, ideias-chave)',
    agregarCurso:         'Adicionar Curso',
    nombreCurso:          'Nome do Curso',
    placeholderCurso:     'Ex: Banco de Dados II',
    profesorDocente:      'Professor / Docente',
    placeholderProfesor:  'Ex: Dr. Roberto Carlos',
    colorCurso:           'Cor do Curso',
    eliminarCurso:        'Excluir Curso',
    cancelar:             'Cancelar',
    guardarCurso:         'Salvar Curso',
    confirmElimCurso:     'Tem certeza que deseja excluir o curso?',
    confirmElimSesion:    'Tem certeza que deseja excluir a sessão?',
    meses:  'Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro',
    dias:   'DOM,SEG,TER,QUA,QUI,SEX,SAB',
    de:     'de',
  },
  fr: {
    misCursos:            'Mes Cours',
    misCursosDesc:        'Configurez vos cours, gérez les horaires hebdomadaires et rédigez des notes pour chaque session de cours.',
    nuevoCurso:           'Nouveau Cours',
    configurarCurso:      'Configurer le Cours',
    sinAsignar:           'Non assigné',
    sesionesProgramadas:  'Sessions Programmées :',
    sinSesiones:          'Aucune session programmée',
    sesiones:             'Sessions',
    verApuntes:           'Voir les notes',
    volverCursos:         'Retour aux cours',
    sesionesDelCurso:     'Sessions du Cours',
    nuevaSesion:          'Nouvelle Session',
    eliminarSesion:       'Supprimer la session',
    sinFecha:             'Sans date',
    autoguardado:         'Les notes sont sauvegardées automatiquement',
    copiar:               'Copier',
    descargar:            'Télécharger (.txt)',
    nombreSesion:         'Nom / Thème de la Session',
    placeholderSesion:    'Ex: Session 1 : Concepts de Base',
    errorNombreOblig:     'Le nom de la session est obligatoire',
    errorNombreDesc:      'Les modifications ne seront pas sauvegardées tant que ce champ n\'est pas rempli.',
    fechaInicio:          'Date de Début',
    fechaFin:             'Date de Fin',
    aulaSala:             'Salle / Classe',
    placeholderAula:      'Ex: Labo 402',
    contenidoApuntes:     'Contenu de vos Notes de Cours',
    placeholderApuntes:   'Commencez à rédiger les points clés de votre cours ici... (Formules, concepts, idées clés)',
    agregarCurso:         'Ajouter un Cours',
    nombreCurso:          'Nom du Cours',
    placeholderCurso:     'Ex: Bases de Données II',
    profesorDocente:      'Professeur / Enseignant',
    placeholderProfesor:  'Ex: Dr. Roberto Carlos',
    colorCurso:           'Couleur du Cours',
    eliminarCurso:        'Supprimer le Cours',
    cancelar:             'Annuler',
    guardarCurso:         'Enregistrer le Cours',
    confirmElimCurso:     'Êtes-vous sûr de vouloir supprimer ce cours ?',
    confirmElimSesion:    'Êtes-vous sûr de vouloir supprimer cette session ?',
    ciclo:                'Semestre',
    placeholderCiclo:     'Ex: 2026-I',
    creditos:             'Crédits',
    placeholderCreditos:  'Ex: 4',
    meses: 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
    dias:  'DIM,LUN,MAR,MER,JEU,VEN,SAM',
    de:    'de',
  },
};



// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-courses',
  imports: [FormField, LucideAngularModule, FormsModule, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  readonly PlusCircleIcon: LucideIconData  = PlusCircle;
  readonly SettingsIcon: LucideIconData    = Settings;
  readonly UserIcon: LucideIconData        = User;
  readonly FileTextIcon: LucideIconData    = FileText;
  readonly ChevronRightIcon: LucideIconData = ChevronRight;
  readonly ArrowLeftIcon: LucideIconData   = ArrowLeft;
  readonly ListIcon: LucideIconData        = List;
  readonly PlusIcon: LucideIconData        = Plus;
  readonly Trash2Icon: LucideIconData      = Trash2;
  readonly InfoIcon: LucideIconData        = Info;
  readonly CopyIcon: LucideIconData        = Copy;
  readonly DownloadIcon: LucideIconData    = Download;
  readonly SaveIcon: LucideIconData        = Save;
  readonly XIcon: LucideIconData           = X;

  private readonly courseService = inject(CoursesService);
  private readonly authService   = inject(AuthService);
  private readonly sessionService = inject(SessionsService);

  user    = this.authService.userSignal;
  // 2. Creamos una Signal 'computed' para el ID del usuario.
  // Si 'user()' cambia, esta Signal se recalcula automáticamente.
  userIdComputed = computed(() => {
    const currentUser = this.user();
    // Retornamos el ID o un valor por defecto (como 0 o null) si no está logueado
    return currentUser ? (currentUser.idUsuario ? currentUser.idUsuario : 0) : 0;
  });

  // 3. Pasamos la Signal 'computed' al servicio tal como lo diseñamos antes
  courses = this.courseService.obtenerCursosPorUsuario(
   this.userIdComputed
  );

  courseEditing = signal<boolean>(false);
  activeCourse  = signal<Curso | null>(null);
  activeSession = signal<Sesion | null>(null);

  private newCourseModel = signal<Curso>({
      idCurso: 0, nombre: '', docente: '', descripcion: '', color: '273CF5',ciclo:'',creditos:0,usuarioId:this.user()?.idUsuario ?? 0, sesiones: [],
  });

  courseModel = signal<Curso>({
    idCurso: 0, nombre: '', docente: '', descripcion: '', color: '273CF5',ciclo:'',creditos:0,usuarioId:this.user()?.idUsuario ?? 0, sesiones: [],
  });

  courseForm = form(this.courseModel, (f) => {
    required(f.nombre, { message: 'El nombre es requerido' });
  });

  // ─── i18n / a11y ───────────────────────────────────────────────────────────

  private readonly prefs = inject(PreferenciasService);

  private idioma = computed<Idioma>(() => {
    // Primero usar el idioma de visualización
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    // Fallback al idioma de la cuenta
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t         = computed(() => I18N[this.idioma()]);
  a11yClass = this.prefs.a11yClass;

  // ─── Lógica de cursos ──────────────────────────────────────────────────────

  openCourseModal(course: Curso | null) {
    this.courseEditing.set(true);
    if (course != null) {
      this.courseModel.set({ ...course });
    }
  }

  saveCourse() {
    if (!this.courseForm().valid()) return;
    const current = this.courseModel();
    const request:GuardarCursoRequest = {
      nombre:current.nombre,
      description:current.descripcion,
      color:current.color,
      ciclo:current.ciclo,
      creditos:current.creditos,
      usuarioId:this.user()?.idUsuario ?? 0,
      docente:current.docente
    }
      this.courseService.guardarCurso(request).subscribe({
        next:(res)=>{
          this.courses.reload();
    this.courseEditing.set(false);
    this.courseModel.set(structuredClone(this.newCourseModel()));
        }, error:(err)=>{
          console.error(err);
        }
      })

  }

  createNewSession() {
  const course = this.activeCourse();

  if (!course) return;

  this.sessionService.guardarSesion({
    nombre: `Sesión ${course.sesiones.length + 1}`,
    notas: '',
    horaInicio: '',
    horaFin: '',
    aula: '',
    cursoId: course.idCurso
  }).subscribe({
    next: (session) => {

      const updatedCourse: Curso = {
        ...course,
        sesiones: [...course.sesiones, session]
      };

      this.activeCourse.set(updatedCourse);
      this.activeSession.set(session);
      this.courses.reload();
    },
    error: err => console.error(err)
  });
}

  onSessionChange() {
  const session = this.activeSession();
  const idCurso = this.activeCourse()?.idCurso

  if (!session||!idCurso) return;

  this.sessionService.actualizarSesion({
    id: session.id,
    nombre: session.nombre,
    notas: session.notas,
    horaInicio: session.horaInicio,
    horaFin: session.horaFin,
    aula: session.aula,
    cursoId: idCurso
  }).subscribe({
    next: () => {},
    error: err => console.error(err)
  });
}

  editCourse(course: Curso) {
    this.courseEditing.set(true);
    this.courseModel.set(course);
  }

  closeCourseModal() {
    this.courseEditing.set(false);
    this.courseModel.set(structuredClone(this.newCourseModel()));
  }

  deleteCourse(courseId: number) {
    if (!window.confirm(this.t()['confirmElimCurso'])) return;
    this.courseService.eliminarCurso(courseId).subscribe({
      next:(res)=>{
         if (this.activeCourse()?.idCurso === courseId) {
      this.activeCourse.set(null);
      this.activeSession.set(null);
    }
    this.courses.reload();
    this.closeCourseModal();
      },
      error:(err)=>{
        console.error(err)
      }
    })

  }

  deleteSession(sessionId: number) {

  if (!window.confirm(this.t()['confirmElimSesion'])) return;

  this.sessionService.eliminarSesion(sessionId)
    .subscribe({
      next: () => {

        const course = this.activeCourse();

        if (course) {
          this.activeCourse.set({
            ...course,
            sesiones: course.sesiones.filter(
              s => s.id !== sessionId
            )
          });
        }

        if (this.activeSession()?.id === sessionId) {
          this.activeSession.set(null);
        }

        this.courses.reload();
      },
      error: err => console.error(err)
    });
}

  downloadNoteAsFile() {
    const session = this.activeSession();
    if (!session) return;
    const blob = new Blob([session.notas || ''], { type: 'text/plain;charset=utf-8' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${session.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'apuntes'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  copyNoteToClipboard() {
    const session = this.activeSession();
    if (!session?.notas) return;
    navigator.clipboard.writeText(session.notas);
  }

  // ─── Helpers de fecha localizados ─────────────────────────────────────────

  formatDate(dateString: string): string {
    if (!dateString) return this.t()['sinFecha'];
    const date   = new Date(dateString);
    const months = this.t()['meses'].split(',');
    return `${date.getDate()} ${this.t()['de']} ${months[date.getMonth()]}`;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  getDayShort(dateString: string): string {
    if (!dateString) return '';
    return this.t()['dias'].split(',')[new Date(dateString).getDay()];
  }
}
