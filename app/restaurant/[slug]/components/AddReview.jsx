/* eslint-disable no-undef */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

import { AuthenticationContext } from "@/context/AuthContext";
import axios from "axios";

export default function AddReview({ id }) {
  const { data: user } = useContext(AuthenticationContext);
  console.log(user);

  const [rating, setRating] = useState(3);
  const [text, setText] = useState("");
  const inputRef = useRef();
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (text) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [text]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.baseApiURL}/api/review`, {
        rating,
        text,
        restaurant_id: id,
      });

      if (res.data?.status === "success") {
        setError(null);
        setSuccess(res.data?.message);
        inputRef.current.value = "";
        setDisabled(true);
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
        message: "Ops there was a problem submitting your review.",
        error: "Client Error",
      });
    }
    setLoading(false);
  };
  return (
    <div>
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
      <p className="font-bold mb-3">Leave a Rating</p>
      <div className="flex items-center">
        <Rating
          name="half-rating"
          onChange={(e, value) => setRating(value)}
          defaultValue={3}
          precision={0.5}
        />
        <span className="ml-2">({rating || 0})</span>
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          className="border rounded px-2 py-3 w-full"
          type="text"
          placeholder="Comment"
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
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
          "Submit Review"
        )}
      </button>
    </div>
  );
}
