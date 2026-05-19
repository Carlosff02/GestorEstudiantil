import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Sidebar, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
