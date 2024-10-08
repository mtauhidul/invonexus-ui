import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../reducers/categoriesReducer';
import documentsReducer from '../reducers/documentsReducer';
import statusesReducer from '../reducers/statusesReducer';
import tagsReducer from '../reducers/tagsReducer';
import userReducer from '../reducers/userReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    documents: documentsReducer,
    statuses: statusesReducer,
    tags: tagsReducer,
    categories: categoriesReducer,
  },
});
