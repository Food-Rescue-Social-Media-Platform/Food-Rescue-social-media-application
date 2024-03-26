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
import {windowHeight} from '../utils/Dimentions';
import { Image } from 'react-native';
import ModalAddPost from './ModalAddPost';

const SharePost = () => {
    const [showModal, setShowModal] = useState(false);

    const openShareFoodScreen = () => {
        console.log('Share food screen');
        setShowModal(true);
        console.log(showModal);
    }

    const handlePost = () => {
        console.log('Post');
    }

    const handleClose = () => {
        setShowModal(false);
    }

    return (
        <View style={styles.container}> 
            <Image style={styles.profileImage} source={require('../assets/users/user-1.jpg')} />
            <View>
                <TouchableOpacity style={styles.sharePostWrapper} onPress={openShareFoodScreen}>
                <Text style={styles.mainText}>Share food...</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.iconsWrapper}>
                    <TouchableOpacity onPress={openShareFoodScreen}>
                    <FontAwesome6 name="images" size={21} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openShareFoodScreen}>
                        <Entypo name="location-pin" size={21} color="black" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openShareFoodScreen}>
                        <Fontisto name="clock" size={19.5} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openShareFoodScreen}>
                        <Entypo name="phone" size={21} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openShareFoodScreen}>
                        <MaterialIcons name="category" size={21} color="black" style={styles.icon}/>
                    </TouchableOpacity>
                    </TouchableOpacity>
             </View>
              {/* popup add post */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={handleClose}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClose}
                            >
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Add Post</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="What's on your mind?"
                                multiline
                            />
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

    );
  
  }

  const styles = StyleSheet.create({
    container: {
       width: '100%',
       height: windowHeight/7,
       backgroundColor: COLORS.secondaryTheme,
       flexDirection: 'row',      
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
  });

  export default SharePost;