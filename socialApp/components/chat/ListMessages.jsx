import {View, Text, StatusBar,StyleSheet,ImageBackground, SafeAreaView, FlatList} from "react-native";
import React, { useState} from 'react';
import {COLORS} from '../../styles/colors';
import MsgComponent from "./MsgComponent";
import {windowHeight, windowWidth} from '../../utils/Dimentions';

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.msg}>
      <MsgComponent
        sender={item.sender}
        message={item.massage}
        item={item}
        sendTime={'20:34'}
      />
      </View>
    );
  };

  return (
    <View style={styles.container} >
     <FlatList
      data={DATA}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      /> 
      </View>
  );
}



const styles = StyleSheet.create({
  container: {
    marginTop:  5,
    marginLeft: windowWidth/14,
    marginRight: windowWidth/14,
    height: windowHeight - StatusBar.currentHeight - windowHeight / 11 - windowHeight / 12,
  }
});


export default ListMessages;