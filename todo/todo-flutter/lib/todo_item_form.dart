import 'package:flutter/material.dart';
import 'model.dart';

class TodoItemForm extends StatefulWidget {
  final TodoItem item;
  TodoItemForm({ @required this.item });

  @override
  State<StatefulWidget> createState() => TodoItemFormState(item: item);
}

class TodoItemFormState extends State<TodoItemForm> {
  final TodoItem item;
  final _key = GlobalKey<FormState>();
  TextEditingController _titleController;
  TextEditingController _detailController;

  String _title = '';
  String _details = '';
  bool _done = false;

  TodoItemFormState({ @required this.item }) {
    if (item != null) {
      _title = item.title;
      _details = item.details;
      _done = item.done;
    }
    _titleController = TextEditingController(text: _title);
    _titleController.addListener(() {
      _title = _titleController.text;
    });
    _detailController = TextEditingController(text: _details);
    _detailController.addListener(() {
      _details = _detailController.text;
    });
  }

  @override
  Widget build(BuildContext context) {

    var titleField = Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: TextFormField(
        style: TextStyle(fontSize: 17),
        decoration: InputDecoration(
          labelText: 'Title',
          icon: Icon(Icons.title)
        ),
        // initialValue: this._title,
        validator: (value) {
          if (value.length  == 0) return 'Please enter a title';
        },
        controller: _titleController,
      )
    );

    var detailField = Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: TextFormField(
        style: TextStyle(fontSize: 17),
        decoration: InputDecoration(
          labelText: 'Details',
          icon: Icon(Icons.description)
        ),
        keyboardType: TextInputType.multiline,
        maxLines: null,
        // initialValue: this._details,
        validator: (value) {
          if (value.length  == 0) return 'Please enter details';
        },
        controller: _detailController,
      )
    );

    var doneCheckBox = Padding(
      padding: EdgeInsets.only(top: 30),
      child: CheckboxListTile(
        title: Text(
          'Completed', 
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600
          )
        ),
        controlAffinity: ListTileControlAffinity.leading,
        value: this._done,
        onChanged: (value) {
          this.setState(() { this._done = value; });
        },
      ),
    );

    var submitButton = Padding(
      padding: EdgeInsets.symmetric(vertical: 50),
      child: RaisedButton(
        padding: EdgeInsets.all(15),
        color: Colors.blue,
        textColor: Colors.white,
        child: Text(this.item == null ? 'Create' : 'Done'),
        onPressed: () {
          if (_key.currentState.validate()) {
            var env = InheritedEnvironment.of(context);
            _key.currentState.save();
            if (item == null) {
              env.createItem(
                title: _title,
                details: _details,
              );
            } else {
              env.updateItem(() {
                item.title = _title;
                item.details = _details;
                item.done = _done;
              });
            }
            Navigator.pop(context);
          }
        },
      )
    );

    return Scaffold(
      appBar: AppBar(title: Text('Edit Item')),
      body: Padding(
        padding: EdgeInsets.fromLTRB(35, 20, 35, 20),
        child: Form(
          key: _key,
          child: ListView(
            children: <Widget>[
              titleField,
              detailField,
              Visibility(
                visible: item != null, // Disable checkbox if creating new item
                child: doneCheckBox
              ),
              submitButton,
            ],),
        )
      )
    );
  }
}