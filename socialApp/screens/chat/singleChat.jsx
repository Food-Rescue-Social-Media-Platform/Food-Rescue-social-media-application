import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, SectionList, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import ChatHeader from '../../components/header/ChatHeader';
import FooterChat from '../../components/footer/FooterChat';
import ListMessages from '../../components/chat/ListMessages';


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
  
const SingleChat = (props) => {
    // const data = props.route.params;
    const dataProps = '';

    const [msg , setMsg] = useState('');
    const [update , setUpdate] = useState(false);
    const [disable , setDisable] = useState(false);
    const [allChats , setAllChats] = useState([]);
    const [loading , setLoading] = useState(true);
    
    return (
        <View>
            <ListMessages/>
            <FooterChat/>
        </View>
    )
}

export default SingleChat;