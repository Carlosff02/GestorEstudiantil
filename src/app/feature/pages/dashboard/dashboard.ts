import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { CoursesService } from '../../service/courses.service';
import { PreferenciasService } from '../../../core/service/preferencias.service';

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
    clasesDelDia: 'Clases del Día (Hoy)',
    verHorario: 'Ver horario completo',
    sinSesiones: 'No tienes sesiones programadas para hoy.',
    aulaPorAsignar: 'Aula por asignar',
    verEnCursos: 'Ver en mis Cursos',
    verTodosCursos: 'Ver todos mis cursos',
    meses: 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
    sinFecha: 'Sin fecha',
    dias: 'DOM,LUN,MAR,MIE,JUE,VIE,SAB',
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
    sinSesiones: 'Nenhuma sess�o programada para hoje.',
    aulaPorAsignar: 'Sala a ser atribuída',
    verEnCursos: 'Ver em Meus Cursos',
    verTodosCursos: 'Ver todos os meus cursos',
    meses: 'Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro',
    sinFecha: 'Sem data',
    dias: 'DOM,SEG,TER,QUA,QUI,SEX,SAB',
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
  readonly CheckIcon: LucideIconData = Check;
  readonly FileTextIcon: LucideIconData = FileText;
  readonly LibraryIcon: LucideIconData = Library;
  readonly ClockIcon: LucideIconData = Clock;
  readonly CalendarDaysIcon: LucideIconData = CalendarDays;
  readonly HistoryIcon: LucideIconData = History;
  readonly InfoIcon = InfoIcon;
  readonly ListIcon = ListIcon;

  private readonly courseService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly prefs = inject(PreferenciasService);
  private readonly route = inject(ActivatedRoute);

  user = this.authService.userSignal;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  courses = this.courseService.obtenerCursosPorUsuario(this.userIdComputed);

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

  formatDate(dateString: string): string {
    if (!dateString) return this.t()['sinFecha'];
    const date = new Date(dateString);
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
