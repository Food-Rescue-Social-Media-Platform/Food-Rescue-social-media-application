import React from 'react';
import { View, Text, Image, StyleSheet, button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../assets/posts/post-img-3.jpg')} style={styles.coverImage} />
            <View style={styles.overlay}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../assets/users/user-1.jpg')} style={styles.avatar} />
                </View>
                <Text style={styles.name}>John Smith</Text>
            </View>
        </View>
        <View style={styles.profileInfo}>
            <View style={styles.stats}>
                <View style={styles.starsStats}>
                    <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                    <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                    <MaterialCommunityIcons name={'star'} size={22} color="#000" />
                    <MaterialCommunityIcons name={'star-half-full'} size={22} color="#000" />
                    <MaterialCommunityIcons name={'star-outline'} size={22} color="#000" />
                </View>
                
                <View style={styles.followingStats}>
                    <MaterialCommunityIcons name={'heart'} size={22} color="#000" />
                    <Text style={styles.statNumValue}>500</Text>
                </View>
                
                <View style={styles.followersStats}>
                    <MaterialCommunityIcons name={'account-group'} size={22} color="#000" />
                    <Text style={styles.statNumValue}>1500</Text>
                </View>
                
                <View style={styles.postsStats}>
                    <MaterialCommunityIcons name={'send'} size={22} color="#000" />
                    <Text style={styles.statNumValue}>150</Text>
                </View>

            </View>
            <View style={styles.stats}>
                <Text style={styles.RatingStat}>Rating</Text>
                <Text style={styles.FollowingStat}>Following</Text>
                <Text style={styles.FollowersStat}>Followers</Text>
                <Text style={styles.PostsStat}>Posts</Text>
            </View>
        </View>
        <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#CEF0D3' }]}>
                <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#CEF0D3' }]}>
                <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
        </View>
        <View>
            <Text style={styles.earningsPoints}>Advertising earnings points: 398761</Text>
        </View>
        <View style={styles.bio}>
            <Text style={styles.bioText}>Bio</Text>
            <Text style={styles.bioContent}>Tel Aviv-Yafo ❤</Text>
            <Text style={styles.bioContent}>My hobbies are gym💪,thai boxing, football⚽and swimming🏊⚓</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafd',
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 200, // Adjust the height according to your preference
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '70%', // Adjust the height to cover the entire header
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 115,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 69, // Adjust the size to accommodate avatar + 4px padding
    height: 69, // Adjust the size to accommodate avatar + 4px padding
    borderRadius: 35, // Adjust the size + 2 for border radius effect
    backgroundColor: '#fff', // White background for the circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 63,
    height: 63,
    borderRadius: 35,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop:-10,
    marginLeft:14,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    gap:1,
  },
  stat: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  RatingStat: {
    fontSize: 13,
    marginLeft: 40,
  },
  FollowingStat: {
    fontSize: 13,
    marginLeft: 60,
  },
  FollowersStat: {
    fontSize: 13,
    marginLeft: 33,
  },
  PostsStat: {
    fontSize: 13,
    marginLeft: 47,
  },

  earningsPoints: {
    fontSize: 17,
    fontWeight: 'bold', // Apply bold font weight
    marginHorizontal: 15, // Reduced margin here
    backgroundColor: '#CEF0D3',
    height: 45,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    alignContent: 'center',
    textAlign: 'center', // Center text horizontally
    padding: 10,
    borderRadius: 10,
  },
  statNumValue: {
    fontSize: 16,
    paddingLeft:4,
  },
  starsStats: {
    flexDirection: 'row',
    marginHorizontal: 5, // Reduced margin here
  },
  followingStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  followersStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  postsStats: {
    flexDirection: 'row',
    marginHorizontal: 17, // Reduced margin here
  },
  buttons: {
    flexDirection: 'row',
    gap:10,
    width: '100%',
    marginBottom:'3%',
    marginTop: '8%',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally

  },
  button: {
    backgroundColor: '#CEF0D3',
    padding: 13,
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold', // Apply bold font weight
  },
  bio: {
    marginTop: '3%',
    fontSize: 17,
    fontWeight: 'bold', // Apply bold font weight
    marginHorizontal: 15, // Reduced margin here
    backgroundColor: '#CEF0D3',
    justifyContent: 'center', // Center vertically
    alignItems: 'left', // Center horizontally
    paddingVertical: 10, // Adjust vertical padding
    paddingHorizontal: 10, // Adjust horizontal padding
    borderRadius: 10,
},

  bioText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioContent: {
    fontSize: 16,
    fontWeight: '500',
  },
  
});

export default ProfileScreen;
