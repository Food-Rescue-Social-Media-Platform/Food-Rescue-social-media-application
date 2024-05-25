import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context

const MapScreen = () => {
    const { theme } = useDarkMode(); // Access the current theme

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackGroundColor }]}>
            <Text style={[styles.text, { color: theme.primaryText }]}>Welcome to Map Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
    }
});

export default MapScreen;
