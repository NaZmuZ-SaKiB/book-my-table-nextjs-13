/* eslint-disable no-undef */
"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";

import { times } from "@/data";
import Menus from "../../components/Menus";

export default function Restaurant({ params }) {
  const [data, setData] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [images, setImages] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (
      data &&
      (inputs?.name !== data.name ||
        inputs?.main_image !== data.main_image ||
        inputs?.description !== data.description ||
        inputs?.open_time !== data.open_time ||
        inputs?.close_time !== data.close_time ||
        inputs?.price !== data.price ||
        JSON.stringify(images) !== JSON.stringify(data.images)) &&
      inputs?.open_time !== inputs?.close_time
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs, images]);

  const fetchRestaurantBySlug = async () => {
    setDataLoading(true);
    const res = await axios.get(
      `http://localhost:3000/api/owner/restaurant/${params.slug}`
    );
    if (res.data.status === "success") {
      setError(null);
      setData(res.data?.data);
    } else {
      setData(null);
      setSuccess(null);
      setError({
        message: res.data?.message,
        error: res.data?.error,
      });
    }
    setDataLoading(false);
  };

  useEffect(() => {
    if (data) {
      setInputs({
        name: data.name,
        main_image: data.main_image,
        description: data.description,
        open_time: data.open_time,
        close_time: data.close_time,
        price: data.price,
      });
      setImages(data.images);
    }
  }, [data]);

  useEffect(() => {
    fetchRestaurantBySlug();
  }, []);

  // Images Array Related Code
  const imageRef = useRef("");
  const addImage = () => {
    setImages([...images, imageRef.current.value]);
    imageRef.current.value = "";
  };
  const deleteImage = (imageToDelete) => {
    const newImages = images.filter((image) => image !== imageToDelete);
    setImages(newImages);
  };

  // Handle Inputs
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleClick = async () => {
    setBtnLoading(true);
    try {
      const res = await axios.patch(
        `${process.env.baseApiURL}/api/owner/restaurant/${params.slug}`,
        { ...inputs, images }
      );
      if (res.data?.status === "success") {
        setError(null);
        fetchRestaurantBySlug();
        setSuccess(res.data?.message);
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
          "Ops there was a problem updating your restaurant. Please try again.",
        error: "Client Error",
      });
    }
    setBtnLoading(false);
  };

  if (dataLoading) {
    return (
      <div className="w-full flex justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }
  return (
    <div className="max-w-screen-md mx-auto">
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
      {data ? (
        <>
          <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
            Restaurant Details
          </h2>
          <div className="my-3 flex justify-between text-sm">
            <input
              onChange={handleChange}
              className="border rounded px-2 py-3 w-full"
              type="text"
              placeholder="Name"
              name="name"
              defaultValue={data.name}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <textarea
              onChange={handleChange}
              className="border rounded px-2 py-3 w-full resize-none"
              placeholder="Description"
              name="description"
              rows={4}
              defaultValue={data.description}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              onChange={handleChange}
              className="border rounded px-2 py-3 w-full"
              type="text"
              placeholder="Main Image URL"
              name="main_image"
              defaultValue={data.main_image}
            />
          </div>
          <div className="my-3 flex flex-col justify-between text-sm">
            <p className="font-medium text-reg">Gallery Images</p>
            <div className="flex flex-wrap">
              {images.map((image, i) => (
                <div key={image} className="flex flex-col items-center mx-2">
                  <img src={image} alt="gallary" className="w-16" />
                  <span
                    onClick={() => deleteImage(image)}
                    className="text-red-500 cursor-pointer"
                  >
                    Delete
                  </span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                className="border rounded px-2 py-3 w-full"
                type="text"
                placeholder="Image URL"
                ref={imageRef}
              />
              <button
                onClick={addImage}
                className="ml-2 py-2 px-6 bg-blue-500 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
          <div className="my-3 flex flex-wrap items-center text-sm">
            <div className="mr-6">
              <label className="mr-3 font-medium">Open Time: </label>
              <select
                name="open_time"
                defaultValue={data.open_time}
                onChange={handleChange}
                className="py-3 border-b font-light"
              >
                {times.map((time) => (
                  <option key={time.time} value={time.time}>
                    {time.displayTime}
                  </option>
                ))}
              </select>
            </div>
            <div className="mr-6">
              <label className="mr-3 font-medium">Close Time : </label>
              <select
                name="close_time"
                defaultValue={data.close_time}
                onChange={handleChange}
                className="py-3 border-b font-light"
              >
                {times.map((time) => (
                  <option key={time.displayTime} value={time.time}>
                    {time.displayTime}
                  </option>
                ))}
              </select>
            </div>
            <div className="mr-6">
              <label className="mr-3 font-medium">Price : </label>
              <select
                name="price"
                onChange={handleChange}
                className="py-3 border-b font-light"
                defaultValue={data.price}
              >
                <option value="REGULAR">REGULAR</option>
                <option value="CHEAP">CHEAP</option>
                <option value="EXPENSIVE">EXPENSIVE</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleClick}
            disabled={disabled || btnLoading}
            className="bg-blue-500 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-200"
          >
            {btnLoading ? (
              <CircularProgress size={30} color="primary" />
            ) : (
              "Save Changes"
            )}
          </button>
          <Menus items={data.items} slug={params.slug} />
        </>
      ) : (
        <h2 className="text-center text-3xl font-bold text-red-600">
          No Restaurant Found!
        </h2>
      )}
    </div>
  );
}
