import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const EditProfile = () => {
    const [image, setImage] = useState('https://scontent.fhfa2-2.fna.fbcdn.net/v/t1.6435-9/107040286_4536588449688229_5150338046413976048_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=B44krh_9eD0AX-hxEvB&_nc_ht=scontent.fhfa2-2.fna&oh=00_AfAShR8PEumQeOhDDfTzp6Xvepoq-Gq4z31tJ7eviuK50A&oe=66320A4E');
    const {colors} = useTheme();    
      return (
        <View style={styles.container}> 
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity onPress={null}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={{
                      uri: image,
                    }}
                    style={{height: 100, width: 100}}
                    imageStyle={{borderRadius: 15}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="camera"
                        size={35}
                        color="#fff"
                        style={{
                          opacity: 0.7,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: '#fff',
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
                John Doe
              </Text>
            </View>
    
            <View style={styles.action}>
              <FontAwesome name="id-card" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:10,

                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="id-card" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="phone" color={colors.text} size={25} paddingLeft={10}/>
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:18,

                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <AntDesign name="email" color={colors.text} size={25} paddingLeft={8}/>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:14,

                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <MaterialCommunityIcons name="map-marker" color={colors.text} size={27} paddingLeft={5}/>
              <TextInput
                placeholder="location"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    paddingLeft:16,
                  },
                ]}
              />
            </View>
            <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
              <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>
        </View>
      );    
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f9fafd',

  },
  commandButton: {
    backgroundColor: '#A7EAAE',
    padding: 13,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:20,
    marginTop:10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#CEF0D3',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#CEF0D3',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CEF0D3',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#CEF0D3',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
})

export default EditProfile;
