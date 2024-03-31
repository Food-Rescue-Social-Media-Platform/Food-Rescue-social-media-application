import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import {storage} from '../../firebase.js';

// Upload images to firebase storage
export const uploadImages = async (uri, path, type) => {
    if(uri == null) {
      return null;
    }
   
    const response = await fetch(uri);
    const blob = await response?.blob();

    const pathForRef = path + Date.now(); 

    const storageRef = ref(storage, pathForRef);

    uploadBytesResumable(storageRef, blob)
    .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('Uploaded a file! available at', downloadURL);
        });
    }).catch((error) => {
        console.error('Error uploading image:', error);
      });
};

