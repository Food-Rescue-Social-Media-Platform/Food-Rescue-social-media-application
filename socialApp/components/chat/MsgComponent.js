import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {COLORS} from '../../styles/colors';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Image } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';

const MsgComponent = (props) => {
    const { user, logout } = useContext(AuthContext);
    const { item } = props;
    const formatDate = moment(item.sentTime).format('LT');
    
    return (
        <View style= {[styles.msgBox, item.from === user.uid ? styles.right : styles.left ]}>
            { item.message?.length > 0 && 
                (<Text >{item.message}</Text>)
            }
            
            { item.images?.length > 0 && 
                ( <View style={{flexDirection: 'cul', flexWrap: 'wrap'}}>
                    { item.images.map((img, index) => (
                        <Image
                            key={index}
                            source={{uri: img}}
                            style={{height: 100, width: 100}}
                        />
                    )) }
                </View>)
            }
            <Text style={styles.timeText}>{formatDate}</Text>
        </View>
        )
    }


const styles = StyleSheet.create({
    msgBox :{
        marginHorizontal: 10,
        minWidth: 100,
        maxWidth: '80%',
        marginVertical: 5,
        padding: 6,
        borderRadius: 8,
        margin: 10,
    },
    timeText: {
        fontSize: 10,
        paddingTop:4,
        alignSelf: 'flex-end',
    },
    left: {
        backgroundColor: COLORS.messageNotME,
        alignSelf: 'flex-start',
    },
    right: {
        backgroundColor: COLORS.theme,
        alignSelf: 'flex-end',
    },
})

export default MsgComponent;