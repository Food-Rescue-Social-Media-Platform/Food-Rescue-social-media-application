import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../styles/colors';

const MapScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Map Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.appBackGroundColor,
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

export default MapScreen;
