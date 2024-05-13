import React, { useEffect, useState, useContext } from 'react';
import {View, Text, StatusBar,StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView} from "react-native";
import { useRoute } from '@react-navigation/native';
import {COLORS} from '../../styles/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { database } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MsgComponent from "../../components/chat/MsgComponent";
import { Chat, addChat, fetchChat } from '../../FirebaseFunctions/collections/chat';
import { Message,fetchMessages, addMessage, startListeningForMessages } from '../../FirebaseFunctions/collections/message';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../FirebaseFunctions/OpeningComponentsInPhone';
import { useRef } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import ImageGallery from '../../components/chat/ImageGallery';



const SingleChat = ({ navigation }) => {
    const route = useRoute();
    const { user, logout } = useContext(AuthContext);
    const receiverData = route.params.receiverData;
    const userData = route.params.userConnected; 
    const [allMessages, setAllMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const [images, setImages] = useState([]);
    const chatContainerRef = useRef(null);


    useEffect(() => {
        chatContainerRef.current?.scrollToEnd({ animated: true })
        let unsubscribe;
        
        const listener = async () => {
            unsubscribe = await startListeningForMessages(receiverData.roomID, setAllMessages);
        };

        listener();
        
        return () => unsubscribe(); // Call the unsubscribe function if it exists            
    }, [receiverData.roomID]);

   
    const sendMsg = async () => {
        if (msg === '' && images.length === 0) return;
        console.log('sendMsg, msg:', msg, 'images:', images, 'userData.id:', userData.id, 'receiverData.id:', receiverData.id)
        const message = new Message(msg, images, userData.id, receiverData.id);
        console.log('sendMsg, message:', message);
        await addMessage(message, receiverData.roomID, userData, receiverData.id, setMsg, setImages);
        console.log('\nsendMsg, Message: ', message);
        setMsg('');
        setImages([]);
    }



    const onPressAttach = () => {
        console.log('Attach file');
        openGalereAndSelectImages(setImages);
        console.log('Images uri', images);
    }



    const handleOpenCamera = async () => {
        console.log('Open camera');
        openCameraAndTakePicture(setImages);
        console.log('Images uri', images);
    }


    
    return (
        <View style={styles.container}>
        
        <FlatList
                ref={chatContainerRef}
                onContentSizeChange={() =>
                    chatContainerRef.current?.scrollToEnd({ animated: true })
                }
                keyExtractor={(item, index) => index.toString()}
                data={allMessages}
                renderItem={({ item }) => (
                    <MsgComponent item={item} />
                )}
            />
            
            
            
            <View style={styles.containerFooter}>
                <TouchableOpacity style={styles.icon} onPress={onPressAttach}>
                <MaterialIcons name="attach-file" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon} onPress={handleOpenCamera}>
                <MaterialCommunityIcons name="camera" size={24} />
                </TouchableOpacity>
                
                <View style={styles.windowSend}>
                        <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TextInput
                                autoFocus={true}
                                placeholder='Send message...'
                                onChangeText={val => setMsg(val)}
                                multiline={true}
                                numberOfLines={5}
                                value={msg}
                                />
                        </ScrollView>
                </View>

                <MaterialCommunityIcons name="send" onPress={sendMsg} size={25} style={styles.send} />
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      marginTop:  5,
      width: '100%',
      height: '100%'  ,
    },
    containerFooter: {
        height: windowHeight/10,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        padding: 5,
        bottom: 5,
        backgroundColor: COLORS.headerChat,
      },
      windowSend: {
        flex: 1,
        height: windowHeight/13,
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0,
        padding: 9,
        marginLeft: 5,
        marginVertical: 2,
        width: windowWidth / 1.45,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      },
    icon:{
        margin: 4,
    },
    send:{
         marginLeft: 10,
         marginTop:5  
      },
      msgBox :{
        marginHorizontal: 10,
        minWidth: 80,
        maxWidth: '80%',
        marginVertical: 5,
        padding: 6,
        borderRadius: 8,
        margin: 10,
    },
    timeText: {
        fontSize: 10,
        paddingTop:4,
        alignSelf: 'flex-end',
    },
    dayview: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 10
    },
    TriangleShapeCSS: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 5,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    left: {
        backgroundColor: COLORS.messageNotME,
        alignSelf: 'flex-start',
    },
    right: {
        backgroundColor: COLORS.theme,
        alignSelf: 'flex-end',

    },
  });
  
  
export default SingleChat;