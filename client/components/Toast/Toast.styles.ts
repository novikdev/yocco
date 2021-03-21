import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  base: {
    padding: 10,
    marginTop: 15,
    width: '90%',
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  buttons: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
