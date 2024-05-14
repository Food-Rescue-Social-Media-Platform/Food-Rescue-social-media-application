import { addDoc, setDoc, doc, serverTimestamp, collection, deleteDoc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore'; 
import { database } from '../../firebase.js';

// Post constructor
export class Post {
    constructor(
         userId,
         userName,
         firstName,
         lastName,
         userImg,
         phoneNumber,
         postText,
         deliveryRange,
         category="other",
         postImg=[],
         location=""
        ) {
        if(!postText || !userId) {
           throw new Error("body and userIid are required for a new post!");
        }
        
        this.userId = userId;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userImg = userImg;
        this.phoneNumber = phoneNumber;
        this.postText = postText;
        this.deliveryRange = deliveryRange;
        this.category = category;
        this.postImg = postImg; 
        this.status = "active";
        this.location = location;
        this.postDistance = "";
        this.createdAt = serverTimestamp();       
    }
}
  
 export async function addPost(post) {
    try {
      const postData = {
        userId : post.userId,
        userName : post.userName,
        phoneNumber : post.phoneNumber,
        firstName : post.firstName,
        lastName : post.lastName,
        userImg : post.userImg,
        postText : post.postText,
        deliveryRange : post.deliveryRange,
        category : post.category,
        postImg : post.postImg, 
        status : post.status,
        location : post.location,
        postDistance : post.postDistance,
        createdAt : post.createdAt 
      };
      console.log("Adding post to database...:", postData);

      const docRef = await addDoc(collection(database, "posts") ,postData);
      console.log("Post added with ID:", docRef.id);

      // Update user's postsId array
      const userRef = doc(database, 'users', post.userId);
      const userDocSnap = await getDoc(userRef);

      if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            await updateDoc(userRef, {
                postsId: userData.postsId ? [...userData.postsId, docRef.id] : [docRef.id],
                postsNum: userData.postsNum ? userData.postsNum + 1 : 1,
                earningPoints: userData.earningPoints ? userData.earningPoints + 3 : 3,
            });
      } else {
            console.error("User not found while adding post");
      }
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
}

export const deletePost = async (postId, postUserId) => {
    try {
        console.log("Deleting post with id: ", postId);
        const postRef = doc(database, 'posts', postId);
        const userRef = doc(database, 'users', postUserId);

        const userDocSnap = await getDoc(userRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            await updateDoc(userRef, {
                postsNum: userData.postsNum ? userData.postsNum - 1 : 0,
                earningPoints: userData.earningPoints ? userData.earningPoints - 3 : 0,
            });
        }

        await deleteDoc(postRef);
        await updateDoc(userRef, {
            postsId: arrayRemove(postId)
        });
    } catch (error) {
        throw error;
    }
}; 
