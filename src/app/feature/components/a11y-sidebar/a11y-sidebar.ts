import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Accessibility, X, RotateCcw } from 'lucide-angular';
import { PreferenciasService, IdiomaUI, PerfilAccesibilidad } from '../../../core/service/preferencias.service';

@Component({
  selector: 'app-a11y-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './a11y-sidebar.html',
  styleUrl: './a11y-sidebar.css',
})
export class A11ySidebar {
  protected readonly prefs = inject(PreferenciasService);

  readonly AccessibilityIcon = Accessibility;
  readonly XIcon = X;
  readonly RotateCcwIcon = RotateCcw;

  readonly idiomas: { value: IdiomaUI; labelKey: 'idiomaEs' | 'idiomaEn' | 'idiomaPt' | 'idiomaFr' }[] = [
    { value: 'es', labelKey: 'idiomaEs' },
    { value: 'en', labelKey: 'idiomaEn' },
    { value: 'pt', labelKey: 'idiomaPt' },
    { value: 'fr', labelKey: 'idiomaFr' },
  ];

  readonly perfiles: { value: PerfilAccesibilidad; labelKey: 'perfilNinguno' | 'perfilProtanopia' | 'perfilDeuteranopia' | 'perfilTritanopia' | 'perfilBajaVision' | 'perfilCeguera' }[] = [
    { value: '', labelKey: 'perfilNinguno' },
    { value: 'protanopia', labelKey: 'perfilProtanopia' },
    { value: 'deuteranopia', labelKey: 'perfilDeuteranopia' },
    { value: 'tritanopia', labelKey: 'perfilTritanopia' },
    { value: 'baja_vision', labelKey: 'perfilBajaVision' },
    { value: 'ceguera', labelKey: 'perfilCeguera' },
  ];

  /** Maneja Escape para cerrar el sidebar */
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.prefs.sidebarAbierto()) {
      this.prefs.cerrarSidebar();
    }
  }

  /** Cierra el sidebar al hacer clic fuera */
  @HostListener('window:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.prefs.sidebarAbierto() &&
      !target.closest('.a11y-sidebar') &&
      !target.closest('.a11y-trigger')
    ) {
      this.prefs.cerrarSidebar();
    }
  }

  onIdiomaChange(idioma: string): void {
    this.prefs.cambiarIdioma(idioma as IdiomaUI);
  }

  onPerfilChange(perfil: string): void {
    this.prefs.cambiarPerfil(perfil as PerfilAccesibilidad);
  }

  toggle(): void {
    this.prefs.toggleSidebar();
  }

  cerrar(): void {
    this.prefs.cerrarSidebar();
  }

  restablecer(): void {
    this.prefs.restablecer();
  }

  toggleCursorGrande(): void {
    this.prefs.toggleCursorGrande();
  }
}
