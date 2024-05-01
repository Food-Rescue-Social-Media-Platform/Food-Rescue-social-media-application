
import { ref , set , onValue } from 'firebase/database';
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export class Chat {
  constructor(roomID, sender, receiver) {
      if(!roomID || !sender || !receiver) {
        throw new Error("roomID, sender, receiver are required for a new chat!");
      }
      this.roomID = roomID,
      this.id = receiver.id,
      this.sender = sender.firstName + " " + sender.lastName,
      this.receiver = receiver.firstName + " " + receiver.lastName,
      this.image = receiver.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAiRQwXf9TTpgIOStvwMpdGBeEQecgottZew&usqp=CAU',
      this.emailId = receiver.email,
      this.lastMsg = "",
      this.createdAt = serverTimestamp(); 
  }
}

export async function addChat(chat, path) {
  try {
    const chatData = {
      roomID: chat.roomID,
      id: chat.id,
      sender: chat.sender,
      receiver: chat.receiver,
      image: chat.image,
      emailId: chat.emailId,
      lastMsg: chat.lastMsg,
      createdAt: chat.createdAt,
    };

    set(ref(db, path), chatData);

} catch (error) {
    console.error("Error adding chat:", error.message);
  }
}


export function fetchChat(path, callback) {
  try {
    const docRef = ref(db, path);
    onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error("Error fetching document:", error);
      callback(null); // Call the callback with null on error
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    callback(null); // Call the callback with null on error
  }
}