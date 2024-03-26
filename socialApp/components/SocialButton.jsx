import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SocialButton = ({buttonTitle, btnType, color, backgroundColor, ...rest}) => {
    let bgColor = backgroundColor;
    return (
        <TouchableOpacity 
            style={[styles.buttonContainer, {backgroundColor: bgColor}]} 
            {... rest}>
            <View style={styles.iconWrapper}>
                <FontAwesome name={btnType} style={styles.icon} stysize={22} color={color}></FontAwesome>
            </View>
            <View style={styles.btnTxtWrapper}>
                <Text style={[styles.buttonText, {color:color}]}>{buttonTitle}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default SocialButton;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 10,
      width: '50%',
      height: windowHeight / 15,
      padding: 5,
      flexDirection: 'row',
      borderRadius: 3,
    },
    iconWrapper: {
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontWeight: 'bold',
      fontSize: 25,
    },
    btnTxtWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
});