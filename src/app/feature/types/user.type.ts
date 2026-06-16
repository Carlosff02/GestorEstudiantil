export type User = {
  idUsuario:number|null;
  nombres:string;
  apellidos:string;
  correo:string;
  rol:string;
  idioma:string;
  perfilAccesibilidad:string;
}

export type GuardarUsuarioRequest = {
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  rol: string;
  activo: boolean;
  perfilAccesibilidad: string;
  idioma: string;
};

export type ActualizarUsuarioRequest = {
  nombres: string;
  apellidos: string;
  rol: string;
  activo: boolean;
  perfilAccesibilidad: string;
  idioma: string;
};

