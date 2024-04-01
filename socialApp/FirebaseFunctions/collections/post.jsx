import { addDoc, setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'; 
import { database } from '../../firebase.js';

// Post constructor
export class Post {
    constructor(body, userIid, category="other", location="", phoneNumber="", images=[]) {
        // Set default values (if applicable)
        if(!body || !userIid) {
           throw new Error("body and userIid are required for a new post!");
        }

        this.body = body;
        this.userIid = userIid;
        this.category = category;
        this.image = images; 
        this.status = "active";
        this.location = location ;
        this.phoneNumber = phoneNumber ;
        this.createdAt = serverTimestamp();       
    }
}
  
  // Add Post function
  export async function addPost(post) {
    try {
      // // Validate data types
      // if (typeof post.body !== "string" || typeof post.userIid !== "number" ||
      //     typeof post.category !== "string" || !Array.isArray(post.image) ||
      //     typeof post.status !== "string" || typeof post.location !== "string" ||
      //     typeof post.phoneNumber !== "string") {
      //   throw new Error("Invalid data types for post properties!");
      // }
  
      // Additional data validation (optional):
      // - Validate category against a whitelist (if applicable)
      // - Validate phone number format using a regular expression
  
      // Get Firestore collection reference
      // const postsCollectionRef = collection(database, "posts");
  
      // // Add the post to the collection
      // const docRef = await addDoc(postsCollectionRef, post);
      const postData = {
        body: post.body,
        userIid: post.userIid,
        category: post.category,
        image: post.image, // Assuming image URLs are stored as strings
        status: post.status,
        location: post.location,
        phoneNumber: post.phoneNumber,
        createdAt: post.createdAt,
      };

      const docRef = await addDoc(collection(database, "posts") ,postData);

      // Log success
      console.log("Post added with ID:", docRef.id);
    } catch (error) {
      // Log error message
      console.error("Error adding post:", error.message);
    }
  }