import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AddPostCard from '../../components/addPost/AddPostCard';
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
  const [refreshing, setRefreshing] = useState(false);
  const postUserId = route.params ? route.params.postUserId : user.uid;
  const [isFollowing, setIsFollowing] = useState(false);

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

      // Check if postsIdArray is empty
      if (postsIdArray.length === 0) {
        setUserPosts([]); // Set userPosts state to an empty array
        setLoading(false); // Set loading state to false
        return; // Exit the function early
      }

      for (const postId of postsIdArray) {
        const postDocRef = doc(database, "postsTest", postId);
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();
          // Check if userData is not null before accessing its properties
          if (userData) {
            // Update the post data with new user data
            postData.firstName = userData.firstName;
            postData.lastName = userData.lastName;
            postData.userName = userData.userName;
            postData.userImg = userData.profileImg;
            // Update the post document in Firestore
            await updateDoc(postDocRef, {
              firstName: userData.firstName,
              lastName: userData.lastName,
              userName: userData.userName,
              userImg: userData.profileImg // Adjust the field name if needed
            });
          }
          userPostsData.push({ id: postId, ...postData });
        }
      }

      setUserPosts(userPostsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFollowButton = async () => {
    try {
      setIsFollowing(!isFollowing);
      // Reference to the logged-in user's document
      const loggedInUserDocRef = doc(database, "users", user.uid);
  
      // Reference to the followed user's document
      const followedUserDocRef = doc(database, "users", postUserId);
  
      // Get data of the logged-in user
      const loggedInUserDocSnap = await getDoc(loggedInUserDocRef);
      const loggedInUserData = loggedInUserDocSnap.data();
  
      // Get data of the followed user
      const followedUserDocSnap = await getDoc(followedUserDocRef);
      const followedUserData = followedUserDocSnap.data();
  
      if (isFollowing) {
        // Remove followed user's ID from the follower's following list
        const updatedFollowingUsersId = loggedInUserData.followingUsersId.filter(id => id !== postUserId);
  
        // Remove follower's ID from the followed user's followers list
        const updatedFollowersUsersId = followedUserData.followersUsersId.filter(id => id !== user.uid);
  
        // Update logged-in user's following list
        await updateDoc(loggedInUserDocRef, { followingUsersId: updatedFollowingUsersId });
  
        // Update followed user's followers list
        await updateDoc(followedUserDocRef, { followersUsersId: updatedFollowersUsersId });
      } else {
        // Add followed user's ID to the follower's following list
        const updatedFollowingUsersId = [...loggedInUserData.followingUsersId, postUserId];
  
        // Add follower's ID to the followed user's followers list
        const updatedFollowersUsersId = [...followedUserData.followersUsersId, user.uid];
  
        // Update logged-in user's following list
        await updateDoc(loggedInUserDocRef, { followingUsersId: updatedFollowingUsersId });
  
        // Update followed user's followers list
        await updateDoc(followedUserDocRef, { followersUsersId: updatedFollowersUsersId });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  // Fetch data when screen is focused
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchUserData();
      fetchUserPosts();
      const checkFollowingStatus = async () => {
        try {
          const loggedInUserDocRef = doc(database, "users", user.uid);
          const loggedInUserDocSnap = await getDoc(loggedInUserDocRef);
          if (loggedInUserDocSnap.exists()) {
            const followingUsersId = loggedInUserDocSnap.data().followingUsersId;
            setIsFollowing(followingUsersId.includes(postUserId));
          }
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      };
      checkFollowingStatus();
    }
  }, [isFocused]);

  // Render button text based on follow status
  const renderButtonText = () => {
    if (isFollowing) {
      return 'Following';
    } else {
      return 'Follow';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchUserPosts();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                                                                        refreshing={refreshing}
                                                                        onRefresh={onRefresh}
                                                                      />
                                                                    }
    >
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
              <TouchableOpacity onPress={() => navigation.navigate('Following List', { userData })}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name={'heart'} size={22} color={COLORS.black} />
                  <Text style={styles.statNumValue}>{userData?.followingNum || 0}</Text>
                </View>
                <Text style={styles.wordStat}>Following</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Followers List', { userData })}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name={'account-group'} size={22} color={COLORS.black} />
                  <Text style={styles.statNumValue}>{userData?.followersNum || 0}</Text>
                </View>
                <Text style={styles.wordStat}>Followers</Text>
              </TouchableOpacity>
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
        {Platform.OS === 'web' && (
          <Container style={styles.CardContainerAndSideContainer}> 
            <Container style={postUserId === user.uid ? styles.sideContainerUser : styles.sideContainerOther}>
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
                    <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={handleFollowButton}>
                      <Text style={styles.buttonText}>{renderButtonText()}</Text>
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
            </Container>
            <Container style={styles.CardContainer}>
              {postUserId === user.uid && <AddPostCard />}
              <Text style={styles.PostsTitleText}>Posts</Text>
              {userPosts.map(post => (
                <PostCard key={post.id} item={post} postUserId={postUserId} isProfilePage={true}/>
              ))}
            </Container>
          </Container>
        )}
        {Platform.OS !== 'web' && (
          <Container>
            {postUserId === user.uid ? (
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={() => navigation.navigate('Edit Profile', { userData })}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={logout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]}>
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryTheme }]} onPress={handleFollowButton}>
                  <Text style={styles.buttonText}>{renderButtonText()}</Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              <Text style={styles.earningsPoints}>Advertising earnings points: {userData?.earningPoints || 0}</Text>
            </View>
            <View style={styles.bio}>
              <Text style={styles.bioText}>Bio</Text>
              <Text style={styles.bioContent}>{userData?.bio || '...'}</Text>
            </View>
            {postUserId === user.uid && <AddPostCard />}
            <Text style={styles.PostsTitleText}>Posts</Text>
            {userPosts.map(post => (
              <PostCard key={post.id} item={post} postUserId={postUserId} isProfilePage={true}/>
            ))}
          </Container>
        )}



        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackGroundColor,
  },
  lowerContainer: {
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
    marginBottom:'3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.secondaryTheme,
    padding: 13,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: '3%',
    marginBottom: '6%',

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
  PostsTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight:'82%',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /////////////////////////////////////////////////////////////
  ...Platform.select({
    web: {
      container: {
        flex: 1,
        backgroundColor: COLORS.appBackGroundColor,
      },
      // Inside the Platform.select block for web styles
      CardContainer: {
        backgroundColor: COLORS.appBackGroundColor,
        width: '70%', // Adjust the width as needed
        alignItems: 'left', // You can remove this if not necessary
        marginLeft:'-5%',
      },
      sideContainerUser: {
        backgroundColor: COLORS.appBackGroundColor,
        zIndex: 2, // Ensure it's above the hidden content
        alignItems: 'left', // You can remove this if not necessary
        justifyContent: 'left', // You can remove this if not necessary
        width: '30%', // Adjust the width as needed
        marginTop:'-83.5%',
      },
      sideContainerOther:{
        backgroundColor: COLORS.appBackGroundColor,
        zIndex: 2, // Ensure it's above the hidden content
        alignItems: 'left', // You can remove this if not necessary
        justifyContent: 'left', // You can remove this if not necessary
        width: '30%', // Adjust the width as needed
        marginTop:'-65.5%',
      },
      CardContainerAndSideContainer: {
        flexDirection: 'row', // Ensure the containers are positioned beside each other
        width: '70%',
        alignItems: 'center', // You can adjust this based on your design
      },
      header: {
        position: 'relative',
        width: '100%',
        height: 400,
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
        top: 200,
        left: 30,
        flexDirection: 'row',
        alignItems: 'center',
      },
      avatarContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
      },
      avatar: {
        width: 190,
        height: 190,
        borderRadius: 100,
      },
      name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.black,
        marginTop: 28,
      },
      profileInfo: {
        alignItems: 'center',
        marginTop:-40,
        marginLeft:'13%',
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
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        padding: 10,
        borderRadius: 10,
        marginLeft: '1%',
        zIndex: 2, // Ensure it's above the hidden content
      },
      buttons: {
        flexDirection: 'row',
        gap:10,
        marginBottom:'1%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, // Ensure it's above the hidden content
        marginLeft:'-5%',
      },
      button: {
        backgroundColor: COLORS.secondaryTheme,
        padding: 13,
        borderRadius: 10,
        width: '42%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
      },
      bio: {
        marginTop: '1%',
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 20,
        backgroundColor: COLORS.secondaryTheme,
        marginLeft: '1%',     
        justifyContent: 'center',
        alignItems: 'left',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        zIndex: 2, // Ensure it's above the hidden content
      },
      bioText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      PostsTitleText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft:'15%',
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
    },
  })
});

export default ProfileScreen;