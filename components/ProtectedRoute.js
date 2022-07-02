import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      if (router.pathname.includes("/doctor")) {
        router.push("/doctor/signin");
        return;
      }

      router.push("/");
    }
  }, [router, isLoggedIn]);

  return <>{isLoggedIn ? children : null}</>;
};

export default ProtectedRoute;
