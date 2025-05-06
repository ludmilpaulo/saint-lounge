"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const auth_user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setLoading(true);
    const token = auth_user?.token;
    if (!token) {
      router.push("/Login");
      return;
    }
  }, [router]);


  return (
    <div>
      {" "}
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>
      </Transition>
    </div>
  );
};

export default Page;