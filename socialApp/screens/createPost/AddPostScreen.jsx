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
import { OpenGalereAndSelectImages } from '../../FirebaseFunctions/OpeningComponentsInPhone';
import {Post, addPost} from '../../FirebaseFunctions/collections/post';
import { windowHeight } from '../../utils/Dimentions';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

const AddPostScreen = () => {
    const navigation = useNavigation();
    const userId = 'lRAXw44INLTbWgLn0C5imegQR7T2';
    const [postInput, setPostInput] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [timeInput , setTimeInput] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
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
        console.log('Camera');
    }
    
    const handleAddImages = () =>{
        console.log('Images');
        OpenGalereAndSelectImages(setImage);
        console.log('Image uri', image);
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
        setModalVisible(true)
    }

    const handelAddCategory = () => {
        console.log('Category');
        setCategoryModalVisible(true);
    }

    const handleAddPost = async () => {
        await uploadImages(image, 'postsImges/', 'image', setImageUrl );
        console.log("text", postInput);
        console.log("time", timeInput);
        console.log("phone", phoneNumber);
        console.log("category", category);
        console.log("image", imageUrl);
 
        const newPost = new Post(userId, postInput, timeInput, category, location, phoneNumber, imageUrl);
        console.log('Post', newPost);  
        await addPost(newPost);

        setPhoneNumber('');
        setPostInput('');
        setImage(null);
        setLocation('');
        setCategory('');
        setTimeInput('');

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
                          <Text style={{fontSize: 18, paddingHorizontal: '27%'}}>Create Post</Text>
                      <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                          <Text style={{fontSize:16}}>Post</Text>
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
                            <Image style={{ width:100, height:100 }} source={{uri: image}} />
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
                                  visible={modalVisible}
                                  onRequestClose={() => {
                                      console.log('close modal');
                                  }}
                                  >   
                              <View 
                              style={{  marginTop:'50%', width:'100%', backgroundColor: 'red', border:1, borderColor: 'black'}}
                              >
                              <Text style={{fontSize:20, padding:10}}>Would you like to post your number 0527225789 ?</Text>
                              <View style={{flexDirection:'row'}}>
                                  <Button title="Yes" onPress={()=>{setModalVisible(false); setPhoneNumber('052111111')}}/>
                                  <Button title="No" onPress={()=>{setModalVisible(false)}}/>
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
        height:'8%',
    },  
    iconsWrapper:{
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
        height: 50,
        width: '100%',
        bottom:0,
        backgroundColor: 'white'
    },
    icon:{
        marginHorizontal: 4,
    },
    input_images:{
        flexDirection: 'column',
        height: '100%',
        width:'100%'
    },
    postInput: {
        flex: 2,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 14,
        // minHeight:'70%'
    },
    timeInput:{
        flex: 1,
        borderWidth: 1,
        padding: 10,
        borderColor: 'gray',
        marginVertical: 14,
    },
    button: {
        backgroundColor: COLORS.secondaryBackground,
        padding: 10,
        marginTop: 10,
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
      locationModal:{
        backgroundColor: COLORS.secondaryBackground,
        position: 'absolute',
        width: '100%',
        marginTop:'50%'
      }
  });

  export default AddPostScreen;