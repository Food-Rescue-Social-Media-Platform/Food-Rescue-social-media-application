
import { View, Text, StyleSheet } from 'react-native';
import {COLORS} from '../../styles/colors';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Image } from 'react-native';

const MsgComponent = (props) => {
    // console.log('props: ', props);
    const { item } = props;
    item.sendTime = '22:21';
    const { message, images, sender, sendTime } = item;
    const userData = useSelector(state => state.user.userData);
    // console.log('sentTime: ', sendTime);
    // <Text style={styles.timeText}>{moment(sendTime).format('LT')}</Text>
    return (
        <View style= {[styles.msgBox, sender === userData.id ? styles.right : styles.left ]}>
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
            <Text style={styles.timeText}>22:31</Text>
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