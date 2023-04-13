"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  return (
    <div className="text-left text-lg py-3 m-auto flex flex-col md:flex-row items-center justify-center">
      <input
        className="rounded p-2 w-full sm:w-[90%] md:w-[500px] mb-2 md:mb-0 md:mr-3"
        type="text"
        placeholder="State, city or town"
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        onClick={() => {
          location && router.push(`/search?city=${location}`);
        }}
        className="rounded bg-red-600 px-9 py-2 text-white max-w-[200px]"
      >
        {"Let's go"}
      </button>
    </div>
  );
}
