import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditPostScreen = ({ navigation, route }) => {
    const { user, logout } = useContext(AuthContext);
    const { item } = route.params; // Get the item object from route params
    const { colors } = useTheme();

    // Initialize state variables with existing values
    const [category, setCategory] = useState(item.category);
    const [phoneNumber, setPhoneNumber] = useState(item.phoneNumber);
    const [deliveryTime, setDeliveryTime] = useState(item.deliveryRange);
    const [postText, setPostText] = useState(item.postText);

    // Function to handle post update
    const handleUpdatePost = () => {
        // Implement logic to update the post in the database with the new values
        // This could involve making a request to your backend server or directly updating the Firestore document
        // After successful update, navigate back to the PostCard component
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* UI components for editing fields */}
            <View style={styles.inputContainer}>
                <MaterialIcons name="category" size={22} />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    placeholderTextColor="#666666"
                    value={category}
                    onChangeText={(text) => setCategory(text)}
                />
            </View>
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
        marginLeft:21,

    },
    buttonText: {
        color: COLORS.black,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
});
