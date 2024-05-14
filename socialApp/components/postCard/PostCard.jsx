import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Popover from 'react-native-popover-view';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { Card, UserInfo, UserName, PostTime, UserInfoText, PostText, InteractionWrapper, Divider } from '../../styles/feedStyles';
import moment from 'moment';
import { COLORS } from '../../styles/colors';
import { deletePost } from '../../FirebaseFunctions/collections/post';

const getCategoryIcon = (category) => {
    switch (category) {
        case 'Bread':
            return <FontAwesome6 name="bread-slice" size={22} />;
        case 'Cooked':
            return <MaterialCommunityIcons name="food-takeout-box" size={22} />;
        case 'Chicken':
            return <MaterialCommunityIcons name="food-turkey" size={22} />;
        case 'Fast Food':
            return <MaterialCommunityIcons name="food" size={22} />;
        case 'Rice':
            return <MaterialCommunityIcons name="rice" size={22} />;
        case 'Milky':
            return <MaterialCommunityIcons name="cow" size={22} />;
        case 'Meat':
            return <MaterialCommunityIcons name="food-steak" size={22} />;
        case 'Sweets':
            return <MaterialCommunityIcons name="cupcake" size={22} />;
        case 'Seafood':
            return <Ionicons name="fish" size={22} />;
        case 'Vegetables':
            return <FontAwesome5 name="carrot" size={22} />;
        case 'Fruites':
            return <MaterialCommunityIcons name="food-apple" size={22} />;
        case 'Drinks':
            return <MaterialCommunityIcons name="bottle-wine" size={22} />;
        default:
            return <MaterialIcons name="category" size={22} />;
    }
};

const emojisWithIcons = [
    { title: 'wait for rescue', icon: 'emoticon-happy-outline', status: 'wait for rescue' },
    { title: 'rescued', icon: 'emoticon-cool-outline', status: 'rescued' },
    { title: 'wasted', icon: 'emoticon-sad-outline', status: 'wasted' },
];

const PostCard = ({ item , postUserId, isProfilePage}) => {
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation prop
    const { user } = useContext(AuthContext);

    // Check if userImg and postImg are available
    const isUserImgAvailable = item.userImg && typeof item.userImg === 'string';
    const isPostImgAvailable = item.postImg && typeof item.postImg === 'string';

    const createdAt = moment(item.createdAt.toDate()).startOf('hour').fromNow();
    const postDate = moment(item.createdAt.toDate()).calendar();
    
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
    
    // console.log(isProfilePage);
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
    return (
        <Card>
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
                            <UserName>{item.userName}</UserName>
                        </TouchableOpacity>
                        <PostTime>{createdAt}</PostTime>
                    </UserInfoText>
                </UserInfo>
                <UserInfoText>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Popover
                            from={(
                                <TouchableOpacity style={{ paddingRight: 11 }}>
                                    <SimpleLineIcons
                                        name="options"
                                        size={23}
                                    />
                                </TouchableOpacity>
                            )}
                            verticalOffset={-35} // Adjust the vertical offset as needed
                            horizontalOffset={-50} // Adjust the horizontal offset as needed 
                            >
                            <View style={styles.menu}>

                                {user && user.uid === postUserId && (
                                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Edit Post', { item: item })}>
                                    <MaterialIcons name="edit" size={20} color="black" />
                                    <Text style={{ paddingLeft:4}}>Edit</Text>
                                </TouchableOpacity>
                                )}

                                {user && user.uid === postUserId && (
                                <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
                                    <FontAwesome6 name="delete-left" size={20} color="black" />
                                    <Text style={{ paddingLeft:4}}>delete</Text>
                                </TouchableOpacity>
                                )}
                                
                                <TouchableOpacity style={styles.optionButton}>
                                    <MaterialIcons name="report" size={20} color="black" />
                                    <Text style={{ paddingLeft:4}}>Report</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionButton}>
                                    <MaterialCommunityIcons name="share-variant" size={20} color="black" />
                                    <Text style={{ paddingLeft:4}}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        </Popover>

                        {user && user.uid != postUserId && (
                            <Text style={{ color: statusColor, fontSize: 15, paddingRight: 10, fontWeight: '500' }}>{item.status}</Text>
                        )}

                        {user && user.uid === postUserId && (
                            <SelectDropdown
                            data={emojisWithIcons}
                            onSelect={(selectedItem, index) => handleUpdateStatus(selectedItem)}

                            renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                {selectedItem && (
                                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                )}
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {(selectedItem && selectedItem.title) || item.status}
                                </Text>
                                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                            }}

                            renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                </View>
                            );
                            }}
                            
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        /> 
                        )}

                      </View>
                </UserInfoText>

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
                    {getCategoryIcon(item.category)}
                    <Text style={styles.text}>{item.category}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="clock"
                        size={22}
                    />
                    <Text style={styles.text}>{postDate}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="map-marker"
                        size={22}
                    />
                    <Text style={styles.text}>{item.postDistance}</Text>
                </View>
            </InteractionWrapper>
            <Text></Text>
            
            <InteractionWrapper>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="phone"
                        size={22}
                    />
                    <Text style={styles.text}>{item.phoneNumber}</Text>
                </View>
                <View style={styles.iconsWrapper}>
                    <MaterialCommunityIcons
                        name="bus-clock"
                        size={22}
                    />
                    <Text style={styles.text}>{item.deliveryRange}</Text>
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
        marginLeft:10,
        marginTop:10,
        marginBottom:5,
    },
    menu: {
        marginRight: 6,
        marginLeft:2,
        marginBottom:5,

    },

    ///////////////////////////////////////////////
    dropdownButtonStyle: {
        width: 130,
        height: 30,
        backgroundColor: COLORS.secondaryBackground,
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
        color: COLORS.black,
    },
        dropdownButtonArrowStyle: {
        fontSize: 28,
    },
        dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 5,
    },
        dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
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
        color: COLORS.black,
    },
        dropdownItemIconStyle: {
        fontSize: 20,
    },
});
