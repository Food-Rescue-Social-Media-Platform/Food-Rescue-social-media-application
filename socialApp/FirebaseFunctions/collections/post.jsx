import { addDoc, doc, serverTimestamp, collection,query, orderBy, startAt, endAt, getDocs, deleteDoc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore'; 
import { database } from '../../firebase.js';
import * as geofire from 'geofire-common';

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
         location = { coords: { latitude: 0, longitude: 0 } }
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
        this.status = "wait for rescue";
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
        const docRef = await addDoc(collection(database, "postsTest") ,postData);
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
        const postRef = doc(database, 'postsTest', postId);
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


export async function getPostsNearby(center, radiusInM) {
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    bounds.forEach(b => {
        const q = query(
            collection(database, 'postsTest'),
            orderBy('geohash'),
            startAt(b[0]),
            endAt(b[1])
        );

        promises.push(getDocs(q));
    });

    const snapshots = await Promise.all(promises);
    console.log("snapshots:", snapshots);
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
                matchingDocs.push({
                    id: doc.id,
                    title: doc.get('postText'),
                    coordinates: { latitude: lat, longitude: lng },
                });
            }
        });
    });

    console.log("matchingDocs:", matchingDocs);
    return matchingDocs;
}