"use client";

import { createContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

export const AuthenticationContext = createContext();

export default function AuthContext({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    data: null,
    error: null,
  });

  // Fetch User Function
  const fetchUser = async () => {
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      const res = await axios.get(
        // eslint-disable-next-line no-undef
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      if (res.data.status === "success") {
        setAuthState({ data: res.data.data, error: null, loading: false });
      } else {
        setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
      setAuthState({
        data: null,
        error: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
