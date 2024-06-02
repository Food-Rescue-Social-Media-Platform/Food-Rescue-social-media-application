import React from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowWidth } from '../../utils/Dimentions';

const PostModal = ({ setVisible, visible, post, onClose, userLocation }) => {
 

  const renderTruncatedFooter = () => {
    return (
      <Text style={styles.readMore} onPress={handleReadMorePress}>
        Read more
      </Text>
    );
  };
  const handleReadMorePress = () => {
    console.log("read more go to single post..");
    setVisible(false);
  };

  const modalHeight = post && post.image ? '45%' : '21%';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { height: modalHeight }]} onPress={() => { console.log("go to single post..") }}>
          {post && (
            <>
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={styles.image}
                />
              )}
              <View style={styles.textContainer}>
                <View style={[styles.titleContainer, !post.image && { height: '45%' }]}>
                  <ReadMore
                    numberOfLines={2}
                    renderTruncatedFooter={renderTruncatedFooter}
                  >
                    <Text style={styles.title}>{post.title}</Text>
                  </ReadMore>
                </View>
                <View style={[styles.distanceContainer, !post.image && { height: '20%' }]}>
                  <MaterialCommunityIcons name="map-marker" size={26} color='black' />
                  <Text style={styles.distanceText}>distance: 10 km</Text>
                </View>
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
  },
  modalContent: {
    width: windowWidth / 1.4,
    alignSelf: 'center',
    marginTop: '17%',
    marginBottom: '17%',
    marginHorizontal: '17%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 180,
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
  distanceText: {
    fontSize: 16,
    paddingLeft: 10,
  },
  readMore: {
    marginTop: 4,
    color: 'gray',
  },
});

export default PostModal;