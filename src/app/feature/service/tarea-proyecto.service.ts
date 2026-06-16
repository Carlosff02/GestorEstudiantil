// tarea-proyecto.service.ts
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../environment/environmet';
import { HttpClient, httpResource } from '@angular/common/http';

import { Signal } from '@angular/core';
import { GuardarTareaProyectoRequest, TareaProyectoResponse, ActualizarTareaProyectoRequest } from '../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class TareaProyectoService {

  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = `${apiUrl}/tareas`

  guardarTarea(request: GuardarTareaProyectoRequest) {
    return this.httpClient.post<TareaProyectoResponse>(this.apiUrl, request);
  }

  obtenerPorProyecto(proyectoId: Signal<number>) {
    return httpResource<TareaProyectoResponse[]>(() => ({
      url: `${this.apiUrl}/${proyectoId()}`,
      method: 'GET'
    }));
  }

  actualizarTarea(request: ActualizarTareaProyectoRequest) {
    return this.httpClient.put<TareaProyectoResponse>(this.apiUrl, request);
  }

  eliminarTarea(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }
}
