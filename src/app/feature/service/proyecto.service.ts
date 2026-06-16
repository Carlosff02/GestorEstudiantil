// proyecto.service.ts
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../environment/environmet';
import { HttpClient, httpResource } from '@angular/common/http';

import { Signal } from '@angular/core';
import { GuardarProyectoRequest, ProyectoResponse } from '../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {

  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = `${apiUrl}/proyectos`

  guardarProyecto(request: GuardarProyectoRequest) {
    return this.httpClient.post<ProyectoResponse>(this.apiUrl, request);
  }

  obtenerPorCurso(cursoId: Signal<number>) {
    return httpResource<ProyectoResponse[]>(() => ({
      url: `${this.apiUrl}/curso/${cursoId()}`,
      method: 'GET'
    }));
  }

  obtenerPorUsuarioId(usuarioId: Signal<number>) {
    return httpResource<ProyectoResponse[]>(() => ({
      url: `${this.apiUrl}/usuario/${usuarioId()}`,
      method: 'GET'
    }));
  }

  obtenerPorId(proyectoId: Signal<number>) {
    return httpResource<ProyectoResponse>(() => ({
      url: `${this.apiUrl}/${proyectoId()}`,
      method: 'GET'
    }));
  }

  actualizarProyecto(id: number, request: GuardarProyectoRequest) {
    return this.httpClient.put<ProyectoResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminarProyecto(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
