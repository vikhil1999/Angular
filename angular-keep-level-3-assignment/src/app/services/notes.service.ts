import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Note } from '../note';
import { AuthenticationService } from './authentication.service';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/from';

@Injectable()
export class NotesService
{
  notes: Array<Note>;
  notesSubject: BehaviorSubject<Array<Note>>;

  constructor(private http: HttpClient, private authService: AuthenticationService)
  {
    this.notes = [];
    this.notesSubject = new BehaviorSubject([]);
  }

  fetchNotesFromServer()
  {
    return this.http.get<Array<Note>>('http://localhost:3000/api/v1/notes', {
      headers: new HttpHeaders().set('Authorization', `Bearer ${ this.authService.getBearerToken() }`)
    }).subscribe(notes =>
    {
      this.notes = notes;
      this.notesSubject.next(this.notes);
    }, (err: any) =>
    {
      this.notesSubject.error(err);
    });
  }

  getNotes(): BehaviorSubject<Array<Note>>
  {
    return this.notesSubject;
  }

  addNote(note: Note): Observable<Note>
  {
    return this.http.post<Note>('http://localhost:3000/api/v1/notes', note, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${ this.authService.getBearerToken() }`)
    }).do(addedNote =>
    {
      this.notes.push(addedNote);
      this.notesSubject.next(this.notes);
    });
  }

  editNote(note: Note): Observable<Note>
  {
    return this.http.put<Note>(`http://localhost:3000/api/v1/notes/${ note.id }`, note, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${ this.authService.getBearerToken() }`)
    }).do(editedNote =>
    {
      const existingNote = this.notes.find(noteValue => noteValue.id === editedNote.id);
      Object.assign(existingNote, editedNote);
      this.notesSubject.next(this.notes);
    });
  }

  getNoteById(noteId): Note
  {
    const note = this.notes.find(noteValue => noteValue.id === noteId);
    return Object.assign({}, note);
  }
}
