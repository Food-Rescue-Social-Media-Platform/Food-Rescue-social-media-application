import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DARKCOLORS } from '../../styles/colors';
import { windowHeight } from '../../utils/Dimentions';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import { useDarkMode } from '../../styles/DarkModeContext'; // Adjust the path accordingly
import { useTranslation } from 'react-i18next';

const AddPostCard = () => {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);
    const [userConnected, setUserConnected] = useState(null);
    const { isDarkMode } = useDarkMode();
    const themeColors = isDarkMode ? DARKCOLORS : COLORS;
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const user_data = await fetchUser(user.uid);
            setUserConnected(user_data);
        }
        fetchData();
    }, []);

    const openShareFoodScreen = () => {
        navigation.navigate('AddPost');
    }

    //console.log("AddPostCard userConnected: ", userConnected);

    return (
        <View style={[styles.container, { backgroundColor: themeColors.secondaryTheme }]}>
            <Image
                style={styles.profileImage}
                source={
                    userConnected?.profileImg
                        ? { uri: userConnected.profileImg }
                        : require('../../assets/Images/emptyProfieImage.png')
                }
            />
            <View>
                <TouchableOpacity style={[styles.sharePostWrapper, { backgroundColor: themeColors.secondaryBackground, borderColor: themeColors.black }]} onPress={openShareFoodScreen}>
                    <Text style={[styles.mainText, { color: themeColors.primaryText }]}>{t('Share food...')}</Text>
                </TouchableOpacity>
                <Icons
                    size={20}
                    color={themeColors.black}
                    handelClick={openShareFoodScreen}
                    iconStyle={styles.icon}
                    wrapperStyle={styles.iconsWrapper}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: windowHeight / 7,
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 8,
        ...Platform.select({
            web: {
                width: '70%',
                marginLeft: '15%',
            },
        }),
    },
    sharePostWrapper: {
        width: '100%',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingRight: 150,
        marginLeft: 3,
        marginTop: 14,
        marginBottom: 8,
        justifyContent: 'center',
        ...Platform.select({
            web: {
                marginRight: '0.1rem',
            },
        }),
    },
    mainText: {
        fontSize: 15,
    },
    iconsWrapper: {
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
        marginTop: '1%',
    },
    icon: {
        marginHorizontal: 4,
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 50,
        margin: 12,
    },
});

export default AddPostCard;

const fetchUser = async (id) => {
    try {
        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data();
    } catch (error) {
        console.error("fetchUser, Error getting document:", error);
        return null;
    }
}

const Icons = ({ handelClick, size, iconStyle, wrapperStyle, color }) => {
    return (
        <TouchableOpacity style={wrapperStyle}>
            <TouchableOpacity onPress={handelClick}>
                <MaterialIcons name="photo-library" size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons name="map-marker" size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons name="clock" size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialCommunityIcons name="phone" size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handelClick}>
                <MaterialIcons name="category" size={22} color={color} style={iconStyle} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
