import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text, Alert } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { Container } from '../../styles/feedStyles';
import PostCard from '../../components/postCard/PostCard';
import AddPostCard from '../../components/addPost/AddPostCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import { useDarkMode } from '../../styles/DarkModeContext';
import { getPostsWithFilters, getPostsFromFollowers } from '../../FirebaseFunctions/collections/post';
import { useRoute } from "@react-navigation/native";
import { Button } from 'react-native-elements';

const HomeScreen = () => {
    const route = useRoute();
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [firstFetchForYou, setFirstFetchForYou] = useState(true);
    const [firstFetchFollowing, setFirstFetchFollowing] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [position, setPosition] = useState(null);
    const [radius, setRadius] = useState(10);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [feedChoice, setFeedChoice] = useState('For You');
    const [ buttonTitle, setButtonTitle ] = useState('Share Location');
    const [ permissionDenied, setPermissionDenied ] = useState(false);
    const { theme } = useDarkMode();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const fetchData = async (loadMore = false) => {
        if (!position && feedChoice === 'For You') {
            console.info("No position found");
            return;
        }

        if (!loadMore && !lastVisible && (!firstFetchForYou || !firstFetchFollowing) && !refreshing) {
                console.log("No lastVisible found for initial load");
                return;
        }
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
    
            let newPosts = [];
            let lastVisibleDoc = loadMore ? lastVisible : null;
    
            if (feedChoice === 'For You') {
                const result = await getPostsWithFilters(
                    [position.latitude, position.longitude],
                    radius,
                    user.uid,
                    selectedCategories,
                    false,
                    lastVisibleDoc,
                );
                newPosts = result.posts;
                lastVisibleDoc = result.lastVisible;
            } else {
                const result = await getPostsFromFollowers(user.uid, false, lastVisibleDoc);
                newPosts = result.posts;
                lastVisibleDoc = result.lastVisible;
            }
    
            if (loadMore) {
                setPosts(prevPosts => {
                    return [...prevPosts, ...newPosts];
                });
            } else {
                setPosts(newPosts);
            }
    
            if (feedChoice === 'For You' && firstFetchForYou) setFirstFetchForYou(false);
            if (feedChoice === 'Following' && firstFetchFollowing) setFirstFetchFollowing(false);
    
            setLastVisible(lastVisibleDoc);
            setLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const fetchLocationAndPosts = async () => {
            console.log("before permissionDenied", permissionDenied)
            await getLocation(setPosition, null, setPermissionDenied);
            console.log("after permissionDenied", permissionDenied)
        };
        fetchLocationAndPosts();
     }, []);

    useEffect(() => {
        if (isFocused) {
            setFeedChoice(route.params?.feedChoice || 'For You');
            setRadius(route.params?.radius || 10);
            setSelectedCategories(route.params?.selectedCategories || []);
            setLastVisible(null);
            setFirstFetchForYou(true);
            setFirstFetchFollowing(true);
            if(position) fetchData();
        }
    }, [isFocused, route.params]);

   useEffect(() => {
        // if(!position){
        //     const showAlertLocation = async () => {
        //         showAlert("Location not found", "Please share your location to see posts");
        //         await getLocation(setPosition);
        //         return;
        //     };
        //     showAlertLocation();
        // }
        if (position) {
            setLastVisible(null);
            // setHaveMorePosts(true);
            fetchData();
        }
        if (position) {
            // setFeedChoice(route.params?.feedChoice || 'For You');
            // setRadius(route.params?.radius || 10);
            // setSelectedCategories(route.params?.selectedCategories || []);
            // setLastVisible(null);
            // setHaveMorePosts(true);
            // setFirstFetchForYou(true);
            // setFirstFetchFollowing(true);
            // fetchData();
        }
    }, [position, feedChoice, selectedCategories, radius]);

    const onRefresh = async () => {
        setRefreshing(true);
        setLastVisible(null);
        if(position) await fetchData();
        setRefreshing(false);
     };

    const loadMore = async () => {
        if (!loadingMore && lastVisible) {
           setIsLoadingMore(true);
           if(position) await fetchData(true);
           setIsLoadingMore(false);
     }
    };

    if (loading && !loadingMore && posts.length !== 0) {
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
               <AddPostCard/>
               { permissionDenied &&
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Button
                            title={buttonTitle}
                            onPress={async () => {
                                await getLocation(setPosition);
                                setButtonTitle("Location Shared ...");
                                if(position) fetchData();
                            }}
                            style = {{ width: 200, height: 50,  backgroundColor: '#007BFF', borderRadius: 10}}
                        />
                    </View>
                }

                <FlatList
                    data={posts}
                    style={{ width: '100%' }}
                    renderItem={({ item, index }) => {
                        if (item && item.id) {
                            return <PostCard key={item.id} item={item} navigation={navigation} postUserId={item.userId} isProfilePage={false} userLocation={position} />;
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
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={theme.primaryText} />}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                           { position &&
                               <Text style={{ color: theme.primaryText }}>No posts available. Pull down to refresh.</Text>
                            }
                        </View>
                    )}
            /> 
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer:{
        flex: 1,
        marginTop: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default HomeScreen;