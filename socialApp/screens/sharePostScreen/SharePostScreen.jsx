import React from 'react';
import { View, Text, Button } from 'react-native';
import PostCard from '../../components/postCard/PostCard';
import { use } from 'i18next';
import { getPost } from '../../FirebaseFunctions/collections/post';
import { useState, useEffect } from 'react';
import { getLocation } from '../../hooks/helpersMap/getLocation';
import { ActivityIndicator, StyleSheet } from 'react-native';

const SharePostScreen = ({ navigation, route }) => {
  const { postId } = route.params;
  console.log("Post id: ", postId);
  const [post, setPost] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
        await getLocation(setPosition);
    };
    fetchLocation();
}, []);


  useEffect(() => {
    if(!position) return;
    getPost(postId).then((post) => {
        setPost(post);
        setLoading(false);
    }).catch((error) => {
        console.error(error);
        setLoading(false);
    });
  }, [position]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No post found.</Text>
      </View>
    );
  }

  return (
    <View>
        {post && position &&
            <PostCard item={post} postUserId={post.userId} isProfilePage={false} userLocation={position}/>
        }
        {
            !post && <Text>Loading...</Text>
        }
        {
            !position && (
             <View>
                <Text>Share your location to see the post</Text>
                <Button
                    title="Share location" 
                    style={styles.buttonShareLocation}
                    onPress={() => {
                        const fetchLocation = async () => {
                            await getLocation(setPosition);
                        };
                        fetchLocation();
                }} />
             </View>
            )
        }
    </View>
  );
};

const styles = StyleSheet.create({
    buttonShareLocation: {
        flex:1, 
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: '500',
    }
});


export default SharePostScreen;