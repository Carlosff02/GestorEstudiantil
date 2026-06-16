export type Proyecto = {
  idProyecto: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  cursoId: number;
  miembros: ProyectoMiembro[];
  tareas: TareaProyecto[];
};

export type ProyectoMiembro = {
  idMiembro: number;
  proyectoId: number;
  usuarioId: number;
  rol: string;
  fechaAsignacion: string;
};

export type TareaProyecto = {
  idTarea: number;
  proyectoId: number;
  titulo: string;
  descripcion: string;
  asignadoA: number | null;
  fechaLimite: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
};



// models.ts

// ========== PROYECTO ==========
export type GuardarProyectoRequest = {
  nombre: string;
  descripcion: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  estado: string;
  idCurso: number;
}

export type ProyectoResponse = {
  idProyecto: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  estado: string;
  idCurso: number;
}

// ========== PROYECTO MIEMBRO ==========
export type GuardarProyectoMiembroRequest = {
  rol: string;
  idProyecto: number;
  correo: string
}

export type ProyectoMiembroResponse = {
  idMiembro: number;
  rol: string;
  fechaAsignacion: Date | string;
  idProyecto: number;
  idUsuario: number;
  nombres:string;
  apellidos:string;
}

// ========== TAREA PROYECTO ==========
export type GuardarTareaProyectoRequest = {
  titulo: string;
  descripcion: string;
  fechaLimite: Date | string;
  estado: string;
  prioridad: string;
  idProyecto: number;
  idAsignadoA: number | null;
}

export type ActualizarTareaProyectoRequest = {
  idTarea: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date | string;
  estado: string;
  prioridad: string;
  idAsignadoA: number | null;
}

export type TareaProyectoResponse = {
  idTarea: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date | string;
  estado: string;
  prioridad: string;
  fechaCreacion: Date | string;
  idProyecto: number;
  idAsignadoA: number | null;
}

export type ProyectoInvitacionResponse = {
  idProyecto: number;
  idProyectoMiembro:number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  idCurso: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  rolPropuesto:string;
};
