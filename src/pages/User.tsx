import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest, userSelector } from "../features/user/userSlice";
import { fetchPostRequest, postSelector } from "../features/post/postSlice";
import { alertSelector, fetchAlertRequest } from "../features/alert/alertSlice";

export default function User() {
  const dispatch = useDispatch();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useSelector(userSelector);
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useSelector(postSelector);
  const {
    data: alertData,
    loading: alertLoading,
    error: alertError,
  } = useSelector(alertSelector);
  console.log("data", alertData);
  useEffect(() => {
    dispatch(fetchUsersRequest());
    dispatch(fetchPostRequest());
    dispatch(fetchAlertRequest());
  }, []);

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError}</p>;
  const renderData = (obj) => {
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} className="ml-4">
        <strong>{key}:</strong>{" "}
        {typeof value === "object" && value !== null ? (
          <div className="ml-4">{renderData(value)}</div>
        ) : (
          <span>{value.toString()}</span>
        )}
      </div>
    ));
  };

  return <div>{renderData(userData)}</div>;
}
