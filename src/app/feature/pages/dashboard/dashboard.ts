import { Component, inject } from '@angular/core';
import { CoursesService } from '../../service/courses.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly courseService = inject(CoursesService);

  courses$ = this.courseService.courses

}
