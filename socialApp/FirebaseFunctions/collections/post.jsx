import { addDoc, doc, serverTimestamp, collection,query, orderBy,where,limit, startAfter, startAt, endAt, getDocs, deleteDoc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore'; 
import { database } from '../../firebase.js';
import * as geofire from 'geofire-common';
import Toast from 'react-native-toast-message';
import { addPostToFeedFollowers } from './feedFollowers';

let PAGE_SIZE =10;
let PAGE_SIZE_POSTS_PROFILE = 5;

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
         category,
         postImg,
         location
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
        this.category = category || "Other";
        this.postImg = postImg;
        this.status = "waiting for rescue";
        this.coordinates = [location.latitude, location.longitude];
        this.geohash = geofire.geohashForLocation([location.latitude, location.longitude]);
        this.createdAt = serverTimestamp();       
    }
}
  
 export async function addPost(post) {
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
        coordinates : post.coordinates,
        geohash : post.geohash,
        createdAt : post.createdAt 
      };
      console.log("Adding post to database...:", postData);

      try{
        const docRef = await addDoc(collection(database, "posts") ,postData);
        console.log("Post added with ID:", docRef.id);

        // Update user's postsId array
        const userRef = doc(database, 'users', post.userId);
        const userDocSnap = await getDoc(userRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            addPostToFeedFollowers(userData.followersUsersId, docRef.id)
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
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Post deleted successfully.',
        });
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `Error deleting post: ${error.message}`,
        });
    }
}; 

export async function getPostsWithFiltersForWeb(userId, categories, lastVisible) {
    console.log("\ngetPosts with filters:", userId, categories, lastVisible);
    try {
        let q = query(
            collection(database, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(PAGE_SIZE)
        );

        if (categories && categories.length > 0) {
            q = query(q, where('category', 'in', categories));
        }

        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        }

        const querySnapshot = await getDocs(q);
        const posts = [];
        let lastVisibleDoc = null;

        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
            lastVisibleDoc = doc; // Keep track of the last visible document
        });

        if (posts.length < PAGE_SIZE) {
            lastVisibleDoc = null; // Stop loading more if fewer posts than the limit
        }

        console.log("posts with filters:", posts);
        return { posts, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw new Error("Firestore query failed. Ensure that the required indexes are created.");
    }
}

export async function getPostsWithFilters(center, radiusInKm, userId, categories, lastVisible) {
    if (!center || !radiusInKm) {
        console.error("Center and radius are required for fetching posts");
        return { posts: [], lastVisible: null};
    }
    const radiusInM = radiusInKm * 1000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    bounds.forEach(b => {
        let q;
        if(lastVisible){
            q = query(
                collection(database, 'posts'),
                where('geohash', '>=', b[0]),
                where('geohash', '<=', b[1]),
                orderBy('geohash'),
                orderBy('createdAt', 'desc'), // Assuming you want to order by creation date
                startAfter(lastVisible),
                limit(PAGE_SIZE)
            );
        } else {
            q = query(
                collection(database, 'posts'),
                where('geohash', '>=', b[0]),
                where('geohash', '<=', b[1]),
                orderBy('geohash'),
                orderBy('createdAt', 'desc'), // Assuming you want to order by creation date
                limit(PAGE_SIZE)
            );
        }

        if (categories && categories.length > 0) {
            q = query(q, where('category', 'in', categories));
        }

        promises.push(getDocs(q));
    });

    try {
        const snapshots = await Promise.all(promises);
        const posts = [];
        let lastVisibleDoc = null;
        let counter = 0; // count all the post also posts that are not in the radius

        snapshots.forEach((snap) => {
            snap.forEach((doc) => {
                // console.log("doc:", doc.data());
                const coordinates = doc.get('coordinates');

                if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                    console.error("Invalid coordinates array:", coordinates);
                    return;
                }

                const lat = parseFloat(coordinates[0]);
                const lng = parseFloat(coordinates[1]);

                if (isNaN(lat) || isNaN(lng)) {
                    console.error("Invalid coordinates:", { lat, lng });
                    return;
                }

                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;

                if (distanceInM <= radiusInM) {
                    posts.push({ id: doc.id, ...doc.data(), coordinates: { latitude: lat, longitude: lng } });                    
                    lastVisibleDoc = doc; // Keep track of the last visible document
                };

                counter ++;
            });
        });

        posts.sort((a, b) => b?.createdAt - a?.createdAt);

        if( counter < PAGE_SIZE ) {
            return { posts, lastVisible: null};
        }
        else{
            return { posts, lastVisible: lastVisibleDoc};
        }
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw new Error("Firestore query failed. Ensure that the required indexes are created.");
    }
}

export async function getPostsFromFollowersForWeb(userId, lastVisible = null) {
    const userRef = doc(database, 'users', userId);
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists()) {
        console.error("User not found while fetching posts");
        return { posts: [], lastVisible: null };
    }

    const followers = userDocSnap.data()?.followersUsersId;
    if (!followers || followers.length === 0) {
        console.log("No followers found for the user.");
        return { posts: [], lastVisible: null };
    }

    const promises = [];

    followers.forEach((followedUserId) => {
        let q = query(
            collection(database, 'posts'),
            where('userId', '==', followedUserId),
            orderBy('createdAt', 'desc'),
            limit(PAGE_SIZE)
        );

        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        }

        promises.push(getDocs(q));
    });

    try {
        const snapshots = await Promise.all(promises);
        console.log("snapshots:", snapshots);
        const posts = [];
        let lastVisibleDoc = null;

        snapshots.forEach((snap) => {
            snap.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
                lastVisibleDoc = doc; // Keep track of the last visible document
            });
        });

        console.log("posts from followers:", posts);
        if (posts.length < PAGE_SIZE) {
            lastVisibleDoc = null; // Stop loading more if fewer posts than the limit
        }

        return { posts, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw new Error("Firestore query failed. Ensure that the required indexes are created.");
    }
}


// the function getPostsFromFollowers is used to get the posts of the followers of the user
export async function getPostsFromFollowers(userId, lastVisible, firstFetch) {
    if(!firstFetch && !lastVisible) {
        console.log("There is no posts to fetch");
        return { posts: [], lastVisible: null };
    }
    try {
        const docRef = doc(database, "feedFollowers", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            let feedData = docSnap.data();
            let posts = [];
            
            if (!Array.isArray(feedData?.posts)) {
                console.error("Feed posts is not an array or is undefined");
                return { posts: [], lastVisible: null };
            }
            
            let startIndex = typeof lastVisible === 'number'  ? lastVisible : 0;
            
            for (let i = startIndex; i < startIndex + PAGE_SIZE && i < feedData.posts.length; i++) {
                const postId = feedData.posts[i];
                const postRef = doc(database, "posts", postId);

                try{
                    const postDocSnap = await getDoc(postRef);
                    if (postDocSnap.exists()) {
                        const postData = postDocSnap.data();

                        posts.push({ 
                            id: postId, 
                            ...postData,
                            coordinates: {
                                latitude: postData.coordinates ? postData.coordinates[0] : 0,
                                longitude: postData.coordinates ? postData.coordinates[1] : 0
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            }
            
            posts.sort((a, b) => b.createdAt - a.createdAt);
            
            const newLastVisible = startIndex + PAGE_SIZE < feedData.posts.length ? startIndex + PAGE_SIZE : null;
            
            return {
                posts,
                lastVisible: newLastVisible
            };
        } else {
            console.error("Feed not found");
            return { posts: [], lastVisible: null };
        }
    } catch (error) {
        console.error("Error fetching posts from followers:", error);
        return { posts: [], lastVisible: null };
    }
}


export async function getPost(postId) {
    const postRef = doc(database, 'posts', postId);
    const postDocSnap = await getDoc(postRef);

    if (postDocSnap.exists()) {
        return { id: postDocSnap.id, ...postDocSnap.data() };
    } else {
        console.error("Post not found");
        return null;
    }

}

export async function getPostsOfUser(postUserId, userData, lastIndex) {
    try {
        console.log("postUserId:", postUserId, "userData: ", userData, "lastIndex:", lastIndex);
      const userDocRef = doc(database, "users", postUserId);
      const userDocSnap = await getDoc(userDocRef);
      const postsIdArray = userDocSnap.data()?.postsId;
  
      const userPostsData = [];
      let i;
  
      if (!Array.isArray(postsIdArray) || postsIdArray.length === 0 || !userDocSnap.exists()) {
        return { posts: [], lastIndex: 0, hasMore: false};
      }
  
      for (i = lastIndex; i < lastIndex + PAGE_SIZE_POSTS_PROFILE && i < postsIdArray.length; i++) {
        const postId = postsIdArray[i];
        const postDocRef = doc(database, "posts", postId);
        const postDocSnap = await getDoc(postDocRef);
  
        if (postDocSnap.exists()) {
          const postData = postDocSnap?.data();
          console.log("POST DATA:", postData);
          if (userData) {
            postData.firstName = userData.firstName;
            postData.lastName = userData.lastName;
            postData.userName = userData.userName;
            postData.userImg = userData.profileImg;
          }
          userPostsData.push({ id: postId, ...postData });
        }
      }
  
      console.log("post from user:", userPostsData);
      if(i === postsIdArray.length)
         return { posts: userPostsData, lastIndex: i, hasMore: false};
      else
         return { posts: userPostsData, lastIndex: i, hasMore: true};

    } catch (error) {
      console.error("Error fetching user posts:", error);
      return { posts: [], lastIndex: lastIndex, hasMore: false};
    }
  }

export async function getPostsNearby(center, radiusInM, userId, isMapScreen) {
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    bounds.forEach(b => {
        const q = query(
            collection(database, 'posts'),
            orderBy('geohash'),
            startAt(b[0]),
            endAt(b[1]),
        );

        promises.push(getDocs(q));
    });

    const snapshots = await Promise.all(promises);
    const matchingDocs = [];

    snapshots.forEach((snap) => {
        snap.forEach((doc) => {
            console.log("doc:", doc.data());
            const lat = parseFloat(doc.get('coordinates')[0]);
            const lng = parseFloat(doc.get('coordinates')[1]);

            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid coordinates:", lat, lng);
                return;
            }

            const distanceInKm = geofire.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;

            if (distanceInM <= radiusInM) {
                if(isMapScreen) {
                matchingDocs.push({
                    id: doc.id,
                    title: doc.get('postText'),
                    latitude: lat,
                    longitude: lng,
                    image: doc.get('postImg')[0],
                });
            } else {
                matchingDocs.push({ id: doc.id, ...doc.data() });
            }
            }
        });
    });

    return matchingDocs;
}

