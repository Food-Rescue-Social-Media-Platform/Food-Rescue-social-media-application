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
import { useSelector } from 'react-redux';

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
    const sender_data = useSelector(state => state.user.userData);
    
    const receiverId = route.params?.receiver;
    
    // console.log('receiverId: ', receiverId);
    console.log('sender_data: ', sender_data);

    const [ sender, setSender ] = useState(sender_data);
    const [ receiver, setReceiver ] = useState({});
    const [ chatCreated, setChatCreated ] = useState(false);  

    useEffect(() => {
        fetchUser();
        // fetchData();
    }, [])
    
    const fetchUser = async () => { 
        try {     
            const docRef = doc(database, "users", receiverId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                let receiverTemp = docSnap.data();
                receiverTemp.id = receiverId;
                console.log("Document data:", receiverTemp);
             setReceiver(receiverTemp);
            } else {
             console.log("No such document!");
            }
        } catch (error) {
       ;
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
        console.log('senderId', sender.id);
        console.log('receiverId', receiver.id);
        console.log('sender', sender);  
        console.log('receiver', receiver);
        try{
            set(ref(db, 'chatsList/' + sender.id + '/' + receiver.id),
            {
                sender: sender.id ,
                receiver: receiver.id,
                image:"https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg",
                emailId: receiver.email,
                lastMsg: "",
            })
            set(ref(db, 'chatsList/' +  receiver.id + '/' + sender.id ),
            {
                sender: receiver.id,
                receiver: sender.id,
                image: "https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg",
                emailId: sender.email,
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