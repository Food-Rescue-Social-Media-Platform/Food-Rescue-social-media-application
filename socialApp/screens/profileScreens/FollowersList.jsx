import React from 'react';
import { StyleSheet, View } from 'react-native';
import UsersList from '../../components/usersLists/UsersList';

const FollowersList = ({ route }) => {
    const { userData } = route.params;

    return (
        <View style={styles.container}> 
            <UsersList usersIds={userData.followersUsersId} />
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

export default FollowersList;
