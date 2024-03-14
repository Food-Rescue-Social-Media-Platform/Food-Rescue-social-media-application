import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {View, StatusBar,StyleSheet, FlatList} from "react-native";
import { useState } from 'react';
import ChatHeader from '../../components/header/ChatHeader';
import FooterChat from '../../components/footer/FooterChat';
import {COLORS} from '../../styles/colors';
import MsgComponent from "../../components/chat/MsgComponent";
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { Button } from 'react-native-elements';
import { db } from '../../firebase';
import { ref , set } from 'firebase/database';
import { database } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore'; 


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

const SingleChat = () => {
    const route = useRoute();
    const senderId = route.params?.connection?.sender;
    const receiverId = route.params?.connection?.receiver;
    const [ sender, setSender ] = useState(route.params?.connection?.sender);
    const [ receiver, setReceiver ] = useState(route.params?.connection?.receiver);
    const [ chatCreated, setChatCreated ] = useState(false);  

    useEffect(() => {
        fetchUsers();
    }, [])
    
    // console.log(route.params);
    const fetchUsers = async () => { 
        try {     
            const docRef = doc(database, "users", receiverId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
             console.log("Document data:", docSnap.data());
             setReceiver(docSnap.data());
            } else {
             console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }

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
        try{
            set(ref(db, 'chatsList/' + senderId + '/' + receiverId),
            {
                sender: senderId,
                receiver: receiverId,
                image:"https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg",
                emailId: receiver.email,
                lastMsg: "",
            });
            setChatCreated(true);
       } catch (error) {
            console.error("Error adding document: ", error);
       } 
    }
    
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
            { !chatCreated? (<Button title='Create Chat' onPress={createNewChat}/>): null}
            <FooterChat/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      marginTop:  5,
      marginLeft: windowWidth/14,
      marginRight: windowWidth/14,
      height: windowHeight - StatusBar.currentHeight - windowHeight / 11 - windowHeight / 12,
    }
  });
  
export default SingleChat;