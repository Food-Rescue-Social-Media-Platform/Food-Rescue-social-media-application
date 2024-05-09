import { getDatabase, ref ,on,query, update,child, startAt, endAt, set,orderByKey, push, onValue, equalTo, get ,limitToLast,orderByChild, onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
import { doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const PAGE_SIZE = 10; 

export class Message {
    constructor(message, images, from, to) {
        if (!from || !to ) {
        throw new Error("message, from, and to are required for a new message!");
        }
        this.message = message;
        if(images) this.images = images;
        this.from = from;
        this.to = to;
        this.sentTime = Date.now();;
    }
}



export async function fetchMessages(roomID, setAllMessages, setHasMoreMessages, setStartMessageID, startMessageID) {
    try {  
         const messageRef = ref(db, 'messages/' + roomID);
         console.log("messageRef: ", messageRef);

         const snapshot = await get(messageRef).then((snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.log('No data found');
                setHasMoreMessages(false);
                return;
            }
            const messages = Object.values(data);
            // console.log('Object.values(data):', Object.values(data));
            setAllMessages((prevMessages) => [...prevMessages, ...messages]);
            setStartMessageID(Object.keys(data)[0]);
            setHasMoreMessages(messages.length < PAGE_SIZE ? false : true);
         }).catch((error) => {
            console.error('Error fetching messages:', error);
            });

        //  let snapshot;

        //  if(startMessageID !== null) {
        //     console.log('Start message ID is NOT NULL:', startMessageID);
        //     snapshot = await get(
        //      query(messageRef, endAt(startMessageID), orderByChild('sentTime'), limitToLast(10))
        //  );
        // }
        // else {
        //     console.log('Start message ID is NUll');
        //     snapshot = await get(
        //         query(messageRef, orderByChild('sentTime'), limitToLast(10))
        //      );
        // }
        //  const data = snapshot.val();
        //  if (!data) {
        //     console.log('No data found');
        //     setHasMoreMessages(false);
        //     return;
        //  }
        //  const messages = Object.values(data);
        //  console.log('Object.values(data):', Object.values(data));
        //  setAllMessages((prevMessages) => [...prevMessages, ...messages]);
        //  setStartMessageID(Object.keys(data)[0]);
        // //  console.log('\nObject.keys(data): ', Object.keys(data));

        // //  console.log('\nStart message ID:', Object.keys(data)[0]);
        //  setHasMoreMessages(messages.length < PAGE_SIZE ? false : true);
        } 
     
        catch (error) {
            console.error('Error fetching messages:', error);
        }
            // const query = orderByChild(docRef, 'sentTime');
            // const query2 = limitToLast(query, (currentPage + 1) * PAGE_SIZE);
            // const query3 = query2;
            // const snapshot = await get(query3);
            // const data = snapshot.val();
            // if (!data) {
            //     console.log('No data found');
            //     // setAllMessages([]);
            //     setHasMoreMessages(false);
            //     return;
            // }
            // const messages = Object.values(data);
            // console.log('Messages: ', messages);
            // setAllMessages((prevMessages) => [...prevMessages, ...messages]);
            // setCurrentPage(currentPage + 1);
            // setLastMessageKey(Object.keys(data)[0]);
        
    
       
      
        // onValue(docRef, (snapshot) => {
        //     const data = snapshot.val();
        //     if (!data) {
        //         console.log('No data found');
        //         setAllMessages([]);
        //         return;
        //     }
        //     console.log('Messages: ', data);
        //     setAllMessages(Object.values(data));
        // }, {
        //     onlyOnce: true
        // });
    
}



export async function addMessage(message, roomID, sender, receiverId) {
    try {
        const postListRef = ref(db, 'messages/'+ roomID);
        const newPostRef = push(postListRef);
        await set(newPostRef, message).then(async () => {
            console.log('Message sent successfully');
            const updateChat = {
                lastMsg: message.message,
                sendTime: message.sentTime,
            }

            await update(ref(db, 'chatsList/' + sender.id + '/' + receiverId),( updateChat))
            await update(ref(db, 'chatsList/' +  receiverId + '/' + sender.id ),(updateChat)); 
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });

    } catch (error) {
        console.error("Error adding message:", error.message);
    }
}



export async function startListeningForMessages(roomId, setAllMessages) {
    try {
 
      const docRef = ref(db, "messages/" + roomId);
    //   const unsubscribe= onChildAdded(docRef, (snapshot) => {
    //     const data = snapshot.val();
    //     const newMessages = Object.values(data);
    //     console.log('New messages:', newMessages);
    //     setAllMessages((prevMessages) => [...prevMessages, ...newMessages]);
    //   });
      const unsubscribe = onChildChanged(docRef, (snapshot) => {
        const data = snapshot.val();
        const newMessages = Object.values(data);
        const message = newMessages[newMessages.length - 1];
        console.log('New messages:', message);
        setAllMessages((prevMessages) => [...prevMessages, message]);
      });
  
      // Return the unsubscribe function for cleanup
     return unsubscribe;
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }



// export function listeningToNewMessages(roomID, callback) {
//     try {
//         const docRef = ref(db, "messages", roomID);
//         onValue(docRef, (snapshot) => {
//             const data = snapshot.val();
//             if (!data) {
//                 console.log('No data found');
//                 callback(null);
//                 return;
//             }
//             console.log('1 Messages: ', data);

//             console.log('2 Messages: ', Object.values(data));
//             callback(data);
//         });
//     } catch (error) {
//         console.log('Error fetching document: ', error);
//         callback(null);
//     }
   
// }