import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  ${'' /* justify-content: center; flex:1; */}
  align-items: center;
  background-color: #f9fafd;
  padding: 20px;
`;

export const Card = styled.View`
    background-color: #CEF0D3;
    margin-bottom: 20px;
    border-radius: 10px;
    ${Platform.OS === 'web' ? 'margin-left:15%;' : ''}

`;

export const UserInfo = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    padding: 15px;
`;

export const UserImg = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

export const UserInfoText = styled.View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
    /*margin-right:10px;*/
`;

export const UserName = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

export const PostTime = styled.Text`
    font-size: 12px;
    color: #666;
`;

export const PostText = styled.Text`
    font-size: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
`;

export const PostImg = styled.Image`
    width: 100%;
    ${Platform.OS === 'web' ? 'height: 500px' : 'height: 250px;'}
    margin-bottom: 15px;

    /* margin-top: 15px; */
`;

export const Divider = styled.View`
    border-bottom-color: #A7EAAE;
    border-bottom-width: 1px;
    width: 91%;
    align-self: center;
    margin-bottom: 15px;
    margin-top: -10px;
`;

export const InteractionWrapper = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
    marginTop:1%;
    background-color: #A7EAAE;
    border-radius: 50px;
    margin-right:8px;
    margin-left:8px;
`;

export const Interaction = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    border-radius: 5px;
    padding: 2px 5px;
    background-color: ${props => props.active ? '#2e64e515' : 'transparent'}
`;

export const InteractionText = styled.Text`
    font-size: 12px;
    font-weight: bold;
    color: ${props => props.active ? '#2e64e5' : '#333'};
    margin-top: 5px;
    margin-left: 5px;
`;