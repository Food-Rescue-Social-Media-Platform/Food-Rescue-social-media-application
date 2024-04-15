import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import FormButton from '../../components/formButtonsAndInput/FormButton';
import Chat from '../chatScreens/Chat';
import { AuthContext } from '../../navigation/AuthProvider';
import { Container } from '../../styles/feedStyles';
import PostCard from '../../components/postCard/PostCard';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { collection, getDocs } from "firebase/firestore";
import { windowWidth } from '../../utils/Dimentions';
import AddPostCard from '../../components/addPost/AddPostCard';

import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const HomeScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation prop

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(database, "postsTest"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort the posts by creation time
                data.sort((a, b) => b.createdAt - a.createdAt); // Assuming createdAt is a timestamp
                setPosts([{}, ...data]); // Add an empty object as the first item
                // console.log("Posts data:", data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
            
        fetchData();
    }, []); // Empty dependency array to fetch data only once when component mounts
    
    return (
        <Container style={styles.container}>
            
            <FlatList
                data={posts} // Use fetched data instead of the hardcoded `Posts` array
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        return <AddPostCard />;
                    } else {
                        return <PostCard item={item} navigation={navigation} postUserId={item.userId} isProfilePage={false} />;
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                />
                <FormButton buttonTitle='Logout' onPress={() => logout()} /> 
        </Container>
    );
}


export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 5, // Adjust as needed
        paddingBottom: 5, // Space for the logout button
    },
    flatListContent: {
        flexGrow: 1, // Allow content to grow within the container
        paddingBottom: 5, // Adjust as needed to prevent content from hiding behind the logout button
    },
    mainContainer:{
      width: windowWidth,
    },
    text: {
        fontSize: 12,
        color: "black"
    },
    iconsWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
    
});
