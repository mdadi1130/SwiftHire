import AsyncStorage from "@react-native-async-storage/async-storage";
import {applyMiddleware, combineReducers, createStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {persistReducer, persistStore} from "redux-persist";
import {AuthReducer} from "./reducers/AuthReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user']
};

const rootReducer = combineReducers({
    AuthReducer: persistReducer(persistConfig, AuthReducer)
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);
