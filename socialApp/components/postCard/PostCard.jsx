import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Platform, Share  } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Popover from 'react-native-popover-view';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { Card, UserInfo, UserName, PostTime, UserInfoText, PostText, InteractionWrapper, Divider } from '../../styles/feedStyles';
import moment from 'moment';
import { deletePost } from '../../FirebaseFunctions/collections/post';
import { calDistanceUserToPost } from '../../hooks/helpersMap/calDistanceUserToPost';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
import { useTranslation } from 'react-i18next';
// import Share from 'react-native-share';
import * as Linking from 'expo-linking'; // Import Linking from expo-linking
import { set } from 'firebase/database';

const getCategoryIcon = (category, categoryColor) => {
    switch (category) {
        case 'Bread':
            return <FontAwesome6 name="bread-slice" size={22} color={categoryColor}/>;
        case 'Cooked':
            return <MaterialCommunityIcons name="food-takeout-box" size={22} color={categoryColor} />;
        case 'Chicken':
            return <MaterialCommunityIcons name="food-turkey" size={22} color={categoryColor}/>;
        case 'Fast Food':
            return <MaterialCommunityIcons name="food" size={22} color={categoryColor}/>;
        case 'Rice':
            return <MaterialCommunityIcons name="rice" size={22} color={categoryColor}/>;
        case 'Milky':
            return <MaterialCommunityIcons name="cow" size={22} color={categoryColor}/>;
        case 'Meat':
            return <MaterialCommunityIcons name="food-steak" size={22} color={categoryColor}/>;
        case 'Sweets':
            return <MaterialCommunityIcons name="cupcake" size={22} color={categoryColor}/>;
        case 'Seafood':
            return <Ionicons name="fish" size={22} color={categoryColor}/>;
        case 'Vegetables':
            return <FontAwesome5 name="carrot" size={22} color={categoryColor}/>;
        case 'Fruits':
            return <MaterialCommunityIcons name="food-apple" size={22} color={categoryColor}/>;
        case 'Drinks':
            return <MaterialCommunityIcons name="bottle-wine" size={22} color={categoryColor}/>;
        default:
            return <MaterialIcons name="category" size={22} color={categoryColor}/>;
    }
};

const emojisWithIcons = [
    { title: 'wait for rescue', icon: 'emoticon-happy-outline', status: 'wait for rescue' },
    { title: 'rescued', icon: 'emoticon-cool-outline', status: 'rescued' },
    { title: 'wasted', icon: 'emoticon-sad-outline', status: 'wasted' },
];

const PostCard = ({ item, postUserId, isProfilePage, userLocation }) => {
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation prop
    const { user } = useContext(AuthContext);
    const { theme } = useDarkMode(); // Access the current theme
    const { t } = useTranslation();
    const [ distance, setDistance ] = useState(0);
    const [ haveSharedLocation, setHaveSharedLocation ] = useState(false);

    useEffect(() => {
        // console.log("PostC ard useEffect userLocation", userLocation, item.coordinates)
        if(!item.coordinates || item.coordinates[0] === 0 && item.coordinates[1] === 0 || !userLocation) return;
        // console.log("PostCard useEffect userLocation", userLocation)
        setHaveSharedLocation(true)
        console.log("before calDistanceUserToPost post:", item , "userLocation", userLocation, "item.coordinates", item.coordinates)
        calDistanceUserToPost(userLocation.latitude, userLocation.longitude, item.coordinates.latitude, item.coordinates.longitude, setDistance);
    }, [userLocation]);

    // Check if userImg and postImg are available
    const isUserImgAvailable = item.userImg && typeof item.userImg === 'string';
    const isPostImgAvailable = item.postImg && typeof item.postImg === 'string';

    const createdAt = item.createdAt ? moment(item.createdAt.toDate()).startOf('hour').fromNow() : '';
    const postDate = item.createdAt ? moment(item.createdAt.toDate()).calendar() : '';

    const handleUpdateStatus = async (selectedItem) => {
        try {
            const postRef = doc(database, 'posts', item.id);
            await updateDoc(postRef, { status: selectedItem.status });
            Alert.alert('Success', 'Status updated successfully.');
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update status.');
        }
    };

    const handleReport = async () => {
        try {
            const report = {
                reporterId: user.uid,
                postId: item.id,
                postUserId: postUserId,
                post: { 
                    userName: item.userName,
                    userImg: item.userImg,
                    postText: item.postText,
                    postImg: item.postImg,
                    phoneNumber: item.phoneNumber 
                },
                reportedAt: new Date(),
            };
            await addDoc(collection(database, 'reports'), report);
            Alert.alert('Success', 'Post reported successfully.');
        } catch (error) {
            console.error('Error reporting post:', error);
            Alert.alert('Error', 'Failed to report post.');
        }
    };

    let statusColor;
    switch (item.status) {
        case 'rescued':
            statusColor = 'green';
            break;
        case 'wasted':
            statusColor = 'red';
            break;
        default:
            statusColor = 'orange';
            break;
    }

    const handleDelete = async () => {
        try {
            await deletePost(item.id, postUserId);
            Alert.alert('Success', 'Post deleted successfully.');
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete post.');
        }
    };

    const handleShare = async () => {
        try {

            // const postURL = `http://127.0.0.1:8081/_expo/loading/share-post/${item.id}`; // Update this with your actual URL
            const postURL = `myapp://share-post/${item.id}`; // Update this with your actual URL

            const result = await Share.share({
                message: `Check out this post: ${postURL}`,
                url: postURL, // Optional if you want to include the URL separately
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type of:', result.activityType);
                } else {
                    console.log('Shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Dismissed');
            }
            // setShowOptions(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUserPress = () => {
        if (isProfilePage === undefined) {
            // If isProfilePage is undefined, return null to disable onPress action
            return null;
        }

        if (!isProfilePage) {
            // Navigate to ProfileScreen with the postUserId
            navigation.navigate('HomeProfile', { postUserId: postUserId });
        } else {
            // Do nothing if it's the profile page
            return null;
        }
    };


    const handleClickLocationPost = () => {
        if (!userLocation || !item.coordinates || item.coordinates === 'undefined' || item.coordinates.length < 2) {
            return;
        }
        navigation.navigate('MapTab',{
            screen: 'Map',
            params: { 
                id: item.id, 
                latitude: item.coordinates[0],
                longitude: item.coordinates[1],
                title: item.postText,
                image: item.postImg[0],
            }
        });
    }

    return (
        <Card style={[styles.card, { backgroundColor: theme.secondaryTheme, borderColor: theme.borderColor }]}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <UserInfo>
                    <TouchableOpacity onPress={handleUserPress}>
                        {/* Conditional rendering for user image */}
                        {isUserImgAvailable ? (
                            <Image source={{ uri: item.userImg }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholderImage} />
                        )}
                    </TouchableOpacity>
                    <UserInfoText>
                        <TouchableOpacity onPress={handleUserPress}>
                            <UserName style={{ color: theme.primaryText }}>{item.userName || ''}</UserName>
                        </TouchableOpacity>
                        <PostTime style={{ color: theme.primaryText }}>{createdAt}</PostTime>
                    </UserInfoText>
                </UserInfo>
                <UserInfoText>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Popover
                            from={(
                                <TouchableOpacity style={{ paddingRight: 11 }}
                                   onPress={() => { setShowOptions(!showOptions)}}
                                >
                                    <SimpleLineIcons
                                        name="options"
                                        size={23}
                                        color={theme.primaryText}
                                    />
                                </TouchableOpacity>
                            )}
                            verticalOffset={-35} // Adjust the vertical offset as needed
                            horizontalOffset={-50} // Adjust the horizontal offset as needed 
                            
                        >
                            <View style={styles.menu}>
                                {user && user.uid === postUserId && (
                                    <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Edit Post', { item: item })}>
                                        <MaterialIcons name="edit" size={20} color='black' />
                                        <Text style={{ paddingLeft: 4, color: 'black' }}>{t('Edit')}</Text>
                                    </TouchableOpacity>
                                )}

                                {user && user.uid === postUserId && (
                                    <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
                                        <FontAwesome6 name="delete-left" size={20} color='black' />
                                        <Text style={{ paddingLeft: 4, color: 'black' }}>{t('Delete')}</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {user && user.uid != postUserId && (                    
                                    <TouchableOpacity style={styles.optionButton} onPress={handleReport}>
                                        <MaterialIcons name="report" size={20} color='black' />
                                        <Text style={{ paddingLeft: 4, color: 'black' }}>{t('Report')}</Text>
                                    </TouchableOpacity>            
                                )}

                                <TouchableOpacity style={styles.optionButton} onPress={handleShare}>
                                    <MaterialCommunityIcons name="share-variant" size={20} color='black' />
                                    <Text style={{ paddingLeft: 4, color: 'black' }}>{t('Share')}</Text>
                                </TouchableOpacity>
                            </View>
                        </Popover>

                        {user && user.uid != postUserId && (
                            <Text style={{ color: statusColor, fontSize: 15, paddingRight: 10, fontWeight: '500' }}>{t(item.status)}</Text>
                        )}

                        {user && user.uid === postUserId && (
                            <SelectDropdown
                                data={emojisWithIcons}
                                onSelect={(selectedItem, index) => handleUpdateStatus(selectedItem)}

                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={[styles.dropdownButtonStyle, { backgroundColor: theme.secondaryBackground }]}>
                                            {selectedItem && (
                                                <Icon name={selectedItem.icon} style={[styles.dropdownButtonIconStyle, { color: theme.primaryText }]} />
                                            )}
                                            <Text style={[styles.dropdownButtonTxtStyle, { color: theme.primaryText }]}>
                                                {(selectedItem && t(selectedItem.title)) || t(item.status)}
                                            </Text>
                                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={[styles.dropdownButtonArrowStyle, { color: theme.primaryText }]} />
                                        </View>
                                    );
                                }}

                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ 
                                            ...styles.dropdownItemStyle, 
                                            backgroundColor: isSelected ? '#D2D9DF' : theme.appBackGroundColor 
                                        }}>
                                            <Icon name={item.icon} style={[styles.dropdownItemIconStyle, { color: theme.primaryText }]} />
                                            <Text style={[styles.dropdownItemTxtStyle, { color: theme.primaryText }]}>{t(item.title)}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={[styles.dropdownMenuStyle, { backgroundColor: theme.secondaryBackground }]}
                            />
                        )}

                    </View>
                </UserInfoText>

            </View>

            {/* Conditional rendering for post image */}
            {isPostImgAvailable ? (
                <>
                    <Image source={{ uri: item.postImg }} style={styles.postImage} />
                    <Text style={{ color: theme.primaryText }}>{item.additionalInfo || ''}</Text>
                </>
            ) : (
                <Divider />
            )}
            <InteractionWrapper >
                <View style={styles.iconsWrapper}>
                    {getCategoryIcon(item.category, theme.primaryText)}
                    <Text style={[styles.text, { color: theme.primaryText }]}>{t(item.category)}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="clock"
                        size={22}
                        color={theme.primaryText}
                    />
                    <Text style={[styles.text, { color: theme.primaryText }]}>{postDate}</Text>
                </View>
                { haveSharedLocation ? (
                    <View style={styles.iconsWrapper}>
                        <TouchableOpacity onPress={handleClickLocationPost}>
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={22}
                                color={theme.primaryText}
                            />
                            <Text style={[styles.text, { color: theme.primaryText }]}>{distance}</Text>
                        </TouchableOpacity>   
                    </View>
                ): null}
            </InteractionWrapper>
            <Text></Text>

            <InteractionWrapper style={backgroundColor = theme.secondaryBackground}>
                {item.phoneNumber && (
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                            name="phone"
                            size={22}
                            color={theme.primaryText}
                        />
                        <Text style={[styles.text, { color: theme.primaryText }]}>{item.phoneNumber}</Text>
                    </View>
                )}
                {item.deliveryRange && (
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                            name="bus-clock"
                            size={22}
                            color={theme.primaryText}
                        />
                        <Text style={[styles.text, { color: theme.primaryText }]}>{item.deliveryRange}</Text>
                    </View>
                )}

            </InteractionWrapper>
            <PostText style={{ color: theme.primaryText }}>{item.postText || ''}</PostText>
        </Card>
    );
}

export default PostCard;


const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    text: {
        fontSize: 12,
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
        ...Platform.select({
            web: {
                height: 400, // Adjust height as needed
            },
        }),
    },
    placeholderImage: {
        width: 50,
        height: 50,
        backgroundColor: 'lightgray', // Placeholder color
        borderRadius: 25,
    },
    optionButton: {
        flexDirection: "row",
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
    },
    menu: {
        marginRight: 6,
        marginLeft: 2,
        marginBottom: 5,
    },
    dropdownButtonStyle: {
        width: 130,
        height: 30,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 10,
        fontWeight: '500',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 5,
    },
    dropdownMenuStyle: {
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '98%',
        flexDirection: 'row',
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    dropdownItemIconStyle: {
        fontSize: 20,
    },
});
