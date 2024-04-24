import { addDoc, setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'; 
import { database } from '../../firebase.js';

// Post constructor
export class Post {
    constructor(userId,userName, postText, deliveryRange, category="other", location="", phoneNumber="", postImg=[]) {
        // Set default values (if applicable)
        if(!postText || !userId) {
           throw new Error("body and userIid are required for a new post!");
        }
        
        this.userId = userId;
        this.userName = userName;
        this.postText = postText;
        this.deliveryRange = deliveryRange;
        this.category = category;
        this.postImg = postImg; 
        this.status = "active";
        this.location = location ;
        this.phoneNumber = phoneNumber;
        this.firstName = "";
        this.lastName = "";
        this.userImg = "";
        this.createdAt = serverTimestamp();       
    }
}
  
 export async function addPost(post) {
    try {
      const postData = {
        userId: post.userId,
        body: post.body,
        timeDelivery: post.timeDelivery,
        category: post.category,
        images: post.images, // Assuming image URLs are stored as strings
        status: post.status,
        location: post.location,
        phoneNumber: post.phoneNumber,
        createdAt: post.createdAt,
      };

      const docRef = await addDoc(collection(database, "posts") ,postData);
      console.log("Post added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
  }