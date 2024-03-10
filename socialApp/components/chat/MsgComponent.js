
import { Pressable, View, Text, StyleSheet } from 'react-native';
import TimeDelivery from "./TimeDelivery";
import {COLORS} from '../../styles/colors';



const MsgComponent = (props) => {
    const { sender, message, item, sendTime } = props;
    return (
        <View styles={{height:30}}>
        <Text>{message}</Text>
        </View>
        )
    }


const styles = StyleSheet.create({
    masBox: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        minWidth: 80,
        maxWidth: '80%',
        paddingHorizontal: 10,
        marginVertical: 5,
        paddingTop: 5,
        borderRadius: 8
    },
    timeText: {
        fontSize: 10
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
        // top: -3,
        width: 0,
        height: 0,
        // borderBottomLeftRadius:5,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 5,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        // borderBottomColor: '#757474'
    },
    left: {
        borderBottomColor: COLORS.white,
        left: 2,
        bottom: 10,
        transform: [{ rotate: '0deg' }]
    },
    right: {
        borderBottomColor: COLORS.theme,
        right: 2,
        // top:0,
        bottom: 5,
        transform: [{ rotate: '103deg' }]
    },
})


        // <Pressable
        //     style={{ marginVertical: 0 }}
        // >
        //     <View
        //         style={[styles.TriangleShapeCSS,
        //         sender ? styles.right : [styles.left]
        //         ]}
        //     />
        //     <View
        //         style={[styles.hasBox, {
        //             alignItems: sender ? 'flex-end' : 'flex-start',
        //             backgroundColor: sender ? COLORS.theme : COLORS.white
        //         }]}
        //     />
    
        //     <Text style={{ paddingLeft: 5, color: sender ? COLORS.white : COLORS.black, fontSize: 12.5 }}>
        //         {message}
        //     </Text>
    
        //     <TimeDelivery
        //         sender={sender}
        //         item={item}
        //     />
    
        // </Pressable>
export default MsgComponent;