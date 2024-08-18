import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useDarkMode } from '../../styles/DarkModeContext';

// const { width: screenWidth, height: windowHeight } = Dimensions.get('window');

const PostCardSkeletonPlaceholder = () => {
  const { theme } = useDarkMode();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { backgroundColor: theme.skeletonSecondaryTheme }]}>
        <View style={styles.userInfo}>
          <ShimmerPlaceholder style={[styles.placeholderImage, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          <View style={styles.userInfoText}>
            <ShimmerPlaceholder style={[styles.placeholderName, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.placeholderTextShort, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          </View>
        </View>
        <View style={styles.imageContainer}>
          <ShimmerPlaceholder style={[styles.postImage, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          <View style={styles.postPointsIconsWrapper}>
            <ShimmerPlaceholder style={[styles.postPointsPlaceholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.postPointsPlaceholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.postPointsPlaceholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          </View>
        </View>
        <View style={[styles.interactionWrapper, {backgroundColor: '#D3D3D3'}]} >
          <View style={styles.iconsWrapper}>
            <ShimmerPlaceholder style={[styles.placeholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.placeholderTextShort, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          </View>
          <View style={styles.iconsWrapper}>
            <ShimmerPlaceholder style={[styles.placeholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.placeholderTextShort, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          </View>
          <View style={styles.iconsWrapper}>
            <ShimmerPlaceholder style={[styles.placeholderIcon, { backgroundColor: theme.skeletonSecondaryTheme }]} />
            <ShimmerPlaceholder style={[styles.placeholderTextShort, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          </View>
        </View>
        <View style={styles.userInfoText}>
          <ShimmerPlaceholder style={[styles.placeholderText, { backgroundColor: theme.skeletonSecondaryTheme }]} />
          <ShimmerPlaceholder style={[styles.placeholderText, { backgroundColor: theme.skeletonSecondaryTheme }]} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderColor: '#D1D1D1',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoText: {
    marginLeft: 10,
    marginTop: 15,
    flex: 1,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginTop: 10,
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 15,
  },
  postImage: {
    width: '100%',
    height: 220, // Increased height for the post image
  },
  placeholderText: {
    width: '97%',
    height: 15,
    borderRadius: 4,
    marginVertical: 4,
  },
  placeholderTextShort: {
    width: '30%',
    height: 10,
    borderRadius: 4,
    marginVertical: 4,
  },
  placeholderName: {
    width: '50%',
    height: 15,
    borderRadius: 4,
    marginVertical: 4,
  },
  postText: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    marginBottom: 15,
  },
  divider: {
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    width: '91%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  interactionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    paddingVertical: 25,
    borderRadius: 50,
    marginLeft: 8,
    marginRight: 8,
  },
  iconsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 5,
  },
  postPointsIconsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:10,
  },
  postPointsPlaceholderIcon: {
    width: 10,
    height: 10,
    borderRadius: 11,
    marginRight: 5,
  },
});

export default PostCardSkeletonPlaceholder;
