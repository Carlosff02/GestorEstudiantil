import { Component, computed, inject, signal } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Bell, LucideAngularModule, Menu, X } from 'lucide-angular';
import { ProyectoMiembroService } from '../../service/proyecto-miembro.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type PerfilAccesibilidad = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'baja_vision' | 'ceguera';

// ─── Diccionario i18n ─────────────────────────────────────────────────────────

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    buscarPlaceholder:   'Buscar cursos, tareas...',
    dashboard:           'Dashboard',
    misCursos:           'Mis Cursos',
    horario:             'Horario',
    misProyectos:        'Mis Proyectos',
    abrirMenu:           'Abrir menú',
    notificaciones:      'Notificaciones',
    // Course detail
    registroCalif:       'Registro de Calificaciones',
    ciclo:               'Ciclo 2026-I',
    evaluacion:          'Evaluación',
    peso:                'Peso',
    fecha:               'Fecha',
    nota:                'Nota',
    promedioActual:      'Promedio Actual',
    estadoAprobando:     'Aprobando',
    prediccion:          'Predicción',
    prediccionTexto:     'Si obtienes al menos un 14 en el examen final, mantendrás tu promedio actual por encima de 16.',
    // Projects
    colabora:            'Colabora en tiempo real con tus compañeros.',
    nuevoProyecto:       'Nuevo Proyecto',
    // Kanban
    gestionAgil:         'Gestión ágil de tareas.',
    tableroProyecto:     'Tablero de Proyecto',
  },
  en: {
    buscarPlaceholder:   'Search courses, tasks...',
    dashboard:           'Dashboard',
    misCursos:           'My Courses',
    horario:             'Schedule',
    misProyectos:        'My Projects',
    abrirMenu:           'Open menu',
    notificaciones:      'Notifications',
    registroCalif:       'Grade Record',
    ciclo:               'Term 2026-I',
    evaluacion:          'Assessment',
    peso:                'Weight',
    fecha:               'Date',
    nota:                'Grade',
    promedioActual:      'Current Average',
    estadoAprobando:     'Passing',
    prediccion:          'Prediction',
    prediccionTexto:     'If you score at least a 14 on the final exam, your average will stay above 16.',
    colabora:            'Collaborate in real time with your classmates.',
    nuevoProyecto:       'New Project',
    gestionAgil:         'Agile task management.',
    tableroProyecto:     'Project Board',
  },
  pt: {
    buscarPlaceholder:   'Pesquisar cursos, tarefas...',
    dashboard:           'Painel',
    misCursos:           'Meus Cursos',
    horario:             'Horário',
    misProyectos:        'Meus Projetos',
    abrirMenu:           'Abrir menu',
    notificaciones:      'Notificações',
    registroCalif:       'Registro de Notas',
    ciclo:               'Período 2026-I',
    evaluacion:          'Avaliação',
    peso:                'Peso',
    fecha:               'Data',
    nota:                'Nota',
    promedioActual:      'Média Atual',
    estadoAprobando:     'Aprovado',
    prediccion:          'Previsão',
    prediccionTexto:     'Se você obtiver pelo menos 14 no exame final, sua média ficará acima de 16.',
    colabora:            'Colabore em tempo real com seus colegas.',
    nuevoProyecto:       'Novo Projeto',
    gestionAgil:         'Gestão ágil de tarefas.',
    tableroProyecto:     'Quadro do Projeto',
  },
  fr: {
    buscarPlaceholder:   'Rechercher cours, tâches...',
    dashboard:           'Tableau de bord',
    misCursos:           'Mes Cours',
    horario:             'Emploi du temps',
    misProyectos:        'Mes Projets',
    abrirMenu:           'Ouvrir le menu',
    notificaciones:      'Notifications',
    registroCalif:       'Relevé de Notes',
    ciclo:               'Semestre 2026-I',
    evaluacion:          'Évaluation',
    peso:                'Coefficient',
    fecha:               'Date',
    nota:                'Note',
    promedioActual:      'Moyenne Actuelle',
    estadoAprobando:     'Réussite',
    prediccion:          'Prévision',
    prediccionTexto:     'Si vous obtenez au moins 14 à l\'examen final, votre moyenne restera au-dessus de 16.',
    colabora:            'Collaborez en temps réel avec vos camarades.',
    nuevoProyecto:       'Nouveau Projet',
    gestionAgil:         'Gestion agile des tâches.',
    tableroProyecto:     'Tableau du Projet',
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
  selector: 'app-home',
  imports: [Sidebar, RouterModule, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly Bell = Bell;
  readonly X = X;
  readonly Menu = Menu;

  private readonly authService = inject(AuthService);
  private readonly proyectoMiembroService = inject(ProyectoMiembroService);

  switchView(_target: 'courses' | 'projects'): void {
    // Handler placeholder (evita errores de compilación por bindings).
  }


  user = this.authService.userSignal;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  proyectos = this.proyectoMiembroService.obtenerInvitaciones(this.userIdComputed);

  notificationModalOpen = signal(false);

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

  aceptarInvitacion(proyectoId:number){
    const idUsuario = this.user()?.idUsuario;
    if(!idUsuario) return;
    this.proyectoMiembroService.aceptarr({idProyecto: proyectoId,idUsuario:idUsuario}).subscribe({
      next:(res)=>{
        this.notificationModalOpen.set(false)
      }, error:(err)=>{
        console.error(err)
      }
    })
  }
  reachazarInvitacion(proyectoMiembroId:number){
    this.proyectoMiembroService.eliminarMiembro(proyectoMiembroId).subscribe({
      next:(res)=>{
        this.proyectos.reload()
      }, error:(err)=>{
        console.error(err)
      }
    })
  }
}
