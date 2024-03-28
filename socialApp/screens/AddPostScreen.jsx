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
import { uploadImages } from '../helpers/UplaodImges';
import { OpenGalereAndSelectImages } from '../helpers/OpeningComponents';

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
    }

    // const handleAddImages = async () => {
    //   console.log('Images');
    //   const s = await ImagePicker.getCameraPermissionsAsync();
    //   // No permissions request is necessary for launching the image library
    //    let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.All,
    //     allowsEditing: true,
    //     // aspect: [4, 3],
    //     quality: 1,
    //   });
    
    //   if (!result.canceled) {
    //     setImage(result.assets[0].uri);
    //     console.log("uri: ", result.assets[0].uri);
    //     await uploadImages(result.assets[0].uri, 'postsImges/');
    //   }
    // }

    // await uploadImages(result.assets[0].uri, 'postsImges/');

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

    const handleAddPost = () => {
        // 1. check if have more without text
        // 2. if have image save in storage
        // 3. send request to fireStore to save post
        // 4. navigate to home page
        navigation.navigate('HomePage');
    }

    // const uploadImage = async (uri) => {
    //     if(uri == null) {
    //       return null;
    //     }

        
    //     const response = await fetch(uri);
    //     const blob = await response?.blob();

    //     // let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    
    //     // // Add timestamp to File Name
    //     // const extension = filename.split('.').pop(); 
    //     // const name = filename.split('.').slice(0, -1).join('.');
    //     // filename = name + Date.now() + '.' + extension; 

    //     const storageRef = ref(storage, `postsImges/${ 'post_img_' + Date.now()}`)
    //     uploadBytesResumable(storageRef, blob)
    //     .then((snapshot) => {
    //         // console.log('Uploaded a file!', snapshot.ref);
    //         getDownloadURL(snapshot.ref).then((downloadURL) => {
    //             console.log('File available at', downloadURL);
    //         });
    //     }).catch((error) => {
    //         console.error('Error uploading image:', error);
    //       });
    // };


    
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