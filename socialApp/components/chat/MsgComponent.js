
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
    const { message, images, sender, sentTime } = item;
    const userData = useSelector(state => state.user.userData);
    const formatDate = moment(sentTime).format('LT');

    
    return (
        <View style= {[styles.msgBox, sender === user.id ? styles.right : styles.left ]}>
            { message?.length > 0 && (<Text >{message}</Text>)}
            {( images?.length > 0) && (
                <View style={{flexDirection: 'cul', flexWrap: 'wrap'}}>
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            source={{uri: img}}
                            style={{height: 100, width: 100, margin: 5}}
                        />
                    ))}
                </View>
            
            )}
            <Text style={styles.timeText}>{formatDate}</Text>
        </View>
        )
    }


const styles = StyleSheet.create({
    msgBox :{
        marginHorizontal: 10,
        minWidth: 80,
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
    dayview: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: COLORS.white,
        borderRadius: 30,
        marginTop: 10
    },
    iconView: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: COLORS.themecolor,
    },
    TriangleShapeCSS: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 5,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
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

const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}

export default MsgComponent;