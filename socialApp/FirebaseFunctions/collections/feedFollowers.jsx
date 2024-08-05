import { database } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export class FeedFollowers {
    constructor(userId) {
        if(!userId ) {
        throw new Error("userId are required for a new feed!");
        }
        this.userId = userId;
        this.posts = [];
    }
}

export async function addFeedFollowers(feedFollowers) {
    try {
        const feedData = {
            userId: feedFollowers.userId,
            posts: feedFollowers.posts,
        };
        await setDoc(doc(database, "feedFollowers", feedFollowers.userId), feedData);
    } catch (error) {
        console.error("addFeedFollowers, Error adding feed:", error.message);
    }
}

// add post to feed of following of user
export async function addPostToFeedFollowers(followingUserList, postId) {
    // try{
    //   followingUserList.forEach(async (followingUser) => {
    //     const docRef = ref(db, "feedFollowers/" + followingUser);
    //     await updateDoc(docRef, {
    //         posts: arrayUnion(postId),
    //     });
    //   })
    // } catch (error) {
    //     console.error("addPostToFeedFollowers, Error adding post to feed:", error.message);
    // }; 
}


export function fetchFeedFollowers(userId, callback) {}


export function removePostFromFollowers(userId, postId) {}





