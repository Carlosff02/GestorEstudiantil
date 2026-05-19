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

  saveCourse() {

  if (!this.courseForm().valid()) return;

  const currentCourse = this.courseModel();

  // NUEVO CURSO
  if (!currentCourse.id || currentCourse.id === 0) {

    const newId = this.courseService.courses().length + 1;

    const newCourse: Course = {
      ...currentCourse,
      id: newId
    };

    // Actualiza el model activo
    this.courseModel.set(newCourse);

    // Agrega el nuevo curso
    this.courseService.courses.update(courses => [
      ...courses,
      newCourse
    ]);

  } else {

    // ACTUALIZAR CURSO EXISTENTE
    this.courseService.courses.update(courses =>
      courses.map(course =>
        course.id === currentCourse.id
          ? currentCourse
          : course
      )
    );

  }

  // Cierra editor
  this.courseEditing.set(false);

  // Limpia formulario/model
  this.courseModel.set(structuredClone(this.newCourseModel()));
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
editCourse(course:Course){
  this.courseEditing.set(true);
  this.courseModel.set(course)
}
closeCourseModal(){
  this.courseEditing.set(false);
  this.courseModel.set(structuredClone(this.newCourseModel()));
}
deleteCourse(courseId: number) {
  const confirm = window.confirm("Está seguro que desea eliminar el curso?")
  if(!confirm){
    return;
  }

  // Elimina el curso del array global
  this.courseService.courses.update(courses =>
    courses.filter(course => course.id !== courseId)
  );

  // Si el curso eliminado era el activo
  if (this.activeCourse()?.id === courseId) {
    this.activeCourse.set(null);
    this.activeSession.set(null);
  }
  this.closeCourseModal()

}
downloadNoteAsFile() {

  const session = this.activeSession();

  if (!session) return;

  const content = session.notes || '';

  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;

  // Nombre del archivo
  const safeName = session.name
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();

  a.download = `${safeName || 'apuntes'}.txt`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}
copyNoteToClipboard() {

  const session = this.activeSession();

  if (!session || !session.notes) return;

  navigator.clipboard.writeText(session.notes);

  console.log('Apuntes copiados');
}
deleteSession(sessionId: number) {
  const confirm = window.confirm('Esta seguro que desea eliminar la sesion?')
  if(!confirm){
    return;
  }

  const activeCourse = this.activeCourse();

  if (!activeCourse) return;

  // Filtra las sesiones
  const updatedSessions = activeCourse.sessions.filter(
    session => session.id !== sessionId
  );

  // Curso actualizado
  const updatedCourse: Course = {
    ...activeCourse,
    sessions: updatedSessions
  };

  // Actualiza curso activo
  this.activeCourse.set(updatedCourse);

  // Actualiza array global
  this.courseService.courses.update(courses =>
    courses.map(course =>
      course.id === updatedCourse.id
        ? updatedCourse
        : course
    )
  );

  console.log(this.activeSession()?.id)
  console.log(sessionId)
  console.log(this.activeSession()?.id === sessionId)
  // Si la sesión eliminada era la activa
  if (this.activeSession()?.id === sessionId) {
    setTimeout(()=>{

    this.activeSession.set(null);
    },150)
    console.log(this.activeSession())
  }

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
