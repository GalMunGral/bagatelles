import React, { Component } from 'react';
import {Platform, Text, View, Image, TextInput, Switch, Navigator, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import Priority from './Priority';
import styles from './styles';
import { Navigation } from 'react-native-navigation';

export default class TodoItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      details: PropTypes.string,
      priority: PropTypes.oneOf(Object.values(Priority)),
      done: PropTypes.bool,
      deadline: PropTypes.object
    }).isRequired,
    saveState: PropTypes.func.isRequired,
    index: PropTypes.number
  }
  
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.item)
  }

  componentWillUnmount() {
    if (this.props.index !== -1) {
      this.props.saveState(this.state);
    }
  }

  render() {
    const index = this.props.index;
    const { title, details, priority, done } = this.state;
    return (
      <View style={styles.detail}>
        {index === -1 ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            height: 50
          }}>
            <TouchableHighlight
              underlayColor="#EEEEEE"
              // disabled={Platform.OS === 'android'}
              // style={{ opacity: Platform === 'android' ? 0 : 1 }}
              onPress={() => {
                Navigation.dismissModal(this.props.componentId);
              }}
            >
              <Image
                style={styles.navBarButton}
                source={require('./assets/close.png')}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#EEEEEE"
              onPress={() => {
                this.props.saveState(this.state);
                Navigation.dismissModal(this.props.componentId);
              }}
            >
              <Image
                style={styles.navBarButton}
                source={require('./assets/done.png')}
              />
            </TouchableHighlight>
          </View>
        ) : null}
        <TextInput
          style={styles.detailText}
          value={title}
          placeholder="Enter a title"
          onChangeText={(text) => {
            this.setState({ title: text })
          }}
        />
        <TextInput
          style={styles.secondaryText}
          value={details}
          placeholder="Enter some descriptive details"
          multiline={true}
          onChangeText={(text) => {
            this.setState({ details: text })
          }}
        />

        <View style={[styles.row, { marginTop: 100 }]}>
          <Switch
            disabled={index === -1}
            value={this.state.done}
            onValueChange={(done) => {
              this.setState({ done });
            }}
          />
          <Text style={[styles.centerText, { marginHorizontal: 10 }]}>
            { this.state.done ? 'Completed' : 'In progress'}
          </Text>
        </View>
      </View>
    )
  }
}