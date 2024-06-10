import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { Container } from '../../styles/feedStyles';
import PostCard from '../../components/postCard/PostCard';
import AddPostCard from '../../components/addPost/AddPostCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDarkMode } from '../../styles/DarkModeContext';
import { watchLocation } from '../../hooks/helpersMap/watchLocation';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
import { postsCloseMe } from '../../hooks/helpersFeed/algoShowPostsInFeed';


const HomeScreen = () => {
    const { user, logout } = useContext(AuthContext);    
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [position, setPosition] = useState(null);
    const { theme } = useDarkMode(); // Access the current theme

    const fetchData = async () => {
        console.log("position:", position);
        if(!position) 
            return;
        postsCloseMe([position.latitude, position.longitude], 30, user.uid).then((posts) => {
            console.log('postsCloseMe:', posts);
            setPosts(posts);
        })
        // try {
        //     const querySnapshot = await getDocs(collection(database, "postsTest"));
        //     const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //     data.sort((a, b) => b.createdAt - a.createdAt);
        //     setPosts([{}, ...data]);
        //     setLoading(false);
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        if (isFocused) {
            const fetchLocationAndPosts = async () => {
                await getLocation(setPosition);
                if (position) 
                    watchLocation(setPosition);
                fetchData();
            }
             fetchLocationAndPosts();
        };
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
});

export default HomeScreen;
