export const LOG_IN = 'LOG_IN';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const SHOW_SIGN_UP_CONFIRMATION = 'SHOW_SIGN_UP_CONFIRMATION';

export const CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP';
export const CONFIRM_SIGN_UP_SUCCESS = 'CONFIRM_SIGN_UP_SUCCESS';
export const CONFIRM_SIGN_UP_FAILURE = 'CONFIRM_SIGN_UP_FAILURE';

export const UPDATE_USER = 'UPDATE_USER';

const initialState = {
    isAuthenticating: false,
    user: {},

    signUpError: false,
    signInError: false,

    showSignUpConfirmation: false,

    confirmSignUpError: false,
    confirmSignUpErrorMessage: '',

    signInErrorMessage: '',
    signUpErrorMessage: ''
};

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SIGN_UP_CONFIRMATION:
            return {
                ...state,
                isAuthenticating: false,
                showSignUpConfirmation: true
            };
        case CONFIRM_SIGN_UP:
            return {
                ...state,
                isAuthenticating: true
            };
        case CONFIRM_SIGN_UP_SUCCESS:
            return {
                ...state,
                isAuthenticating: false,
                showSignUpConfirmation: false
            };
        case CONFIRM_SIGN_UP_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                confirmSignUpError: false,
                confirmSignUpErrorMessage: action.error.message
            };
        case SIGN_UP:
            return {
                ...state,
                isAuthenticating: true
            };
        case SIGN_UP_SUCCESS:
            return {
                ...state,
                isAuthenticating: false
            };
        case SIGN_UP_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                signUpError: true,
                signUpErrorMessage: action.error.message
            };
        case LOG_IN:
            return {
                ...state,
                isAuthenticating: true,
                signInError: false
            };
        case LOG_IN_SUCCESS:
            return {
                isAuthenticating: false,
                user: action.user
            };
        case LOG_IN_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                signInError: true,
                signInErrorMessage: action.error.message
            };
        case UPDATE_USER:
            return {
                ...state,
                user: action.user
            };
        case LOG_OUT:
            return {
                ...initialState
            };
        default:
            return state;
    }
};
