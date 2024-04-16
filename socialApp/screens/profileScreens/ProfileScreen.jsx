import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, getDoc } from "firebase/firestore";
import PostCard from '../../components/postCard/PostCard';
import { Container } from '../../styles/feedStyles';
import { COLORS } from '../../styles/colors';

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext);
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const postUserId = route.params ? route.params.postUserId : user.uid;

  // Fetch user data function
  const fetchUserData = async () => {
    try {
      const userDocRef = doc(database, "users", postUserId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user posts function
  const fetchUserPosts = async () => {
    try {
      const userDocRef = doc(database, "users", postUserId);
      const userDocSnap = await getDoc(userDocRef);
      const postsIdArray = userDocSnap.data().postsId;

      const userPostsData = [];
      for (const postId of postsIdArray) {
        const postDocRef = doc(database, "postsTest", postId);
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();
          // Check if userData is not null before accessing its properties
          if (userData) {
            postData.firstName = userData.firstName;
            postData.lastName = userData.lastName;
            postData.userName = userData.userName;
          }
          userPostsData.push({ id: postId, ...postData });
        }
      }

      setUserPosts(userPostsData);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch data when screen is focused
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchUserData();
      fetchUserPosts();
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
      {userData && (
          <View style={styles.header}>
            <Image source={userData.profileCover ? { uri: userData.profileCover } : require('../../assets/Images/cover.png')} style={styles.coverImage} />              
            <View style={styles.overlay}>
              <View style={styles.avatarContainer}>
                <Image source={userData.profileImg ? { uri: userData.profileImg } : require('../../assets/Images/avatar.png')} style={styles.avatar} />
              </View>
              <Text style={styles.name}>{userData?.userName}</Text>
            </View>
          </View>
        )}
        <View style={styles.profileInfo}>
          <View style={styles.stats}>
            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'star'} size={22} color={COLORS.black} />
                <MaterialCommunityIcons name={'star'} size={22} color={COLORS.black} />
                <MaterialCommunityIcons name={'star'} size={22} color={COLORS.black} />
                <MaterialCommunityIcons name={'star-half-full'} size={22} color={COLORS.black} />
                <MaterialCommunityIcons name={'star-outline'} size={22} color={COLORS.black} />
              </View>
              <Text style={styles.wordStat}>Rating</Text>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'heart'} size={22} color={COLORS.black} />
                <Text style={styles.statNumValue}>{userData?.followingNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Following</Text>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'account-group'} size={22} color={COLORS.black} />
                <Text style={styles.statNumValue}>{userData?.followersNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Followers</Text>
            </View>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'send'} size={22} color={COLORS.black} />
                <Text style={styles.statNumValue}>{userData?.postsNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Posts</Text>
            </View>

          </View>
        </View>
        
        { postUserId==user.uid?
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={() => navigation.navigate('Edit Profile', { userData })}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]}>
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
            </View>    
        }

        <View>
          <Text style={styles.earningsPoints}>Advertising earnings points: {userData?.earningPoints || 0}</Text>
        </View>
        <View style={styles.bio}>
          <Text style={styles.bioText}>Bio</Text>
          <Text style={styles.bioContent}>{userData?.bio || '...'}</Text>
        </View>
        <Container>
          {userPosts.map(post => (
            <PostCard key={post.id} item={post} isProfilePage={true}/>
          ))}
        </Container>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackGroundColor,
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 115,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 69,
    height: 69,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 63,
    height: 63,
    borderRadius: 35,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop:-10,
    marginLeft:14,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginRight: '8%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumValue: {
    marginLeft: 4,
  },
  wordStat: {
    marginTop: 4,
    color: COLORS.black,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
  },
  earningsPoints: {
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 20,
    backgroundColor: COLORS.secondaryTheme,
    height: 45,
    width:372,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap:10,
    width: '100%',
    marginBottom:'3%',
    marginTop: '6%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.secondaryTheme,
    padding: 13,
    borderRadius: 10,
    width: '44%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: '3%',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 20,
    backgroundColor: COLORS.secondaryTheme,
    width:372,
    justifyContent: 'center',
    alignItems: 'left',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  bioText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioContent: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
