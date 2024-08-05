import { database } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const HISTORY_POSTS = 5;

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
export async function addPostToFeedFollowers(followersUsersIds, postId) {
    try{
        // loop through the followingUserList and add the post to their feed
        console.log("followingUserList", followersUsersIds);
        followersUsersIds?.forEach(async (followerUser) => {
            const docRef = doc(database, "feedFollowers", followerUser);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let feedData = docSnap.data();
                if (!feedData.posts.includes(postId)) {
                    feedData.posts.push(postId);
                    await setDoc(doc(database, "feedFollowers", followerUser), feedData);
            }}
      });
    } catch (error) {
        console.error("addPostToFeedFollowers, Error adding post to feed:", error.message);
    }; 
}

/*
@userFollowId: userId of the user who is followed 
@userfollowerId: userId of the user who is following
*/ 

export async function fetchHistoryPostsFromUserToUserFollow(userFollowedData, userfollowerId) {
    
    // loop through the posts of the userFollowedData and add the post to the feed of the userfollowerId
    try{
        const docRef = doc(database, "feedFollowers", userfollowerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let feedData = docSnap.data();
            for(let i = 0; i < userFollowedData.postsId.length && i < HISTORY_POSTS ; i++) {
                const postId = userFollowedData.postsId[i];
                if (!feedData.posts.includes(postId)) {
                    feedData.posts.push(postId);
                }
            }
            await setDoc(doc(database, "feedFollowers", userfollowerId), feedData);
        }
    }
    catch (error) {
        console.error("fetchHistoryPostsFromUserToUserFollow, Error adding post to feed:", error.message);
    };    
}

export function fetchFeedFollowers(userId, callback) {}


export function removePostFromFollowers(userId, postId) {}





