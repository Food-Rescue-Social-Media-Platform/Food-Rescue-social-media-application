import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, button, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../firebase'; // Import the Firestore instance from firebase.js
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import PostCard from '../components/PostCard';
import { Container } from '../styles/feedStyles';
const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(database, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  useEffect(() => {
      const fetchUserPosts = async () => {
          try {
              // Fetch the user document
              const userDocRef = doc(database, "users", user.uid);
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
          }
      };

      fetchUserPosts();
  }, [user.uid]); // Fetch data whenever the user ID changes

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
          <View style={styles.header}>
              <Image source={{ uri: userData?.profileCover }} style={styles.coverImage} />
              <View style={styles.overlay}>
                  <View style={styles.avatarContainer}>
                      <Image source={{ uri: userData?.profileImg }} style={styles.avatar} />
                  </View>
                  <Text style={styles.name}>{userData?.userName}</Text>
              </View>
          </View>
          <View style={styles.profileInfo}>
              <View style={styles.stats}>
                  <View style={styles.starsStats}>
                      <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                      <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                      <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                      <MaterialCommunityIcons name={'star-half-full'} size={22} color="#000" />
                      <MaterialCommunityIcons name={'star-outline'} size={22} color="#000" />
                  </View>
                  
                  <View style={styles.followingStats}>
                      <MaterialCommunityIcons name={'heart'} size={22} color="#000" />
                      <Text style={styles.statNumValue}>{userData?.followingNum || 0}</Text>
                  </View>
                  
                  <View style={styles.followersStats}>
                      <MaterialCommunityIcons name={'account-group'} size={22} color="#000" />
                      <Text style={styles.statNumValue}>{userData?.followersNum || 0}</Text>
                  </View>
                  
                  <View style={styles.postsStats}>
                      <MaterialCommunityIcons name={'send'} size={22} color="#000" />
                      <Text style={styles.statNumValue}>{userData?.postsNum || 0}</Text>
                  </View>

              </View>
              <View style={styles.stats}>
                  <Text style={styles.RatingStat}>Rating</Text>
                  <Text style={styles.FollowingStat}>Following</Text>
                  <Text style={styles.FollowersStat}>Followers</Text>
                  <Text style={styles.PostsStat}>Posts</Text>
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

              {/* <Text style={styles.bioContent}>Tel Aviv-Yafo ❤</Text> */}
              {/* <Text style={styles.bioContent}>My hobbies are gym💪,thai boxing, football⚽and swimming🏊⚓</Text> */}
          </View>
          <Container>
                {userPosts.map(post => (
                    <PostCard key={post.id} item={post} />
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
    height: 200, // Adjust the height according to your preference
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '70%', // Adjust the height to cover the entire header
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
    width: 69, // Adjust the size to accommodate avatar + 4px padding
    height: 69, // Adjust the size to accommodate avatar + 4px padding
    borderRadius: 35, // Adjust the size + 2 for border radius effect
    backgroundColor: '#fff', // White background for the circle
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
  stats: {
    flexDirection: 'row',
    width: '100%',
    gap:1,
  },
  stat: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  RatingStat: {
    fontSize: 13,
    marginLeft: 40,
  },
  FollowingStat: {
    fontSize: 13,
    marginLeft: 60,
  },
  FollowersStat: {
    fontSize: 13,
    marginLeft: 33,
  },
  PostsStat: {
    fontSize: 13,
    marginLeft: 47,
  },

  earningsPoints: {
    fontSize: 17,
    fontWeight: 'bold', // Apply bold font weight
    marginHorizontal: 20, // Reduced margin here
    backgroundColor: '#CEF0D3',
    height: 45,
    width:372,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    alignContent: 'center',
    textAlign: 'center', // Center text horizontally
    padding: 10,
    borderRadius: 10,
  },
  statNumValue: {
    fontSize: 16,
    paddingLeft:4,
  },
  starsStats: {
    flexDirection: 'row',
    marginHorizontal: 5, // Reduced margin here
  },
  followingStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  followersStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  postsStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  buttons: {
    flexDirection: 'row',
    gap:10,
    width: '100%',
    marginBottom:'3%',
    marginTop: '6%',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally

  },
  button: {
    backgroundColor: '#CEF0D3',
    padding: 13,
    borderRadius: 10,
    width: '44%',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold', // Apply bold font weight
  },
  bio: {
    marginTop: '3%',
    fontSize: 17,
    fontWeight: 'bold', // Apply bold font weight
    marginHorizontal: 20, // Reduced margin here
    backgroundColor: '#CEF0D3',
    width:372,
    justifyContent: 'center', // Center vertically
    alignItems: 'left', // Center horizontally
    paddingVertical: 10, // Adjust vertical padding
    paddingHorizontal: 10, // Adjust horizontal padding
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
  
});

export default ProfileScreen;
