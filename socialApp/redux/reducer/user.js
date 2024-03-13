import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userData',
    initialState: {
        userData: {},
        login : false,
    },
    reducers: {
        setUser(state , action){
            const user =  action.payload;
            return {...state , userData: user}
        },
        removerUser(state, action){
            return {...state , userData: {}, login: false}
        }
    }
});


export const {setUser, removerUser} = userSlice.actions;

export default userSlice.reducer;