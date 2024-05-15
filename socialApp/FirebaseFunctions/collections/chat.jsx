
import { ref , set , onValue } from 'firebase/database';
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
      this.image = receiver.profileImg,
      this.emailId = receiver.email,
      this.lastMsg = "",
      this.createdAt = new Date();; 
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
    console.error("addChat, Error adding chat:", error.message);
  }
}


export function fetchChat(userId, receiverId, callback) {
  try {
    const docRef = ref(db, "chatsList/" + userId + "/" + receiverId);
    onValue(docRef, (snapshot) => {
      const data = snapshot.val();1
      callback(data);
    }, (error) => {
      console.error("fetchChat, Error fetching document:", error);
      callback(null); // Call the callback with null on error
    });
  } catch (error) {
    console.error("fetchChat, Error fetching document:", error);
    callback(null); // Call the callback with null on error
  }
}


export function getListChats(userId, setListChats){
  const docRef = ref(db, "chatsList/" + userId);
  console.log('docRef: ', docRef);
  onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if(!data) return console.log('getListChats, No data found');
      console.log('getListChats, chatList: ', Object.values(data));
      setListChats(Object.values(snapshot.val()));//todo
  });
}