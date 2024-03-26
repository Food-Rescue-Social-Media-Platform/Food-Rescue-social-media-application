import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Card, UserInfo, UserName, PostTime, UserInfoText, PostText, InteractionWrapper, Divider } from '../styles/feedStyles';

const PostCard = ({ item }) => {
    // Check if userImg and postImg are available
    const isUserImgAvailable = item.userImg && typeof item.userImg === 'string';
    const isPostImgAvailable = item.postImg && typeof item.postImg === 'string';

    return (
        <Card>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <UserInfo>
                    {/* Conditional rendering for user image */}
                    {isUserImgAvailable ? (
                        <Image source={{ uri: item.userImg }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderImage} />
                    )}
                    <UserInfoText>
                        <UserName>{item.userName}</UserName>
                        <PostTime>{item.postTime}</PostTime>
                    </UserInfoText>
                </UserInfo>
                <TouchableOpacity style={{
                    paddingTop: 25,
                    paddingRight: 20
                }}>
                    <SimpleLineIcons
                        name="options"
                        size={24}
                    />
                </TouchableOpacity>
            </View>

            {/* Conditional rendering for post image */}
            {isPostImgAvailable ? (
                <>
                    <Image source={{ uri: item.postImg }} style={styles.postImage} />
                    {/* Additional UI components under the post image */}
                    <Text>{item.additionalInfo}</Text>
                    {/* Add more UI components as needed */}
                </>
            ) : (
                <Divider />
            )}
            <InteractionWrapper>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="cupcake"
                        size={22}
                    />
                    <Text style={styles.text}>{item.category}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="clock"
                        size={22}
                    />
                    <Text style={styles.text}>{item.postDate}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="map-marker"
                        size={22}
                    />
                    <Text style={styles.text}>{item.postDistance}</Text>
                </View>
            </InteractionWrapper>
            <PostText>{item.postText}</PostText>
        </Card>
    );
}

export default PostCard;

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: "black"
    },
    iconsWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    postImage: {
        width: '100%',
        height: 200, // Adjust height as needed
        resizeMode: 'cover', // Or use 'contain' for other resizing options
    },
    placeholderImage: {
        width: 50,
        height: 50,
        backgroundColor: 'lightgray', // Placeholder color
        borderRadius: 25,
    }
});
