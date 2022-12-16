import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { PATHS, getRoleRoutes } from "../components/common/Routes";
import { useAuth } from "../contexts/AuthContext";

const LoggedInInaccessibleRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      if (router.pathname.includes("/doctor")) {
        router.push(PATHS.DOCTOR.DASHBOARD);
        return;
      }

      if (router.pathname.includes("/staff")) {
        router.push(PATHS.STAFF.QUEUE_TODAY);
        return;
      }

      router.push(PATHS.PATIENT.DASHBOARD);
    }
  }, [router, isLoggedIn]);

  return <>{!isLoggedIn ? children : null}</>;
};

export default LoggedInInaccessibleRoute;
