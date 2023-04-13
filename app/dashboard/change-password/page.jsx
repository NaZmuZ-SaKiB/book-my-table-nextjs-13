/* eslint-disable no-undef */
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";

import { getCookie } from "cookies-next";

export default function ChangePassword() {
  const [inputs, setInputs] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (inputs !== null) {
      if (
        !inputs.currentPassword ||
        !inputs.password ||
        !inputs.confirmPassword
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
        `${process.env.baseApiURL}/api/auth/password`,
        { ...inputs },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (res.data?.status === "success") {
        setError(null);
        setSuccess(res.data?.message);
      } else {
        setSuccess(null);
        setError({ message: res.data?.message, error: res.data?.error });
      }
    } catch (error) {
      setSuccess(null);
      setError({
        message:
          "Ops there was a problem changing your password. Please try again.",
        error: "Client Error",
      });
    }

    setLoading(false);
  };
  return (
    <div>
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
        Change Your Password
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
          className="border rounded px-2 py-3 w-full"
          type="password"
          placeholder="Current Password"
          name="currentPassword"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          className="border rounded px-2 py-3 w-full"
          type="password"
          placeholder="Password"
          name="password"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          className="border rounded px-2 py-3 w-full"
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
        />
      </div>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="bg-blue-500 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-200"
      >
        {loading ? (
          <CircularProgress size={30} color="primary" />
        ) : (
          "Change Password"
        )}
      </button>
    </div>
  );
}
