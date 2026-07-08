import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './feature/service/auth.service';
import { PreferenciasService } from './core/service/preferencias.service';
import { A11ySidebar } from './feature/components/a11y-sidebar/a11y-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, A11ySidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = inject(PreferenciasService);
  private readonly authService = inject(AuthService);
  private readonly prefs = inject(PreferenciasService);

  user = this.authService.userSignal;
  a11yClass = this.prefs.a11yClass;
  idioma = this.prefs.idioma;
}
