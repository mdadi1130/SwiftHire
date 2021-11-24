import {
    CONFIRM_SIGN_UP,
    CONFIRM_SIGN_UP_FAILURE,
    CONFIRM_SIGN_UP_SUCCESS,
    LOG_IN,
    LOG_IN_FAILURE,
    LOG_IN_SUCCESS,
    LOG_OUT,
    SHOW_SIGN_UP_CONFIRMATION,
    SIGN_UP,
    SIGN_UP_FAILURE,
    SIGN_UP_SUCCESS,
    UPDATE_USER
} from "./reducers/AuthReducer";

import {Auth} from "aws-amplify";

import {Alert} from "react-native";

const signUp = () => {
    return {
        type: SIGN_UP
    }
};

const signUpSuccess = user => {
    return {
        type: SIGN_UP_SUCCESS,
        user
    }
};

const signUpFailure = error => {
    return {
        type: SIGN_UP_FAILURE,
        error: error
    }
};

export const createUser = (email, password) => {
    return (dispatch) => {
        dispatch(signUp());
        Auth.signUp({
            username: email,
            password
        }).then(data => {
            dispatch(signUpSuccess(data));
            dispatch(showSignUpConfirmation());
        }).catch(error => {
            dispatch(signUpFailure(error));
        });
    }
};

const logIn = () => {
    return {
        type: LOG_IN
    }
};

export const logOut = () => {
    return {
        type: LOG_OUT
    }
};

const logInSuccess = user => {
    return {
        type: LOG_IN_SUCCESS,
        user: user
    }
};

const logInFailure = error => {
    return {
        type: LOG_IN_FAILURE,
        error: error
    }
};

export const authenticate = (email, password) => {
    return (dispatch) => {
        dispatch(logIn());
        Auth.signIn(email, password).then(user => {
            dispatch(logInSuccess(user));
        }).catch(error => {
            dispatch(logInFailure(error));
        });
    }
};

export const updateUser = user => {
    return {
        type: UPDATE_USER,
        user: user
    }
};

export const showSignUpConfirmation = () => {
    return {
        type: SHOW_SIGN_UP_CONFIRMATION
    }
};

export const confirmUserSignUp = (email, authCode) => {
    return (dispatch) => {
        dispatch(confirmSignUp());
        Auth.confirmSignUp(email, authCode).then(data => {
            dispatch(confirmSignUpSuccess());
            Alert.alert('Successfully Signed Up', 'Please Sign In');
        })
    }
};

const confirmSignUp = () => {
    return {
        type: CONFIRM_SIGN_UP
    }
};

const confirmSignUpSuccess = () => {
    return {
        type: CONFIRM_SIGN_UP_SUCCESS
    }
};

const confirmSignUpFailure = error => {
    return {
        type: CONFIRM_SIGN_UP_FAILURE,
        error
    }
};
