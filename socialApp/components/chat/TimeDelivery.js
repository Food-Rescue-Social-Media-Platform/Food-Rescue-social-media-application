import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import {COLORS} from '../../styles/colors';

const TimeDelivery = (props) => {
    const { sender , item} = props;
    return (
        <View
         style={[styles.mainView , {
            justifyContent: 'flex-end',
         }]}
        >
            <Text  style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 7, 
                color: COLORS.black
            }}>
            {MsgComponent(item.sent_time).format('LLL')}
            </Text>

            </View>
            
            )
        }
        
        
        const styles = StyleSheet.create({
            mainView: {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 2
            }
})


export default TimeDelivery;
// <Icon
//   name = {"checkmark-done"}
//   type = "Ionicons"
//   style = {{color: item.seen ? COLORS.black: COLORS.white , fontSize: 15, marginLeft: 5}}
// />