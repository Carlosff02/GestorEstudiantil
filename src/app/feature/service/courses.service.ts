import { effect, Injectable, OnInit, signal } from '@angular/core';
import { Course } from '../types/course.type';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
 private readonly STORAGE_KEY = 'courses';

  courses = signal<Course[]>(this.loadCourses());

  constructor() {

    // Guarda automáticamente cuando cambie el signal
    effect(() => {
      const data = this.courses();
      console.log(data)
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(data)
      );
    });


  }


  private loadCourses(): Course[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}
