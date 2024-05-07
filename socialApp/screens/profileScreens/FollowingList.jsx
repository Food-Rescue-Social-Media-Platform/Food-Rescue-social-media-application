import React from 'react';
import { StyleSheet, View } from 'react-native';
import UsersList from '../../components/usersLists/UsersList';

const FollowingList = ({ route }) => {
    const { userData } = route.params;

    return (
            <View style={styles.container}>
                <UsersList usersIds={userData.followingUsersId} />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center', // Align items to the left
        backgroundColor: 'white',
    },
});

export default FollowingList;
