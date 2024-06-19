import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { Container } from '../../styles/feedStyles';
import PostCard from '../../components/postCard/PostCard';
import AddPostCard from '../../components/addPost/AddPostCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { watchLocation } from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
import { getPostsWithFilters, getPostsFromFollowing } from '../../FirebaseFunctions/collections/post';
import { useRoute } from "@react-navigation/native";

const HomeScreen = () => {
    const route = useRoute();
    const { user, logout } = useContext(AuthContext);    
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [position, setPosition] = useState(null);
    const { theme } = useDarkMode(); // Access the current theme
    const [ message, setMessage ] = useState('');
    const [ isShowMessage, setIsShowMessage ] = useState(false);
    
    const radius =  route.params?.radius || 10;
    const selectedCategories = route.params?.selectedCategories || [];
    const feedChoice = route.params?.feedChoice || 'For You';

    const fetchData = async () => {
        console.log("position:", position);
        if(!position){
            console.info("No position found");
            return;
        }
        try{
            if(feedChoice === 'For You'){
                await getPostsWithFilters([position.latitude, position.longitude], radius, user.uid, selectedCategories, false ).then((posts) => {
                    console.log('postsForYou:', posts);
                    setPosts([{}, ...posts]);
                    setLoading(false);
                })
            } else {
                await getPostsFromFollowing(user.uid, false).then((posts) => {
                    console.log('postsFromFollowing:', posts);
                    setPosts([{}, ...posts]);
                    setLoading(false);
                })
            }
            // if(posts.length === 0){
            //     setMessage("No posts found");
            //     setIsShowMessage(true);
            //     setLoading(false);
            // }
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchLocationAndPosts = async () => {
            await getLocation(setPosition)
        };            
        fetchLocationAndPosts(); 
        console.log("feed choice from home screen:", feedChoice);
    }, []);

    useEffect(() => {
        if (isFocused && position) {
            fetchData();
        }
    }, [isFocused, position, feedChoice, selectedCategories, radius]);

    

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
                            return <AddPostCard />;
                        } else if (item && item.id) {
                            return <PostCard item={item} navigation={navigation} postUserId={item.userId} isProfilePage={false} userLocation={position} />;
                        } else {
                            return null;
                        }
                    }}
                    keyExtractor={(item, index) => item.id ? item.id : index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.primaryText}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                          <Text style={{ color: theme.primaryText }}>No posts available. Pull down to refresh.</Text>
                        </View>
                      )}
                />
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
    emptyContainer:{
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HomeScreen;
