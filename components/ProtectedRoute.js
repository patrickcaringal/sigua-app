import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userSession) {
      router.push("/");
    }
  }, [router, userSession]);

  return <>{userSession ? children : null}</>;
};

export default ProtectedRoute;
