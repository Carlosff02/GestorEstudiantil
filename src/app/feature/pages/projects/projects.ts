import { Component, computed, inject, signal } from '@angular/core';

import { ProyectoService } from '../../service/proyecto.service';
import { AuthService } from '../../service/auth.service';
import { ActualizarTareaProyectoRequest, GuardarProyectoMiembroRequest, GuardarProyectoRequest, GuardarTareaProyectoRequest, ProyectoResponse, TareaProyectoResponse } from '../../types/project.type';
import { form, FormField, required } from '@angular/forms/signals';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, LucideAngularModule, Plus, Trash2, XIcon } from 'lucide-angular';
import { CoursesService } from '../../service/courses.service';
import { TareaProyectoService } from '../../service/tarea-proyecto.service';
import { Trello } from 'lucide-angular/src/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoMiembroService } from '../../service/proyecto-miembro.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type PerfilAccesibilidad = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'baja_vision' | 'ceguera';

const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  normal:       '',
  protanopia:   'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia:   'a11y-tritanopia',
  baja_vision:  'a11y-baja-vision',
  ceguera:      'a11y-ceguera',
};

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    projectsTitle:    'Proyectos Académicos',
    projectsSubtitle: 'Relacionados a tus asignaturas y equipos de trabajo.',
    newProject:       'Nuevo Proyecto',
    progress:         'Progreso',
    board:            'Tablero',
    // Modal
    saveProjectTitle: 'Nuevo Proyecto',
    projectName:      'Nombre del Proyecto',
    projectNamePlace: 'Ej: Red de Área Local',
    courseAssoc:      'Curso Asociado',
    selectCourse:     'Seleccionar curso',
    description:      'Descripción',
    startDate:        'Fecha de Inicio',
    endDate:          'Fecha de Fin',
    initialStatus:    'Estado Inicial',
    statusPendiente:  'Pendiente',
    statusProceso:    'En proceso',
    statusCompleto:   'Completado',
    statusCancelado:  'Cancelado',
    cancel:           'Cancelar',
    createProject:    'Crear Proyecto',
    // Kanban
    taskCenter:       'Centro de Tareas',
    kanbanSub:        'Gestión Kanban · Semestre 2026-I',
    members:          'Miembros:',
    addMember:        'Asignar Miembro',
    memberEmailLabel: 'Escriba el correo del usuario a invitar',
    memberRoleLabel:  'Rol del Integrante',
    memberCollab:     'Colaborador',
    memberLeader:     'Líder',
    add:              'Añadir Miembro',
    newTask:          'Nueva Tarea',
    taskTitle:        'Título de la Tarea',
    taskTitlePlace:   'Ej: Implementar disparadores SQL',
    taskDesc:         'Descripción',
    taskAssignee:     'Asignado a',
    taskDeadline:     'Fecha Límite',
    taskPriority:     'Prioridad',
    prioLow:          'Baja',
    prioMedium:       'Media',
    prioHigh:         'Alta',
    estado:           'Estado',
    pending:          'Pendiente',
    inProgress:       'En Progreso',
    review:           'En Revisión',
    completed:        'Completado',
    saveTask:         'Guardar Tarea',
    confirmDelete:    '¿Está seguro de que desea eliminar la tarea?',
    sinDesc:          'Sin descripción',
    sinAsignar:       'No Asignado',
    // Columns
    colPendiente:     'Pendiente',
    colProgreso:      'En Progreso',
    colRevision:      'En Revisión',
    colCompletado:    'Completado',
    moveLeft:         'Mover al estado anterior',
    moveRight:        'Mover al siguiente estado',
  },
  en: {
    projectsTitle:    'Academic Projects',
    projectsSubtitle: 'Related to your subjects and work teams.',
    newProject:       'New Project',
    progress:         'Progress',
    board:            'Board',
    saveProjectTitle: 'New Project',
    projectName:      'Project Name',
    projectNamePlace: 'E.g.: Local Area Network',
    courseAssoc:      'Associated Course',
    selectCourse:     'Select course',
    description:      'Description',
    startDate:        'Start Date',
    endDate:          'End Date',
    initialStatus:    'Initial Status',
    statusPendiente:  'Pending',
    statusProceso:    'In progress',
    statusCompleto:   'Completed',
    statusCancelado:  'Cancelled',
    cancel:           'Cancel',
    createProject:    'Create Project',
    taskCenter:       'Task Center',
    kanbanSub:        'Kanban Management · Term 2026-I',
    members:          'Members:',
    addMember:        'Assign Member',
    memberEmailLabel: 'Enter the email of the user to invite',
    memberRoleLabel:  'Member Role',
    memberCollab:     'Collaborator',
    memberLeader:     'Leader',
    add:              'Add Member',
    newTask:          'New Task',
    taskTitle:        'Task Title',
    taskTitlePlace:   'E.g.: Implement SQL triggers',
    taskDesc:         'Description',
    taskAssignee:     'Assigned to',
    taskDeadline:     'Deadline',
    taskPriority:     'Priority',
    prioLow:          'Low',
    prioMedium:       'Medium',
    prioHigh:         'High',
    estado:           'Status',
    pending:          'Pending',
    inProgress:       'In Progress',
    review:           'In Review',
    completed:        'Completed',
    saveTask:         'Save Task',
    confirmDelete:    'Are you sure you want to delete this task?',
    sinDesc:          'No description',
    sinAsignar:       'Not Assigned',
    colPendiente:     'Pending',
    colProgreso:      'In Progress',
    colRevision:      'In Review',
    colCompletado:    'Completed',
    moveLeft:         'Move to previous status',
    moveRight:        'Move to next status',
  },
  pt: {
    projectsTitle:    'Projetos Acadêmicos',
    projectsSubtitle: 'Relacionados às suas disciplinas e equipes de trabalho.',
    newProject:       'Novo Projeto',
    progress:         'Progresso',
    board:            'Quadro',
    saveProjectTitle: 'Novo Projeto',
    projectName:      'Nome do Projeto',
    projectNamePlace: 'Ex: Rede de Área Local',
    courseAssoc:      'Curso Associado',
    selectCourse:     'Selecionar curso',
    description:      'Descrição',
    startDate:        'Data de Início',
    endDate:          'Data de Término',
    initialStatus:    'Estado Inicial',
    statusPendiente:  'Pendente',
    statusProceso:    'Em andamento',
    statusCompleto:   'Concluído',
    statusCancelado:  'Cancelado',
    cancel:           'Cancelar',
    createProject:    'Criar Projeto',
    taskCenter:       'Centro de Tarefas',
    kanbanSub:        'Gestão Kanban · Período 2026-I',
    members:          'Membros:',
    addMember:        'Atribuir Membro',
    memberEmailLabel: 'Digite o e-mail do usuário a convidar',
    memberRoleLabel:  'Função do Membro',
    memberCollab:     'Colaborador',
    memberLeader:     'Líder',
    add:              'Adicionar Membro',
    newTask:          'Nova Tarefa',
    taskTitle:        'Título da Tarefa',
    taskTitlePlace:   'Ex: Implementar gatilhos SQL',
    taskDesc:         'Descrição',
    taskAssignee:     'Atribuído a',
    taskDeadline:     'Prazo Final',
    taskPriority:     'Prioridade',
    prioLow:          'Baixa',
    prioMedium:       'Média',
    prioHigh:         'Alta',
    estado:           'Estado',
    pending:          'Pendente',
    inProgress:       'Em Andamento',
    review:           'Em Revisão',
    completed:        'Concluído',
    saveTask:         'Salvar Tarefa',
    confirmDelete:    'Tem certeza que deseja excluir a tarefa?',
    sinDesc:          'Sem descrição',
    sinAsignar:       'Não Atribuído',
    colPendiente:     'Pendente',
    colProgreso:      'Em Andamento',
    colRevision:      'Em Revisão',
    colCompletado:    'Concluído',
    moveLeft:         'Mover ao estado anterior',
    moveRight:        'Mover ao próximo estado',
  },
  fr: {
    projectsTitle:    'Projets Académiques',
    projectsSubtitle: 'Liés à vos matières et équipes de travail.',
    newProject:       'Nouveau Projet',
    progress:         'Progression',
    board:            'Tableau',
    saveProjectTitle: 'Nouveau Projet',
    projectName:      'Nom du Projet',
    projectNamePlace: 'Ex: Réseau Local',
    courseAssoc:      'Cours Associé',
    selectCourse:     'Sélectionner le cours',
    description:      'Description',
    startDate:        'Date de Début',
    endDate:          'Date de Fin',
    initialStatus:    'Statut Initial',
    statusPendiente:  'En attente',
    statusProceso:    'En cours',
    statusCompleto:   'Terminé',
    statusCancelado:  'Annulé',
    cancel:           'Annuler',
    createProject:    'Créer le Projet',
    taskCenter:       'Centre des Tâches',
    kanbanSub:        'Gestion Kanban · Semestre 2026-I',
    members:          'Membres :',
    addMember:        'Ajouter un Membre',
    memberEmailLabel: "Entrez l'email de l'utilisateur à inviter",
    memberRoleLabel:  'Rôle du Membre',
    memberCollab:     'Collaborateur',
    memberLeader:     'Chef',
    add:              'Ajouter Membre',
    newTask:          'Nouvelle Tâche',
    taskTitle:        'Titre de la Tâche',
    taskTitlePlace:   'Ex: Implémenter les déclencheurs SQL',
    taskDesc:         'Description',
    taskAssignee:     'Assigné à',
    taskDeadline:     'Date Limite',
    taskPriority:     'Priorité',
    prioLow:          'Basse',
    prioMedium:       'Moyenne',
    prioHigh:         'Haute',
    estado:           'Statut',
    pending:          'En attente',
    inProgress:       'En cours',
    review:           'En révision',
    completed:        'Terminé',
    saveTask:         'Enregistrer',
    confirmDelete:    'Êtes-vous sûr de vouloir supprimer cette tâche ?',
    sinDesc:          'Sans description',
    sinAsignar:       'Non Assigné',
    colPendiente:     'En attente',
    colProgreso:      'En cours',
    colRevision:      'En révision',
    colCompletado:    'Terminé',
    moveLeft:         'État précédent',
    moveRight:        'État suivant',
  },
};

export interface KanbanColumn {
  id: 'pendiente' | 'en_progreso' | 'revision' | 'completado';
  title: string;
  colorClass: string;
}

@Component({
  selector: 'app-projects',
  imports: [FormField, LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  readonly XIcon = XIcon;
  readonly Trello = Trello;
  readonly ArrowLeft = ArrowLeft;
  readonly Plus = Plus;
  readonly Calendar = Calendar;
  readonly Trash2 = Trash2;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;

  private readonly projectService = inject(ProyectoService);
  private readonly authService = inject(AuthService);
  private readonly cursoService = inject(CoursesService);
  private readonly tareaProyectoService = inject(TareaProyectoService);
  private readonly projectMemberService = inject(ProyectoMiembroService);

  // ─── i18n / a11y ───────────────────────────────────────────────────────────

  user    = this.authService.userSignal;

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

  guardarMiembroRequest:GuardarProyectoMiembroRequest = {
    correo:'',
    idProyecto:0,
    rol:'colaborador'
  }

  assignMemberModalOpen = signal(false);
  creatingProject = signal(false);

  private newProjectModel = signal<GuardarProyectoRequest>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'pendiente',
    idCurso: 0
  });

  projectModel = signal<GuardarProyectoRequest>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'pendiente',
    idCurso: 0
  });

  projectForm = form(this.projectModel, (f) => {
    required(f.nombre, { message: 'El nombre del proyecto es requerido' });
    required(f.idCurso, { message: 'Debe seleccionar un curso' });
  });

  activeProject = signal<ProyectoResponse | null>(null);
  creatingNewTask = signal(false);

  idProject = computed(() => this.activeProject()?.idProyecto ?? 0);
  tasks = this.tareaProyectoService.obtenerPorProyecto(this.idProject)
  projectMembers = this.projectMemberService.obtenerPorProyecto(this.idProject)

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ? currentUser.idUsuario : 0) : 0;
  });

  guardarTareaRequest:GuardarTareaProyectoRequest = {
    titulo:'',
    descripcion:'',
    fechaLimite:'',
    estado:'pendiente',
    prioridad:'baja',
    idProyecto:0,
    idAsignadoA:this.userIdComputed()
  }

  courses = this.cursoService.obtenerCursosPorUsuario(this.userIdComputed)
  proyectos = this.projectService.obtenerPorUsuarioId(this.userIdComputed);

  columns: KanbanColumn[] = [
    {
      id: 'pendiente',
      title: 'Pendiente',
      colorClass: 'bg-slate-400'
    },
    {
      id: 'en_progreso',
      title: 'En Progreso',
      colorClass: 'bg-blue-500'
    },
    {
      id: 'revision',
      title: 'En Revisión',
      colorClass: 'bg-amber-500'
    },
    {
      id: 'completado',
      title: 'Completado',
      colorClass: 'bg-emerald-500'
    }
  ];

  obtenerTareasPorEstado(estado: string) {
    return this.tasks.value()?.filter(task => task.estado === estado);
  }

  openProjectModal() {
    this.creatingProject.set(true);
    this.projectModel.set(structuredClone(this.newProjectModel()));
  }

  closeProjectModal() {
    this.creatingProject.set(false);
    this.projectModel.set(structuredClone(this.newProjectModel()));
  }

  eliminarTarea(id:number){
    const confirm = window.confirm(this.t()['confirmDelete'])
    if(!confirm) return;
    this.tareaProyectoService.eliminarTarea(id).subscribe({
      next:(res)=>{ this.tasks.reload() },
      error:(err)=>{ console.error(err) }
    })
  }

  saveProject() {
    if (!this.projectForm().valid()) return;
    this.projectService.guardarProyecto(this.projectModel()).subscribe({
      next: () => {
        this.closeProjectModal();
        this.proyectos.reload();
      },
      error: (err) => console.error(err)
    });
  }

  obtenerNombreCurso(idCurso:number){
    const cursos = this.courses.value()
    if(!cursos) return '';
    const curso = cursos.find((c)=>c.idCurso===idCurso)
    if(!curso) return '';
    return curso.nombre;
  }

  obtenerColorCurso(idCurso:number){
    const cursos = this.courses.value()
    if(!cursos) return '';
    const curso = cursos.find((c)=>c.idCurso===idCurso)
    if(!curso) return '';
    return curso.color;
  }

  getEstadoClase(estado: string): string {
    const stateColors: Record<string, string> = {
      pendiente: 'bg-slate-100 text-slate-600',
      en_proceso: 'bg-sky-100 text-sky-700',
      completado: 'bg-emerald-100 text-emerald-700',
      cancelado: 'bg-rose-100 text-rose-700'
    };
    return stateColors[estado] ?? 'bg-slate-100 text-slate-600';
  }

  saveNewMember(){
    const activeProject = this.activeProject();
    if(!activeProject) return;
    this.guardarMiembroRequest.idProyecto=activeProject.idProyecto;
    if (!this.guardarMiembroRequest.correo ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guardarMiembroRequest.correo)) {
      return;
    }
    this.projectMemberService.guardarMiembro(this.guardarMiembroRequest).subscribe({
      next:(res)=>{
        this.assignMemberModalOpen.set(false);
        this.projectMembers.reload()
      }, error:(err)=>{ console.error(err); }
    })
  }

  saveNewTask(){
    const activeProject = this.activeProject();
    if(!activeProject) return;
    const newTask = this.guardarTareaRequest
    newTask.idProyecto=activeProject.idProyecto
    if((newTask.idAsignadoA===0)||(newTask.titulo==='')) return;
    this.tareaProyectoService.guardarTarea(newTask).subscribe({
      next:(res)=>{
        this.creatingNewTask.set(false);
        this.tasks.reload()
      },error:(err)=>{ console.error(err) }
    })
  }

  obtenerAvatar(id:number|null){
    if(!id) return this.t()['sinAsignar']
    const members = this.projectMembers.value();
    const asignadoA = members?.find((m)=> m.idUsuario===id)
    if(asignadoA) return `${asignadoA.nombres[0]}${asignadoA.apellidos[0]}`
    const me = this.user()
    if(!me) return this.t()['sinAsignar']
    if(me.idUsuario===id) return `${me.nombres[0]}${me.apellidos[0]}`
    return this.t()['sinAsignar']
  }

  readonly estados = ['pendiente', 'en_progreso', 'revision', 'completado'];

  moverDerecha(task: TareaProyectoResponse) {
    const index = this.estados.indexOf(task.estado);
    if (index < this.estados.length - 1) {
      this.actualizarEstado(task, this.estados[index + 1]);
    }
  }

  moverIzquierda(task: TareaProyectoResponse) {
    const index = this.estados.indexOf(task.estado);
    if (index > 0) {
      this.actualizarEstado(task, this.estados[index - 1]);
    }
  }

  actualizarEstado(task: TareaProyectoResponse, estado:string) {
    const request:ActualizarTareaProyectoRequest = {
      idTarea:task.idTarea,
      titulo:task.titulo,
      descripcion:task.descripcion,
      fechaLimite:task.fechaLimite,
      estado:estado,
      prioridad:task.prioridad,
      idAsignadoA:task.idAsignadoA
    }
    this.tareaProyectoService.actualizarTarea(request).subscribe({
      next:(res)=>{ this.tasks.reload() },
      error:(err)=>{ console.error(err) }
    });
  }
}
