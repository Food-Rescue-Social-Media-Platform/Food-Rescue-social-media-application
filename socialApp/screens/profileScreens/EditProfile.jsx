import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet} from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../styles/colors';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";

const EditProfile = ({ navigation, route }) => {
    const {colors} = useTheme();   
    const { userData } = route.params;
    const { user, logout } = useContext(AuthContext);
    const [userProfileCover, setUserProfileCover] = useState(userData?.profileCover || require('../../assets/Images/cover.png'));
    const [userProfileImage, setUserProfileImage] = useState(userData?.profileImg || require('../../assets/Images/avatar.png'));
    const [firstName, setFirstName] = useState(userData?.firstName || '');
    const [lastName, setLastName] = useState(userData?.lastName || '');
    const [phone, setPhone] = useState(userData?.phoneNumber || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [location, setLocation] = useState(userData?.location || '');
    const [userName, setUserName] = useState(userData?.userName || '');

    const updateUserProfile = async () => {
      try {
          const userDocRef = doc(database, "users", user.uid);
          await updateDoc(userDocRef, {
              ...userData,
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phone,
              email: email,
              location: location,
              userName: firstName + ' ' + lastName,
          });
    
          // Update local state with the new data immediately
          setFirstName(firstName);
          setLastName(lastName);
          setPhone(phone);
          setEmail(email);
          setLocation(location);
          setUserName(firstName + ' ' + lastName);
          
          // Navigate back to ProfileScreen with updated user data
          navigation.navigate('Profile', { 
            postUserId: user.uid, 
            userData: {
              ...userData,
              firstName: firstName,
              lastName: lastName,
              userName: firstName + ' ' + lastName // Pass updated userName
            } 
          });

          console.log("User profile updated successfully");
      } catch (error) {
          console.error("Error updating user profile:", error);
      }
    };

      return (
        <View style={styles.container}> 
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity onPress={null}>
                <View
                  style={{
                    height: 150,
                    width: 300,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={
                      typeof userProfileCover === 'string'
                        ? { uri: userProfileCover }
                        : userProfileCover
                    }
                    style={{ height: 150, width: 300 }}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="camera"
                        size={35}
                        color= {COLORS.white}
                        style={{
                          opacity: 0.7,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: COLORS.white,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <Text></Text>
              <TouchableOpacity onPress={null}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={
                      typeof userProfileImage === 'string'
                        ? { uri: userProfileImage }
                        : userProfileImage
                    }
                    style={{ height: 100, width: 100 }}
                    imageStyle={{ borderRadius: 15 }}
                  >

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="camera"
                        size={35}
                        color= {COLORS.white}
                        style={{
                          opacity: 0.7,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: COLORS.white,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
                {userName}
              </Text>
            </View>
    
            <View style={styles.action}>
              <FontAwesome name="id-card" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:10,

                  },
                ]}
                value={firstName}
                onChangeText={text => setFirstName(text)}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="id-card" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                value={lastName}
                onChangeText={text => setLastName(text)}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="phone" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:18,

                  },
                ]}
                value={phone}
                onChangeText={text => setPhone(text)}
              />
            </View>
            <View style={styles.action}>
              <AntDesign name="email" color={colors.text} size={25} paddingLeft={8}/>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:14,

                  },
                ]}
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </View>
            <View style={styles.action}>
              <MaterialCommunityIcons name="map-marker" color={colors.text} size={27} paddingLeft={5}/>
              <TextInput
                placeholder="location"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:16,
                  },
                ]}
                value={location}
                onChangeText={text => setLocation(text)}
              />
            </View>
            <TouchableOpacity style={styles.commandButton} onPress={updateUserProfile}>
              <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>
        </View>
      );    
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: COLORS.appBackGroundColor,

  },
  commandButton: {
    backgroundColor: COLORS.secondaryBackground,
    padding: 13,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:20,
    marginTop:10,
  },
  panel: {
    padding: 20,
    backgroundColor: COLORS.secondaryTheme,
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: COLORS.secondaryTheme,
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondaryTheme,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: COLORS.secondaryTheme,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
})

export default EditProfile;
