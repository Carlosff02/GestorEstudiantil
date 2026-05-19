import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Layers,
  X,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Briefcase,
  FolderOpen,
  Play,
  LucideAngularModule,
  type LucideIconData,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly LayersIcon: LucideIconData = Layers;
readonly XIcon: LucideIconData = X;
readonly ChevronDownIcon: LucideIconData = ChevronDown;
readonly LayoutDashboardIcon: LucideIconData = LayoutDashboard;
readonly BookOpenIcon: LucideIconData = BookOpen;
readonly CalendarIcon: LucideIconData = Calendar;
readonly BriefcaseIcon: LucideIconData = Briefcase;
readonly FolderOpenIcon: LucideIconData = FolderOpen;
readonly PlayIcon: LucideIconData = Play;
}
