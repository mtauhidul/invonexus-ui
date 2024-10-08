import axios from "axios";

// const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = "https://invonexus-main-server-d06d9d59defc.herokuapp.com/api";

const apiRequest = async (method, url, data, headers) => {
  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getDocuments = () => apiRequest("get", "/documents");
export const getDocument = (id) => apiRequest("get", `/documents/${id}`);
export const updateDocument = (id, data) =>
  apiRequest("put", `/documents/${id}`, data);
export const deleteDocument = (id) => apiRequest("delete", `/documents/${id}`);
export const addDocument = (data) => apiRequest("post", "/documents", data);
export const processInvoice = (text) =>
  apiRequest("post", "/text", text, { "Content-Type": "text/plain" });
export const changeDocumentStatus = (id, status) =>
  apiRequest("put", `/documents/${id}/status`, status);
export const addStatus = (data) => apiRequest("post", "/status", data);
export const getStatus = (id) => apiRequest("get", `/status/${id}`);
export const getStatuses = () => apiRequest("get", "/status");
export const updateStatus = (id, data) =>
  apiRequest("put", `/status/${id}`, data);
export const deleteStatus = (id) => apiRequest("delete", `/status/${id}`);
export const addTag = (data) => apiRequest("post", "/tags", data);
export const getTag = (id) => apiRequest("get", `/tags/${id}`);
export const getTags = () => apiRequest("get", "/tags");
export const updateTag = (id, data) => apiRequest("put", `/tags/${id}`, data);
export const deleteTag = (id) => apiRequest("delete", `/tags/${id}`);
export const addCategory = (data) => apiRequest("post", "/categories", data);
export const getCategory = (id) => apiRequest("get", `/categories/${id}`);
export const getCategories = () => apiRequest("get", "/categories");
export const updateCategory = (id, data) =>
  apiRequest("put", `/categories/${id}`, data);
export const deleteCategory = (id) => apiRequest("delete", `/categories/${id}`);
export const register = (username, password) =>
  apiRequest("post", "/register", { username, password });
export const userLogin = (username, password) =>
  apiRequest("post", "/users/login", { username, password });
export const textExtract = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest("post", "/text", formData, {
    "Content-Type": "multipart/form-data",
  });
};
