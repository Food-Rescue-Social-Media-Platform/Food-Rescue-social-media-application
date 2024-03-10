import {View, Text, StatusBar,StyleSheet, SafeAreaView, FlatList} from "react-native";
import React, { useState} from 'react';
import {COLORS} from '../../styles/colors';
import MsgComponent from "./MsgComponent";


const DATA = [
  {
      massage: 'Yes Ofcourse..',
      type: 'sender',
      id: 1,
      sender: 'me'
  },
  {
      massage: 'How are You ?',
      type: 'sender',
      id: 2,
      sender: 'me'
  },
  {
      massage: 'How Your Opinion about the one done app ?',
      type: 'sender' ,  
      id: 3,
      sender: '33'
  },
  {
      massage: 'Well i am not satisfied with this design plzz make design better ',
      type: 'receiver',
      id: 4,
      sender: '33'

  },
  {
      massage: 'could you plz change the design...',
      type: 'receiver',
      id: 5,
      sender: '33'

  },
  {
      massage: 'How are You ?',
      type: 'sender',
      id: 6,
      sender: '33'

  },
  {
      massage: 'How Your Opinion about the one done app ?',
      type: 'sender',
      id: 7,
      sender: 'me'

  },
  {
      massage: 'Well i am not satisfied with this design plzz make design better ',
      type: 'receiver',
      id: 8,
      sender: '33'

  },
  {
      massage: 'could you plz change the design...',
      type: 'receiver',
      id: 9,
      sender: '33'

  },
  {
      massage: 'How are You ?',
      type: 'sender',
      id: 10,
      sender: '33'

  },
  {
      massage: 'How Your Opinion about the one done app ?',
      type: 'sender',
      id: 11,
      sender: '33'

  }
]


function ListMessages() {
  const [meId, setMeId] = useState('Me');

  const renderItem = ( item ) => (
      <View style={styles.item} key={item.id}>
        <Text style={styles.msg}>w</Text>
      </View>
  );

  return (
      <SafeAreaView style={styles.container}>
        <FlatList
          horizontal={true}
          style={{ flex: 1, borderColor: 'red', borderWidth: 1 }}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    height: 500
  },
  item: {
    backgroundColor: '#d9f9b1',
    padding: 20,
    height: 100,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  msg: {
    height: 30,
    fontSize: 32,
  
  },
});


export default ListMessages;