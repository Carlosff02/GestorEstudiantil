import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule, Edit3, type LucideIconData } from 'lucide-angular';
import { CoursesService } from '../../service/courses.service';
import {  Curso, Sesion } from '../../types/course.type';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { PreferenciasService } from '../../../core/service/preferencias.service';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    titulo:          'Horario Semanal',
    subtitulo:       'Gestiona tus clases. Haz clic en una sesión actual para marcar asistencia.',
    hora:            'Hora',
    lun:             'Lun',
    mar:             'Mar',
    mie:             'Mié',
    jue:             'Jue',
    vie:             'Vie',
    sab:             'Sáb',
    dom:             'Dom',
    sinSesiones:     'Sin sesiones programadas',
  },
  en: {
    titulo:          'Weekly Schedule',
    subtitulo:       'Manage your classes. Click on a current session to mark attendance.',
    hora:            'Time',
    lun:             'Mon',
    mar:             'Tue',
    mie:             'Wed',
    jue:             'Thu',
    vie:             'Fri',
    sab:             'Sat',
    dom:             'Sun',
    sinSesiones:     'No sessions scheduled',
  },
  pt: {
    titulo:          'Horário Semanal',
    subtitulo:       'Gerencie suas aulas. Clique em uma sessão atual para marcar presença.',
    hora:            'Hora',
    lun:             'Seg',
    mar:             'Ter',
    mie:             'Qua',
    jue:             'Qui',
    vie:             'Sex',
    sab:             'Sáb',
    dom:             'Dom',
    sinSesiones:     'Nenhuma sessão programada',
  },
  fr: {
    titulo:          'Emploi du Temps',
    subtitulo:       'Gérez vos cours. Cliquez sur une session en cours pour marquer la présence.',
    hora:            'Heure',
    lun:             'Lun',
    mar:             'Mar',
    mie:             'Mer',
    jue:             'Jeu',
    vie:             'Ven',
    sab:             'Sam',
    dom:             'Dim',
    sinSesiones:     'Aucune session programmée',
  },
};

@Component({
  selector: 'app-schedule',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  private readonly courseService = inject(CoursesService);
  private readonly authService = inject(AuthService);

  user = this.authService.userSignal;

  private readonly prefs = inject(PreferenciasService);

  private idioma = computed<Idioma>(() => {
    // Primero usar el idioma de visualización
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    // Fallback al idioma de la cuenta
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t         = computed(() => I18N[this.idioma()]);
  a11yClass = this.prefs.a11yClass;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ? currentUser.idUsuario : 0) : 0;
  });

  courses = this.courseService.obtenerCursosPorUsuario(this.userIdComputed);

  readonly Edit3Icon: LucideIconData = Edit3;

  readonly scheduleHours: string[] = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  getColorClasses(color: string): string {
    return 'bg-opacity-10 border-l-4 text-slate-700 hover:brightness-95';
  }

  getSessionBorderColor(color: string): string {
    return color;
  }

  getSessionBgColor(color: string): string {
    return color + '20';
  }

  private parseDatetime(datetime: string): { hour: string; day: number } {
    if (!datetime) return { hour: '', day: -1 };
    const [datePart, timePart] = datetime.split('T');
    const hour = timePart?.substring(0, 5) ?? '';
    const [year, month, dayNum] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, dayNum);
    const jsDay = date.getDay();
    const day = jsDay === 0 ? 6 : jsDay - 1;
    return { hour, day };
  }

  private getHourOnly(datetime: string): string {
    if (!datetime) return '';
    return datetime.split('T')[1]?.substring(0, 2) ?? '';
  }

  getHourFromDatetime(datetime: string): string {
    if (!datetime) return '';
    return datetime.split('T')[1]?.substring(0, 5) ?? '';
  }

  getSessionsForSlot(course: Curso, hour: string): Sesion[] {
    const slotHour = hour.substring(0, 2);
    return course.sesiones.filter(s => this.getHourOnly(s.horaInicio) === slotHour);
  }

  getSessionLeftPosition(session: Sesion): number {
    const { day } = this.parseDatetime(session.horaInicio);
    return day * 14.28;
  }

  openSpecificNote(courseId: number, sessionId: number): void {
  }
}
