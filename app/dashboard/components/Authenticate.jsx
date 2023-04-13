"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";

import { AuthenticationContext } from "@/context/AuthContext";

export default function Authenticate() {
  const router = useRouter();
  const { data, loading } = useContext(AuthenticationContext);
  if (loading) {
    return <></>;
  } else {
    if (!data) {
      return router.push("/");
    }
  }

  return <></>;
}
