import { Component, effect, inject, signal } from '@angular/core';
import { Course, Session } from '../../types/course.type';
import { form, FormField, required } from '@angular/forms/signals';
import { CoursesService } from '../../service/courses.service';
import {
  PlusCircle,
  Settings,
  User,
  FileText,
  ChevronRight,
  ArrowLeft,
  List,
  Plus,
  Trash2,
  Info,
  Copy,
  Download,
  Save,
  X,
  LucideAngularModule,
  type LucideIconData,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [FormField, LucideAngularModule, FormsModule, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  // Variables en la clase del componente:
readonly PlusCircleIcon: LucideIconData = PlusCircle;
readonly SettingsIcon: LucideIconData = Settings;
readonly UserIcon: LucideIconData = User;
readonly FileTextIcon: LucideIconData = FileText;
readonly ChevronRightIcon: LucideIconData = ChevronRight;
readonly ArrowLeftIcon: LucideIconData = ArrowLeft;
readonly ListIcon: LucideIconData = List;
readonly PlusIcon: LucideIconData = Plus;
readonly Trash2Icon: LucideIconData = Trash2;
readonly InfoIcon: LucideIconData = Info;
readonly CopyIcon: LucideIconData = Copy;
readonly DownloadIcon: LucideIconData = Download;
readonly SaveIcon: LucideIconData = Save;
readonly XIcon: LucideIconData = X;

  private readonly courseService = inject(CoursesService);

  courses = this.courseService.courses;

  courseEditing = signal<boolean>(false);
  activeCourse = signal<Course|null>(null);
  activeSession = signal<Session|null>(null);

   newCourseModel = signal<Course>({
    id:0,
    name:'',
    teacher:'',
    description:'',
    color:'273CF5',
    sessions:[]
  });

  courseModel = signal<Course>({
    id:0,
    name:'',
    teacher:'',
    description:'',
    color:'273CF5',
    sessions:[]
  });

  courseForm = form(this.courseModel, (f)=>{
    required(f.name, {message:'El nombre es requerido'})
  })

  constructor(){

  }

  openCourseModal(course:Course|null){
    this.courseEditing.set(true);
    if(course!=null){
      this.courseModel.set({
        id:course.id,
        name:course.name,
        teacher:course.teacher,
        description:course.description,
        color:course.color,
        sessions:course.sessions
      })
    }
  }

  saveCourse(){
    if(this.courseForm().valid()){
      const id = this.courseService.courses().length+1;
      this.courseForm.id().value.set(id);
      this.courseService.courses.set([
  ...this.courseService.courses(),
  this.courseModel()
]);
      this.courseEditing.set(false);
      this.courseModel.set(this.newCourseModel())
    }
  }
 createNewSession() {

  const activeCourse = this.activeCourse();

  if (!activeCourse) return;

  const nextId = activeCourse.sessions.length + 1;

  const newSession: Session = {
    id: nextId,
    name: `Sesión ${nextId}: Nuevo Tema`,
    startDate: '',
    endDate: '',
    classRoom: '',
    notes: '',
    courseId: activeCourse.id
  };

  // Curso actualizado
  const updatedCourse: Course = {
    ...activeCourse,
    sessions: [
      ...activeCourse.sessions,
      newSession
    ]
  };

  // Actualiza el curso activo
  this.activeCourse.set(updatedCourse);

  // Actualiza el array global
  this.courseService.courses.update(courses =>
    courses.map(course =>
      course.id === updatedCourse.id
        ? updatedCourse
        : course
    )
  );

  console.log(this.courseService.courses());

}
onSessionChange(){
   const session = this.activeSession();
    const activeCourse = this.activeCourse();

    if (!session || !activeCourse || session.name==='') return;

    // Actualiza la sesión dentro del curso
    const updatedCourse: Course = {
      ...activeCourse,
      sessions: activeCourse.sessions.map(s =>
        s.id === session.id
          ? session
          : s
      )
    };

    // Actualiza signal del curso activo
    this.activeCourse.set(updatedCourse);

    // Actualiza lista global de cursos
    this.courseService.courses.update(courses =>
      courses.map(course =>
        course.id === updatedCourse.id
          ? updatedCourse
          : course
      )
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
