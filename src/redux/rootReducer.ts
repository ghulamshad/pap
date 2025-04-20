import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import videoReducer from './slices/videoSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  videos: videoReducer,
});
