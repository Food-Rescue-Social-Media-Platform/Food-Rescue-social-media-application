import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowWidth } from '../../utils/Dimentions';
import { calDistanceUserToPost } from '../../hooks/helpersMap/calDistanceUserToPost';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import useDarkMode hook
import { COLORS, DARKCOLORS } from '../../styles/colors';
import styled from 'styled-components';

const PostModal = ({ setVisible, visible, post, onClose, userLocation, handleUserPosition }) => {
  const navigation = useNavigation();
  const [ distance, setDistance ] = useState('Calculating...');
  const [ haveSharedLocation, setHaveSharedLocation ] = useState(false);
  const { isDarkMode, theme } = useDarkMode(); // Use the hook to get the current theme
  const themeColors = isDarkMode ? DARKCOLORS : COLORS; // Set theme-based colors

  useEffect(() => {
    const fetchDistance = async () => {
      if((post.latitude === 0 && post.longitude === 0) || !userLocation) return;
      setHaveSharedLocation(true);
      calDistanceUserToPost(userLocation.latitude, userLocation.longitude, post.latitude, post.longitude, setDistance )
    }
    fetchDistance();  
  }, []); 
  const renderTruncatedFooter = () => {
    return (
      <Text style={styles.readMore} onPress={handleReadMorePress}>
      Read 
      </Text>
    );
  };
  const handleReadMorePress = () => {
    console.log("read more go to single post..");
    setVisible(false);
  };

  const modalHeight = post && post.image ? '44%' : '24%';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { backgroundColor:themeColors.white ,height: modalHeight }]} onPress={() => { navigation.navigate('SharePost', { postId: post.id }); }}>
          {post && (
            <>
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={styles.image}
                />
              )}
              <View style={styles.textContainer}>
                <View style={[styles.titleContainer, !post.image && { height: '45%', marginTop:10 }]}>
                  <ReadMore
                    numberOfLines={2}
                    renderTruncatedFooter={renderTruncatedFooter}
                  >
                    <Text style={[styles.title, {color:themeColors.black}]}>{post.title}</Text>
                  </ReadMore>
                </View>

                {haveSharedLocation? (
                  <View style={{flex:1, flexDirection:'column' , margin:5}}>
                      <View style={[styles.distanceContainer, !post.image && { height: '20%' }]}>
                          <MaterialCommunityIcons name="map-marker" size={26} color='black' />
                          <Text style={[styles.text, {color:themeColors.black}]}>{distance}</Text>
                      </View>
                      <View>
                          <TouchableOpacity 
                              onPress={() => handleUserPosition(post)}
                              style={[styles.buttonNavigate, { backgroundColor:themeColors.secondaryBackground }]}
                          >
                              <Text style={[styles.text, {fontWeight:'bold', color:themeColors.black}]}>Navigate</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                ): null
                 }

              </View>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: windowWidth / 1.4,
    alignSelf: 'center',
    marginTop: '17%',
    marginBottom: '17%',
    marginHorizontal: '17%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    elevation: 5,
    borderRadius: 10,
    shadowOpacity: 0.25,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,

  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  distanceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    paddingLeft: 10,
  },
  readMore: {
    marginTop: 4,
    color: 'gray',
  },
  buttonNavigate: {
    marginTop:11, 
    marginHorizontal:10, 
    marginBottom:5, 
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    height: 35,
  }
});

export default PostModal;