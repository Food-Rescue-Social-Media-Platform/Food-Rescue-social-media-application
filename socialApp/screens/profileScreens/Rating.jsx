import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, DARKCOLORS } from '../../styles/colors';
import { useDarkMode } from '../../styles/DarkModeContext';

// Function to capitalize the first letter of each word
const capitalizeFirstLetterOfEachWord = (string) => {
  return string.replace(/\b\w/g, char => char.toUpperCase());
};

const Rating = ({ route }) => {
  const { userData } = route.params;
  const [rating, setRating] = useState(userData.rating || 0);
  const [ratingNumber, setRatingNumber] = useState(userData.ratingNumber || 0);
  const [selectedRating, setSelectedRating] = useState(0);
  const navigation = useNavigation(); // Get navigation object
  const { isDarkMode } = useDarkMode();

  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  const handleRatingPress = (newRating) => {
    setSelectedRating(newRating);
  };

  const submitRating = async () => {
    const newRating = (rating * ratingNumber + selectedRating) / (ratingNumber + 1);
    const newRatingNumber = ratingNumber + 1;

    setRating(newRating);
    setRatingNumber(newRatingNumber);

    try {
      const userDocRef = doc(database, 'users', userData.id);
      await updateDoc(userDocRef, {
        rating: newRating,
        ratingNumber: newRatingNumber,
      });
      console.log('Rating updated successfully');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error updating rating: ', error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRatingPress(i)}>
          <MaterialCommunityIcons
            name={i <= selectedRating ? 'star' : 'star-outline'}
            size={30}
            color={i <= selectedRating ? themeColors.secondaryBackground : themeColors.black}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.appBackGroundColor }]}>
      <Text style={[styles.title, { color: themeColors.primaryText }]}>
        Rate {capitalizeFirstLetterOfEachWord(userData.userName)}
      </Text>
      <View style={styles.starContainer}>
        {renderStars()}
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={submitRating}>
        <Text style={[styles.buttonText, { color: themeColors.primaryText }]}>Submit Rating</Text>
      </TouchableOpacity>
      <Text style={[styles.currentRating, { color: themeColors.primaryText }]}>
        Current Rating: {rating.toFixed(1)} ({ratingNumber} ratings)
      </Text>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  currentRating: {
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    padding: 13,
    borderRadius: 10,
    width: '56%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
