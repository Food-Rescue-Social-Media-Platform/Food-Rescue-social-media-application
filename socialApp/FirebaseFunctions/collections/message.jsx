import { ref ,update,child ,push,onValue, onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export class Message {
    constructor(message, from, to, msgType) {
        if (!message || !from || !to || !msgType) {
        throw new Error("message, from, to, and msgType are required for a new message!");
        }
        this.message = message;
        this.from = from;
        this.to = to;
        this.sentTime = serverTimestamp();
        this.msgType = msgType;
    }
}


export async function addMessage(message, roomID, sender, receiverId) {
    try {
        const messageData = {
            message: message.message,
            from: message.from,
            to: message.to,
            sentTime: message.sentTime,
            msgType: message.msgType,
        };

        const newPostKey = push(child(ref(db), 'messages')).key;
        const updates = {};

        updates['messages/' + roomID + '/' + newPostKey] = messageData;

        update(ref(db), updates).then(() => {
            // console.log('Message sent successfully');
            // const updateChat = {
            //     lastMsg: message.message,
            //     sendTime: messageData.sentTime,
            // }

            // update(ref(db, 'chatsList/' + sender.id + '/' + receiverId),( updateChat))
            // update(ref(db, 'chatsList/' +  receiverId + '/' + sender.id ),(updateChat)); 
        
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    } catch (error) {
        console.error("Error adding message:", error.message);
    }
}



export function listeningToNewMessages(roomID, callback) {
    try {
        console.log('roomID: ', roomID);
        const docRef = ref(db, "messages", roomID);
        console.log('docRef: ', docRef);
        let unsubscribe; // Store unsubscribe function

        unsubscribe = onChildAdded(docRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Messages: ', Object.values(data));

            callback(Object.values(data));
        });

        return unsubscribe;
    } catch (error) {
        console.log('Error fetching document: ', error);
        callback(null);
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