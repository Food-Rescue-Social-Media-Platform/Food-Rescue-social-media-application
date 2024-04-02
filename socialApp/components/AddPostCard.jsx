import React, {useState} from 'react';
import { View, Modal,StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../styles/colors';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddPostCard = () => {
    const navigation = useNavigation();

    const openShareFoodScreen = () => {
        console.log('Share food screen opened');
        navigation.navigate('AddPost');
    }

    return (
        <View style={styles.container}> 
            <Image style={styles.profileImage} source={require('../assets/users/user-1.jpg')} />
            <View>
                <TouchableOpacity style={styles.sharePostWrapper} onPress={openShareFoodScreen}>
                <Text style={styles.mainText}>Share food...</Text>
                </TouchableOpacity>       
                    <Icons 
                        size={20}
                        color={'black'} 
                        handelClick={openShareFoodScreen}
                        iconStyle={styles.icon}
                        wrapperStyle={styles.iconsWrapper}
                     />
             </View>
        </View>
    );
  }


  const styles = StyleSheet.create({
    container: {
       width: '100%',
       height: windowHeight/7,
       backgroundColor: COLORS.secondaryTheme,
       flexDirection: 'row',
       marginBottom: 20, 
    },
    sharePostWrapper:{
        width: '100%', 
        backgroundColor: COLORS.secondaryBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: COLORS.black,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingRight: 120,
        marginLeft: 3,
        marginTop: 14,
        marginBottom: 8,
        justifyContent: 'center',
    },
    mainText : {
        fontSize: 15,
    },
    iconsWrapper:{
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
    },
    icon:{
        marginHorizontal: 4,
    },
    profileImage:{
        width: 70,
        height: 70,
        borderRadius: 50,
        margin: 12,
    },
  });

  export default AddPostCard;


  const Icons = ({handelClick, size, iconStyle, wrapperStyle, color})  => {
    return (
        <TouchableOpacity style={wrapperStyle}>
        <TouchableOpacity onPress={handelClick}>
        <FontAwesome6 name="images" size={size} color={color} style={iconStyle}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handelClick}>
            <Entypo name="location-pin"  size={size} color={color} style={iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handelClick}>
            <Fontisto name="clock"  size={size} color={color} style={iconStyle}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handelClick}>
            <Entypo name="phone"  size={size} color={color} style={iconStyle}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handelClick}>
            <MaterialIcons name="category"  size={size} color={color} style={iconStyle}/>
        </TouchableOpacity>
        </TouchableOpacity>
    )
  }