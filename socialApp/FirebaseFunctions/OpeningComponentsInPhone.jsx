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
        console.log("result: ", result);
        setImages( oldImages => [...oldImages, result.assets[0].uri] );
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