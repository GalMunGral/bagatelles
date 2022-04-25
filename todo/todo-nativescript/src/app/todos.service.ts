import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TodoItem } from './types';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  items: TodoItem[] = [
    {
      title: 'Laundry',
      details: 'Do laundry this evening'
    },
    {
      title: 'Grocery Shopping',
      details: 'Buy some beef and eggs'
    }
  ]

  getItems(): Observable<TodoItem[]> {
    let subject = new Subject<TodoItem[]>();
    setTimeout(() => {
      subject.next(this.items);
    }, 0);
    return subject;
  }

  getItem(i: number): Observable<TodoItem> {
    let subject = new Subject<TodoItem>();
    setTimeout(() => {
      subject.next(this.items[i]);
    }, 1000);
    return subject;
  }
}
