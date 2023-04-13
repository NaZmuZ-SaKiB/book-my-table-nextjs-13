/* eslint-disable no-undef */
"use client";

import { useContext, useEffect, useState } from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";

import { AuthenticationContext } from "@/context/AuthContext";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function MyAccount() {
  const { data, setAuthState } = useContext(AuthenticationContext);
  const [inputs, setInputs] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputs({
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      city: data?.city || "",
    });
  }, [data]);

  useEffect(() => {
    if (inputs && data) {
      if (
        inputs.first_name === data.first_name &&
        inputs.last_name === data.last_name &&
        inputs.email === data.email &&
        inputs.city === data.city
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [inputs]);

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const jwt = getCookie("jwt");
      const res = await axios.patch(
        `${process.env.baseApiURL}/api/auth/me`,
        { ...inputs },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (res.data?.status === "success") {
        setError(null);
        setAuthState({
          error: null,
          loading: null,
          data: res.data?.data,
        });
        setSuccess(res.data?.message);
      } else {
        setSuccess(null);
        setError({ message: res.data?.message, error: res.data?.error });
      }
    } catch (error) {
      setSuccess(null);
      setError({
        message:
          "Ops there was a problem updating your info. Please try again.",
        error: "Client Error",
      });
    }

    setLoading(false);
  };
  return (
    <div className="max-w-screen-md mx-auto">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
        Your Account
      </h2>
      {success && (
        <Alert onClose={() => setSuccess(null)} severity="success">
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}
      {error?.error && (
        <Alert onClose={() => setError(null)} severity="error">
          <AlertTitle>{error?.error}</AlertTitle>
          {error?.message}
        </Alert>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          defaultValue={data?.first_name}
          className="border rounded px-2 py-3 w-[49%]"
          type="text"
          placeholder="First Name"
          name="first_name"
        />
        <input
          onChange={handleChange}
          defaultValue={data?.last_name}
          className="border rounded px-2 py-3 w-[49%]"
          type="text"
          placeholder="Last Name"
          name="last_name"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          defaultValue={data?.email}
          className="border rounded px-2 py-3 w-full"
          type="email"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          defaultValue={data?.phone}
          className="border rounded px-2 py-3 w-[49%]"
          type="text"
          placeholder="Phone"
          name="phone"
        />
        <input
          onChange={handleChange}
          defaultValue={data?.city}
          className="border rounded px-2 py-3 w-[49%]"
          type="text"
          placeholder="City"
          name="city"
        />
      </div>
      <button
        disabled={disabled || loading}
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-400 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-200"
      >
        {loading ? (
          <CircularProgress size={30} color="primary" />
        ) : (
          "Update Info"
        )}
      </button>
      <Link
        href="/dashboard/change-password"
        className="text-sm underline text-blue-400 hover:text-blue-500 cursor-pointer"
      >
        Change Password
      </Link>
    </div>
  );
}
