import React, { useState, useEffect, useContext } from 'react';
import { View, Modal, StyleSheet, Text, ScrollView, Image,ActivityIndicator, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, DARKCOLORS } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { uploadImages } from '../../FirebaseFunctions/firestore/UplaodImges';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../hooks/OperationComponents/OpeningComponentsInPhone';
import { Post, addPost } from '../../FirebaseFunctions/collections/post';
import { windowHeight } from '../../utils/Dimentions';
import { categoriesList } from '../../utils/categories';
import * as Location from 'expo-location';
import { AuthContext } from '../../navigation/AuthProvider';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import { useDarkMode } from '../../styles/DarkModeContext'; // Adjust the path accordingly
import SearchAddress from '../../components/map/SearchAddress';
import { useTranslation } from 'react-i18next';

const AddPostScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [userConnected, setUserConnected] = useState(null);
    const [postInput, setPostInput] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [timeInput, setTimeInput] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [images, setImages] = useState([]);
    const [modalPhoneVisible, setModalPhoneVisible] = useState(false);
    const [modalCloseVisible, setModalCloseVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [showLocationModel, setShowLocationModel] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options] = useState(
      categoriesList.map((category) => ({ value: category, label: t(category) }))
    );    
    const [ messError, setMessError ] = useState('');
    const [ showInputAddPhone, setShowInputAddPhone ] = useState(false);
    const { isDarkMode } = useDarkMode();
    const [isPosting, setIsPosting] = useState(false);
    const themeColors = isDarkMode ? DARKCOLORS : COLORS;  


  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUser(user.uid);
      userData.id = user.uid;
      setUserConnected(userData);
    };
    fetchData();
  }, []);

  const showAlert = (title, message) => {
    Alert.alert(
      t(title),
      t(message),
    );
  }
  const confirmClose = () => {
    setModalCloseVisible(false);
    navigation.navigate("Home Page");
  };

  const handleClose = () => {
    setModalCloseVisible(true);
  };

  const handleCloseCategoryModal = () => {
    if (selectedOptions.length > 0) {
        setCategory(options.find(opt => opt.label === selectedOptions[0]).value);
    }
    setCategoryModalVisible(false);
};

  const handleOpenCamera = async () => {
    openCameraAndTakePicture(setImages);
  };

  const handleAddImages = () => {
    openGalereAndSelectImages(setImages);
  };

  const handleAddLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    location = {latitude: location.coords.latitude, longitude: location.coords.longitude};

    setLocation(location);
    // console.log("Location", location);
    setShowLocationModel(false);
  };

  const handelAddPhone = () => {
    setShowInputAddPhone(false);
    setModalPhoneVisible(true);
  };

  const handelAddCategory = () => {
    setCategoryModalVisible(true);
  };

  useEffect(() => {
    console.log("Location updated:", location);
  }, [location]);

  const handleAddPost = async () => {
    // console.log("Category to be saved:", category); // This should log the English category name
    setLoading(true);
    if (postInput.length === 0) {
        setMessError('Please enter the post content');
        setLoading(false);
        return;  
    }

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        showAlert("Location Alert", "Please add a valid location to publish the post");
        setLoading(false);
        return;
    }

    if (isPosting) return; // Prevent multiple submissions

    setIsPosting(true);
    setIsUploading(true);

    // Upload images to Firebase Storage
    let imagesUrl = [];
    if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            imagesUrl.push(await uploadImages(images[i], "postsImges/", "image"));
        }
    }

    const newPost = new Post(
        userConnected.id,
        userConnected.userName,
        userConnected.firstName,
        userConnected.lastName,
        userConnected.profileImg,
        phoneNumber,
        postInput,
        timeInput,
        category, // Use the original category value in English
        imagesUrl,
        location,
    );

    try {
        await addPost(newPost);
        navigation.navigate("Home Page");
    } catch (error) {
        console.error("Error adding post:", error);
        showAlert("Error", "Failed to add post. Please try again.");
        setLoading(false);
    } finally {
        setIsPosting(false);
        setIsUploading(false);
    }
};



  const handleCheck = (option) => {
    if (selectedOptions.includes(option.label)) {
      setSelectedOptions([]);
      setCategory(''); // Clear category selection
    } else {
      setSelectedOptions([option.label]); // Store the translated label for display
      setCategory(option.value); // Store the original value (English) for saving to Firestore
    }
  };

  const handleImagePress = (index) => {
    const newImages = images.filter((image, i) => i !== index);
    setImages(newImages);
  };

  const handleInputChange = (text, setInput, maxLength) => {
    if (text.length <= maxLength) {
        setInput(text);
    }
  };

  const handleAcceptLocationFromSearch = async (data, details) => {
    const { geometry } = details;
    const { location } = geometry;
    // console.log('\nlocation from user', location);
    
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      console.error('Invalid location data:', location);
      return;
    }
  
    const locationFromSearch = {
      latitude: location.lat,
      longitude: location.lng,
    };
  
    setLocation(locationFromSearch);
    // console.log('Location set:', locationFromSearch);
  };

  return (
      <View style={{ backgroundColor: themeColors.appBackGroundColor }}>
              <View style={styles.container}>

                  <View style={styles.header}>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleClose}>
                          <Ionicons name="arrow-back" size={24} color={themeColors.headerColor} />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 18, color: themeColors.headerColor, paddingHorizontal: Platform.OS === 'web' ? '44%' : '27%', marginBottom: 5 }}>{t('Create Post')}</Text>
                      {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} />
                      ) : (
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.theme }]} onPress={handleAddPost}>
                          <Text style={{ fontSize: 15 }}>{t('Post')}</Text>
                        </TouchableOpacity>
                      )}
                  </View>

                  <ScrollView>
                      <View style={{ minHeight: '100%' }}>
                          <View>
                              <TextInput
                                  value={postInput}
                                  onChangeText={(text) => handleInputChange(text, setPostInput, 3000)}
                                  style={[styles.postInput, { backgroundColor: themeColors.white, color: themeColors.primaryText }]}
                                  placeholder={t("What food would you like to save today?")}
                                  placeholderTextColor={themeColors.placeholderText}
                                  multiline
                              />
                              {messError && <Text style={{ color: 'red', fontSize: 15, marginLeft:5 }}>{messError}</Text>}
                              <Text style={{color: themeColors.primaryText, marginBottom:7}}>{postInput.length}/3000</Text>
                              <TextInput
                                  value={timeInput}
                                  onChangeText={(text) => handleInputChange(text, setTimeInput, 30)}
                                  style={[styles.timeInput, { backgroundColor: themeColors.white, color: themeColors.primaryText }]}
                                  placeholder={t("What are the delivery times?")}
                                  placeholderTextColor={themeColors.placeholderText}
                                  multiline
                              />
                              <Text style={{color: themeColors.primaryText}}>{timeInput.length}/30</Text>
                              <Text></Text>
                          </View>

                          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                            {images.map((image, index) => (
                              <View key={index}>
                                <Image
                                  source={{ uri: image }}
                                  style={{ width: 100, height: 100 }}
                                />
                                <TouchableOpacity
                                  style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: themeColors.black,
                                    borderRadius: 50,
                                    padding: 5,
                                  }}
                                  onPress={() => handleImagePress(index)}
                                >
                                  <MaterialIcons name="close" size={24} color="white" />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        </View>
                </ScrollView>

                <View
                  style={[
                    styles.iconsWrapper,
                    { backgroundColor: themeColors.secondaryBackground },
                  ]}
                >
                  <TouchableOpacity>
                    <Entypo
                      name="camera"
                      size={26}
                      color={themeColors.lowContrastText}
                      onPress={handleOpenCamera}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="photo-library"
                      size={26}
                      color={themeColors.lowContrastText}
                      onPress={handleAddImages}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={26}
                      color={themeColors.lowContrastText}
                      onPress={() => setShowLocationModel(true)}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="phone"
                      size={26}
                      color={themeColors.lowContrastText}
                      onPress={handelAddPhone}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="category"
                      size={26}
                      color={themeColors.lowContrastText}
                      onPress={handelAddCategory}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>

         {/* --------Models ----------------*/}

                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalPhoneVisible}
                      onRequestClose={() => {
                          console.log('close modal');
                      }}
                  >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                          <View style={[styles.modal, { marginTop: Platform.OS === 'web'? '10%': '50%', backgroundColor: themeColors.white }]}>

                                <Text style={[styles.modalText, {padding: '8%', color: themeColors.primaryText}]}>
                                      {t("Would you like to add a number to the post?")}
                                </Text>

                              <TextInput 
                                  style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 7, borderRadius: 5, width: '90%', alignSelf: 'center'}}
                                  placeholder={t('Enter phone number')}
                                  value={phoneNumber}
                                  numberOfLines={1}
                                  editable={phoneNumber.length < 15 }
                                  keyboardType='numeric'
                                  onChangeText={(text) => {
                                    const numericText = text.replace(/[^0-9]/g, '');
                                    if (numericText.length <= 15) {
                                      setPhoneNumber(numericText);
                                    }
                                  }}
                                /> 

                              <View style={{ flex: 1, flexDirection: 'row', marginTop: Platform.OS === 'web'?'50':'0', justifyContent: 'center', marginVertical:15}}>

                                  <MyButton
                                      style={{ backgroundColor: themeColors.secondaryBackground, marginLeft: 10, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                      text={t('Yes')}
                                      styleText={{ fontSize: 17, color: themeColors.lowContrastText, fontWeight: 'bold'}}
                                      onPress={() => { if(!phoneNumber.length) return; setModalPhoneVisible(false);}}
                                  />

                                  <MyButton
                                      style={{ backgroundColor: themeColors.secondaryBackground, marginLeft: 10, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                      text={t('No')}
                                      styleText={{ fontSize: 17, color: themeColors.lowContrastText }}
                                      onPress={() => { setModalPhoneVisible(false) }}
                                  />
                              </View>
                          </View>
                      </View>
                  </Modal>

                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={categoryModalVisible}
                  >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                          <View style={[styles.modal, { marginTop: Platform.OS === 'web'? '10%': '30%', backgroundColor: themeColors.white }]}>

                              <Text style={[styles.modalText, {padding: '8%', fontWeight: 'bold', color: themeColors.primaryText }]}>{t("Select categories")}</Text>
                              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                  {options.map((option) => (
                                      <CheckBox
                                          style={[styles.checkboxWrapper, { backgroundColor: themeColors.secondaryBackground }]}
                                          key={option.value}
                                          title={option.label} // Display translated label
                                          checked={selectedOptions.includes(option.label)}
                                          onPress={() => handleCheck(option)} // Handle selection
                                          textStyle={{ color: themeColors.lowContrastText }}
                                          containerStyle={{ backgroundColor: themeColors.secondaryBackground }}
                                      />
                                  ))}
                              </View>

                              <MyButton
                                  style={[styles.button, { borderRadius: 20, backgroundColor: themeColors.secondaryBackground }]}
                                  text={t('Select')}
                                  styleText={{ fontSize: 15, color: themeColors.lowContrastText, fontWeight: 'bold'}}
                                  onPress={handleCloseCategoryModal}
                              />

                          </View>
                      </View>
                  </Modal>

                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={showLocationModel}
                  >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                          <View style={[styles.modal, {marginTop: Platform.OS === 'web' ? '14%' : '55%', backgroundColor: themeColors.white }]}>

                              <Text style={[styles.modalText, { color: themeColors.primaryText }]}>{t("Add the address of the post delivery location:")}</Text>
                             
                              <View style={{marginHorizontal:15}}>
                                <SearchAddress 
                                      onLocationSelected={handleAcceptLocationFromSearch}  
                                />
                              </View>
                                     
                              <View style={{flex:1, flexDirection:'row', marginHorizontal:8, paddingTop:25, paddingBottom:25, justifyContent:'flex-start'}}>
                                  <Entypo
                                    name="direction"
                                    size={26}
                                    color={themeColors.primaryText}
                                    style={styles.icon}
                                  />
                                  <MyButton
                                      style={{ width: '50%', padding:5}}
                                      text={t("Your current location")}
                                      styleText={{ fontSize: 17, color: themeColors.textLink, textDecorationLine: 'underline' }}
                                      onPress={handleAddLocation}
                                  />
                              </View>
                              
                              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom:10}}> 
                                  <MyButton
                                    style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                    text={t('Yes')}
                                    styleText={{ fontSize: 17, color: themeColors.lowContrastText, fontWeight: 'bold' }}
                                    onPress={() => {setShowLocationModel(false);}}
                                  />

                                  <MyButton
                                    style={{ backgroundColor: themeColors.secondaryBackground, marginLeft: 10, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                    text={t('No')}
                                    styleText={{ fontSize: 17, color: themeColors.lowContrastText}}
                                    onPress={() => { setLocation(''); setShowLocationModel(false) }}
                                  />
                              </View>
                          </View>
                      </View>
                  </Modal>

                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalCloseVisible}
                  >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                          <View style={[styles.modal, { marginTop: Platform.OS === 'web' ? '17%' : '70%' , backgroundColor: themeColors.white }]}>

                              <Text style={[styles.modalText, { color: themeColors.primaryText }]}>{t("Are you sure you want to leave?")}</Text>

                              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom:10}}>
                                  <MyButton
                                      style={{ backgroundColor: themeColors.secondaryBackground, marginLeft: 10, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                      text={t('Yes')}
                                      styleText={{ fontSize: 17, color: themeColors.lowContrastText }}
                                      onPress={confirmClose}
                                  />

                                  <MyButton
                                      style={{ backgroundColor: themeColors.secondaryBackground, marginLeft: 10, padding: 10, borderRadius: 5, width: '15%', alignItems: 'center'}}
                                      text={t('No')}
                                      styleText={{ fontSize: 17, color: themeColors.lowContrastText, fontWeight: 'bold'}}
                                      onPress={() => { setModalCloseVisible(false) }}
                                  />
                              </View>
                          </View>
                      </View>
                  </Modal>
              </View>

          {isUploading && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color={themeColors.primaryText} />
            </View>)}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginTop: 15,  
    padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    ...Platform.select({
      web: {
        marginTop: 0,
        width: "50%",
        height: "100%",
        alignSelf: "center",
      },
    }),
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    ...Platform.select({
      web: {
        width: "95%",
      },  
    }),
  },
  icon: {
    marginHorizontal: 10,
    marginVertical: 5,
    ...Platform.select({
      web: {
        marginVertical: 10,
      },
    }),
  },
  input_images: {
    flexDirection: "column",
    height: "92%",
    minHeight: windowHeight - 200,
  },
  button: {
    padding: 10,
    marginTop: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  postInput: {
    height: 200,
    fontSize: 17,
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    textAlignVertical: "top",
  },
  timeInput: {
    height: 150,
    fontSize: 17,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: "top",
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 10,
  },
  modal: {
    position: "absolute",
    width: "100%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    borderColor: "#fff",
    borderWidth: 0.6,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    ...Platform.select({
      web: {
        width: "50%",
        alignSelf: "center",
        alignContent: "center",
      }
    })
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: '400',
    padding: '6%' ,
    ...Platform.select({
      web: {
        padding: '7%' 
      }
    })
    // marginBottom: 5,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    width: 50,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  locationModal: {
    position: "absolute",
    width: "100%",
    marginTop: "50%",
  },
});

export default AddPostScreen;

const fetchUser = async (id) => {
  try {
    const docRef = doc(database, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data();
  } catch (error) {
    console.error("fetchUser, Error getting document:", error);
    return null;
  }
};

// const updateUserLocation = async (userID, location) => {
//   try {
//     const userDocRef = doc(database, "users", userID);
//     // await setDoc(docRef, {location: location});
//     await updateDoc(userDocRef, {
//       location: location,
//     });
//   } catch (error) {
//     console.error("updateUserLocation, Error getting document:", error);
//   }
// };

const MyButton = ({ style, text, styleText, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styleText}>{text}</Text>
    </TouchableOpacity>
  );
};
