import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userData',
    initialState: {
        userData: {},
        login : false,
    },
    reducers: {
        setUserData(state , action){
            const user =  action.payload;
            return {...state , userData: user, login: true}
        },
        removerUserData(state, action){
            return {...state , userData: {}, login: false}
        }
    }
});


export const {setUserData, removerUserData} = userSlice.actions;

export default userSlice.reducer;