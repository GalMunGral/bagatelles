/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ViewComponent,
  View,
  FlatList,
  StatusBar,
  ToolbarAndroid,
} from 'react-native';

import TodoItem from './TodoItem';
import TodoList from './TodoList';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
    
  constructor() {
    super();
    this.routes = [
      {
        route: { title: 'Todo List', index: 0 },
        component: TodoList
      },
      {
        route: { title: 'Edit Item', index: 1 },
        component: TodoItem
      }
    ]
  }
  render() {
    return (
      <Navigator
        initialRoute={this.routes[0].route}
        renderScene={(route, navigator) => {
          return React.createElement(
            this.routes[route.index].component,
            {
              onButtonPressed: () => { navigator.push(this.routes[1].route) }
            }
          );
        }}
      ></Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
