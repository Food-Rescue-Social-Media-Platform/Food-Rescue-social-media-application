import React from 'react';
import { View, StyleSheet, Dimensions, Platform, ScrollView} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useDarkMode } from '../../styles/DarkModeContext';
import AddPostCardSkeletonPlaceholder from './AddPostCardSkeletonPlaceholder';

const { width: screenWidth, height: windowHeight } = Dimensions.get('window');

const ProfileSkeletonPlaceholder = () => {
  const { theme } = useDarkMode();

  return (
    <ScrollView style={{ backgroundColor: theme.skeletonSecondaryTheme}}>
      <View style={[styles.header, { backgroundColor: theme.skeletonSecondaryTheme }]}>
        <ShimmerPlaceholder style={[styles.coverImage, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        <View style={styles.overlay}>
          <ShimmerPlaceholder style={[styles.avatarContainer, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          <ShimmerPlaceholder style={[styles.name, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        </View>
      </View>
      <View style={styles.iconsWrapper}>
            <View style={styles.iconsWrapperStars}>
                    <ShimmerPlaceholder style={styles.placeholderIconStars} />
                    <ShimmerPlaceholder style={styles.placeholderIconStars} />
                    <ShimmerPlaceholder style={styles.placeholderIconStars} />
                    <ShimmerPlaceholder style={styles.placeholderIconStars} />
                    <ShimmerPlaceholder style={styles.placeholderIconStars} />
            </View>            
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
      </View>
      <View style={[styles.profileInfo, { backgroundColor: theme.skeletonSecondaryTheme }]}>
        <ShimmerPlaceholder style={[styles.StarsStats, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        <ShimmerPlaceholder style={[styles.stats, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        <ShimmerPlaceholder style={[styles.stats, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        <ShimmerPlaceholder style={[styles.stats, { backgroundColor: theme.skeletonSecondaryTheme }]} />
      </View>
      <View style={[styles.buttons, { backgroundColor: theme.skeletonSecondaryTheme }]}>
        <ShimmerPlaceholder style={[styles.button, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        <ShimmerPlaceholder style={[styles.button, { backgroundColor: theme.skeletonSecondaryTheme }]} />
      </View>
      <ShimmerPlaceholder style={[styles.advPoints, { backgroundColor: theme.skeletonSecondaryTheme }]} />
      <ShimmerPlaceholder style={[styles.bio, { backgroundColor: theme.skeletonSecondaryTheme }]} />
      <AddPostCardSkeletonPlaceholder/>
      <ShimmerPlaceholder style={[styles.post, { backgroundColor: theme.skeletonSecondaryTheme }]} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 115,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 69,
    height: 69,
    borderRadius: 40,
    marginRight: 10,
  },
  name: {
    width: 120,
    height: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  stats: {
    width: 80,
    height: 20,
    borderRadius: 10,
    marginLeft:15,
  },
  post:{
    width: 80,
    height: 20,
    borderRadius: 10,
    marginLeft:15,
    marginBottom:20,
  },
  StarsStats:{
    width: 40,
    height: 20,
    borderRadius: 10,
    marginLeft:15,
    marginRight:15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical:5,
  },
  button: {
    width: 180,
    height: 45,
    borderRadius: 10,
  },
  advPoints: {
    height: 45,
    width: 372,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 7,
  },
  bio: {
    width: '90%',
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 7,
    marginBottom: 17,

  },
  postContainer: {
    width: '90%',
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  iconsWrapper: {
    flexDirection: 'row',
    marginLeft: 40,
  },
  placeholderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D3D3D3',
    marginRight: 70,
    marginLeft:10,
  },
  iconsWrapperStars: {
    flexDirection: 'row',
    marginTop: 3,
    marginLeft: -25,
    marginRight: 30,

  },
  placeholderIconStars: {
    width: 15,
    height: 15,
    borderRadius: 11,
    backgroundColor: '#D3D3D3',
    marginRight: 2,
  },
});

export default ProfileSkeletonPlaceholder;