import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import {
  LucideAngularModule,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  X,
  Trash2,
} from 'lucide-angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Toast Notifications Stack -->
    @if (service.toasts().length > 0) {
    <div aria-live="polite" aria-atomic="false"
         class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none sm:right-4 sm:top-4
                left-4 sm:left-auto"
         role="status">
      @for (toast of service.toasts(); track toast.id) {
      <div role="alert"
           class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border
                  transform transition-all duration-300 animate-slide-in
                  text-sm font-medium w-full
                  backdrop-blur-md
                  sm:max-w-sm"
           [class]="toastClasses(toast.type)">
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          @switch (toast.type) {
            @case ('success') {
              <lucide-angular [img]="CheckCircle" class="w-5 h-5 text-emerald-400"></lucide-angular>
            }
            @case ('error') {
              <lucide-angular [img]="XCircle" class="w-5 h-5 text-rose-400"></lucide-angular>
            }
            @case ('warning') {
              <lucide-angular [img]="AlertTriangle" class="w-5 h-5 text-amber-400"></lucide-angular>
            }
            @case ('info') {
              <lucide-angular [img]="AlertCircle" class="w-5 h-5 text-blue-400"></lucide-angular>
            }
          }
        </div>
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="font-bold text-slate-100 text-sm">{{ toast.title }}</p>
          <p class="text-slate-300 text-xs mt-0.5 break-words">{{ toast.message }}</p>
        </div>
        <!-- Close Button -->
        <button (click)="service.dismiss(toast.id)"
                class="shrink-0 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-700/50
                       focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Cerrar notificación">
          <lucide-angular [img]="X" class="w-4 h-4"></lucide-angular>
        </button>
      </div>
      }
    </div>
    }

    <!-- Confirm Dialog Modal -->
    @if (service.confirmDialog(); as dialog) {
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
         role="dialog"
         aria-modal="true"
         [attr.aria-labelledby]="'confirm-title'">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5
                  animate-scale-in">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
               [class]="dialogIconBg(dialog.type)">
            @switch (dialog.type) {
              @case ('danger') {
                <lucide-angular [img]="Trash2" class="w-6 h-6 text-rose-400"></lucide-angular>
              }
              @case ('warning') {
                <lucide-angular [img]="AlertTriangle" class="w-6 h-6 text-amber-400"></lucide-angular>
              }
              @case ('info') {
                <lucide-angular [img]="AlertCircle" class="w-6 h-6 text-blue-400"></lucide-angular>
              }
            }
          </div>
          <div>
            <h3 id="confirm-title" class="text-lg font-bold text-slate-100">{{ dialog.title }}</h3>
          </div>
        </div>
        <!-- Message -->
        <p class="text-sm text-slate-400 leading-relaxed">{{ dialog.message }}</p>
        <!-- Actions -->
        <div class="flex gap-3 pt-1">
          <button (click)="service.closeConfirm(); dialog.onCancel?.()"
                  class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl
                         transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500
                         min-h-[44px]">
            {{ dialog.cancelLabel }}
          </button>
          <button (click)="dialog.onConfirm(); service.closeConfirm()"
                  class="flex-1 py-3 font-bold text-xs rounded-xl transition-all shadow-lg
                         focus:outline-none focus:ring-2 min-h-[44px]"
                 [class]="dialogConfirmBtn(dialog.type)">
            {{ dialog.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-slide-in,
      .animate-scale-in {
        animation: none;
      }
    }

    @media (max-width: 640px) {
      .fixed.top-4.right-4 {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `],
})
export class ToastContainer {
  readonly service = inject(ToastService);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly AlertCircle = AlertCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;
  readonly Trash2 = Trash2;

  toastClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-emerald-900/90 border-emerald-700';
      case 'error':   return 'bg-rose-900/90 border-rose-700';
      case 'warning': return 'bg-amber-900/90 border-amber-700';
      case 'info':    return 'bg-blue-900/90 border-blue-700';
      default:        return 'bg-slate-800/90 border-slate-600';
    }
  }

  dialogIconBg(type: string): string {
    switch (type) {
      case 'danger':  return 'bg-rose-900/40';
      case 'warning': return 'bg-amber-900/40';
      case 'info':    return 'bg-blue-900/40';
      default:        return 'bg-slate-800';
    }
  }

  dialogConfirmBtn(type: string): string {
    switch (type) {
      case 'danger':  return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'info':    return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      default:        return 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500';
    }
  }
}
