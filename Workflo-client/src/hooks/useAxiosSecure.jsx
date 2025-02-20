import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        // console.log("Error caught from axios interceptor-->", error.response);
        if (error.response.status === 401 || error.response.status === 403) {
          // logout
          logOut();
          // navigate to home/login
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
