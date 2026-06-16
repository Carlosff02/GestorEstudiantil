import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { apiUrl } from '../../environment/environmet';
import { GuardarSesionRequest, Sesion, ActualizarSesionRequest } from '../types/course.type';


@Injectable({
  providedIn: 'root',
})
export class SessionsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${apiUrl}/sesiones`;

  guardarSesion(request: GuardarSesionRequest) {
    return this.httpClient.post<Sesion>(
      this.apiUrl,
      request
    );
  }

  obtenerSesionesPorCurso(cursoId: Signal<number>) {
    return httpResource<Sesion[]>(() => ({
      url: `${this.apiUrl}/${cursoId()}`,
      method: 'GET'
    }));
  }

  actualizarSesion(request: ActualizarSesionRequest) {
    return this.httpClient.put<Sesion>(
      this.apiUrl,
      request
    );
  }

  eliminarSesion(id: number) {
    return this.httpClient.delete(
      `${this.apiUrl}/${id}`
    );
  }

}
