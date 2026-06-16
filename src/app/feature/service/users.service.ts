import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';

import { apiUrl } from '../../environment/environmet';

import {
  User,
  GuardarUsuarioRequest,
  ActualizarUsuarioRequest
} from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = `${apiUrl}/usuarios`;

  guardarUsuario(request: GuardarUsuarioRequest) {
    return this.httpClient.post<User>(
      this.apiUrl,
      request
    );
  }

  obtenerUsuarios() {
    return httpResource<User[]>(() => ({
      url: this.apiUrl,
      method: 'GET'
    }));
  }

  obtenerUsuarioPorId(idUsuario: Signal<number>) {
    return httpResource<User>(() => ({
      url: `${this.apiUrl}/${idUsuario()}`,
      method: 'GET'
    }));
  }

  actualizarUsuario(
    idUsuario: number,
    request: ActualizarUsuarioRequest
  ) {
    return this.httpClient.put<User>(
      `${this.apiUrl}/${idUsuario}`,
      request
    );
  }

  eliminarUsuario(idUsuario: number) {
    return this.httpClient.delete(
      `${this.apiUrl}/${idUsuario}`
    );
  }

}
