import { Component, inject, OnInit, OnDestroy, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferenciasService } from '../../../core/service/preferencias.service';
import { LucideAngularModule, ArrowLeft, Box, Camera, RefreshCw } from 'lucide-angular';
import { computed } from '@angular/core';

type Idioma = 'es' | 'en' | 'pt' | 'fr';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    titulo: 'Visor de Realidad Aumentada',
    instrucciones: 'Apunta la cámara al marcador Hiro (patrón incluido abajo) para ver el modelo 3D.',
    cargando: 'Iniciando cámara...',
    error: 'Error al acceder a la cámara. Asegúrate de usar HTTPS y permitir el acceso.',
    volver: 'Volver',
    modelos: 'Modelos disponibles',
    modeloAtomo: 'Átomo 3D',
    modeloCorazon: 'Corazón 3D',
    modeloSistemaSolar: 'Sistema Solar',
    descargarMarcador: 'Descargar marcador',
    noSoporta: 'Tu navegador no soporta WebAR. Usa Chrome o Safari en un dispositivo móvil.',
  },
  en: {
    titulo: 'Augmented Reality Viewer',
    instrucciones: 'Point your camera at the Hiro marker (pattern included below) to see the 3D model.',
    cargando: 'Starting camera...',
    error: 'Camera access error. Make sure you are using HTTPS and allow camera access.',
    volver: 'Go back',
    modelos: 'Available models',
    modeloAtomo: '3D Atom',
    modeloCorazon: '3D Heart',
    modeloSistemaSolar: 'Solar System',
    descargarMarcador: 'Download marker',
    noSoporta: 'Your browser does not support WebAR. Use Chrome or Safari on a mobile device.',
  },
  pt: {
    titulo: 'Visualizador de Realidade Aumentada',
    instrucciones: 'Aponte a câmera para o marcador Hiro (padrão incluído abaixo) para ver o modelo 3D.',
    cargando: 'Iniciando câmera...',
    error: 'Erro ao acessar a câmera. Certifique-se de usar HTTPS e permitir o acesso.',
    volver: 'Voltar',
    modelos: 'Modelos disponíveis',
    modeloAtomo: 'Átomo 3D',
    modeloCorazon: 'Coração 3D',
    modeloSistemaSolar: 'Sistema Solar',
    descargarMarcador: 'Baixar marcador',
    noSoporta: 'Seu navegador não suporta WebAR. Use Chrome ou Safari em um dispositivo móvel.',
  },
  fr: {
    titulo: 'Visualiseur de Réalité Augmentée',
    instrucciones: 'Pointez la caméra vers le marqueur Hiro (motif inclus ci-dessous) pour voir le modèle 3D.',
    cargando: 'Démarrage de la caméra...',
    error: 'Erreur d\'accès à la caméra. Assurez-vous d\'utiliser HTTPS et d\'autoriser l\'accès.',
    volver: 'Retour',
    modelos: 'Modèles disponibles',
    modeloAtomo: 'Atome 3D',
    modeloCorazon: 'Cœur 3D',
    modeloSistemaSolar: 'Système Solaire',
    descargarMarcador: 'Télécharger le marqueur',
    noSoporta: 'Votre navigateur ne supporte pas WebAR. Utilisez Chrome ou Safari sur un appareil mobile.',
  },
};

@Component({
  selector: 'app-ar-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ar-viewer.html',
  styleUrl: './ar-viewer.css',
})
export class ArViewer implements OnInit, OnDestroy {
  readonly ArrowLeft = ArrowLeft;
  readonly Box = Box;
  readonly Camera = Camera;
  readonly RefreshCw = RefreshCw;

  private readonly prefs = inject(PreferenciasService);

  /** Estado de la cámara */
  cameraStatus = signal<'loading' | 'ready' | 'error'>('loading');
  /** Modelo seleccionado */
  selectedModel = signal<'atomo' | 'corazon' | 'sistema-solar'>('atomo');

  private readonly _idioma = computed<Idioma>(() => {
    const uiIdioma = this.prefs.idioma();
    return uiIdioma in I18N ? uiIdioma : 'es';
  });

  /** Traducciones locales */
  t = computed(() => I18N[this._idioma()]);

  /** Clase de accesibilidad */
  a11yClass = this.prefs.a11yClass;

  ngOnInit(): void {
    // Esperar a que el DOM renderice el a-scene y la cámara esté lista
    // AR.js se encarga de iniciar la cámara automáticamente
    setTimeout(() => {
      this.cameraStatus.set('ready');
    }, 2000);
  }

  ngOnDestroy(): void {
    this.cleanupArScene();
  }

  private cleanupArScene(): void {
    // Remover el canvas de A-Frame si existe
    const canvas = document.querySelector('a-scene canvas');
    if (canvas) {
      canvas.remove();
    }

    // Remover elementos a-scene
    const scenes = document.querySelectorAll('a-scene');
    scenes.forEach(scene => scene.remove());
  }

  selectModel(model: 'atomo' | 'corazon' | 'sistema-solar'): void {
    this.selectedModel.set(model);
  }

  retryCamera(): void {
    this.cameraStatus.set('loading');
    this.cleanupArScene();
    // Forzar recarga de la página para reiniciar AR.js
    window.location.reload();
  }
}
