import React, {useState} from 'react';
import { View, Modal, StyleSheet, Text, ScrollView,Image, TextInput, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import {Camera} from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '../../FirebaseFunctions/firestore/UplaodImges';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../FirebaseFunctions/OpeningComponentsInPhone';
import {Post, addPost} from '../../FirebaseFunctions/collections/post';
import { windowHeight } from '../../utils/Dimentions';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

const AddPostScreen = () => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.user.userData);
    const [postInput, setPostInput] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [timeInput , setTimeInput] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [modalPhoneVisible, setModalPhoneVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isCategorySelected, setCategorySelected] = useState(false);
    const [showLocationModel, setShowLocationModel] = useState(false);
    const [ imageUrl, setImageUrl] = useState('');
    const [options, setOptions] = useState([
        {
          value: 'Fast food',
        },
        {
          value: 'Vagen',
        },
        {
          value: 'other',
        },
      ]);
      const [selectedOptions, setSelectedOptions] = useState([]);

     const handleClose = () => {
        console.log('Close');
        // to do: add a modal to ask if the user wants to leave the page
        navigation.navigate('HomePage');
    }

    const handleCloseCategoryModal = () => {
        setCategory(selectedOptions[0])
        setCategoryModalVisible(false);
    }

    const handleOpenCamera = async () => {
        openCameraAndTakePicture(setImages);
    }
    
    const handleAddImages = () =>{
        console.log('Images');
        openGalereAndSelectImages(setImages);
        console.log('Images uri', images);
    }

    const handleAddLocation = async () => {
        console.log('Location', location);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log('Location', location);
        setShowLocationModel(showLocationModel? false: true);     
    }

    const handelAddPhone = () => {
        console.log('Phone');
        setModalPhoneVisible(true)
    }

    const handelAddCategory = () => {
        console.log('Category');
        setCategoryModalVisible(true);
    }

    const handleAddPost = async () => {
        // 0. save image in storage
        const imagesUrl = await uploadImages(images, 'postsImges/', 'image');
        console.log("text", postInput);
        console.log("time", timeInput);
        console.log("phone", phoneNumber);
        console.log("category", category);
        console.log("image", imagesUrl);
       
        const newPost = new Post(userData.id, postInput, timeInput, category, location, phoneNumber, imagesUrl);
        console.log('Post', newPost);  
        await addPost(newPost);
        // 4. set space to empty
        setPhoneNumber('');
        setPostInput('');
        setImages(null);
        setLocation('');
        setCategory('');
        setTimeInput('');
        // 5. navigate to home page
        navigation.navigate('HomePage');
    }

    const handleCheck = (option) => {
        if(selectedOptions.includes(option.value)){
            setSelectedOptions(selectedOptions.filter((item) => item !== option.value));
        } else {
            setSelectedOptions([option.value]);
        }
      };
    
    return (      
            <View style={styles.container} >
                    <View style={styles.header}>
                      <TouchableOpacity style={{marginLeft:5}} onPress={handleClose}>
                          <Fontisto name="arrow-right" size={24} color="black" style={{transform: [{ scaleX: -1 }]}} />
                      </TouchableOpacity>
                          <Text style={{fontSize: 18, paddingHorizontal: '27%', marginBottom:5}}>Create Post</Text>
                      <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                          <Text style={{fontSize:15}}>Post</Text>
                      </TouchableOpacity>              
                      </View>
                      <ScrollView>
                      <View style={styles.input_images}>
                          <TextInput
                              value={postInput}
                              onChangeText={(text)=>setPostInput(text)}
                              style={styles.postInput}
                              placeholder="What's on your mind?"
                              multiline
                          />
                          <Text>What are the delivery times?</Text>
                          <TextInput
                              value={timeInput}
                              onChangeText={(text)=>setTimeInput(text)}
                              style={styles.timeInput}
                              placeholder="What's on your mind?"
                              multiline
                          />
                          <Text>{timeInput.length}/30</Text>
                          <View>
                            {images.map( image => (

                                <Image 
                                    key={image}
                                    style={{ width:100, height:100 }}
                                    source={{uri: image}}/>
                            ))}
                          </View>
                       </View>
                       </ScrollView>

                       <View style={styles.iconsWrapper}>
                          <TouchableOpacity>
                          <Entypo name="camera" size={26} color='black' onPress={handleOpenCamera} style={styles.icon}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                          <FontAwesome6 name="images" size={26} color='black' onPress={handleAddImages} style={styles.icon}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                              <Entypo name="location-pin"  size={26} color='black' onPress={handleAddLocation} style={styles.icon}/>
                          </TouchableOpacity>
                          <TouchableOpacity >
                              <Entypo name="phone"  size={26} color='black' onPress={handelAddPhone} style={styles.icon}/>
                          </TouchableOpacity>
                          <TouchableOpacity >
                              <MaterialIcons name="category" size={26} color='black' onPress={handelAddCategory} style={styles.icon}/>
                          </TouchableOpacity>
                          </View>
                              <Modal                                
                                  animationType="slide"
                                  transparent={true}
                                  visible={modalPhoneVisible}
                                  onRequestClose={() => {
                                      console.log('close modal');
                                  }}
                                  >   
                              <View 
                              style={{  marginTop:'50%', width:'100%', backgroundColor: COLORS.white, border:1, borderColor: 'black'}}
                              >
                              <Text style={{fontSize:20, padding:10}}>Would you like to post your number {userData.phoneNumber} ?</Text>
                              <View style={{flexDirection:'row'}}>
                                  <Button title="Yes" style={styles.modalButton} onPress={()=>{setModalPhoneVisible(false); setPhoneNumber('052111111')}}/>
                                  <Button title="No" style={styles.modalButton} onPress={()=>{setModalPhoneVisible(false)}}/>
                              </View>
                              </View>
                      </Modal>
    
                      <Modal
                          animationType="slide"
                          transparent={true}
                          visible={categoryModalVisible}
                          >
                      <View style={styles.categoryModal}>
                          <Text style={styles.modalText}>Select options:</Text>
    
                          {options.map((option) => (
                              <CheckBox
                                style={styles.checkboxWrapper}
                                key={option.value}
                                title={option.value}
                                checked={selectedOptions.includes(option.value)}
                                onPress={() => handleCheck(option)}
                              />
                            ))}
                       <Button title="Done" onPress={handleCloseCategoryModal} />
                      </View>
                      </Modal>
                      <Modal 
                      animationType="slide"
                      transparent={true}
                      visible={showLocationModel}
                      >
                        <View style={styles.locationModal}>
                        <Text>Should you add your current location to the post?</Text>
                        <Button title="Yes" onPress={handleAddLocation}/>
                        <Button title="No" onPress={()=>{console.log("no want to add his location."); setShowLocationModel(false)}}/>
                        <TextInput
                         placeholder='Enter a different address'>
                        </TextInput>
                        </View>
                      </Modal>
            </View>
            );
        }


  const styles = StyleSheet.create({
    container: {
          width: '100%',
          height: '100%',
          marginTop: 15,
          padding: 20,
    },
    header:{
        alignItems: 'center',
        flexDirection:'row',
        width:'100%',
        marginBottom: 10,
        // height:'8%',
    },  
    iconsWrapper:{
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
        backgroundColor: COLORS.secondaryBackground,
        height: 50,
        width: '100%',
        bottom:0,
    },
    icon:{
        marginHorizontal: 4,
    },
    input_images:{
        flexDirection: 'column',
        height:'92%',
        minHeight: windowHeight - 200,
    },
    postInput: {
        height:'50%',    
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 14,
    },
    timeInput:{
        borderWidth: 1,
        padding: 10,
        borderColor: 'gray',
        marginVertical: 14,
    },
    button: {
        backgroundColor: COLORS.secondaryBackground,
        padding: 10,
        marginTop: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    categoryModal:{
        backgroundColor: COLORS.secondaryBackground,
        position: 'absolute',
        width: '100%',
        marginTop:'72%'
    },
    modalCategoryText: {
        fontSize: 18,
        marginBottom: 15,
      },
      checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      modalButton:{
        backgroundColor: COLORS.secondaryBackground,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      locationModal:{
        backgroundColor: COLORS.secondaryBackground,
        position: 'absolute',
        width: '100%',
        marginTop:'50%'
      }
  });

  export default AddPostScreen;