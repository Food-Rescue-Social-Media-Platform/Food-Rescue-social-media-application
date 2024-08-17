import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { CheckBox } from 'react-native-elements';
import { categoriesList } from '../../utils/categories';
import { COLORS } from '../../styles/colors';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const EditPostScreen = ({ navigation, route }) => {
    const { item } = route.params; // Get the item object from route params
    const { theme } = useDarkMode(); // Access the current theme
    const { t } = useTranslation();

    // Initialize state variables with existing values
    const [category, setCategory] = useState(item.category);
    const [phoneNumber, setPhoneNumber] = useState(item.phoneNumber);
    const [deliveryTime, setDeliveryTime] = useState(item.deliveryRange);
    const [postText, setPostText] = useState(item.postText);
    const [selectedCategory, setSelectedCategory] = useState(item.category); // Single selected option
    const options = categoriesList.map((category) => ({ label: category, value: category }));
    const [loading, setLoading] = useState(false);


    // const options = [
    //     { label: 'Drinks', value: 'Drinks' },
    //     { label: 'Fruits', value: 'Fruits' },
    //     { label: 'Vegetables', value: 'Vegetables' },
    //     { label: 'Seafood', value: 'Seafood' },
    //     { label: 'Sweets', value: 'Sweets' },
    //     { label: 'Dairy', value: 'Dairy' },
    //     { label: 'Rice', value: 'Rice' },
    //     { label: 'Fast Food', value: 'Fast Food' },
    //     { label: 'Chicken', value: 'Chicken' },
    //     { label: 'Cooked', value: 'Cooked' },
    //     { label: 'Bread', value: 'Bread' },
    //     { label: 'Other', value: 'Other' },
    // ];

    const handleCheck = (option) => {
        setSelectedCategory(option.value === selectedCategory ? null : option.value);
    };

    // Validation functions
    const validatePhoneNumber = (number) => {
        return /^[0-9]{9,15}$/.test(number);
    };

    const validateDeliveryTime = (time) => {
        return time.length <= 30;
    };

    const validatePostText = (text) => {
        return text.length <= 3000;
    };

    // Function to handle post update
    const handleUpdatePost = async () => {
        if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Phone number must be between 9 and 15 digits',
            });
            setLoading(false);
            return;
        }

        if (deliveryTime && !validateDeliveryTime(deliveryTime)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Delivery time must be less than or equal to 30 characters',
            });
            setLoading(false);
            return;
        }

        if (postText && !validatePostText(postText)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Post text must be less than or equal to 3000 characters',
            });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const postDocRef = doc(database, "posts", item.id);
            // update the post in the database with the new values
            await updateDoc(postDocRef, {
                phoneNumber: phoneNumber,
                deliveryRange: deliveryTime,
                postText: postText,
                category: selectedCategory,
            });
            // After successful update, navigate back to the PostCard component
            navigation.goBack();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Post updated successfully.',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update post.',
            });
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackGroundColor }]}>
            {/* UI components for editing fields */}
            <View style={styles.inputContainer}>
                <FontAwesome name="phone" color={theme.primaryText} size={25} />
                <TextInput
                    style={[styles.input, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Phone"
                    placeholderTextColor={theme.secondaryText}
                    keyboardType="number-pad"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="bus-clock" size={22} color={theme.primaryText} />
                <TextInput
                    style={[styles.input, styles.deliveryTimeInput, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Delivery Time"
                    placeholderTextColor={theme.secondaryText}
                    value={deliveryTime}
                    onChangeText={(text) => handleInputChange(text, setDeliveryTime, 30)}
                />
                <Text style={styles.characterCount}>{deliveryTime.length}/30</Text>
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="post" size={22} color={theme.primaryText} />
                <TextInput
                    style={[styles.input, styles.postInput, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Post Text"
                    placeholderTextColor={theme.secondaryText}
                    multiline
                    value={postText}
                    onChangeText={(text) => handleInputChange(text, setPostText, 3000)}
                />
                <Text style={styles.characterCount}>{postText.length}/3000</Text>
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="category" size={22} color={theme.primaryText} />
                <TextInput
                    style={[styles.input, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Category"
                    placeholderTextColor={theme.secondaryText}
                    value={t(category)}
                    editable={false} // Disable editing
                    onChangeText={(text) => setCategory(text)}
                />
            </View>

            {/* FlatList for single selectable checkbox options */}
            <FlatList
                data={options}
                numColumns={2} // Display two columns
                renderItem={({ item }) => (
                    <CheckBox
                        title={t(item.label)}
                        checked={selectedCategory === item.value}
                        onPress={() => handleCheck(item)}
                        containerStyle={[styles.checkboxContainer, { backgroundColor: theme.appBackGroundColor, borderColor: theme.borderColor }]}
                        textStyle={[styles.checkBox, { color: theme.primaryText }]}
                    />
                )}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
            />
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondaryBackground }]} onPress={handleUpdatePost}>
                    <Text style={[styles.buttonText, { color: theme.primaryText }]}>{t('Update Post')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const handleInputChange = (text, setInput, maxLength) => {
    if (text.length <= maxLength) {
        setInput(text);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        flex: 1,
    },
    postInput: {
        height: 100,
    },
    deliveryTimeInput: {
        height: 40, // Ensure this matches the input field height for proper alignment
    },
    characterCount: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        fontSize: 12,
        color: 'gray',
    },
    button: {
        padding: 13,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 21,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        marginLeft: 20,
        marginRight: 0, // Adjust the margin between checkboxes
        borderRadius: 10,
        flex: 1, // Take up equal space in the column
        flexDirection: 'row', // Align checkboxes horizontally
        alignItems: 'center', // Center checkboxes vertically
    },
    checkBox: {
        marginLeft: 5, // Adjust the space between the checkbox and label
    },
});

export default EditPostScreen;
