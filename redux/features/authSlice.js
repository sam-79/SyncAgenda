import { createSlice } from '@reduxjs/toolkit';
import { signin, signup } from '../../src/api/auth';

const initialState = {
  userData: null,
  userVerified: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// confirmSignup

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null
      state.userVerified = false
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.error = null
    },
    resetTempValues: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.error = null
    },
    changeVerifiedStatus:(state, action)=>{
      state.userVerified = action.payload.is_verified;
    }
  },
  extraReducers: builder => {
    // signin cases
    builder.addCase(signin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signin.fulfilled, (state, action) => {

      //console.log("authSLice.js signin line48", action)
      state.isLoading = false;
      state.isSuccess = true;
      state.userVerified = action.payload.detail.is_verified;
      
      if(action.payload.detail.is_verified){
        state.userData = action.payload.detail;
      }else{
        // Alert.alert("Verify OTP", action.payload.detail.msg)
        
      }

    });
    builder.addCase(signin.rejected, (state, action) => {
      //console.log("authSLice, Line 36", action)
      console.log("authSLice.js signin line 55",state, action)

      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      // state.userVerified = action.payload.detail.is_verified;
      // Alert.alert("Error", action.payload.detail.msg)
    });

    // signup cases
    builder.addCase(signup.pending, (state, action) => {
      console.log("authSLice, Line 60", action)
      state.isLoading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      console.log("authSLice.js line 64", action)
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.userVerified = action.payload.detail.is_verified;
      //state.userData = action.payload.userData;
      //state.userVerified = action.payload.detail.is_verified;
      // Alert.alert("Success", action.payload.detail.msg)

    });
    builder.addCase(signup.rejected, (state, action) => {
      console.log("authSLice, Line 71", action)

      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      // Alert.alert("Error", action.payload.detail)

    });
    
  },
});
export const { logout, resetTempValues, changeVerifiedStatus } = authSlice.actions
export default authSlice.reducer;