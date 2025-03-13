import { StyleSheet, Dimensions } from 'react-native';
import Color from '../../../Utils/Constants/Color';
import RFValue from '../../../Utils/Responsive/RFValue';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    width: width,
    height: height * 0.6,
    position: 'relative',
  },
  titleView: {
    backgroundColor: Color.white,
    paddingVertical: RFValue(10)
  },
  titleText: {
    fontSize: RFValue(17),
    fontWeight: '600',
    color: Color.Rich_Black,
    textAlign: 'center'
  },
  roundView: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: Color.lime_green,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: RFValue(120),
    right: RFValue(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flexPositionView: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: RFValue(20)
  },
  blackBox: {
    width: width * 0.45,
    height: RFValue(80),
    backgroundColor: Color.Rich_Black,
    borderRadius: RFValue(10),
    justifyContent: 'center',
    paddingHorizontal: RFValue(10),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countTitleText: {
    fontSize: RFValue(13),
    fontWeight: '500',
  },
  countText: {
    fontSize: RFValue(24),
    fontWeight: '700',
    marginTop: RFValue(5)
  },
  fixTypeContainer: {
    position: 'absolute',
    top: RFValue(10),
    right: RFValue(10),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(5),
    borderRadius: RFValue(15),
  },
  // Add OpenStreetMap attribution styles (required by their license)
  attribution: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    zIndex: 100,
  },
  attributionText: {
    fontSize: 10,
    color: '#333',
  },
});