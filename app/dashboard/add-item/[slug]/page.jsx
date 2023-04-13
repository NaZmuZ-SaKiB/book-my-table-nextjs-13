/* eslint-disable no-undef */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";

export default function AddItem({ params }) {
  const [inputs, setInputs] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (inputs?.name && inputs?.price && inputs.description) {
      setDisabled(false);
    } else {
      setDisabled(true);
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
      const res = await axios.post(
        `${process.env.baseApiURL}/api/owner/item/${params.slug}`,
        {
          name: inputs.name,
          price: inputs.price,
          description: inputs.description,
        }
      );
      if (res.data?.status === "success") {
        setError(null);
        setSuccess(
          res.data?.message + " Redirecting to the details page now..."
        );
        setTimeout(() => {
          router.push(`/dashboard/my-restaurants/${params.slug}/`);
        }, 3000);
      } else {
        setSuccess(null);
        setError({
          message: res.data?.message,
          error: res.data?.error,
        });
      }
    } catch (error) {
      setSuccess(null);
      setError({
        message:
          "Ops! there was a problem submitting your item. Please try again later.",
        error: "Client Error",
      });
    }
    setLoading(false);
  };
  return (
    <div className="max-w-screen-md mx-auto">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
        Add Item
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
          type="text"
          placeholder="Name"
          name="name"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          onChange={handleChange}
          className="border rounded px-2 py-3 w-full"
          type="text"
          placeholder="Price (Ex: 5.55)"
          name="price"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <textarea
          onChange={handleChange}
          className="border rounded px-2 py-3 w-full resize-none"
          placeholder="Description"
          name="description"
          rows={4}
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
          "Save Changes"
        )}
      </button>
    </div>
  );
}
