import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { ref  } from 'firebase/database';
import { db , database} from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { onValue } from '@firebase/database';
import { useNavigation } from '@react-navigation/native';


const Chat = () => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.user.userData);
    console.log('HomeScreen/userData: ', userData)

    const handleClickChat = () => {
       navigation.navigate('HomeChat');
    }

    const createChat = () => {
        const receiverId = 'uNwhQOcidogqWCR5FU2Y6Wo003t1';
        navigation.navigate('SingleChat', {chatData:'', receiverId: receiverId});
        // fetchUser(receiverId);
        // fetchChat(receiverId);
    }

    // const fetchChat = async (receiverId) => {
    //     try{
    //      const docRef = ref(db, "chatsList/" + userData.id + '/' + receiverId);
    //      onValue(docRef, (snapshot) => {
    //         const data = snapshot.val();
    //         if(!data) {
    //             fetchUser(receiverId);
    //             return;
    //         };
    //         console.log('data: ', data);
    //         navigation.navigate('SingleChat', {chatData: data, receiverData: ''});
    //      });
    //     } catch (error){
    //       console.log('Error fetching document: ', error);
    //     }
    //   };
    
    // const fetchUser = async (receiverId) => { 
    //     try {     
    //         const docRef = doc(database, "users", receiverId);
    //         const docSnap = await getDoc(docRef);
            
    //         if (docSnap.exists()) {
    //             let receiverTemp = docSnap.data();
    //             receiverTemp.id = receiverId;
    //             console.log("HomeScreen/receiverTemp:", receiverTemp);
    //             navigation.navigate('SingleChat', {chatData:'', receiverData: receiverTemp})
    //         } else {
    //          console.log("No such user!");
    //         }
    //     } catch (error) {
    //          console.error("Error fetching document:", error);
    //     }
    // }
   
    // <Button title='Chat' onPress={handleClickChat}/>
    return (
        <View style={styles.container}>
        <Button title='Create Chat' onPress={createChat}/>
        </View>
    );
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
});

