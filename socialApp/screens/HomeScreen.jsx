// HomeScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import FormButton from '../components/FormButton';
import Chat from './chat/Chat';
import { AuthContext } from '../navigation/AuthProvider';
import { Container } from '../styles/feedStyles';
import PostCard from '../components/PostCard';
import { database } from '../firebase'; // Import the Firestore instance from firebase.js
import { collection, getDocs } from "firebase/firestore";
import { windowWidth } from '../utils/Dimentions';
import AddPostScreen from './AddPostScreen';
import AddPostCard from '../components/AddPostCard';


const HomeScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(database, "postsTest"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort the posts by creation time
                data.sort((a, b) => b.createdAt - a.createdAt); // Assuming createdAt is a timestamp
                setPosts(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchData();
    }, []); // Empty dependency array to fetch data only once when component mounts
    
    return (
        <Container>
        <AddPostCard/>
        <FlatList
            data={posts} // Use fetched data instead of the hardcoded `Posts` array
            renderItem={({ item }) => <PostCard item={item} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
        />
        <FormButton buttonTitle='Logout' onPress={() => logout()} />
        </Container>
    );
}


export default HomeScreen;

const styles = StyleSheet.create({
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
