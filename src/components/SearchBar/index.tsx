"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SearchBar() {
  const [name, setName] = useState("");
    const router = useRouter();
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      if(name.trim()==="")return;
      router.push(`/weather/${encodeURIComponent(name.trim().toLowerCase())}`);
    }
  return (
    <>
      <div className="lg:hidden bg-background-grey rounded-xl flex w-full h-12.5 pl-3 items-center">
        <form  onSubmit={handleSubmit}className="w-full" method="post">
          <div className="flex-1 flex items-center gap-2.5">
            <button type="submit">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="#B0BEC5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="#B0BEC5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              id="main_search"
              className="text-textColor text-xl bg-none border-0 w-[95%] placeholder:text-textColor"
              type="text"
              placeholder="Rechercher une ville"
              value={name}
              onChange={(i)=>{setName(i.target.value)}}
            />
          </div>
        </form>
      </div>
    </>
  );
}
