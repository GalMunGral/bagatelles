import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TodosService } from '../todos.service';
import { TodoItem } from '../types';
import { Observable } from 'rxjs';
// import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  item$: Observable<TodoItem>
  test: number = 1;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodosService,
    // private routerExtensions: RouterExtensions
  ) {
    route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        let id = +paramMap.get('id');
        console.log(id);
        this.item$ = this.todoService.getItem(id);
      }
    )
  }

  ngOnInit() {
  }

  /**
   * For NativeScript only
   */
  goBack() {
    // this.routerExtensions.backToPreviousPage();
  }

}
