import React, { useRef } from 'react';
import { useDarkMode } from '../../styles/DarkModeContext';
import { StyleSheet,TouchableOpacity ,FlatList,TextInput,Button, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function SearchAddress({style, onLocationSelected }) {
  const { theme } = useDarkMode(); // Access the current theme
  const autocompleteRef = useRef();

  const clearInput = () => {
    autocompleteRef.current?.setAddressText('');
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search location'
        ref={autocompleteRef}
        minLength={2}
        autoFocus={false}
        returnKeyType={'default'}
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log(data, details);
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
            <Ionicons name="close" size={24} color='black' />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    zIndex: 1,
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 10,
    padding: 7,
    // shadowOffset: { width: 0, height: 3 },
    // shadowColor: '#000',
    marginTop: 20,
    // elevation: 10,

    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 3.84,
    // elevation: 5,
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
    // backgroundColor: '#ccc',
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