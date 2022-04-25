import { Component, OnInit } from '@angular/core';
import { TodosService } from '../todos.service';
import { TodoItem } from '../types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  todos: TodoItem[] = [];

  constructor(private todoService: TodosService) { }

  ngOnInit() {
    console.log('init');
    this.todoService.getItems().subscribe((data: TodoItem[]) => {
      this.todos = data;
    })
  }

  showDetail(i: number): void {
    console.log(`Showing details for the ${i}-th item`);
  }
}
