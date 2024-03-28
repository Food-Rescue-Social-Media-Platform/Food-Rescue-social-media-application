import React, {useState} from 'react';
import { View,StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Camera} from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '../FirebaseFunctions/firestore/UplaodImges';
import { OpenGalereAndSelectImages } from '../FirebaseFunctions/OpeningComponentsInPhone';
import {Post, addPost} from '../FirebaseFunctions/collections/post';

const AddPostScreen = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [post, setPost] = useState(null);

    const handleClose = () => {
        console.log('Close');
    }

    const handleOpenCamera = async () => {
        console.log('Camera');
    }
    
    const handleAddImages = () =>{
        console.log('Images');
        OpenGalereAndSelectImages(setImage);
        uploadImages(image, 'postsImges/', 'image');
    }

    const handleAddLocation = () => {
        console.log('Location');
        
    }

    const handelAddClock = () => {
        console.log('Clock');
    }   

    const handelAddPhone = () => {
        console.log('Phone');
    }

    const handelAddCategory = () => {
        console.log('Category');
    }

    const handleAddPost = async () => {
        // 1. check if have more without text
        // 2. if have image save in storage
        // 3. send request to fireStore to save post
        // 4. navigate to home page
        const newPost = new Post('This is a new post', '232337623423978i', 'fastFood', '1.23232', '05272728292');
        console.log('Post', newPost);

        await addPost(newPost);
        navigation.navigate('HomePage');
    }
    
    return (      
            <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                         <View style={{flexDirection:'row', width:'100%'}}>
                            <Text style={styles.modalText}>Create Post</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                             style={styles.input}
                             placeholder="What's on your mind?"
                             multiline
                         />
                         <View style={styles.iconsWrapper}>
                            <TouchableOpacity>
                            <Entypo name="camera" size={22} color='black' onPress={handleOpenCamera} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <FontAwesome6 name="images" size={22} color='black' onPress={handleAddImages} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Entypo name="location-pin"  size={22} color='black' onPress={handleAddLocation} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Fontisto name="clock"  size={22} color='black' onPress={handelAddClock} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Entypo name="phone"  size={22} color='black' onPress={handelAddPhone} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <MaterialIcons name="category"  size={22} color='black' onPress={handelAddCategory} style={styles.icon}/>
                            </TouchableOpacity>
                            </View>
                         <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                           <Text style={styles.buttonText}>Post</Text>
                         </TouchableOpacity>
                    </View>
                </View>
    );
  }


  const styles = StyleSheet.create({
    iconsWrapper:{
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
    },
    icon:{
        marginHorizontal: 4,
    },
    centeredView: {
        flex: 1,
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        flex: 1,
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    closeButton: {
        alignSelf: 'center',
        right: 0,
        marginLeft: 'auto',
    },
    modalText: {
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        width: '100%',
        height: '65%',
        // borderColor: 'gray',
        padding: 10,
        marginVertical: 14,
    },
    button: {
        backgroundColor: COLORS.secondaryBackground,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.black,
        fontSize: 18,
    },
  });

  export default AddPostScreen;


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