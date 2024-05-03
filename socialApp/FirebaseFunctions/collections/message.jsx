import { ref ,update,child ,set,push,onValue, onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export class Message {
    constructor(message, images, from, to) {
        if (!from || !to ) {
        throw new Error("message, from, and to are required for a new message!");
        }
        this.message = message;
        if(images) this.images = images;
        this.from = from;
        this.to = to;
        this.sentTime = serverTimestamp();
    }
}



export async function fetchMessages(roomID, setAllMessages,  setHasMoreMessages, setCurrentPage)) {
    try {
        const docRef = ref(db, 'messages/' + roomID);
        onValue(docRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.log('No data found');
                setAllMessages([]);
                return;
            }
            console.log('Messages: ', data);
            setAllMessages(Object.values(data));
        }, {
            onlyOnce: true
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
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
  
      const unsubscribe = onChildChanged(docRef, (snapshot) => {
        const data = snapshot.val();
        const newMessages = Object.values(data);
        console.log('New messages:', newMessages);
        setAllMessages((prevMessages) => [...prevMessages, ...newMessages]);
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