import React from 'react';
import { Modal, View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const ImageModalViewer = ({ images, visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="black" />
        </TouchableOpacity>
        <ScrollView
          vertical
          pagingEnabled
          showsVerticalScrollIndicator={false}
        >
          {images?.map((img, index) => (
            <Image 
              key={index}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    borderRadius:16,
    backgroundColor:'white'
  },
  image: {
    width: width,
    height: height,
  },
});

export default ImageModalViewer;