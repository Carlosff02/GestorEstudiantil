import { User } from "./user.type";

export type Curso = {
  idCurso:number;
  nombre:string;
  docente:string;
  descripcion:string;
  color:string;
  ciclo:string;
  creditos:number;
  usuarioId:number;
  sesiones:Sesion[];
}
export type GuardarCursoRequest = {
  nombre:string;
  docente:string;
  description:string;
  color:string;
  ciclo:string;
  creditos:number;
  usuarioId:number;

}
export type ActualizarCursoRequest = {
  id:number;
  nombre:string;
  docente:string;
  description:string;
  color:string;
  ciclo:string;
  creditos:number;
  usuarioId:number;
  activo:boolean;

}
export type Sesion = {
  id: number;
  nombre: string;
  notas: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  cursoId: number;
};

export type GuardarSesionRequest = {
  nombre: string;
  notas: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  cursoId: number;
};

export type ActualizarSesionRequest = {
  id: number;
  nombre: string;
  notas: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  cursoId: number;
};
