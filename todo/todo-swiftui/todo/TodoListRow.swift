//
//  TodoListRow.swift
//  todo
//
//  Created by Wenqi He on 6/19/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import SwiftUI

struct TodoListRow : View {
  var item: TodoItem
  @State var willToggle = false
  @State var willDelete = false
  @EnvironmentObject var todoData: TodoData
  @GestureState var horizontalOffset: CGFloat = 0
  
  var index: Int {
    todoData.items.firstIndex(where: { $0.id == item.id })!
  }
  var body: some View {
    let dragGesture = DragGesture()
      .updating($horizontalOffset) { (currentValue, gestureState, _) in
        gestureState = currentValue.translation.width
      }
      .onChanged({ (currentValue) in
        // Mark/unmark as completed when swiping to the right
        self.willToggle = currentValue.translation.width > 100
        // Delete item when swiping to the left
        self.willDelete = currentValue.translation.width < -100
      })
      .onEnded { (_) in
        if self.willDelete {
          print("will delete")
          self.todoData.items.remove(at: self.index)
          return
        }
        if self.willToggle {
          self.todoData.items[self.index].done.toggle()
        }
        self.willToggle = false
        self.willDelete = false
    }
    
    return NavigationButton(destination: TodoItemDetail(item: item)) {
      ZStack(alignment: .leading) {
        // IMPORTANT: Add white background to capture drag gesture
        // NOTE: It seems that gesture responders must be visible on screen.
        // For example, this solution stops working when opacity is set to 0.
        GeometryReader { geometry in
          Path { path in
            path.addRect(geometry.frame(in: .local))
          }
          .fill(Color.white)
          .opacity(0.01)
//          .border(Color.black) // For debugging
        }
        
        VStack(alignment: .leading) {
          Text(self.item.title)
            .strikethrough(self.item.done)
            .bold()
          Spacer()
          Text(self.item.details)
            .strikethrough(self.item.done)
            .color(Color.gray)
            .fontWeight(.light)
        }
      }
    }
    .offset(CGSize(width: self.horizontalOffset, height: 0))
    .gesture(dragGesture)
  }
}

#if DEBUG
struct TodoListRow_Previews : PreviewProvider {
    static var previews: some View {
      TodoListRow(item: TodoItem())
    }
}
#endif
