import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, SectionList, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import ChatHeader from '../../components/header/ChatHeader';
import FooterChat from '../../components/footer/FooterChat';

const Data = [
    {
        massage: 'Yes Ofcourse..',
        type: 'sender'
    },
    {
        massage: 'How are You ?',
        type: 'sender'
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender'
    },
    {
        massage: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver'
    },
    {
        massage: 'could you plz change the design...',
        type: 'receiver'
    },
    {
        massage: 'How are You ?',
        type: 'sender'
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender'
    },
    {
        massage: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver'
    },
    {
        massage: 'could you plz change the design...',
        type: 'receiver'
    },
    {
        massage: 'How are You ?',
        type: 'sender'
    },
    {
        massage: 'How Your Opinion about the one done app ?',
        type: 'sender'
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
        <ChatHeader data = {dataProps}/>
        <Text>SingleChat</Text>
        <FooterChat />
        </View>
    )
}

export default SingleChat;