import 'package:flutter/material.dart';
import 'model.dart';
import 'todo_list.dart';
import 'todo_item_form.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Environment(
      child: MaterialApp(
        initialRoute: '/', // It seems like route '/' is always pushed first?
        routes: {
          '/': (context) => TodoList(),
          '/edit': (context) => TodoItemForm(item: null),
        },
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
      )
    );
  }
}
