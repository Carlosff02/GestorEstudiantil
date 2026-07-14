import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  CalendarIcon,
  TrendingUp,
  Briefcase,
  Target,
  Star,
  Zap,
  BookOpen,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { CoursesService } from '../../service/courses.service';
import { ProyectoService } from '../../service/proyecto.service';
import { PreferenciasService } from '../../../core/service/preferencias.service';
import { TareaProyectoResponse } from '../../types/project.type';
import { apiUrl } from '../../../environment/environmet';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type ArModelType = 'solar-system' | 'planets' | 'milky-way' | 'moon-phases' | 'eclipse' | 'constellations';

interface ArExperience {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  imageUrl: string;
  modelType: ArModelType;
  questions: string[];
}
interface ArPlanet {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  rotation: string;
  translation: string;
  description: string;
  atmosphere: string;
  surface: string;
}

// ─── Diccionario i18n ─────────────────────────────────────────────────────────

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    saludo: 'Hola de nuevo',
    subtitulo: 'Hoy tienes clases programadas y apuntes listos para redactar o repasar.',
    cicloActivo: 'Ciclo Activo 2026',
    apuntesSesiones: 'Apuntes de Sesiones',
    organizadoPorClase: 'Organizado por clase',
    cursosRegistrados: 'Cursos Registrados',
    conHorarios: 'Con horarios asignados',
    tiempoEstudio: 'Tiempo de Estudio',
    medidoCronometro: 'Medido con cronómetro',
    clasesDelDia: 'Clases del día',
    verHorario: 'Ver horario completo',
    sinSesiones: 'No tienes sesiones programadas para hoy.',
    aulaPorAsignar: 'Aula por asignar',
    verEnCursos: 'Ver en mis Cursos',
    verTodosCursos: 'Ver todos mis cursos',
    meses: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
    sinFecha: 'Sin fecha',
    dias: 'DOM,LUN,MAR,MIE,JUE,VIE,SAB',
    clasesHoy: 'Clases hoy',
    proximoExamen: 'Próximo examen',
    rachaEstudio: 'días',
    promedioGeneral: 'Promedio Gral.',
    creditos: 'Créditos',
    ciclo: 'Ciclo',
    tareasPendientes: 'Tareas pend.',
    proyectosActivos: 'Proyectos',
    asistencia: 'Asistencia',
    productividadSemanal: 'Productividad Semanal',
    metaDiaria: 'Meta: 4h/día',
    horasEstudiadas: 'Estudiado',
    rendimientoCurso: 'Rendimiento por Curso',
    notaEstudiante: 'Tu nota',
    promedioClase: 'Prom. clase',
    asistenteIA: 'Asistente IA',
    resumirApuntes: 'Resumir apuntes',
    generarPreguntas: 'Generar preguntas',
    crearFlashcards: 'Crear flashcards',
    recomendarEstudio: 'Recomendar estudio',
    preguntaIA: 'Pregunta algo a la IA...',
    progresoLogros: 'Progreso y Logros',
    nivel: 'Nivel',
    metasCumplidas: 'Metas',
    insignias: 'Insignias',
    bloqueado: 'Bloqueado',
    desbloqueado: 'Desbloqueado',
    nuevo: 'NUEVO',
    aulaAr: 'Aula de Realidad Aumentada',
    aulaArDesc: 'Explora el sistema solar, planetas 3D, la Vía Láctea y más. Una experiencia educativa inmersiva directamente en tu entorno real.',
    sinCamara: '¡Sin cámara también funciona!',
    iniciarAulaAr: 'Iniciar Aula AR',
    verExperiencias: 'Ver experiencias',
    preguntasEducativas: 'Preguntas educativas',
    escribeRespuesta: 'Escribe tu respuesta',
    enviarRespuestas: 'Enviar respuestas',
    respuestasEnviadas: '¡Respuestas enviadas! Revisa tus respuestas con tu docente.',
  },
  en: {
    saludo: 'Welcome back',
    subtitulo: 'You have classes scheduled today and notes ready to write or review.',
    cicloActivo: 'Active Term 2026',
    apuntesSesiones: 'Session Notes',
    organizadoPorClase: 'Organized by class',
    cursosRegistrados: 'Registered Courses',
    conHorarios: 'With assigned schedules',
    tiempoEstudio: 'Study Time',
    medidoCronometro: 'Measured with stopwatch',
    clasesDelDia: "Today's Classes",
    verHorario: 'View full schedule',
    sinSesiones: 'No sessions scheduled for today.',
    aulaPorAsignar: 'Room to be assigned',
    verEnCursos: 'Go to My Courses',
    verTodosCursos: 'View all my courses',
    meses: 'January,February,March,April,May,June,July,August,September,October,November,December',
    sinFecha: 'No date',
    dias: 'SUN,MON,TUE,WED,THU,FRI,SAT',
    clasesHoy: 'Classes today',
    proximoExamen: 'Next exam',
    rachaEstudio: 'days',
    promedioGeneral: 'Avg. Grade',
    creditos: 'Credits',
    ciclo: 'Term',
    tareasPendientes: 'Pending tasks',
    proyectosActivos: 'Projects',
    asistencia: 'Attendance',
    productividadSemanal: 'Weekly Productivity',
    metaDiaria: 'Goal: 4h/day',
    horasEstudiadas: 'Studied',
    rendimientoCurso: 'Course Performance',
    notaEstudiante: 'Your grade',
    promedioClase: 'Class avg.',
    asistenteIA: 'AI Assistant',
    resumirApuntes: 'Summarize notes',
    generarPreguntas: 'Generate questions',
    crearFlashcards: 'Create flashcards',
    recomendarEstudio: 'Recommend study',
    preguntaIA: 'Ask the AI something...',
    progresoLogros: 'Progress & Achievements',
    nivel: 'Level',
    metasCumplidas: 'Goals',
    insignias: 'Badges',
    bloqueado: 'Locked',
    desbloqueado: 'Unlocked',
    nuevo: 'NEW',
    aulaAr: 'AR Classroom',
    aulaArDesc: 'Explore the solar system, 3D planets, the Milky Way and more. An immersive educational experience directly in your real environment.',
    sinCamara: 'No camera needed!',
    iniciarAulaAr: 'Start AR Class',
    verExperiencias: 'View experiences',
    preguntasEducativas: 'Educational questions',
    escribeRespuesta: 'Write your answer',
    enviarRespuestas: 'Submit answers',
    respuestasEnviadas: 'Answers submitted! Check your answers with your teacher.',
  },
  pt: {
    saludo: 'Bem-vindo de volta',
    subtitulo: 'Você tem aulas programadas hoje e anotações prontas para redigir ou revisar.',
    cicloActivo: 'Período Ativo 2026',
    apuntesSesiones: 'Anotações de Sessões',
    organizadoPorClase: 'Organizado por aula',
    cursosRegistrados: 'Cursos Registrados',
    conHorarios: 'Com horários atribuídos',
    tiempoEstudio: 'Tempo de Estudo',
    medidoCronometro: 'Medido com cronômetro',
    clasesDelDia: 'Aulas de Hoje',
    verHorario: 'Ver horário completo',
    sinSesiones: 'Nenhuma sessão programada para hoje.',
    aulaPorAsignar: 'Sala a ser atribuída',
    verEnCursos: 'Ver em Meus Cursos',
    verTodosCursos: 'Ver todos os meus cursos',
    meses: 'Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro',
    sinFecha: 'Sem data',
    dias: 'DOM,SEG,TER,QUA,QUI,SEX,SAB',
    clasesHoy: 'Aulas hoje',
    proximoExamen: 'Próximo exame',
    rachaEstudio: 'dias',
    promedioGeneral: 'Média Geral',
    creditos: 'Créditos',
    ciclo: 'Período',
    tareasPendientes: 'Tarefas pend.',
    proyectosActivos: 'Projetos',
    asistencia: 'Assiduidade',
    productividadSemanal: 'Produtividade Semanal',
    metaDiaria: 'Meta: 4h/dia',
    horasEstudiadas: 'Estudado',
    rendimientoCurso: 'Desempenho por Curso',
    notaEstudiante: 'Sua nota',
    promedioClase: 'Média turma',
    asistenteIA: 'Assistente IA',
    resumirApuntes: 'Resumir anotações',
    generarPreguntas: 'Gerar perguntas',
    crearFlashcards: 'Criar flashcards',
    recomendarEstudio: 'Recomendar estudo',
    preguntaIA: 'Pergunte algo à IA...',
    progresoLogros: 'Progresso e Conquistas',
    nivel: 'Nível',
    metasCumplidas: 'Metas',
    insignias: 'Insígnias',
    bloqueado: 'Bloqueado',
    desbloqueado: 'Desbloqueado',
    nuevo: 'NOVO',
    aulaAr: 'Aula de Realidade Aumentada',
    aulaArDesc: 'Explore o sistema solar, planetas 3D, a Via Láctea e mais. Uma experiência educativa imersiva diretamente no seu ambiente real.',
    sinCamara: 'Sem câmera também funciona!',
    iniciarAulaAr: 'Iniciar Aula AR',
    verExperiencias: 'Ver experiências',
    preguntasEducativas: 'Perguntas educativas',
    escribeRespuesta: 'Escreva sua resposta',
    enviarRespuestas: 'Enviar respostas',
    respuestasEnviadas: 'Respostas enviadas! Verifique suas respostas com seu professor.',
  },
  fr: {
    saludo: 'Bon retour',
    subtitulo: 'Vous avez des cours prévus aujourd\'hui et des notes prêtes à rédiger ou à revoir.',
    cicloActivo: 'Semestre Actif 2026',
    apuntesSesiones: 'Notes de Session',
    organizadoPorClase: 'Organisé par cours',
    cursosRegistrados: 'Cours Enregistrés',
    conHorarios: 'Avec horaires assignés',
    tiempoEstudio: 'Temps d\'Étude',
    medidoCronometro: 'Mesuré avec chronomètre',
    clasesDelDia: 'Cours du Jour',
    verHorario: "Voir l'emploi du temps",
    sinSesiones: "Aucune session prévue pour aujourd'hui.",
    aulaPorAsignar: 'Salle à attribuer',
    verEnCursos: 'Voir dans mes Cours',
    verTodosCursos: 'Voir tous mes cours',
    meses: 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
    sinFecha: 'Sans date',
    dias: 'DIM,LUN,MAR,MER,JEU,VEN,SAM',
    clasesHoy: 'Cours aujourd\'hui',
    proximoExamen: 'Prochain examen',
    rachaEstudio: 'jours',
    promedioGeneral: 'Moy. Générale',
    creditos: 'Crédits',
    ciclo: 'Semestre',
    tareasPendientes: 'Tâches en attente',
    proyectosActivos: 'Projets',
    asistencia: 'Assiduité',
    productividadSemanal: 'Productivité Hebdo',
    metaDiaria: 'Objectif : 4h/jour',
    horasEstudiadas: 'Étudié',
    rendimientoCurso: 'Rendement par Cours',
    notaEstudiante: 'Votre note',
    promedioClase: 'Moy. classe',
    asistenteIA: 'Assistant IA',
    resumirApuntes: 'Résumer les notes',
    generarPreguntas: 'Générer des questions',
    crearFlashcards: 'Créer des flashcards',
    recomendarEstudio: 'Recommander étude',
    preguntaIA: 'Demandez quelque chose à l\'IA...',
    progresoLogros: 'Progrès et Réalisations',
    nivel: 'Niveau',
    metasCumplidas: 'Objectifs',
    insignias: 'Badges',
    bloqueado: 'Verrouillé',
    desbloqueado: 'Déverrouillé',
    nuevo: 'NOUVEAU',
    aulaAr: 'Classe de Réalité Augmentée',
    aulaArDesc: 'Explorez le système solaire, les planètes 3D, la Voie lactée et plus encore. Une expérience éducative immersive directement dans votre environnement réel.',
    sinCamara: 'Fonctionne sans caméra !',
    iniciarAulaAr: 'Lancer la classe AR',
    verExperiencias: 'Voir les expériences',
    preguntasEducativas: 'Questions éducatives',
    escribeRespuesta: 'Écrivez votre réponse',
    enviarRespuestas: 'Envoyer les réponses',
    respuestasEnviadas: 'Réponses envoyées ! Vérifiez vos réponses avec votre enseignant.',
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  today = computed(() => new Date());

  private usageData = signal<Record<string, number>>(this.loadUsageData());
  private isTracking = false;
  private accumulatedSeconds = 0;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;
  readonly CheckIcon: LucideIconData = Check;
  readonly FileTextIcon: LucideIconData = FileText;
  readonly LibraryIcon: LucideIconData = Library;
  readonly ClockIcon: LucideIconData = Clock;
  readonly CalendarDaysIcon: LucideIconData = CalendarDays;
  readonly HistoryIcon: LucideIconData = History;
  readonly InfoIcon = InfoIcon;
  readonly ListIcon = ListIcon;
  readonly CalendarIcon: LucideIconData = CalendarIcon;
  readonly TrendingUpIcon: LucideIconData = TrendingUp;
  readonly BriefcaseIcon: LucideIconData = Briefcase;
  readonly TargetIcon: LucideIconData = Target;
  readonly StarIcon: LucideIconData = Star;
  readonly ZapIcon: LucideIconData = Zap;
  readonly BookOpenIcon: LucideIconData = BookOpen;

  // ─── Métricas ──────────────────────────────────────────────────────────

  metrics = computed(() => {
    const c = this.courses.value();
    const p = this.proyectos.value();
    const allTasks = this.allTareas();
    const totalCreditos = c?.reduce((sum, cr) => sum + (cr.creditos ?? 0), 0) ?? 0;
    const proyectosActivos = p?.filter(pr => pr.estado !== 'completado' && pr.estado !== 'cancelado').length ?? 0;
    const totalSesiones = c?.reduce((sum, cr) => sum + (cr.sesiones?.length ?? 0), 0) ?? 0;
    return {
      promedioGeneral: 0,
      totalCreditos,
      ciclo: '4to',
      tareasPendientes: allTasks.filter(t => t.estado !== 'completado').length,
      proyectosActivos,
      asistencia: totalSesiones,
    };
  });

  productividad = computed(() => {
    const data = this.usageData();
    const unit = this.productividadUnit();
    const days: { dia: string; valor: number }[] = [];
    const labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const mins = data[key] ?? 0;
      const valor = unit === 'hours' ? Math.round((mins / 60) * 10) / 10 : Math.round(mins);
      days.push({ dia: labels[date.getDay()], valor });
    }
    return days;
  });

  productividadUnit = signal<'hours' | 'minutes'>('hours');

  toggleProductividadUnit(): void {
    this.productividadUnit.update(u => u === 'hours' ? 'minutes' : 'hours');
  }

  cursosRendimiento = computed(() => {
    const cursos = this.courses.value() ?? [];
    const notasMock: Record<string, number> = {
      'CALCULO': 15, 'FISICA': 17, 'PROGRAMACION': 18, 'BASE DE DATOS': 16,
      'INGLES': 19, 'ESTRUCTURAS': 14, 'ALGEBRA': 13, 'QUIMICA': 15,
    };
    const promediosMock: Record<string, number> = {
      'CALCULO': 14, 'FISICA': 15, 'PROGRAMACION': 16, 'BASE DE DATOS': 14,
      'INGLES': 15, 'ESTRUCTURAS': 13, 'ALGEBRA': 12, 'QUIMICA': 13,
    };
    return cursos.map(c => {
      const key = Object.keys(notasMock).find(k => c.nombre.toUpperCase().includes(k));
      return {
        curso: c.nombre,
        creditos: c.creditos ?? 0,
        nota: key ? notasMock[key] : 15,
        promedioClase: key ? promediosMock[key] : 14,
      };
    });
  });

  rendimientoBars = computed(() => {
    const items = this.cursosRendimiento();
    const minScore = 60;
    const maxScore = 100;
    const svgW = 700;
    const padL = 165;
    const padR = 20;
    const padT = 10;
    const padB = 28;
    const chartW = svgW - padL - padR;
    const rowH = 36;
    const totalH = padT + padB + items.length * rowH;
    return {
      svgW, totalH, padL, padR, padT, padB, chartW, minScore, maxScore,
      ticks: [60, 70, 80, 90, 100],
      items: items.map((c, i) => {
        const notaPct = Math.round((c.nota / 20) * 100);
        const promPct = Math.round((c.promedioClase / 20) * 100);
        const y = padT + i * rowH + rowH / 2;
        return {
          curso: c.curso,
          nota: c.nota,
          notaPct,
          promedioClase: c.promedioClase,
          promPct,
          y,
          notaW: Math.max(((notaPct - minScore) / (maxScore - minScore)) * chartW, 0),
          promW: Math.max(((promPct - minScore) / (maxScore - minScore)) * chartW, 0),
        };
      }),
    };
  });

  eventosHoy = computed(() => {
    const sesiones = this.getTodaySessions();
    if (sesiones && sesiones.length > 0) {
      return sesiones.map(s => ({
        hora: this.formatTime(s.sesion.horaInicio) + ' - ' + this.formatTime(s.sesion.horaFin),
        titulo: s.course.nombre + (s.sesion.nombre ? ': ' + s.sesion.nombre : ''),
        tipo: 'clase' as const,
        color: s.course.color || '#6366f1',
      }));
    }
    const next = this.getNextSessions(4);
    if (next.length > 0) {
      return next.map(s => ({
        hora: this.formatTime(s.sesion.horaInicio) + ' - ' + this.formatTime(s.sesion.horaFin),
        titulo: s.course.nombre + (s.sesion.nombre ? ': ' + s.sesion.nombre : ''),
        tipo: 'clase' as const,
        color: s.course.color || '#6366f1',
      }));
    }
    return [];
  });

  nextSession = computed(() => {
    const next = this.getNextSessions(1);
    return next.length > 0 ? next[0] : null;
  });

  chartPoints = computed(() => {
    const datos = this.productividad();
    const rawMax = Math.max(...datos.map(d => d.valor), 0);
    const unit = this.productividadUnit();
    const step = unit === 'hours' ? 1 : 30;
    const maxM = Math.max(Math.ceil(rawMax / step) * step, unit === 'hours' ? 2 : 60);
    const w = 700; const padL = 38; const padR = 20; const padB = 28; const padT = 10;
    const chartW = w - padL - padR; const chartH = 180 - padT - padB;
    const gridSteps = 4;
    return {
      maxM, step, gridSteps, unit,
      points: datos.map((d, i) => {
        const x = padL + (i / (datos.length - 1)) * chartW;
        const y = padT + chartH - (d.valor / maxM) * chartH;
        return { x, y, h: d.valor, l: d.dia };
      }),
    };
  });

  progreso = computed(() => ({
    nivel: 8,
    xpActual: 720,
    xpMax: 1000,
    racha: 5,
    metasCumplidas: 12,
    insignias: [
      { nombre: 'Primer inicio', icono: 'estrella', desbloqueada: true },
      { nombre: 'Racha 7 días', icono: 'fuego', desbloqueada: true },
      { nombre: 'Apuntes pro', icono: 'libro', desbloqueada: true },
      { nombre: 'Matemáticas', icono: 'calculadora', desbloqueada: false },
      { nombre: 'Investigador', icono: 'lupa', desbloqueada: false },
    ],
  }));

  private readonly courseService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly prefs = inject(PreferenciasService);
  private readonly route = inject(ActivatedRoute);
  private readonly proyectoService = inject(ProyectoService);

  user = this.authService.userSignal;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  courses = this.courseService.obtenerCursosPorUsuario(this.userIdComputed);

  proyectos = this.proyectoService.obtenerPorUsuarioId(this.userIdComputed);

  private httpClient = inject(HttpClient);

  private allTareas = signal<TareaProyectoResponse[]>([]);

  constructor() {
    effect(() => {
      const projs = this.proyectos.value();
      if (!projs || projs.length === 0) {
        this.allTareas.set([]);
        return;
      }
      Promise.all(
        projs.map(p =>
          firstValueFrom(this.httpClient.get<TareaProyectoResponse[]>(`${apiUrl}/tareas/${p.idProyecto}`))
        )
      ).then(results => this.allTareas.set(results.flat()));
    });
    this.startTimeTracking();
  }

  private idioma = computed<Idioma>(() => {
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t = computed(() => I18N[this.idioma()]);
  a11yClass = this.prefs.a11yClass;
  greeting = computed(() => `${this.t()['saludo']}, ${this.user()?.nombres?.split(' ')[0] ?? ''}! 👋`);

  readonly arExperiences: ArExperience[] = [
    {
      id: 'solar-system',
      title: 'Sistema Solar AR',
      shortTitle: 'Sistema Solar',
      description: 'Visualiza los planetas orbitando alrededor del Sol con una composición astronómica realista.',
      imageUrl: 'assets/ar/sistema-solar.jpg',
      modelType: 'solar-system',
      questions: [
        '¿Cuál es el planeta más cercano al Sol?',
        '¿Qué planeta tiene anillos?',
        'Ordena los planetas según su distancia al Sol.',
      ],
    },
    {
      id: 'planets',
      title: 'Planetas 3D AR',
      shortTitle: 'Planetas 3D',
      description: 'Explora un planeta individual con textura, brillo y anillo educativo.',
      imageUrl: 'assets/ar/planetas-3d.jpg',
      modelType: 'planets',
      questions: [
        '¿Qué características observas en el planeta?',
        '¿Tiene anillos, atmósfera o superficie rocosa?',
        '¿Cómo se diferencia de la Tierra?',
      ],
    },
    {
      id: 'milky-way',
      title: 'Vía Láctea AR',
      shortTitle: 'Vía Láctea',
      description: 'Observa una galaxia espiral flotando en tu entorno real.',
      imageUrl: 'assets/ar/via-lactea.jpg',
      modelType: 'milky-way',
      questions: [
        '¿Qué forma tiene la galaxia observada?',
        '¿Dónde se encuentra aproximadamente el sistema solar dentro de la Vía Láctea?',
        '¿Qué elementos componen una galaxia?',
      ],
    },
    {
      id: 'moon-phases',
      title: 'Fases de la Luna AR',
      shortTitle: 'Fases de la Luna',
      description: 'Visualiza las fases lunares y comprende cómo cambia la iluminación de la Luna.',
      imageUrl: 'assets/ar/fases-luna.jpg',
      modelType: 'moon-phases',
      questions: [
        '¿Qué fase lunar se observa completamente iluminada?',
        '¿Por qué cambia la apariencia de la Luna?',
        'Ordena las fases principales de la Luna.',
      ],
    },
    {
      id: 'eclipse',
      title: 'Eclipse Solar AR',
      shortTitle: 'Eclipse Solar',
      description: 'Simula la alineación del Sol, la Luna y la Tierra durante un eclipse.',
      imageUrl: 'assets/ar/eclipse-solar.jpg',
      modelType: 'eclipse',
      questions: [
        '¿Qué cuerpos celestes participan en un eclipse solar?',
        '¿Qué objeto se ubica entre el Sol y la Tierra?',
        '¿Por qué se produce la sombra durante el eclipse?',
      ],
    },
    {
      id: 'constellations',
      title: 'Constelaciones AR',
      shortTitle: 'Constelaciones',
      description: 'Visualiza estrellas conectadas formando figuras.',
      imageUrl: 'assets/ar/constelaciones.jpg',
      modelType: 'constellations',
      questions: [
        '¿Qué es una constelación?',
        '¿Qué figura forman las estrellas mostradas?',
        '¿Para qué se usaban las constelaciones antiguamente?',
      ],
    },
  ];
  readonly arPlanets: ArPlanet[] = [
  {
    id: 'mercury',
    name: 'Mercurio',
    imageUrl: 'assets/ar/mercurio.png',
    type: 'Planeta rocoso',
    rotation: '58.6 días terrestres',
    translation: '88 días terrestres',
    description: 'Es el planeta más cercano al Sol y presenta una superficie llena de cráteres.',
    atmosphere: 'Exosfera muy delgada',
    surface: 'Superficie rocosa',
  },
  {
    id: 'venus',
    name: 'Venus',
    imageUrl: 'assets/ar/venus.png',
    type: 'Planeta rocoso',
    rotation: '243 días terrestres',
    translation: '225 días terrestres',
    description: 'Tiene una atmósfera densa y es uno de los planetas más calientes del sistema solar.',
    atmosphere: 'Atmósfera densa',
    surface: 'Superficie volcánica',
  },
  {
    id: 'earth',
    name: 'Tierra',
    imageUrl: 'assets/ar/tierra.png',
    type: 'Planeta rocoso',
    rotation: '23h 56m',
    translation: '365 días',
    description: 'Es nuestro planeta, con agua líquida, atmósfera respirable y vida.',
    atmosphere: 'Atmósfera con oxígeno',
    surface: 'Océanos y continentes',
  },
  {
    id: 'mars',
    name: 'Marte',
    imageUrl: 'assets/ar/marte.png',
    type: 'Planeta rocoso',
    rotation: '24h 37m',
    translation: '687 días terrestres',
    description: 'Es conocido como el planeta rojo por el óxido de hierro presente en su superficie.',
    atmosphere: 'Atmósfera delgada',
    surface: 'Suelo rojizo',
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    imageUrl: 'assets/ar/jupiter.png',
    type: 'Gigante gaseoso',
    rotation: '9h 56m',
    translation: '11.86 años',
    description: 'Es el planeta más grande del sistema solar y posee una gran tormenta visible.',
    atmosphere: 'Nubes de gas',
    surface: 'No tiene superficie sólida',
  },
  {
    id: 'saturn',
    name: 'Saturno',
    imageUrl: 'assets/ar/saturno.png',
    type: 'Gigante gaseoso',
    rotation: '10h 33m',
    translation: '29.5 años',
    description: 'Es famoso por sus anillos formados por hielo, polvo y roca.',
    atmosphere: 'Hidrógeno y helio',
    surface: 'Anillos visibles',
  },
  {
    id: 'uranus',
    name: 'Urano',
    imageUrl: 'assets/ar/urano.png',
    type: 'Gigante helado',
    rotation: '17h 14m',
    translation: '84 años',
    description: 'Rota de lado y tiene un color azul verdoso por el metano de su atmósfera.',
    atmosphere: 'Metano atmosférico',
    surface: 'Gigante helado',
  },
  {
    id: 'neptune',
    name: 'Neptuno',
    imageUrl: 'assets/ar/neptuno.png',
    type: 'Gigante helado',
    rotation: '16h 6m',
    translation: '164.8 años',
    description: 'Es el planeta más lejano del Sol y posee vientos extremadamente rápidos.',
    atmosphere: 'Vientos intensos',
    surface: 'Gigante helado',
  },
];


  selectedArExperience: ArExperience = this.arExperiences[0];
  arPanelOpen = false;
  cameraActive = false;
  cameraLoading = false;
  modelVisible = true;
  cameraError = '';
  showOrbits = true;
  showLabels = true;
  solarMotion = true;
  arScale = 1;
  arOffsetX = 0;
  arOffsetY = 0;
  isDraggingArModel = false;
  dragStartX = 0;
  dragStartY = 0;
  arAnswers: string[] = this.selectedArExperience.questions.map(() => '');
  arSubmitted = false;
  private cameraStream?: MediaStream;

  currentPlanetIndex = 5;
  planetMotionMode: 'rotation' | 'translation' = 'rotation';

  get selectedArPlanet(): ArPlanet {
    return this.arPlanets[this.currentPlanetIndex];
  }

  previousArPlanet(): void {
    this.currentPlanetIndex =
      (this.currentPlanetIndex - 1 + this.arPlanets.length) % this.arPlanets.length;
  }

  nextArPlanet(): void {
    this.currentPlanetIndex =
      (this.currentPlanetIndex + 1) % this.arPlanets.length;
  }

  selectArPlanet(index: number): void {
    this.currentPlanetIndex = index;
  }

  selectPlanetMotion(mode: 'rotation' | 'translation'): void {
    this.planetMotionMode = mode;
  }
  @ViewChild('cameraVideo') cameraVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'aula-ar') {
        requestAnimationFrame(() => {
          const target = document.getElementById('aula-ar');
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.openArPanel();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimeTracking();
    this.stopCamera();
  }

  getTodaySessions() {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    return this.courses?.value()?.flatMap((course) =>
      course.sesiones
        .filter((sesion) => {
          if (!sesion.horaInicio) return false;
          const d = new Date(sesion.horaInicio);
          return d.getFullYear() === todayYear && d.getMonth() === todayMonth && d.getDate() === todayDay;
        })
        .map((sesion) => ({ course, sesion }))
    );
  }

  getNextSessions(limit = 3) {
    const now = new Date();
    const allUpcoming = this.courses?.value()?.flatMap((course) =>
      course.sesiones
        .filter((sesion) => {
          if (!sesion.horaInicio) return false;
          return new Date(sesion.horaInicio) > now;
        })
        .map((sesion) => ({ course, sesion }))
    );
    if (!allUpcoming) return [];
    return allUpcoming
      .sort((a, b) => new Date(a.sesion.horaInicio).getTime() - new Date(b.sesion.horaInicio).getTime())
      .slice(0, limit);
  }

  formatDate(dateString: string): string {
    if (!dateString) return this.t()['sinFecha'];
    const date = new Date(dateString);
    const months = this.t()['meses'].split(',');
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  }

  formatDateFull(date: Date): string {
    const months = this.t()['meses'].split(',');
    const days = this.t()['dias'].split(',');
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
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

  // ─── Time tracking ────────────────────────────────────────────

  private loadUsageData(): Record<string, number> {
    try {
      const raw = localStorage.getItem('usage_data');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  private saveUsageData(data: Record<string, number>): void {
    try { localStorage.setItem('usage_data', JSON.stringify(data)); } catch {}
  }

  private getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  private flushTime(): void {
    if (this.accumulatedSeconds === 0) return;
    const data = this.loadUsageData();
    const key = this.getTodayKey();
    data[key] = (data[key] ?? 0) + this.accumulatedSeconds / 60;
    this.accumulatedSeconds = 0;
    this.saveUsageData(data);
    this.usageData.set(this.loadUsageData());
  }

  private startTimeTracking(): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.trackingInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.accumulatedSeconds += 30;
        this.flushTime();
      }
    }, 30000);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  private stopTimeTracking(): void {
    this.isTracking = false;
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.flushTime();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.startTimeTracking();
    } else {
      this.flushTime();
    }
  };

  private onBeforeUnload = (): void => {
    this.flushTime();
  };

  // ─── Asistente IA ──────────────────────────────────────────────

  chatMessages = signal<{ role: 'user' | 'assistant'; text: string }[]>([]);
  chatInput = '';

  sendMessage(): void {
    const text = this.chatInput.trim();
    if (!text) return;
    this.chatMessages.update(m => [...m, { role: 'user', text }]);
    this.chatInput = '';
    setTimeout(() => {
      const response = this.generateAIResponse(text);
      this.chatMessages.update(m => [...m, { role: 'assistant', text: response }]);
    }, 400);
  }

  private generateAIResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('hola') || lower.includes('buenos') || lower.includes('hey')) return '¡Hola! ¿En qué puedo ayudarte con tus estudios hoy?';
    if (lower.includes('curso') || lower.includes('materia') || lower.includes('clase')) {
      const cursos = this.courses.value();
      if (cursos && cursos.length > 0) return `Tienes ${cursos.length} cursos inscritos: ${cursos.map(c => c.nombre).join(', ')}.`;
      return 'Aún no tienes cursos registrados.';
    }
    if (lower.includes('tarea') || lower.includes('tareas') || lower.includes('pendiente')) {
      return `Tienes ${this.allTareas().filter(t => t.estado !== 'completado').length} tareas pendientes en total.`;
    }
    if (lower.includes('proyecto') || lower.includes('proyectos')) {
      const proyectos = this.proyectos.value();
      if (proyectos && proyectos.length > 0) return `Tienes ${proyectos.filter(p => p.estado !== 'completado').length} proyectos activos.`;
      return 'No tienes proyectos registrados.';
    }
    if (lower.includes('próxima') || lower.includes('proxima') || lower.includes('siguiente') || lower.includes('sesión') || lower.includes('sesion')) {
      const next = this.getNextSessions(1);
      if (next.length > 0) return `Tu próxima sesión es: ${next[0].course.nombre} — ${this.formatDate(next[0].sesion.horaInicio)} a las ${this.formatTime(next[0].sesion.horaInicio)}.`;
      return 'No tienes sesiones próximas registradas.';
    }
    if (lower.includes('hoy')) {
      const hoy = this.getTodaySessions();
      if (hoy && hoy.length > 0) return `Hoy tienes ${hoy.length} sesión(es): ${hoy.map(s => s.course.nombre).join(', ')}.`;
      return 'Hoy no tienes sesiones agendadas. ¡Aprovecha para estudiar!';
    }
    return 'Entendido. Puedo ayudarte con info sobre tus cursos, tareas, proyectos, sesiones y más. ¿Qué deseas saber?';
  }

  askQuickAction(text: string): void {
    this.chatInput = text;
    this.sendMessage();
  }

  openArPanel(): void {
    this.arPanelOpen = true;
    this.arSubmitted = false;
    this.cameraError = '';
  }

  closeArPanel(): void {
    this.arPanelOpen = false;
    this.stopCamera();
    this.cameraError = '';
  }

  selectArExperience(experience: ArExperience): void {
    this.selectedArExperience = experience;
    this.arAnswers = experience.questions.map(() => '');
    this.arSubmitted = false;
    this.cameraError = '';
    this.modelVisible = true;
    this.centerArModel();

    if (experience.modelType === 'planets') {
      this.currentPlanetIndex = 5;
    }
  }

  showModel3D(): void {
    this.modelVisible = true;
    this.cameraError = '';
  }

  toggleModelVisibility(): void {
    this.modelVisible = !this.modelVisible;
  }

  toggleCamera(): void {
    if (this.cameraActive) {
      this.stopCamera();
      this.modelVisible = true;
      return;
    }

    void this.activateCamera();
  }

  async activateCamera(): Promise<void> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    this.cameraError = 'No se pudo acceder a la cámara. Puedes continuar viendo el modelo 3D.';
    this.cameraActive = false;
    this.modelVisible = true;
    return;
  }

  this.cameraLoading = true;
  this.cameraError = '';
  this.modelVisible = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    this.cameraStream = stream;
    this.cameraActive = true;

    await new Promise((resolve) => setTimeout(resolve, 0));

    const video = this.cameraVideo?.nativeElement;

    if (!video) {
      this.cameraError = 'La cámara se activó, pero no se encontró el visor de video.';
      return;
    }

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = stream;

    await video.play();
  } catch (error) {
    console.error('Error al activar cámara AR:', error);
    this.cameraError = 'No se pudo acceder a la cámara. Puedes continuar viendo el modelo 3D.';
    this.cameraActive = false;
    this.modelVisible = true;
  } finally {
    this.cameraLoading = false;
  }
}

  stopCamera(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = undefined;
    }

    this.cameraActive = false;

    if (this.cameraVideo?.nativeElement) {
      this.cameraVideo.nativeElement.pause();
      this.cameraVideo.nativeElement.srcObject = null;
    }
  }

  toggleOrbits(): void {
    this.showOrbits = !this.showOrbits;
  }

  toggleSolarMotion(): void {
  this.solarMotion = !this.solarMotion;
}

  toggleLabels(): void {
    this.showLabels = !this.showLabels;
  }

  increaseArScale(): void {
    this.arScale = Math.min(1.5, Number((this.arScale + 0.1).toFixed(1)));
  }

  decreaseArScale(): void {
    this.arScale = Math.max(0.7, Number((this.arScale - 0.1).toFixed(1)));
  }

  centerArModel(): void {
    this.arOffsetX = 0;
    this.arOffsetY = 0;
    this.arScale = 1;
  }

  getArModelTransform(): string {
    const baseY = this.cameraActive ? 40 : 0;
    return `translate(calc(-50% + ${this.arOffsetX}px), ${this.arOffsetY + baseY}px) scale(${this.arScale})`;
  }

  onArPointerDown(event: PointerEvent): void {
  const target = event.target as HTMLElement;

  if (target.closest('button')) {
    return;
  }

  this.isDraggingArModel = true;
  this.dragStartX = event.clientX - this.arOffsetX;
  this.dragStartY = event.clientY - this.arOffsetY;
  (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
}

  onArPointerMove(event: PointerEvent): void {
    if (!this.isDraggingArModel) return;
    this.arOffsetX = event.clientX - this.dragStartX;
    this.arOffsetY = event.clientY - this.dragStartY;
  }

  onArPointerUp(): void {
    this.isDraggingArModel = false;
  }

  submitArAnswers(): void {
    this.arSubmitted = true;
  }
}
