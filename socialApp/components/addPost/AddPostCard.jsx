import React, {useState} from 'react';
import { View, Modal,StyleSheet, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../../styles/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
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
            <Image style={styles.profileImage} source={require('../../assets/users/user-1.jpg')} />
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
       height: windowHeight/8,
       backgroundColor: COLORS.secondaryTheme,
       flexDirection: 'row',
       marginBottom: 20,
       borderRadius:8,
       ...Platform.select({
        web: {
            width: '70%',
            marginLeft: '15%',
        },
    }),
    },
    sharePostWrapper:{
        width: '100%',
        backgroundColor: COLORS.secondaryBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: COLORS.black,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingRight: 150,
        marginLeft: 3,
        marginTop: 14,
        marginBottom: 8,
        justifyContent: 'center',
        ...Platform.select({
            web: {
                marginRight: '0.1rem',
            },
        }),
    },
    mainText : {
        fontSize: 15,
    },
    iconsWrapper:{
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
        marginTop:'1%',
    },
    icon:{
        marginHorizontal: 4,
    },
    profileImage:{
        width: 80,
        height: 80,
        borderRadius: 50,
        margin: 12,
    },
  });

  export default AddPostCard;


  const Icons = ({handelClick, size, iconStyle, wrapperStyle, color})  => {
    return (
        <TouchableOpacity style={wrapperStyle}>
            <TouchableOpacity onPress={handelClick}>
                <MaterialIcons  name="photo-library" size={22} color={color} style={iconStyle}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons  name="map-marker"  size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons  name="clock"  size={22} color={color} style={iconStyle}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons name="phone"  size={22} color={color} style={iconStyle}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialIcons name="category"  size={22} color={color} style={iconStyle}/>
            </TouchableOpacity>
        </TouchableOpacity>
    )
  }