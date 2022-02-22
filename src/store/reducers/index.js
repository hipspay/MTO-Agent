import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import web3Reducer from '../reducer/web3reducer';
import authReducer from '../reducer/authReducer';

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        auth: authReducer,
        web3: web3Reducer,
    });
