import React, { useRef } from 'react';
import { useDarkMode } from '../../styles/DarkModeContext';
import { StyleSheet,TouchableOpacity , View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
// import { GOOGLE_MAPS_API_KEY } from '@env';

function SearchAddress({style, onLocationSelected }) {
  const autocompleteRef = useRef();
  const { t } = useTranslation();

  const clearInput = () => {
    autocompleteRef.current?.setAddressText('');
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={t("Search location")}
        ref={autocompleteRef}
        minLength={2}
        autoFocus={false}
        returnKeyType={'default'}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // console.log('data', data);
          onLocationSelected(data, details);
        }}
        query={{
          key: 'AIzaSyDsrEf0oqU7R84Ta6WvGf29klHMQbVBCJY',
          language: 'en',
        }}
        styles={{
          textInput: {
            height: 44,
            color: '#5d5d5d',
            fontSize: 16,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
          },
        }}
        renderLeftButton={() => (
          <MaterialCommunityIcons
              name="map-marker"
              size={26}
              style={styles.iconContainer}
        />
        )}
        renderRightButton={() => (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close" size={26} color='black' />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 1,
    backgroundColor: 'white',
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 3,
  },
  textInputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
  },
  iconContainer: {
    height:45,
    width: 45,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 8,
    }
    ,clearButton: {
      height: 45,
      width: 45,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    }
});

export default SearchAddress;


// enablePoweredByContainer={false}
// styles={{
//   textInputContainer: {
//     backgroundColor: 'rgba(0,0,0,0)',
//     borderTopWidth: 0,
//     borderBottomWidth: 0,
//   },
//   textInput: {
//     marginLeft: 0,
//     marginRight: 0,
//     height: 38,
//     color: '#5d5d5d',
//     fontSize: 16,
//   },
//   predefinedPlacesDescription: {
//     color: '#1faadb',
//   },
// }}