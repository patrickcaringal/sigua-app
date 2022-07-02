import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const LoggedInInaccessibleRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      if (router.pathname.includes("/doctor")) {
        router.push("/doctor/dashboard");
        return;
      }

      router.push("/dashboard");
    }
  }, [router, isLoggedIn]);

  return <>{!isLoggedIn ? children : null}</>;
};

export default LoggedInInaccessibleRoute;
