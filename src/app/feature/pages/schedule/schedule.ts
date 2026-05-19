import { Component, inject } from '@angular/core';
import { LucideAngularModule, Edit3, type LucideIconData } from 'lucide-angular';
import { CoursesService } from '../../service/courses.service';
import { Course, Session } from '../../types/course.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  private readonly coursesService = inject(CoursesService);

  courses$ = this.coursesService.courses;

  readonly Edit3Icon: LucideIconData = Edit3;

  readonly scheduleHours: string[] = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Ya no necesitas colorClassMap, usamos el hex directamente
getColorClasses(color: string): string {
  // Si es hex, devolvemos clases genéricas y el color lo ponemos por style
  return 'bg-opacity-10 border-l-4 text-slate-700 hover:brightness-95';
}

getSessionBorderColor(color: string): string {
  return color;
}

getSessionBgColor(color: string): string {
  return color + '20'; // hex con ~12% opacidad
}

  // Parsea "2026-05-19T20:46" sin conversión UTC
  private parseDatetime(datetime: string): { hour: string; day: number } {
    if (!datetime) return { hour: '', day: -1 };
    const [datePart, timePart] = datetime.split('T');
    const hour = timePart?.substring(0, 5) ?? '';
    const [year, month, dayNum] = datePart.split('-').map(Number);
    // Construir con Date.UTC para evitar offset de zona horaria
    const date = new Date(year, month - 1, dayNum);
    // getDay(): 0=Dom,1=Lun,2=Mar,3=Mie,4=Jue,5=Vie,6=Sab
    // Convertimos a 0=Lun,1=Mar,2=Mie,3=Jue,4=Vie,5=Sab,6=Dom
    const jsDay = date.getDay();
    const day = jsDay === 0 ? 6 : jsDay - 1;
    return { hour, day };
  }



 // Extrae solo la hora "HH" de "2026-05-19T20:46" → "20"
private getHourOnly(datetime: string): string {
  if (!datetime) return '';
  return datetime.split('T')[1]?.substring(0, 2) ?? '';
}

getHourFromDatetime(datetime: string): string {
  if (!datetime) return '';
  return datetime.split('T')[1]?.substring(0, 5) ?? '';
}

// Compara solo la hora HH, ignorando minutos
getSessionsForSlot(course: Course, hour: string): Session[] {
  const slotHour = hour.substring(0, 2); // "20:00" → "20"
  return course.sessions.filter(s => this.getHourOnly(s.startDate) === slotHour);
}

  getSessionLeftPosition(session: Session): number {
    const { day } = this.parseDatetime(session.startDate);
    // 7 columnas (Lun-Dom), cada una ocupa ~14.28% del contenedor
    return day * 14.28;
  }

  openSpecificNote(courseId: number, sessionId: number): void {
    // tu lógica de navegación aquí
  }
}
