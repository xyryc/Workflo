/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const authInfo = {
    user: "anik",
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
