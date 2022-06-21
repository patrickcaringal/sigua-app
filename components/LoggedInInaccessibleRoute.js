import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";

const LoggedInInaccessibleRoute = ({ children }) => {
  const { userSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userSession) {
      const isAdmin = userSession?.email;

      if (isAdmin) {
        router.push("/admin/dashboard");
        return;
      }
      router.push("/dashboard");
    }
  }, [router, userSession]);

  return <>{!userSession ? children : null}</>;
};

export default LoggedInInaccessibleRoute;
