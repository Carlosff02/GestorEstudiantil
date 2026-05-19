import { Routes } from '@angular/router';
import { Home } from './feature/pages/home/home';
import { Dashboard } from './feature/pages/dashboard/dashboard';
import { Courses } from './feature/pages/courses/courses';
import { Schedule } from './feature/pages/schedule/schedule';
import { Projects } from './feature/pages/projects/projects';

export const routes: Routes = [{
  path: '', redirectTo:'home', pathMatch:'full'},
  {path:'home', component:Home, children:[
    {path:'dashboard', component:Dashboard},
    {path:'courses', component:Courses},
    {path:'schedule', component:Schedule},
    {path:'projects', component:Projects}
  ]}
];
