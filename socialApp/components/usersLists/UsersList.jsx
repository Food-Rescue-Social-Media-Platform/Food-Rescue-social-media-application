import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { database } from '../../firebase'; // Import the Firestore instance from firebase.js
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 15; // Number of users to load per page

const UsersList = ({ usersIds }) => {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [endReached, setEndReached] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const startIdx = (currentPage - 1) * PAGE_SIZE;
                const endIdx = startIdx + PAGE_SIZE;
                const usersDataArray = [];

                for (let i = startIdx; i < endIdx && i < usersIds.length; i++) {
                    const userId = usersIds[i];
                    const userDocRef = doc(database, "users", userId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        usersDataArray.push(userData);
                    }
                }

                if (usersDataArray.length < PAGE_SIZE) {
                    setEndReached(true);
                }

                setUsersData(prevData => [...prevData, ...usersDataArray]);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (usersIds.length > 0 && !endReached) {
            fetchUsersData();
        } else {
            setLoading(false);
        }
    }, [usersIds, currentPage, endReached]);

    const handleEndReached = () => {
        if (!loading) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!loading || endReached) return null;
        return <ActivityIndicator size="large" color="#0000ff" />;
    };

    return (
        <>
            {loading ? (
                <View style={[styles.loadingContainer, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    {usersData.length === 0 ? (
                        <Text style={styles.noFollowingText}>{t('The list is empty')}</Text>
                    ) : (
                        <View style={styles.container}>
                            <FlatList
                                data={usersData}
                                renderItem={({ item }) => (
                                    <View style={styles.userContainer}>
                                        {item.profileImg && typeof item.profileImg === 'string' && item.profileImg.trim() !== '' ? (
                                            <Image source={{ uri: item.profileImg }} style={styles.profileImage} />
                                        ) : (
                                            <Image source={require('../../assets/Images/emptyUserProfieImage.jpeg')} style={styles.profileImage} /> // Ensure this path is correct
                                        )}
                                        <Text style={styles.userName}>{item.userName}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleEndReached}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={renderFooter}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 50 }} // Adjust the padding as needed
                            />
                        </View>
                    )}
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: -30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    noFollowingText: {
        fontSize: 16,
        marginBottom: 5,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Align items to the start of the row
        marginBottom: 10,
    },
    profileImage: {
        width: 67,
        height: 67,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 22,
    },
});

export default UsersList;
