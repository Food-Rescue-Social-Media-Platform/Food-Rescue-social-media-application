import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Rating = ({ route }) => {
  const { userData } = route.params;

  return (
    <View>
      <Text>Rating</Text>
    </View>
  )
}

export default Rating

const styles = StyleSheet.create({})