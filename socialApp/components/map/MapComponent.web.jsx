import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapComponent = () => {
  return (
    <View style={styles.container}>
      <Text>This is a placeholder for the web map component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default MapComponent;