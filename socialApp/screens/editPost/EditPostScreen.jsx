import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { CheckBox } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditPostScreen = ({ navigation, route }) => {
    const { item } = route.params; // Get the item object from route params
    const { theme } = useDarkMode(); // Access the current theme

    // Initialize state variables with existing values
    const [category, setCategory] = useState(item.category);
    const [phoneNumber, setPhoneNumber] = useState(item.phoneNumber);
    const [deliveryTime, setDeliveryTime] = useState(item.deliveryRange);
    const [postText, setPostText] = useState(item.postText);
    const [selectedCategory, setSelectedCategory] = useState(item.category); // Single selected option

    const options = [
        { label: 'Drinks', value: 'Drinks' },
        { label: 'Fruits', value: 'Fruits' },
        { label: 'Vegetables', value: 'Vegetables' },
        { label: 'Seafood', value: 'Seafood' },
        { label: 'Sweets', value: 'Sweets' },
        { label: 'Meat', value: 'Meat' },
        { label: 'Milky', value: 'Milky' },
        { label: 'Rice', value: 'Rice' },
        { label: 'Fast Food', value: 'Fast Food' },
        { label: 'Chicken', value: 'Chicken' },
        { label: 'Cooked', value: 'Cooked' },
        { label: 'Bread', value: 'Bread' },
        { label: 'Other', value: 'Other' },
    ];

    const handleCheck = (option) => {
        setSelectedCategory(option.value === selectedCategory ? null : option.value);
    };

    // Function to handle post update
    const handleUpdatePost = async () => {
        try {
            const postDocRef = doc(database, "postsTest", item.id);
            // update the post in the database with the new values
            await updateDoc(postDocRef, {
                ...item,
                phoneNumber: phoneNumber,
                deliveryRange: deliveryTime,
                postText: postText,
                category: selectedCategory,
            });
            // After successful update, navigate back to the PostCard component
            navigation.goBack();
            console.log("User post updated successfully");
        } catch (error) {
            console.error("Error updating user post:", error);
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
                    style={[styles.input, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Delivery Time"
                    placeholderTextColor={theme.secondaryText}
                    value={deliveryTime}
                    onChangeText={(text) => setDeliveryTime(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="post" size={22} color={theme.primaryText} />
                <TextInput
                    style={[styles.input, { height: 100, color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Post Text"
                    placeholderTextColor={theme.secondaryText}
                    multiline
                    value={postText}
                    onChangeText={(text) => setPostText(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="category" size={22} color={theme.primaryText} />
                <TextInput
                    style={[styles.input, { color: theme.primaryText, borderColor: theme.borderColor }]}
                    placeholder="Category"
                    placeholderTextColor={theme.secondaryText}
                    value={category}
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
                        title={item.label}
                        checked={selectedCategory === item.value}
                        onPress={() => handleCheck(item)}
                        containerStyle={[styles.checkboxContainer, { backgroundColor: theme.appBackGroundColor, borderColor: theme.borderColor }]}
                        textStyle={[styles.checkBox, { color: theme.primaryText }]}
                    />
                )}
                keyExtractor={(item) => item.value}
            />

            {/* Button to update the post */}
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondaryBackground }]} onPress={handleUpdatePost}>
                <Text style={[styles.buttonText, { color: theme.primaryText }]}>Update Post</Text>
            </TouchableOpacity>
        </View>
    );
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
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        flex: 1,
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
