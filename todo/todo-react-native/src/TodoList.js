import React, { Component,} from 'react';
import { View, Text, Button, Switch, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Priority from './Priority';
import styles from './styles';
import TodoItem from './TodoItem';

export default class TodoList extends Component {

  static current = null; // This will hold a reference to the current instance

  static options(passProps) {
    return {
      topBar: {
        rightButtons: [{
          id: 'yo',
          component: {
            id: 'yo',
            name: 'NavBarButton',
            passProps: {
              callback: (newItem) => {
                const items = TodoList.current.state.items;
                TodoList.current.setState({
                  items: [
                    ...items,
                    Object.assign(newItem, {
                      key: String(items.length)
                    })
                  ]
                });
              }
            }
          }
        }]
      }
    };
  }
 
  hasPickedItem = false; // Prevent opening multiple details screens at once
  currentCommandId = '';
  
  constructor(props) {
    super(props);
    this.state = {
      items: [{
        key: String(0),
        title: 'Some Title',
        details: 'Some Details',
        priority: Priority.normal,
        done: false,
        deadline: new Date(),
      }]
    };
    TodoList.current = this;
  }

  componentDidMount() {
    // Prevent opening multiple detail view screens at once
    Navigation.events().registerCommandListener((name, params) => {
      if (name === 'push' && params.componentId === this.props.componentId) {
        this.currentCommandId = params.commandId;
      }
    });

    Navigation.events().registerCommandCompletedListener(({ commandId }) => {
      if (commandId === this.currentCommandId) {
        this.hasPickedItem = false; // Reset flag
      } 
    });
  }

  render() {
    const originalItems = this.state.items;
    const reversedItems = [...originalItems].reverse();

    const detailScreenLayout = (item, index) => ({
      component: {
        name: 'TodoItem',
        options: {
          topBar: {
            title: {
              component: {
                name: 'NavBarTitle',
                passProps: {
                  text: 'Edit'
                }
              }
            }
          },
          bottomTabs: {
            visible: false
          }
        },
        passProps: {
          item, 
          index,
          saveState: (newData) => {
            this.setState({
              items: originalItems.map((v, i) => {
                if (i + index === originalItems.length - 1) {
                  return newData;
                }
                return v;
              })
            })
          }
        }
      }
    });

    return (
      <React.Fragment>
        <FlatList 
          data={reversedItems}
          renderItem={({item, index}) => (
          <TouchableHighlight 
            style={[styles.item]}
            underlayColor="#EEEEEE"
            onPress={() => {
              if (!this.hasPickedItem) {
                this.hasPickedItem = true;
                Navigation.push(this.props.componentId, detailScreenLayout(item, index));
              }
            }}>
            <View style={[styles.row]}>
              <Text style={[styles.listText, item.done ? styles.lineThrough : null]}>
                {item.title}
              </Text>
              <Switch
                style={{ marginLeft: 20 }}
                value={item.done}
                onValueChange={(done) => {
                  this.setState({
                    items: originalItems.map((value, i) => {
                      if (i + index === originalItems.length - 1) {
                        let newValue = Object.assign({}, value);
                        newValue.done = done;
                        return newValue;
                      }
                      return value;
                    })
                  });
                }}
              />
            </View>
          </TouchableHighlight>
          )}
        />
      </React.Fragment>
    )
  }
}