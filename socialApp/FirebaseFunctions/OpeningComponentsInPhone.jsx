import * as ImagePicker from 'expo-image-picker';

// the function below is used to select images from the gallery
// and set the image to the state setImage
export const OpenGalereAndSelectImages = async (setImage) => {
    const s = await ImagePicker.getCameraPermissionsAsync();
    // No permissions request is necessary for launching the image library
     let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      allowsMultipleSelection: true,
      // aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("uri: ", result.assets[0].uri);
      // console.log("uri: ", result.assets[0].uri);
    }
  }