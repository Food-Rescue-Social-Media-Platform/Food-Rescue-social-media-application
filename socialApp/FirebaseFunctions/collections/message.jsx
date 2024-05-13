import { ref ,update,child ,set,push,onValue,serverTimestamp , onChildChanged,onChildAdded, onChildRemoved } from "firebase/database";
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



export async function fetchMessages(roomID, setAllMessages,  setHasMoreMessages) {
    try {
        const docRef = ref(db, 'messages/' + roomID);
        console.info('Fetching messages, for room:', roomID);
        onValue(docRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.info('fetchMessages, No data found');
                return;
            }

            console.info('fetchMessages, Messages is: ', data);
            setAllMessages((oldMessages) => [...oldMessages, ...Object.values(data)]);
        }, {
            onlyOnce: true
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}



export async function addMessage(message, roomID, sender, receiverId) {
    try {
        console.log("addMessage, room: ", roomID, "message: ", message, "sender: ", sender, "receiverId: ", receiverId);
        push(ref(db, `messages/${roomID}`), message);

        // Update the chat documents with the new message
        const updateChat = {
            lastMsg: message.message? message.message: '📷 Image',
            sentTime: message.sentTime,
        };

        await update(ref(db, 'chatsList/' + sender.id + '/' + receiverId), updateChat);
        await update(ref(db, 'chatsList/' + receiverId + '/' + sender.id), updateChat);

        console.log('addMessage, Message sent successfully');
    } catch (error) {
        console.error("addMessage, Error adding message:", error.message);
    }
}


export async function startListeningForMessages(roomId, setAllMessages) {
    try {
        console.info('Listening for new messages in room:', roomId);
        const docRef = ref(db, `messages/${roomId}`);
        const unsubscribe = onChildAdded(docRef, (snapshot) => {
            const data = snapshot.val();
            console.log('startListeningForMessages, New message:', data);
            setAllMessages((prevMessages) => [...prevMessages, data]);
        });

        // Return the unsubscribe function for cleanup
        return unsubscribe;
    } catch (error) {
        console.error('startListeningForMessages, Error fetching messages:', error);
    }
}
