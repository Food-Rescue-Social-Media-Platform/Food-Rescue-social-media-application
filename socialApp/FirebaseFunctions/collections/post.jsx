import { addDoc, setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'; 
import { database } from '../../firebase.js';

// Post constructor
export class Post {
    constructor(userId, body, timeDelivery, category="other", location="", phoneNumber="", images=[]) {
        // Set default values (if applicable)
        if(!body || !userId) {
           throw new Error("body and userIid are required for a new post!");
        }

        this.userId = userId;
        this.body = body;
        this.timeDelivery = timeDelivery;
        this.category = category;
        this.images = images; 
        this.status = "active";
        this.location = location ;
        this.phoneNumber = phoneNumber;
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