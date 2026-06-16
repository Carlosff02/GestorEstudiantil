import { effect, inject, Injectable, OnInit, Signal, signal } from '@angular/core';

import { apiUrl } from '../../environment/environmet';
import { HttpClient, httpResource } from '@angular/common/http';
import { ActualizarCursoRequest, Curso, GuardarCursoRequest } from '../types/course.type';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {

  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = `${apiUrl}/cursos`


  guardarCurso(request:GuardarCursoRequest){
    return this.httpClient.post(this.apiUrl, request);
  }

  // Recibe una función que retorna el id (por ejemplo: () => this.userId())
  obtenerCursosPorUsuario(usuarioId: Signal<number>) {
  return httpResource<Curso[]>(() => ({
    url: `${this.apiUrl}/${usuarioId()}`,
    method: 'GET'
  }));
}
  actualizarCurso(request:ActualizarCursoRequest){
    return this.httpClient.put(this.apiUrl, request);
  }

  eliminarCurso(id:number){
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }

}
