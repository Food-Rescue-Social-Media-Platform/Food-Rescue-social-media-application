import React from 'react';
import { useDarkMode } from '../../styles/DarkModeContext';
import { StyleSheet,FlatList,TextInput,Button, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native';
import axios from 'axios';

function SearchAddress({style, onLocationSelected }) {
  const { theme } = useDarkMode(); // Access the current theme

  // const [query, setQuery] = useState('');
  // const [results, setResults] = useState([]);

  // const handleSearch = async () => {
  //   const searchResults = await searchAddress(query);
  //   setResults(searchResults);
  // };
  
  return (
    <SafeAreaView>
      <View style={[styles.searchBox, style]}>
        <GooglePlacesAutocomplete
          placeholder="Search here"
          onPress={(data, details = null) => {
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
          renderLeftButton={() => (
            <View style={styles.iconContainer}>
              <Ionicons name="search" size={26} color='black' />
            </View>
          )}
          // onFail={error => console.error(error)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    // flex:1,
    marginTop: 20,
    zIndex: 1,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 7,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  iconContainer: {
    padding: 7,
    }
});

export default SearchAddress;


const searchAddress = async (query) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
}
  {/*<View style={searchBox}>
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="הכנס כתובת לחיפוש"
    />
    <Button title="חפש" onPress={handleSearch} />
    <FlatList
      data={results}
      keyExtractor={(item) => item.place_id}
      renderItem={({ item }) => <Text>{item.display_name}</Text>}
    />
  </View>*/}