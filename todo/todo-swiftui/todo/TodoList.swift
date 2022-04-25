//
//  TodoListView.swift
//  todo
//
//  Created by Wenqi He on 6/19/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import SwiftUI

struct TodoList : View {
  @EnvironmentObject var todoData: TodoData
  
  var body: some View {
    List {
      NavigationButton(destination: TodoItemDetail(item: TodoItem()), label: {
        Text("Create New").color(Color.accentColor)
      })
      ForEach(todoData.items.reversed().identified(by: \.id)) { item in
        TodoListRow(item: item)
          .padding(EdgeInsets(top: 10, leading: 20, bottom: 10, trailing: 0))
        }
        .navigationBarTitle(Text("To-do List"))
    }
  }
}

#if DEBUG
struct TodoListView_Previews : PreviewProvider {
  static var previews: some View {
    TodoList().environmentObject(TodoData())
  }
}
#endif
