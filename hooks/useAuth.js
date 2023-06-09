import { useContext } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import axios from "axios";

import { AuthenticationContext } from "@/context/AuthContext";

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  // Sign In Function
  const signin = async (email, password, closeModal) => {
    setAuthState({ data: null, error: null, loading: true });
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/signin`,
        {
          email,
          password,
        }
      );
      if (res.data.status === "success") {
        const { data } = res.data;
        setAuthState({ data: data?.user, error: null, loading: false });
        setCookie("jwt", data?.token);
        closeModal();
      } else {
        setAuthState({
          data: null,
          error: { error: res?.data?.error, message: res?.data?.message },
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
      setAuthState({
        data: null,
        error: {
          message: "Ops there was a problem. Please try again.",
          error: "Authentication Error",
        },
        loading: false,
      });
    }
  };
  // Sign In Function End

  // Sign UP Function
  const signup = async (
    firstName,
    lastName,
    email,
    password,
    phone,
    city,
    closeModal
  ) => {
    try {
      setAuthState({ data: null, error: null, loading: true });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/signup`,
        {
          firstName,
          lastName,
          email,
          password,
          phone,
          city,
        }
      );

      if (res.data.status === "success") {
        const { data } = res.data;
        setAuthState({ data: data?.user, error: null, loading: false });
        setCookie("jwt", data?.token);
        closeModal();
      } else {
        setAuthState({
          data: null,
          error: { error: res?.data?.error, message: res?.data?.message },
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
      setAuthState({
        data: null,
        error: {
          message: "Ops there was a problem. Please try again.",
          error: "Authentication Error",
        },
        loading: false,
      });
    }
  };
  // Sign UP Function End

  // Signout Function
  const signout = () => {
    deleteCookie("jwt");
    setAuthState({ data: null, error: null, loading: false });
  };

  return { signin, signup, signout };
};

export default useAuth;
