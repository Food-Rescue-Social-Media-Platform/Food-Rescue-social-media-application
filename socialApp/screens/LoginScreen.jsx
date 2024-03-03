import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <Button
                title="Click Here"
                onPress={() => alert('Button Clicked! ')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default LoginScreen;
