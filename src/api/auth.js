import { createAsyncThunk } from "@reduxjs/toolkit";
// const API_BASE_URL = ''

// signin
export const signin = createAsyncThunk('auth/signin', async (params, thunkApi) => {

    //console.log('🚀😂 ~ file: auth.js:6 ~ signin ~ params:', params);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": params.username,
        "password": params.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        console.log("header",requestOptions)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_HOST_URL}/auth/token`, requestOptions);
        let jsonData = await response.json();
        console.log("sign in auth.js", response)

        if (response.status == 200) {
            //console.log("loginfunction", jsonData)
            return thunkApi.fulfillWithValue(jsonData);
        } else if (response.status == 403) {
            //console.log("loginfunction else", jsonData)
            return thunkApi.fulfillWithValue(jsonData)
        } else {
            return thunkApi.rejectWithValue(jsonData)
        }
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }

});

// signup
export const signup = createAsyncThunk('signup', async (params, thunkApi) => {
    //console.log('🚀 ~ file: auth.js:42 ~ signup ~ params:', params);


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "name": params.name,
        "email": params.username,
        "password": params.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${params.hostname}/api/users`, requestOptions);
        jsonData = await response.json();
        console.log("signupfunction", jsonData)
        // jsonData = {}
        if (response.status == 200) { 
            return thunkApi.fulfillWithValue(jsonData)
        } else {
            //console.log("signupfunction else", jsonData)
            return thunkApi.rejectWithValue(jsonData)
        }
    } catch (error) {
        //console.log(error)
        return thunkApi.rejectWithValue(error.message);
    }
});


// Send OTP using email ID
export const SendOTP = (params) => {
    return new Promise(async (resolve, reject) => {
        console.log('🚀 ~ file: auth.js:45 ~ getproductId ~ params:', params);
        var raw = JSON.stringify({
            "email": params.username,
        });

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            body: raw,
            headers: myHeaders,
        };
        try {
            const response = await fetch(`${params.hostname}/api/users/generate_otp`, requestOptions);
            const jsonData = await response.json();
            console.log("Send OTP respponse ", jsonData)

            if (response.status === 200) {
                resolve(jsonData); // Resolve the promise with the JSON data
            } else if (response.status === 422) {
                // Handle status 422 error
                reject({ status: 422, message: 'Validation error' });
            } else {
                // Handle other errors
                reject({ status: response.status, message: 'Unknown error' });
            }
        } catch (error) {
            console.log('Sameer', error)
            reject(error.message); // Reject the promise with the error message
        }
    });
};

//verify OTP
export const VerifyOTP = (params) => {
    return new Promise(async (resolve, reject) => {
        console.log('🚀 ~ file: auth.js:45 ~ verifyOTP~ params:', params);
        var raw = JSON.stringify({
            "email": params.username,
            "otp": params.otp
        });
        console.log('verify otp', params)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: raw
        };

        try {
            const response = await fetch(`${params.hostname}/api/users/verify_otp`, requestOptions);
            const jsonData = await response.json();

            console.log("products detaisl get by id ", jsonData)
            if (response.status === 200) {
                resolve(jsonData); // Resolve the promise with the JSON data
            } else if (response.status === 422) {
                // Handle status 422 error
                reject({ status: 422, message: 'Validation error' });
            } else {
                // Handle other errors
                reject({ status: response.status, message: 'Unknown error' });
            }
        } catch (error) {
            reject(error.message); // Reject the promise with the error message
        }
    });
};

// getUser details
// export const signup = createAsyncThunk('signup', async (params, thunkApi) => {
//     //console.log('🚀 ~ file: auth.js:42 ~ signup ~ params:', params);
//     const { value } = useSelector((state) => state.hostname);

//     const { email, password,  } = params
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     setLoading(true);
//     var raw = JSON.stringify({ email, name, password, password2, contact });

//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//     };

//     try {
//         const response = await fetch(`${value}/api/token`, requestOptions);
//         jsonData = await response.json();
//         if (response.status == 200) {
//             //console.log("signupfunction", jsonData)

//         } else {
//             //console.log("signupfunction else", jsonData)

//         }
//     } catch (error) {
//         return thunkApi.rejectWithValue(error.message);
//     }
// });


export const GetUserProfile = (params) => {
    return new Promise(async (resolve, reject) => {
        console.log('🚀 ~ file: auth.js ~ getuserProfile ~ params:', params);

        const raw = JSON.stringify({ email: params.email })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${params.access_token}`);

        var requestOptions = {
            body: raw,
            method: "POST",
            redirect: "follow",
            headers: myHeaders,
        };

        try {
            const response = await fetch(`${params.hostname}/api/users/profile`, requestOptions);
            const jsonData = await response.json();

            console.log("get user profile ", jsonData)
            if (response.status === 200 && jsonData.status == "success") {
                resolve(jsonData); // Resolve the promise with the JSON data
            } else if (response.status === 422) {
                // Handle status 422 error
                reject({ status: 422, message: 'Validation error' });
            } else {
                // Handle other errors
                reject({ status: response.status, message: 'Unknown error' });
            }
        } catch (error) {
            reject(error.message); // Reject the promise with the error message
        }
    });

}

export const UpdateUserProfile = (params) => {
    return new Promise(async (resolve, reject) => {
        console.log('🚀 ~ file: auth.js ~ UpdateUserProfile ~ params:', params);

        const raw = JSON.stringify(params.data)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${params.access_token}`);

        var requestOptions = {
            body: raw,
            method: "PUT",
            redirect: "follow",
            headers: myHeaders,
        };

        try {
            const response = await fetch(`${params.hostname}/api/users/profile_update`, requestOptions);
            const jsonData = await response.json();

            console.log("get user profile ", jsonData)
            if (response.status === 200 && jsonData.status == "success") {
                resolve(jsonData); // Resolve the promise with the JSON data
            } else if (response.status === 422) {
                // Handle status 422 error
                reject({ status: 422, message: jsonData.message });
            } else {
                // Handle other errors
                reject({ status: response.status, message: jsonData.message });
            }
        } catch (error) {
            reject(error.message); // Reject the promise with the error message
        }
    });

}



//     //console.log('🚀😂 ~ file: auth.js:6 ~ signin ~ params:', params);

//     console.log('🚀 ~ file: auth.js ~ Syndata ~ params:', params);

//         var myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("Authorization", `Bearer ${params.access_token}`);

//         var requestOptions = {
//             method: "GET",
//             redirect: "follow",
//             headers: myHeaders,
//         };

//     try {
//         const response = await fetch(`${params.hostname}/api/users/sync_grants`, requestOptions);
//         const jsonData = await response.json();
//         console.log("syncGrants naylas.js", response)

//         if (response.status == 200 && jsonData.status == "success") {
//             console.log("sync grants auth.js.js", jsonData)
//             //return thunkApi.fulfillWithValue({ access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOjN9.tZ8HUgpX9kH3jRCXVhporsM5wPfz4dfw9tyhK5LtLf8" });
//             return thunkApi.fulfillWithValue(jsonData);
//         } else {
// //             Alert.alert("Failed", "Failed to sync data")
//             return thunkApi.rejectWithValue(jsonData)
//         }
//     } catch (error) {
//         return thunkApi.rejectWithValue(error.message);
//     }

// });