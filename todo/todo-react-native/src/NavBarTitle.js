import React, { Component,} from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, FlatList, TouchableHighlight } from 'react-native';
import styles from './styles';

export default class NavBarTitle extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    return (
      <Text style={styles.navBarTitle}>
        {this.props.text}
      </Text>
    )
  }
}
