import { createSlice } from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
  },

  reducers: {
    addAllDocuments: (state, action) => {
      // First sort the documents by createdAt date in descending order (newest first) and then store them in the redux store state variable called documents (which is an array) so that the newest documents are displayed first in the dashboard page

      const sortedDocuments = action.payload.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      state.documents = sortedDocuments;
    },
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    updateDocument: (state, action) => {
      const index = state.documents.findIndex(
        (document) => document.id === action.payload.id
      );
      state.documents[index] = action.payload;
    },
    deleteDocument: (state, action) => {
      const index = state.documents.findIndex(
        (document) => document.id === action.payload.id
      );
      state.documents.splice(index, 1);
    },
    updateDocumentStatus: (state, action) => {
      const index = state.documents.findIndex(
        (document) => document.id === action.payload.id
      );
      state.documents[index].status = action.payload.status;
    },
  },
});

export const selectDocuments = (state) => state.documents.documents;

export const {
  addAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  updateDocumentStatus,
} = documentSlice.actions;

export default documentSlice.reducer;
