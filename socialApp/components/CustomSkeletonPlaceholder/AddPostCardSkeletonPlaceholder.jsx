import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useDarkMode } from '../../styles/DarkModeContext';

const { height: windowHeight } = Dimensions.get('window');

const AddPostCardSkeletonPlaceholder = () => {
  const { theme } = useDarkMode();

  return(
    <View style={[styles.addPostCardContainer, {backgroundColor: theme.skeletonSecondaryTheme}]}>
        <ShimmerPlaceholder style={styles.placeholderImageLarge} />
        <View style={styles.addPostTextContainer}>
          <ShimmerPlaceholder style={styles.placeholderTextShort} />
          <View style={styles.iconsWrapper}>
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
            <ShimmerPlaceholder style={styles.placeholderIcon} />
          </View>
        </View>
    </View>
  );
}
  
const styles = StyleSheet.create({
  addPostCardContainer: {
    width: '100%',
    height: windowHeight / 7,
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    ...Platform.select({
      web: {
        width: 620,
        marginLeft: '15%',
      },
    }),
  },
  addPostTextContainer: {
    flex: 1,
    marginTop: 13,
  },
  placeholderImageLarge: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#D3D3D3',
    margin: 10,
  },
  placeholderTextShort: {
    width: '90%',
    height: 41,
    borderRadius: 50,
    backgroundColor: '#D3D3D3',
    marginLeft: 10,
  },
  iconsWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 25,
  },
  placeholderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D3D3D3',
    marginRight: 10,
  },
});

export default AddPostCardSkeletonPlaceholder;
