import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { Container } from '../../styles/feedStyles';
import WebPostCard from '../../components/postCard/webPostCard';
import AddPostCard from '../../components/addPost/AddPostCard';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { useDarkMode } from '../../styles/DarkModeContext';
import { getPostsWithFiltersForWeb, getPostsFromFollowersForWeb } from '../../FirebaseFunctions/collections/post';

const WebHomeScreen = () => {
    const route = useRoute();
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [firstFetchForYou, setFirstFetchForYou] = useState(true);
    const [firstFetchFollowing, setFirstFetchFollowing] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [feedChoice, setFeedChoice] = useState('For You');
    const { theme } = useDarkMode();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const fetchData = async (loadMore = false) => {
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
                const result = await getPostsWithFiltersForWeb(
                    user.uid,
                    selectedCategories,
                    lastVisibleDoc,
                );
                newPosts = result.posts;
                lastVisibleDoc = result.lastVisible;
            } else {
                const result = await getPostsFromFollowersForWeb(user.uid, lastVisibleDoc);
                newPosts = result.posts;
                lastVisibleDoc = result.lastVisible;
            }

            if (loadMore) {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
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
        if (isFocused) {
            setFeedChoice(route.params?.feedChoice || 'For You');
            setSelectedCategories(route.params?.selectedCategories || []);
            setLastVisible(null);
            setFirstFetchForYou(true);
            setFirstFetchFollowing(true);
            fetchData();
        }
    }, [isFocused, route.params]);

    const onRefresh = async () => {
        setRefreshing(true);
        setLastVisible(null);
        await fetchData();
        setRefreshing(false);
    };

    const loadMore = async () => {
        if (!loadingMore && lastVisible) {
            setIsLoadingMore(true);
            await fetchData(true);
            setIsLoadingMore(false);
        }
    };

    if (loading && !loadingMore && posts.length === 0) {
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
                style={{ width: '69.5%', marginLeft:'7%'}}
                ListHeaderComponent={ <AddPostCard/>}
                renderItem={({ item, index }) => {
                    if (item && item.id) {
                        return <WebPostCard key={item.id} item={item} navigation={navigation} postUserId={item.userId} isProfilePage={false} />;
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
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        marginTop: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default WebHomeScreen;
