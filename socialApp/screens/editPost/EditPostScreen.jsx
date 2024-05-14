import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { CheckBox } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditPostScreen = ({ navigation, route }) => {
    const { item } = route.params; // Get the item object from route params
    const { colors } = useTheme();

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
            const postDocRef = doc(database, "posts", item.id);
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
        
        <View style={styles.container}>
            {/* UI components for editing fields */}
            <View style={styles.inputContainer}>
                <FontAwesome name="phone" color={colors.text} size={25} />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="bus-clock" size={22}/>
                <TextInput
                    style={styles.input}
                    placeholder="Delivery Time"
                    placeholderTextColor="#666666"
                    value={deliveryTime}
                    onChangeText={(text) => setDeliveryTime(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="post" size={22}/>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Post Text"
                    placeholderTextColor="#666666"
                    multiline
                    value={postText}
                    onChangeText={(text) => setPostText(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="category" size={22} />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    placeholderTextColor="#666666"
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
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkBox}
                    />
                )}
                keyExtractor={(item) => item.value}
            />

            {/* Button to update the post */}
            <TouchableOpacity style={styles.button} onPress={handleUpdatePost}>
                <Text style={styles.buttonText}>Update Post</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.white,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        flex: 1,
    },
    button: {
        backgroundColor: COLORS.secondaryBackground,
        padding: 13,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 21,
    },
    buttonText: {
        color: COLORS.black,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    checkboxContainer: {
        backgroundColor: COLORS.white,
        marginLeft: 20,
        marginRight: 0, // Adjust the margin between checkboxes
        borderRadius: 10,
        color: COLORS.black,
        borderColor: 'gray',
        flex: 1, // Take up equal space in the column
        flexDirection: 'row', // Align checkboxes horizontally
        alignItems: 'center', // Center checkboxes vertically
    },
    checkBox: {
        marginLeft: 5, // Adjust the space between the checkbox and label
    },
});
