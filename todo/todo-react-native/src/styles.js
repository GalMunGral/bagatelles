import { Platform, StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  lineThrough: {
    color: 'grey',
    textDecorationLine: 'line-through'
  },
  centerText: {
    fontSize: 15,
    lineHeight: Platform.OS == 'ios' ? 30 : 15, // Trick to center text vertically on iOS
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'serif',
    padding: 0,
    alignSelf: 'stretch',
    textAlignVertical: 'center',
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    lineHeight: Platform.OS === 'ios' ? 40 : 18, // Trick to center text vertically on iOS
    fontWeight: '300',
    color: 'black'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navBarButton: {
    marginVertical: 10,
    marginHorizontal: 20,
    height: 25,
    width: 25
  },
  item: {
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 5
  },
  navBarTitle: {
    // fontFamily: 'serif',
    color: 'black',
    fontWeight: '800',
    fontSize: 22,
  },
  detail: {
    padding: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 24,
    marginVertical: 10
  },
  secondaryText: {
    fontSize: 18,
    color: 'grey'
  }
});
