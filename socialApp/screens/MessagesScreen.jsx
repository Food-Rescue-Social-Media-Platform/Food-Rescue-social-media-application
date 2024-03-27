import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';

const MessagesScreen = ({ navigation }) => {
    const handleChatPress = () => {
        navigation.navigate('Chat');
    };

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Welcome to Messages screen</Text>
        <Button title="Start Chat" onPress={handleChatPress} />
        </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    }
})

export default MessagesScreen;
