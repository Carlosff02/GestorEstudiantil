import { Component, inject } from '@angular/core';
import { CoursesService } from '../../service/courses.service';
import { RouterLink } from '@angular/router';
import {
  Check,
  FileText,
  Library,
  Clock,
  CalendarDays,
  History,
  LucideAngularModule,
  type LucideIconData,
  InfoIcon,
  ListIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly CheckIcon: LucideIconData = Check;
readonly FileTextIcon: LucideIconData = FileText;
readonly LibraryIcon: LucideIconData = Library;
readonly ClockIcon: LucideIconData = Clock;
readonly CalendarDaysIcon: LucideIconData = CalendarDays;
readonly HistoryIcon: LucideIconData = History;
readonly InfoIcon = InfoIcon;
readonly ListIcon = ListIcon;
  private readonly courseService = inject(CoursesService);

  courses$ = this.courseService.courses

  getTodaySessions() {

  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  return this.courses$()
    .flatMap(course =>

      course.sessions
        .filter(session => {

          if (!session.startDate) return false;

          const sessionDate = new Date(session.startDate);

          return (
            sessionDate.getFullYear() === todayYear &&
            sessionDate.getMonth() === todayMonth &&
            sessionDate.getDate() === todayDay
          );

        })
        .map(session => ({
          course,
          session
        }))

    );

}
formatDate(dateString: string): string {

  if (!dateString) return 'Sin fecha';

  const date = new Date(dateString);

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} de ${month}`;
}
formatTime(dateString: string): string {

  if (!dateString) return '';

  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

getDayShort(dateString: string): string {

  if (!dateString) return '';

  const date = new Date(dateString);

  const days = [
    'DOM',
    'LUN',
    'MAR',
    'MIE',
    'JUE',
    'VIE',
    'SAB'
  ];

  return days[date.getDay()];
}
}
