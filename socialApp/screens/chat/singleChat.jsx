import React, { useEffect, useState } from 'react';
import {View, StatusBar,StyleSheet, FlatList, TextInput} from "react-native";
import { useRoute } from '@react-navigation/native';
import {COLORS} from '../../styles/colors';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { Button } from 'react-native-elements';
import { db } from '../../firebase';
import { ref , set , child, push, update } from 'firebase/database';
import { useSelector } from 'react-redux';
import  uuid from 'react-native-uuid';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MsgComponent from "../../components/chat/MsgComponent";


const DATA = [
    {
        massage: 'Yes Ofcourse..',
        type: 'sender',
        id: 1,
        sender: 'me'
    },
    {
        massage: 'How are You ?',
        type: 'sender',
        id: 2,
        sender: 'me'
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender' ,  
        id: 3,
        sender: '33'
    },
    {
        massage: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver',
        id: 4,
        sender: '33'
  
    },
    {
        massage: 'could you plz change the design...',
        type: 'receiver',
        id: 5,
        sender: '33'
  
    },
    {
        massage: 'How are You ?',
        type: 'sender',
        id: 6,
        sender: '33'
  
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender',
        id: 7,
        sender: 'me'
  
    },
    {
        massage: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver',
        id: 8,
        sender: '33'
  
    },
    {
        massage: 'could you plz change the design...',
        type: 'receiver',
        id: 9,
        sender: '33'
  
    },
    {
        massage: 'How are You ?',
        type: 'sender',
        id: 10,
        sender: '33'
  
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender',
        id: 11,
        sender: '33'
  
    }
]



const SingleChat = ({navigation}) => {
    const route = useRoute();
    const chatData = route.params?.chatData || '';
    const receiver = route.params?.receiverData || '';
    console.log('SingleChat/chatData: ', chatData);
    console.log('SingleChat/receiver: ', receiver);
    const sender = useSelector(state => state.user.userData);
    const [ chatCreated, setChatCreated ] = useState(false);  
    const [ msg, setMsg] = useState('');
    const [ disable, setDisable] = useState(false);
    const [ allChat, setAllChat ] = useState([]);
    const [ roomId, setRoomId ] = useState('');

    useEffect(() => {
        createNewChat();
    }, [])
    


    const renderItem = ({ item }) => {
      return (
        <View style={styles.msg}>
        <MsgComponent
          sender={item.sender}
          message={item.massage}
          item={item}
          sendTime={'20:34'}
        />
        </View>
      );
    };

    const createNewChat = () => {
        if(chatData !== ''){
            setRoomId(chatData.roomID);
            return;
        }
        const roomID = uuid.v4();
        console.log('roomID: ', roomID);
        try{
            set(ref(db, 'chatsList/' + sender.id + '/' + receiver.id),
            {
                roomID,
                id: receiver.id,
                sender: sender.firstName + " " + sender.lastName,
                receiver: receiver.firstName + " " + receiver.lastName,
                image:receiver?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAiRQwXf9TTpgIOStvwMpdGBeEQecgottZew&usqp=CAU',
                emailId: receiver.email,
                lastMsg: "",
            })
            set(ref(db, 'chatsList/' +  receiver.id + '/' + sender.id ),
            {
                roomID,
                id: sender.id,
                sender: receiver.firstName + ' ' + receiver.lastName,
                receiver: sender.firstName + ' ' + sender.lastName,
                image: sender?.image || "https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg",
                emailId: sender.email,
                lastMsg: "",
            });


            setRoomId(roomID);
            setChatCreated(true);
       } catch (error) {
            console.error("Error adding document: ", error);
       } 

    }

    const sendMsg = () => {

        if(msg === ''){
           return;
        }

        let msgData = {
           message: msg,
           from: sender.id,
           to: receiver?.id || chatData.id,
           sentTime: moment().format(),
           msgType: 'text',
        }
        console.log('msg: ', msgData);
        
       // Get a key for a new Message.
        const newPostKey = push(child(ref(db), 'messages')).key;
        msgData.id = newPostKey;
          set(ref(db, 'messages/' + roomId + '/' + newPostKey),
          ( msgData)).then(() => {
            update(ref(db, 'chatsList/' + sender.id + '/' + chatData.id),
            {
                lastMsg: msg,
            })
            update(ref(db, 'chatsList/' +  chatData.id + '/' + sender.id ),
            {
                lastMsg: msg
            });
           

          }).catch((error) => {
            console.error("Error adding document: ", error);
          }
          );

        setMsg('');
    }
    
    // { chatData === '' ? (<Button title='Create Chat' onPress={createNewChat}/>): null}
    return (
        <View>
            <View style={styles.container} >
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                /> 
            </View>
           
            <View  style={styles.containerFooter}>  
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
      marginLeft: windowWidth/14,
      marginRight: windowWidth/14,
      height: windowHeight - StatusBar.currentHeight - windowHeight / 11 - windowHeight / 12,
    },
    containerFooter :{
        height: windowHeight / 12,
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
        // justifyContent: 'space-between',
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
  });
  
export default SingleChat;