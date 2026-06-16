import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { LoginRequest, LoginResponse, RegisterRequest } from "../types/login-request.type";
import { apiUrl } from "../../environment/environmet";
import { map } from "rxjs";
import { User } from "../types/user.type";
import { Router } from "@angular/router";
import { LOCAL_STORAGE } from "../../core/provider/local-storage";

export const ACCESS_TOKEN_KEY = 'access-token';
export const REFRESH_TOKEN_KEY = 'refresh-token';
export const LOGIN_REQUEST_KEY = 'login-request';
export const GOOGLE_ACCESS_TOKEN_KEY = 'google-token';
export const USER_KEY  = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient)
  private readonly apiUrl = `${apiUrl}/auth`
  private readonly storageService = inject(LOCAL_STORAGE);
  private readonly router = inject(Router);

  readonly recoverSessionSignal = signal<LoginRequest | undefined>(
    (() => {
      const raw = this.storageService?.getItem(LOGIN_REQUEST_KEY);
      return raw ? JSON.parse(raw) : undefined;
    })()
  );

  readonly userSignal = signal<User | undefined>(
    (() => {
      const raw = this.storageService?.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : undefined;
    })()
  );

  readonly authTokens = signal<{accessToken?: string}>({
    accessToken: this.storageService?.getItem(ACCESS_TOKEN_KEY) ?? undefined
  });

  login(request:LoginRequest){
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, request)
    .pipe(
            map((response:LoginResponse) => {
              const user:User = {
                idUsuario: response.id,
                rol:response.role,
                correo:request.correo,
                nombres:response.nombres,
                apellidos: response.apellidos,
                idioma:response.idioma,
                perfilAccesibilidad:response.perfilAccesibilidad
              }
              this.saveUser(user)
              this.saveTokens({accesToken: response.token});


              return response;
            })
          )
  }

 register(request: RegisterRequest) {
  // Nota que pasamos 'request' directamente, no '{ request }'
  return this.httpClient.post<LoginResponse>(`${this.apiUrl}/register`, request)
    .pipe(
      map((response: LoginResponse) => {
        const user: User = {
          idUsuario: response.id,
          rol: response.role,
          correo: request.correo,
          nombres: response.nombres,
          apellidos: response.apellidos,
          idioma:response.idioma,
          perfilAccesibilidad:response.perfilAccesibilidad
        };
        this.saveUser(user);
        this.saveTokens({ accesToken: response.token });

        return response;
      })
    );
}

   public logOut(){
      this.removeUser();
      this.removeTokens();
      this.router.navigate(['']);
    }

   onLogout() {
    const login = this.recoverSession();
      this.removeUser();
      this.removeTokens();
    // 1️⃣ Marcar logout ANTES de todo
    this.authTokens.set({accessToken:''});
    localStorage.clear();
    sessionStorage.clear();

    // 3️⃣ Recién ahora navegas
    this.router.navigate(['/']).then(() => {
      if (login) {
        this.saveSession(login);
      }
    });
  }

    saveTokens(data: { accesToken:string}){
      this.storageService?.setItem(ACCESS_TOKEN_KEY, data.accesToken);
      this.authTokens.set({
        accessToken: data.accesToken
      });
    }
    saveUser(user:User){
      this.storageService?.setItem(USER_KEY, JSON.stringify(user));
      this.userSignal.set(user);

    }

    private removeUser(){
      this.storageService?.removeItem(USER_KEY)
      this.userSignal.set(undefined);
    }

    private removeTokens(){
      this.storageService?.removeItem(ACCESS_TOKEN_KEY);
      this.storageService?.removeItem(REFRESH_TOKEN_KEY);
      this.authTokens.set({});
    }
    recoverSession():LoginRequest | null{
        const session = localStorage.getItem(LOGIN_REQUEST_KEY);
        if(session){
          return JSON.parse(session);
        }
        return  null;
      }
    saveSession(data:LoginRequest){

        localStorage.setItem(LOGIN_REQUEST_KEY, JSON.stringify(data));
        this.recoverSessionSignal.set(data);
      }
}
