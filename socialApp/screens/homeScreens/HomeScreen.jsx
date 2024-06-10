import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import { Container } from '../../styles/feedStyles';
import PostCard from '../../components/postCard/PostCard';
import { database } from '../../firebase';
import { collection, getDocs, addDoc } from "firebase/firestore";
import AddPostCard from '../../components/addPost/AddPostCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDarkMode } from '../../styles/DarkModeContext';
import { watchLocation } from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';


const HomeScreen = () => {
    const { logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [position, setPosition] = useState(null);
    const { theme } = useDarkMode(); // Access the current theme

    const addPostToCollection = async () => {
        try {
            const postData = {
                category: "Seafood",
                createdAt: new Date("2024-04-10T09:26:46Z"), // UTC time equivalent to 12:26:46 UTC+3
                deliveryRange: "every day from 10:00 to 14:00",
                firstName: "Abo",
                lastName: "Yousef",
                location: "jerusalem",
                phoneNumber: "0558729400",
                postDistance: "3km",
                postImg: "https://firebasestorage.googleapis.com/v0/b/food-rescue-social-platform.appspot.com/o/postsImges%2Fpost-img-6.jpg?alt=media&token=7ba23e50-791c-4e53-ab92-367907ef17a9",
                postText: "after a big party. we have a big box of fresh sushi.",
                status: "rescued",
                userId: "zsERzWzcK7cp50c1bzIoSqxpBsA2",
                userImg: "https://firebasestorage.googleapis.com/v0/b/food-rescue-social-platform.appspot.com/o/usersImages%2F1713776555256?alt=media&token=93c13d46-38f2-4b3c-ad85-6f67c3d0e8d7",
                userName: "Abo Yousef"
            };
            const docRef = await addDoc(collection(database, "postsTest"), postData);
            console.log("Post added with ID:", docRef.id);
        } catch (error) {
            console.error("Error adding post:", error.message);
        }
    };

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(database, "postsTest"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => b.createdAt - a.createdAt);
            setPosts([{}, ...data]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            const fetchLocationAndPosts = async () => {
                await getLocation(setPosition);
                if(position) {
                    watchLocation(setPosition);
                }
                fetchData();
            }
            fetchLocationAndPosts();
        }
    }, [isFocused]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (loading) {
      return (
          <View style={[styles.loadingContainer, { backgroundColor: theme.appBackGroundColor }]}>
              <ActivityIndicator size="large" color={theme.primaryText} />
          </View>
        );
    }
    
    if (error) {
      return <Text style={{ color: theme.primaryText }}>Error: {error}</Text>;
    }

    return (
      <Container style={[styles.container, { backgroundColor: theme.appBackGroundColor }]}>
          <FlatList
              data={posts}
              renderItem={({ item, index }) => {
                  if (index === 0) {
                      return <AddPostCard />                        
                  }
                  else {
                      return <PostCard item={item} navigation={navigation} postUserId={item.userId} isProfilePage={false} userLocation={position} />;
                  }
              }}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={theme.primaryText} // Added to style the RefreshControl spinner
                  />
              }
          />
          <FormButton buttonTitle='Logout' onPress={() => logout()} />
      </Container>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PostsTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: '82%',
  },
});

export default HomeScreen;
