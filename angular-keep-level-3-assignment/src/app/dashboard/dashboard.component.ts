import { Component } from '@angular/core';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent
{

  constructor(private notesService: NotesService)
  {
    this.notesService.fetchNotesFromServer();
  }
}
