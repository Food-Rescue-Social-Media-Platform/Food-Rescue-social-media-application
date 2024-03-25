import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const FormInput = ({labelValue, placeHolderText, iconType, ...rest}) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                value={labelValue}
                style={styles.input}
                numberOfLines={1}
                placeholder={placeHolderText}
                PlaceholderTextColor="8666"
                {... rest}
            />
            {iconType === 'id-card' ? (
              <View style={styles.iconStyle}>
                  <FontAwesome name={iconType} size={25} color="#666" />
              </View>
                
            ) : (
              <View style={styles.iconStyle}>
                  <AntDesign name={iconType} size={25} color="#666" />
              </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
      marginTop: 5,
      marginBottom: 10,
      width: '95%',
      height: windowHeight / 15,
      borderColor: '#ccc',
      borderRadius: 2,
      borderWidth: 0.8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    iconStyle: {
      padding: 10,
      marginTop:5,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
    },
    input: {
      padding: 10,
      flex: 1,
      fontSize: 16,
      color: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputField: {
      padding: 10,
      marginTop: 5,
      marginBottom: 10,
      width: windowWidth / 1.5,
      height: windowHeight / 15,
      fontSize: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
});

export default FormInput;
