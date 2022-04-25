import 'package:flutter/material.dart';

enum Priority {
  high,
  normal,
  low,
}

class TodoItem {
  String title;
  String details;
  Priority priority;
  DateTime deadline;
  bool done = false;

  TodoItem({
    this.title = '',
    this.details = '',
    this.priority = Priority.normal,
    deadline 
  }) {
    if (deadline == null) {
      this.deadline = DateTime.now().add(Duration(days: 1));
    } else {
      this.deadline = deadline;
    }
  }
}

class Environment extends StatefulWidget {
  final Widget child;

  Environment({ @required this.child});

  @override
  State<StatefulWidget> createState() => EnvironmentState();
}

class EnvironmentState extends State<Environment> {
  final List<TodoItem> todoItems = [
    TodoItem(
      title: 'Example Task', 
      details: 'Here is some description'
    ),
  ];

  void updateItem(VoidCallback updater) {
    this.setState(() {
      updater();
    });
  }

  void createItem({
    String title,
    String details,
    Priority priority,
    DateTime deadline,
  }) {
    var item =  TodoItem(
      title: title,
      details: details,
      priority: priority,
      deadline: deadline,
    );
    this.setState(() {
      this.todoItems.add(item);
    });
  }

  void deleteItem(item) {
    this.setState(() {
      todoItems.remove(item);
    });
  }
  @override
  Widget build(BuildContext context) {
    return InheritedEnvironment(parent: this, child: widget.child);
  }
}

class InheritedEnvironment extends InheritedWidget {
  final EnvironmentState parent;

  InheritedEnvironment({
    @required Widget child,
    @required this.parent
  }): super(child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) {
    return true;
  }

  static EnvironmentState of(BuildContext context) {
    return (context.inheritFromWidgetOfExactType(InheritedEnvironment) as InheritedEnvironment).parent;
  }
}