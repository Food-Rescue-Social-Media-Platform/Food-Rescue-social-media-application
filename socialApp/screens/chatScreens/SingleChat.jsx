import React, { useEffect, useState, useContext } from 'react';
import {View, Text, StatusBar,StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView} from "react-native";
import { useRoute } from '@react-navigation/native';
import {COLORS} from '../../styles/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { database } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import  uuid from 'react-native-uuid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MsgComponent from "../../components/chat/MsgComponent";
import { Chat, addChat, fetchChat } from '../../FirebaseFunctions/collections/chat';
import { Message,fetchMessages, addMessage, startListeningForMessages } from '../../FirebaseFunctions/collections/message';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../FirebaseFunctions/OpeningComponentsInPhone';
import { useRef } from 'react';
import { ref ,update,child ,set,push,onValue, onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../navigation/AuthProvider';




const SingleChat = ({navigation}) => {
    const { user, logout } = useContext(AuthContext);
    const route = useRoute();
    const receiverId = route.params.receiverId;
    const [sender, setSender] = useState();
    const [ receiver, setReceiver] = useState();
    const [ allMessages, setAllMessages ] = useState([]);
    const [ msg, setMsg] = useState('');
    const [images, setImages] = useState([]);
    const [ roomId, setRoomId ] = useState('');
    const chatContainerRef = useRef(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);


    useEffect(() => {
      const fetchData = async () => {
            // Fetch the roomID
            await fetchRoomId();

            // fetch all existing messages
            fetchMessages(roomId, setAllMessages, setHasMoreMessages);

            const docRef = ref(db, "messages/" + roomId);
           
            // Listen to new messages
            const unsubscribe = startListeningForMessages(roomId, setAllMessages);

            return () => {
                if (unsubscribe) unsubscribe(); // Call the unsubscribe function if it exists
            };
      }
      fetchData();       
    }, [roomId]);


    const fetchRoomId = async () => {
        let sender = await fetchUser(user.uid);
        let receiver = await fetchUser(receiverId);

        if (receiver !== null && sender !== null) {

            receiver.id = receiverId;
            setReceiver(receiver);
            sender.id = user.uid;
            setSender(sender);

            fetchChat('chatsList/' + sender.id + '/' + receiver.id, (chat) => {

            // if chat is not found, create a new chat
            if(chat === null){
                createNewChat();
                return;
            }
            else{
                setRoomId(chat.roomID);
            }});
        }
    }
    

    const createNewChat = async () => {
        // generate a new roomID
        const roomID = uuid.v4();

        // create a new chat
        const chat = new Chat(roomID, sender, receiver);
        await addChat(chat, 'chatsList/' + sender.id + '/' + receiver.id);
           
        // create a new chat for the receiver
        const chat2 = new Chat(roomID, receiver, sender);
        await addChat(chat2, 'chatsList/' +  receiver.id + '/' + sender.id);                          
           
        setRoomId(roomID); 
    }


    const sendMsg = async () => { 
        if(msg === '' && images == '') return;

        const message = new Message(msg, images, sender.id, receiver.id);
        console.log('Message: ', message);
        await addMessage(message, roomId, sender, receiver.id);
        
        setMsg('');
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
                        chatContainerRef.current?.scrollToEnd({ animated: false })
                    }            
                    keyExtractor={(item, index) => index.toString()}
                    data={allMessages}
                    refreshing={true}
                    renderItem={({item}) => {
                    return(    
                         <MsgComponent  
                           item={item} 
                         />
                     )}}
                />
            
                <View style={styles.containerFooter}>  
                    <TouchableOpacity style={styles.icon} onPress={onPressAttach}>
                        <MaterialIcons name="attach-file" size={24} /> 
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.icon} onPress={handleOpenCamera}>
                        <MaterialCommunityIcons name="camera" size={24} />  
                    </TouchableOpacity> 
        
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.windowSend} >
                            <TextInput
                                placeholder='Send message...'
                                onChangeText={val => setMsg(val)}
                                multiline={true}
                                numberOfLines={4}
                            >
                            {msg}
                            </TextInput>
                        </View>
                        </ScrollView>
                        
                    <MaterialCommunityIcons name="send" onPress={sendMsg} size={25} style={styles.send}/>          
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
    containerFooter :{
        height: windowHeight /10,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        bottom: 0,
        backgroundColor: COLORS.headerChat,
    },
    icon:{
        margin: 4,
    },
    windowSend :{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0,
        padding: 9,
        marginLeft: 5,
        // height: windowHeight / 12,
        width: windowWidth / 1.45,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
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
        // backgroundColor: COLORS.white,
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
  

const fetchUser = async (id) => {
    try{
    const docRef = doc(database, "users", id);
    const docSnap = await getDoc(docRef);
    console.log('docSnap: ', docSnap.data());
    if(!docSnap.exists()) {
        return null;
    }
    return docSnap.data();
 } catch (error) {
    console.error("Error getting document:", error);
    return null;
 }
}

  
export default SingleChat;