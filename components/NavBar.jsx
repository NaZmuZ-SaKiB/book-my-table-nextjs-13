"use client";

import Link from "next/link";
import { useContext } from "react";

import useAuth from "@/hooks/useAuth";
import { AuthenticationContext } from "@/context/AuthContext";
import AuthModel from "./AuthModal";

export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  return (
    <>
      <nav className="bg-white fixed left-0 right-0 z-50 p-1 md:p-2 flex items-center justify-center sm:justify-between border-b">
        <Link href="/" className="font-bold text-gray-700 text-xl md:text-2xl">
          BookMyTable
        </Link>
        <div className="hidden sm:block">
          <div className="flex items-center">
            {!loading && data ? (
              <>
                <Link
                  href="/dashboard/my-account"
                  className="bg-blue-400 text-sm md:text-reg text-white border py-1 px-4 rounded mr-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signout}
                  className="bg-white text-sm md:text-reg text-blue-400 border border-blue-400 p-1 px-4 rounded"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <AuthModel isSignin={true} />
                <AuthModel isSignin={false} />
              </>
            )}
          </div>
        </div>
      </nav>
      <nav className="grid grid-cols-3 sm:hidden fixed z-50 bottom-0 left-0 right-0 bg-white  border-t">
        {!loading && data ? (
          <>
            <Link
              href="/dashboard/my-account"
              className="bg-white text-center text-sm text-blue-400  p-1 px-4 border-r border-l"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="bg-white text-center text-sm text-blue-400  p-1 px-4 border-r border-l"
            >
              Home
            </Link>
            <button
              onClick={signout}
              className="bg-white text-blue-400 text-sm  p-1 px-4 border-r border-l"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <AuthModel isSignin={true} />
            <Link
              href="/"
              className="bg-white text-center text-sm text-blue-400  p-1 px-4 border-r border-l"
            >
              Home
            </Link>
            <AuthModel isSignin={false} />
          </>
        )}
      </nav>
    </>
  );
}
