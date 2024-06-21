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
import { getPostsWithFilters, getPostsFromFollowers } from '../../FirebaseFunctions/collections/post';
import { useRoute } from "@react-navigation/native";


const HomeScreen = () => {
    const route = useRoute();
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [ firstFetchForYou, setFirstFetchForYou ] = useState(true);
    const [ firstFetchFollowing, setFirstFetchFollowing ] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [position, setPosition] = useState(null);
    const [radius, setRadius] = useState(route.params?.radius || 10);
    const [selectedCategories, setSelectedCategories] = useState(route.params?.selectedCategories || []);
    const [feedChoice, setFeedChoice] = useState(route.params?.feedChoice || 'For You');
    const { theme } = useDarkMode();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const fetchData = async (loadMore = false) => {
        console.info("Fetching data");
        if (!position && feedChoice === 'For You' ) {
            console.info("No position found");
            return;
        }
        if(lastVisible == null && (!firstFetchForYou || !firstFetchFollowing)){
            console.log("No lastVisible found");
            return;
        }
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            
            let newPosts = [];
            let lastVisibleDoc = lastVisible; // Start with the current lastVisible
    
            if (feedChoice === 'For You') {
                const { posts, lastVisible } = await getPostsWithFilters(
                    [position.latitude, position.longitude], radius, user.uid, selectedCategories, false, lastVisible
                );
                newPosts = posts;
                lastVisibleDoc = lastVisible;
            } else {
                const { posts, lastVisible } = await getPostsFromFollowers(user.uid, false, lastVisible);
                newPosts = posts;
                lastVisibleDoc = lastVisible;
            }
    
            if (loadMore) {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            } else {
                setPosts(newPosts);
            }
    
            if(firstFetchForYou){
                setFirstFetchForYou(false);
            }
            if(firstFetchFollowing){
                setFirstFetchFollowing(false);
            }
            
            setLastVisible(lastVisibleDoc);
            setLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const fetchLocationAndPosts = async () => {
            await getLocation(setPosition);
        };
        fetchLocationAndPosts();
    }, []);

    useEffect(() => {
        if (isFocused) {
            setFeedChoice(route.params?.feedChoice || 'For You');
            setRadius(route.params?.radius || 10);
            setSelectedCategories(route.params?.selectedCategories || []);
            setLastVisible(null);
            fetchData();
        }
    }, [isFocused, route.params]);

    useEffect(() => {
        if (position && feedChoice === 'For You') {
            fetchData();
        }
    }, [position, feedChoice, selectedCategories, radius]);

    const onRefresh = async () => {
        setRefreshing(true);
        setLastVisible(null);
        await fetchData();
        setRefreshing(false);
    };
    const loadMore = async () => {
        if (!loadingMore && lastVisible) {
            await fetchData(true);
        }
    };

    if (loading && !loadingMore) {
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
                        return <AddPostCard/>;
                    } else if (item && item.id) {
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
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={theme.primaryText} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: theme.primaryText }}>No posts available. Pull down to refresh.</Text>
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
