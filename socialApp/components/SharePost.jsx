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
import ModalAddPost from './ModalAddPost';


const SharePost = () => {
    const [showModal, setShowModal] = useState(false);

    const openShareFoodScreen = () => {
        console.log('Share food screen');
        setShowModal(true);
        console.log(showModal);
    }

    const handleAddPost = () => {
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
                    <Icons 
                        size={20}
                        color={'black'} 
                        handelClick={openShareFoodScreen}
                        iconStyle={styles.icon}
                        wrapperStyle={styles.iconsWrapper}
                     />
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
                            <Icons 
                                size={20}
                                color={'black'} 
                                handelClick={openShareFoodScreen}
                                iconStyle={styles.icon}
                                wrapperStyle={styles.iconsWrapper}
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
        width: windowWidth/1.1,
        height: windowHeight / 1.30,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
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

  export default SharePost;


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