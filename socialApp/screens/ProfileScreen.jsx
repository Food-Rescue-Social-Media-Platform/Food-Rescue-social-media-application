import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../firebase'; // Import the Firestore instance from firebase.js
import { doc, getDoc } from "firebase/firestore";
import PostCard from '../components/PostCard';
import { Container } from '../styles/feedStyles';

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const postUserId = route.params ? route.params.postUserId : user.uid;

  useEffect(() => {
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

    fetchUserData();
  }, [postUserId]);

  useEffect(() => {
      const fetchUserPosts = async () => {
          try {
              // Fetch the user document
              const userDocRef = doc(database, "users", postUserId);
              const userDocSnap = await getDoc(userDocRef);
              
              // Get the postsId array from the user document
              const postsIdArray = userDocSnap.data().postsId;

              // Fetch the posts using the IDs from the postsId array
              const userPostsData = [];
              for (const postId of postsIdArray) {
                  const postDocRef = doc(database, "postsTest", postId);
                  const postDocSnap = await getDoc(postDocRef);
                  if (postDocSnap.exists()) {
                      userPostsData.push({ id: postId, ...postDocSnap.data() });
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

      fetchUserPosts();
  }, [postUserId]); // Fetch data whenever the user ID changes

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
            <Image source={userData.profileCover ? { uri: userData.profileCover } : require('../assets/Images/cover.png')} style={styles.coverImage} />              
            <View style={styles.overlay}>
              <View style={styles.avatarContainer}>
                <Image source={userData.profileImg ? { uri: userData.profileImg } : require('../assets/Images/avatar.png')} style={styles.avatar} />
              </View>
              <Text style={styles.name}>{userData?.userName}</Text>
            </View>
          </View>
        )}
        <View style={styles.profileInfo}>
          <View style={styles.stats}>
            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                <MaterialCommunityIcons name={'star-half-full'} size={22} color="#000" />
                <MaterialCommunityIcons name={'star-outline'} size={22} color="#000" />
              </View>
              <Text style={styles.wordStat}>Rating</Text>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'heart'} size={22} color="#000" />
                <Text style={styles.statNumValue}>{userData?.followingNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Following</Text>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'account-group'} size={22} color="#000" />
                <Text style={styles.statNumValue}>{userData?.followersNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Followers</Text>
            </View>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'send'} size={22} color="#000" />
                <Text style={styles.statNumValue}>{userData?.postsNum || 0}</Text>
              </View>
              <Text style={styles.wordStat}>Posts</Text>
            </View>

          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#CEF0D3' }]}>
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#CEF0D3' }]}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#f9fafd',
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
    backgroundColor: '#fff',
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
    color: '#000',
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
    color: '#000',
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
  },
  earningsPoints: {
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 20,
    backgroundColor: '#CEF0D3',
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
    backgroundColor: '#CEF0D3',
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
    backgroundColor: '#CEF0D3',
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
