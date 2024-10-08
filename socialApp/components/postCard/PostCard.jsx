import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share, Dimensions, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase';
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { Card, UserInfo, UserName, PostTime, UserInfoText, PostText, InteractionWrapper, Divider } from '../../styles/feedStyles';
import moment from 'moment';
import { deletePost } from '../../FirebaseFunctions/collections/post';
import { calDistanceUserToPost } from '../../hooks/helpersMap/calDistanceUserToPost';
import { useDarkMode } from '../../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import ImageModalViewer from './ImageModalViewer';
import { TouchableWithoutFeedback } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const getCategoryIcon = (category, categoryColor) => {
    switch (category) {
        case 'Bread':
            return <FontAwesome6 name="bread-slice" size={22} color={categoryColor} />;
        case 'Cooked':
            return <MaterialCommunityIcons name="food-takeout-box" size={22} color={categoryColor} />;
        case 'Chicken':
            return <MaterialCommunityIcons name="food-turkey" size={22} color={categoryColor} />;
        case 'Fast Food':
            return <MaterialCommunityIcons name="food" size={22} color={categoryColor} />;
        case 'Rice':
            return <MaterialCommunityIcons name="rice" size={22} color={categoryColor} />;
        case 'Dairy':
                return <MaterialCommunityIcons name="cow" size={22} color={categoryColor} />;        
        case 'Sweets':
            return <MaterialCommunityIcons name="cupcake" size={22} color={categoryColor} />;
        case 'Seafood':
            return <Ionicons name="fish" size={22} color={categoryColor} />;
        case 'Vegetables':
            return <FontAwesome5 name="carrot" size={22} color={categoryColor} />;
        case 'Fruits':
            return <MaterialCommunityIcons name="food-apple" size={22} color={categoryColor} />;
        case 'Drinks':
            return <MaterialCommunityIcons name="bottle-wine" size={22} color={categoryColor} />;
        default:
            return <MaterialIcons name="category" size={22} color={categoryColor} />;
    }
};

const emojisWithIcons = [
    { title: 'waiting for rescue', icon: 'emoticon-happy-outline', status: 'waiting for rescue' },
    { title: 'rescued', icon: 'emoticon-cool-outline', status: 'rescued' },
    { title: 'wasted', icon: 'emoticon-sad-outline', status: 'wasted' },
];

const PostCard = ({ item, postUserId, isProfilePage, isMapPostCard, userLocation }) => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const { theme } = useDarkMode();
    const { t } = useTranslation();
    const [distance, setDistance] = useState('');
    const [haveSharedLocation, setHaveSharedLocation] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);

    useEffect(() => {
        if (!item.coordinates || (item.coordinates[0] === 0 && item.coordinates[1] === 0) || !userLocation || isProfilePage) 
            return;
        setHaveSharedLocation(true);
        calDistanceUserToPost(userLocation.latitude, userLocation.longitude, item.coordinates.latitude, item.coordinates.longitude, setDistance);
    }, [userLocation]);

    const userImgSource = item.userImg && typeof item.userImg === 'string'
        ? { uri: item.userImg }
        : require('../../assets/Images/emptyUserProfieImage.jpeg');

    const createdAt = item.createdAt ? moment(item.createdAt.toDate()).fromNow() : '';
    const postDate = item.createdAt ? moment(item.createdAt.toDate()).calendar() : '';

    const handleUpdateStatus = async (selectedItem) => {
        try {
            const postRef = doc(database, 'posts', item.id);
            await updateDoc(postRef, { status: selectedItem.status });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Status updated successfully.',
            });
        } catch (error) {
            console.error('Error updating status:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update status.',
            });
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
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Post reported successfully.',
            });
        } catch (error) {
            console.error('Error reporting post:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to report post.',
            });
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
        setLoading(true);
        setShowOptions(false);  // Close the popover
        try {
            await deletePost(item.id, postUserId);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Post deleted successfully.',
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete post.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            const postURL = `myapp://share-post/${item.id}`;
            const result = await Share.share({
                message: `Check out this post: ${postURL}`,
                url: postURL,
            });

            // if (result.action === Share.sharedAction) {
            //     if (result.activityType) {
            //         // console.log('Shared with activity type of:', result.activityType);
            //     } else {
            //         // console.log('Shared');
            //     }
            // } else if (result.action === Share.dismissedAction) {
            //     // console.log('Dismissed');
            // }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUserPress = () => {
        if (isProfilePage === undefined) return null;
        if (!isProfilePage) navigation.navigate('HomeProfile', { postUserId: postUserId });
        else return null;
    };

    const handleClickLocationPost = () => {
        if (!userLocation || !item.coordinates || item.coordinates === 'undefined' || item.coordinates.length < 2) return;
        console.log('item:', item);
        navigation.navigate('MapTab', {
            screen: 'Map',
            params: {
              post: {
                id: item.id,
                latitude: item.coordinates.latitude,
                longitude: item.coordinates.longitude,
                title: item.postText,
                image: item.postImg && item.postImg.length > 0 ? item.postImg[0] : null
              }
            }
          });
    };

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / screenWidth);
        setCurrentImageIndex(index);
    };

    const handelPressImages = () => {
        setIsImageModalVisible(true);
    };

    

    return (
        <>
        <Card style={[styles.card, { backgroundColor: theme.secondaryTheme, borderColor: theme.borderColor }]}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.primaryText} />
                </View>
            )}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <UserInfo>
                    <TouchableOpacity onPress={handleUserPress}>
                        <Image source={userImgSource} style={styles.image} />
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
                                    onPress={() => { setShowOptions(!showOptions) }}
                                >
                                    <SimpleLineIcons
                                        name="options"
                                        size={23}
                                        color={theme.primaryText}
                                    />
                                </TouchableOpacity>
                            )}
                            verticalOffset={-35}
                            horizontalOffset={-50}
                            isVisible={showOptions}
                            onRequestClose={() => setShowOptions(false)}
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

                                {user && user.uid !== postUserId && (
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

                        {user && user.uid !== postUserId && (
                            <Text style={{ color: statusColor, fontSize: 15, paddingRight: 10, fontWeight: '500' }}>{t(item.status)}</Text>
                        )}

                        {user && user.uid === postUserId && (
                            <SelectDropdown
                                data={emojisWithIcons}
                                onSelect={(selectedItem, index) => handleUpdateStatus(selectedItem)}
                                renderButton={(selectedItem, isOpened) => (
                                    <View style={[styles.dropdownButtonStyle, { backgroundColor: theme.secondaryBackground }]}>
                                        {selectedItem && (
                                            <Icon name={selectedItem.icon} style={[styles.dropdownButtonIconStyle, { color: theme.lowContrastText }]} />
                                        )}
                                        <Text style={[styles.dropdownButtonTxtStyle, { color: theme.lowContrastText }]}>
                                            {(selectedItem && t(selectedItem.title)) || t(item.status)}
                                        </Text>
                                        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={[styles.dropdownButtonArrowStyle, { color: theme.lowContrastText }]} />
                                    </View>
                                )}
                                renderItem={(item, index, isSelected) => (
                                    <View style={{
                                        ...styles.dropdownItemStyle,
                                        backgroundColor: isSelected ? '#D2D9DF' : theme.appBackGroundColor
                                    }}>
                                        <Icon name={item.icon} style={[styles.dropdownItemIconStyle, { color: theme.primaryText }]} />
                                        <Text style={[styles.dropdownItemTxtStyle, { color: theme.primaryText }]}>{t(item.title)}</Text>
                                    </View>
                                )}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={[styles.dropdownMenuStyle, { backgroundColor: theme.secondaryBackground }]}
                            />
                        )}
                    </View>
                </UserInfoText>
            </View>

            {item.postImg && item.postImg.length > 0 ? (
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                    >
                        {item.postImg.map((img, index) => (
                            <TouchableWithoutFeedback key={`image-${index}`} onPress={handelPressImages}>
                                <Image source={{ uri: img }} style={styles.postImage} />
                            </TouchableWithoutFeedback>
                        ))}
                    </ScrollView>
            
                    <View style={styles.pagination}>
                        {item.postImg.map((_, index) => (
                            <View
                                key={`dot-${index}`}
                                style={[
                                    styles.dot,
                                    { backgroundColor: index === currentImageIndex ? 'black' : 'grey' }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <Divider />
            )}

            <InteractionWrapper>
                <View style={styles.iconsWrapper}>
                    {getCategoryIcon(item.category, theme.lowContrastText)}
                    <Text style={[styles.text, { color: theme.lowContrastText }]}>{t(item.category)}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons name="clock" size={22} color={theme.lowContrastText} />
                    <Text style={[styles.text, { color: theme.lowContrastText }]}>{postDate}</Text>
                </View>
                {haveSharedLocation && !isProfilePage && isMapPostCard==false &&(
                    <TouchableOpacity style={[styles.iconsWrapper]} onPress={handleClickLocationPost}>
                        <MaterialCommunityIcons name="map-marker" size={22} color={theme.lowContrastText} />
                        <Text style={[styles.text, { color: theme.lowContrastText }]}>{distance}</Text>
                    </TouchableOpacity>
                )}
            </InteractionWrapper>
            
            {item.deliveryRange && item.phoneNumber && (
                <InteractionWrapper style={{ backgroundColor: theme.secondaryBackground }}>
                    {item.phoneNumber && (
                        <View style={styles.iconsWrapper}>
                            <MaterialCommunityIcons name="phone" size={22} color={theme.lowContrastText} />
                            <Text style={[styles.text, { color: theme.lowContrastText }]}>{item.phoneNumber}</Text>
                        </View>
                    )}
                    {item.deliveryRange && (
                        <View style={styles.iconsWrapper}>
                            <MaterialCommunityIcons name="bus-clock" size={22} color={theme.lowContrastText} />
                            <Text style={[styles.text, { color: theme.lowContrastText }]}>{item.deliveryRange}</Text>
                        </View>
                    )}
                </InteractionWrapper>
            )}
            <PostText style={{ color: theme.primaryText }}>{item.postText || ''}</PostText>
        </Card>
        <ImageModalViewer
            images={item.postImg}
            visible={isImageModalVisible}
            onClose={() => setIsImageModalVisible(false)}
        />
        </>
    );
};

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
        // justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderImage: {
        width: 50,
        height: 50,
        backgroundColor: 'lightgray',
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
    imageContainer:{
      width: '100%',
      overflow: 'hidden',
    },
    postImage: {
        width: screenWidth,
        resizeMode: 'cover',
        ...Platform.select({
            web: {
                height: 400, // Adjust height as needed
            },
        }),
    },
    scrollView: {
        width: screenWidth,
        height: 300,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
});

export default PostCard;
