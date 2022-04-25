//
//  TodoItemView.swift
//  todo
//
//  Created by Wenqi He on 6/19/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import SwiftUI

struct TodoItemDetail : View {
  @Environment(\.editMode) var mode
  @EnvironmentObject var todoData: TodoData
  var item: TodoItem
  
  var index: Int {
    return todoData.items.firstIndex(where: { $0.id == item.id })!
  }
  
  // Helper method: Embedding TextField in horizontal ScrollView
  func Scrollable<T: View>(_ childBuilder: () -> T) -> some View {
    return ScrollView(
      isScrollEnabled: true,
      alwaysBounceHorizontal: true,
      alwaysBounceVertical: false, // IMPORTANT
      showsHorizontalIndicator: false,
      showsVerticalIndicator: false
    ) {
      childBuilder()
    }
  }
  
  var body: some View {
    if !todoData.items.contains(where: { $0.id == item.id}) {
      todoData.items.append(item)
    }
    
    return List {
      HStack {
        Text("Title").bold()
        Divider()
        Scrollable {
          TextField($todoData.items[index].title, placeholder: nil)
        }
      }
      .padding(EdgeInsets(top: 5.0, leading: 0, bottom: 5.0, trailing: 0))
     
      HStack {
        Text("Details").bold()
        Divider()
        Scrollable {
          TextField($todoData.items[index].details, placeholder: nil)
        }
      }
      .padding(EdgeInsets(top: 5.0, leading: 0, bottom: 5.0, trailing: 0))
      
      Toggle(isOn: $todoData.items[index].done) {
        Text("Completed").bold()
      }
    }
    .navigationBarTitle(Text(todoData.items[index].title))
  }
}

#if DEBUG
struct TodoItemView_Previews : PreviewProvider {
  static var previews: some View {
    return TodoItemDetail(item: TodoItem())
  }
}
#endif
