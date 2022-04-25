//
//  ContentView.swift
//  todo
//
//  Created by Wenqi He on 6/19/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import SwiftUI

struct ContentView : View {
    var body: some View {
      NavigationView {
        TodoList()
      }
    }
}

#if DEBUG
struct ContentView_Previews : PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
#endif
