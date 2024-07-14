import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AddPostCard from '../../components/addPost/AddPostCard';
import PostCard from '../../components/postCard/PostCard';
import WebPostCard from '../../components/postCard/webPostCard'
import { Container } from '../../styles/feedStyles';
import { COLORS, DARKCOLORS } from '../../styles/colors';
import { Chat, addChat, fetchChat } from '../../FirebaseFunctions/collections/chat';
import uuid from 'react-native-uuid';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import useDarkMode hook
import { useTranslation } from 'react-i18next';
import PostsList from '../../components/postsLIst/PostsList';
import { getPostOfUser } from '../../FirebaseFunctions/collections/post';

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, theme } = useDarkMode(); // Use the hook to get the current theme
  const themeColors = isDarkMode ? DARKCOLORS : COLORS; // Set theme-based colors
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ userConnected, setUserConnected ] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const postUserId = route.params ? route.params.postUserId : user.uid;

  const [lastIndex , setLastIndex ] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [rating, setRating] = useState();
  const { t } = useTranslation();

  const fetchUserData = async () => {
    let user_data;
    if(route.params) {
      user_data = await fetchUser(user.uid);
      if(user_data) {
          user_data.id = user.uid;
          setUserConnected(user_data);
      }
    }
    user_data = await fetchUser(postUserId);
    if(user_data) {
          user_data.id = postUserId;
          setUserData(user_data);
          setRating(user_data.rating);
    }
  };

  const fetchUser = async (id) => {
    try{
      const docRef = doc(database, "users", id);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()) {
          return;
      }
      return docSnap.data();
    } catch (error) {
      console.error("fetchUser, Error getting document:", error);
      setError(error.message);
      return null;
    }
  };

  const fetchUserPosts = async (loadMore = false) => {
    if (loadMore) {
        setLoadingMore(true);
    } else {
        setLoading(true);
    }
    const result = await getPostOfUser(postUserId, userData, lastIndex);
    console.log("RESULT", result.posts);
    setUserPosts(result.posts);
    setLastIndex(lastIndex);
    setLoading(false);


    
    // try {
    //   const userDocRef = doc(database, "users", postUserId);
    //   const userDocSnap = await getDoc(userDocRef);
    //   const postsIdArray = userDocSnap.data()?.postsId;

    //   const userPostsData = [];

    //   if (postsIdArray?.length === 0 || !postsIdArray || !userDocSnap.exists()) {
    //     setUserPosts([]);
    //     setLoading(false);
    //     return;
    //   }

    //   for (const postId of postsIdArray) {
    //     const postDocRef = doc(database, "posts", postId);
    //     const postDocSnap = await getDoc(postDocRef);
    //     if (postDocSnap.exists()) {
    //       const postData = postDocSnap.data();
    //       if (userData) {
    //         postData.firstName = userData.firstName;
    //         postData.lastName = userData.lastName;
    //         postData.userName = userData.userName;
    //         postData.userImg = userData.profileImg;
    //         await updateDoc(postDocRef, {
    //           firstName: userData.firstName,
    //           lastName: userData.lastName,
    //           userName: userData.userName,
    //           userImg: userData.profileImg
    //         });
    //       }
    //       userPostsData.push({ id: postId, ...postData });
    //     }
    //   }

    //   setUserPosts(userPostsData);
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching user posts:", error);
    //   setError(error.message);
    //   setLoading(false);
    // }
  };

  const handleFollowButton = async () => {
    try {
      setIsFollowing(!isFollowing);
      const loggedInUserDocRef = doc(database, "users", user.uid);
      const followedUserDocRef = doc(database, "users", postUserId);
      const loggedInUserDocSnap = await getDoc(loggedInUserDocRef);
      const loggedInUserData = loggedInUserDocSnap.data();
      const followedUserDocSnap = await getDoc(followedUserDocRef);
      const followedUserData = followedUserDocSnap.data();

      if (isFollowing) {
        const updatedFollowingUsersId = loggedInUserData.followingUsersId.filter(id => id !== postUserId);
        const updatedFollowingNum = loggedInUserData.followingNum - 1;
        const updatedFollowersUsersId = followedUserData.followersUsersId.filter(id => id !== user.uid);
        const updatedFollowersNum = followedUserData.followersNum - 1;
        await updateDoc(loggedInUserDocRef, { followingUsersId: updatedFollowingUsersId, followingNum: updatedFollowingNum });
        await updateDoc(followedUserDocRef, { followersUsersId: updatedFollowersUsersId, followersNum: updatedFollowersNum });
      } else {
        const updatedFollowingUsersId = [...loggedInUserData.followingUsersId, postUserId];
        const updatedFollowingNum = loggedInUserData.followingNum + 1;
        const updatedFollowersUsersId = [...followedUserData.followersUsersId, user.uid];
        const updatedFollowersNum = followedUserData.followersNum + 1;
        await updateDoc(loggedInUserDocRef, { followingUsersId: updatedFollowingUsersId, followingNum: updatedFollowingNum });
        await updateDoc(followedUserDocRef, { followersUsersId: updatedFollowersUsersId, followersNum: updatedFollowersNum });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <MaterialCommunityIcons key={i} name="star" size={22} color={themeColors.black} />
        );
      } else if (i - rating < 1) {
        stars.push(
          <MaterialCommunityIcons key={i} name="star-half-full" size={22} color={themeColors.black} />
        );
      } else {
        stars.push(
          <MaterialCommunityIcons key={i} name="star-outline" size={22} color={themeColors.black} />
        );
      }
    }
    return stars;
  };

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

  const renderButtonText = () => {
    return isFollowing ? 'Following' : 'Follow';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchUserPosts();
    setRefreshing(false);
  };

  const handleOpenChat = async () => {
    fetchChat(userConnected.id, userData.id, async (chat) => {
      if (chat !== null) {
        navigation.navigate('SingleChat', { receiverData: chat, userConnected: userConnected });
      } else {
        await createNewChat();
        fetchChat(userConnected.uid, userData.id, async (newChat) => {
          if (newChat !== null) {
            navigation.navigate('SingleChat', { receiverData: newChat, userConnected: userConnected });
          }
        });
      }
    });
  };

  const createNewChat = async () => {
    const roomID = uuid.v4();
    const chat = new Chat(roomID, userConnected, userData);
    await addChat(chat, 'chatsList/' + userConnected.id + '/' + userData.id);
    const chat2 = new Chat(roomID, userData, userConnected);
    await addChat(chat2, 'chatsList/' + userData.id + '/' + userConnected.id);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.appBackGroundColor }]}>
          <ActivityIndicator size="large" color={theme.primaryText} />
      </View>
    );
  }

  if (error) {
    return <Text style={{ color: themeColors.black }}>Error: {error}</Text>;
  }

  const loadMore = async () => {
       await fetchUserPosts(true);
   }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.black} />
      }
    >
      <View style={[styles.container, { backgroundColor: themeColors.appBackGroundColor }]}>
        {userData && (
          <View style={styles.header}>
            <Image source={userData.profileCover ? { uri: userData.profileCover } : require('../../assets/Images/cover.png')} style={styles.coverImage} />              
            <View style={styles.overlay}>
              <View style={styles.avatarContainer}>
                <Image source={userData.profileImg ? { uri: userData.profileImg } : require('../../assets/Images/emptyProfieImage.png')} style={styles.avatar} />
              </View>
              <Text style={[styles.name, { color: themeColors.black }]}>{userData?.userName}</Text>
            </View>
          </View>
        )}
        <View style={styles.profileInfo}>
          <View style={styles.stats}>
            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                {postUserId === user.uid ? (
                  <View>
                    <View style={styles.iconContainer}>
                      {renderStars()}
                    </View>
                    <Text style={[styles.wordRatingStat, { color: themeColors.black }]}>{t('Rating')}</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => navigation.navigate('Rating', { userData })}>
                    <View style={styles.iconContainer}>
                      {renderStars()}
                    </View>
                    <Text style={[styles.wordRatingStat, { color: themeColors.black }]}>{t('Rating')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.userInfoContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Following List', { userData })}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name={'heart'} size={22} color={themeColors.black} />
                  <Text style={[styles.statNumValue, { color: themeColors.black }]}>{userData?.followingNum || 0}</Text>
                </View>
                <Text style={[styles.wordStat, { color: themeColors.black }]}>{t('Following')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Followers List', { userData })}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name={'account-group'} size={22} color={themeColors.black} />
                  <Text style={[styles.statNumValue, { color: themeColors.black }]}>{userData?.followersNum || 0}</Text>
                </View>
                <Text style={[styles.wordStat, { color: themeColors.black }]}>{t('Followers')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'send'} size={22} color={themeColors.black} />
                <Text style={[styles.statNumValue, { color: themeColors.black }]}>{userData?.postsNum || 0}</Text>
              </View>
              <Text style={[styles.wordStat, { color: themeColors.black }]}>{t('Posts')}</Text>
            </View>

          </View>
        </View>
        {Platform.OS === 'web' && (
          <View style={[styles.CardContainerAndSideContainer, {backgroundColor: themeColors.appBackGroundColor}]}>
            <Container style={[
                postUserId === user.uid ? styles.sideContainerUser : styles.sideContainerOther,
                { backgroundColor: themeColors.appBackGroundColor }
            ]}>
              {postUserId === user.uid ?
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={() => navigation.navigate('Edit Profile', { userData })}>
                    <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Edit Profile')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={logout}>
                    <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Logout')}</Text>
                  </TouchableOpacity>
                </View>
                :
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={handleOpenChat}>
                    <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Chat')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={handleFollowButton}>
                    <Text style={[styles.buttonText, { color: themeColors.black }]}>{renderButtonText()}</Text>
                  </TouchableOpacity>
                </View>
              }

              <View>
                <Text style={[styles.earningsPoints, { color: themeColors.black, backgroundColor: themeColors.secondaryTheme }]}>{t('Advertising earnings points:')} {userData?.earningPoints || 0}</Text>
              </View>
              <View style={[styles.bio, { backgroundColor: themeColors.secondaryTheme }]}>
                <Text style={[styles.bioText, { color: themeColors.black }]}>{t('Bio')}</Text>
                <Text style={[styles.bioContent, { color: themeColors.black }]}>{userData?.bio || '...'}</Text>
              </View>
            </Container>
            <Container style={[styles.CardContainer, {backgroundColor: themeColors.appBackGroundColor}]}>
              {postUserId === user.uid && <AddPostCard />}
              <Text style={[styles.PostsTitleText, { color: themeColors.black }]}>{t('Posts')}</Text>
              {userPosts.map(post => (
                <WebPostCard key={post.id} item={post} postUserId={postUserId} isProfilePage={true} />
              ))}
            </Container>
          </View>
        )}
        {Platform.OS !== 'web' && (
          <View style={backgroundColor=themeColors.appBackGroundColor}>
            {postUserId === user.uid ? (
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={() => navigation.navigate('Edit Profile', { userData })}>
                  <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Edit Profile')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={logout}>
                  <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Logout')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={handleOpenChat}>
                  <Text style={[styles.buttonText, { color: themeColors.black }]}>{t('Chat')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.secondaryTheme }]} onPress={handleFollowButton}>
                  <Text style={[styles.buttonText, { color: themeColors.black }]}>{renderButtonText()}</Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              <Text style={[styles.earningsPoints, { color: themeColors.black, backgroundColor: themeColors.secondaryTheme }]}>{t('Advertising earnings points:')} {userData?.earningPoints || 0}</Text>
            </View>
            <View style={[styles.bio, { backgroundColor: themeColors.secondaryTheme }]}>
              <Text style={[styles.bioText, { color: themeColors.black }]}>{t('Bio')}</Text>
              <Text style={[styles.bioContent, { color: themeColors.black }]}>{userData?.bio || '...'}</Text>
            </View>

            {/*Add post card*/}
            <Container style={[styles.containerShowCardAndList, { backgroundColor: theme.appBackGroundColor }]}>

              <View style={[styles.AddPostCardContainer,{backgroundColor:themeColors.appBackGroundColor}]}>
                {postUserId === user.uid && <AddPostCard />}
              </View>

              <Text style={[styles.PostsTitleText, { color: themeColors.black }]}>{t('Posts')}</Text>
              <PostsList  
                    posts={userPosts} 
                    loadMore={loadMore} 
                    loadingMore={loadingMore} 
                    position={null}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    isProfilePage={true}
                    theme={theme}
              />

              {/*<View style={[styles.postCardContainer,{backgroundColor:themeColors.appBackGroundColor}]}>
                {userPosts.map(post => (
                  <PostCard key={post.id} item={post} postUserId={postUserId} isProfilePage={true} />
                ))}
              </View> */}
              </Container>
            </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lowerContainer: {
    flex: 1,
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
    marginTop: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginLeft: 14,
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
  },
  wordRatingStat: {
    marginTop: 4,
    marginLeft: 35,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
  },
  earningsPoints: {
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 20,
    height: 45,
    width: 372,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: '3%',
    marginTop: '3%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
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
    marginBottom: '6%',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 20,
    width: 372,
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
    marginLeft: '5%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AddPostCardContainer:{
    marginBottom:15,
    marginTop:15,
    marginLeft:20,
    marginRight:20,
  },
  postCardContainer:{
    marginBottom:15,
    marginTop:15,
    marginLeft:18,
    marginRight:18,
  },
  containerShowCardAndList:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ...Platform.select({
    web: {
      container: {
        flex: 1,
      },
      CardContainer: {
        width: '70%',
        alignItems: 'left',
        marginLeft: '-5%',
      },
      sideContainerUser: {
        zIndex: 2,
        alignItems: 'left',
        justifyContent: 'left',
        width: '38%',
        marginTop: '-26%',
      },
      sideContainerOther: {
        zIndex: 2,
        alignItems: 'left',
        justifyContent: 'left',
        width: '30%',
        marginTop: '-65.5%',
      },
      CardContainerAndSideContainer: {
        flexDirection: 'row',
        width: '70%',
        alignItems: 'center',
        marginTop: '1%',

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
        marginTop: 28,
      },
      profileInfo: {
        alignItems: 'center',
        marginTop: -40,
        marginLeft: '13%',
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
      },
      stats: {
        flexDirection: 'row',
        width: '100%',
      },
      earningsPoints: {
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 20,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        padding: 10,
        borderRadius: 10,
        marginLeft: '1%',
        zIndex: 2,
      },
      buttons: {
        flexDirection: 'row',
        gap: 13,
        marginBottom: '1%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        marginLeft: '-5%',
        padding: 4,
      },
      button: {
        padding: 13,
        borderRadius: 10,
        width: '43%',
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
        marginLeft: '1%',
        justifyContent: 'center',
        alignItems: 'left',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        zIndex: 2,
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
        marginLeft: '15%',
      },
      bioContent: {
        fontSize: 16,
        fontWeight: '500',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  }),
});

export default ProfileScreen;
