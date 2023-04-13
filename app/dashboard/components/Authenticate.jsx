"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";

import { AuthenticationContext } from "@/context/AuthContext";

export default function Authenticate() {
  const router = useRouter();
  const { data } = useContext(AuthenticationContext);
  if (!data) {
    router.push("/");
  }
  return <></>;
}
