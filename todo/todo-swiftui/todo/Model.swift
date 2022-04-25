//
//  Model.swift
//  todo
//
//  Created by Wenqi He on 6/19/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import Foundation
import SwiftUI
import Combine

enum TodoItemPriority {
  case high
  case normal
  case low
}

struct TodoItem {
  var id: Int
  var title: String
  var details: String
  var priority: TodoItemPriority
  var done: Bool
  var deadline: Date
  
  static var lastId = 0
  
  private init(id: Int, title: String, details: String, priority: TodoItemPriority, done: Bool, deadline: Date) {
    self.id = id
    self.title = title
    self.details = details
    self.priority = priority
    self.done = done
    self.deadline = deadline
  }
  
  init(title: String = "Some title", details: String = "Some title",
    priority: TodoItemPriority  = TodoItemPriority.normal) {
    TodoItem.lastId += 1
    self.init(id: TodoItem.lastId, title: title, details: details, priority: priority, done: false, deadline: Date(timeIntervalSince1970: 0))
  }
}

class TodoData: BindableObject {
  let didChange = PassthroughSubject<TodoData, Never>()
  
  var items: [TodoItem] = [TodoItem()] {
    didSet {
      didChange.send(self)
    }
  }
}
