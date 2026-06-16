// proyecto-miembro.service.ts
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../environment/environmet';
import { HttpClient, httpResource } from '@angular/common/http';
import { Signal } from '@angular/core';
import { GuardarProyectoMiembroRequest, ProyectoInvitacionResponse, ProyectoMiembroResponse, ProyectoResponse } from '../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class ProyectoMiembroService {

  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = `${apiUrl}/proyecto-miembros`

  guardarMiembro(request: GuardarProyectoMiembroRequest) {
    return this.httpClient.post<ProyectoMiembroResponse>(this.apiUrl, request);
  }
  aceptarr(request: {idProyecto:number, idUsuario:number}) {
    return this.httpClient.get(`${this.apiUrl}/aceptar/${request.idProyecto}/${request.idUsuario}`);
  }

  obtenerInvitaciones(usuarioId: Signal<number>) {
    return httpResource<ProyectoInvitacionResponse[]>(() => ({
      url: `${this.apiUrl}/invitaciones/${usuarioId()}`,
      method: 'GET'
    }));
  }

  obtenerPorProyecto(proyectoId: Signal<number>) {
    return httpResource<ProyectoMiembroResponse[]>(() => ({
      url: `${this.apiUrl}/${proyectoId()}`,
      method: 'GET'
    }));
  }

  eliminarMiembro(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
