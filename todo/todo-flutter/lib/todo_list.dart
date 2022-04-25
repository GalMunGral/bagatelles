import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:todo/todo_item_form.dart';
import 'model.dart';

class TodoList extends StatefulWidget {
  @override
  TodoListState createState() => TodoListState();
}

class TodoListState extends State<TodoList> {
  @override
  Widget build(BuildContext context) {
    final todoItems = InheritedEnvironment.of(context).todoItems;

    return Scaffold(
      appBar: AppBar(title: Text('Test')),
      body: ListView.builder(
        padding: EdgeInsets.only(top: 5),
        itemBuilder: (context, i) {
          if (i < todoItems.length) {
            /// Widget for each row
            var env = InheritedEnvironment.of(context);
            var item = env.todoItems[i];
            
            Widget checkbox = Padding(
              padding: EdgeInsets.only(right: 10),
              child: Checkbox(
                value: item.done,
                onChanged: (value) {
                  var env = InheritedEnvironment.of(context);
                  env.updateItem(() {
                    item.done = value;
                  });
                },
              )
            );
            
            var listTile = ListTile(
              title: Row(
                children: <Widget>[
                  checkbox,
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        todoItems[i].title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          decoration: item.done 
                            ? TextDecoration.lineThrough
                            : TextDecoration.none
                        )
                      ),
                      Text(
                        todoItems[i].details.replaceAll('\n', ' '),
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                          decoration: item.done 
                            ? TextDecoration.lineThrough
                            : TextDecoration.none
                        )
                      )
                    ]
                  )
                ]
              ),
              onTap: () {
                Navigator.push(context, CupertinoPageRoute(
                  builder: (context) => TodoItemForm(item: item)
                ));
              }
            );

            return Dismissible(
              key: ObjectKey(item),
              onDismissed: (direction) {
                env.deleteItem(item);
                print(env.todoItems.length);
              },
              child: Column(
                children: <Widget>[
                  listTile,
                  Divider()
                ]
              )
            );
          } 
          return null;
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          Navigator.pushNamed(context, '/edit');
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}