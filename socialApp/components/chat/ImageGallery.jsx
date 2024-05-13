import React from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import  { MaterialIcons } from '@expo/vector-icons';  
import { COLORS } from '../../styles/colors';

const ImageGallery = ({ images, onClose }) => {

  return (
      <View style={{flex: 1, flexDirection:'row', flexWrap:'wrap'}}>
         { images.map((item, index) => (
            <View key={index}>
              <Image source={{ uri: item }} style={{width: 100, height: 100 }} />
            </View>
           ))}                            
       </View>
  );
};

const styles = StyleSheet.create({

});

export default ImageGallery;