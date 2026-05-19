export type Course = {
  id:number;
  name:string;
  teacher:string;
  description:string;
  color:string;
  sessions:Session[];
}
export type Session = {
  id:number;
  name:string;
  startDate:string;
  endDate:string;
  classRoom:string;
  notes:string;
  courseId:number;
}
