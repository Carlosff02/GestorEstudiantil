import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number; // ms, 0 = permanent
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface ConfirmDialog {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  type: 'danger' | 'info' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);
  readonly confirmDialog = signal<ConfirmDialog | null>(null);

  /** Muestra un toast de éxito */
  success(title: string, message: string, duration = 4000): void {
    this.addToast({ type: 'success', title, message, duration });
  }

  /** Muestra un toast de error */
  error(title: string, message: string, duration = 6000): void {
    this.addToast({ type: 'error', title, message, duration });
  }

  /** Muestra un toast informativo */
  info(title: string, message: string, duration = 3500): void {
    this.addToast({ type: 'info', title, message, duration });
  }

  /** Muestra un toast de advertencia */
  warning(title: string, message: string, duration = 5000): void {
    this.addToast({ type: 'warning', title, message, duration });
  }

  /** Muestra un diálogo de confirmación modal */
  confirm(config: ConfirmDialog): void {
    this.confirmDialog.set(config);
  }

  /** Cierra el diálogo de confirmación */
  closeConfirm(): void {
    this.confirmDialog.set(null);
  }

  /** Remueve un toast por ID */
  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private addToast(toast: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { ...toast, id }]);

    // Auto-dismiss si tiene duración
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
  }
}
