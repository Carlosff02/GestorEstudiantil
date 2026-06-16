export type LoginRequest = {
  correo:string;
  password:string;
}
export type RegisterRequest = {
  correo:string;
  nombres:string;
  apellidos:string;
  password:string;
  idioma:string;
  perfilAccesibilidad:string;
}
export type LoginResponse = {
  id:number;
  token:string;
  role:string;
  nombres:string;
  apellidos:string;
  idioma:string;
  perfilAccesibilidad:string;
}
