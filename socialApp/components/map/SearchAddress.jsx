import React from 'react';
import { useDarkMode } from '../../styles/DarkModeContext';
import { StyleSheet, Platform, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native';
function SearchAddress({style, onLocationSelected }) {
  const { theme } = useDarkMode(); // Access the current theme

  return (
    <SafeAreaView>
      <View style={[styles.searchBox, style]}>
        <GooglePlacesAutocomplete
          placeholder="Search here"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            onLocationSelected(data, details);
          }}
          query={{
            key: 'AIzaSyBRSQhoQSwmjKqUv4C9s2Jmhti7On555XQ',
            language: 'en', // language of the results
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  searchBox: {
    flex:1,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default SearchAddress;