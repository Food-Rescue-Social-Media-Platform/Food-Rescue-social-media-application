import React, { useState, useEffect, useContext } from 'react';
import { View, Modal, StyleSheet, Text, ScrollView, Image, TextInput, TouchableOpacity, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, DARKCOLORS } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '../../FirebaseFunctions/firestore/UplaodImges';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../FirebaseFunctions/OpeningComponentsInPhone';
import { Post, addPost } from '../../FirebaseFunctions/collections/post';
import { windowHeight } from '../../utils/Dimentions';
import { categories } from '../../utils/categories';
import * as Location from 'expo-location';
import { AuthContext } from '../../navigation/AuthProvider';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import { useDarkMode } from '../../styles/DarkModeContext'; // Adjust the path accordingly

const AddPostScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);
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
    const [options, setOptions] = useState(categories.map((category) => ({ value: category })));
    const { isDarkMode } = useDarkMode();
    const themeColors = isDarkMode ? DARKCOLORS : COLORS;

    useEffect(() => {
        const fetchData = async () => {
            const userData = await fetchUser(user.uid);
            userData.id = user.uid;
            console.log('fetchData, User:', userData);
            setUserConnected(userData);
        }
        fetchData();
    }, []);

    const confirmClose = () => {
        setModalCloseVisible(false);
        navigation.navigate('Home Page');
    }

    const handleClose = () => {
        console.log('Close');
        setModalCloseVisible(true);
    }

    const handleCloseCategoryModal = () => {
        setCategory(selectedOptions[0]);
        setCategoryModalVisible(false);
    }

    const handleOpenCamera = async () => {
        openCameraAndTakePicture(setImages);
    }

    const handleAddImages = () => {
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
        setShowLocationModel(showLocationModel ? false : true);
    }

    const handelAddPhone = () => {
        console.log('Phone');
        setModalPhoneVisible(true);
    }

    const handelAddCategory = () => {
        console.log('Category');
        setCategoryModalVisible(true);
    }

    const handleAddPost = async () => {
        setIsUploading(true);

        let imagesUrl = [];
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) 
                imagesUrl.push(await uploadImages(images[i], 'postsImges/', 'image'));
        }
        console.log("user", userConnected.id, userConnected.userName);
        console.log("text", postInput);
        console.log("time", timeInput);
        console.log("phone", phoneNumber);
        console.log("category", category);
        console.log("image", imagesUrl);
        console.log("location", location);

        const newPost = new Post(
            userConnected.id,
            userConnected.userName,
            userConnected.firstName,
            userConnected.lastName,
            userConnected.profileImg,
            userConnected.phoneNumber,
            postInput,
            timeInput,
            category,
            imagesUrl,
            location
        );

        console.log('Post', newPost);
        await addPost(newPost);

        setPhoneNumber('');
        setPostInput('');
        setImages([]);
        setLocation('');
        setCategory('');
        setTimeInput('');
        setIsUploading(false);

        navigation.navigate('Home Page');
    }

    const handleCheck = (option) => {
        if (selectedOptions.includes(option.value)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option.value));
        } else {
            setSelectedOptions([option.value]);
        }
    };

    const handleImagePress = (index) => {
        const newImages = images.filter((image, i) => i !== index);
        setImages(newImages);
    }

    return (
        <View style={{ backgroundColor: themeColors.lightGray }}>
            {!isUploading && (
                <View style={styles.container}>

                    <View style={styles.header}>
                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleClose}>
                            <Fontisto name="arrow-right" size={24} color={themeColors.primaryText} style={{ transform: [{ scaleX: -1 }] }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, paddingHorizontal: Platform.OS === 'web' ? '44%' : '27%', marginBottom: 5 }}>Create Post</Text>
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryBackground }]} onPress={handleAddPost}>
                            <Text style={{ fontSize: 15 }}>Post</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <View style={{ minHeight: '100%' }}>
                            <View>
                                <TextInput
                                    value={postInput}
                                    onChangeText={(text) => setPostInput(text)}
                                    style={[styles.postInput, { backgroundColor: themeColors.white, color: themeColors.primaryText }]}
                                    placeholder="What food would you like to save today?"
                                    placeholderTextColor={themeColors.placeholderText}
                                    multiline
                                    editable={timeInput.length < 3000}
                                />
                                <TextInput
                                    value={timeInput}
                                    onChangeText={(text) => setTimeInput(text)}
                                    style={[styles.timeInput, { backgroundColor: themeColors.white, color: themeColors.primaryText }]}
                                    placeholder="What are the delivery times?"
                                    placeholderTextColor={themeColors.placeholderText}
                                    multiline
                                    editable={timeInput.length < 30}
                                />
                                <Text>{timeInput.length}/30</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                {images.map((image, index) => (
                                    <View key={index}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{ width: 100, height: 100 }}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
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

                    <View style={[styles.iconsWrapper, { backgroundColor: themeColors.secondaryBackground }]}>
                        <TouchableOpacity>
                            <Entypo name="camera" size={26} color={themeColors.primaryText} onPress={handleOpenCamera} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons name="photo-library" size={26} color={themeColors.primaryText} onPress={handleAddImages} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="map-marker" size={26} color={themeColors.primaryText} onPress={handleAddLocation} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <MaterialCommunityIcons name="phone" size={26} color={themeColors.primaryText} onPress={handelAddPhone} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <MaterialIcons name="category" size={26} color={themeColors.primaryText} onPress={handelAddCategory} style={styles.icon} />
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
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={[styles.modal, { marginTop: '50%', backgroundColor: themeColors.white }]}>

                                <Text style={[styles.modalText, { color: themeColors.primaryText }]}>Would you like to post your number {userConnected?.phoneNumber}?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='Yes'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
                                        onPress={() => { setModalPhoneVisible(false); setPhoneNumber(userConnected.phoneNumber) }}
                                    />

                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='No'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
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
                            <View style={[styles.modal, { marginTop: '30%', backgroundColor: themeColors.white }]}>

                                <Text style={[styles.modalText, { color: themeColors.primaryText }]}>Select categories</Text>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {options.map((option) => (
                                        <CheckBox
                                            style={[styles.checkboxWrapper, { backgroundColor: themeColors.secondaryBackground }]}
                                            key={option.value}
                                            title={option.value}
                                            checked={selectedOptions.includes(option.value)}
                                            onPress={() => handleCheck(option)}
                                            textStyle={{ color: themeColors.primaryText }}
                                            containerStyle={{ backgroundColor: themeColors.secondaryBackground }}
                                        />
                                    ))}
                                </View>

                                <MyButton
                                    style={[styles.button, { borderRadius: 20, backgroundColor: themeColors.secondaryBackground }]}
                                    text='Done'
                                    styleText={{ fontSize: 15, color: themeColors.primaryText }}
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

                            <View style={[styles.modal, { marginTop: '50%', backgroundColor: themeColors.white }]}>

                                <Text style={[styles.modalText, { color: themeColors.primaryText }]}>Should you add your current location to the post?</Text>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='Yes'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
                                        onPress={handleAddLocation}
                                    />

                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='No'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
                                        onPress={() => { console.log("no want to add his location."); setShowLocationModel(false) }}
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

                            <View style={[styles.modal, { marginTop: '50%', backgroundColor: themeColors.white }]}>

                                <Text style={[styles.modalText, { color: themeColors.primaryText }]}>Are you sure you want to leave?</Text>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='Yes'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
                                        onPress={confirmClose}
                                    />

                                    <MyButton
                                        style={{ backgroundColor: themeColors.secondaryBackground, padding: 10, borderRadius: 5, alignItems: 'center' }}
                                        text='No'
                                        styleText={{ fontSize: 17, color: themeColors.primaryText }}
                                        onPress={() => { setModalCloseVisible(false) }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
            {isUploading && (<Text style={{ fontSize: 20, textAlign: 'center', marginTop: '60%', color: themeColors.primaryText }}>Publish Post...</Text>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        marginTop: 15,
        padding: 20,
        ...Platform.select({
            web: {
                marginTop: 0,
            },
        }),
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    iconsWrapper: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
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
        flexDirection: 'column',
        height: '92%',
        minHeight: windowHeight - 200,
    },
    postInput: {
        height: '50%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 14,
    },
    timeInput: {
        borderWidth: 1,
        padding: 10,
        borderColor: 'gray',
        marginVertical: 14,
    },
    button: {
        padding: 10,
        marginTop: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    postInput: {
        height: 200,
        fontSize: 17,
        marginBottom: 20,
        marginTop: 20,
        padding: 10,
        textAlignVertical: 'top'
    },
    timeInput: {
        height: 150,
        fontSize: 17,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top'
    },
    iconsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom: 10,
    },
    modal: {
        position: 'absolute',
        width: '100%',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButton: {
        padding: 10,
        width: 50,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    locationModal: {
        position: 'absolute',
        width: '100%',
        marginTop: '50%'
    }
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
}

const MyButton = ({ style, text, styleText, onPress }) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={styleText}>{text}</Text>
        </TouchableOpacity>
    );
}
