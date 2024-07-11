import * as ImagePicker from 'expo-image-picker';

// the function below is used to select images from the gallery
// and set the image to the state setImage[]
export const openGalereAndSelectImages = async (setImages, allowsMultipleSelection=true, allowsEditing=false, allMediaTypeOptionsOpen=true) => {
  const s = await ImagePicker.getCameraPermissionsAsync();
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allMediaTypeOptionsOpen ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: allowsEditing,
        allowsMultipleSelection: allowsMultipleSelection,
        // aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        for (const asset of result.assets) {
          // Extract the URI of each asset and set it individually
          setImages((prevState) => [...prevState, asset.uri]);
        }
      }
  }

// the function below is used to take a picture from the camera
export const openCameraAndTakePicture = async (setImages) =>{
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log("result: ", result);
        setImages( oldImages => [...oldImages, result.assets[0].uri] );
      }
};


//#################################### this functions for edit profile user image and cover ##############################################//
// Function to select image from the gallery
export const openGalleryAndSelectImage = async (setImage, allowsMultipleSelection=false, allowsEditing=false, allMediaTypeOptionsOpen=true) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: allMediaTypeOptionsOpen ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
    allowsEditing: allowsEditing,
    allowsMultipleSelection: allowsMultipleSelection,
    quality: 1,
  });

  if (!result.canceled) {
    const selectedImage = allowsMultipleSelection ? result.assets.map(asset => asset.uri) : result.assets[0].uri;
    setImage(selectedImage);
  }
};

// Function to take a picture with the camera
export const openCameraAndTakePictureForUserImageAndCover = async (setImage) => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
