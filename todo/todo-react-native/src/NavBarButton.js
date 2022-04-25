import React, { Component,} from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Button, FlatList, TouchableHighlight } from 'react-native';
import { Navigation } from 'react-native-navigation';
import styles from './styles';

export default class NavBarTitle extends Component {

  static current = null; // This will hold a reference to the current instance

  static propTypes = {
    callback: PropTypes.func
  }

  hasPickedItem = false;

  componentDidMount() {
    Navigation.events().registerCommandListener((name, params) => {
      if (name === 'showModal') {
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
    return (
      <TouchableHighlight
        underlayColor="#EEEEEE"
        onPress={() => {
          if (!this.hasPickedItem) {
            this.hasPickedItem = true;
            Navigation.showModal({
              component: {
                name: 'TodoItem',
                passProps: {
                  item: {},
                  index: -1,
                  saveState: this.props.callback
                }
              }
            });
          }
        }}
      >
        <Image
          style={styles.navBarButton}
          source={require('./assets/add.png')}
        />
      </TouchableHighlight>
    )
  }
}