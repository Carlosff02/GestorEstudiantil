import { Routes } from '@angular/router';
import { Home } from './feature/pages/home/home';
import { Dashboard } from './feature/pages/dashboard/dashboard';
import { Courses } from './feature/pages/courses/courses';
import { Schedule } from './feature/pages/schedule/schedule';
import { Projects } from './feature/pages/projects/projects';
import { Login } from './feature/pages/login/login';
import { Profile } from './feature/pages/profile/profile';

export const routes: Routes = [{
  path: '', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:Login},
  {path:'home', component:Home, children:[
    {path:'dashboard', component:Dashboard},
    {path:'courses', component:Courses},
    {path:'schedule', component:Schedule},
    {path:'projects', component:Projects},
    {path:'profile', component:Profile}
  ]}
];
