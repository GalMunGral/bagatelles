/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import App from './src/App';
import TodoList from './src/TodoList';
import TodoItem from './src/TodoItem';
import NavBarTitle from './src/NavBarTitle';
import NavBarButton from './src/NavBarButton';
import EmptyView from './src/EmptyView';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
Navigation.registerComponent('WelcomeScreen', () => App);
Navigation.registerComponent('EmptyView', () => EmptyView);
Navigation.registerComponent('TodoList', () => TodoList);
Navigation.registerComponent('TodoItem', () => TodoItem);
Navigation.registerComponent('NavBarTitle', () => NavBarTitle);
Navigation.registerComponent('NavBarButton', () => NavBarButton);

const iosBlue = '#007aff';

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'TodoList',
                    passProps: {},
                    options: {
                      topBar: {
                        title: {
                          id: '0',
                          component: {
                            id: '0',
                            name: 'NavBarTitle',
                            passProps: {
                              text: 'To-do List'
                            }
                          },
                        },
                        leftButtons: [],
                        rightButtons: [],
                      },
                      bottomTab: {
                        text: 'To Do',
                        icon: (
                          Platform.OS === 'ios'
                          ? require('./src/assets/ios/list/baseline_list_black_24pt.xcassets/baseline_list_black_24pt.imageset/baseline_list_black_24pt_1x.png')
                          : require('./src/assets/list.png')
                        ),
                        selectedIconColor: iosBlue,
                        selectedTextColor: iosBlue,
                        testID: 'SECOND_TAB_BAR_BUTTON'
                      },
                      bottomTabs: {
                        titleDisplayMode: 'alwaysShow'
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            component: {
              id: '3',
              name: 'EmptyView',
              options: {
                topBar: {
                  leftButtons: [],
                  rightButtons: [],
                },
                bottomTab: {
                  text: 'Done',
                  iconInsets: { top: 0, left: 0, bottom: 0, right: 0 },
                  icon: (
                    Platform.OS === 'ios'
                    ? require('./src/assets/ios/done/baseline_done_outline_black_18pt.xcassets/baseline_done_outline_black_18pt.imageset/baseline_done_outline_black_18pt_1x.png')
                    : require('./src/assets/done.png')
                  ),
                  selectedIconColor: iosBlue,
                  selectedTextColor: iosBlue,
                  testID: 'SECOND_TAB_BAR_BUTTON'
                },
                bottomTabs: {
                  titleDisplayMode: 'alwaysShow'
                }
              }
            }
          }
        ]
      }
    }
  });
});
