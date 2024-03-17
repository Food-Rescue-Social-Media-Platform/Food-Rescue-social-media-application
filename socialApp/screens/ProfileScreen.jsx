import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Profile Page Screen</Text>
        </View>
    );
}

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

export default ProfileScreen;
