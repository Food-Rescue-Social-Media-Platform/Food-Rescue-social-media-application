import React, { useEffect, useState } from 'react';
import {View, Text, StatusBar,StyleSheet, FlatList, TextInput} from "react-native";
import { useRoute } from '@react-navigation/native';
import {COLORS} from '../../styles/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { database } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import  uuid from 'react-native-uuid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MsgComponent from "../../components/chat/MsgComponent";
import { Chat, addChat, fetchChat } from '../../FirebaseFunctions/collections/chat';
import { Message, addMessage, listeningToNewMessages } from '../../FirebaseFunctions/collections/message';
import { ref ,update,child ,push,onValue, onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';



const SingleChat = ({navigation}) => {
    // const route = useRoute();
    // const receiverId = route.params?.receiverId || '';
    const receiverId = 'zsERzWzcK7cp50c1bzIoSqxpBsA2';
    const sender = useSelector(state => state.user.userData);
    const [ receiver, setReceiver] = useState();
    const [ allMessages, setAllMessages ] = useState([]);
    const [ msg, setMsg] = useState('');
    const [ roomId, setRoomId ] = useState('');

    useEffect(() => {
      const fetchData = async () => {
            // Fetch the roomID
            await fetchRoomId();

            const docRef = ref(db, "messages/" + roomId);
            console.log('docRef: ', docRef);
    
            onChildAdded(docRef, (snapshot) => {
                const data = snapshot.val();
              
                // Data validation (optional but recommended)
                if (!data || typeof data !== 'object') {
                  console.error('Invalid data format in new message:', data);
                  return; // Or handle the error gracefully, e.g., by ignoring the message
                }
              
                const newMessages = Object.values(data);
              
                // Update state with new messages
                setAllMessages((prevMessages) => [...prevMessages, ...newMessages]);
              
                // Additional actions (optional)
                // - Trigger UI updates to display the new messages
                // - Perform further processing on the new messages as needed
              });
    

            // Listen to new messages
            // const unsubscribe = listeningToNewMessages(roomId, (newMsg) => {
            //     if(newMsg !== null && newMsg !== undefined) {
            //         console.log('newMsg: ', newMsg);
            //         setAllMessages((prevMessages) => [prevMessages, ...newMsg]);
            //         console.log('allMessages: ', allMessages);
            //     }
            // });
            // return () => unsubscribe(); // Call unsubscribe in cleanup
      }
      fetchData();       
    }, []);


    const fetchRoomId = async () => {
        let receiver = await fetchUser(receiverId);

        if (receiver !== null) {

            receiver.id = receiverId;

            setReceiver(receiver);
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
        if(msg === '') return;
    
        const message = new Message(msg, sender.id, receiver.id, 'text');
        await addMessage(message, roomId, sender, receiver.id);
        setMsg('');
    }


    return (
           <View style={styles.container} >
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={allMessages}
                renderItem={({item}) => {
                    // console.log('item: ', item.from);
                    // console.log('item: ', item.message);
                    // console.log('item: ', item.sendTime);
                    return(
                        <MsgComponent    
                            sender={item.from}
                            message={item.message}
                            sendTime={"22:31"}
                         />
                    )
                }}
            />
           
            <View style={styles.containerFooter}>  
                <Octicons name="smiley" size={24} style={styles.smiley}/> 
                <MaterialIcons name="attach-file" size={24} style={styles.attachment}/>            
                    <View style={styles.windowSend} >
                        <TextInput
                        placeholder='Send message...'
                        onChangeText={val => setMsg(val)}
                        >
                        {msg}
                        </TextInput>
                    </View>
                    
                <MaterialCommunityIcons name="send" onPress={sendMsg} size={25} style={styles.send}/>          
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      marginTop:  5,
      height: windowHeight - StatusBar.currentHeight - windowHeight / 11  ,
    },
    containerFooter :{
        height: windowHeight /12,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: COLORS.headerChat,
    },
    attachment:{
        padding: 5,
    },
    smiley:{
        padding: 5,
    },
    windowSend :{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: windowWidth / 1.5,
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
    iconView: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: COLORS.themecolor,
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
  

const fetchUser = async (receiverId) => {
    try{
    const docRef = doc(database, "users", receiverId);
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