import { addDoc, doc, serverTimestamp, collection,query, orderBy,where,limit, startAfter, startAt, endAt, getDocs, deleteDoc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore'; 
import { database } from '../../firebase.js';
import * as geofire from 'geofire-common';

let maxDistance = 50000; // 50km
let limitPosts = 10;

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
         postLocation
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
        this.status = "wait for rescue";
        
        const location = postLocation || { coords: { latitude: 0, longitude: 0 } };
        this.coordinates = [location.coords.latitude, location.coords.longitude];
        this.geohash = geofire.geohashForLocation([location.coords.latitude, location.coords.longitude]);
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


export async function getPostsWithFilters(center, radiusInM, userId, categories, isMapScreen, lastVisible = null) {
    if (!center || !radiusInM) {
        console.error("Center and radius are required for fetching posts");
        return { posts: [], lastVisible: null };
    }

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    const limitPosts = 10; // Define the limit here

    bounds.forEach(b => {
        let queries = [
            collection(database, 'posts'),
            orderBy('geohash'),
            startAt(b[0]),
            endAt(b[1]),
            limit(limitPosts) 
        ];

        if (lastVisible) {
            queries.push(startAfter(lastVisible));
        }

        if (categories && categories.length > 0) {
            console.log("categories:", categories);
            queries.push(where('category', 'in', categories));
        }

        const q = query(...queries);
        promises.push(getDocs(q));
    });

    try {
        const snapshots = await Promise.all(promises);
        console.log("snapshots:", snapshots);
        const posts = [];
        let lastVisibleDoc = null;

        snapshots.forEach((snap) => {
            snap.forEach((doc) => {
                // if (doc.data().userId === userId) {
                //     return; // Skip the post if it is from the current user
                // }
                const coordinates = doc.get('coordinates');
                console.log('Coordinates:', coordinates);

                if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                    console.error("Invalid coordinates array:", coordinates);
                    return;
                }

                const lat = parseFloat(coordinates[0]);
                const lng = parseFloat(coordinates[1]);
                console.log('Parsed coordinates:', { lat, lng });

                if (isNaN(lat) || isNaN(lng)) {
                    console.error("Invalid coordinates:", { lat, lng });
                    return;
                }

                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;

                if (distanceInM <= radiusInM) {
                    if (isMapScreen) {
                        posts.push({
                            id: doc.id,
                            title: doc.get('postText'),
                            coordinates: { latitude: lat, longitude: lng },
                            image: doc.get('postImg')[0],
                        });
                    } else {
                        posts.push({ id: doc.id, ...doc.data(), coordinates: { latitude: lat, longitude: lng } });
                    }
                    lastVisibleDoc = doc; // Keep track of the last visible document
                }
            });
        });

        console.log("posts:", posts);

        if (posts.length < limitPosts) {
            lastVisibleDoc = null; // Stop loading more if fewer posts than the limit
        }

        return { posts, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw new Error("Firestore query failed. Ensure that the required indexes are created.");
    }
}



export async function getPostsFromFollowers(userId, isMapScreen, lastVisible = null) {
    const userRef = doc(database, 'users', userId);
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists()) {
        console.error("User not found while fetching posts");
        return { posts: [], lastVisible: null };
    }

    const followers = userDocSnap.data()?.followersUsersId;
    const promises = [];

    followers.forEach((followedUserId) => {
        let queries = [
            collection(database, 'posts'),
            where('userId', '==', followedUserId),
            orderBy('createdAt', 'desc'),
            limit(limitPosts) 
        ];

        if (lastVisible) {
            queries.push(startAfter(lastVisible));
        }

        const q = query(...queries);
        promises.push(getDocs(q));
    });

    try {
        const snapshots = await Promise.all(promises);
        console.log("snapshots:", snapshots);
        const posts = [];
        let lastVisibleDoc = null;

        snapshots.forEach((snap) => {
            snap.forEach((doc) => {
                console.log("doc:", doc.data());
                if (isMapScreen) {
                    posts.push({
                        id: doc.id,
                        title: doc.get('postText'),
                        coordinates: { latitude: doc.get('coordinates')[0], longitude: doc.get('coordinates')[1] },
                        image: doc.get('postImg')[0],
                    });
                } else {
                    posts.push({ id: doc.id, ...doc.data() });
                }
                lastVisibleDoc = doc; // Keep track of the last visible document
            });
        });

        console.log("posts from followers:", posts);
        if(posts.length < limitPosts) {
            lastVisibleDoc = null; // Stop loading more if fewer posts than the limit
        }

        return { posts, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw new Error("Firestore query failed. Ensure that the required indexes are created.");
    }
}

// export async function getPostsNearby(center, radiusInM, userId, isMapScreen) {
//     const bounds = geofire.geohashQueryBounds(center, radiusInM);
//     const promises = [];

//     bounds.forEach(b => {
//         const q = query(
//             collection(database, 'posts'),
//             orderBy('geohash'),
//             startAt(b[0]),
//             endAt(b[1]),
//             // userId ? where('userId', '==', userId) : null
//         );

//         promises.push(getDocs(q));
//     });

//     const snapshots = await Promise.all(promises);
//     console.log("snapshots:", snapshots);
//     const matchingDocs = [];

//     snapshots.forEach((snap) => {
//         snap.forEach((doc) => {
//             console.log("doc:", doc.data());
//             const lat = parseFloat(doc.get('coordinates')[0]);
//             const lng = parseFloat(doc.get('coordinates')[1]);

//             if (isNaN(lat) || isNaN(lng)) {
//                 console.error("Invalid coordinates:", lat, lng);
//                 return;
//             }

//             const distanceInKm = geofire.distanceBetween([lat, lng], center);
//             const distanceInM = distanceInKm * 1000;

//             if (distanceInM <= radiusInM) {
//                 if(isMapScreen) {
//                 matchingDocs.push({
//                     id: doc.id,
//                     title: doc.get('postText'),
//                     coordinates: { latitude: lat, longitude: lng },
//                     image: doc.get('postImg')[0],
//                 });
//             } else {
//                 matchingDocs.push({ id: doc.id, ...doc.data() });
//             }
//             }
//         });
//     });

//     console.log("matchingDocs:", matchingDocs);
//     return matchingDocs;
// }

