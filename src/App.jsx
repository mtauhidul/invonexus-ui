import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import { addCategories, selectCategories } from "./reducers/categoriesReducer";
import { addAllDocuments, selectDocuments } from "./reducers/documentsReducer";
import { addStatuses, selectStatuses } from "./reducers/statusesReducer";
import { addTags, selectTags } from "./reducers/tagsReducer";
import {
  getCategories,
  getDocuments,
  getStatuses,
  getTags,
} from "./services/services";

const App = () => {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocuments);
  const statuses = useSelector(selectStatuses);
  const tags = useSelector(selectTags);
  const categories = useSelector(selectCategories);

  useEffect(() => {
    const fetchData = async () => {
      if (documents.length === 0) {
        const res = await getDocuments();
        dispatch(addAllDocuments(res.data));
      }

      if (statuses.length === 0) {
        const res = await getStatuses();
        dispatch(addStatuses(res.data));
      }

      if (tags.length === 0) {
        const res = await getTags();
        dispatch(addTags(res.data));
      }

      if (categories.length === 0) {
        const res = await getCategories();
        dispatch(addCategories(res.data));
      }
    };

    fetchData();
  }, [
    dispatch,
    documents.length,
    statuses.length,
    tags.length,
    categories.length,
  ]);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
