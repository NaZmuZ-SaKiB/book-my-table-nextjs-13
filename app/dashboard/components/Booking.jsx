/* eslint-disable no-undef */
"use client";

import axios from "axios";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { convertToDisplayTime } from "@/utils/convertToDisplayTime";

export default function Booking({ booking, setSuccess, setError, setRefresh }) {
  const [day, time] = booking.booking_time.split("T");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = async (id) => {
    handleClose();
    setLoading(true);
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/booking/${id}`
    );
    if (res.data?.status === "success") {
      setSuccess(res.data?.message);
      setRefresh((prev) => prev + 1);
    } else {
      setError({ message: res.data?.message, error: res.data?.error });
    }
    setLoading(false);
  };

  return (
    <>
      <tr className="text-center h-12">
        <td className="px-1 text-sm text-gray-700">
          {booking.restaurant.name}
        </td>
        <td className="px-1 text-sm text-gray-700">
          {day} | {convertToDisplayTime(time)}
        </td>
        <td className="px-1 text-sm text-gray-700">
          {booking.number_of_people}
        </td>
        <td className="text-sm text-gray-700">
          {loading ? (
            <CircularProgress size={30} color="error" />
          ) : (
            <button
              disabled={loading}
              onClick={handleClickOpen}
              className="p-1 px-2 border border-red-600 rounded-md text-red-600 text-sm hover:bg-red-600 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="text-red-600" id="alert-dialog-title">
          Warning !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to cancel your booking ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="border-t">
          <button
            className="py-1 px-5 border border-gray-600 rounded-md text-gray-600 text-sm hover:bg-gray-600 hover:text-white cursor-pointer"
            onClick={handleClose}
          >
            No
          </button>
          <button
            className="py-1 px-5 border border-red-600 bg-red-600 rounded-md text-white text-sm hover:bg-red-800 cursor-pointer"
            autoFocus={true}
            onClick={() => handleClick(booking.id)}
          >
            Yes
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
